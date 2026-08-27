/**
 * Nexus AI Career Engine & Pathway Copilot
 * Domain intelligence for Maharashtra State Skilling (MSSDS), NSDC & National Skill Qualification Framework (NSQF).
 */

export interface SkillGapDiagnosis {
  targetRole: string;
  matchedSkills: string[];
  missingSkills: string[];
  competencyScores: { skill: string; current: number; required: number; gap: number }[];
  gapPercentage: number;
  readinessScore: number;
  wageMultiplier: number;
  projectedSalary: number;
  aiDiagnosticSummary: string;
  priorityActions: string[];
}

export interface RoadmapPhase {
  phase_number: number;
  phase_title: string;
  day_range: string;
  objective: string;
  tasks: { id: string; task: string; completed: boolean; skill_tag: string }[];
}

export interface MockInterviewEvaluation {
  score: number;
  verdict: 'Mastery' | 'Strong' | 'Satisfactory' | 'Needs Work';
  strongPoints: string[];
  missingPoints: string[];
  actionableFeedback: string;
  modelAnswer: string;
}

// Master Role Competency Database (NSQF Aligned)
export const ROLE_BENCHMARKS: Record<string, {
  sector: string;
  baselineSalary: number;
  targetSalary: number;
  requiredSkills: string[];
  certifications: string[];
}> = {
  'Senior Apparel Quality Specialist & Boutique Entrepreneur': {
    sector: 'Apparel & Fashion',
    baselineSalary: 12000,
    targetSalary: 35000,
    requiredSkills: [
      'Industrial Stitching',
      'Pattern Making',
      'AQL 2.5 Quality Inspection',
      'Garment CAD Grading',
      'Fabric Defect Identification',
      'Udyam & GST Invoicing'
    ],
    certifications: ['MSSDS Master Apparel Quality Certificate', 'NSQF Level 5 Apparel']
  },
  'Solar PV Rooftop Installation & Inverter Lead': {
    sector: 'Renewable Energy',
    baselineSalary: 14000,
    targetSalary: 38000,
    requiredSkills: [
      'Solar PV Installation',
      'Inverter Wiring',
      'Megger Insulation Testing',
      'Earthing & Lightning Protection',
      'Grid Net Metering Integration',
      'OSHA Safety Protocols'
    ],
    certifications: ['Surya Mitra Certified Solar PV Technician', 'NSQF Level 4 Solar']
  },
  'Electric Vehicle (EV) Diagnostic & Battery Lead': {
    sector: 'Automotive & EV',
    baselineSalary: 15000,
    targetSalary: 42000,
    requiredSkills: [
      'EV Powertrain Diagnostics',
      'High Voltage Safety (1000V PPE)',
      'Battery Management System (BMS)',
      'CAN Bus Telemetry',
      'Thermal Runaway Prevention',
      'OBD-II Scanning'
    ],
    certifications: ['Automotive Sector Skill Council EV Lead', 'NSQF Level 6 EV']
  },
  'Full-Stack Web & Cloud Developer': {
    sector: 'IT & Digital',
    baselineSalary: 18000,
    targetSalary: 55000,
    requiredSkills: [
      'TypeScript',
      'Next.js & React',
      'PostgreSQL & Row Level Security',
      'REST & GraphQL APIs',
      'Git & CI/CD Deployment',
      'Cloud Architecture'
    ],
    certifications: ['Meta Full-Stack Professional', 'AWS Cloud Practitioner']
  },
  'Precision CNC Machinist & Tooling Specialist': {
    sector: 'Automotive & Manufacturing',
    baselineSalary: 14000,
    targetSalary: 36000,
    requiredSkills: [
      'G-Code Programming',
      'CNC Milling & Turning',
      'Vernier & Micrometer Metrology',
      'CAD/CAM Toolpath Simulation',
      'Geometric Dimensioning & Tolerancing (GD&T)'
    ],
    certifications: ['NSDC CNC Specialist', 'MSSDS Advanced Manufacturing']
  },
  'Healthcare & Patient Care Lead': {
    sector: 'Healthcare & Caregiving',
    baselineSalary: 12000,
    targetSalary: 30000,
    requiredSkills: [
      'Patient Vitals Monitoring',
      'CPR & BLS Emergency Response',
      'Sterilization & Aseptic Technique',
      'Biomedical Waste Protocols',
      'Electronic Health Records (EHR)'
    ],
    certifications: ['General Duty Assistant (GDA)', 'Red Cross First Aid']
  },
  'Retail MSME Enterprise Owner': {
    sector: 'Retail & Commerce',
    baselineSalary: 10000,
    targetSalary: 35000,
    requiredSkills: [
      'GST & Udyam MSME Compliance',
      'Inventory & Working Capital Management',
      'PMEGP & Mudra Subsidy Application',
      'Digital Payments & Point of Sale (POS)',
      'Customer Relationship Management'
    ],
    certifications: ['MSME Business Certification', 'MSSDS Retail Entrepreneurship']
  }
};

