"use client";

import React, { useState } from "react";
import {
  HeartPulse,
  AlertTriangle,
  Stethoscope,
  ClipboardList,
  CheckCircle2,
  HelpCircle,
  Activity,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  Info,
  Pill,
  ShieldAlert,
  Zap
} from "lucide-react";

interface PatientGuidanceSectionProps {
  caseId: string;
  domain?: string;
  stageOrRisk: string;
  patientAnonId?: string;
}

export interface SignalAnomalyDetail {
  status: "abnormal" | "caution" | "optimal";
  statusBadge: string;
  abnormalLocation: string; // "Where the signal is not good"
  signalPathologyDescription: string;
  normalBaselineComparison: string;
}

export interface RedFlagSign {
  sign: string;
  clinicalContext: string;
  urgency: "Immediate Medical Attention" | "Clinical Follow-Up" | "Monitor Daily";
}

export interface RealMedicalTreatment {
  treatmentName: string;
  category: "First-Line Medical Therapy" | "Behavioral & Neuro-Regulation" | "Clinical Device / Appliance" | "Medical Specialist Care";
  howItWorks: string;
  evidenceBase: string;
}

export interface CaseClinicalInfo {
  conditionTitle: string;
  simpleSummary: string;
  whatSignalMeans: string;
  whyNeedsAttention: string;
  signalAnomaly: SignalAnomalyDetail;
  thingsToPayAttentionTo: RedFlagSign[];
  realTreatments: RealMedicalTreatment[];
  causes: {
    title: string;
    description: string;
  }[];
  symptoms: {
    title: string;
    description: string;
  }[];
  symptoms_alert?: string;
  requiredTests: {
    testName: string;
    plainEnglishName: string;
    whyNeeded: string;
    urgency: "Routine" | "Recommended" | "Priority";
  }[];
  actionableGuidance: {
    immediateSteps: string[];
    doctorQuestions: string[];
    specialistToConsult: string;
  };
}

