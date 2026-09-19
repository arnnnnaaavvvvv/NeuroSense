/**
 * Clinical Knowledge Base & Evidence-Based Guidelines Registry
 * Anchored in American Psychological Association (APA), NICE CG113, and AAPB standards.
 */

export interface SignalAnomalyDetail {
  status: "abnormal" | "caution" | "optimal";
  statusBadge: string;
  abnormalLocation: string;
  signalPathologyDescription: string;
  normalBaselineComparison: string;
}

export interface ClinicalWarningSign {
  sign: string;
  clinicalContext: string;
  urgency: 
    | "Immediate Medical Attention" 
    | "Clinical Follow-Up" 
    | "Monitor Daily" 
    | "Physician Recommended" 
    | "Cognitive Hygiene" 
    | "Autonomic Health" 
    | "Lifestyle Medicine";
}

export interface ClinicalIntervention {
  treatmentName: string;
  category: 
    | "First-Line Medical Therapy" 
    | "Behavioral & Neuro-Regulation" 
    | "Clinical Device / Appliance" 
    | "Medical Specialist Care"
    | "Physician Laboratory Evaluation";
  howItWorks: string;
  evidenceBase: string;
}

export interface RequiredClinicalTest {
  testName: string;
  plainEnglishName: string;
  whyNeeded: string;
  urgency: "Routine" | "Recommended" | "Priority";
}

export interface RedFlagSign extends ClinicalWarningSign {}
export interface RealMedicalTreatment extends ClinicalIntervention {}

export interface CaseClinicalDefinition {
  conditionTitle: string;
  simpleSummary: string;
  whatSignalMeans: string;
  whyNeedsAttention: string;
  signalAnomaly: SignalAnomalyDetail;
  clinicalWarningSigns: ClinicalWarningSign[];
  clinicalInterventions: ClinicalIntervention[];
  causes: {
    title: string;
    description: string;
  }[];
  symptoms: {
    title: string;
    description: string;
  }[];
  symptoms_alert?: string;
  requiredTests: RequiredClinicalTest[];
  actionableGuidance: {
    immediateSteps: string[];
    doctorQuestions: string[];
    specialistToConsult: string;
  };
}

export interface CaseClinicalInfo extends CaseClinicalDefinition {
  /** Backwards compatibility alias for clinicalWarningSigns */
  thingsToPayAttentionTo: ClinicalWarningSign[];
  /** Backwards compatibility alias for clinicalInterventions */
  realTreatments: ClinicalIntervention[];
}