/**
 * 1. AI Skill Gap Diagnostic Function
 */
export function diagnoseSkillGap(
  currentSkills: string[] = [],
  targetRole: string,
  targetSalary: number = 30000
): SkillGapDiagnosis {
  const cleanCurrent = (currentSkills || []).map(s => s.trim().toLowerCase());
  
  // Look up benchmark or create a dynamic fallback
  const benchmark = ROLE_BENCHMARKS[targetRole] || {
    sector: 'Vocational & Technical',
    baselineSalary: 12000,
    targetSalary: Math.max(targetSalary, 25000),
    requiredSkills: [
      'Core Domain Technology',
      'Quality Standards & Compliance',
      'Safety Protocols',
      'Equipment Maintenance',
      'Customer & Client Communication'
    ],
    certifications: ['National Skill Qualification Framework (NSQF)']
  };

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];
  const competencyScores: SkillGapDiagnosis['competencyScores'] = [];

  benchmark.requiredSkills.forEach(reqSkill => {
    const isMatched = cleanCurrent.some(cs => {
      if (cs.includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(cs)) return true;
      const words = cs.split(/\s+/).filter(w => w.length > 3);
      return words.some(w => reqSkill.toLowerCase().includes(w));
    });

    if (isMatched) {
      matchedSkills.push(reqSkill);
      competencyScores.push({
        skill: reqSkill,
        current: 85,
        required: 90,
        gap: 5
      });
    } else {
      missingSkills.push(reqSkill);
      competencyScores.push({
        skill: reqSkill,
        current: 20,
        required: 85,
        gap: 65
      });
    }
  });

  const totalRequired = benchmark.requiredSkills.length;
  const matchRatio = totalRequired > 0 ? matchedSkills.length / totalRequired : 0.5;
  const readinessScore = Math.min(100, Math.round(matchRatio * 80 + 15));
  const gapPercentage = 100 - readinessScore;

  const baseline = benchmark.baselineSalary;
  const target = Math.max(targetSalary, benchmark.targetSalary);
  const wageMultiplier = Number((target / baseline).toFixed(2));

  const priorityActions = missingSkills.slice(0, 3).map(skill => 
    `Master "${skill}" via accredited NPTEL/Swayam technical coursework & interactive assessment.`
  );

  const aiDiagnosticSummary = matchedSkills.length >= (totalRequired * 0.7)
    ? `Strong baseline alignment (${readinessScore}% Readiness). You possess ${matchedSkills.length} of ${totalRequired} core industry competencies. Focus on the ${missingSkills.length} specialized certifications to reach target earning potential of ₹${target.toLocaleString('en-IN')}/month.`
    : `Foundational alignment (${readinessScore}% Readiness). You have verified ${matchedSkills.length} core skills. Closing the ${missingSkills.length} missing skill gaps can drive a ${wageMultiplier}x wage multiplier from ₹${baseline.toLocaleString('en-IN')} to ₹${target.toLocaleString('en-IN')}/month.`;

  return {
    targetRole,
    matchedSkills,
    missingSkills,
    competencyScores,
    gapPercentage,
    readinessScore,
    wageMultiplier,
    projectedSalary: target,
    aiDiagnosticSummary,
    priorityActions
  };
}

