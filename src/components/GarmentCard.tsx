import React, { useState } from 'react';
import { Garment, MatchEvaluation } from '../types';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Layers,
  Wind,
  Eye,
  Activity,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface GarmentCardProps {
  garment: Garment;
  evaluation: MatchEvaluation;
}

export const GarmentCard: React.FC<GarmentCardProps> = ({ garment, evaluation }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Score color formatting
  const getScoreTheme = (score: number, grade: MatchEvaluation['grade']) => {
    if (grade === 'Incompatible') {
      return {
        badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
        ring: 'ring-rose-300',
        bar: 'bg-rose-500',
        cardBorder: 'border-rose-200',
      };
    }
    if (score >= 85) {
      return {
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        ring: 'ring-emerald-300',
        bar: 'bg-emerald-500',
        cardBorder: 'border-emerald-200/60',
      };
    }
    if (score >= 70) {
      return {
        badgeBg: 'bg-teal-50 text-teal-800 border-teal-200',
        ring: 'ring-teal-300',
        bar: 'bg-teal-500',
        cardBorder: 'border-teal-200/60',
      };
    }
    if (score >= 50) {
      return {
        badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
        ring: 'ring-amber-300',
        bar: 'bg-amber-500',
        cardBorder: 'border-amber-200/60',
      };
    }
    return {
      badgeBg: 'bg-stone-100 text-stone-700 border-stone-200',
      ring: 'ring-stone-300',
      bar: 'bg-stone-400',
      cardBorder: 'border-stone-200',
    };
  };

  const theme = getScoreTheme(evaluation.totalScore, evaluation.grade);

  return (
    <div
      className={`bg-white rounded-2xl border ${theme.cardBorder} shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col`}
    >
      {/* Top Banner / Match Score Header */}
      <div className="p-4 sm:p-5 pb-3 flex items-start justify-between gap-3 border-b border-stone-100">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-600">
            {garment.brand}
          </span>
          <h3 className="font-serif font-bold text-lg text-stone-900 line-clamp-1">
            {garment.title}
          </h3>
          <p className="text-xs text-stone-600 mt-0.5">${garment.price} • {garment.category}</p>
        </div>

        {/* Total Score Badge */}
        <div className="flex flex-col items-end">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-sm shadow-xs ${theme.badgeBg}`}
          >
            {evaluation.grade === 'Incompatible' ? (
              <XCircle className="w-4 h-4 text-rose-600" />
            ) : evaluation.totalScore >= 80 ? (
              <Sparkles className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            )}
            <span>{evaluation.totalScore}% Match</span>
          </div>
          <span className="text-[11px] font-medium text-stone-600 mt-1">
            {evaluation.grade}
          </span>
        </div>
      </div>

      {/* Image & Transparency Callout */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 sm:p-5 flex-1">
        {/* Garment Image */}
        <div className="sm:col-span-5 relative rounded-xl overflow-hidden bg-stone-100 aspect-4/3 sm:aspect-square">
          <img
            src={garment.imageUrl}
            alt={garment.title}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs text-white px-2.5 py-1 rounded-md text-[11px] flex justify-between items-center font-medium">
            <span>GSM {garment.fabric.weightGsm}</span>
            <span className="capitalize">{garment.fabric.weaveType}</span>
          </div>
        </div>

        {/* Transparency Verdict & Metrics */}
        <div className="sm:col-span-7 flex flex-col justify-between">
          <div>
            {/* Hard Violations Alert if any */}
            {evaluation.hardViolations.length > 0 ? (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl mb-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 mb-1">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  Non-Negotiable Restriction Violated:
                </div>
                {evaluation.hardViolations.map((v, i) => (
                  <p key={i} className="text-xs text-rose-700 leading-tight">
                    • {v}
                  </p>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-stone-50 border border-stone-200/70 rounded-xl mb-3">
                <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-0.5">
                  The "No Detective Work" Verdict:
                </span>
                <p className="text-xs text-stone-800 leading-relaxed font-medium">
                  {evaluation.verdictReason}
                </p>
              </div>
            )}

            {/* Spec Matrix Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-stone-50/80 p-2.5 rounded-lg border border-stone-100">
                <span className="text-[11px] text-stone-600 block">Fiber Composition</span>
                <span className="font-semibold text-stone-900 block truncate">
                  {Object.entries(garment.fabric.fiberComposition)
                    .map(([f, p]) => `${p}% ${f}`)
                    .join(', ')}
                </span>
              </div>

              <div className="bg-stone-50/80 p-2.5 rounded-lg border border-stone-100">
                <span className="text-[11px] text-stone-600 block">Opacity / Sheerness</span>
                <span className="font-semibold text-stone-900 flex items-center gap-1">
                  <Eye className="w-3 h-3 text-stone-500" />
                  {garment.fabric.opacityScore}/10 ({garment.fabric.opacityScore >= 8 ? 'Opaque' : 'Sheer'})
                </span>
              </div>

              <div className="bg-stone-50/80 p-2.5 rounded-lg border border-stone-100">
                <span className="text-[11px] text-stone-600 block">Lining Status</span>
                <span className="font-semibold text-stone-900 capitalize block truncate">
                  <Layers className="w-3 h-3 inline mr-1 text-stone-500" />
                  {garment.fabric.lining.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="bg-stone-50/80 p-2.5 rounded-lg border border-stone-100">
                <span className="text-[11px] text-stone-600 block">Airflow Breathability</span>
                <span className="font-semibold text-stone-900 flex items-center gap-1">
                  <Wind className="w-3 h-3 text-stone-500" />
                  {garment.fabric.breathability}/10 ({garment.fabric.breathability >= 7 ? 'Cool' : 'Warm'})
                </span>
              </div>
            </div>
          </div>

          {/* Expand/Collapse Breakdown Button */}
          <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
            <span className="text-[11px] text-stone-600">
              Care: <strong className="text-stone-700 capitalize">{garment.fabric.careType.replace(/_/g, ' ')}</strong>
            </span>
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-stone-700 hover:text-stone-950 transition-colors"
            >
              <span>{showBreakdown ? 'Hide Criteria Math' : 'Inspect Criteria Math'}</span>
              {showBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Breakdown Drawer */}
      {showBreakdown && (
        <div className="p-4 sm:p-5 pt-3 bg-stone-50 border-t border-stone-200/80 text-xs">
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
              Multi-Attribute Compatibility Matrix
            </h4>
            <span className="text-[11px] text-stone-500">Weighted Scoring Breakdown</span>
          </div>

          <div className="space-y-2">
            {evaluation.criteria.map((c, i) => (
              <div
                key={i}
                className="bg-white p-3 rounded-xl border border-stone-200/70 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="space-y-0.5 max-w-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900">{c.criterion}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-stone-100 text-stone-600 font-mono">
                      Weight: {(c.weight * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500">{c.detail}</p>
                  <p className="text-[11px] text-stone-400">
                    Required: <span className="text-stone-600">{c.userRequirement}</span> • Actual:{' '}
                    <span className="text-stone-600">{c.garmentActual}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="w-20 bg-stone-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        c.score >= 80 ? 'bg-emerald-500' : c.score >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${c.score}%` }}
                    />
                  </div>
                  <span
                    className={`font-mono font-bold text-xs w-8 text-right ${
                      c.score >= 80 ? 'text-emerald-700' : c.score >= 50 ? 'text-amber-700' : 'text-rose-700'
                    }`}
                  >
                    {c.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
