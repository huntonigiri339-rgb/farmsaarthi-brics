export const diagnosisHigh = {
  condition: "Fall Armyworm (Spodoptera frugiperda)",
  confidence: 0.78,
  isSimulated: true,
  evidence: [
    { type: "Weather", text: "High relative humidity (82%) favors larval progression" },
    { type: "Satellite", text: "NDVI reduction indicating canopy vegetation stress" },
    { type: "Growth Stage", text: "Early vegetative stage (V4) highly susceptible" }
  ],
  recommendation: "Apply Neem-based Azadirachtin (1500 ppm) at 5ml/L or contact local KVK officer.",
  citation: "AI diagnosis is simulated for this prototype. Cited: ICAR, Google AMED API"
};

export const diagnosisLow = {
  condition: "Unknown / Low Confidence Diagnosis",
  confidence: 0.32,
  isSimulated: true,
  evidence: [
    { type: "Image Quality", text: "Blurry leaf surface or insufficient lighting" },
    { type: "Pattern Match", text: "Symptom overlap between nutritional deficiency and early blight" }
  ],
  recommendation: "Insufficient Evidence. I cannot diagnose this reliably. Please contact an extension officer.",
  citation: "AI diagnosis is simulated for this prototype. Cited: ICAR, Google AMED API"
};

export const contextPassports = {
  review: {
    id: "CP-2026-BRICS-042",
    status: "LOCAL REVIEW REQUIRED",
    badgeColor: "amber",
    reason: "Climate conditions differ. A human reviewer should confirm before this assertion is applied.",
    source: {
      country: "India 🇮🇳",
      region: "Dharwad, Karnataka",
      crop: "Maize",
      growthStage: "Vegetative (V4)",
      climate: "Semi-Arid Monsoon / High Humidity",
      validUntil: "Oct 2026",
      matches: { crop: true, growthStage: true, climate: false, geography: false }
    },
    target: {
      country: "Brazil 🇧🇷",
      region: "Mato Grosso",
      crop: "Maize",
      growthStage: "Vegetative (V4)",
      climate: "Tropical Wet & Dry",
      matches: { crop: true, growthStage: true, climate: false, geography: false }
    }
  },
  accept: {
    id: "CP-2026-BRICS-089",
    status: "ACCEPT",
    badgeColor: "green",
    reason: "All critical agronomic and weather factors match cross-border validation criteria.",
    source: {
      country: "India 🇮🇳",
      region: "Punjab",
      crop: "Wheat",
      growthStage: "Tillering",
      climate: "Subtropical Cool",
      validUntil: "Nov 2026",
      matches: { crop: true, growthStage: true, climate: true, geography: true }
    },
    target: {
      country: "China 🇨🇳",
      region: "Henan Province",
      crop: "Wheat",
      growthStage: "Tillering",
      climate: "Subtropical Cool",
      matches: { crop: true, growthStage: true, climate: true, geography: true }
    }
  },
  reject: {
    id: "CP-2026-BRICS-104",
    status: "REJECT",
    badgeColor: "red",
    reason: "Critical mismatch: Growth stage and soil moisture parameters incompatible.",
    source: {
      country: "South Africa 🇿🇦",
      region: "Free State",
      crop: "Soybean",
      growthStage: "Pod Filling",
      climate: "Dry Temperate",
      validUntil: "Dec 2026",
      matches: { crop: true, growthStage: false, climate: false, geography: false }
    },
    target: {
      country: "Russia 🇷🇺",
      region: "Krasnodar",
      crop: "Soybean",
      growthStage: "Seedling",
      climate: "Boreal Humid",
      matches: { crop: true, growthStage: false, climate: false, geography: false }
    }
  }
};

export const fieldMemoryDemo = [
  {
    id: "fm-1",
    type: "observation",
    icon: "Eye",
    title: "Observation Recorded",
    description: "Leaf spots and minor defoliation noticed on maize seedlings near North plot boundary.",
    timestamp: "2026-09-28T09:30:00.000Z",
    tag: "Field Check"
  },
  {
    id: "fm-2",
    type: "advisory",
    icon: "MessageSquare",
    title: "Advisory Given",
    description: "Recommended neem-based bio-fungicide spray (5ml/L) and field drainage check.",
    timestamp: "2026-09-28T11:15:00.000Z",
    tag: "KVK Advisory"
  },
  {
    id: "fm-3",
    type: "action",
    icon: "CheckCircle",
    title: "Action Taken",
    description: "Farmer applied organic Neem oil spray treatment in early morning hours.",
    timestamp: "2026-09-29T06:45:00.000Z",
    tag: "Treatment"
  },
  {
    id: "fm-4",
    type: "outcome",
    icon: "TrendingUp",
    title: "Outcome Monitored",
    description: "Leaf stress reduced significantly after 7 days; new shoots show clear green growth.",
    timestamp: "2026-10-01T16:00:00.000Z",
    tag: "Recovery"
  }
];

export const assertions = [
  {
    id: "AST-IN-2026",
    country: "India",
    institute: "ICAR - Indian Council of Agricultural Research",
    title: "Biocontrol of Spodoptera frugiperda in Rainy Season Maize",
    confidence: "High (Validated in 4 states)",
    validUntil: "Oct 2026"
  }
];
