"use client";

import React, { useState, useRef } from "react";
import {
  HeartPulse,
  AlertTriangle,
  Stethoscope,
  ClipboardList,
  CheckCircle2,
  HelpCircle,
  Activity,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  Info,
  Pill,
  ShieldAlert,
  Zap,
  Flame
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
  urgency: "Immediate Medical Attention" | "Clinical Follow-Up" | "Monitor Daily" | "Physician Recommended" | "Cognitive Hygiene" | "Autonomic Health" | "Lifestyle Medicine";
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
  // 1. Acute Mental Arithmetic Stress (SAM-40)
  "sam40_sub01_math_stress": {
    conditionTitle: "Acute Mental Arithmetic & High Cognitive Workload Stress",
    simpleSummary:
      "This test captures the brain under immediate mental strain during timed, difficult speed arithmetic. Working memory is pushed to its absolute limit, triggering an acute surge in cortical beta tension and sympathetic arousal.",
    whatSignalMeans:
      "Calm, relaxing 10 Hz 'Alpha' waves disappear (a process called alpha-blocking) and are replaced by fast, buzzing 20–26 Hz 'Beta' waves across the left frontal forehead (F3 sensor), showing intense cognitive effort.",
    whyNeedsAttention:
      "Prolonged frontal hyper-metabolic Beta bursts indicate acute sympathetic nervous system overdrive ('fight-or-flight' lock). Sustained cognitive overload over-activates adrenal output, causes blood pressure surges, exhausts working memory reserves, and triggers chronic tension headaches and burnout.",
    signalAnomaly: {
      status: "abnormal",
      statusBadge: "Abnormal Frontal Beta Surge & Sympathetic Overdrive",
      abnormalLocation: "Frontal lead (F3/F4) excessive Beta (18–30 Hz) & Low-Gamma power (30–48 Hz, bounded by 50 Hz Nyquist limit) with suppression of resting Alpha (8–12 Hz)",
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
        description: "Pushing working memory to rapidly calculate numbers while being timed under performance scrutiny."
      },
      {
        title: "Performance Pressure & Test Anxiety",
        description: "Fear of making an error triggers the body's sympathetic 'fight-or-flight' adrenaline response."
      },
      {
        title: "Frontal Cortex Energy Overdrive",
        description: "Brain cells in the prefrontal cortex fire rapidly in unsynchronized patterns to process complex logic."
      },
      {
        title: "Mental Fatigue & Multitasking",
        description: "Trying to manage multiple high-cognitive tasks simultaneously without taking mental pauses."
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
        whyNeeded: "Evaluates executive focus, memory fatigue threshold, and mental burnout indicators.",
        urgency: "Routine"
      },
      {
        testName: "Salivary Cortisol & Alpha-Amylase Stress Panel",
        plainEnglishName: "Saliva Stress Hormone Test",
        whyNeeded: "Measures whether your daily stress hormones peak and recover properly throughout a demanding day.",
        urgency: "Recommended"
      },
      {
        testName: "Ambulatory Blood Pressure & Heart Rate Variability (HRV) Screen",
        plainEnglishName: "24-Hour Heart & Blood Pressure Tracking",
        whyNeeded: "Checks whether mental work spikes blood pressure or suppresses healthy heart rhythm flexibility.",
        urgency: "Routine"
      }
    ],
    actionableGuidance: {
      immediateSteps: [
        "Practice the '20-20-20 Rule' and Pomodoro method: take a 5-minute break every 25 minutes of deep focus.",
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

  // 2. Student Stroop Cognitive Conflict Stress
  "student_sub11_stroop_stress": {
    conditionTitle: "Cognitive Conflict & High Mental Interference Overload",
    simpleSummary:
      "This test reflects mental conflict (tested via the Stroop color-word interference task). The brain has to actively fight off its automatic impulse to read words, creating intense friction in executive decision circuits.",
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
        whyNeeded: "Measures sustained attention, reaction speed, and susceptibility to distraction or impulse errors.",
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

  // 3. DASPS High State Anxiety Paroxysm
  "dasps_s01_high_anxiety": {
    conditionTitle: "Acute Emotional Anxiety Spike (State Anxiety Paroxysm)",
    simpleSummary:
      "This test captures a sudden spike of acute psychological anxiety or panic. The emotional centers of the brain (the limbic amygdala) have temporarily hijacked the conscious thinking areas, triggering an emergency fight-or-flight alert.",
    whatSignalMeans:
      "The left and right forehead sensors (Fp1 & Fp2) show an intense asymmetry, with jagged high-frequency waves and rapid eye flutters. The brain is scanning frantically for perceived threats while vagal calming signals drop.",
    whyNeedsAttention:
      "Right-frontal cortical hyperactivity combined with vagal parasympathetic withdrawal leaves the autonomic nervous system defenseless against panic attacks, chronic tachycardia, hyperventilation, gastrointestinal inflammation, and crippling agoraphobic avoidance.",
    signalAnomaly: {
      status: "abnormal",
      statusBadge: "Abnormal Right-Frontal Asymmetry & Vagal Withdrawal",
      abnormalLocation: "Right hemisphere hyperactivation (Alpha asymmetry F4 < F3) with prominent Gamma oscillations (35–50 Hz Nyquist band)",
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

  // 4. Relaxed Baseline (SAM-40 / DASPS Baseline)
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
      abnormalLocation: "Dominant Anterior & Posterior Alpha Synchrony (8–12 Hz) with High Vagal HRV",
      signalPathologyDescription: "Continuous, smooth sinusoidal Alpha waves (8–12 Hz, 40–60 µV) are evenly distributed across leads with clean baseline stability, no epileptiform transients, and balanced parasympathetic vagal engagement.",
      normalBaselineComparison: "Confirmed gold-standard benchmark for a healthy, relaxed, and resilient human nervous system."
    },
    thingsToPayAttentionTo: [
      {
        sign: "Circadian Rhythm & Sleep-Wake Regularity",
        clinicalContext: "Aim for 7–8 hours of consistent nightly sleep; regular sleep schedules protect natural daytime alpha synchrony and metabolic brain clearance.",
        urgency: "Physician Recommended"
      },
      {
        sign: "Active Cognitive Pacing & 5-Minute Micro-Rest",
        clinicalContext: "Incorporate brief mental pauses every 60–90 minutes during intense computer work to prevent frontal high-beta power hyperarousal.",
        urgency: "Cognitive Hygiene"
      },
      {
        sign: "Resonant Breathing & Autonomic Conditioning",
        clinicalContext: "Practice 5–10 minutes of slow diaphragmatic breathing (5–6 breaths per minute) to sustain high heart-rate variability (HRV) and strong vagal tone.",
        urgency: "Autonomic Health"
      },
      {
        sign: "Hydration, Nutrition & Stimulant Moderation",
        clinicalContext: "Maintain balanced hydration and moderate afternoon caffeine intake to prevent artificial sympathetic nervous system triggers.",
        urgency: "Lifestyle Medicine"
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
  const sectionRef = useRef<HTMLElement>(null);

  // Smoothly scrolls to the top of the guidance section (just below sticky navbar, matching image 2)
  const scrollToGuidanceHeader = () => {
    if (sectionRef.current) {
      const navbarHeight = 64; // height of sticky navbar
      const topOffset = 16;    // margin above card header matching image 2
      const elementPosition = sectionRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - (navbarHeight + topOffset);
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleTabSwitch = (tab: "overview" | "causes" | "symptoms" | "tests" | "actions") => {
    setActiveTab(tab);
    requestAnimationFrame(() => {
      scrollToGuidanceHeader();
    });
  };

  // Retrieve case-specific info or route directly to appropriate Stress & Anxiety knowledge base
  let caseData: CaseClinicalInfo;
  if (CLINICAL_KNOWLEDGE_BASE[caseId]) {
    caseData = CLINICAL_KNOWLEDGE_BASE[caseId];
  } else if (caseId.includes("relax") || caseId.includes("base") || stageOrRisk.toLowerCase().includes("baseline")) {
    caseData = CLINICAL_KNOWLEDGE_BASE["default_relax_baseline"];
  } else if (caseId.includes("anxiety") || stageOrRisk.toLowerCase().includes("anxiety")) {
    caseData = CLINICAL_KNOWLEDGE_BASE["dasps_s01_high_anxiety"];
  } else if (caseId.includes("student") || caseId.includes("stroop") || stageOrRisk.toLowerCase().includes("conflict")) {
    caseData = CLINICAL_KNOWLEDGE_BASE["student_sub11_stroop_stress"];
  } else {
    caseData = CLINICAL_KNOWLEDGE_BASE["sam40_sub01_math_stress"];
  }

  const isOptimal =
    caseData.signalAnomaly.status === "optimal" ||
    stageOrRisk.toLowerCase().includes("baseline") ||
    stageOrRisk.toLowerCase().includes("relax");

  return (
    <section
      ref={sectionRef}
      id="patient-guidance-section"
      className="scroll-mt-24 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-slate-900 transition-all"
    >
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase border font-mono ${
                isOptimal
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                  : "bg-rose-500/20 text-rose-300 border-rose-500/30"
              }`}>
                {isOptimal ? "Clinical Health & Baseline Verification" : "Stress & Anxiety Telemetry Guide"}
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
            onClick={() => handleTabSwitch("overview")}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === "overview"
                ? "bg-sky-500 text-slate-950 font-bold shadow-sm"
                : "bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700"
            }`}
          >
            1. Overview & Signals
          </button>
          <button
            onClick={() => handleTabSwitch("causes")}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === "causes"
                ? "bg-sky-500 text-slate-950 font-bold shadow-sm"
                : "bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700"
            }`}
          >
            2. Common Triggers ({caseData.causes.length})
          </button>
          <button
            onClick={() => handleTabSwitch("symptoms")}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === "symptoms"
                ? "bg-sky-500 text-slate-950 font-bold shadow-sm"
                : "bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700"
            }`}
          >
            3. What You Feel ({caseData.symptoms.length})
          </button>
          <button
            onClick={() => handleTabSwitch("tests")}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === "tests"
                ? "bg-amber-400 text-slate-950 font-bold shadow-sm"
                : "bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700"
            }`}
          >
            4. Real Tests & Treatments ({caseData.requiredTests.length + caseData.realTreatments.length})
          </button>
          <button
            onClick={() => handleTabSwitch("actions")}
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
              {/* Card 1: Physician Signal Verification */}
              <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3.5">
                <div className="flex items-center justify-between gap-2">
                  <div className={`flex items-center gap-2 font-bold text-sm ${isOptimal ? "text-emerald-600" : "text-rose-600"}`}>
                    {isOptimal ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{isOptimal ? "Physician Signal Evaluation: Healthy Baseline" : "Why This Needs Attention"}</span>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                      isOptimal
                        ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                        : caseData.signalAnomaly.status === "abnormal"
                        ? "bg-rose-100 text-rose-800 border-rose-200"
                        : "bg-amber-100 text-amber-800 border-amber-200"
                    }`}
                  >
                    {caseData.signalAnomaly.statusBadge}
                  </span>
                </div>

                {/* Waveform Finding Callout Box */}
                {isOptimal ? (
                  <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80 space-y-1.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Physiological Rhythm Status: Optimal &amp; Balanced (No Pathology Detected)</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 leading-snug">
                      {caseData.signalAnomaly.abnormalLocation}
                    </p>
                    <p className="text-[11px] text-slate-700 leading-relaxed pt-0.5">
                      {caseData.signalAnomaly.signalPathologyDescription}
                    </p>
                  </div>
                ) : (
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
                )}

                {/* Clinical Justification / Interpretation */}
                <div className="text-xs text-slate-700 leading-relaxed pt-0.5">
                  <strong className="text-slate-900">
                    {isOptimal ? "Physician Interpretation: " : "Clinical Justification: "}
                  </strong>
                  {caseData.whyNeedsAttention}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleTabSwitch("causes")}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 hover:text-sky-900 transition-colors"
                  >
                    <span>View Common Triggers ({caseData.causes.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Card 2: Recommended Specialist / Physician Follow-up */}
              <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3.5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                    <Stethoscope className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{isOptimal ? "Recommended Physician Follow-Up" : "Recommended Specialist"}</span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80">
                    <p className="text-xs font-bold text-slate-900 leading-snug">
                      {isOptimal ? "Routine Primary Care & Preventative Wellness" : caseData.actionableGuidance.specialistToConsult}
                    </p>
                    <p className="text-[11px] text-emerald-900 pt-1 leading-relaxed">
                      {isOptimal
                        ? "No specialist consultation or medical intervention is required. Continue routine annual preventative wellness checkups with your primary care physician to sustain this healthy nervous system baseline."
                        : "Consult with this medical specialist to evaluate confirmatory gold-standard tests and discuss evidence-based therapeutic options."}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                      {isOptimal ? "Clinical Baseline Verification" : "Healthy Baseline Comparison"}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {caseData.signalAnomaly.normalBaselineComparison}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[11px] text-slate-500">
                    {isOptimal
                      ? "Share this summary with your primary care provider during your next routine annual health checkup."
                      : "Share this summary and the exported report with your healthcare team."}
                  </p>
                  <button
                    onClick={() => handleTabSwitch("actions")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 transition-all shadow-2xs"
                  >
                    <span>View Doctor Guidance & Questions</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* CARD 3: DOCTOR-RECOMMENDED PRACTICES OR WARNING SIGNS */}
            <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  {isOptimal ? (
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                  )}
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    {isOptimal
                      ? "Doctor-Recommended Practices to Maintain Neural Health & Resilience"
                      : "Real Things on Which the Patient Needs to Pay Attention"}
                  </h3>
                </div>
                <span className={`text-[11px] ${isOptimal ? "text-emerald-700 font-medium" : "text-slate-500"}`}>
                  {isOptimal
                    ? "Evidence-Based Preventive Health & Brain Hygiene Protocols"
                    : "Critical Physiological Warning Signs & Red Flags"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {caseData.thingsToPayAttentionTo.map((item, idx) => {
                  let badgeStyle = "bg-slate-100 text-slate-700 border-slate-200";
                  if (isOptimal) {
                    badgeStyle = "bg-emerald-100 text-emerald-900 border-emerald-300 font-bold";
                  } else if (item.urgency === "Immediate Medical Attention") {
                    badgeStyle = "bg-rose-100 text-rose-900 border-rose-300 font-extrabold";
                  } else if (item.urgency === "Clinical Follow-Up") {
                    badgeStyle = "bg-amber-100 text-amber-900 border-amber-300 font-bold";
                  } else {
                    badgeStyle = "bg-sky-100 text-sky-900 border-sky-300 font-medium";
                  }

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-lg border transition-all space-y-1.5 ${
                        isOptimal
                          ? "border-emerald-200/80 bg-emerald-50/40 hover:bg-emerald-50/70 hover:border-emerald-300"
                          : "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300"
                      }`}
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

              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium">
                  {isOptimal ? "Explore clinical lifestyle and symptom details:" : "Explore triggers and what you might experience daily:"}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTabSwitch("causes")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 border border-slate-200 transition-all"
                  >
                    <span>View Common Triggers ({caseData.causes.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleTabSwitch("symptoms")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-700 border border-slate-200 transition-all"
                  >
                    <span>View What You Feel ({caseData.symptoms.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* CARD 4: REAL TESTS & REAL TREATMENTS OVERVIEW TEASER */}
            <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xs space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
                    <Pill className="w-4 h-4" />
                    <span>
                      {isOptimal
                        ? "Routine Health Screenings & Doctor-Recommended Lifestyle Protocols"
                        : "Real Diagnostic Tests & Real Medical Treatments"}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white pt-1">
                    {isOptimal
                      ? `${caseData.requiredTests.length} Preventive Wellness Checkup & ${caseData.realTreatments.length} Evidence-Based Lifestyle Practices`
                      : `${caseData.requiredTests.length} Confirmatory Clinical Tests & ${caseData.realTreatments.length} Evidence-Based Therapies`}
                  </h4>
                  <p className="text-xs text-slate-300 pt-0.5">
                    {isOptimal
                      ? "Clinically validated preventive evaluations and physician-directed lifestyle medicine guidelines to sustain optimal baseline health."
                      : "Clinically validated diagnostic evaluations and physician-directed treatments matching this stress/anxiety pattern."}
                  </p>
                </div>
                <button
                  onClick={() => handleTabSwitch("tests")}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm shrink-0 ${
                    isOptimal
                      ? "bg-emerald-400 hover:bg-emerald-300 text-slate-950"
                      : "bg-amber-400 hover:bg-amber-300 text-slate-950"
                  }`}
                >
                  <span>{isOptimal ? "View Preventive Screenings & Guidance" : "View Full Tests & Treatments"}</span>
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
                Why Does This Happen? (Possible Triggers Explained Simply)
              </h3>
              <p className="text-xs text-slate-500">
                Cognitive overload and anxiety rarely have a single trigger. Here are the most common neurological, psychological, and autonomic factors:
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

            {/* Tab Navigation Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                onClick={() => handleTabSwitch("overview")}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Overview</span>
              </button>
              <button
                onClick={() => handleTabSwitch("symptoms")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sm transition-all"
              >
                <span>Next: What You Feel ({caseData.symptoms.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
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
                These are the physical, emotional, and cognitive signs that often accompany this physiological stress pattern:
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

            {/* Tab Navigation Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                onClick={() => handleTabSwitch("causes")}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Triggers</span>
              </button>
              <button
                onClick={() => handleTabSwitch("tests")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm transition-all"
              >
                <span>Next: Real Tests & Treatments ({caseData.requiredTests.length + caseData.realTreatments.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
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

            {/* Tab Navigation Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                onClick={() => handleTabSwitch("symptoms")}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Symptoms</span>
              </button>
              <button
                onClick={() => handleTabSwitch("actions")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-sm transition-all"
              >
                <span>Next: Doctor Guidance & Questions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
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

            {/* Tab Navigation Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                onClick={() => handleTabSwitch("tests")}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Tests & Treatments</span>
              </button>
              <button
                onClick={() => handleTabSwitch("overview")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all"
              >
                <span>Return to Overview & Signals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
