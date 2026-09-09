import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 5),
  });
});

// Heuristic fallback parser when Gemini API key is unavailable or inactive
function heuristicFabricParser(rawText: string) {
  const text = rawText.toLowerCase();

  // 1. Fiber composition detection
  const composition: Record<string, number> = {};
  const fiberRegex = /(\d{1,3})%\s*(cotton|linen|flax|polyester|silk|rayon|viscose|modal|tencel|nylon|spandex|elastane|wool|cashmere|acrylic)/g;
  let match;
  let detectedTotal = 0;

  while ((match = fiberRegex.exec(text)) !== null) {
    const pct = parseInt(match[1], 10);
    const fiber = match[2];
    composition[fiber] = pct;
    detectedTotal += pct;
  }

  if (detectedTotal === 0) {
    if (text.includes('cotton')) composition['cotton'] = 100;
    else if (text.includes('linen')) composition['linen'] = 100;
    else if (text.includes('silk')) composition['silk'] = 100;
    else if (text.includes('polyester')) composition['polyester'] = 100;
    else if (text.includes('viscose') || text.includes('rayon')) composition['viscose'] = 100;
    else if (text.includes('modal') || text.includes('tencel')) composition['modal'] = 100;
    else composition['cotton'] = 100;
  }

  // Fiber category
  let fiberCategory: 'natural' | 'synthetic' | 'blend' | 'semi-synthetic' = 'natural';
  const fibers = Object.keys(composition);
  const hasSynthetic = fibers.some((f) => ['polyester', 'nylon', 'acrylic'].includes(f));
  const hasNatural = fibers.some((f) => ['cotton', 'linen', 'flax', 'silk', 'wool', 'cashmere'].includes(f));
  const hasSemi = fibers.some((f) => ['viscose', 'rayon', 'modal', 'tencel'].includes(f));

  if (hasSynthetic && (hasNatural || hasSemi)) fiberCategory = 'blend';
  else if (hasSynthetic) fiberCategory = 'synthetic';
  else if (hasSemi) fiberCategory = 'semi-synthetic';
  else fiberCategory = 'natural';

  // Lining detection
  let lining: 'none' | 'bodice_only' | 'half_lined' | 'fully_lined' = 'none';
  if (text.includes('fully lined') || text.includes('full lining') || text.includes('double layer') || text.includes('lined skirt')) {
    lining = 'fully_lined';
  } else if (text.includes('bodice lined') || text.includes('lined bodice') || text.includes('bust lined') || text.includes('partially lined')) {
    lining = 'bodice_only';
  } else if (text.includes('half lined')) {
    lining = 'half_lined';
  } else if (text.includes('unlined') || text.includes('without lining')) {
    lining = 'none';
  }

  // Opacity & sheerness
  let opacityScore = 7;
  let sheernessDesc = 'Standard moderate opacity under normal indoor lighting.';
  if (text.includes('sheer') || text.includes('chiffon') || text.includes('translucent') || text.includes('see-through')) {
    opacityScore = 3;
    sheernessDesc = 'Noticeably sheer/translucent. Requires slip or nude undergarments.';
  } else if (text.includes('semi-sheer') || text.includes('gauze') || text.includes('lightweight linen')) {
    opacityScore = 5;
    sheernessDesc = 'Semi-sheer when backlit by bright sunlight.';
  } else if (lining === 'fully_lined' || text.includes('opaque') || text.includes('ponte') || text.includes('thick')) {
    opacityScore = 9;
    sheernessDesc = 'Verified opaque. Zero transparency in direct daylight.';
  }

  // Care
  let careType: 'machine_washable' | 'hand_wash' | 'dry_clean_only' = 'machine_washable';
  if (text.includes('dry clean') || text.includes('dry-clean')) {
    careType = 'dry_clean_only';
  } else if (text.includes('hand wash') || text.includes('hand-wash')) {
    careType = 'hand_wash';
  }

  // Stretch
  let stretchLevel: 'none' | 'mechanical' | 'medium' | 'high' = 'none';
  let stretchPercent = 0;
  if (composition['spandex'] || composition['elastane']) {
    const val = (composition['spandex'] || 0) + (composition['elastane'] || 0);
    stretchPercent = val * 2;
    stretchLevel = val >= 6 ? 'high' : 'medium';
  } else if (text.includes('ribbed') || text.includes('knit') || text.includes('stretch')) {
    stretchLevel = 'medium';
    stretchPercent = 8;
  }

  // Breathability
  let breathability = 7;
  if (fiberCategory === 'natural' && (composition['linen'] || composition['cotton'])) {
    breathability = 9;
  } else if (fiberCategory === 'synthetic' && composition['polyester'] && composition['polyester'] > 80) {
    breathability = 3;
  }

  return {
    title: 'Extracted Garment Piece',
    fiberComposition: composition,
    fiberCategory,
    weightGsm: text.includes('heavy') ? 300 : text.includes('light') ? 110 : 180,
    weightCategory: (text.includes('heavy') ? 'heavyweight' : text.includes('light') ? 'lightweight' : 'midweight') as 'lightweight' | 'midweight' | 'heavyweight',
    weaveType: text.includes('poplin') ? 'Poplin' : text.includes('chiffon') ? 'Chiffon' : text.includes('knit') ? 'Rib Knit' : 'Plain Weave',
    opacityScore,
    sheernessDescription: sheernessDesc,
    lining,
    liningMaterial: lining === 'fully_lined' ? 'Self-fabric / Cotton Voile' : undefined,
    stretchLevel,
    stretchPercent,
    breathability,
    careType,
    wrinkleResistance: (fiberCategory === 'synthetic' ? 'high' : text.includes('linen') ? 'low' : 'moderate') as 'low' | 'moderate' | 'high',
    constructionHighlights: [
      `Fabric base: ${Object.entries(composition).map(([f, p]) => `${p}% ${f}`).join(', ')}`,
      `Lining execution: ${lining.replace(/_/g, ' ')}`,
      `Daylight opacity rating: ${opacityScore}/10`,
      `Care requirement: ${careType.replace(/_/g, ' ')}`,
    ],
    source: 'Deterministic Textile Heuristic Parser',
  };
}

