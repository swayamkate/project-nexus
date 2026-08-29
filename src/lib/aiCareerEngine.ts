/**
 * CareerLoop AI Career Engine & Pathway Copilot
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

export interface RoleBenchmark {
  sector: string;
  baselineSalary: number;
  targetSalary: number;
  requiredSkills: string[];
  certifications: string[];
}

// Master Role Competency Database (NSQF Aligned across 22+ Core Industries)
export const ROLE_BENCHMARKS: Record<string, RoleBenchmark> = {
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
  },
  'Commercial Drone Pilot & Mapping Technician': {
    sector: 'Aerospace & Geospatial',
    baselineSalary: 16000,
    targetSalary: 45000,
    requiredSkills: [
      'DGCA Remote Pilot License (RPL)',
      'Photogrammetry & LiDAR Surveying',
      'GIS Mapping (QGIS & ArcGIS)',
      'Flight Path Planning & Geofencing',
      'LiPo Battery Health Maintenance'
    ],
    certifications: ['DGCA Certified Remote Pilot (Small Category)', 'NSQF Level 5 Drone Operations']
  },
  'Industrial Electrician & Substation Wireman': {
    sector: 'Power & Electrical',
    baselineSalary: 13000,
    targetSalary: 34000,
    requiredSkills: [
      '3-Phase Industrial Wiring',
      'PLC & Relay Logic Controls',
      'Transformer Maintenance & Oil Testing',
      'Substation Switchgear Operations',
      'HT/LT Cable Jointing & Termination'
    ],
    certifications: ['State Electrical Wireman License', 'NSQF Level 4 Industrial Electrician']
  },
  'Cyber Security SOC Analyst & Enclave Auditor': {
    sector: 'IT & Cyber Security',
    baselineSalary: 20000,
    targetSalary: 60000,
    requiredSkills: [
      'SIEM Telemetry & Log Analysis',
      'Network Vulnerability Assessment',
      'Threat Hunting & MITRE ATT&CK',
      'Identity & Access Management (IAM)',
      'Incident Response & Forensic Triage'
    ],
    certifications: ['CompTIA Security+', 'Certified SOC Analyst (CSA)']
  },
  'Micro-Irrigation & Smart Agri-Tech Specialist': {
    sector: 'Agriculture & Agri-Tech',
    baselineSalary: 11000,
    targetSalary: 32000,
    requiredSkills: [
      'Drip & Sprinkler System Hydraulic Design',
      'Soil Moisture Sensor Telemetry & IoT',
      'Fertigation Unit Calibration',
      'Solar Agri-Pump Net Metering',
      'Crop Water Budgeting'
    ],
    certifications: ['Agriculture Sector Skill Council Micro-Irrigation Lead', 'NSQF Level 4 Agri-Tech']
  },
  'Food Processing & Quality Control Chemist': {
    sector: 'Food & Nutrition',
    baselineSalary: 12500,
    targetSalary: 33000,
    requiredSkills: [
      'FSSAI & HACCP Food Safety Compliance',
      'Aseptic Packaging & Canning Protocols',
      'Microbiological Lab Testing',
      'Cold Chain Temperature Logging',
      'Nutritional Labelling & Moisture Analysis'
    ],
    certifications: ['FSSAI Food Safety Supervisor (FoSTaC)', 'NSQF Level 5 Food Processing']
  },
  'Supply Chain & Warehouse Logistics Supervisor': {
    sector: 'Logistics & Transportation',
    baselineSalary: 13500,
    targetSalary: 36000,
    requiredSkills: [
      'Warehouse Management Systems (WMS)',
      'Barcoding & RFID Inventory Scanning',
      'Fleet Route Optimization',
      'Forklift & Material Handling Safety',
      'Cold Storage Logistics Auditing'
    ],
    certifications: ['Logistics SSC Supervisor Credential', 'APICS Supply Chain Foundations']
  },
  'HVAC & Commercial Refrigeration Lead Technician': {
    sector: 'HVAC & Cold Chain',
    baselineSalary: 14000,
    targetSalary: 38000,
    requiredSkills: [
      'VRF/VRV Air Conditioning Troubleshooting',
      'Refrigerant Recovery & Vacuum Testing (R32/R410A)',
      'Compressor Overhauling & Motor Rewinding',
      'Psychrometric Air Balancing',
      'Cold Storage Ammonia Safety'
    ],
    certifications: ['RASCI Master HVAC Technician', 'NSQF Level 5 RAC']
  },
  'Welding Specialist & Robotic Fabrication Lead': {
    sector: 'Heavy Engineering',
    baselineSalary: 14500,
    targetSalary: 37000,
    requiredSkills: [
      'MIG/MAG & TIG Argon Arc Welding',
      'Robotic Welding Arm Teach Pendant Programming',
      'Non-Destructive Testing (NDT Ultrasonic/Dye Penetrant)',
      'Pressure Vessel ASME Code Compliance',
      'Structural Steel Blueprint Reading'
    ],
    certifications: ['Indian Institute of Welding (IIW) 6G Certified', 'NSQF Level 4 Fabrication']
  },
  'Hospital Operations & Clinical Administrator': {
    sector: 'Healthcare & Hospital Ops',
    baselineSalary: 15000,
    targetSalary: 40000,
    requiredSkills: [
      'NABH Hospital Accreditation Compliance',
      'Ayushman Bharat (PM-JAY) Portal Processing',
      'Electronic Health Records (EHR) Auditing',
      'Emergency Department Triage Coordination',
      'Biomedical Asset Lifecycle Tracking'
    ],
    certifications: ['Healthcare SSC Hospital Admin Lead', 'NSQF Level 6 Hospital Operations']
  },
  'Digital Marketing & E-Commerce Growth Specialist': {
    sector: 'Media & Commerce',
    baselineSalary: 14000,
    targetSalary: 42000,
    requiredSkills: [
      'Meta & Google Ads Campaign Optimization',
      'Search Engine Optimization (SEO & Schema)',
      'Shopify & ONDC Storefront Configuration',
      'WhatsApp Business API Automation',
      'Analytics & Return on Ad Spend (ROAS) Modeling'
    ],
    certifications: ['Google Digital Marketing & E-commerce', 'Meta Certified Digital Marketing Associate']
  },
  'Beauty & Wellness Spa Clinic Entrepreneur': {
    sector: 'Beauty & Wellness',
    baselineSalary: 11000,
    targetSalary: 34000,
    requiredSkills: [
      'Advanced Cosmetology & Skin Analysis',
      'Bridal Hair Styling & Chemical Treatments',
      'Sanitization & Sterilization Standards',
      'Salon Software Booking & Inventory',
      'PMEGP Salon Setup Subsidy Filing'
    ],
    certifications: ['Beauty & Wellness SSC Master Aesthetician', 'CIDESCO Certified Practitioner']
  },
  'Plumbing & Smart Water Grid Technician': {
    sector: 'Civil & Sanitation',
    baselineSalary: 12000,
    targetSalary: 30000,
    requiredSkills: [
      'PEX & CPVC Hot/Cold Pipe Jointing',
      'Water Booster Pump Hydro-Pneumatic Systems',
      'Smart Ultrasonic Water Meter Installation',
      'Sewage Treatment Plant (STP) Piping Maintenance',
      'Jal Jeevan Mission Quality Standards'
    ],
    certifications: ['Indian Plumbing Skills Council (IPSC) Lead Plumber', 'NSQF Level 4 Plumbing']
  },
  'Data Analytics & Python Automation Engineer': {
    sector: 'IT & Analytics',
    baselineSalary: 19000,
    targetSalary: 52000,
    requiredSkills: [
      'Python (Pandas, NumPy, Matplotlib)',
      'SQL & Analytical Query Optimization',
      'Power BI & Tableau Dashboarding',
      'Automated ETL Data Pipelines',
      'REST API Integration'
    ],
    certifications: ['Google Data Analytics Professional', 'Microsoft Power BI Data Analyst (PL-300)']
  },
  'Telecom & Fiber Optic Network Lead': {
    sector: 'Telecom & Infrastructure',
    baselineSalary: 13500,
    targetSalary: 35000,
    requiredSkills: [
      'Fiber Optic Fusion Splicing & Ribbon Jointing',
      'Optical Time Domain Reflectometer (OTDR) Testing',
      '5G Small Cell Tower Antenna Alignment',
      'GPON / FTTH Network Layout Deployment',
      'Underground Conduit Trenching Compliance'
    ],
    certifications: ['Telecom SSC Optical Fiber Splicer', 'NSQF Level 4 Telecom']
  }
};

/**
 * Helper to dynamically resolve or synthesize role benchmarks for ANY custom dream role.
 */
