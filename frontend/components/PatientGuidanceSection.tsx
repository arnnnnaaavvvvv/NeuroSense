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
      "This test captures the brain under immediate mental strain during timed, difficult speed arithmetic. Working memory is challenged, triggering an acute surge in cortical beta oscillations and task-related arousal.",
    whatSignalMeans:
      "Calm 10 Hz Alpha waves attenuate (alpha desynchronization) and are replaced by fast 18–26 Hz Beta activity across the left frontal scalp (F3 electrode), consistent with intensive cognitive processing.",
    whyNeedsAttention:
      "Frontal beta elevations are characteristic of high cognitive workload during speed arithmetic. While expected during acute problem-solving, sustained high-frequency cortical excitation without recovery intervals can contribute to mental fatigue and cognitive strain. Single-modality EEG measures cortical workload, not systemic pathology.",
    signalAnomaly: {
      status: "abnormal",
      statusBadge: "Elevated Frontal Beta & High Cognitive Workload",
      abnormalLocation: "Left frontal electrode (F3) elevated Beta (18–30 Hz) power with attenuation of resting posterior Alpha (8–12 Hz)",
      signalPathologyDescription: "Electrophysiological recording exhibits marked bilateral frontal beta power elevation (+14.2% over subject resting baseline) accompanied by desynchronization of resting posterior alpha rhythms.",
      normalBaselineComparison: "Calm cognitive readiness maintains dominant occipital-parietal Alpha waves (8–12 Hz, 18.4 µV²) and symmetric frontal spectral distribution."
    },
    thingsToPayAttentionTo: [
      {
        sign: "Acute physical symptoms: severe chest tightness, irregular heart palpitations, or shortness of breath",
        clinicalContext: "Physical autonomic warning signs warrant direct medical assessment independent of EEG findings.",
        urgency: "Immediate Medical Attention"
      },
      {
        sign: "Clenched jaw (bruxism), tension headaches behind eyes, or trembling fingers",
        clinicalContext: "Somatic motor manifestation of sustained high-frequency muscle and cognitive tension.",
        urgency: "Monitor Daily"
      },
      {
        sign: "Mental paralysis, stumbling over words, or inability to make executive decisions",
        clinicalContext: "Transient working-memory depletion under high-friction cognitive pressure.",
        urgency: "Clinical Follow-Up"
      },
      {
        sign: "Inability to down-regulate or relax after demanding cognitive stressors end",
        clinicalContext: "Difficulty transitioning from active problem-solving to autonomic rest.",
        urgency: "Clinical Follow-Up"
      }
    ],
    realTreatments: [
      {
        treatmentName: "Slow-Paced Diaphragmatic Breathing & Neuro-Ergonomic Pacing",
        category: "Behavioral & Neuro-Regulation",
        howItWorks: "Structured breathing practice pacing respiration at ~6 breaths per minute to stimulate vagal baroreflex activity and suppress frontal beta over-activation.",
        evidenceBase: "Clinical Neuroergonomics Guidelines for Cognitive Strain"
      },
      {
        treatmentName: "Diurnal Salivary Cortisol & Neuroendocrine Evaluation",
        category: "First-Line Medical Therapy",
        howItWorks: "Physician-ordered diagnostic testing measuring daily cortisol rhythm to evaluate hypothalamic-pituitary-adrenal (HPA) axis balance under chronic stress.",
        evidenceBase: "Endocrine Society Clinical Practice Guidelines"
      },
      {
        treatmentName: "Cognitive Stress Inoculation & Focus Restructuring",
        category: "Behavioral & Neuro-Regulation",
        howItWorks: "Structured psychological training to restructure performance anxiety and implement regular focus/rest intervals.",
        evidenceBase: "APA Practice Guidelines for Occupational Stress Management"
      },
      {
        treatmentName: "Comprehensive Primary Care Consultation",
        category: "Medical Specialist Care",
        howItWorks: "Evaluation by a primary care physician to assess overall cardiovascular health, blood pressure regulation, and somatic stress symptoms.",
        evidenceBase: "Standard Clinical Practice Protocol"
      }
    ],
    causes: [
      {
        title: "Intense Mental Calculation & Time Pressure",
        description: "Challenging working memory to rapidly calculate numbers under performance timing."
      },
      {
        title: "Performance Scrutiny & Cognitive Arousal",
        description: "Task performance scrutiny activates sympathetic autonomic arousal."
      },
      {
        title: "Frontal Cortex Metabolic Recruitment",
        description: "Pyramidal neurons in prefrontal circuits fire in desynchronized patterns during complex logic."
      },
      {
        title: "Sustained Focus Without Recovery Intervals",
        description: "Managing demanding cognitive tasks without scheduled restorative mental pauses."
      }
    ],
    symptoms: [
      {
        title: "Forehead Tension & Eye Strain",
        description: "A tight feeling across the temples or furrowed brow during concentration."
      },
      {
        title: "Increased Heart Rate & Shallow Breathing",
        description: "Shallow chest breaths or autonomic acceleration while solving difficult problems."
      },
      {
        title: "Mental Exhaustion & Decreased Patience",
        description: "Feeling drained or irritable after prolonged uninterrupted mental strain."
      },
      {
        title: "Restless Fidgeting or Jaw Clenching",
        description: "Unconscious jaw clenching or motor restlessness during heavy workload."
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
        testName: "Salivary Cortisol & Stress Biomarker Screen",
        plainEnglishName: "Saliva Stress Hormone Test",
        whyNeeded: "Measures whether your daily stress hormones peak and recover properly throughout a demanding day.",
        urgency: "Recommended"
      },
      {
        testName: "Physician-Supervised Cardiovascular & Autonomic Evaluation",
        plainEnglishName: "Resting Heart & Blood Pressure Tracking",
        whyNeeded: "Checks whether high mental workload correlates with blood pressure elevations or autonomic strain.",
        urgency: "Routine"
      }
    ],
    actionableGuidance: {
      immediateSteps: [
        "Practice the '20-20-20 Rule' and Pomodoro pacing: take a 5-minute pause every 25 minutes of deep focus.",
        "Use slow diaphragmatic breathing (inhale 4 seconds, exhale 6 seconds) to help restore baseline cortical rhythms.",
        "Step away from your desk, stretch your neck and shoulders, and hydrate to relieve somatic tension."
      ],
      doctorQuestions: [
        "Does my electrophysiological profile indicate difficulty returning to baseline alpha rhythms after mental tasks?",
        "Are my cardiovascular vitals (resting heart rate and blood pressure) within healthy clinical parameters?"
      ],
      specialistToConsult: "Primary Care Physician or Healthcare Provider"
    }
  },

  // 2. Student Stroop Cognitive Conflict Stress
  "student_sub11_stroop_stress": {
    conditionTitle: "Cognitive Conflict & High Mental Interference Overload",
    simpleSummary:
      "This test reflects mental conflict (tested via the Stroop color-word interference task). The brain actively inhibits automatic word-reading impulses, recruiting executive decision and error-monitoring circuits.",
    whatSignalMeans:
      "The midline frontal sensor (Fz) detects prominent 'Frontal Midline Theta' waves (4–8 Hz) coupled with localized Beta synchronization, confirming active engagement of executive control networks.",
    whyNeedsAttention:
      "Elevated Frontal Midline Theta (4–8 Hz) and beta synchronization reflect heavy recruitment of cognitive control and conflict-monitoring networks during the Stroop task. While standard during active inhibition, prolonged high-workload episodes without rest may contribute to subjective mental fatigue.",
    signalAnomaly: {
      status: "abnormal",
      statusBadge: "Elevated Frontal Midline Theta & Executive Interference",
      abnormalLocation: "Frontal Midline sensor (Fz) prominent Theta (4–8 Hz) power surge with concurrent DLPFC Beta synchronization",
      signalPathologyDescription: "Signal reveals bursts of Frontal Midline Theta (Fm-theta, 4–8 Hz) power elevation (+11.8% over subject baseline) coupled with bilateral frontal beta synchronization, reflecting cognitive conflict monitoring during color-word interference.",
      normalBaselineComparison: "Resting baseline maintains balanced frontal theta (4.8 µV²) and absence of continuous task-induced synchronization."
    },
    thingsToPayAttentionTo: [
      {
        sign: "Momentary cognitive freezing or repeating errors on simple, familiar tasks",
        clinicalContext: "Indicates transient anterior cingulate and executive resource depletion.",
        urgency: "Clinical Follow-Up"
      },
      {
        sign: "Dull, tight band of pressure wrapping around forehead and temples (tension headache)",
        clinicalContext: "Direct outcome of sustained facial muscle tension and cognitive friction.",
        urgency: "Monitor Daily"
      },
      {
        sign: "Sudden emotional frustration, tearfulness, or intense irritation when multi-tasking",
        clinicalContext: "Signals loss of prefrontal cognitive inhibition due to mental fatigue.",
        urgency: "Clinical Follow-Up"
      },
      {
        sign: "Excessive consumption of energy drinks, high-dose caffeine, or study stimulants",
        clinicalContext: "High stimulant doses can increase cortical irritability and worsen subsequent cognitive crashes.",
        urgency: "Clinical Follow-Up"
      }
    ],
    realTreatments: [
      {
        treatmentName: "Neuro-Ergonomic Pomodoro & Physiological Sigh Protocol",
        category: "Behavioral & Neuro-Regulation",
        howItWorks: "Strict 25-minute focus intervals separated by 5 minutes of restorative breathing (two quick nasal inhales followed by one long, slow mouth exhale) to restore executive attention reserves.",
        evidenceBase: "Clinical Neuroergonomics Guidelines"
      },
      {
        treatmentName: "Comprehensive Cognitive Health & Attention Evaluation",
        category: "Medical Specialist Care",
        howItWorks: "Clinical evaluation by a licensed healthcare provider to assess sustained attention, executive function, and potential cognitive fatigue factors.",
        evidenceBase: "Standard Clinical Neuropsychological Practice"
      },
      {
        treatmentName: "Mindfulness-Based Stress Reduction (MBSR)",
        category: "Behavioral & Neuro-Regulation",
        howItWorks: "Teaches patients to decouple emotional reactivity from challenging cognitive stimuli, reducing cognitive friction and mental fatigue.",
        evidenceBase: "NICE Recommended Guidelines for Cognitive Strain"
      },
      {
        treatmentName: "Nutritional & Metabolic Health Screen",
        category: "First-Line Medical Therapy",
        howItWorks: "Laboratory screening to verify adequate micronutrient and metabolic markers supporting healthy neural stamina.",
        evidenceBase: "Clinical Practice Health Guidelines"
      }
    ],
    causes: [
      {
        title: "Sensory & Informational Overload",
        description: "Processing conflicting inputs or navigating complex decisions under time constraints."
      },
      {
        title: "Impulse Suppression & Mental Filtering",
        description: "Cortical circuits actively suppressing automatic impulse responses."
      },
      {
        title: "Prolonged Study Sessions Without Breaks",
        description: "Marathon mental effort without restorative cognitive downtime."
      },
      {
        title: "High Stimulant & Caffeine Intake",
        description: "Excess stimulants increase neural irritability and exacerbate cognitive jitteriness."
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
        description: "Feeling overwhelmed by small choices because your mental filter is exhausted."
      },
      {
        title: "Emotional Frustration & Short Temper",
        description: "Snapping at friends or family members due to cognitive fatigue reducing your patience."
      }
    ],
    requiredTests: [
      {
        testName: "Standardized Neuropsychological Attention & Working Memory Battery",
        plainEnglishName: "Computerized Focus & Attention Test",
        whyNeeded: "Measures sustained attention, reaction speed, and susceptibility to distraction or impulse errors.",
        urgency: "Routine"
      },
      {
        testName: "Serum Metabolic & Vitamin Panel (CBC, B12, Folate)",
        plainEnglishName: "Basic Blood Work & Vitamin Screen",
        whyNeeded: "Ensures underlying metabolic or vitamin deficiencies are not compounding cognitive fatigue.",
        urgency: "Routine"
      },
      {
        testName: "Standardized Clinical Wellbeing Screen (PHQ-9 / GAD-7)",
        plainEnglishName: "Psychological Wellbeing Questionnaire",
        whyNeeded: "Screens for underlying situational anxiety or mood strain amplifying cognitive overload.",
        urgency: "Recommended"
      }
    ],
    actionableGuidance: {
      immediateSteps: [
        "Take a brisk 10-minute walk outside in natural daylight; physical movement clears cognitive fatigue faster than sitting.",
        "Moderate caffeine intake and avoid late-afternoon energy drinks to protect sleep architecture.",
        "Break complex study materials into small 15-minute chunks rather than attempting marathon cramming sessions."
      ],
      doctorQuestions: [
        "Are my symptoms typical for temporary academic stress, or is further evaluation warranted?",
        "What evidence-based lifestyle modifications can help strengthen cognitive stamina?"
      ],
      specialistToConsult: "Primary Care Physician or Qualified Student Health Provider"
    }
  },

  // 3. DASPS High State Anxiety Paroxysm
  "dasps_s01_high_anxiety": {
    conditionTitle: "Acute Emotional Anxiety Spike (State Anxiety Paroxysm)",
    simpleSummary:
      "This test captures a sudden spike of acute state anxiety during emotionally evocative video stimulation. Cortical and limbic networks shift toward defensive alertness and withdrawal motivation.",
    whatSignalMeans:
      "Frontal electrodes demonstrate right-hemispheric alpha suppression relative to the left hemisphere (Frontal Alpha Asymmetry score -0.301), alongside low cranial EMG artifact, indicating genuine cortical arousal rather than facial motor noise.",
    whyNeedsAttention:
      "Right-frontal alpha suppression relative to the left hemisphere is consistent with high sympathetic arousal and withdrawal motivation. However, scalp EEG alone does not diagnose anxiety disorders or autonomic dysfunction, and requires clinical evaluation alongside complete medical history.",
    signalAnomaly: {
      status: "abnormal",
      statusBadge: "Right-Frontal Alpha Asymmetry & High Arousal",
      abnormalLocation: "Right frontal electrode (F4) alpha suppression relative to F3 (FAA: -0.301)",
      signalPathologyDescription: "Electrophysiological recording exhibits right-frontal alpha power suppression (F4 alpha 6.8 µV² vs F3 alpha 9.2 µV²; FAA score -0.301) accompanied by minimal cranial EMG tone (1.9 µV²), indicating genuine cortical arousal rather than facial motor artifact.",
      normalBaselineComparison: "Balanced bilateral frontal alpha power (FAA score between -0.05 and +0.05) in eyes-closed resting baseline."
    },
    thingsToPayAttentionTo: [
      {
        sign: "Acute medical warning signs: crushing chest pressure, fainting, or severe palpitations",
        clinicalContext: "Severe physical warning signs require immediate medical emergency evaluation to rule out cardiac conditions.",
        urgency: "Immediate Medical Attention"
      },
      {
        sign: "Persistent uncontrollable worry, panic sensations, or dread lasting weeks",
        clinicalContext: "Indicates sustained hyperarousal requiring clinical psychiatric or psychological evaluation.",
        urgency: "Clinical Follow-Up"
      },
      {
        sign: "Chronic gastrointestinal distress (nausea, cramping, irritable bowel symptoms)",
        clinicalContext: "Somatic autonomic manifestations of sustained sympathetic activation.",
        urgency: "Clinical Follow-Up"
      },
      {
        sign: "Avoiding routine social, work, or public environments out of fear of episodes",
        clinicalContext: "Development of avoidance patterns that benefit from evidence-based behavioral therapy.",
        urgency: "Clinical Follow-Up"
      }
    ],
    realTreatments: [
      {
        treatmentName: "Cognitive Behavioral Therapy for Anxiety & Panic (CBT)",
        category: "Behavioral & Neuro-Regulation",
        howItWorks: "Evidence-based psychotherapy utilizing cognitive restructuring, interoceptive exposure, and behavioral coping mechanisms.",
        evidenceBase: "APA & NICE Clinical Practice Guidelines — Gold Standard First-Line Care"
      },
      {
        treatmentName: "Comprehensive Primary Care Clinical Health Evaluation",
        category: "First-Line Medical Therapy",
        howItWorks: "Comprehensive evaluation by a primary care physician or mental health professional to discuss evidence-based medical and behavioral management.",
        evidenceBase: "Standard Clinical Practice Guidelines"
      },
      {
        treatmentName: "Diaphragmatic Breathing & Somatic Grounding Protocols",
        category: "Behavioral & Neuro-Regulation",
        howItWorks: "Slow diaphragmatic breathing with extended exhalations to stimulate parasympathetic vagal activity and decrease acute autonomic arousal.",
        evidenceBase: "Clinical Physiological & Autonomic Regulation Protocols"
      },
      {
        treatmentName: "Resting Electrocardiogram (ECG) & Cardiovascular Review",
        category: "Medical Specialist Care",
        howItWorks: "Standard resting 12-lead ECG to verify normal cardiac rhythm and rule out primary arrhythmias.",
        evidenceBase: "AHA/ACC Diagnostic Protocols"
      }
    ],
    causes: [
      {
        title: "Acute Sympathetic Arousal",
        description: "Emotional or situational triggers stimulate autonomic fight-or-flight signaling."
      },
      {
        title: "Evocative Psychological Stressors",
        description: "Encountering evocative imagery, phobic triggers, or situational performance demands."
      },
      {
        title: "Sustained Baseline Sensitization",
        description: "A baseline nervous system sensitized by cumulative life or work pressures."
      },
      {
        title: "Hyperventilation & Respiratory Shifts",
        description: "Rapid shallow breathing reduces arterial CO2, inducing sensations of dizziness or tingling."
      }
    ],
    symptoms: [
      {
        title: "Pounding or Racing Heart (Palpitations)",
        description: "Feeling your heart thumping rapidly during acute emotional stress."
      },
      {
        title: "Shortness of Breath & Tight Throat",
        description: "A sensation of restricted breathing or difficulty drawing a deep breath."
      },
      {
        title: "Trembling Hands, Chills, or Cold Sweats",
        description: "Peripheral vasoconstriction causing chilly extremities or trembling fingers."
      },
      {
        title: "Intense Dread or Arousal Surge",
        description: "A sudden powerful surge of discomfort accompanied by racing thoughts."
      }
    ],
    requiredTests: [
      {
        testName: "Standard 12-Lead Electrocardiogram (ECG) & Blood Pressure Check",
        plainEnglishName: "Resting Heart Rhythm & Rate Exam",
        whyNeeded: "Rule out heart rhythm conditions that can cause physical palpitations during anxiety.",
        urgency: "Priority"
      },
      {
        testName: "Thyroid Function Panel (TSH, Free T4)",
        plainEnglishName: "Thyroid Gland Activity Check",
        whyNeeded: "Thyroid gland dysregulation can produce metabolic symptoms that mimic acute panic.",
        urgency: "Recommended"
      },
      {
        testName: "Clinical Anxiety Diagnostic Interview (GAD-7 & HAM-A)",
        plainEnglishName: "Clinical Anxiety Assessment",
        whyNeeded: "Administered by a licensed healthcare clinician to differentiate situational stress from clinical anxiety disorders.",
        urgency: "Priority"
      },
      {
        testName: "Comprehensive Metabolic Panel (CMP) & Fasting Glucose",
        plainEnglishName: "Basic Blood Chemistry & Sugar Screen",
        whyNeeded: "Rule out blood sugar drops or electrolyte shifts that trigger adrenaline release.",
        urgency: "Routine"
      }
    ],
    actionableGuidance: {
      immediateSteps: [
        "Use the '5-4-3-2-1 Grounding Method': Name 5 visible objects, 4 touchable textures, 3 audible sounds, 2 scents, and 1 taste to engage sensory focus.",
        "Perform 'Extended Exhale Breathing': Inhale gently for 4 seconds through your nose, then exhale slowly for 7 seconds through pursed lips.",
        "Splash cool water on your face to stimulate the mammalian dive reflex and reduce acute autonomic arousal.",
        "Limit caffeine and energy drinks until your nervous system returns to calm equilibrium."
      ],
      doctorQuestions: [
        "Are my cardiovascular markers and resting rhythm within healthy clinical limits?",
        "Could my symptoms be influenced by thyroid function, blood sugar, or medications?",
        "What evidence-based psychological strategies (like CBT or exposure therapy) do you recommend for my situation?"
      ],
      specialistToConsult: "Primary Care Physician or Licensed Mental Health Professional"
    }
  },

  // 4. Relaxed Baseline (SAM-40 / DASPS Baseline)
  "default_relax_baseline": {
    conditionTitle: "Resting Relaxation Baseline (Healthy Synchronized Rhythm)",
    simpleSummary:
      "This test shows a calm brain at rest with eyes gently closed. Cortical rhythms display organized alpha synchrony with no indicators of acute cognitive strain or emotional distress.",
    whatSignalMeans:
      "The sensor at the back of the head (O1) displays a continuous, rhythmic 9–11 Hz rhythm known as the 'Alpha rhythm', reflecting healthy visual cortex sensory idling during eyes-closed rest.",
    whyNeedsAttention:
      "Maintaining restorative baseline neural dynamics is vital for cognitive resilience, memory consolidation, and autonomic balance. It represents the healthy normative electrophysiological standard.",
    signalAnomaly: {
      status: "optimal",
      statusBadge: "Optimal Restorative Alpha Synchrony",
      abnormalLocation: "Dominant Posterior Alpha Synchrony (8–12 Hz) with Calm Cortical Dynamics",
      signalPathologyDescription: "Continuous sinusoidal Alpha waves (8–12 Hz, 40–60 µV) are symmetrically distributed across occipital leads with clean baseline stability, absent cranial EMG artifact, and nominal slow-wave balance.",
      normalBaselineComparison: "Confirmed benchmark for healthy, relaxed eyes-closed neural synchrony."
    },
    thingsToPayAttentionTo: [
      {
        sign: "Circadian Rhythm & Sleep-Wake Regularity",
        clinicalContext: "Aim for consistent nightly sleep; regular sleep schedules protect natural daytime alpha synchrony.",
        urgency: "Physician Recommended"
      },
      {
        sign: "Active Cognitive Pacing & Micro-Rest Breaks",
        clinicalContext: "Incorporate brief mental pauses every 60–90 minutes during intense computer work to prevent high-beta hyperarousal.",
        urgency: "Cognitive Hygiene"
      },
      {
        sign: "Slow Diaphragmatic Breathing Practice",
        clinicalContext: "Practice 5–10 minutes of slow diaphragmatic breathing (5–6 breaths per minute) to sustain healthy autonomic balance and alpha rhythm stability.",
        urgency: "Autonomic Health"
      },
      {
        sign: "Hydration, Nutrition & Moderate Caffeine Intake",
        clinicalContext: "Maintain balanced hydration and moderate afternoon caffeine intake to prevent artificial sympathetic arousal.",
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

export function getCaseClinicalInfo(caseId: string = "", stageOrRisk: string = ""): CaseClinicalInfo {
  const cLower = (caseId || "").toLowerCase();
  const sLower = (stageOrRisk || "").toLowerCase();

  if (CLINICAL_KNOWLEDGE_BASE[caseId]) {
    return CLINICAL_KNOWLEDGE_BASE[caseId];
  } else if (cLower.includes("relax") || cLower.includes("base") || sLower.includes("baseline") || sLower.includes("optimal")) {
    return CLINICAL_KNOWLEDGE_BASE["default_relax_baseline"];
  } else if (cLower.includes("anxiety") || sLower.includes("anxiety")) {
    return CLINICAL_KNOWLEDGE_BASE["dasps_s01_high_anxiety"];
  } else if (cLower.includes("student") || cLower.includes("stroop") || sLower.includes("conflict")) {
    return CLINICAL_KNOWLEDGE_BASE["student_sub11_stroop_stress"];
  } else {
    return CLINICAL_KNOWLEDGE_BASE["sam40_sub01_math_stress"];
  }
}

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

  const caseData = getCaseClinicalInfo(caseId, stageOrRisk);

  const isOptimal =
    caseData.signalAnomaly.status === "optimal" ||
    stageOrRisk.toLowerCase().includes("baseline") ||
    stageOrRisk.toLowerCase().includes("relax") ||
    stageOrRisk.toLowerCase().includes("optimal");

  // When patient is healthy, hide triggers, symptoms, and tests tabs — they do not apply
  const effectiveTab =
    isOptimal && (activeTab === "causes" || activeTab === "symptoms" || activeTab === "tests")
      ? "overview"
      : activeTab;

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
            <div className={`text-sm font-bold ${isOptimal ? "text-emerald-400" : "text-sky-300"}`}>
              {stageOrRisk}
            </div>
            <div className="text-[11px] text-slate-400">
              {isOptimal ? "Normal physiological rhythms confirmed" : "Clinical telemetry translated for patients"}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-5 border-t border-slate-700/60 mt-4 text-xs font-medium">
          {isOptimal ? (
            /* Healthy Baseline: Only 2 relevant tabs. No triggers, symptoms, or tests! */
            <>
              <button
                onClick={() => handleTabSwitch("overview")}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  effectiveTab === "overview"
                    ? "bg-emerald-400 text-slate-950 font-bold shadow-sm"
                    : "bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                1. Brain Health Overview &amp; Verification
              </button>
              <button
                onClick={() => handleTabSwitch("actions")}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  effectiveTab === "actions"
                    ? "bg-emerald-400 text-slate-950 font-bold shadow-sm"
                    : "bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                2. Doctor Wellness Advice &amp; Daily Habits
              </button>
            </>
          ) : (
            /* Condition Detected: Full 5-tab diagnostic guide */
            <>
              <button
                onClick={() => handleTabSwitch("overview")}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  effectiveTab === "overview"
                    ? "bg-sky-500 text-slate-950 font-bold shadow-sm"
                    : "bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                1. Overview &amp; Signals
              </button>
              <button
                onClick={() => handleTabSwitch("causes")}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  effectiveTab === "causes"
                    ? "bg-sky-500 text-slate-950 font-bold shadow-sm"
                    : "bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                2. Common Triggers ({caseData.causes.length})
              </button>
              <button
                onClick={() => handleTabSwitch("symptoms")}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  effectiveTab === "symptoms"
                    ? "bg-sky-500 text-slate-950 font-bold shadow-sm"
                    : "bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                3. What You Feel ({caseData.symptoms.length})
              </button>
              <button
                onClick={() => handleTabSwitch("tests")}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  effectiveTab === "tests"
                    ? "bg-amber-400 text-slate-950 font-bold shadow-sm"
                    : "bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                4. Real Tests &amp; Treatments ({caseData.requiredTests.length + caseData.realTreatments.length})
              </button>
              <button
                onClick={() => handleTabSwitch("actions")}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  effectiveTab === "actions"
                    ? "bg-emerald-400 text-slate-950 font-bold shadow-sm"
                    : "bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                5. Doctor Guidance &amp; Steps
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 sm:p-6 bg-slate-50/50">
        {/* TAB 1: OVERVIEW & SIGNAL DIAGNOSTICS */}
        {effectiveTab === "overview" && (
          <div className="space-y-6">
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
                  {isOptimal ? (
                    <button
                      onClick={() => handleTabSwitch("actions")}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition-colors"
                    >
                      <span>View Doctor Wellness Advice</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleTabSwitch("causes")}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 hover:text-sky-900 transition-colors"
                    >
                      <span>View Common Triggers ({caseData.causes.length})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
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
                    <span>{isOptimal ? "View Doctor Wellness Advice" : "View Doctor Guidance & Questions"}</span>
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
                  {isOptimal ? "Doctor-recommended lifestyle practices for ongoing health:" : "Explore triggers and what you might experience daily:"}
                </span>
                <div className="flex items-center gap-2">
                  {isOptimal ? (
                    <button
                      onClick={() => handleTabSwitch("actions")}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all"
                    >
                      <span>View Doctor Wellness Advice</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* CARD 4: REASSURING NO-TESTS-NEEDED BANNER WHEN OPTIMAL, OR FULL TESTS/TREATMENTS TEASER WHEN ISSUE DETECTED */}
            {isOptimal ? (
              <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white border border-emerald-800/40 shadow-xs space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Optimal Neurological Health Verified</span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-white">
                      No Diagnostic Tests or Medical Treatments Required
                    </h4>
                    <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                      All cortical brainwaves, resting alpha synchrony, and autonomic indicators are within normal healthy parameters. You do not need confirmatory scans, prescription medications, or specialist workups.
                    </p>
                  </div>
                  <button
                    onClick={() => handleTabSwitch("actions")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition-all shadow-sm shrink-0"
                  >
                    <span>View Daily Wellness Habits</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xs space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
                      <Pill className="w-4 h-4" />
                      <span>Real Diagnostic Tests &amp; Real Medical Treatments</span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-white pt-1">
                      {caseData.requiredTests.length} Confirmatory Clinical Tests &amp; {caseData.realTreatments.length} Evidence-Based Therapies
                    </h4>
                    <p className="text-xs text-slate-300 pt-0.5">
                      Clinically validated diagnostic evaluations and physician-directed treatments matching this stress/anxiety pattern.
                    </p>
                  </div>
                  <button
                    onClick={() => handleTabSwitch("tests")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all shadow-sm shrink-0"
                  >
                    <span>View Full Tests &amp; Treatments</span>
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
            )}
          </div>
        )}

        {/* TAB 2: CAUSES */}
        {!isOptimal && effectiveTab === "causes" && (
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
        {!isOptimal && effectiveTab === "symptoms" && (
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
                <span>Next: Real Tests &amp; Treatments ({caseData.requiredTests.length + caseData.realTreatments.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: REAL TESTS & REAL TREATMENTS */}
        {!isOptimal && effectiveTab === "tests" && (
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
                    <span>Real Medical Treatments &amp; Evidence-Based Therapies</span>
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
                <span>Next: Doctor Guidance &amp; Questions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: DOCTOR GUIDANCE & ACTIONABLE STEPS */}
        {effectiveTab === "actions" && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isOptimal ? "Doctor Wellness Advice & Daily Habits" : "Patient Action Plan & Medical Guidance"}
              </h3>
              <p className="text-xs text-slate-500">
                {isOptimal
                  ? "Doctor-recommended lifestyle practices to sustain your healthy neural baseline, plus routine checkup guidance:"
                  : "Clear, practical steps you can start today, along with what to ask your doctor:"}
              </p>
            </div>

            {/* Immediate Steps */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{isOptimal ? "Recommended Daily Health Habits" : "Immediate Self-Care & Lifestyle Steps"}</span>
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
                  <span>{isOptimal ? "Questions to Ask at Your Next Routine Checkup" : "Questions to Ask Your Doctor at Your Next Visit"}</span>
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
                  <strong>{isOptimal ? "Physician Consultation Status: " : "Primary Specialist to Schedule: "}</strong>
                  {isOptimal ? "Routine Primary Care / General Practitioner (No Specialist Required)" : caseData.actionableGuidance.specialistToConsult}
                </span>
              </div>
            </div>

            {/* Tab Navigation Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              {isOptimal ? (
                <button
                  onClick={() => handleTabSwitch("overview")}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Brain Health Overview</span>
                </button>
              ) : (
                <button
                  onClick={() => handleTabSwitch("tests")}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Tests &amp; Treatments</span>
                </button>
              )}
              <button
                onClick={() => handleTabSwitch("overview")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all"
              >
                <span>Return to Overview &amp; Signals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
