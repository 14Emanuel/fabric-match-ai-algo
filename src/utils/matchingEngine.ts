import { Garment, UserPreferenceProfile, MatchEvaluation, CriterionMatch } from '../types';

export function evaluateGarmentMatch(
  garment: Garment,
  profile: UserPreferenceProfile
): MatchEvaluation {
  const hardViolations: string[] = [];
  const criteria: CriterionMatch[] = [];

  // 1. Check Restricted Fibers (Hard Constraint)
  const presentRestrictedFibers: string[] = [];
  for (const [fiber, percentage] of Object.entries(garment.fabric.fiberComposition)) {
    if (percentage > 0) {
      const lowerFiber = fiber.toLowerCase();
      for (const restricted of profile.restrictedFibers) {
        if (lowerFiber.includes(restricted.toLowerCase())) {
          presentRestrictedFibers.push(`${percentage}% ${fiber}`);
        }
      }
    }
  }

  if (presentRestrictedFibers.length > 0) {
    hardViolations.push(
      `Contains restricted fiber: ${presentRestrictedFibers.join(', ')} (violates allergen/sensitivity preference)`
    );
  }

  // 2. Check Care Method (Hard Constraint)
  if (!profile.allowedCare.includes(garment.fabric.careType)) {
    const formattedCare = garment.fabric.careType.replace(/_/g, ' ');
    hardViolations.push(`Care method "${formattedCare}" violates maintenance requirement`);
  }

  // --- Score Sub-Criteria ---

  // A. Fiber Composition Score
  let fiberScore = 100;
  let fiberDetail = 'Composition aligns well with your preferences.';
  if (presentRestrictedFibers.length > 0) {
    fiberScore = 15;
    fiberDetail = `Contains ${presentRestrictedFibers.join(', ')} which you strictly avoid.`;
  } else if (profile.preferNaturalFibers) {
    if (garment.fabric.fiberCategory === 'natural') {
      fiberScore = 100;
      fiberDetail = '100% natural fiber content matching your preference.';
    } else if (garment.fabric.fiberCategory === 'semi-synthetic') {
      fiberScore = 80;
      fiberDetail = 'Plant-based cellulosic fiber (breathable and skin-gentle).';
    } else {
      fiberScore = 35;
      fiberDetail = 'Synthetic fiber content; may retain heat and odor.';
    }
  }

  criteria.push({
    criterion: 'Fiber & Material',
    score: fiberScore,
    weight: profile.importanceWeights.fiberComposition,
    userRequirement: profile.preferNaturalFibers ? 'Natural / Skin-safe' : 'Any safe fiber',
    garmentActual: Object.entries(garment.fabric.fiberComposition)
      .map(([f, p]) => `${p}% ${f}`)
      .join(', '),
    status: fiberScore >= 75 ? 'pass' : fiberScore >= 50 ? 'warning' : 'fail',
    detail: fiberDetail,
  });

  // B. Breathability Score
  let breathabilityScore = 100;
  const breathabilityDiff = garment.fabric.breathability - profile.minBreathability;
  if (breathabilityDiff >= 0) {
    breathabilityScore = 100;
  } else {
    breathabilityScore = Math.max(10, 100 + breathabilityDiff * 25);
  }

  criteria.push({
    criterion: 'Breathability & Heat',
    score: breathabilityScore,
    weight: profile.importanceWeights.breathability,
    userRequirement: `Min ${profile.minBreathability}/10 airflow rating`,
    garmentActual: `${garment.fabric.breathability}/10 (${garment.fabric.weightCategory} ${garment.fabric.weaveType})`,
    status: breathabilityScore >= 80 ? 'pass' : breathabilityScore >= 55 ? 'warning' : 'fail',
    detail:
      breathabilityScore >= 80
        ? 'High thermal comfort; well-ventilated weave allows heat dispersal.'
        : 'Low breathability; high risk of sweat trapping in warm or humid climates.',
  });

  // C. Opacity & Sheerness Score
  let opacityScore = 100;
  const opacityDiff = garment.fabric.opacityScore - profile.minOpacity;
  if (opacityDiff >= 0) {
    opacityScore = 100;
  } else {
    opacityScore = Math.max(5, 100 + opacityDiff * 30);
  }

  // If unlined and opacity < 7, penalize further
  if (garment.fabric.lining === 'none' && garment.fabric.opacityScore < 7) {
    opacityScore = Math.max(5, opacityScore - 15);
  }

  criteria.push({
    criterion: 'Opacity & Sheerness',
    score: opacityScore,
    weight: profile.importanceWeights.opacity,
    userRequirement: `Min ${profile.minOpacity}/10 opacity (zero see-through)`,
    garmentActual: `${garment.fabric.opacityScore}/10 (${garment.fabric.sheernessDescription})`,
    status: opacityScore >= 80 ? 'pass' : opacityScore >= 60 ? 'warning' : 'fail',
    detail:
      opacityScore >= 80
        ? 'Fully daylight-tested opaque. Zero detective work or under-slip needed.'
        : `Sheerness risk: ${garment.fabric.sheernessDescription}`,
  });

  // D. Lining Coverage Score
  let liningScore = 100;
  if (profile.requireLining === 'fully_lined') {
    if (garment.fabric.lining === 'fully_lined') liningScore = 100;
    else if (garment.fabric.lining === 'half_lined') liningScore = 60;
    else if (garment.fabric.lining === 'bodice_only') liningScore = 40;
    else liningScore = 15;
  } else if (profile.requireLining === 'partial_or_full') {
    if (['fully_lined', 'half_lined'].includes(garment.fabric.lining)) liningScore = 100;
    else if (garment.fabric.lining === 'bodice_only') liningScore = 75;
    else liningScore = 30;
  } else {
    liningScore = 100;
  }

  criteria.push({
    criterion: 'Lining & Construction',
    score: liningScore,
    weight: profile.importanceWeights.lining,
    userRequirement:
      profile.requireLining === 'fully_lined'
        ? 'Must be fully lined'
        : profile.requireLining === 'partial_or_full'
        ? 'Lining preferred'
        : 'Any lining status',
    garmentActual: `${garment.fabric.lining.replace(/_/g, ' ')} (${garment.fabric.liningMaterial || 'None'})`,
    status: liningScore >= 80 ? 'pass' : liningScore >= 50 ? 'warning' : 'fail',
    detail:
      liningScore >= 80
        ? 'Lining meets or exceeds required coverage specification.'
        : 'Inadequate interior lining coverage for desired comfort level.',
  });

  // E. Stretch & Elasticity Score
  const stretchRanks: Record<string, number> = {
    none: 0,
    mechanical: 1,
    medium: 2,
    high: 3,
  };
  const requiredStretchRank = stretchRanks[profile.minStretch] || 0;
  const actualStretchRank = stretchRanks[garment.fabric.stretchLevel] || 0;

  let stretchScore = 100;
  if (actualStretchRank >= requiredStretchRank) {
    stretchScore = 100;
  } else {
    stretchScore = Math.max(20, 100 - (requiredStretchRank - actualStretchRank) * 40);
  }

  criteria.push({
    criterion: 'Stretch & Mobility',
    score: stretchScore,
    weight: profile.importanceWeights.stretch,
    userRequirement: `Min ${profile.minStretch} stretch level`,
    garmentActual: `${garment.fabric.stretchLevel} (${garment.fabric.stretchPercent}% elasticity)`,
    status: stretchScore >= 80 ? 'pass' : stretchScore >= 50 ? 'warning' : 'fail',
    detail:
      stretchScore >= 80
        ? 'Sufficient physical ease and elasticity for comfort.'
        : 'Rigid woven material lacking desired stretch.',
  });

  // F. Care & Maintenance Score
  const isCareAllowed = profile.allowedCare.includes(garment.fabric.careType);
  const careScore = isCareAllowed ? 100 : 15;

  criteria.push({
    criterion: 'Care & Maintenance',
    score: careScore,
    weight: profile.importanceWeights.care,
    userRequirement: profile.allowedCare.map((c) => c.replace(/_/g, ' ')).join(' or '),
    garmentActual: garment.fabric.careType.replace(/_/g, ' '),
    status: isCareAllowed ? 'pass' : 'fail',
    detail: isCareAllowed
      ? 'Care method conforms directly to your maintenance routine.'
      : 'Violates non-negotiable laundry maintenance routine.',
  });

  // 3. Compute Weighted Total Score
  let totalWeight = 0;
  let weightedSum = 0;

  for (const c of criteria) {
    weightedSum += c.score * c.weight;
    totalWeight += c.weight;
  }

  let finalScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 70;

  // Apply hard penalty deduction while maintaining a continuous spectrum (20% - 99%)
  if (hardViolations.length > 0) {
    // Scales dynamically with violation count and weighted score
    const penaltyFactor = hardViolations.length >= 2 ? 0.38 : 0.52;
    finalScore = Math.max(20, Math.min(finalScore, Math.round(weightedSum / totalWeight * penaltyFactor)));
  }

  // Cap at 99% for maximum realistic variance (or 100% for absolute pristine match)
  if (finalScore >= 98 && (garment.fabric.stretchPercent === 0 || garment.fabric.opacityScore < 10)) {
    finalScore = 96;
  }

  // 4. Grade and Verdict assignment
  let grade: MatchEvaluation['grade'];
  if (hardViolations.length > 0 && finalScore < 40) {
    grade = 'Incompatible';
  } else if (finalScore >= 88) {
    grade = 'Perfect Match';
  } else if (finalScore >= 72) {
    grade = 'Good Fit';
  } else if (finalScore >= 50) {
    grade = 'Borderline';
  } else {
    grade = 'Not Recommended';
  }

  // 5. Generate Transparency Badge & Verdict Reason
  let transparencyBadge = '';
  let verdictReason = '';

  if (grade === 'Perfect Match') {
    transparencyBadge = '✨ Verified Transparent & Ideal Fit';
    verdictReason = `All core fabric requirements pass with high confidence: ${garment.fabric.opacityScore}/10 opacity, ${garment.fabric.lining.replace(/_/g, ' ')}, and verified ${garment.fabric.careType.replace(/_/g, ' ')}.`;
  } else if (grade === 'Good Fit') {
    transparencyBadge = '👍 Strong Compatibility';
    verdictReason = `Minor tradeoffs in ${criteria.find((c) => c.status === 'warning')?.criterion.toLowerCase() || 'secondary specs'}, but adheres to your core safety and comfort filters.`;
  } else if (grade === 'Borderline') {
    transparencyBadge = '⚠️ Trade-offs Present';
    verdictReason = `Contains noticeable gaps in ${criteria.filter((c) => c.status !== 'pass').map((c) => c.criterion).join(', ')}. May require an under-slip or extra care.`;
  } else if (hardViolations.length > 0) {
    transparencyBadge = '⛔ Hard Constraint Conflict';
    verdictReason = hardViolations[0];
  } else {
    transparencyBadge = '❌ Poor Compatibility';
    verdictReason = 'Substantial divergence from your fabric weight, breathability, or opacity standards.';
  }

  return {
    garmentId: garment.id,
    totalScore: finalScore,
    grade,
    hardViolations,
    criteria,
    transparencyBadge,
    verdictReason,
  };
}