export function resolveRoleBenchmark(targetRole: string, targetSalary: number = 35000): RoleBenchmark {
  if (ROLE_BENCHMARKS[targetRole]) {
    return ROLE_BENCHMARKS[targetRole];
  }

  // Synthesize dynamic custom role benchmark based on title keywords
  const titleLower = targetRole.toLowerCase();
  
  let sector = 'Vocational & Technical';
  let baseline = 14000;
  let target = Math.max(targetSalary, 32000);
  let requiredSkills = [
    'Industry Standard Operating Procedures',
    'Quality Control & Defect Prevention',
    'Safety & Regulatory Compliance',
    'Tools & Advanced Equipment Operation',
    'Client Communication & Documentation',
    'Business & Workflow Management'
  ];
  let certifications = ['NSQF National Skill Certification', 'State Skill Development Credential'];

  if (titleLower.includes('solar') || titleLower.includes('energy') || titleLower.includes('electric') || titleLower.includes('power')) {
    sector = 'Renewable Energy & Power';
    baseline = 15000;
    target = Math.max(targetSalary, 38000);
    requiredSkills = [
      'Power Wiring & Inverter Integration',
      'Safety Protocols & PPE Compliance',
      'System Testing & Diagnostic Instruments',
      'Grid Interconnection & Net Metering',
      'Preventative Maintenance Schedules',
      'Regulatory Filing & Inspections'
    ];
    certifications = ['National Clean Energy Skill Council', 'NSQF Level 5 Technical'];
  } else if (titleLower.includes('ev') || titleLower.includes('auto') || titleLower.includes('motor') || titleLower.includes('vehicle') || titleLower.includes('mech')) {
    sector = 'Automotive & EV';
    baseline = 16000;
    target = Math.max(targetSalary, 42000);
    requiredSkills = [
      'Diagnostic Scanners & Fault Telemetry',
      'High-Voltage Safety & BMS Systems',
      'Precision Mechanical Assemblies',
      'Component Overhauling & Quality Testing',
      'Preventive Maintenance Standards',
      'Technical Customer Support'
    ];
    certifications = ['Automotive Sector Skill Council Lead', 'NSQF Level 5 Automotive'];
  } else if (titleLower.includes('software') || titleLower.includes('web') || titleLower.includes('cloud') || titleLower.includes('data') || titleLower.includes('cyber') || titleLower.includes('tech') || titleLower.includes('code') || titleLower.includes('developer')) {
    sector = 'IT & Digital';
    baseline = 20000;
    target = Math.max(targetSalary, 55000);
    requiredSkills = [
      'Core Programming & Scripting',
      'Database Architecture & SQL Queries',
      'Cloud Deployment & CI/CD Pipelines',
      'API Integration & Telemetry',
      'System Security & Access Controls',
      'Technical Architecture & Code Review'
    ];
    certifications = ['Global Tech Industry Professional Certificate', 'NSQF Level 6 Digital'];
  } else if (titleLower.includes('garment') || titleLower.includes('fashion') || titleLower.includes('apparel') || titleLower.includes('textile') || titleLower.includes('boutique') || titleLower.includes('tailor')) {
    sector = 'Apparel & Fashion';
    baseline = 12000;
    target = Math.max(targetSalary, 35000);
    requiredSkills = [
      'Pattern Making & Grading',
      'Industrial Stitching & Machine Maintenance',
      'AQL Quality Inspection Standards',
      'Fabric Defect Identification & Finishing',
      'Costing, Pricing & Vendor Sourcing',
      'MSME Compliance & Invoicing'
    ];
    certifications = ['Apparel SSC Master Practitioner', 'NSQF Level 5 Fashion'];
  } else if (titleLower.includes('health') || titleLower.includes('nurse') || titleLower.includes('clinic') || titleLower.includes('care') || titleLower.includes('medical')) {
    sector = 'Healthcare & Life Sciences';
    baseline = 13000;
    target = Math.max(targetSalary, 32000);
    requiredSkills = [
      'Patient Vitals & Clinical Protocols',
      'Emergency First Aid & CPR/BLS Response',
      'Sterilization & Biomedical Safety',
      'Electronic Health Records (EHR)',
      'Patient Communication & Ethics',
      'Medical Asset Maintenance'
    ];
    certifications = ['Healthcare SSC Certified Lead', 'Red Cross Certified Specialist'];
  } else if (titleLower.includes('drone') || titleLower.includes('aviation') || titleLower.includes('survey') || titleLower.includes('gis')) {
    sector = 'Aerospace & Geospatial';
    baseline = 17000;
    target = Math.max(targetSalary, 45000);
    requiredSkills = [
      'Remote Pilot Flight Operations',
      'LiDAR & Photogrammetry Mapping',
      'GIS Software (QGIS / ArcGIS)',
      'Battery & Rotor Maintenance',
      'Airspace Geofencing Regulations',
      'Client Survey Data Delivery'
    ];
    certifications = ['DGCA Certified Remote Pilot', 'NSQF Level 5 Geospatial'];
  } else if (titleLower.includes('food') || titleLower.includes('dairy') || titleLower.includes('agri') || titleLower.includes('farm')) {
    sector = 'Food & Agriculture';
    baseline = 12500;
    target = Math.max(targetSalary, 34000);
    requiredSkills = [
      'Food Safety & FSSAI Standards',
      'Aseptic Processing & Packaging',
      'Quality Lab Testing & Moisture Analysis',
      'Cold Chain Temperature Logging',
      'Inventory & Batch Tracking',
      'Vendor & Farm Sourcing'
    ];
    certifications = ['Food Industry Safety Supervisor', 'NSQF Level 5 Agri-Food'];
  }

  return {
    sector,
    baselineSalary: baseline,
    targetSalary: target,
    requiredSkills,
    certifications
  };
}