export const CLINICAL_KNOWLEDGE_BASE: Record<string, CaseClinicalDefinition> = {
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
      signalPathologyDescription: "Electrophysiological recording exhibits marked bilateral frontal beta power elevation (+44.3% over subject resting baseline) accompanied by desynchronization of resting posterior alpha rhythms (-38.3%).",
      normalBaselineComparison: "Current session relative Beta is 39.4% (+44.3% deviation from subject reference 27.3%), with concurrent Alpha desynchronization (-38.3% deviation from subject reference 37.1%)."
    },
    clinicalWarningSigns: [
      {
        sign: "Severe Cognitive Fatigue & Focus Depletion",
        clinicalContext: "General wellbeing note, not derived from this EEG reading: Persistent difficulty concentrating or mental exhaustion after intense problem-solving.",
        urgency: "Clinical Follow-Up"
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
    clinicalInterventions: [
      {
        treatmentName: "Slow-Paced Diaphragmatic Breathing & Neuro-Ergonomic Pacing",
        category: "Behavioral & Neuro-Regulation",
        howItWorks: "Structured breathing practice pacing respiration at ~6 breaths per minute to stimulate vagal baroreflex activity and suppress frontal beta over-activation.",
        evidenceBase: "Clinical Neuroergonomics Guidelines for Cognitive Strain"
      },
      {
        treatmentName: "Diurnal Salivary Cortisol & Neuroendocrine Evaluation",
        category: "Physician Laboratory Evaluation",
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
        title: "Difficulty Down-Regulating Cognitive Focus",
        description: "Persistent mental buzzing or racing thoughts making it difficult to transition into resting relaxation."
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
      signalPathologyDescription: "Signal reveals bursts of Frontal Midline Theta (Fm-theta, 4–8 Hz) power elevation (+36.4% over subject baseline) coupled with bilateral frontal beta augmentation (+30.9%), reflecting cognitive conflict monitoring during color-word interference.",
      normalBaselineComparison: "Current session Frontal Midline Theta represents 35.2% of total power (+36.4% deviation from subject reference 25.8%), with Alpha suppression (-35.1% from subject reference 30.2%)."
    },
    clinicalWarningSigns: [
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
    clinicalInterventions: [
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
      abnormalLocation: "Right frontal electrode (F4) alpha suppression relative to F3 (FAA: -0.48)",
      signalPathologyDescription: "Electrophysiological recording exhibits right-frontal relative beta power elevation (+48.7% over subject resting baseline) accompanied by marked bilateral alpha suppression (-42.8%) and Frontal Alpha Asymmetry of -0.48.",
      normalBaselineComparison: "Current session relative Beta is 45.8% (+48.7% deviation from subject reference 30.8%), with posterior Alpha desynchronization (-42.8% deviation from subject reference 31.8%)."
    },
    clinicalWarningSigns: [
      {
        sign: "Severe Emotional Distress & Persistent Panic Sensations",
        clinicalContext: "General wellbeing note, not derived from this EEG reading: Overwhelming distress or panic sensations interfering with daily functioning warrant professional medical evaluation.",
        urgency: "Clinical Follow-Up"
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
    clinicalInterventions: [
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
        title: "Subjective Hypervigilance & Racing Thoughts",
        description: "General psychological response documented in state anxiety literature; 7-channel scalp EEG reflects cortical fast-wave shifts and does not measure cardiac metrics."
      },
      {
        title: "Heightened Startle & Environmental Sensitivity",
        description: "Documented in state anxiety literature; reflects sympathetic nervous system arousal independent of EEG electrode signals."
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
      signalPathologyDescription: "Continuous sinusoidal Alpha waves (8–12 Hz) are symmetrically distributed across posterior leads with clean baseline stability, nominal beta power (13.4%), and nominal 0.0% deviation from resting reference.",
      normalBaselineComparison: "Resting baseline reference: Alpha power dominates at 54.1% of total spectral power with nominal Beta power (13.4%) and neutral frontal symmetry."
    },
    clinicalWarningSigns: [
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
    clinicalInterventions: [
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
        title: "Sensory Rest & Eyes-Closed Quietude",
        description: "Closing the eyes eliminates visual inputs, permitting primary visual cortex pyramidal networks to oscillate synchronously in the alpha band."
      },
      {
        title: "Nominal Cognitive Demands",
        description: "Absence of active arithmetic calculation, working memory load, or task performance pressure."
      },
      {
        title: "Rest-and-Digest Autonomic Balance",
        description: "Balanced parasympathetic regulation promoting recovery and physiological equilibrium."
      }
    ],
    symptoms: [
      {
        title: "Physical Calm & Bodily Relaxation",
        description: "Shoulders dropped, jaw unclasped, breathing relaxed and even."
      },
      {
        title: "Quiet Mental Presence",
        description: "Clear headspace free from racing thoughts, performance urgency, or acute worry."
      },
      {
        title: "Even, Unstrained Respiration",
        description: "Smooth, diaphragmatic breathing pattern with steady resting heart rate."
      }
    ],
    requiredTests: [],
    actionableGuidance: {
      immediateSteps: [
        "Maintain regular mindfulness, meditation, or quiet time to reinforce this restorative brain state.",
        "Preserve a consistent sleep-wake schedule to protect your baseline neural balance.",
        "Engage in regular light cardiovascular exercise (like walking or cycling) to keep stress hormones naturally low."
      ],
      doctorQuestions: [
        "Are my baseline resting vitals and EEG rhythms within the optimal range for my age group?"
      ],
      specialistToConsult: "Primary Care Physician (Routine Preventive Annual Checkup)"
    }
  }
};

/**
 * Fallback clinical guidance retriever
 */
export function getCaseClinicalInfo(caseId: string = "", stageOrRisk: string = ""): CaseClinicalInfo {
  let base: CaseClinicalDefinition;
  if (CLINICAL_KNOWLEDGE_BASE[caseId]) {
    base = CLINICAL_KNOWLEDGE_BASE[caseId];
  } else {
    const s = (stageOrRisk || "").toLowerCase();
    const c = (caseId || "").toLowerCase();

    if (s.includes("anxiety") || c.includes("anxiety") || s.includes("paroxysm")) {
      base = CLINICAL_KNOWLEDGE_BASE["dasps_s01_high_anxiety"];
    } else if (s.includes("stroop") || s.includes("conflict") || c.includes("stroop") || c.includes("student")) {
      base = CLINICAL_KNOWLEDGE_BASE["student_sub11_stroop_stress"];
    } else if (s.includes("stress") || s.includes("math") || c.includes("math") || c.includes("sam40")) {
      base = CLINICAL_KNOWLEDGE_BASE["sam40_sub01_math_stress"];
    } else {
      base = CLINICAL_KNOWLEDGE_BASE["default_relax_baseline"];
    }
  }

  return {
    ...base,
    thingsToPayAttentionTo: base.clinicalWarningSigns,
    realTreatments: base.clinicalInterventions,
  };
}