export const CLINICAL_KNOWLEDGE_BASE: Record<string, CaseClinicalInfo> = {
  // 1. MIT-BIH Pre-Apnea
  "mitbih_slp01_preapnea_01": {
    conditionTitle: "Obstructive Sleep Apnea Warning (Pre-Apnea Airway Collapse)",
    simpleSummary:
      "This test captures the crucial moments right before throat muscles relax excessively and block airflow during sleep. The brain is repeatedly struggling to keep the airway open, disrupting restorative breathing.",
    whatSignalMeans:
      "The brain waves slow down abnormally while the heart rhythm becomes uneven. This shows the body is running low on oxygen and fighting against a blocked windpipe just seconds before a full breathing pause.",
    whyNeedsAttention:
      "Repeated nocturnal airway collapses trigger severe blood oxygen dips (SpO2 dropping below 90%) and nocturnal adrenaline spikes. Left untreated, sleep apnea significantly raises the risk of severe hypertension, cardiac arrhythmias (such as atrial fibrillation), heart disease, stroke, and life-threatening daytime motor vehicle accidents caused by involuntary micro-sleeps.",
    signalAnomaly: {
      status: "abnormal",
      statusBadge: "Abnormal Airway & Waveform Strain",
      abnormalLocation: "Pre-apnea baseline flattening (0.5–2 Hz suppression) with sudden high-amplitude respiratory struggle bursts & cyclic heart rate surges",
      signalPathologyDescription: "The signal demonstrates microvolt amplitude suppression punctuated by chaotic low-frequency high-amplitude movement artifacts as the upper airway collapses, accompanied by sudden tachypnea and sympathetic cardiac surges.",
      normalBaselineComparison: "Healthy restful sleep maintains steady, smooth sinusoidal oscillations and a rhythmic resting sinus rhythm with uninterrupted slow Delta waves."
    },
    thingsToPayAttentionTo: [
      {
        sign: "Waking up suddenly gasping, choking, or snorting with a racing pulse",
        clinicalContext: "Direct indicator of complete airway obstruction where the brain jolts itself awake to prevent asphyxiation.",
        urgency: "Immediate Medical Attention"
      },
      {
        sign: "Severe daytime sleepiness or nodding off while driving or in meetings",
        clinicalContext: "Signals critical nocturnal sleep debt and profound micro-sleep vulnerability.",
        urgency: "Immediate Medical Attention"
      },
      {
        sign: "Bed partner noticing silence for 10+ seconds followed by a violent snort",
        clinicalContext: "Classic witnessed apnea pause confirming significant physical airway obstruction.",
        urgency: "Clinical Follow-Up"
      },
      {
        sign: "Dull morning front headaches and severe dry mouth / parched throat upon waking",
        clinicalContext: "Direct consequence of overnight carbon dioxide retention, hypoxemia, and forced mouth breathing.",
        urgency: "Clinical Follow-Up"
      },
      {
        sign: "Stubborn morning blood pressure spikes resistant to standard medication",
        clinicalContext: "Driven by overnight adrenaline surges triggered by repeated suffocation reflexes.",
        urgency: "Clinical Follow-Up"
      }
    ],
    realTreatments: [
      {
        treatmentName: "Automatic Positive Airway Pressure (APAP / CPAP Therapy)",
        category: "First-Line Medical Therapy",
        howItWorks: "Gently delivers continuous, filtered room air through a nasal or full-face mask, acting as an invisible pneumatic splint that keeps the airway continuously patent throughout the night.",
        evidenceBase: "AASM Clinical Practice Guideline — Gold Standard (eliminates 95%+ of apneic events)"
      },
      {
        treatmentName: "Custom Mandibular Advancement Oral Appliance (MAD)",
        category: "Clinical Device / Appliance",
        howItWorks: "Custom-fitted by an accredited dental sleep specialist; advances the lower jaw and tongue base forward by 3–6 mm to enlarge the pharyngeal space and prevent airway collapse.",
        evidenceBase: "AASM & AADSM Practice Guideline for Mild-to-Moderate OSA and CPAP-intolerant patients"
      },
      {
        treatmentName: "Positional Sleep Therapy & Side-Sleeping Apparatus",
        category: "Behavioral & Neuro-Regulation",
        howItWorks: "Uses smart vibrotactile feedback or contoured ergonomic bolsters to stop supine (back) sleeping where gravity pulls the tongue into the airway.",
        evidenceBase: "AASM Recommended Adjunctive Therapy (reduces positional AHI by >50%)"
      },
      {
        treatmentName: "ENT Airway Evaluation & Hypoglossal Nerve Stimulation (Inspire)",
        category: "Medical Specialist Care",
        howItWorks: "Specialist surgical review for deviated septum, tonsillar hypertrophy, or minimally invasive implanted neuro-stimulation that gently moves the tongue forward during inhalation.",
        evidenceBase: "FDA-Approved Surgical Alternative for moderate-to-severe OSA"
      }
    ],
    causes: [
      {
        title: "Throat & Tongue Muscle Relaxation",
        description: "During deep relaxation at night, the muscles at the back of the throat collapse backward, partially blocking the windpipe."
      },
      {
        title: "Sleeping Flat on the Back",
        description: "Gravity pulls the soft palate and tongue downward, making it much harder for air to flow smoothly into the lungs."
      },
      {
        title: "Nasal or Airway Narrowing",
        description: "Enlarged tonsils, a deviated nasal septum, or a naturally narrower neck airway can restrict night-time airflow."
      },
      {
        title: "Evening Alcohol or Sedative Intake",
        description: "Substances that relax the central nervous system make airway muscles unusually loose and unresponsive."
      }
    ],
    symptoms: [
      {
        title: "Loud Snoring & Choking Sounds",
        description: "Frequent loud snoring punctuated by sudden gasps, snorts, or brief pauses in breathing witnessed by a partner."
      },
      {
        title: "Waking Up Feeling Exhausted",
        description: "Feeling heavy, groggy, or completely unrefreshed in the morning despite being in bed for 7–8 hours."
      },
      {
        title: "Morning Headaches & Dry Mouth",
        description: "Waking up with a parched throat from mouth breathing, along with a dull front-headache caused by low overnight oxygen."
      },
      {
        title: "Daytime Sleepiness & Brain Fog",
        description: "Struggling to stay awake while driving, sitting at work, or reading, accompanied by short-term memory lapses."
      }
    ],
    requiredTests: [
      {
        testName: "Full Overnight In-Lab Polysomnography (Level 1 Sleep Study)",
        plainEnglishName: "Overnight Hospital Sleep Test",
        whyNeeded: "Monitors brainwaves, continuous blood oxygen (SpO2), chest wall breathing effort, and heart rhythm all night to calculate your exact Apnea-Hypopnea Index (AHI score).",
        urgency: "Priority"
      },
      {
        testName: "Home Sleep Apnea Test (HSAT - Level 3)",
        plainEnglishName: "Take-Home Sleep Device",
        whyNeeded: "A simple kit worn at home with a finger clip and small nasal tube to check oxygen dips and snoring pauses in your own bed.",
        urgency: "Recommended"
      },
      {
        testName: "ENT Flexible Nasopharyngoscopy",
        plainEnglishName: "Airway & Throat Camera Exam",
        whyNeeded: "An Ear, Nose, and Throat specialist gently looks down the nasal passages to see if enlarged tonsils, nasal polyps, or a narrow palate are physically blocking air.",
        urgency: "Recommended"
      },
      {
        testName: "24-Hour Ambulatory ECG (Holter Monitor)",
        plainEnglishName: "24-Hour Heart Rhythm Sticker",
        whyNeeded: "Sleep apnea frequently triggers irregular heartbeats (arrhythmias) or dangerous nighttime blood pressure spikes that require cardiac protection.",
        urgency: "Routine"
      }
    ],
    actionableGuidance: {
      immediateSteps: [
        "Sleep strictly on your side using a supportive contoured pillow to keep gravity from pulling your tongue into your throat.",
        "Avoid alcohol, heavy meals, and sleeping pills for at least 4 hours before bedtime.",
        "Use a saline nasal rinse or nasal strip before bed to reduce nasal breathing resistance.",
        "Consult a sleep physician about CPAP (Continuous Positive Airway Pressure) therapy or a customized dental mouthguard."
      ],
      doctorQuestions: [
        "What is my Apnea-Hypopnea Index (how many times per hour am I stopping breathing)?",
        "Did my oxygen levels drop below 90% during the night?",
        "Am I a good candidate for a gentle CPAP machine or an oral dental advancement device?",
        "Should my heart and blood pressure be monitored during sleep?"
      ],
      specialistToConsult: "Board-Certified Sleep Medicine Specialist / Somnologist & Pulmonologist"
    }
  },

  // 2. Sleep Fragmentation / Wake after Sleep Onset (ST7022J0)
  "sleep_telemetry_st7022j0": {
    conditionTitle: "Sleep Fragmentation & Frequent Nighttime Awakenings (WASO)",
    simpleSummary:
      "This test shows that while the patient is in bed, their brain keeps snapping back into an alert, awake state throughout the night. Sleep is broken up into shallow fragments instead of flowing smoothly through restorative cycles.",
    whatSignalMeans:
      "Instead of smooth, calm brain waves, the EEG shows sudden sharp bursts of rapid 'Alpha' waves (which normally only appear when you are awake with your eyes open). Muscle tone also stays tense.",
    whyNeedsAttention:
      "Frequent nocturnal micro-awakenings prevent the brain from completing full 90-minute sleep cycles, dramatically cutting deep Stage N3 physical repair and REM dream integration. Chronic sleep fragmentation causes systemic neuroinflammation, elevated resting cortisol, impaired glucose metabolism, memory loss, and severe emotional exhaustion.",
    signalAnomaly: {
      status: "abnormal",
      statusBadge: "Abnormal Cortical Arousals & Alpha Intrusion",
      abnormalLocation: "Recurrent rapid Alpha (8–12 Hz) & Beta (13–30 Hz) rhythm intrusions fracturing slow Delta oscillations",
      signalPathologyDescription: "Instead of sustained, synchronized slow waves (<2 Hz), the recording demonstrates repeated 3 to 15-second cortical micro-arousals accompanied by heightened submental EMG muscle tone and erratic autonomic heart rate surges.",
      normalBaselineComparison: "Healthy slow-wave sleep consists of continuous high-voltage (>75 µV) synchronized Delta waves and profound submental EMG muscle relaxation."
    },
    thingsToPayAttentionTo: [
      {
        sign: "Waking up between 2 AM and 4 AM with catastrophic racing thoughts or physical restlessness",
        clinicalContext: "Indicates elevated nocturnal cortisol and sympathetic nervous system hyper-arousal.",
        urgency: "Clinical Follow-Up"
      },
      {
        sign: "Uncomfortable creeping, crawling, or tingling urges to move legs when resting in bed",
        clinicalContext: "Hallmark sign of Restless Legs Syndrome (RLS), frequently triggered by low brain iron/ferritin stores.",
        urgency: "Clinical Follow-Up"
      },
      {
        sign: "Relying on escalating doses of alcohol, sedatives, or over-the-counter sleep aids",
        clinicalContext: "Sedatives suppress natural sleep architecture and cause rapid tolerance and rebound awakenings.",
        urgency: "Immediate Medical Attention"
      },
      {
        sign: "Persistent brain fog, irritability, and afternoon caffeine cravings",
        clinicalContext: "Direct daytime consequence of lacking restorative deep sleep cycles.",
        urgency: "Monitor Daily"
      }
    ],
    realTreatments: [
      {
        treatmentName: "Cognitive Behavioral Therapy for Insomnia (CBT-I)",
        category: "Behavioral & Neuro-Regulation",
        howItWorks: "Structured multicomponent protocol combining sleep restriction therapy, stimulus control, and sleep scheduling to recondition the brain that bed equals rapid, consolidated sleep.",
        evidenceBase: "American College of Physicians (ACP) First-Line Guideline — Proven superior to medication"
      },
      {
        treatmentName: "Dual Orexin Receptor Antagonists (DORAs: Daridorexant / Suvorexant)",
        category: "First-Line Medical Therapy",
        howItWorks: "Physician-prescribed medications that selectively silence the brain's hyperactive wakefulness neurotransmitter (orexin) without creating chemical dependence or morning grogginess.",
        evidenceBase: "FDA-Approved & AASM Clinical Guidelines for sleep maintenance insomnia"
      },
      {
        treatmentName: "Circadian Phototherapy & Morning Light Entrainment",
        category: "Behavioral & Neuro-Regulation",
        howItWorks: "10,000 lux broad-spectrum light exposure within 30 minutes of waking to anchor the circadian suprachiasmatic nucleus and optimize nighttime melatonin timing.",
        evidenceBase: "AASM Recommended Chronobiological Therapy"
      },
      {
        treatmentName: "Serum Ferritin & Iron Optimization Protocol",
        category: "Medical Specialist Care",
        howItWorks: "Targeted therapeutic iron supplementation under physician guidance to bring ferritin levels above 75 ng/mL, eliminating neurological restless leg micro-awakenings.",
        evidenceBase: "International Restless Legs Syndrome Study Group (IRLSSG) Consensus"
      }
    ],
    causes: [
      {
        title: "High Stress & Nervous System Overdrive",
        description: "High levels of cortisol (the stress hormone) keep the brain's internal 'alarm system' on high alert, waking you at minor noises."
      },
      {
        title: "Restless Legs or Periodic Limb Movements",
        description: "Involuntary muscle twitches, leg restlessness, or cramps that pull the brain out of deep sleep."
      },
      {
        title: "Late Caffeine or Evening Screen Exposure",
        description: "Blue light from phones/TVs delays melatonin release, while caffeine stays in the bloodstream for 6 to 8 hours."
      },
      {
        title: "Environmental Disruptions",
        description: "Bedroom temperature that is too warm, noise, partner movements, or frequent bathroom trips (nocturia)."
      }
    ],
    symptoms: [
      {
        title: "Waking Up Repeatedly at Night",
        description: "Opening your eyes at 2 AM or 3 AM and tossing and turning for 20 to 60 minutes unable to fall back asleep."
      },
      {
        title: "Light, Restless 'Half-Asleep' Sensation",
        description: "Feeling like your brain never fully shut down, hearing every creak and movement in the house."
      },
      {
        title: "Daytime Fatigue & Mood Irritability",
        description: "Feeling emotionally drained, short-tempered, and craving sugary foods or extra coffee to get through the afternoon."
      },
      {
        title: "Difficulty Focusing & Sluggish Reaction Times",
        description: "Brain fog, trouble retaining new information, and feeling mentally slower during conversations."
      }
    ],
    requiredTests: [
      {
        testName: "Comprehensive In-Lab Polysomnography with Leg EMG",
        plainEnglishName: "Complete Sleep & Movement Study",
        whyNeeded: "Measures exact awakenings, brief micro-arousals (lasting only 3–5 seconds), and involuntary leg muscle twitches.",
        urgency: "Priority"
      },
      {
        testName: "Serum Ferritin & Iron Panel",
        plainEnglishName: "Blood Iron & Ferritin Check",
        whyNeeded: "Low iron stores in the brain are the primary hidden cause of restless leg movements and midnight awakenings.",
        urgency: "Recommended"
      },
      {
        testName: "Thyroid Stimulating Hormone (TSH & Free T4)",
        plainEnglishName: "Thyroid Gland Function Blood Test",
        whyNeeded: "An overactive thyroid (hyperthyroidism) speeds up metabolism and causes heart palpitations and insomnia.",
        urgency: "Routine"
      },
      {
        testName: "14-Day Wrist Actigraphy Sleep Tracking",
        plainEnglishName: "Medical Sleep Watch Monitoring",
        whyNeeded: "Tracks your true sleep-wake schedule across two full weeks to diagnose circadian rhythm misalignment.",
        urgency: "Recommended"
      }
    ],
    actionableGuidance: {
      immediateSteps: [
        "Follow the '20-Minute Rule': If awake in bed for more than 20 minutes, get out of bed, sit in dim light, and read a paper book until sleepy.",
        "Keep the bedroom cool (65°F to 68°F / 18°C to 20°C) and completely pitch-black using blackout curtains.",
        "Stop all caffeine intake after 12:00 PM noon and shut off screens 60 minutes before bed.",
        "Keep your morning wake-up time identical seven days a week, even on weekends."
      ],
      doctorQuestions: [
        "Are my awakenings caused by breathing pauses, leg movements, or nervous system arousals?",
        "Could my ferritin, thyroid, or cortisol levels be disrupting my sleep?",
        "Would Cognitive Behavioral Therapy for Insomnia (CBT-I) be more effective for me than sleeping pills?"
      ],
      specialistToConsult: "Sleep Neurologist & Behavioral Sleep Medicine Psychologist (CBT-I Specialist)"
    }
  },

  // 3. Stage N3 Deep Sleep (SC4102E0)
  "sleep_cassette_sc4102e0": {
    conditionTitle: "Restorative Deep Slow-Wave Sleep (Stage N3)",
    simpleSummary:
      "This test shows optimal, healthy deep sleep. During this phase, the body repairs muscles, strengthens the immune system, flushes toxins out of the brain, and builds long-term memory.",
    whatSignalMeans:
      "The recording displays huge, gentle, synchronized rolling waves called 'Delta waves'. The brain's electrical activity is working in harmony at a calm, low frequency (0.5 to 2 cycles per second).",
    whyNeedsAttention:
      "Stage N3 is the primary physical restoration window where Human Growth Hormone (HGH) is released and the brain's glymphatic system washes away metabolic waste (including beta-amyloid). Sustaining healthy slow-wave sleep is essential to prevent cognitive decline, support athletic recovery, and maintain a robust immune defense.",
    signalAnomaly: {
      status: "optimal",
      statusBadge: "Optimal Synchronized Delta Wave Architecture",
      abnormalLocation: "No pathology detected — Pristine 0.5–2.0 Hz Delta slow-wave synchrony (>75 µV)",
      signalPathologyDescription: "High-voltage, highly synchronized slow Delta waves dominate across frontal and central brain leads with complete physical stillness, representing ideal restorative deep sleep.",
      normalBaselineComparison: "Matches gold-standard American Academy of Sleep Medicine (AASM) criteria for Stage N3 slow-wave sleep."
    },
    thingsToPayAttentionTo: [
      {
        sign: "Heavy grogginess or disorientation for 15–30 minutes if woken abruptly",
        clinicalContext: "Normal 'sleep inertia' caused by waking directly out of deep Delta slow waves; resolves with hydration and morning light.",
        urgency: "Monitor Daily"
      },
      {
        sign: "Inadvertent sleepwalking, confusion, or night terrors (parasomnias)",
        clinicalContext: "Partial arousals out of deep slow-wave sleep; requires clinical evaluation if movements become unsafe.",
        urgency: "Clinical Follow-Up"
      },
      {
        sign: "Sudden drop in daytime stamina despite long total hours in bed",
        clinicalContext: "May signal reduction in slow-wave percentage due to alcohol, stress, or age.",
        urgency: "Monitor Daily"
      }
    ],
    realTreatments: [
      {
        treatmentName: "Sleep Architecture Preservation Protocol",
        category: "Behavioral & Neuro-Regulation",
        howItWorks: "Maintaining a strict consistent sleep-wake schedule and avoiding evening alcohol (which suppresses delta wave generation by >40%).",
        evidenceBase: "AASM Standard Sleep Hygiene & Recovery Guidelines"
      },
      {
        treatmentName: "Thermal Regulation & Bedroom Cooling",
        category: "Clinical Device / Appliance",
        howItWorks: "Keeping sleep room temperature between 65°F–68°F (18°C–20°C) to support the natural 1°C core body temperature drop required for deep slow-wave generation.",
        evidenceBase: "Clinical Chronobiology & Thermoregulation Standards"
      },
      {
        treatmentName: "Adenosine Building Daytime Exercise",
        category: "Behavioral & Neuro-Regulation",
        howItWorks: "30–45 minutes of moderate aerobic or resistance training completed at least 3 hours before bed to maximize daytime adenosine breakdown and slow-wave depth.",
        evidenceBase: "Sports Medicine & Sleep Quality Consensus"
      }
    ],
    causes: [
      {
        title: "Normal Healthy Sleep Cycle Architecture",
        description: "Occurs naturally in the first half of the night when physical recovery demand is highest."
      },
      {
        title: "Physical Exercise & Energy Expenditure",
        description: "Active days with good physical exertion increase the brain's adenosine levels, driving deeper slow-wave sleep."
      },
      {
        title: "Consistent Bedtime Habits",
        description: "Going to bed at the same time allows your internal body clock to cleanly enter deep restorative stages."
      },
      {
        title: "Quiet, Dark Sleeping Environment",
        description: "An undisturbed setting keeps the brain from being startled into lighter sleep stages."
      }
    ],
    symptoms: [
      {
        title: "Deep Physical Stillness",
        description: "The body is completely still with very steady, slow breathing and lowered heart rate."
      },
      {
        title: "Hard to Wake Up From",
        description: "If an alarm goes off during this stage, you feel briefly disoriented or 'sleep drunk' (sleep inertia) for a few minutes."
      },
      {
        title: "Waking Refreshed in the Morning",
        description: "When this stage completes properly, you wake up feeling physically restored and energetic."
      },
      {
        title: "Strong Immune & Muscle Recovery",
        description: "Your body is actively releasing human growth hormone (HGH) to heal daily tissue wear."
      }
    ],
    requiredTests: [
      {
        testName: "Routine Sleep Hygiene & Wellness Assessment",
        plainEnglishName: "Lifestyle Sleep Wellness Check",
        whyNeeded: "Confirms that you are getting adequate percentages (typically 15–25% of the night) of deep slow-wave sleep.",
        urgency: "Routine"
      },
      {
        testName: "Basic Annual Metabolic Blood Panel",
        plainEnglishName: "Annual General Health Blood Screen",
        whyNeeded: "Maintains optimal electrolyte, vitamin D, and kidney balance to preserve natural restorative sleep cycles.",
        urgency: "Routine"
      }
    ],
    actionableGuidance: {
      immediateSteps: [
        "Continue maintaining your regular sleep and wake schedule.",
        "Engage in 30 minutes of moderate physical activity during the day (avoid heavy workouts 2 hours before bed).",
        "Ensure your bedroom stays dark, cool, and peaceful to protect these deep sleep windows."
      ],
      doctorQuestions: [
        "Am I spending an appropriate percentage of my night in deep slow-wave sleep for my age group?",
        "Are there any signs of sleep arousals interrupting my deep sleep cycles?"
      ],
      specialistToConsult: "General Physician / Primary Care Doctor"
    }
  },

  // 4. Stage N2 Light/Stable Sleep (SC4002E0)
  "sleep_cassette_sc4002e0": {
    conditionTitle: "Stable Baseline NREM Sleep (Stage N2)",
    simpleSummary:
      "This test captures Stage N2 sleep, which makes up about 50% of a healthy adult's night. The brain uses this stage to protect sleep from outside noises and organize new memories from the day.",
    whatSignalMeans:
      "The signal shows two healthy signature patterns: 'Sleep Spindles' (quick, rhythmic 12–14 Hz ripples) and 'K-Complexes' (tall, sharp hill-and-valley waves). These act like a natural sound muffler for your brain.",
    whyNeedsAttention:
      "While Stage N2 is an important transitional stage, spending excessive portions of the night stuck in light sleep without deepening into Stage N3 slow-wave sleep or REM results in chronic unrefreshing sleep syndrome, daytime fatigue, cognitive sluggishness, and increased vulnerability to waking from trivial sounds.",
    signalAnomaly: {
      status: "caution",
      statusBadge: "Borderline / Light Sleep Stage N2",
      abnormalLocation: "Sub-optimal sleep spindle density (11–16 Hz) and prominent theta background (4–7 Hz)",
      signalPathologyDescription: "The signal reflects transitional Stage N2 sleep with K-complexes and sleep spindles. If prolonged without transition to Stage N3 deep sleep, it indicates shallow sleep fragility susceptible to acoustic awakening.",
      normalBaselineComparison: "Healthy sleep transitions smoothly every 90 minutes from Stage N2 into deep Stage N3 slow-wave repair and REM dreaming."
    },
    thingsToPayAttentionTo: [
      {
        sign: "Waking up easily from minor room sounds, pet movements, or distant traffic",
        clinicalContext: "Indicates fragile sensory gating and low sleep spindle density.",
        urgency: "Monitor Daily"
      },
      {
        sign: "Feeling like you were 'half-awake' dreaming or resting all night",
        clinicalContext: "Common symptom of alpha-delta intrusion during light Stage N2 sleep.",
        urgency: "Clinical Follow-Up"
      },
      {
        sign: "Mid-afternoon energy dips requiring caffeine or sugary snacks to stay functional",
        clinicalContext: "Reflects lack of progression into deep restorative sleep stages.",
        urgency: "Monitor Daily"
      }
    ],
    realTreatments: [
      {
        treatmentName: "Acoustic Sound Masking & White/Pink Noise Conditioning",
        category: "Clinical Device / Appliance",
        howItWorks: "Generates constant, broad-frequency soundscapes to raise the auditory baseline, preventing sudden environmental noises from triggering cortical arousals during spindle phases.",
        evidenceBase: "AASM Behavioral Environmental Guidelines"
      },
      {
        treatmentName: "Adenosine Sleep-Drive Optimization",
        category: "Behavioral & Neuro-Regulation",
        howItWorks: "Eliminates afternoon naps longer than 20 minutes and enforces regular morning wake times to deepen homeostatic drive from Stage N2 into Stage N3.",
        evidenceBase: "Behavioral Sleep Medicine Best Practices"
      },
      {
        treatmentName: "Clinical Medication Audit with Prescribing Physician",
        category: "Medical Specialist Care",
        howItWorks: "Review of prescription medications (e.g. beta-blockers, stimulating SSRIs, decongestants) that may suppress sleep spindles or inhibit deep sleep progression.",
        evidenceBase: "Clinical Pharmacotherapy Review Protocol"
      }
    ],
    causes: [
      {
        title: "Core Adult Sleep Architecture",
        description: "The normal bridge between light initial sleep and deep slow-wave or dream sleep."
      },
      {
        title: "Memory Consolidation Mechanisms",
        description: "The thalamus and cortex are actively filing away facts, motor skills, and daily learnings."
      },
      {
        title: "Healthy Sensory Gating",
        description: "Your brain actively suppresses minor household noises so you don't wake up unnecessarily."
      },
      {
        title: "Relaxed Muscle & Cardiovascular Tone",
        description: "Heart rate and blood pressure drop gently into a healthy resting rhythm."
      }
    ],
    symptoms: [
      {
        title: "Calm, Steady Breathing",
        description: "Breathing becomes slow and rhythmic as consciousness transitions away from the external room."
      },
      {
        title: "Decreased Body Temperature",
        description: "Your core temperature drops by 1–2 degrees Fahrenheit to support metabolic conservation."
      },
      {
        title: "Easy to Wake Up Feeling Alert",
        description: "If woken during Stage N2, you typically feel reasonably alert without heavy disorientation."
      },
      {
        title: "No Awareness of Minor Background Sounds",
        description: "Whispering or quiet distant traffic doesn't wake you thanks to sleep spindles."
      }
    ],
    requiredTests: [
      {
        testName: "Standard Overnight Polysomnogram Evaluation",
        plainEnglishName: "Standard Sleep Architecture Check",
        whyNeeded: "Confirms normal density of sleep spindles and K-complexes, which indicate a resilient nervous system.",
        urgency: "Routine"
      }
    ],
    actionableGuidance: {
      immediateSteps: [
        "Aim for 7 to 8.5 hours total sleep opportunity each night to allow complete cycles.",
        "Keep bedroom temperatures around 66°F (19°C) to help your body drop into Stage N2 smoothly.",
        "Avoid alcohol before sleep, as it damages spindle generation and fragments the second half of the night."
      ],
      doctorQuestions: [
        "Is my Stage N2 duration balanced with my deep and REM sleep stages?",
        "Are there any signs of sudden micro-awakenings during my lighter sleep stages?"
      ],
      specialistToConsult: "Primary Care Physician or Sleep Specialist"
    }
  },

  // 5. Stage REM (ST7121J0)
  "sleep_telemetry_st7121j0": {
    conditionTitle: "Active Dream Sleep (Stage REM - Rapid Eye Movement)",
    simpleSummary:
      "This test captures Stage REM, the phase where vivid dreaming happens. Your brain is as electrically active as when you are awake, but your voluntary muscles are completely relaxed (temporarily paralyzed) so you do not physically act out your dreams.",
    whatSignalMeans:
      "The brain waves look fast and irregular with characteristic 'sawtooth' patterns. The eye sensor (EOG) detects rapid side-to-side darting movements, while the chin sensor (EMG) shows near-zero muscle tension.",
    whyNeedsAttention:
      "REM sleep is essential for emotional memory consolidation, threat de-escalation, mood stability, and neuroplasticity. Crucially, your brain must maintain total skeletal muscle paralysis (atonia). If atonia fails, individuals can physically act out dreams, causing severe trauma, falls, or injury to themselves and their bed partner.",
    signalAnomaly: {
      status: "caution",
      statusBadge: "REM Dream State / Muscle Atonia Telemetry",
      abnormalLocation: "Desynchronized low-voltage saw-tooth EEG waves with muscle atonia fluctuations",
      signalPathologyDescription: "Fast, desynchronized cortical EEG signals with characteristic saw-tooth waves alongside transient twitches. If chin EMG registers persistent muscle tone or movement spikes, it flags potential REM motor disinhibition.",
      normalBaselineComparison: "Normal REM exhibits high cortical EEG activity, bursts of rapid eye movements (EOG), and complete muscle paralysis (atonia) on EMG."
    },
    thingsToPayAttentionTo: [
      {
        sign: "Kicking, punching, flailing, or leaping out of bed during vivid dreams",
        clinicalContext: "Critical red flag for REM Sleep Behavior Disorder (RBD), requiring immediate neurological workup.",
        urgency: "Immediate Medical Attention"
      },
      {
        sign: "Waking up fully conscious but completely unable to move or speak for 30–60 seconds",
        clinicalContext: "Sleep paralysis — harmless but distressing intrusion of REM atonia into wakefulness.",
        urgency: "Clinical Follow-Up"
      },
      {
        sign: "Frequent terrifying nightmares or waking up in cold sweat with rapid breathing",
        clinicalContext: "Indicates autonomic stress overload interfering with REM emotional processing.",
        urgency: "Clinical Follow-Up"
      }
    ],
    realTreatments: [
      {
        treatmentName: "Video-Polysomnography with Full-Limb Electromyography",
        category: "First-Line Medical Therapy",
        howItWorks: "Hospital-grade sleep recording with synchronized video and limb sensors to definitively verify whether muscle paralysis is intact.",
        evidenceBase: "AASM Clinical Diagnostic Standard for REM Disorders"
      },
      {
        treatmentName: "Neurologist-Prescribed Pharmacotherapy (High-Dose Melatonin / Clonazepam)",
        category: "Medical Specialist Care",
        howItWorks: "High-dose pharmaceutical melatonin (3–12 mg) or low-dose clonazepam prescribed specifically by a neurologist to restore brainstem motor inhibition.",
        evidenceBase: "AASM Practice Guideline for REM Sleep Behavior Disorder"
      },
      {
        treatmentName: "Imagery Rehearsal Therapy (IRT) for Nightmare Disorder",
        category: "Behavioral & Neuro-Regulation",
        howItWorks: "Evidence-based cognitive protocol where recurring nightmares are scripted into new, peaceful outcomes and rehearsed mentally during daytime relaxation.",
        evidenceBase: "APA & AASM Standard Treatment for Chronic Nightmares"
      },
      {
        treatmentName: "Bedroom Physical Safety Modifications",
        category: "Clinical Device / Appliance",
        howItWorks: "Removing bedside furniture with sharp corners, padding bedside flooring, and installing soft bed rails to prevent sleep-related injury.",
        evidenceBase: "Clinical Neurological Safety Protocol"
      }
    ],
    causes: [
      {
        title: "Normal Circadian REM Cycling",
        description: "Occurs roughly every 90 minutes throughout the night, becoming longer and richer in the early morning hours."
      },
      {
        title: "Emotional Processing & Creative Problem-Solving",
        description: "The amygdala and visual brain areas process emotions, reduce stress reactivity, and connect creative ideas."
      },
      {
        title: "Brainstem Muscle Inhibition (Atonia)",
        description: "Specialized neurons in the pons switch off spinal motor signals, safely immobilizing your arms and legs."
      },
      {
        title: "Acetylcholine Neurotransmitter Surges",
        description: "Chemical surges stimulate vivid visual scenery inside your sleeping brain."
      }
    ],
    symptoms: [
      {
        title: "Vivid Dreams & Storylines",
        description: "Experiencing detailed, story-like dreams that feel real while you are in them."
      },
      {
        title: "Rapid Fluttering Eye Movements",
        description: "Eyes darting back and forth behind closed eyelids as you 'look' at dream imagery."
      },
      {
        title: "Temporary Heavy Body Immobility",
        description: "Feeling completely limp and unable to move immediately upon drifting into or out of dreaming."
      },
      {
        title: "Fluctuating Heart & Breathing Rate",
        description: "Breathing and pulse speed up or slow down in tandem with the emotional intensity of your dream."
      }
    ],
    symptoms_alert: "If a patient physically kicks, punches, shouts, or leaps out of bed during dreams, this may indicate REM Sleep Behavior Disorder (RBD), which requires immediate neurological evaluation.",
    requiredTests: [
      {
        testName: "Video-Polysomnography with Synchronized Chin & Limb EMG",
        plainEnglishName: "Video Sleep & Muscle Tone Study",
        whyNeeded: "Essential if you thrash or yell in sleep; verifies whether your muscle-paralysis switch is working safely.",
        urgency: "Recommended"
      },
      {
        testName: "Multiple Sleep Latency Test (MSLT)",
        plainEnglishName: "Daytime Nap Test (Narcolepsy Screen)",
        whyNeeded: "Measures whether you fall directly into REM sleep during brief daytime naps, which checks for narcolepsy.",
        urgency: "Routine"
      }
    ],
    actionableGuidance: {
      immediateSteps: [
        "Do not cut your sleep short by waking up at 4 AM or 5 AM; the final two hours of sleep contain over 60% of your daily REM sleep.",
        "Ensure your sleeping area is free of sharp objects or tripping hazards if you ever experience vivid dream movements.",
        "Limit alcohol before bed, as alcohol completely suppresses REM sleep and causes vivid rebound nightmares when it wears off."
      ],
      doctorQuestions: [
        "Is my REM sleep muscle paralysis intact, or do my chin and limbs show unusual movement?",
        "Am I spending the expected 20–25% of my night in REM dream sleep?"
      ],
      specialistToConsult: "Sleep Neurologist"
    }
  },

  // 6. Acute Mental Arithmetic Stress (SAM-40)
  "sam40_sub01_math_stress": {
    conditionTitle: "Acute Mental Arithmetic & High Cognitive Workload Stress",
    simpleSummary:
      "This test shows the brain under immediate mental strain from difficult, timed math calculations. The brain's working memory is pushed to its limit, triggering a temporary surge in mental tension and fast electrical rhythms.",
    whatSignalMeans:
      "Calm, relaxing 10 Hz 'Alpha' waves disappear (a process called alpha-blocking) and are replaced by fast, buzzing 20–26 Hz 'Beta' waves across the left frontal forehead (F3 sensor), showing high mental effort.",
    whyNeedsAttention:
      "Prolonged frontal hyper-metabolic Beta bursts indicate acute sympathetic nervous system overdrive ('fight-or-flight' lock). Sustained overload exhausts adrenal reserves, causes blood pressure surges, triggers gastrointestinal distress, and leads to cognitive burnout and impaired executive decision-making.",
    signalAnomaly: {
      status: "abnormal",
      statusBadge: "Abnormal Frontal Beta Surge & Sympathetic Overdrive",
      abnormalLocation: "Frontal lead (F3/F4) excessive Beta (18–30 Hz) & Low-Gamma power with suppression of resting Alpha (8–12 Hz)",
      signalPathologyDescription: "Electrophysiological recording exhibits marked bilateral frontal beta desynchronization, severe suppression of restful alpha rhythms, and ECG tachycardia with blunted vagal HRV (RMSSD < 18 ms).",
      normalBaselineComparison: "Calm cognitive readiness maintains dominant occipital-parietal Alpha waves (8–12 Hz, >30 µV) and resilient heart rate variability (RMSSD > 35 ms)."
    },
    thingsToPayAttentionTo: [
      {
        sign: "Sudden chest tightness, pounding heart, or shortness of breath during mental tasks",
        clinicalContext: "Sympathetic nervous system tachycardia driven by acute mental stress hormones.",
        urgency: "Immediate Medical Attention"
      },
      {
        sign: "Clenched jaw (bruxism), tension headaches behind eyes, or trembling fingers",
        clinicalContext: "Somatic motor manifestation of continuous high-frequency Beta brain wave firing.",
        urgency: "Monitor Daily"
      },
      {
        sign: "Mental paralysis, stumbling over words, or inability to make executive decisions",
        clinicalContext: "Sign of prefrontal cortex working-memory depletion under cognitive pressure.",
        urgency: "Clinical Follow-Up"
      },
      {
        sign: "Inability to calm down or relax hours after the mental stressor has ended",
        clinicalContext: "Autonomic nervous system failing to switch back to parasympathetic recovery mode.",
        urgency: "Clinical Follow-Up"
      }
    ],
    realTreatments: [
      {
        treatmentName: "Resonant Frequency HRV Biofeedback Training",
        category: "Behavioral & Neuro-Regulation",
        howItWorks: "Real-time biometric training pacing respiration at 0.1 Hz (~6 breaths per minute) to stimulate the baroreflex and vagus nerve, rapidly suppressing frontal Beta spikes.",
        evidenceBase: "AAPB Level 5 Evidence — Efficacious and Specific for Autonomic Strain"
      },
      {
        treatmentName: "4-Point Diurnal Salivary Cortisol & DHEA Panel",
        category: "First-Line Medical Therapy",
        howItWorks: "Physician-ordered diagnostic saliva testing measuring morning, noon, evening, and bedtime cortisol to diagnose Hypothalamic-Pituitary-Adrenal (HPA) axis fatigue.",
        evidenceBase: "Endocrine Society Clinical Practice Guidelines"
      },
      {
        treatmentName: "Cognitive Stress Inoculation & Pacing Therapy",
        category: "Behavioral & Neuro-Regulation",
        howItWorks: "Structured psychological training to restructure catastrophic performance beliefs and implement neuro-ergonomic focus/rest intervals.",
        evidenceBase: "APA Practice Guideline for Occupational Stress Management"
      },
      {
        treatmentName: "Cardioselective Beta-Blocker Medical Consultation (e.g. Propranolol)",
        category: "Medical Specialist Care",
        howItWorks: "Evaluation by a physician for short-term, targeted autonomic stabilization to block somatic adrenaline receptors during severe sympathetic surges.",
        evidenceBase: "Clinical Pharmacological Protocol for Somatic Stress"
      }
    ],
    causes: [
      {
        title: "Intense Mental Calculation & Time Pressure",
        description: "Pushing working memory to rapidly calculate numbers while being timed."
      },
      {
        title: "Performance Pressure & Test Anxiety",
        description: "Fear of making a mistake triggers the body's sympathetic 'fight-or-flight' adrenaline response."
      },
      {
        title: "Frontal Cortex Energy Overdrive",
        description: "Brain cells in the prefrontal cortex fire rapidly in unsynchronized patterns to process complex logic."
      },
      {
        title: "Mental Fatigue & Multitasking",
        description: "Trying to manage multiple tasks simultaneously without taking mental pauses."
      }
    ],
    symptoms: [
      {
        title: "Forehead Tension & Eye Strain",
        description: "A tight feeling across the temples, furrowed eyebrows, or squinting during intense concentration."
      },
      {
        title: "Increased Heart Rate & Shallow Breathing",
        description: "Unconsciously holding your breath or taking quick, shallow chest breaths while solving difficult problems."
      },
      {
        title: "Mental Exhaustion & Decreased Patience",
        description: "Feeling drained, irritable, or impatient after 30 to 60 minutes of uninterrupted mental strain."
      },
      {
        title: "Restless Fidgeting or Jaw Clenching",
        description: "Tapping feet, clenching teeth, or shifting nervously in your chair."
      }
    ],
    requiredTests: [
      {
        testName: "Standardized Cognitive Stress Assessment & Working Memory Evaluation",
        plainEnglishName: "Cognitive Load & Focus Evaluation",
        whyNeeded: "Evaluates your executive focus, memory fatigue threshold, and mental burnout indicators.",
        urgency: "Routine"
      },
      {
        testName: "Salivary Cortisol & Alpha-Amylase Stress Panel",
        plainEnglishName: "Saliva Stress Hormone Test",
        whyNeeded: "Measures whether your daily stress hormones peak and recover properly throughout a demanding workday.",
        urgency: "Recommended"
      },
      {
        testName: "Ambulatory Blood Pressure & Heart Rate Variability (HRV) Screen",
        plainEnglishName: "24-Hour Heart & Blood Pressure Tracking",
        whyNeeded: "Checks whether mental work spikes your blood pressure or suppresses healthy heart rhythm flexibility.",
        urgency: "Routine"
      }
    ],
    actionableGuidance: {
      immediateSteps: [
        "Practice the '20-20-20 Rule' and the Pomodoro method: take a 5-minute break every 25 minutes of deep focus.",
        "Use 'Box Breathing' (inhale 4 seconds, hold 4 seconds, exhale 4 seconds, hold 4 seconds) to immediately calm rapid brainwaves.",
        "Step away from your desk, stretch your neck and shoulders, and drink a large glass of water to relieve forehead tension."
      ],
      doctorQuestions: [
        "Does my brain return quickly to calm Alpha waves after mental tasks, or does high Beta tension linger?",
        "Are my cardiovascular markers (blood pressure and heart rate) staying safe during high-stress work?"
      ],
      specialistToConsult: "Neuropsychologist / Occupational Health Specialist"
    }
  },

  // 7. Student Stroop Cognitive Conflict Stress
  "student_sub11_stroop_stress": {
    conditionTitle: "Cognitive Conflict & High Mental Interference Overload",
    simpleSummary:
      "This test reflects mental conflict (tested via the Stroop color-word test, where the word 'BLUE' is written in red ink). The brain has to actively fight off its automatic impulse to read the word, creating intense mental friction.",
    whatSignalMeans:
      "The midline forehead sensor (Fz) detects strong 'Frontal Midline Theta' waves along with high-frequency Beta spikes. This confirms the brain's error-detection and conflict-resolution network is working overtime.",
    whyNeedsAttention:
      "Repeated cognitive conflict crashes prefrontal working memory and depletes Anterior Cingulate Cortex (ACC) glucose reserves, leading to severe error vulnerability, academic burnout, micro-blackouts, sensory hypersensitivity, and chronic tension headaches.",
    signalAnomaly: {
      status: "abnormal",
      statusBadge: "Abnormal Anterior Cingulate Overload & Midline Theta Surge",
      abnormalLocation: "Frontal Midline sensor (Fz) intense Theta (4–7 Hz) power surge with concurrent temporal-parietal Beta synchronization",
      signalPathologyDescription: "Signal reveals erratic bursts of high-amplitude Frontal Midline Theta (Fm-theta) coupled with sudden galvanic skin response (GSR) surges, reflecting intense neural friction in error-monitoring networks.",
      normalBaselineComparison: "Stable, organized low-variability theta rhythms with smooth autonomic baseline and balanced bilateral hemispheric activity."
    },
    thingsToPayAttentionTo: [
      {
        sign: "Momentary cognitive freezing or repeating errors on simple, familiar tasks",
        clinicalContext: "Indicates anterior cingulate cortex fatigue and executive resource depletion.",
        urgency: "Clinical Follow-Up"
      },
      {
        sign: "Dull, tight band of pressure wrapping around forehead and temples (tension headache)",
        clinicalContext: "Direct outcome of sustained squinting, facial motor clenching, and cognitive friction.",
        urgency: "Monitor Daily"
      },
      {
        sign: "Sudden emotional frustration, tearfulness, or intense irritation when multi-tasking",
        clinicalContext: "Signals loss of prefrontal emotional inhibition due to cognitive exhaustion.",
        urgency: "Clinical Follow-Up"
      },
      {
        sign: "Consuming escalating amounts of energy drinks, high-dose caffeine, or study stimulants",
        clinicalContext: "Increases cortical irritability and worsens the post-stimulant cognitive crash.",
        urgency: "Immediate Medical Attention"
      }
    ],
    realTreatments: [
      {
        treatmentName: "Neuro-Ergonomic Pomodoro & Physiological Sigh Protocol",
        category: "Behavioral & Neuro-Regulation",
        howItWorks: "Strict 25-minute focus blocks separated by 5 minutes of physiological sighs (two quick nasal inhales followed by one long, slow mouth exhale) to restore prefrontal metabolic reserves.",
        evidenceBase: "Clinical Neuroergonomics & Stanford Neurobiology Protocol"
      },
      {
        treatmentName: "Quantitative EEG (qEEG) Brain Mapping Evaluation",
        category: "Medical Specialist Care",
        howItWorks: "Clinical 19-channel EEG brain mapping to calculate Theta/Beta power ratios, ruling out underlying ADHD, executive dysregulation, or learning processing deficits.",
        evidenceBase: "American Academy of Neurology Clinical Diagnostic Protocol"
      },
      {
        treatmentName: "Mindfulness-Based Cognitive Therapy (MBCT)",
        category: "Behavioral & Neuro-Regulation",
        howItWorks: "Teaches patients to decouple emotional reactivity from challenging cognitive stimuli, reducing anterior cingulate friction by >30%.",
        evidenceBase: "NICE Recommended Guideline for Cognitive Overload"
      },
      {
        treatmentName: "Nutritional & Neurochemical Screen (Serum B12, Folate, Complete Blood Count)",
        category: "First-Line Medical Therapy",
        howItWorks: "Laboratory blood screening to eliminate micronutrient and neurotransmitter cofactor deficiencies that impair neural transmission speed.",
        evidenceBase: "Clinical Biochemical Assessment Guidelines"
      }
    ],
    causes: [
      {
        title: "Sensory & Informational Overload",
        description: "Processing conflicting inputs or navigating confusing, high-stakes decisions under tight deadlines."
      },
      {
        title: "Impulse Suppression & Mental Filtering",
        description: "The anterior cingulate cortex burning glucose to stop you from making an automatic, instinctive mistake."
      },
      {
        title: "Exam Stress & Academic Overwhelm",
        description: "Prolonged study sessions without restorative downtime, leading to cognitive fatigue."
      },
      {
        title: "Excessive Caffeine & Energy Drink Consumption",
        description: "High doses of stimulants increase neural irritability and exacerbate cognitive jitteriness."
      }
    ],
    symptoms: [
      {
        title: "Mental 'Stall' or Brain Freezing",
        description: "A momentary pause or stumbling when trying to switch quickly between tasks or recall basic words."
      },
      {
        title: "Tension Headaches Around the Crown",
        description: "A dull band of pressure wrapping around the top and forehead area after studying or problem-solving."
      },
      {
        title: "Difficulty Making Simple Decisions",
        description: "Feeling overwhelmed by small choices (like what to eat) because your mental filter is exhausted."
      },
      {
        title: "Emotional Frustration & Short Temper",
        description: "Snapping at friends or family members due to cognitive fatigue reducing your patience."
      }
    ],
    requiredTests: [
      {
        testName: "Computerized Neuropsychological Attention Battery (e.g., Continuous Performance Test)",
        plainEnglishName: "Computerized Focus & Attention Test",
        whyNeeded: "Measures your sustained attention, reaction speed, and susceptibility to distraction or impulse errors.",
        urgency: "Routine"
      },
      {
        testName: "Serum Vitamin B12, Folate & Complete Blood Count (CBC)",
        plainEnglishName: "B-Vitamin & Anemia Blood Work",
        whyNeeded: "Vitamin B12 deficiencies directly impair cognitive processing speed, focus, and mental stamina.",
        urgency: "Routine"
      },
      {
        testName: "GAD-7 / PHQ-9 Clinical Anxiety and Mood Screen",
        plainEnglishName: "Standard Psychological Wellbeing Questionnaire",
        whyNeeded: "Screens for underlying academic anxiety or depression that amplifies cognitive overload.",
        urgency: "Recommended"
      }
    ],
    actionableGuidance: {
      immediateSteps: [
        "Take a brisk 10-minute walk outside in natural sunlight; physical movement clears cognitive fatigue faster than sitting.",
        "Cut back on caffeine and high-sugar energy drinks, which spike cognitive jitteriness and worsen brain crashes.",
        "Break complex study materials into small 15-minute chunks rather than attempting marathon 4-hour cramming sessions."
      ],
      doctorQuestions: [
        "Are my symptoms typical for temporary academic stress, or is there an underlying attention deficit or anxiety pattern?",
        "What lifestyle modifications can help strengthen my cognitive stamina without relying on stimulants?"
      ],
      specialistToConsult: "Educational Psychologist / Student Health Counselor"
    }
  },

  // 8. DASPS High State Anxiety Paroxysm
  "dasps_s01_high_anxiety": {
    conditionTitle: "Acute Emotional Anxiety Spike (State Anxiety Paroxysm)",
    simpleSummary:
      "This test captures a sudden spike of acute psychological anxiety or panic. The emotional centers of the brain (the limbic system) have temporarily hijacked the conscious thinking areas, triggering a fight-or-flight emergency alert.",
    whatSignalMeans:
      "The left and right forehead sensors (Fp1 & Fp2) show an intense imbalance, with jagged high-frequency waves and rapid eye flutters. The brain is scanning frantically for perceived threats.",
    whyNeedsAttention:
      "Right-frontal cortical hyperactivity combined with vagal parasympathetic withdrawal leaves the autonomic nervous system defenseless against panic attacks, chronic tachycardia, hyperventilation, gastrointestinal inflammation, and crippling agoraphobic avoidance.",
    signalAnomaly: {
      status: "abnormal",
      statusBadge: "Abnormal Right-Frontal Asymmetry & Vagal Withdrawal",
      abnormalLocation: "Right hemisphere hyperactivation (Alpha asymmetry F4 < F3) with prominent Gamma oscillations (>35 Hz)",
      signalPathologyDescription: "Marked electrophysiological right-frontal hyper-activation paired with severe parasympathetic vagal withdrawal (LF/HF ratio > 4.5), reflecting acute neurochemical distress and panic vulnerability.",
      normalBaselineComparison: "Balanced bilateral frontal alpha power (F3/F4 ratio ~ 1.0) with robust respiratory sinus arrhythmia (parasympathetic vagal engagement)."
    },
    thingsToPayAttentionTo: [
      {
        sign: "Acute panic surge: pounding heart, dizziness, numb/tingling fingers, feeling like passing out",
        clinicalContext: "Acute panic attack accompanied by hyperventilation and respiratory alkalosis.",
        urgency: "Immediate Medical Attention"
      },
      {
        sign: "Persistent sense of impending doom, uncontrollable catastrophic worry lasting months",
        clinicalContext: "Indicates continuous limbic amygdala firing without cortical prefrontal inhibition.",
        urgency: "Clinical Follow-Up"
      },
      {
        sign: "Chronic gastrointestinal distress (nausea, cramping, irritable bowel flare-ups)",
        clinicalContext: "Direct consequence of the gut-brain axis shutting down digestive blood flow during fear states.",
        urgency: "Clinical Follow-Up"
      },
      {
        sign: "Avoiding social, work, or public environments out of fear of having an episode",
        clinicalContext: "Development of agoraphobic avoidance behavior requiring specialized clinical therapy.",
        urgency: "Clinical Follow-Up"
      }
    ],
    realTreatments: [
      {
        treatmentName: "Cognitive Behavioral Therapy for Panic & Anxiety (CBT)",
        category: "Behavioral & Neuro-Regulation",
        howItWorks: "Gold-standard structured psychotherapy using interoceptive exposure (gradually desensitizing harmless physical sensations) and cognitive restructuring of catastrophic misinterpretations.",
        evidenceBase: "APA & NICE Clinical Practice Guidelines — Gold Standard First-Line Treatment"
      },
      {
        treatmentName: "Medical Evaluation for SSRI / SNRI Pharmacotherapy",
        category: "First-Line Medical Therapy",
        howItWorks: "Evaluation by a psychiatrist or primary care physician for evidence-based neurochemical stabilization (e.g. escitalopram, sertraline) to balance serotonin-norepinephrine pathways.",
        evidenceBase: "APA Practice Guidelines for Major Anxiety & Panic Disorders"
      },
      {
        treatmentName: "Autonomic Vagus Nerve Stimulation (tVNS) & Somatic Grounding",
        category: "Clinical Device / Appliance",
        howItWorks: "Targeted transcutaneous auricular vagus nerve stimulation devices or diaphragmatic biofeedback to immediately activate the parasympathetic vagal brake and decrease heart rate.",
        evidenceBase: "FDA-Cleared Modalities & Clinical Neurophysiology Standards"
      },
      {
        treatmentName: "12-Lead Ambulatory Holter ECG Monitoring",
        category: "Medical Specialist Care",
        howItWorks: "24-hour continuous cardiac rhythm recording to definitively distinguish benign sinus tachycardia from underlying supraventricular arrhythmias.",
        evidenceBase: "AHA/ACC Clinical Diagnostic Protocol"
      }
    ],
    causes: [
      {
        title: "Fight-or-Flight Adrenaline Surge",
        description: "The amygdala floods the bloodstream with adrenaline and noradrenaline, preparing the body to run or fight."
      },
      {
        title: "Psychological Trigger or Phobia Exposure",
        description: "Encountering a stressful trigger, public speaking, enclosed spaces, or distressing memories."
      },
      {
        title: "Chronic Undiagnosed Generalized Anxiety",
        description: "A baseline nervous system that has been sensitized over weeks or months of unmanaged life pressures."
      },
      {
        title: "Hyperventilation & Respiratory Alkalosis",
        description: "Quick chest breathing lowers blood carbon dioxide, triggering lightheadedness and worsening panic sensations."
      }
    ],
    symptoms: [
      {
        title: "Pounding or Racing Heart (Palpitations)",
        description: "Feeling your heart thumping against your ribcage or fluttering irregularly in your chest."
      },
      {
        title: "Shortness of Breath & Tight Throat",
        description: "A sensation of not being able to draw a satisfying deep breath, or a lump in the throat (globus)."
      },
      {
        title: "Trembling Hands, Chills, or Cold Sweats",
        description: "Shaky fingers, sweaty palms, tingling sensations in lips or fingertips, and sudden temperature shifts."
      },
      {
        title: "Sense of Impending Dread or Panic",
        description: "A powerful urge to escape the room, accompanied by catastrophic thoughts or fear of losing control."
      }
    ],
    requiredTests: [
      {
        testName: "Standard 12-Lead Electrocardiogram (ECG) & Blood Pressure Check",
        plainEnglishName: "Resting Heart Rhythm & Rate Exam",
        whyNeeded: "Rule out heart arrhythmias (like SVT or atrial fibrillation) that can feel identical to a panic attack.",
        urgency: "Priority"
      },
      {
        testName: "Thyroid Function Panel (TSH, Free T3, Free T4)",
        plainEnglishName: "Thyroid Gland Activity Check",
        whyNeeded: "An overactive thyroid gland produces excess hormones that mimic acute anxiety and cause resting tachycardia.",
        urgency: "Recommended"
      },
      {
        testName: "Clinical Anxiety Diagnostic Interview (HAM-A & GAD-7)",
        plainEnglishName: "Formal Anxiety Severity Assessment",
        whyNeeded: "Administered by a licensed mental health clinician to differentiate between panic disorder, social phobia, or situational stress.",
        urgency: "Priority"
      },
      {
        testName: "Comprehensive Metabolic Panel (CMP) & Fasting Blood Sugar",
        plainEnglishName: "Basic Blood Chemistry & Sugar Screen",
        whyNeeded: "Rule out low blood sugar (hypoglycemia) or calcium/electrolyte imbalances that trigger sudden adrenaline rushes.",
        urgency: "Routine"
      }
    ],
    actionableGuidance: {
      immediateSteps: [
        "Use the '5-4-3-2-1 Grounding Method': Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste to pull your brain out of the panic loop.",
        "Perform 'Extended Exhale Breathing': Inhale gently for 4 seconds through your nose, then exhale slowly for 7 seconds through pursed lips.",
        "Splash ice-cold water on your face or hold an ice cube; this stimulates the Vagus nerve to naturally slow your racing pulse.",
        "Avoid caffeine, nicotine, and energy drinks completely until your nervous system rebalances."
      ],
      doctorQuestions: [
        "Is my heart completely healthy and free from rhythm abnormalities?",
        "Could my symptoms be linked to my thyroid, blood sugar, or medications?",
        "What evidence-based psychological therapies (like CBT or Exposure Therapy) do you recommend for my anxiety pattern?"
      ],
      specialistToConsult: "Licensed Clinical Psychologist / Psychiatrist & Board-Certified Cardiologist"
    }
  },

  // 9. Relaxed Baseline (SAM-40 / DASPS Baseline)
  "default_relax_baseline": {
    conditionTitle: "Resting Relaxation Baseline (Healthy Synchronized Rhythm)",
    simpleSummary:
      "This test shows a calm, peaceful brain at rest with eyes gently closed. The nervous system is operating in its 'rest-and-digest' parasympathetic mode, with no acute signs of emotional distress or cognitive strain.",
    whatSignalMeans:
      "The sensor at the back of the head (O1) displays a continuous, rhythmic, wavy 9–11 Hz rhythm known as the 'Alpha rhythm'. This rhythm appears when visual input is stopped and the brain is resting serenely.",
    whyNeedsAttention:
      "Maintaining this calm, restorative neuro-cardiac state protects against degenerative cardiovascular stress, systemic inflammation, and burnout. It represents the healthy biological standard for daytime nervous system resilience.",
    signalAnomaly: {
      status: "optimal",
      statusBadge: "Optimal Restorative Alpha Synchrony",
      abnormalLocation: "No pathology detected — Dominant Occipital Alpha (8–12 Hz) with High Vagal HRV",
      signalPathologyDescription: "Continuous, smooth sinusoidal Alpha waves (8–12 Hz, 40–60 µV) dominating posterior leads with minimal muscle artifact and resilient parasympathetic vagal engagement.",
      normalBaselineComparison: "Benchmark standard for a healthy, relaxed human nervous system."
    },
    thingsToPayAttentionTo: [
      {
        sign: "Sudden difficulty relaxing or persistent restlessness when sitting quietly",
        clinicalContext: "Early warning sign of emerging sympathetic nervous system overdrive.",
        urgency: "Monitor Daily"
      },
      {
        sign: "Gradual sleep disruptions or waking unrefreshed after prior healthy baselines",
        clinicalContext: "Flags an emerging sleep hygiene or stress deficit before it turns into chronic insomnia.",
        urgency: "Monitor Daily"
      },
      {
        sign: "Frequent palpitations or heart fluttering without mental stress",
        clinicalContext: "Requires standard clinical screening to rule out underlying cardiac irregularities.",
        urgency: "Clinical Follow-Up"
      }
    ],
    realTreatments: [
      {
        treatmentName: "Preventive Nervous System Conditioning & Mindfulness",
        category: "Behavioral & Neuro-Regulation",
        howItWorks: "Daily 15–20 minutes of mindfulness meditation or open-monitoring practice to preserve occipital alpha synchrony and down-regulate stress reactivity.",
        evidenceBase: "Clinical Evidence-Based Preventive Health Protocol"
      },
      {
        treatmentName: "Zone 2 Aerobic Conditioning (150 mins/week)",
        category: "Behavioral & Neuro-Regulation",
        howItWorks: "Steady-state aerobic exercise that stimulates mitochondrial density, improves vascular elasticity, and maximizes vagal recovery.",
        evidenceBase: "American Heart Association (AHA) Gold Standard Guidelines"
      },
      {
        treatmentName: "Annual Preventive Medical & Metabolic Physical",
        category: "First-Line Medical Therapy",
        howItWorks: "Regular physician checkup monitoring blood pressure, lipid panel, fasting glucose, and thyroid markers to maintain optimal neuro-vascular balance.",
        evidenceBase: "Standard Preventive Clinical Practice"
      }
    ],
    causes: [
      {
        title: "Resting State with Eyes Closed",
        description: "Shutting the eyelids stops visual data processing, allowing the visual cortex to idle synchronously."
      },
      {
        title: "Parasympathetic Nervous System Dominance",
        description: "The body's natural calming brake (the Vagus nerve) is active, keeping heart rate and respiration smooth."
      },
      {
        title: "Absence of Acute Mental Stressors",
        description: "No active calculation, conflict, or threat detection is demanding frontal brain resources."
      },
      {
        title: "Healthy Cortical Balance",
        description: "Balanced electrical communication between the front and back regions of both brain hemispheres."
      }
    ],
    symptoms: [
      {
        title: "Slow, Steady Resting Heart Rate",
        description: "Pulse is calm and even (typically 60 to 75 beats per minute)."
      },
      {
        title: "Gentle Abdominal Breathing",
        description: "Breathing originates from the diaphragm rather than the upper chest."
      },
      {
        title: "Muscle Softness & Relaxed Jaw",
        description: "Shoulders drop away from the ears, facial muscles soften, and teeth are unclenched."
      },
      {
        title: "Mental Serenity & Clarity",
        description: "Thoughts flow quietly without urgent looping, anxiety, or racing impulses."
      }
    ],
    requiredTests: [
      {
        testName: "Routine Annual Wellness Examination",
        plainEnglishName: "Standard Annual Checkup",
        whyNeeded: "Supports continuous preventive health and keeps track of baseline cardiovascular and metabolic stability.",
        urgency: "Routine"
      }
    ],
    actionableGuidance: {
      immediateSteps: [
        "Maintain regular mindfulness, meditation, or quiet time to reinforce this restorative brain state.",
        "Preserve a consistent sleep-wake schedule to protect your baseline neural balance.",
        "Engage in regular light cardiovascular exercise (like walking or cycling) to keep stress hormones naturally low."
      ],
      doctorQuestions: [
        "Are my baseline resting vitals and EEG rhythms within the optimal range for my age group?"
      ],
      specialistToConsult: "Primary Care Doctor / Wellness Physician"
    }
  }
};