/**
 * 1. AI Skill Gap Diagnostic Function (Completely Dynamic based on actual verified skills & custom roles)
 */
export function diagnoseSkillGap(
  currentSkills: string[] = [],
  targetRole: string,
  targetSalary: number = 35000,
  currentLevel: string = 'Intermediate'
): SkillGapDiagnosis {
  const cleanCurrent = (currentSkills || []).map(s => s.trim().toLowerCase());
  const benchmark = resolveRoleBenchmark(targetRole, targetSalary);

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];
  const competencyScores: SkillGapDiagnosis['competencyScores'] = [];

  let totalCurrentProficiency = 0;
  let totalRequiredProficiency = 0;

  benchmark.requiredSkills.forEach((reqSkill, idx) => {
    const reqLower = reqSkill.toLowerCase();
    const reqWords = reqLower.split(/\s+/).filter(w => w.length > 2);

    // Check exact or partial match
    let matchStrength = 0; // 0 = none, 1 = partial, 2 = full match
    for (const cs of cleanCurrent) {
      if (cs === reqLower || cs.includes(reqLower) || reqLower.includes(cs)) {
        matchStrength = 2;
        break;
      }
      const csWords = cs.split(/\s+/).filter(w => w.length > 2);
      const overlap = csWords.filter(w => reqWords.includes(w));
      if (overlap.length > 0) {
        matchStrength = Math.max(matchStrength, 1);
      }
    }

    const targetStandard = 90;
    let currentScore = 0;

    if (matchStrength === 2) {
      // Full verified skill match
      currentScore = currentLevel === 'Advanced' ? 92 : currentLevel === 'Intermediate' ? 86 : 78;
      matchedSkills.push(reqSkill);
    } else if (matchStrength === 1) {
      // Partial related skill
      currentScore = currentLevel === 'Advanced' ? 62 : currentLevel === 'Intermediate' ? 48 : 38;
      missingSkills.push(reqSkill);
    } else {
      // Unlearned domain skill
      const baseVariation = (idx * 4) % 15;
      currentScore = currentLevel === 'Advanced' ? (28 + baseVariation) : currentLevel === 'Intermediate' ? (15 + baseVariation) : (8 + baseVariation);
      missingSkills.push(reqSkill);
    }

    const gap = Math.max(0, targetStandard - currentScore);
    totalCurrentProficiency += currentScore;
    totalRequiredProficiency += targetStandard;

    competencyScores.push({
      skill: reqSkill,
      current: currentScore,
      required: targetStandard,
      gap: gap
    });
  });

  const totalRequired = benchmark.requiredSkills.length;
  const readinessScore = totalRequiredProficiency > 0 
    ? Math.min(100, Math.max(5, Math.round((totalCurrentProficiency / totalRequiredProficiency) * 100)))
    : 50;
  const gapPercentage = Math.max(0, 100 - readinessScore);

  const baseline = benchmark.baselineSalary;
  const target = Math.max(targetSalary, benchmark.targetSalary);
  const wageMultiplier = Number((target / baseline).toFixed(2));

  const priorityActions = missingSkills.slice(0, 3).map(skill => 
    `Master "${skill}" via accredited NPTEL/Swayam technical coursework & interactive assessment.`
  );

  const aiDiagnosticSummary = matchedSkills.length >= (totalRequired * 0.7)
    ? `Strong baseline alignment (${readinessScore}% Readiness). You possess ${matchedSkills.length} of ${totalRequired} core industry competencies for "${targetRole}". Focus on the ${missingSkills.length} specialized certifications to reach target earning potential of ₹${target.toLocaleString('en-IN')}/month.`
    : `Foundational alignment (${readinessScore}% Readiness, ${gapPercentage}% Skill Gap). You have verified ${matchedSkills.length} of ${totalRequired} required competencies for "${targetRole}". Closing the ${missingSkills.length} missing skill gaps can unlock a ${wageMultiplier}x wage multiplier from ₹${baseline.toLocaleString('en-IN')} to ₹${target.toLocaleString('en-IN')}/month.`;

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
 * 2. AI Personalized Roadmap Generator for N-Days (Completely Dynamic)
 */
