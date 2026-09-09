import React, { useState, useMemo } from 'react';
import { UserPreferenceProfile, Garment, MatchEvaluation } from './types';
import { SAMPLE_PERSONAS } from './data/samplePersonas';
import { evaluateGarmentMatch } from './utils/matchingEngine';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RotateCw,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Check,
} from 'lucide-react';

interface PresetDress {
  id: string;
  title: string;
  price: number;
  brand: string;
  summaryBadge: string;
  frontImage: string;
  backImage: string;
  fabricImage: string;
  lengthDetails: string;
  mobilityDetails: string;
  description: string;
  fabric: {
    fiberComposition: Record<string, number>;
    fiberCategory: 'natural' | 'synthetic' | 'blend' | 'semi-synthetic';
    weightGsm: number;
    weightCategory: 'lightweight' | 'midweight' | 'heavyweight';
    weaveType: string;
    opacityScore: number;
    sheernessDescription: string;
    lining: 'none' | 'bodice_only' | 'half_lined' | 'fully_lined';
    liningMaterial?: string;
    stretchLevel: 'none' | 'mechanical' | 'medium' | 'high';
    stretchPercent: number;
    breathability: number;
    careType: 'machine_washable' | 'hand_wash' | 'dry_clean_only';
    wrinkleResistance: 'low' | 'moderate' | 'high';
  };
}

const PRESET_DRESSES: PresetDress[] = [
  {
    id: 'san-francisco-maxi-dress-ivory',
    title: 'San Francisco Lace Ruffle Maxi Dress',
    brand: 'Over The Sea',
    price: 165,
    summaryBadge: '100% Cotton • Fully Lined • Tiered Bohemian',
    frontImage: 'https://cdn.shopify.com/s/files/1/0797/9145/6583/files/san-francisco-dress-maxi-ivory-front-01.jpg',
    backImage: 'https://cdn.shopify.com/s/files/1/0797/9145/6583/files/san-francisco-dress-maxi-ivory-back-01.jpg',
    fabricImage: 'https://cdn.shopify.com/s/files/1/0797/9145/6583/files/san-francisco-dress-maxi-ivory-side-01.jpg',
    lengthDetails: 'Maxi length (51" from shoulder). Hits ankle length on 5\'7" model. Covered bra-friendly rear lace bodice.',
    mobilityDetails: 'A-line tiered silhouette allows free walking stride and comfortable sitting without tension.',
    description:
      'Romantic Victorian-inspired maxi dress in ivory cotton batiste. Features delicate lace ruffles along neckline and tiers, covered back bodice with neat mother-of-pearl buttons, and full breathable cotton lining.',
    fabric: {
      fiberComposition: { 'cotton batiste': 100 },
      fiberCategory: 'natural',
      weightGsm: 170,
      weightCategory: 'midweight',
      weaveType: 'Cotton Batiste & Lace',
      opacityScore: 10,
      sheernessDescription: '100% opaque throughout body. Delicate lace trims maintain full modesty with opaque lining.',
      lining: 'fully_lined',
      liningMaterial: '100% Soft Cotton Voile',
      stretchLevel: 'mechanical',
      stretchPercent: 2,
      breathability: 10,
      careType: 'machine_washable',
      wrinkleResistance: 'moderate',
    },
  },
  {
    id: 'ocean-of-tenderness-maxi-dress-mermaid-green',
    title: 'Ocean Of Tenderness Baroque Maxi Dress',
    brand: 'Over The Sea',
    price: 185,
    summaryBadge: 'Mermaid Green • Tie-Back Detail • Flowing Boho',
    frontImage: 'https://cdn.shopify.com/s/files/1/0797/9145/6583/files/ocean-of-tenderness-dress-mermaid-green-front.jpg',
    backImage: 'https://cdn.shopify.com/s/files/1/0797/9145/6583/files/ocean-of-tenderness-dress-mermaid-green-back.jpg',
    fabricImage: 'https://cdn.shopify.com/s/files/1/0797/9145/6583/files/ocean-of-tenderness-dress-mermaid-green-front-details.jpg',
    lengthDetails: 'Floor-sweeping maxi length (53"). Open upper back with adjustable tie closure.',
    mobilityDetails: 'Expansive tiered skirt with wide hem circumference allows uninhibited stride and effortless sitting.',
    description:
      'Dramatic baroque maxi dress in rich mermaid green. Features long poet sleeves with elastic cuffs, deep square neckline, adjustable rear tie closure showing upper back, and flowing bohemian volume.',
    fabric: {
      fiberComposition: { viscose: 70, cotton: 30 },
      fiberCategory: 'blend',
      weightGsm: 145,
      weightCategory: 'midweight',
      weaveType: 'Baroque Jacquard Weave',
      opacityScore: 8,
      sheernessDescription: 'Dense weave with high daylight opacity. Rear tie allows customizable fit across back and shoulders.',
      lining: 'half_lined',
      liningMaterial: 'Tonal Breathable Cotton',
      stretchLevel: 'mechanical',
      stretchPercent: 3,
      breathability: 8,
      careType: 'hand_wash',
      wrinkleResistance: 'high',
    },
  },
  {
    id: 'california-dress-milky-white',
    title: 'California Bohemian Lace Train Dress',
    brand: 'Over The Sea',
    price: 145,
    summaryBadge: 'High-Low Silhouette • Lace Train • Sheer Accents',
    frontImage: 'https://cdn.shopify.com/s/files/1/0797/9145/6583/files/california-dress-milky-white-front.jpg',
    backImage: 'https://cdn.shopify.com/s/files/1/0797/9145/6583/files/california-dress-milky-white-back.jpg',
    fabricImage: 'https://cdn.shopify.com/s/files/1/0797/9145/6583/files/california-dress-milky-white-side-01.jpg',
    lengthDetails: 'High-low cut (34" front mini length, 48" back train). Low back lace yoke.',
    mobilityDetails: 'Elevated front hem prevents tripping when walking upstairs; flowing train creates dramatic motion.',
    description:
      'Breezy bohemian day-to-evening dress in milky white cotton lace. Features tiered ruffled hem with sweeping rear train, partially sheer lace back yoke, and deep V-neckline.',
    fabric: {
      fiberComposition: { cotton: 85, nylon: 15 },
      fiberCategory: 'blend',
      weightGsm: 120,
      weightCategory: 'lightweight',
      weaveType: 'Cotton Lace & Batiste',
      opacityScore: 5,
      sheernessDescription: 'Semi-sheer in sunlight. Bodice is lined but back lace yoke and lower hem train let light pass through.',
      lining: 'bodice_only',
      liningMaterial: 'Cotton Voile Bodice',
      stretchLevel: 'mechanical',
      stretchPercent: 2,
      breathability: 9,
      careType: 'hand_wash',
      wrinkleResistance: 'moderate',
    },
  },
];