export default function PatientGuidanceSection({
  caseId,
  domain,
  stageOrRisk,
  patientAnonId
}: PatientGuidanceSectionProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "causes" | "symptoms" | "tests" | "actions">("overview");
  const [showDoctorQuestions, setShowDoctorQuestions] = useState(false);

  // Retrieve case-specific info or fallback to domain/relaxation baseline
  let caseData: CaseClinicalInfo;
  if (CLINICAL_KNOWLEDGE_BASE[caseId]) {
    caseData = CLINICAL_KNOWLEDGE_BASE[caseId];
  } else if (caseId.includes("relax") || caseId.includes("base") || stageOrRisk.toLowerCase().includes("baseline")) {
    caseData = CLINICAL_KNOWLEDGE_BASE["default_relax_baseline"];
  } else if (caseId.includes("apnea")) {
    caseData = CLINICAL_KNOWLEDGE_BASE["mitbih_slp01_preapnea_01"];
  } else if (caseId.includes("anxiety")) {
    caseData = CLINICAL_KNOWLEDGE_BASE["dasps_s01_high_anxiety"];
  } else if (caseId.includes("stress")) {
    caseData = CLINICAL_KNOWLEDGE_BASE["sam40_sub01_math_stress"];
  } else if (caseId.includes("telemetry") || stageOrRisk.toLowerCase().includes("wake")) {
    caseData = CLINICAL_KNOWLEDGE_BASE["sleep_telemetry_st7022j0"];
  } else if (stageOrRisk.toLowerCase().includes("n3")) {
    caseData = CLINICAL_KNOWLEDGE_BASE["sleep_cassette_sc4102e0"];
  } else if (stageOrRisk.toLowerCase().includes("rem")) {
    caseData = CLINICAL_KNOWLEDGE_BASE["sleep_telemetry_st7121j0"];
  } else {
    caseData = CLINICAL_KNOWLEDGE_BASE["sleep_cassette_sc4002e0"];
  }

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-slate-900 transition-all">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Patient & Clinical Telemetry Guide
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Case: {patientAnonId || caseId}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {caseData.conditionTitle}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed pt-1">
              {caseData.simpleSummary}
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-1.5 shrink-0 bg-slate-950/40 p-3 rounded-xl border border-slate-700/60">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Current Finding
            </div>
            <div className="text-sm font-bold text-sky-300">
              {stageOrRisk}
            </div>
            <div className="text-[11px] text-slate-400">
              Clinical telemetry translated for patients
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-5 border-t border-slate-700/60 mt-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === "overview"
                ? "bg-sky-500 text-slate-950 font-bold shadow-sm"
                : "bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700"
            }`}
          >
            1. Overview & Signals
          </button>
          <button
            onClick={() => setActiveTab("causes")}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === "causes"
                ? "bg-sky-500 text-slate-950 font-bold shadow-sm"
                : "bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700"
            }`}
          >
            2. Common Causes ({caseData.causes.length})
          </button>
          <button
            onClick={() => setActiveTab("symptoms")}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === "symptoms"
                ? "bg-sky-500 text-slate-950 font-bold shadow-sm"
                : "bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700"
            }`}
          >
            3. What You Might Feel ({caseData.symptoms.length})
          </button>
          <button
            onClick={() => setActiveTab("tests")}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === "tests"
                ? "bg-amber-400 text-slate-950 font-bold shadow-sm"
                : "bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700"
            }`}
          >
            4. Real Tests & Treatments ({caseData.requiredTests.length + caseData.realTreatments.length})
          </button>
          <button
            onClick={() => setActiveTab("actions")}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === "actions"
                ? "bg-emerald-400 text-slate-950 font-bold shadow-sm"
                : "bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700"
            }`}
          >
            5. Doctor Guidance & Steps
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 sm:p-6 bg-slate-50/50">
        {/* TAB 1: OVERVIEW & SIGNAL DIAGNOSTICS */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Plain English Meaning */}
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 sm:p-5 flex items-start gap-3.5">
              <Info className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  What Does This Signal Mean in Everyday Life?
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {caseData.whatSignalMeans}
                </p>
              </div>
            </div>

            {/* Two-Card Grid: Signal Finding + Specialist */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Card 1: Where the signal is not good & Why It Needs Attention */}
              <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Why This Needs Attention</span>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                      caseData.signalAnomaly.status === "abnormal"
                        ? "bg-rose-100 text-rose-800 border-rose-200"
                        : caseData.signalAnomaly.status === "caution"
                        ? "bg-amber-100 text-amber-800 border-amber-200"
                        : "bg-emerald-100 text-emerald-800 border-emerald-200"
                    }`}
                  >
                    {caseData.signalAnomaly.statusBadge}
                  </span>
                </div>

                {/* Where the signal is not good */}
                <div className="p-3.5 rounded-lg bg-rose-50/70 border border-rose-200/80 space-y-1.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-rose-600" />
                    <span>Where The Signal Is Not Good (Waveform Anomaly)</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 leading-snug">
                    {caseData.signalAnomaly.abnormalLocation}
                  </p>
                  <p className="text-[11px] text-slate-700 leading-relaxed pt-0.5">
                    {caseData.signalAnomaly.signalPathologyDescription}
                  </p>
                </div>

                {/* Why it needs medical attention */}
                <div className="text-xs text-slate-700 leading-relaxed pt-0.5">
                  <strong className="text-slate-900">Clinical Justification: </strong>
                  {caseData.whyNeedsAttention}
                </div>
              </div>

              {/* Card 2: Recommended Specialist */}
              <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3.5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                    <Stethoscope className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Recommended Specialist</span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80">
                    <p className="text-xs font-bold text-slate-900 leading-snug">
                      {caseData.actionableGuidance.specialistToConsult}
                    </p>
                    <p className="text-[11px] text-emerald-900 pt-1 leading-relaxed">
                      Consult with this medical specialist to evaluate confirmatory gold-standard tests and discuss evidence-based therapeutic options.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                      Healthy Baseline Comparison
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {caseData.signalAnomaly.normalBaselineComparison}
                    </p>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 pt-1">
                  Share this summary and the exported report with your healthcare team.
                </p>
              </div>
            </div>

            {/* CARD 3: REAL THINGS ON WHICH THE PATIENT NEEDS TO PAY ATTENTION (RED FLAGS) */}
            <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Real Things on Which the Patient Needs to Pay Attention
                  </h3>
                </div>
                <span className="text-[11px] text-slate-500">
                  Critical Physiological Warning Signs & Red Flags
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {caseData.thingsToPayAttentionTo.map((item, idx) => {
                  let badgeStyle = "bg-slate-100 text-slate-700 border-slate-200";
                  if (item.urgency === "Immediate Medical Attention") {
                    badgeStyle = "bg-rose-100 text-rose-900 border-rose-300 font-extrabold";
                  } else if (item.urgency === "Clinical Follow-Up") {
                    badgeStyle = "bg-amber-100 text-amber-900 border-amber-300 font-bold";
                  } else {
                    badgeStyle = "bg-sky-100 text-sky-900 border-sky-300 font-medium";
                  }

                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 leading-snug">
                          {item.sign}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${badgeStyle}`}>
                          {item.urgency}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {item.clinicalContext}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CARD 4: REAL TESTS & REAL TREATMENTS OVERVIEW TEASER */}
            <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xs space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
                    <Pill className="w-4 h-4" />
                    <span>Real Diagnostic Tests & Real Medical Treatments</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white pt-1">
                    {caseData.requiredTests.length} Confirmatory Clinical Tests & {caseData.realTreatments.length} Evidence-Based Therapies
                  </h4>
                  <p className="text-xs text-slate-300 pt-0.5">
                    Clinically validated diagnostic evaluations and physician-directed treatments matching this waveform pattern.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("tests")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-bold transition-all shadow-sm shrink-0"
                >
                  <span>View Full Tests & Treatments</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-700/60 text-xs">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Diagnostic Tests:
                  </div>
                  <ul className="text-slate-200 text-[11px] space-y-0.5">
                    {caseData.requiredTests.slice(0, 2).map((t, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{t.plainEnglishName}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Medical Treatments:
                  </div>
                  <ul className="text-slate-200 text-[11px] space-y-0.5">
                    {caseData.realTreatments.slice(0, 2).map((tr, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="truncate">{tr.treatmentName}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CAUSES */}
        {activeTab === "causes" && (
          <div className="space-y-4">
            <div className="pb-1">
              <h3 className="text-base font-bold text-slate-900">
                Why Does This Happen? (Possible Causes Explained Simply)
              </h3>
              <p className="text-xs text-slate-500">
                Medical conditions rarely have a single cause. Here are the most common physical, anatomical, and lifestyle triggers:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {caseData.causes.map((c, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-sky-300 transition-all space-y-1.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">
                      {c.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-7">
                    {c.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SYMPTOMS */}
        {activeTab === "symptoms" && (
          <div className="space-y-4">
            <div className="pb-1">
              <h3 className="text-base font-bold text-slate-900">
                What a Person Might Feel (Daily Life Symptoms)
              </h3>
              <p className="text-xs text-slate-500">
                These are the physical, emotional, and cognitive signs that often accompany this physiological pattern:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {caseData.symptoms.map((s, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-amber-300 transition-all space-y-1.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">
                      {s.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-7">
                    {s.description}
                  </p>
                </div>
              ))}
            </div>

            {caseData.symptoms_alert && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Important Clinical Observation: </strong>
                  {caseData.symptoms_alert}
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: REAL TESTS & REAL TREATMENTS */}
        {activeTab === "tests" && (
          <div className="space-y-6">
            {/* SECTION 1: REQUIRED DIAGNOSTIC TESTS */}
            <div className="space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-amber-600" />
                    <span>Real Diagnostic Tests for This Condition</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Bring this checklist to your physician to request or verify these formal clinical evaluations:
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full border border-amber-200">
                  Diagnostic Workup ({caseData.requiredTests.length} Tests)
                </span>
              </div>

              <div className="space-y-3">
                {caseData.requiredTests.map((t, idx) => {
                  let badgeColor = "bg-slate-100 text-slate-700 border-slate-200";
                  if (t.urgency === "Priority") {
                    badgeColor = "bg-rose-100 text-rose-800 border-rose-200";
                  } else if (t.urgency === "Recommended") {
                    badgeColor = "bg-amber-100 text-amber-800 border-amber-200";
                  }

                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div>
                            <span className="font-bold text-sm text-slate-900">
                              {t.plainEnglishName}
                            </span>
                            <span className="text-xs text-slate-500 font-mono ml-2">
                              ({t.testName})
                            </span>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                          {t.urgency}
                        </span>
                      </div>

                      <div className="pl-6 text-xs text-slate-600 leading-relaxed">
                        <strong className="text-slate-800">Why your doctor orders this: </strong>
                        {t.whyNeeded}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION 2: REAL MEDICAL TREATMENTS & THERAPIES */}
            <div className="space-y-3.5 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Pill className="w-4 h-4 text-emerald-600" />
                    <span>Real Medical Treatments & Evidence-Based Therapies</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Clinically established medical therapies, devices, and protocols prescribed by physicians for this specific pattern:
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-900 rounded-full border border-emerald-200">
                  Evidence-Based Treatments ({caseData.realTreatments.length})
                </span>
              </div>

              <div className="space-y-3">
                {caseData.realTreatments.map((tr, idx) => {
                  let catBadge = "bg-sky-50 text-sky-800 border-sky-200";
                  if (tr.category === "First-Line Medical Therapy") {
                    catBadge = "bg-rose-50 text-rose-800 border-rose-200";
                  } else if (tr.category === "Clinical Device / Appliance") {
                    catBadge = "bg-amber-50 text-amber-800 border-amber-200";
                  } else if (tr.category === "Medical Specialist Care") {
                    catBadge = "bg-purple-50 text-purple-800 border-purple-200";
                  }

                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                          <span className="font-bold text-sm text-slate-900">
                            {tr.treatmentName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catBadge}`}>
                            {tr.category}
                          </span>
                        </div>
                      </div>

                      <div className="pl-6 text-xs text-slate-600 leading-relaxed space-y-1">
                        <div>
                          <strong className="text-slate-800">How It Works Clinically: </strong>
                          {tr.howItWorks}
                        </div>
                        <div className="text-[11px] text-emerald-800 font-medium bg-emerald-50/60 p-2 rounded-lg border border-emerald-100">
                          <strong>Clinical Evidence: </strong>
                          {tr.evidenceBase}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DOCTOR GUIDANCE & ACTIONABLE STEPS */}
        {activeTab === "actions" && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Patient Action Plan & Medical Guidance
              </h3>
              <p className="text-xs text-slate-500">
                Clear, practical steps you can start today, along with what to ask your doctor:
              </p>
            </div>

            {/* Immediate Steps */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Immediate Self-Care & Lifestyle Steps</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 pl-2">
                {caseData.actionableGuidance.immediateSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Questions for Your Doctor */}
            <div className="bg-slate-900 text-white rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm text-white">
                  <HelpCircle className="w-4 h-4 text-sky-400" />
                  <span>Questions to Ask Your Doctor at Your Next Visit</span>
                </div>
                <button
                  onClick={() => setShowDoctorQuestions(!showDoctorQuestions)}
                  className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1"
                >
                  {showDoctorQuestions ? "Collapse" : "Expand All"}
                </button>
              </div>

              <div className="space-y-2 text-xs text-slate-300 pt-1">
                {caseData.actionableGuidance.doctorQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 flex items-start gap-2.5"
                  >
                    <span className="font-mono text-sky-400 font-bold shrink-0">
                      Q{idx + 1}:
                    </span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Specialist Banner */}
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  <strong>Primary Specialist to Schedule: </strong>
                  {caseData.actionableGuidance.specialistToConsult}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