export function generateDynamicRoadmap(
  targetRole: string,
  targetDays: number = 90,
  verifiedSkills: string[] = []
): RoadmapPhase[] {
  const diagnosis = diagnoseSkillGap(verifiedSkills, targetRole);
  const { missingSkills, matchedSkills } = diagnosis;
  const benchmark = resolveRoleBenchmark(targetRole);

  const daysP1 = Math.round(targetDays * 0.3);
  const daysP2 = Math.round(targetDays * 0.35);
  const daysP3 = targetDays - daysP1 - daysP2;

  const s1 = missingSkills[0] || benchmark.requiredSkills[0] || 'Core Domain Fundamentals';
  const s2 = missingSkills[1] || benchmark.requiredSkills[1] || 'Industrial Standards & Tools';
  const s3 = missingSkills[2] || benchmark.requiredSkills[2] || 'Advanced Workflow Execution';
  const s4 = missingSkills[3] || benchmark.requiredSkills[3] || 'Quality & Business Optimization';

  return [
    {
      phase_number: 1,
      phase_title: 'Foundations & Technical Baseline',
      day_range: `Day 1 – Day ${daysP1}`,
      objective: `Eliminate primary domain deficiencies in ${s1} and establish safety & equipment fluency.`,
      tasks: [
        { id: 't-1-1', task: `Complete accredited NPTEL / Swayam coursework for ${s1}`, completed: matchedSkills.includes(s1), skill_tag: s1 },
        { id: 't-1-2', task: `Study regulatory safety standards and industrial equipment manual for ${benchmark.sector}`, completed: false, skill_tag: 'Safety Standards' },
        { id: 't-1-3', task: `Take Level 1 trade diagnostic quiz and review core technical formulas`, completed: false, skill_tag: 'Foundational Knowledge' }
      ]
    },
    {
      phase_number: 2,
      phase_title: 'Hands-on Execution & Core Competencies',
      day_range: `Day ${daysP1 + 1} – Day ${daysP1 + daysP2}`,
      objective: `Master practical operations for ${s2} and ${s3} with live project simulations.`,
      tasks: [
        { id: 't-2-1', task: `Hands-on training module: Practical execution of ${s2}`, completed: matchedSkills.includes(s2), skill_tag: s2 },
        { id: 't-2-2', task: `Advanced workflow simulation: Solve real-world problem statement for ${s3}`, completed: matchedSkills.includes(s3), skill_tag: s3 },
        { id: 't-2-3', task: `Document verified work sample into CareerLoop Portfolio & submit for officer review`, completed: false, skill_tag: 'Portfolio Review' }
      ]
    },
    {
      phase_number: 3,
      phase_title: 'Certification, Quality Audit & Industry Placement',
      day_range: `Day ${daysP1 + daysP2 + 1} – Day ${targetDays}`,
      objective: `Attain ${benchmark.certifications[0]} and prepare for high-wage placement interviews / enterprise launch.`,
      tasks: [
        { id: 't-3-1', task: `Complete certification exam: ${benchmark.certifications[0]}`, completed: false, skill_tag: s4 },
        { id: 't-3-2', task: `Practice AI Mock Technical Interviews for ${targetRole}`, completed: false, skill_tag: 'Interview Readiness' },
        { id: 't-3-3', task: `Finalize wage contract or file Udyam MSME / Mudra capital grant subsidy application`, completed: false, skill_tag: 'Career Launch' }
      ]
    }
  ];
}

