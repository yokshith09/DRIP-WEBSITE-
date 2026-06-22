'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { 
  Sparkles, 
  Upload, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Smile,
  Award,
  Activity,
  Sliders
} from 'lucide-react';
import { useStyleDNAStore } from '@/store/styleDNA';
import { analyzeBodyShape } from '@/lib/bodyAnalysis';
import { analyzeSkinTone } from '@/lib/colorAnalysis';
import { BodyShape, StyleVibe, Occasion } from '@/data/types';

interface StyleDNAOnboardingProps {
  onComplete?: () => void;
}

const STYLE_VIBES: { value: StyleVibe; label: string; desc: string; image: string }[] = [
  { value: 'minimalist', label: 'Minimalist', desc: 'Clean cuts, neutral palettes, quiet luxury.', image: '/images/hero/hero-clean.png' },
  { value: 'streetwear', label: 'Streetwear', desc: 'Oversized silhouettes, graphics, sneakers.', image: '/images/hero/cat-tshirts.png' },
  { value: 'formal', label: 'Classic Editorial', desc: 'Tailored trousers, structured blazers, elegance.', image: '/images/hero/cat-trousers.png' },
  { value: 'bohemian', label: 'Bohemian / Retro', desc: 'Flowing shapes, earthy textures, artistic vibes.', image: '/images/hero/accessories-collection.png' },
  { value: 'ethnic', label: 'Modern Ethnic', desc: 'Chic kurtas, rich linen blends, cultural pride.', image: '/images/hero/cat-women-kurtas.png' },
  { value: 'luxury', label: 'Avant-Garde Luxury', desc: 'Mulberry silks, statement jackets, bold premium lines.', image: '/images/hero/luxury-accessories.png' }
];

const OCCASIONS: { value: Occasion; label: string }[] = [
  { value: 'casual', label: 'Everyday Casual' },
  { value: 'work', label: 'Smart Workwear' },
  { value: 'party', label: 'Cocktails & Night Out' },
  { value: 'wedding', label: 'Wedding Guest' },
  { value: 'festive', label: 'Festivals & Occasions' },
  { value: 'travel', label: 'Leisure Travel' },
  { value: 'sport', label: 'Active & Athleisure' }
];

