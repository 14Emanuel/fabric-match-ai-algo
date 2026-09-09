import React, { useState } from 'react';
import { UserPreferenceProfile } from '../types';
import { SAMPLE_PERSONAS } from '../data/samplePersonas';
import { SlidersHorizontal, User, ShieldAlert, Thermometer, Eye, Sparkles, Check } from 'lucide-react';

interface PersonaSelectorProps {
  currentProfile: UserPreferenceProfile;
  onSelectProfile: (profile: UserPreferenceProfile) => void;
}

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  currentProfile,
  onSelectProfile,
}) => {
  const [isCustomizing, setIsCustomizing] = useState(false);

  const handlePresetSelect = (p: UserPreferenceProfile) => {
    setIsCustomizing(false);
    onSelectProfile(p);
  };

  const handleUpdateCustomField = <K extends keyof UserPreferenceProfile>(
    field: K,
    value: UserPreferenceProfile[K]
  ) => {
    setIsCustomizing(true);
    onSelectProfile({
      ...currentProfile,
      id: 'custom-profile',
      name: 'Custom Shopper',
      personaTitle: 'Customized Comfort Settings',
      avatar: '⚙️',
      [field]: value,
    });
  };

  const toggleRestrictedFiber = (fiber: string) => {
    const current = [...currentProfile.restrictedFibers];
    const index = current.indexOf(fiber);
    if (index >= 0) {
      current.splice(index, 1);
    } else {
      current.push(fiber);
    }
    handleUpdateCustomField('restrictedFibers', current);
  };

  const toggleCareMethod = (care: 'machine_washable' | 'hand_wash' | 'dry_clean_only') => {
    let current = [...currentProfile.allowedCare];
    if (current.includes(care)) {
      if (current.length > 1) {
        current = current.filter((c) => c !== care);
      }
    } else {
      current.push(care);
    }
    handleUpdateCustomField('allowedCare', current);
  };

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold uppercase tracking-wider">
            <User className="w-3.5 h-3.5" />
            <span>Step 1: Select or Customize Shopper Profile</span>
          </div>
          <h2 className="text-xl font-serif font-bold text-stone-900 mt-1">
            Who Are We Matching For?
          </h2>
          <p className="text-sm text-stone-500 mt-0.5">
            Switch between realistic shopper profiles or calibrate custom comfort constraints.
          </p>
        </div>

        <button
          onClick={() => setIsCustomizing(!isCustomizing)}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
            isCustomizing
              ? 'bg-amber-100/60 text-amber-900 border-amber-300 shadow-xs'
              : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 text-amber-700" />
          <span>{isCustomizing ? 'Hide Adjusters' : 'Fine-Tune Constraints'}</span>
        </button>
      </div>

      {/* Preset Personas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        {SAMPLE_PERSONAS.map((persona) => {
          const isSelected = currentProfile.id === persona.id && !isCustomizing;
          return (
            <button
              key={persona.id}
              onClick={() => handlePresetSelect(persona)}
              className={`text-left p-4 rounded-xl transition-all border relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-stone-900 text-white border-stone-900 shadow-md ring-2 ring-stone-900/10'
                  : 'bg-stone-50/70 hover:bg-stone-100/80 text-stone-800 border-stone-200/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{persona.avatar}</span>
                    <div>
                      <h3 className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                        {persona.name}
                      </h3>
                      <p className={`text-xs ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                        {persona.personaTitle}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-amber-400 text-stone-900 flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                  )}
                </div>
                <p className={`text-xs line-clamp-2 mt-1 leading-relaxed ${isSelected ? 'text-stone-300' : 'text-stone-600'}`}>
                  {persona.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-dashed border-stone-200/40 text-[11px]">
                {persona.restrictedFibers.length > 0 && (
                  <span className={`px-2 py-0.5 rounded-md font-medium ${isSelected ? 'bg-red-950/80 text-red-200 border border-red-800/40' : 'bg-red-50 text-red-700 border border-red-200/60'}`}>
                    No {persona.restrictedFibers.join(', ')}
                  </span>
                )}
                {persona.requireLining === 'fully_lined' && (
                  <span className={`px-2 py-0.5 rounded-md font-medium ${isSelected ? 'bg-stone-800 text-stone-200' : 'bg-stone-200/60 text-stone-700'}`}>
                    Lined Only
                  </span>
                )}
                <span className={`px-2 py-0.5 rounded-md font-medium ${isSelected ? 'bg-stone-800 text-stone-200' : 'bg-stone-200/60 text-stone-700'}`}>
                  Min Opacity: {persona.minOpacity}/10
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Fine-Tune Adjuster Panel */}
      {isCustomizing && (
        <div className="mt-5 pt-5 border-t border-stone-200/80 bg-stone-50/50 p-5 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-600" />
              Interactive Constraint Adjuster
            </h4>
            <span className="text-xs text-stone-500">Changes reflect instantly across all garments</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Opacity & Sheerness */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-stone-500" />
                  Min Opacity (No See-Through):
                </span>
                <span className="font-bold text-amber-700">{currentProfile.minOpacity} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={currentProfile.minOpacity}
                onChange={(e) => handleUpdateCustomField('minOpacity', parseInt(e.target.value, 10))}
                className="w-full accent-stone-900 cursor-pointer"
              />
              <p className="text-[11px] text-stone-500">
                {currentProfile.minOpacity >= 9
                  ? 'Strict 100% blackout opacity required.'
                  : currentProfile.minOpacity >= 7
                  ? 'Solid daywear; no leg silhouette in daylight.'
                  : 'Allows subtle translucency.'}
              </p>
            </div>

            {/* Breathability */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
                <span className="flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-stone-500" />
                  Min Breathability Airflow:
                </span>
                <span className="font-bold text-amber-700">{currentProfile.minBreathability} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={currentProfile.minBreathability}
                onChange={(e) => handleUpdateCustomField('minBreathability', parseInt(e.target.value, 10))}
                className="w-full accent-stone-900 cursor-pointer"
              />
              <p className="text-[11px] text-stone-500">
                {currentProfile.minBreathability >= 8
                  ? 'Demands high air permeability (Cotton, Linen, Modal).'
                  : 'Standard temperature tolerance.'}
              </p>
            </div>

            {/* Lining Requirement */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-stone-700 block">Lining Requirement:</span>
              <div className="grid grid-cols-3 gap-1.5">
                {(['any', 'partial_or_full', 'fully_lined'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => handleUpdateCustomField('requireLining', mode)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium capitalize border transition-all ${
                      currentProfile.requireLining === mode
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    {mode === 'fully_lined' ? 'Fully Lined' : mode === 'partial_or_full' ? 'Lined+' : 'Any'}
                  </button>
                ))}
              </div>
            </div>

            {/* Restricted Fibers (Hard Violations) */}
            <div className="space-y-2 md:col-span-2">
              <span className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                Fiber Restrictions (Hard Disqualifiers):
              </span>
              <div className="flex flex-wrap gap-2">
                {['polyester', 'acrylic', 'nylon', 'wool', 'silk'].map((fiber) => {
                  const isRestricted = currentProfile.restrictedFibers.includes(fiber);
                  return (
                    <button
                      key={fiber}
                      onClick={() => toggleRestrictedFiber(fiber)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize border transition-all ${
                        isRestricted
                          ? 'bg-red-50 text-red-700 border-red-300 font-semibold'
                          : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {isRestricted ? `✕ No ${fiber}` : `+ Avoid ${fiber}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Allowed Care Types */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-stone-700 block">Acceptable Care Methods:</span>
              <div className="flex flex-wrap gap-1.5">
                {(['machine_washable', 'hand_wash', 'dry_clean_only'] as const).map((care) => {
                  const isAllowed = currentProfile.allowedCare.includes(care);
                  return (
                    <button
                      key={care}
                      onClick={() => toggleCareMethod(care)}
                      className={`px-2 py-1 rounded-lg text-xs font-medium border transition-all ${
                        isAllowed
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
                          : 'bg-stone-100 text-stone-400 border-stone-200 line-through'
                      }`}
                    >
                      {care === 'machine_washable'
                        ? 'Machine Wash'
                        : care === 'hand_wash'
                        ? 'Hand Wash'
                        : 'Dry Clean'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