/**
 * 3. AI Mock Interview Evaluator (Dynamic Domain-Aware Scoring)
 */
export function evaluateMockInterviewAnswer(
  questionText: string,
  userAnswer: string,
  keyPoints: string[] = []
): MockInterviewEvaluation {
  const cleanAns = userAnswer.trim().toLowerCase();
  const words = cleanAns.split(/\s+/).filter(Boolean);

  if (words.length < 5) {
    return {
      score: 25,
      verdict: 'Needs Work',
      strongPoints: ['Attempted to respond.'],
      missingPoints: ['Answer is too brief. Provide technical specifics, terminology, and step-by-step methodologies.'],
      actionableFeedback: 'Elaborate your explanation by mentioning specific safety steps, tools used, and verification checks.',
      modelAnswer: keyPoints.length > 0 
        ? `A comprehensive response covers: ${keyPoints.join('; ')}.` 
        : 'In a real interview, explain the exact problem, the step-by-step resolution method, and how you verify quality.'
    };
  }

  const strongPoints: string[] = [];
  const missingPoints: string[] = [];

  keyPoints.forEach(pt => {
    const ptWords = pt.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const hasOverlap = ptWords.some(w => cleanAns.includes(w));
    if (hasOverlap) {
      strongPoints.push(`Covered key concept: "${pt}"`);
    } else {
      missingPoints.push(`Missed mentioning: "${pt}"`);
    }
  });

  // Calculate dynamic score
  const coverageRatio = keyPoints.length > 0 ? (strongPoints.length / keyPoints.length) : 0.6;
  const lengthBonus = Math.min(20, words.length * 0.4);
  const computedScore = Math.min(100, Math.max(30, Math.round(coverageRatio * 75 + lengthBonus)));

  const verdict: MockInterviewEvaluation['verdict'] = computedScore >= 85 
    ? 'Mastery' 
    : computedScore >= 70 
    ? 'Strong' 
    : computedScore >= 50 
    ? 'Satisfactory' 
    : 'Needs Work';

  const actionableFeedback = verdict === 'Mastery'
    ? 'Outstanding explanation! You demonstrated thorough technical command and industry terminology.'
    : verdict === 'Strong'
    ? 'Solid answer. To achieve full marks, articulate the safety precautions and testing tolerances in greater detail.'
    : 'Good effort. Make sure to structure your answer using the STAR method (Situation, Task, Action, Result) and include all regulatory compliance parameters.';

  const modelAnswer = `Professional Benchmark Answer:\n${keyPoints.map((pt, i) => `${i + 1}. ${pt}`).join('\n')}\n\nConclude by verifying quality checks and documenting the outcome in the job card.`;

  return {
    score: computedScore,
    verdict,
    strongPoints: strongPoints.length > 0 ? strongPoints : ['Answer communicates practical general familiarity.'],
    missingPoints: missingPoints.length > 0 ? missingPoints : ['None! All key technical points addressed.'],
    actionableFeedback,
    modelAnswer
  };
}