export default function StyleDNAOnboarding({ onComplete }: StyleDNAOnboardingProps) {
  const { updateDNA } = useStyleDNAStore();
  const [step, setStep] = useState<number>(1);
  
  // File upload previews
  const [bodyPhoto, setBodyPhoto] = useState<string | null>(null);
  const [facePhoto, setFacePhoto] = useState<string | null>(null);

  // Analysis status states
  const [isScanningBody, setIsScanningBody] = useState(false);
  const [isScanningColor, setIsScanningColor] = useState(false);

  // Interactive Caliper States (Digital Tailor Caliper)
  const [shoulderCaliper, setShoulderCaliper] = useState<number>(75);
  const [hipCaliper, setHipCaliper] = useState<number>(75);

  // Analysis result states
  const [detectedShape, setDetectedShape] = useState<BodyShape>('rectangle');
  const [bodyConfidence, setBodyConfidence] = useState<number>(100);
  const [detectedHex, setDetectedHex] = useState<string>('#D8B598');
  const [detectedUndertone, setDetectedUndertone] = useState<'warm' | 'cool' | 'neutral'>('neutral');
  const [recommendedPalette, setRecommendedPalette] = useState<string[]>([]);
  const [avoidedColors, setAvoidedColors] = useState<string[]>([]);

  // User input states
  const [selectedVibe, setSelectedVibe] = useState<StyleVibe>('minimalist');
  const [selectedOccasions, setSelectedOccasions] = useState<Occasion[]>([]);
  const [budgetRange, setBudgetRange] = useState<number>(10000);
  const [height, setHeight] = useState<number>(175);

  const fileInputBodyRef = useRef<HTMLInputElement>(null);
  const fileInputFaceRef = useRef<HTMLInputElement>(null);

  const fileToImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = e.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleBodyUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const previewUrl = URL.createObjectURL(file);
    setBodyPhoto(previewUrl);
    setIsScanningBody(true);

    // Simulate scanning sweep
    setTimeout(() => {
      setIsScanningBody(false);
      calculateShape(75, 75); // Set initial defaults
    }, 2200);
  };

  // Recalculates shape dynamically as sliders slide
  const calculateShape = async (shoulders: number, hips: number) => {
    const ratio = shoulders / hips;
    const result = await analyzeBodyShape(ratio);
    setDetectedShape(result.bodyShape);
    setBodyConfidence(result.confidence);
  };

  const handleShoulderChange = (val: number) => {
    setShoulderCaliper(val);
    calculateShape(val, hipCaliper);
  };

  const handleHipChange = (val: number) => {
    setHipCaliper(val);
    calculateShape(shoulderCaliper, val);
  };

  const handleFaceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const previewUrl = URL.createObjectURL(file);
    setFacePhoto(previewUrl);
    setIsScanningColor(true);

    try {
      const img = await fileToImage(file);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = analyzeSkinTone(img);
      setDetectedHex(result.dominantHex);
      setDetectedUndertone(result.toneCategory);
      setRecommendedPalette(result.colorPalette);
      setAvoidedColors(result.avoidColors);
    } catch (error) {
      console.error(error);
      setDetectedHex('#D8B598');
      setDetectedUndertone('neutral');
      setRecommendedPalette(['Emerald Green', 'Dusty Rose', 'Navy Blue', 'Charcoal']);
      setAvoidedColors(['Neon Yellow']);
    } finally {
      setIsScanningColor(false);
    }
  };

  const toggleOccasion = (occ: Occasion) => {
    if (selectedOccasions.includes(occ)) {
      setSelectedOccasions(selectedOccasions.filter(o => o !== occ));
    } else {
      setSelectedOccasions([...selectedOccasions, occ]);
    }
  };

  const saveDNAProfile = () => {
    updateDNA({
      bodyShape: detectedShape || 'rectangle',
      height,
      skinTone: detectedHex,
      skinToneCategory: detectedUndertone,
      colorPalette: recommendedPalette,
      avoidColors: avoidedColors,
      styleVibe: selectedVibe,
      occasions: selectedOccasions,
      budgetRange: [1000, budgetRange],
      completedOnboarding: true
    });
    
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden min-h-[550px] flex flex-col transition-all duration-300">
      
      {/* Top progress bar */}
      <div className="w-full bg-gray-50 h-1.5 flex">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div 
            key={i} 
            className={`flex-1 h-full transition-all duration-500 ${
              i <= step ? 'bg-drip-navy' : 'bg-gray-100'
            }`}
          />
        ))}
      </div>

      {/* Steps area */}
      <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center">
        
        {/* STEP 1: Introduction */}
        {step === 1 && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-drip-navy text-white rounded-full flex items-center justify-center mx-auto shadow-md">
              <Sparkles className="w-8 h-8 animate-pulse text-drip-green fill-drip-green" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-display font-bold text-gray-900 leading-tight">Welcome to Style DNA Lab</h2>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                DRIP uses lightweight browser-side proportions mapping and skin tone analytics. Discover fits and color palettes optimized exactly for your biological characteristics.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl text-left border border-gray-100 max-w-md mx-auto space-y-3">
              <div className="flex items-center space-x-3 text-xs font-semibold text-gray-700">
                <Check className="w-4 h-4 text-drip-green" />
                <span>Private &amp; Secure (Photos processed purely on device)</span>
              </div>
              <div className="flex items-center space-x-3 text-xs font-semibold text-gray-700">
                <Check className="w-4 h-4 text-drip-green" />
                <span>Interactive Digital Caliper alignment for precise tailoring</span>
              </div>
              <div className="flex items-center space-x-3 text-xs font-semibold text-gray-700">
                <Check className="w-4 h-4 text-drip-green" />
                <span>Personalized color season palette discovery</span>
              </div>
            </div>

            <button 
              onClick={() => setStep(2)}
              className="mt-4 px-6 py-3 bg-drip-navy hover:bg-black text-white text-sm font-bold uppercase tracking-wider rounded-2xl flex items-center justify-center space-x-2 mx-auto transition-all"
            >
              <span>Begin Aesthetic Scan</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Body Scan (Digital Tailor Caliper) */}
        {step === 2 && (
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <span className="text-[10px] text-drip-coral uppercase tracking-widest font-black">Step 1 of 5</span>
              <h3 className="text-xl font-display font-bold text-gray-900">Interactive Proportions Scan</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Upload a straight full-body photo. Use the high-precision caliper sliders to align the glowing bars with your shoulders and hips bounds.
              </p>
            </div>

            {/* Interactive Photo Caliper Box */}
            <div 
              className="w-56 h-72 border border-gray-100 rounded-3xl mx-auto relative overflow-hidden shadow-md bg-gray-950 flex flex-col items-center justify-center"
            >
              {bodyPhoto ? (
                <>
                  <Image src={bodyPhoto} alt="Silhouette upload preview" fill className="object-cover opacity-80" />
                  
                  {/* Cyber Laser Scan Bar */}
                  {isScanningBody && (
                    <div className="absolute inset-x-0 h-1 bg-drip-green/90 shadow-[0_0_8px_rgba(24,196,128,0.8)] animate-[scan_2.2s_infinite_ease-in-out]"></div>
                  )}

                  {/* Glowing Caliper Calibrators */}
                  {!isScanningBody && (
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Shoulder Caliper Line */}
                      <div 
                        className="absolute left-1/2 -translate-x-1/2 h-[2px] bg-drip-coral shadow-[0_0_6px_rgba(233,69,96,0.8)] flex justify-between items-center transition-all duration-300"
                        style={{ 
                          top: '30%', 
                          width: `${shoulderCaliper}%` 
                        }}
                      >
                        <span className="w-1.5 h-3 bg-drip-coral rounded-xs -translate-x-0.5"></span>
                        <span className="text-[6px] font-black text-drip-coral bg-black/80 px-1 py-0.5 rounded -translate-y-3 font-mono">SHOULDERS</span>
                        <span className="w-1.5 h-3 bg-drip-coral rounded-xs translate-x-0.5"></span>
                      </div>

                      {/* Hip Caliper Line */}
                      <div 
                        className="absolute left-1/2 -translate-x-1/2 h-[2px] bg-drip-green shadow-[0_0_6px_rgba(24,196,128,0.8)] flex justify-between items-center transition-all duration-300"
                        style={{ 
                          top: '62%', 
                          width: `${hipCaliper}%` 
                        }}
                      >
                        <span className="w-1.5 h-3 bg-drip-green rounded-xs -translate-x-0.5"></span>
                        <span className="text-[6px] font-black text-drip-green bg-black/80 px-1 py-0.5 rounded translate-y-3.5 font-mono">HIPS</span>
                        <span className="w-1.5 h-3 bg-drip-green rounded-xs translate-x-0.5"></span>
                      </div>

                      {/* Calibration Overlay */}
                      <div className="absolute bottom-2 inset-x-2 bg-black/75 rounded-xl p-1.5 text-left border border-white/5">
                        <div className="flex justify-between items-center text-[8px] font-mono text-gray-300">
                          <span className="uppercase text-drip-green font-bold tracking-wider">{detectedShape} Type</span>
                          <span className="text-gray-400">Ratio: {(shoulderCaliper / hipCaliper).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div 
                  onClick={() => fileInputBodyRef.current?.click()}
                  className="absolute inset-4 border border-dashed border-gray-800 rounded-2xl flex flex-col items-center justify-center cursor-pointer text-gray-500 hover:text-white transition-colors"
                >
                  <Upload className="w-8 h-8 mx-auto mb-1.5 opacity-50" />
                  <span className="text-xs font-bold text-gray-200">Load Silhouette</span>
                  <span className="text-[9px] opacity-75 mt-0.5">JPEG/PNG (Full-body)</span>
                </div>
              )}
            </div>

            <input 
              type="file" 
              ref={fileInputBodyRef} 
              onChange={handleBodyUpload} 
              accept="image/*" 
              className="hidden" 
            />

            {/* Calibration Sliders */}
            {bodyPhoto && !isScanningBody && (
              <div className="max-w-xs mx-auto space-y-3 pt-2 bg-gray-50 p-4 border border-gray-100 rounded-2xl">
                <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 justify-center">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Interactive Calipers</span>
                </div>
                
                {/* Shoulders */}
                <div className="space-y-1 text-left">
                  <div className="flex justify-between text-[10px] font-bold text-gray-700">
                    <span>Shoulder Caliper:</span>
                    <span className="font-mono text-drip-coral">{shoulderCaliper}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="35" 
                    max="95" 
                    value={shoulderCaliper}
                    onChange={(e) => handleShoulderChange(parseInt(e.target.value))}
                    className="w-full accent-drip-coral" 
                  />
                </div>

                {/* Hips */}
                <div className="space-y-1 text-left">
                  <div className="flex justify-between text-[10px] font-bold text-gray-700">
                    <span>Hip Caliper:</span>
                    <span className="font-mono text-drip-green">{hipCaliper}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="35" 
                    max="95" 
                    value={hipCaliper}
                    onChange={(e) => handleHipChange(parseInt(e.target.value))}
                    className="w-full accent-drip-green" 
                  />
                </div>
              </div>
            )}

            {/* Height input */}
            <div className="max-w-xs mx-auto space-y-2 pt-2">
              <label className="text-xs font-bold text-gray-700 flex items-center justify-center space-x-1">
                <span>User Height: </span>
                <span className="text-drip-coral font-black">{height} cm</span>
              </label>
              <input 
                type="range" 
                min="130" 
                max="210" 
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value))}
                className="w-full accent-drip-navy" 
              />
            </div>

            <div className="flex justify-between items-center max-w-xs mx-auto pt-4">
              <button 
                onClick={() => setStep(1)}
                className="p-3 text-gray-400 hover:text-gray-700 flex items-center space-x-1 text-xs font-bold uppercase tracking-wider"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              
              <button 
                onClick={() => setStep(3)}
                disabled={!bodyPhoto && !isScanningBody}
                className="px-5 py-2.5 bg-drip-navy hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center space-x-1.5 transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Color Scan */}
        {step === 3 && (
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <span className="text-[10px] text-drip-coral uppercase tracking-widest font-black">Step 2 of 5</span>
              <h3 className="text-xl font-display font-bold text-gray-900">Color Palette Analysis</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Upload a clear face portrait selfie. We will sample the skin tone to classify your seasonal color palette.
              </p>
            </div>

            {/* Portrait Upload Area */}
            <div 
              onClick={() => !isScanningColor && fileInputFaceRef.current?.click()}
              className="w-48 h-48 border-2 border-dashed border-gray-200 rounded-full mx-auto flex flex-col items-center justify-center cursor-pointer relative overflow-hidden group hover:border-drip-navy transition-colors bg-gray-50"
            >
              {facePhoto ? (
                <>
                  <Image src={facePhoto} alt="Portrait face preview" fill className="object-cover" />
                  
                  {/* Grid sampling visual */}
                  {isScanningColor && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 border-2 border-dashed border-drip-green rounded-full animate-spin"></div>
                      <div className="absolute w-2 h-2 bg-drip-green rounded-full"></div>
                    </div>
                  )}
                  
                  {!isScanningColor && detectedHex && (
                    <div className="absolute inset-0 bg-black/45 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4">
                      <Smile className="w-8 h-8 text-drip-green bg-white rounded-full p-1.5 mb-1.5" />
                      <span className="text-[10px] uppercase tracking-widest font-black">Color Sampled</span>
                      <div className="flex items-center space-x-1.5 mt-1">
                        <span className="w-3.5 h-3.5 rounded-full border border-white/30" style={{ backgroundColor: detectedHex }}></span>
                        <span className="text-xs font-bold text-gray-200 uppercase">{detectedUndertone}</span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-4 space-y-2 text-gray-400 text-center">
                  <Smile className="w-8 h-8 mx-auto text-gray-300 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-gray-700 block">Upload Selfie</span>
                  <span className="text-[10px] block">Portrait Photo</span>
                </div>
              )}
            </div>

            <input 
              type="file" 
              ref={fileInputFaceRef} 
              onChange={handleFaceUpload} 
              accept="image/*" 
              className="hidden" 
            />

            {/* Display Palette result briefly if present */}
            {recommendedPalette.length > 0 && !isScanningColor && (
              <div className="space-y-2 max-w-sm mx-auto">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Recommended Colors:</span>
                <div className="flex justify-center space-x-1">
                  {recommendedPalette.map((col) => (
                    <span 
                      key={col} 
                      className="px-2 py-0.5 text-[9px] bg-drip-navy/5 text-drip-navy font-bold rounded-full border border-drip-navy/10"
                    >
                      {col}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center max-w-xs mx-auto pt-4">
              <button 
                onClick={() => setStep(2)}
                className="p-3 text-gray-400 hover:text-gray-700 flex items-center space-x-1 text-xs font-bold uppercase tracking-wider"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              
              <button 
                onClick={() => setStep(4)}
                disabled={!detectedHex && !isScanningColor}
                className="px-5 py-2.5 bg-drip-navy hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center space-x-1.5 transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Style Vibe */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <span className="text-[10px] text-drip-coral uppercase tracking-widest font-black">Step 3 of 5</span>
              <h3 className="text-xl font-display font-bold text-gray-900">Your Styling Vibe</h3>
              <p className="text-xs text-gray-500">Select the primary aesthetic you want to project.</p>
            </div>

            {/* Grid of vibes */}
            <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto px-1 py-1">
              {STYLE_VIBES.map((vibe) => (
                <div 
                  key={vibe.value}
                  onClick={() => setSelectedVibe(vibe.value)}
                  className={`border rounded-2xl p-3 cursor-pointer transition-all flex flex-col justify-between ${
                    selectedVibe === vibe.value 
                      ? 'border-drip-navy bg-drip-navy/5 shadow-sm ring-1 ring-drip-navy' 
                      : 'border-gray-150 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="w-full h-16 bg-gray-50 rounded-lg relative overflow-hidden mb-2">
                    <Image src={vibe.image} alt={vibe.label} fill className="object-cover mix-blend-multiply opacity-80" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 flex items-center justify-between">
                      <span>{vibe.label}</span>
                      {selectedVibe === vibe.value && <Check className="w-3.5 h-3.5 text-drip-navy fill-drip-navy text-white rounded-full bg-drip-green p-0.5" />}
                    </h4>
                    <p className="text-[9px] text-gray-400 mt-0.5 leading-snug">{vibe.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center max-w-xs mx-auto pt-4">
              <button 
                onClick={() => setStep(3)}
                className="p-3 text-gray-400 hover:text-gray-700 flex items-center space-x-1 text-xs font-bold uppercase tracking-wider"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              
              <button 
                onClick={() => setStep(5)}
                className="px-5 py-2.5 bg-drip-navy hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center space-x-1.5 transition-colors"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Occasions & Budget */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <span className="text-[10px] text-drip-coral uppercase tracking-widest font-black">Step 4 of 5</span>
              <h3 className="text-xl font-display font-bold text-gray-900">Occasions &amp; Budget</h3>
              <p className="text-xs text-gray-500">Refine where you wear these clothes and your maximum pricing comfort.</p>
            </div>

            {/* Occasions selection */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-700 block">I primarily dress for:</span>
              <div className="flex flex-wrap gap-2">
                {OCCASIONS.map((occ) => {
                  const isSelected = selectedOccasions.includes(occ.value);
                  return (
                    <button
                      key={occ.value}
                      type="button"
                      onClick={() => toggleOccasion(occ.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        isSelected 
                          ? 'bg-drip-navy text-white border-drip-navy' 
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {occ.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Budget range slider */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-gray-700">Max Garment Budget:</span>
                <span className="text-drip-coral text-sm font-black">₹{budgetRange.toLocaleString('en-IN')}</span>
              </div>
              <input 
                type="range" 
                min="1500" 
                max="30000" 
                step="500"
                value={budgetRange}
                onChange={(e) => setBudgetRange(parseInt(e.target.value))}
                className="w-full accent-drip-navy" 
              />
              <div className="flex justify-between text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                <span>Value (₹1.5k)</span>
                <span>Premium (₹15k)</span>
                <span>Luxury (₹30k+)</span>
              </div>
            </div>

            <div className="flex justify-between items-center max-w-xs mx-auto pt-6">
              <button 
                onClick={() => setStep(4)}
                className="p-3 text-gray-400 hover:text-gray-700 flex items-center space-x-1 text-xs font-bold uppercase tracking-wider"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              
              <button 
                onClick={() => setStep(6)}
                className="px-5 py-2.5 bg-drip-navy hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center space-x-1.5 transition-colors"
              >
                <span>Preview DNA</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: Completion */}
        {step === 6 && (
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] text-drip-green uppercase tracking-widest font-black">Scan Complete</span>
              <h3 className="text-2xl font-display font-bold text-gray-900 leading-tight">Your Styling DNA Card</h3>
              <p className="text-xs text-gray-500">Your profile is finalized. Here is how your DNA matches catalog pieces:</p>
            </div>

            {/* Premium DNA Card Visual */}
            <div className="bg-gradient-to-br from-[#1E1E2F] to-[#0F0F1A] text-white p-6 rounded-3xl border border-white/5 shadow-2xl text-left max-w-md mx-auto relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-drip-coral opacity-10 rounded-full blur-2xl"></div>
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">DRIP Profile System v2.0</span>
                  <h4 className="text-lg font-display font-semibold mt-0.5">Style DNA Profile</h4>
                </div>
                <Sparkles className="w-6 h-6 text-drip-green fill-drip-green animate-pulse" />
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-2 border-t border-white/10 pt-4 text-xs">
                <div>
                  <span className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold block">Body Type</span>
                  <span className="font-bold capitalize text-drip-green">{detectedShape || 'rectangle'}</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold block">Palette Underline</span>
                  <span className="font-bold capitalize text-drip-coral flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full border border-white/30" style={{ backgroundColor: detectedHex }}></span>
                    <span>{detectedUndertone}</span>
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold block">Vibe aesthetic</span>
                  <span className="font-bold capitalize text-white">{selectedVibe}</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold block">Budget ceiling</span>
                  <span className="font-bold text-white">₹{budgetRange.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="border-t border-white/10 mt-4 pt-4 text-[10px] text-gray-300 leading-relaxed">
                <span className="font-bold text-drip-green uppercase tracking-wider block mb-1">Curation Rule applied:</span>
                Suggest {selectedVibe} collections cut for {detectedShape || 'rectangle'} proportions, incorporating {recommendedPalette.slice(0, 3).join(', ')} colors.
              </div>
            </div>

            <div className="flex justify-center space-x-3 pt-2">
              <button 
                onClick={() => setStep(5)}
                className="px-5 py-2.5 border border-gray-200 text-gray-700 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-gray-50 transition-colors"
              >
                Refine
              </button>
              
              <button 
                onClick={saveDNAProfile}
                className="px-6 py-2.5 bg-drip-navy hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center space-x-2 transition-colors shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>Save DNA &amp; Crate Shop</span>
              </button>
            </div>
          </div>
        )}

      </div>
      
      {/* Laser scan animation styles */}
      <style jsx global>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