export default function App() {
  const [selectedDress, setSelectedDress] = useState<PresetDress>(PRESET_DRESSES[0]);
  const [selectedShopper, setSelectedShopper] = useState<UserPreferenceProfile>(SAMPLE_PERSONAS[0]);
  const [activePhotoView, setActivePhotoView] = useState<'front' | 'back' | 'fabric'>('front');

  // Custom text input toggle
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customText, setCustomText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Match Fit Assessment State (starts blank by default until user clicks Run Match Fit)
  const [hasRunAssessment, setHasRunAssessment] = useState(false);
  const [isRunningMatch, setIsRunningMatch] = useState(false);
  const [loadingStepText, setLoadingStepText] = useState('');

  // Evaluate the match
  const evaluation: MatchEvaluation = useMemo(() => {
    const garmentObj: Garment = {
      id: selectedDress.id,
      title: selectedDress.title,
      brand: selectedDress.brand,
      price: selectedDress.price,
      category: 'Dress',
      imageUrl: selectedDress.frontImage,
      backImageUrl: selectedDress.backImage,
      fabricDetailImageUrl: selectedDress.fabricImage,
      lengthDetails: selectedDress.lengthDetails,
      mobilityDetails: selectedDress.mobilityDetails,
      description: selectedDress.description,
      fabric: selectedDress.fabric,
      constructionHighlights: [],
    };
    return evaluateGarmentMatch(garmentObj, selectedShopper);
  }, [selectedDress, selectedShopper]);

  // Trigger 3-second simulated assessment calculation
  const handleRunMatchFit = () => {
    setIsRunningMatch(true);
    setLoadingStepText('Analyzing fiber composition & daylight opacity index...');

    // Scroll to results or keep in view
    setTimeout(() => {
      const el = document.getElementById('results-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    // Step 2 after 1 second
    setTimeout(() => {
      setLoadingStepText(`Matching against ${selectedShopper.name}'s skin sensitivities & mobility rules...`);
    }, 1000);

    // Step 3 after 2 seconds
    setTimeout(() => {
      setLoadingStepText('Evaluating lining coverage, care requirements & honest verdict...');
    }, 2000);

    // Complete after 3 seconds
    setTimeout(() => {
      setIsRunningMatch(false);
      setHasRunAssessment(true);
      setLoadingStepText('');
    }, 3000);
  };

  // Handle custom description submission
  const handleAnalyzeCustom = async () => {
    if (!customText.trim()) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/extract-fabric', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productText: customText }),
      });
      if (res.ok) {
        const data = await res.json();
        const newDress: PresetDress = {
          id: `custom-${Date.now()}`,
          title: data.title || 'Analyzed Garment',
          brand: 'Your Pasted Store Item',
          price: 95,
          summaryBadge: `${data.fiberCategory || 'Fabric'} • ${data.lining || 'Lining evaluated'}`,
          frontImage: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=80',
          backImage: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80',
          fabricImage: 'https://images.unsplash.com/photo-1528458876861-544fd1761a91?auto=format&fit=crop&w=900&q=80',
          lengthDetails: 'Length extracted from product text or standard sizing.',
          mobilityDetails: 'Mobility analyzed based on fabric stretch and silhouette.',
          description: customText,
          fabric: {
            fiberComposition: data.fiberComposition || { cotton: 100 },
            fiberCategory: data.fiberCategory || 'natural',
            weightGsm: data.weightGsm || 180,
            weightCategory: data.weightCategory || 'midweight',
            weaveType: data.weaveType || 'Woven',
            opacityScore: data.opacityScore ?? 8,
            sheernessDescription: data.sheernessDescription || 'Evaluated for sunlight opacity.',
            lining: data.lining || 'none',
            liningMaterial: data.liningMaterial,
            stretchLevel: data.stretchLevel || 'none',
            stretchPercent: data.stretchPercent ?? 0,
            breathability: data.breathability ?? 8,
            careType: data.careType || 'machine_washable',
            wrinkleResistance: data.wrinkleResistance || 'moderate',
          },
        };
        setSelectedDress(newDress);
        setIsCustomMode(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const currentPhoto =
    activePhotoView === 'front'
      ? selectedDress.frontImage
      : activePhotoView === 'back'
      ? selectedDress.backImage
      : selectedDress.fabricImage;

  const isViolation = evaluation.grade === 'Incompatible';

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 font-sans antialiased selection:bg-amber-100 selection:text-amber-900">
      {/* Top Friendly Header */}
      <header className="border-b border-stone-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-700 text-white flex items-center justify-center font-serif font-bold text-lg shadow-xs">
              F
            </div>
            <div>
              <h1 className="text-base font-serif font-bold text-stone-900 leading-tight">
                No Detective Work
              </h1>
              <p className="text-xs text-stone-600">
                Fashion Transparency & Real-Life Fabric Checker
              </p>
            </div>
          </div>

          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200/70">
            Inspired by LinkedIn Fashion Transparency Movement
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* The "Why We Made This" Mission Statement */}
        <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-7 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight">
            "A woman should not have to do detective work before buying a dress."
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed mt-2 max-w-3xl">
            We’ve all zoomed into photos wondering if a skirt is see-through, looked desperately for
            a back view that brands hid, or searched descriptions only to find fluff like <em>"stunning"</em> and{' '}
            <em>"perfect for every occasion."</em> This tool answers the <strong>4 questions women actually care about</strong> before buying.
          </p>
        </section>

        {/* STEP 1: Select a Dress or Paste Description */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
              Step 1: Choose a dress to test
            </span>
            <button
              onClick={() => setIsCustomMode(!isCustomMode)}
              className="text-xs font-semibold text-amber-800 hover:text-amber-900 underline cursor-pointer"
            >
              {isCustomMode ? '← Pick from sample dresses' : '+ Or paste any clothing description'}
            </button>
          </div>

          {/* Sample Dress Picker */}
          {!isCustomMode ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {PRESET_DRESSES.map((dress) => {
                const isSelected = selectedDress.id === dress.id;
                return (
                  <button
                    key={dress.id}
                    onClick={() => {
                      setSelectedDress(dress);
                      setActivePhotoView('front');
                    }}
                    className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex gap-3.5 items-center ${
                      isSelected
                        ? 'bg-amber-50/60 border-amber-600 ring-2 ring-amber-600/20 shadow-xs'
                        : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800 shadow-2xs'
                    }`}
                  >
                    <img
                      src={dress.frontImage}
                      alt={dress.title}
                      className="w-16 h-20 rounded-xl object-cover shrink-0 bg-stone-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <span className="text-[11px] font-semibold text-stone-500 block uppercase tracking-wider">
                        {dress.brand}
                      </span>
                      <h3 className="font-serif font-bold text-sm text-stone-900 truncate mt-0.5">
                        {dress.title}
                      </h3>
                      <p className="text-xs text-amber-900 font-medium truncate mt-0.5">
                        {dress.summaryBadge}
                      </p>
                      <span className="text-xs text-stone-600 font-semibold block mt-1">
                        ${dress.price}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-3 shadow-xs">
              <label className="text-xs font-bold text-stone-700 block">
                Paste product details or fabric label from any online store:
              </label>
              <textarea
                rows={3}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="e.g. Strapless ivory midi dress in 100% cotton poplin with full cotton voile lining and side pockets. Machine wash cold..."
                className="w-full text-xs p-3.5 rounded-xl border border-stone-300 focus:border-amber-700 focus:outline-hidden leading-relaxed"
              />
              <button
                onClick={handleAnalyzeCustom}
                disabled={isAnalyzing || !customText.trim()}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-800 hover:bg-amber-900 text-white transition-all shadow-xs cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Fabric Details...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Analyze This Garment</span>
                  </>
                )}
              </button>
            </div>
          )}
        </section>

        {/* STEP 2: Who is shopping? (Simple Persona Toggle) */}
        <section className="space-y-3">
          <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
            Step 2: Who is shopping? (Preferences & Sensitivities)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SAMPLE_PERSONAS.map((shopper) => {
              const isSelected = selectedShopper.id === shopper.id;
              return (
                <button
                  key={shopper.id}
                  onClick={() => setSelectedShopper(shopper)}
                  className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                      : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{shopper.avatar}</span>
                      <div>
                        <h3 className={`font-semibold text-xs ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                          {shopper.name}
                        </h3>
                        <p className={`text-[11px] ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                          {shopper.personaTitle}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-amber-400 text-stone-900 flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-stone-300' : 'text-stone-600'}`}>
                    {shopper.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* NATURAL ACTION BUTTON: Placed right here where the user made selections */}
        <div className="flex justify-center pt-1 pb-1">
          <button
            onClick={handleRunMatchFit}
            disabled={isRunningMatch}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-serif font-bold text-sm bg-stone-900 text-white hover:bg-stone-800 transition-all shadow-md cursor-pointer disabled:opacity-75"
          >
            {isRunningMatch ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin text-amber-400" />
                <span>Running Match Fit Assessment...</span>
              </>
            ) : (
              <>
                <span>{hasRunAssessment ? 'Re-run Match Fit' : 'Run Match Fit'}</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </>
            )}
          </button>
        </div>

        {/* RESULTS SECTION: The 4 Questions Answered OR Empty / Loading State */}
        {isRunningMatch ? (
          /* Loading State: 3-Second Assessment Progress */
          <section
            id="results-section"
            className="bg-white border border-stone-200 rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-xs"
          >
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
              <RotateCw className="w-7 h-7 animate-spin text-amber-700" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                Algorithm Evaluation in Progress
              </span>
              <h3 className="text-xl font-serif font-bold text-stone-900">
                Running Match Fit Algorithms
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-medium min-h-6">
                {loadingStepText}
              </p>
            </div>

            {/* Visual Animated Progress Bar */}
            <div className="max-w-xs mx-auto w-full bg-stone-100 h-2 rounded-full overflow-hidden border border-stone-200">
              <div className="bg-amber-700 h-full w-full animate-pulse transition-all duration-1000" />
            </div>

            <div className="flex justify-center gap-6 text-[11px] text-stone-600 pt-2">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping" />
                Weave & Opacity Check
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping" />
                Skin & Allergy Rules
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping" />
                Mobility Verdict
              </span>
            </div>
          </section>
        ) : !hasRunAssessment ? (
          /* Blank / Default State: Prompting the user to run the assessment */
          <section
            id="results-section"
            className="bg-white border-2 border-dashed border-stone-300 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-2xs"
          >
            <div className="w-14 h-14 mx-auto rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-500">
              <Sparkles className="w-7 h-7 text-amber-700" />
            </div>
            <div className="max-w-md mx-auto space-y-1.5">
              <span className="text-xs font-bold text-stone-600 uppercase tracking-wider block">
                Honest Transparency Report
              </span>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900">
                Ready to Assess This Garment
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                No assessment has been run yet. Select a dress and shopper profile above, then click{' '}
                <strong className="text-stone-900">"Run Match Fit"</strong> to reveal daylight opacity,
                lining construction, stride mobility, and skin comfort answers.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={handleRunMatchFit}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-serif font-bold text-xs bg-stone-900 hover:bg-stone-800 text-white transition-all shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Run Match Fit Assessment</span>
              </button>
            </div>
          </section>
        ) : (
          /* Fulfilled State: Full Transparency Report */
          <section
            id="results-section"
            className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-7"
          >
            {/* Header of Report with Honest Verdict Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                  Honest Transparency Report
                </span>
                <h3 className="text-2xl font-serif font-bold text-stone-900 mt-1">
                  {selectedDress.title}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Evaluated for <strong className="text-stone-800">{selectedShopper.name}</strong> • ${selectedDress.price}
                </p>
              </div>

              {/* Verdict Badge */}
              <div className="flex items-center gap-3">
                <div
                  className={`px-4 py-2 rounded-2xl border text-sm font-bold flex items-center gap-2 shadow-2xs ${
                    isViolation
                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                      : evaluation.totalScore >= 80
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {isViolation ? (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  ) : evaluation.totalScore >= 80 ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  )}
                  <div>
                    <div>{evaluation.totalScore}% Honest Match</div>
                    <span className="text-[11px] font-normal block">
                      {isViolation ? 'Fails comfort requirements' : 'Safe to buy with confidence'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Photo Showcase: Front, Back, and Fabric Close-Up */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left: Photo with 3-Way Angle Toggle */}
              <div className="lg:col-span-5 space-y-3">
                <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
                  <img
                    src={currentPhoto}
                    alt={selectedDress.title}
                    className="w-full h-full object-cover object-center transition-all duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl text-xs font-medium text-stone-800 border border-stone-200 shadow-xs flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse"></span>
                      <span className="font-bold text-stone-900 text-xs">
                        {activePhotoView === 'front'
                          ? 'Front View • Full Silhouette'
                          : activePhotoView === 'back'
                          ? 'Back View • Exact Same Garment Rear'
                          : 'Fabric Close-Up • Weave & Construction'}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                      Same Dress
                    </span>
                  </div>
                </div>

                {/* 3 Buttons to see Front, Back, and Fabric Texture */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setActivePhotoView('front')}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer text-left flex flex-col justify-between gap-1 ${
                      activePhotoView === 'front'
                        ? 'bg-stone-900 text-white border-stone-900 shadow-sm ring-2 ring-stone-900/20'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Eye className={`w-3.5 h-3.5 ${activePhotoView === 'front' ? 'text-amber-400' : 'text-stone-500'}`} />
                      {activePhotoView === 'front' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-tight">Front View</div>
                      <div className={`text-[10px] ${activePhotoView === 'front' ? 'text-stone-300' : 'text-stone-500'}`}>
                        Silhouette
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setActivePhotoView('back')}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer text-left flex flex-col justify-between gap-1 ${
                      activePhotoView === 'back'
                        ? 'bg-stone-900 text-white border-stone-900 shadow-sm ring-2 ring-stone-900/20'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <RotateCcw className={`w-3.5 h-3.5 ${activePhotoView === 'back' ? 'text-amber-400' : 'text-stone-500'}`} />
                      {activePhotoView === 'back' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-tight">Back View</div>
                      <div className={`text-[10px] ${activePhotoView === 'back' ? 'text-stone-300' : 'text-stone-500'}`}>
                        Rear & Zipper
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setActivePhotoView('fabric')}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer text-left flex flex-col justify-between gap-1 ${
                      activePhotoView === 'fabric'
                        ? 'bg-stone-900 text-white border-stone-900 shadow-sm ring-2 ring-stone-900/20'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Search className={`w-3.5 h-3.5 ${activePhotoView === 'fabric' ? 'text-amber-400' : 'text-stone-500'}`} />
                      {activePhotoView === 'fabric' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-tight">Fabric Detail</div>
                      <div className={`text-[10px] ${activePhotoView === 'fabric' ? 'text-stone-300' : 'text-stone-500'}`}>
                        Weave Zoom
                      </div>
                    </div>
                  </button>
                </div>
                <p className="text-[11px] text-stone-600 text-center">
                  *All 3 views showcase the exact same dress from front, back, and macro textile detail.*
                </p>
              </div>

              {/* Right: The 4 Questions Answered Directly */}
              <div className="lg:col-span-7 space-y-4">
                {/* Question 1: What is the fabric made of? */}
                <div className="p-4 rounded-2xl bg-[#faf8f5] border border-stone-200/90 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                    <span className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px]">
                      1
                    </span>
                    <span>What fabric is the dress made of?</span>
                  </div>
                  <div className="pl-7 pt-1">
                    <p className="text-sm font-semibold text-stone-900">
                      {Object.entries(selectedDress.fabric.fiberComposition)
                        .map(([fiber, percent]) => `${percent}% ${fiber}`)
                        .join(', ')}{' '}
                      ({selectedDress.fabric.weaveType}, {selectedDress.fabric.weightGsm} GSM)
                    </p>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {selectedDress.fabric.fiberCategory === 'natural'
                        ? '🌿 100% natural, breathable fibers. Gentle against eczema or sensitive skin and will not trap sweat.'
                        : '⚠️ Synthetic polyester fabric. May feel warm or trap heat on humid days.'}
                    </p>
                  </div>
                </div>

                {/* Question 2: Is it properly lined? */}
                <div className="p-4 rounded-2xl bg-[#faf8f5] border border-stone-200/90 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                    <span className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px]">
                      2
                    </span>
                    <span>Is it properly lined or see-through in sunlight?</span>
                  </div>
                  <div className="pl-7 pt-1">
                    <div className="flex items-center gap-2 text-sm font-semibold text-stone-900">
                      <Eye className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>
                        Opacity Rating: {selectedDress.fabric.opacityScore} / 10 •{' '}
                        {selectedDress.fabric.lining === 'fully_lined'
                          ? 'Fully Lined'
                          : selectedDress.fabric.lining === 'half_lined'
                          ? 'Half Lined'
                          : 'Unlined'}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {selectedDress.fabric.sheernessDescription}{' '}
                      {selectedDress.fabric.liningMaterial && (
                        <span className="font-medium text-stone-800">
                          (Lining material: {selectedDress.fabric.liningMaterial})
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Question 3: How long will it be on me & how does the back look? */}
                <div className="p-4 rounded-2xl bg-[#faf8f5] border border-stone-200/90 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                    <span className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px]">
                      3
                    </span>
                    <span>How long will it be on me & how does the back look?</span>
                  </div>
                  <div className="pl-7 pt-1">
                    <p className="text-xs text-stone-800 leading-relaxed font-medium">
                      📏 {selectedDress.lengthDetails}
                    </p>
                    <p className="text-xs text-stone-600 mt-1">
                      Click the <strong>"Back View"</strong> photo button to inspect the full rear design,
                      zipper closure, and bra strap coverage.
                    </p>
                  </div>
                </div>

                {/* Question 4: Can I sit, walk, and move comfortably? */}
                <div className="p-4 rounded-2xl bg-[#faf8f5] border border-stone-200/90 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                    <span className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px]">
                      4
                    </span>
                    <span>Can I sit, walk, and move comfortably?</span>
                  </div>
                  <div className="pl-7 pt-1">
                    <p className="text-xs text-stone-800 leading-relaxed font-medium">
                      💃 {selectedDress.mobilityDetails}
                    </p>
                    <p className="text-xs text-stone-600 mt-1">
                      Care instruction: <strong className="text-stone-800 capitalize">{selectedDress.fabric.careType.replace(/_/g, ' ')}</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Honest Summary Box */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 space-y-1.5">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                The Honest Shopper Verdict
              </span>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {evaluation.verdictReason}
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