/**
 * 2. Dynamic N-Day Career Roadmap Generator
 */
export function generateDynamicRoadmap(
  targetRole: string,
  targetDays: number = 90,
  currentSkills: string[] = [],
  weeklyHours: number = 10
): RoadmapPhase[] {
  const diagnosis = diagnoseSkillGap(currentSkills, targetRole);
  const missing = diagnosis.missingSkills;
  const matched = diagnosis.matchedSkills;

  const dayStep1 = Math.max(1, Math.round(targetDays * 0.25));
  const dayStep2 = Math.max(dayStep1 + 1, Math.round(targetDays * 0.60));
  const dayStep3 = Math.max(dayStep2 + 1, Math.round(targetDays * 0.85));
  const dayStep4 = targetDays;

  const primaryMissing1 = missing[0] || 'Core Domain Standards';
  const primaryMissing2 = missing[1] || 'Advanced Quality Testing';
  const primaryMissing3 = missing[2] || 'Industry Tooling & Simulation';

  return [
    {
      phase_number: 1,
      phase_title: 'Phase 1: Foundation Mastery & Skill Benchmarking',
      day_range: `Days 1 – ${dayStep1}`,
      objective: `Complete core online courses (${weeklyHours}h/week) and achieve passing score on preliminary skill assessment.`,
      tasks: [
        { id: 'p1-t1', task: `Enroll in accredited NPTEL / Swayam course for ${targetRole}`, completed: matched.length > 0, skill_tag: 'Coursework' },
        { id: 'p1-t2', task: `Attempt baseline interactive skill assessment for ${targetRole}`, completed: matched.length > 1, skill_tag: 'Assessment' },
        { id: 'p1-t3', task: 'Verify personal profile and upload foundational education documents', completed: true, skill_tag: 'Documentation' }
      ]
    },
    {
      phase_number: 2,
      phase_title: 'Phase 2: Applied Technical Specialization',
      day_range: `Days ${dayStep1 + 1} – ${dayStep2}`,
      objective: `Bridge critical skill gaps: "${primaryMissing1}" and "${primaryMissing2}".`,
      tasks: [
        { id: 'p2-t1', task: `Master practical exercises for ${primaryMissing1}`, completed: false, skill_tag: primaryMissing1 },
        { id: 'p2-t2', task: `Complete laboratory / workshop module for ${primaryMissing2}`, completed: false, skill_tag: primaryMissing2 },
        { id: 'p2-t3', task: 'Study top 15 trade interview questions with sample model answers', completed: false, skill_tag: 'Interview Prep' }
      ]
    },
    {
      phase_number: 3,
      phase_title: 'Phase 3: Industry Project & Mock Interviews',
      day_range: `Days ${dayStep2 + 1} – ${dayStep3}`,
      objective: `Execute hands-on project for "${primaryMissing3}" and simulate 3 AI mock interviews.`,
      tasks: [
        { id: 'p3-t1', task: `Complete capstone live project demonstrating ${primaryMissing3}`, completed: false, skill_tag: 'Capstone' },
        { id: 'p3-t2', task: `Pass advanced trade skill assessment with score >= 75% for verified badge`, completed: false, skill_tag: 'Badge' },
        { id: 'p3-t3', task: 'Perform AI Mock Interview and score above 80% on technical evaluation', completed: false, skill_tag: 'AI Mock' }
      ]
    },
    {
      phase_number: 4,
      phase_title: 'Phase 4: Apprenticeship, Loan Grant & Placement',
      day_range: `Days ${dayStep3 + 1} – ${dayStep4}`,
      objective: `Apply to verified employers or government micro-grants (PMEGP / Mudra) to achieve target earning.`,
      tasks: [
        { id: 'p4-t1', task: 'Apply to 3+ verified partner vacancies on Nexus Employer Desk', completed: false, skill_tag: 'Placement' },
        { id: 'p4-t2', task: 'Submit government scheme application if pursuing self-employment', completed: false, skill_tag: 'Schemes' },
        { id: 'p4-t3', task: `Attain target income milestone of ₹${diagnosis.projectedSalary.toLocaleString('en-IN')}/month`, completed: false, skill_tag: 'Outcome' }
      ]
    }
  ];
}