// POST /api/extract-fabric - Gemini API powered extraction with heuristic fallback
app.post('/api/extract-fabric', async (req: Request, res: Response) => {
  const { productText } = req.body;

  if (!productText || typeof productText !== 'string' || productText.trim().length === 0) {
    res.status(400).json({ error: 'productText is required' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim().length > 5) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = `You are an expert textile engineer and garment transparency analyst. Analyze the following clothing product description, specification label, or marketing blurb:
"""
${productText}
"""

Extract detailed, objective fabric and construction metrics to solve the "detective work" shoppers face:
1. Fiber Composition percentages (e.g. {"cotton": 95, "elastane": 5})
2. Fiber Category (natural, synthetic, blend, or semi-synthetic)
3. Fabric weight in GSM estimate (e.g. 90-380) and weightCategory (lightweight, midweight, or heavyweight)
4. Weave type (e.g. Poplin, Chiffon, Interlock, Twill, Satin, Linen Slub, etc.)
5. Opacity score from 1 (completely sheer/see-through) to 10 (blackout opaque) and sheernessDescription
6. Lining status (none, bodice_only, half_lined, or fully_lined) and liningMaterial if known
7. Stretch level (none, mechanical, medium, high) and stretchPercent
8. Breathability rating (1 to 10, natural cotton/linen is 8-10, pure polyester is 2-4)
9. Care type (machine_washable, hand_wash, or dry_clean_only)
10. Wrinkle resistance (low, moderate, high)
11. 3-4 construction highlights or warning notes.`;

      const schemaDefinition = {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          fiberCompositionList: {
            type: Type.ARRAY,
            description: 'List of fiber components with percentages (e.g. [{"fiber": "cotton", "percentage": 100}])',
            items: {
              type: Type.OBJECT,
              properties: {
                fiber: { type: Type.STRING },
                percentage: { type: Type.INTEGER },
              },
              required: ['fiber', 'percentage'],
            },
          },
          fiberCategory: {
            type: Type.STRING,
            enum: ['natural', 'synthetic', 'blend', 'semi-synthetic'],
          },
          weightGsm: { type: Type.INTEGER },
          weightCategory: {
            type: Type.STRING,
            enum: ['lightweight', 'midweight', 'heavyweight'],
          },
          weaveType: { type: Type.STRING },
          opacityScore: { type: Type.INTEGER },
          sheernessDescription: { type: Type.STRING },
          lining: {
            type: Type.STRING,
            enum: ['none', 'bodice_only', 'half_lined', 'fully_lined'],
          },
          liningMaterial: { type: Type.STRING },
          stretchLevel: {
            type: Type.STRING,
            enum: ['none', 'mechanical', 'medium', 'high'],
          },
          stretchPercent: { type: Type.INTEGER },
          breathability: { type: Type.INTEGER },
          careType: {
            type: Type.STRING,
            enum: ['machine_washable', 'hand_wash', 'dry_clean_only'],
          },
          wrinkleResistance: {
            type: Type.STRING,
            enum: ['low', 'moderate', 'high'],
          },
          constructionHighlights: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: [
          'title',
          'fiberCompositionList',
          'fiberCategory',
          'weightGsm',
          'weightCategory',
          'weaveType',
          'opacityScore',
          'sheernessDescription',
          'lining',
          'stretchLevel',
          'stretchPercent',
          'breathability',
          'careType',
          'wrinkleResistance',
          'constructionHighlights',
        ],
      };

      let response;
      let usedModel = 'gemini-3.8-flash';
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: schemaDefinition,
          },
        });
      } catch (firstErr: any) {
        console.warn('gemini-3.8-flash busy, falling back to gemini-3.1-flash-lite:', firstErr?.message);
        usedModel = 'gemini-3.1-flash-lite';
        response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: schemaDefinition,
          },
        });
      }

      const extractedJson = JSON.parse(response.text?.trim() || '{}');
      const compositionMap: Record<string, number> = {};
      if (Array.isArray(extractedJson.fiberCompositionList)) {
        for (const item of extractedJson.fiberCompositionList) {
          if (item && item.fiber && typeof item.percentage === 'number') {
            compositionMap[item.fiber.toLowerCase()] = item.percentage;
          }
        }
      }

      res.json({
        ...extractedJson,
        fiberComposition: Object.keys(compositionMap).length > 0 ? compositionMap : { cotton: 100 },
        source: `Gemini AI (${usedModel})`,
      });
      return;
    } catch (err: any) {
      console.warn('Gemini API call failed or key inactive, falling back to textile heuristic parser:', err?.message);
    }
  }

  // Graceful fallback to deterministic textile parser
  const fallbackResult = heuristicFabricParser(productText);
  res.json(fallbackResult);
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FabricMatch AI Server running on http://localhost:${PORT}`);
  });
}

startServer();
