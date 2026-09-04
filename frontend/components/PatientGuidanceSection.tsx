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
  Info
} from "lucide-react";

interface PatientGuidanceSectionProps {
  caseId: string;
  domain?: string;
  stageOrRisk: string;
  patientAnonId?: string;
}

interface CaseClinicalInfo {
  conditionTitle: string;
  simpleSummary: string;
  whatSignalMeans: string;
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

const CLINICAL_KNOWLEDGE_BASE: Record<string, CaseClinicalInfo> = {
  // 1. MIT-BIH Pre-Apnea
  "mitbih_slp01_preapnea_01": {
    conditionTitle: "Obstructive Sleep Apnea Warning (Pre-Apnea Airway Collapse)",
    simpleSummary:
      "This test shows moments right before the patient's throat muscles relax too much and briefly block airflow during sleep. The brain is repeatedly struggling to keep the airway open, disrupting normal restful breathing.",
    whatSignalMeans:
      "The brain waves slow down abnormally while the heart rhythm becomes uneven. This shows the body is running low on oxygen and fighting against a blocked windpipe just seconds before a full breathing pause.",
    causes: [
      {
        title: "Throat & Tongue Muscle Relaxation",
        description:
          "During deep relaxation at night, the muscles at the back of the throat collapse backward, partially blocking the windpipe."
      },
      {
        title: "Sleeping Flat on the Back",
        description:
          "Gravity pulls the soft palate and tongue downward, making it much harder for air to flow smoothly into the lungs."
      },
      {
        title: "Nasal or Airway Narrowing",
        description:
          "Enlarged tonsils, a deviated nasal septum, or a naturally narrower neck airway can restrict night-time airflow."
      },
      {
        title: "Evening Alcohol or Sedative Intake",
        description:
          "Substances that relax the central nervous system make airway muscles unusually loose and unresponsive."
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
      specialistToConsult: "Licensed Clinical Psychologist / Psychiatrist & Board-Certified Cardiologist (to rule out heart arrhythmias)"
    }
  },

  // 9. Relaxed Baseline (SAM-40 / DASPS Baseline)
  "default_relax_baseline": {
    conditionTitle: "Resting Relaxation Baseline (Healthy Synchronized Rhythm)",
    simpleSummary:
      "This test shows a calm, peaceful brain at rest with eyes gently closed. The nervous system is operating in its 'rest-and-digest' parasympathetic mode, with no acute signs of emotional distress or cognitive strain.",
    whatSignalMeans:
      "The sensor at the back of the head (O1) displays a continuous, rhythmic, wavy 9–11 Hz rhythm known as the 'Alpha rhythm'. This rhythm appears when visual input is stopped and the brain is resting serenely.",
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
                Patient & Non-Medical Guide
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
              Written in simple, everyday language
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
            1. Plain English Overview
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
            4. Required Medical Tests ({caseData.requiredTests.length})
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
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-rose-600 font-semibold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Why This Needs Attention</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Early detection allows doctors to treat issues before they turn into long-term fatigue, cardiovascular strain, chronic anxiety, or daily burnout.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                  <Stethoscope className="w-4 h-4" />
                  <span>Recommended Specialist</span>
                </div>
                <p className="text-xs font-bold text-slate-900">
                  {caseData.actionableGuidance.specialistToConsult}
                </p>
                <p className="text-[11px] text-slate-500">
                  Share this summary and the exported report with your healthcare team.
                </p>
              </div>
            </div>

            {/* Quick Teaser of Tests & Actions */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <ClipboardList className="w-5 h-5 text-amber-500" />
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {caseData.requiredTests.length} Medical Diagnostic Tests Recommended
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Click tab 4 above to see full details of each test, how it works, and why your doctor orders it.
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("tests")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors"
              >
                <span>View Required Tests</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
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

        {/* TAB 4: REQUIRED MEDICAL TESTS */}
        {activeTab === "tests" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Required Diagnostic Tests for This Condition
                </h3>
                <p className="text-xs text-slate-500">
                  Bring this checklist to your physician to request or verify these formal clinical evaluations:
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full border border-amber-200">
                Diagnostic Workup
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