/**
 * 3. AI Mock Interview Answer Evaluator
 */
export function evaluateMockInterviewAnswer(
  tradeRole: string,
  question: string,
  userAnswer: string,
  keyPoints: string[] = []
): MockInterviewEvaluation {
  const cleanAns = (userAnswer || '').trim().toLowerCase();

  if (cleanAns.length < 20) {
    return {
      score: 30,
      verdict: 'Needs Work',
      strongPoints: ['Attempted to respond.'],
      missingPoints: ['Answer is too brief.', ...keyPoints],
      actionableFeedback: 'Your answer is too brief. Provide a structured explanation detailing technical steps, tools used, and safety considerations.',
      modelAnswer: keyPoints.length > 0 
        ? `A comprehensive answer should explicitly cover: ${keyPoints.join(', ')}.`
        : 'State the core principle, your hands-on methodology, measurements or tolerance limits, and quality verification standards.'
    };
  }

  const matchedPoints: string[] = [];
  const missingPoints: string[] = [];

  keyPoints.forEach(kp => {
    const words = kp.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const hasMatch = words.some(w => cleanAns.includes(w));
    if (hasMatch) {
      matchedPoints.push(kp);
    } else {
      missingPoints.push(kp);
    }
  });

  // Calculate score based on concept coverage and articulation
  const matchRatio = keyPoints.length > 0 ? (matchedPoints.length / keyPoints.length) : 0.8;
  const lengthBonus = Math.min(30, cleanAns.split(/\s+/).length * 1.5);
  const keywordScore = matchRatio * 60;
  const baseScore = keywordScore + lengthBonus + 10;

  const finalScore = Math.min(98, Math.max(25, Math.round(baseScore)));

  let verdict: MockInterviewEvaluation['verdict'] = 'Needs Work';
  if (finalScore >= 85) verdict = 'Mastery';
  else if (finalScore >= 70) verdict = 'Strong';
  else if (finalScore >= 50) verdict = 'Satisfactory';

  const strongPoints = matchedPoints.length > 0 
    ? matchedPoints.map(p => `Accurately referenced "${p}"`)
    : ['Demonstrated clear familiarity with the fundamental workflow'];

  const actionableFeedback = finalScore >= 80
    ? `Outstanding technical precision! You demonstrated deep familiarity with standard protocols for ${tradeRole}. Ready for high-tier enterprise interviews.`
    : `Good foundation. To reach an A-grade evaluation, clearly articulate specific tolerance values, standard operating procedures, and safety checks for: ${missingPoints.join('; ')}.`;

  return {
    score: finalScore,
    verdict,
    strongPoints,
    missingPoints,
    actionableFeedback,
    modelAnswer: keyPoints.length > 0
      ? `Under industry standards for ${tradeRole}, the ideal answer integrates: 1. Initial diagnostic inspection. 2. Safety protocols and exact calibration (${keyPoints.slice(0, 2).join(', ')}). 3. Quality validation (${keyPoints.slice(2).join(', ') || 'compliance sign-off'}).`
      : `Provide a 3-part response: (a) Technical definition, (b) Standard operating step-by-step procedure, and (c) Post-operation quality assurance check.`
  };
}
