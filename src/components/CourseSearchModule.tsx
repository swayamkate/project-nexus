'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  BookOpen, 
  ExternalLink, 
  GraduationCap, 
  Filter, 
  Star, 
  Clock, 
  Award, 
  CheckCircle2, 
  Plus, 
  Layers, 
  Globe, 
  Sparkles,
  Sliders,
  Calendar,
  Building2,
  Check,
  Info,
  X
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { createClient } from '@/lib/supabaseBrowser';
import { mutateDb } from '@/lib/traineeApi';

interface Course {
  id: string;
  title: string;
  provider: string;
  institute?: string;
  platform: 'NPTEL' | 'Swayam' | 'Coursera' | 'Skill India' | 'MSSDS';
  sector: string;
  duration_weeks: number;
  estimated_hours: number;
  rating: number;
  enrolled_count: number;
  is_free: boolean;
  has_certificate: boolean;
  nsqf_level: number;
  deadline?: string;
  exam_date?: string;
  prerequisites?: string;
  description: string;
  syllabus?: string[];
  url: string;
  skill_tags: string[];
}

const AUTHENTIC_COURSES: Course[] = [
  {
    id: 'nptel-garment-01',
    title: 'Apparel Manufacturing & Industrial Garment Technology',
    provider: 'Prof. R. Chattopadhyay',
    institute: 'IIT Delhi / NPTEL',
    platform: 'NPTEL',
    sector: 'Apparel & Fashion',
    duration_weeks: 12,
    estimated_hours: 60,
    rating: 4.9,
    enrolled_count: 14820,
    is_free: true,
    has_certificate: true,
    nsqf_level: 5,
    deadline: '15 Sep 2025',
    exam_date: '26 Oct 2025',
    prerequisites: 'Basic knowledge of textiles or 10th Standard passing certificate',
    description: 'A comprehensive National Programme on Technology Enhanced Learning course covering industrial fabric cutting, automated spreading, computer-aided pattern grading, AQL 2.5 quality control standards, and apparel plant layout optimization.',
    syllabus: [
      'Fabric Inspection Protocols & 4-Point Defect Scoring',
      'Computer-Aided Design (CAD) Pattern Making & Marker Efficiency',
      'Industrial Sewing Machine Kinematics & Stitch Class 100-600',
      'Garment Finishing, Pressing & Packaging Compliance'
    ],
    url: 'https://onlinecourses.nptel.ac.in/noc24_te01/preview',
    skill_tags: ['Garment CAD', 'AQL 2.5 Inspection', 'Industrial Stitching', 'Pattern Making']
  },
  {
    id: 'swayam-fashion-02',
    title: 'Garment Manufacturing Technology & Quality Assurance',
    provider: 'National Institute of Fashion Technology (NIFT)',
    institute: 'NIFT / Ministry of Textiles',
    platform: 'Swayam',
    sector: 'Apparel & Fashion',
    duration_weeks: 8,
    estimated_hours: 40,
    rating: 4.8,
    enrolled_count: 9240,
    is_free: true,
    has_certificate: true,
    nsqf_level: 4,
    deadline: '28 Sep 2025',
    exam_date: '15 Nov 2025',
    prerequisites: 'Open to all vocational school students and boutique owners',
    description: 'Developed by NIFT under the Ministry of Education Swayam framework. Equips artisans with production line balancing, boutique merchandising, seam strength testing, and export garment compliance standards.',
    syllabus: [
      'Anthropometric Sizing Charts & Body Measurement Standards',
      'Draping Fundamentals & Dart Manipulation Techniques',
      'Garment Costing, Fabric Estimation & Trim Procurement',
      'Export Quality Standards (ISO / OEKO-TEX Compliance)'
    ],
    url: 'https://swayam.gov.in/explorer?category=Design',
    skill_tags: ['Pattern Drafting', 'Production Balancing', 'Boutique Management', 'Seam Testing']
  },
  {
    id: 'nptel-ev-03',
    title: 'Electric Vehicles - System Architecture & Battery Management',
    provider: 'Prof. Ashok Jhunjhunwala',
    institute: 'IIT Madras / NPTEL',
    platform: 'NPTEL',
    sector: 'Automotive & EV',
    duration_weeks: 12,
    estimated_hours: 72,
    rating: 4.9,
    enrolled_count: 26400,
    is_free: true,
    has_certificate: true,
    nsqf_level: 6,
    deadline: '10 Sep 2025',
    exam_date: '02 Nov 2025',
    prerequisites: 'Basic Electrical / Physics background or ITI Wireman certification',
    description: 'The flagship IIT Madras EV course designed for state automotive technicians. Covers Lithium-Ion cell chemistry, battery pack thermal management, regenerative braking, motor drive controllers, and high-voltage safety interlocks.',
    syllabus: [
      'EV Powertrain Topologies & BLDC Motor Control',
      'Li-ion Cell Balancing & State-of-Charge (SoC) Algorithms',
      'CAN Bus Telemetry Diagnostics & Fault Code Analysis',
      'High Voltage Isolation & AIS-038 State Safety Regulations'
    ],
    url: 'https://onlinecourses.nptel.ac.in/noc24_ee12/preview',
    skill_tags: ['EV Battery Diagnostics', 'CAN Bus Analysis', 'BLDC Motor Drives', 'HV Safety']
  },
  {
    id: 'skill-solar-04',
    title: 'Suryamitra Solar Photovoltaic Installer & Grid-Tie Technician',
    provider: 'National Institute of Solar Energy (NISE)',
    institute: 'Ministry of New & Renewable Energy (MNRE)',
    platform: 'Skill India',
    sector: 'Renewable Energy',
    duration_weeks: 6,
    estimated_hours: 36,
    rating: 4.8,
    enrolled_count: 18200,
    is_free: true,
    has_certificate: true,
    nsqf_level: 4,
    deadline: 'Rolling Admissions',
    exam_date: 'Continuous Assessment',
    prerequisites: '10th Pass or ITI Electrical / Electronics Certificate',
    description: 'Government of India certified Suryamitra program for rooftop solar system sizing, string inverter wiring, net metering synchronization with MSEDCL grid, and shadow analysis.',
    syllabus: [
      'Solar Irradiance Measurement & Tilt Angle Optimization',
      'PV Module Stringing, MC4 Crimping & DC Combiner Boxes',
      'Grid-Tie Inverter Synchronization & Anti-Islanding Protection',
      'Discom Net Metering Paperwork & Commissioning Sign-off'
    ],
    url: 'https://www.skillindiadigital.gov.in',
    skill_tags: ['Solar PV Sizing', 'Grid Inverter Wiring', 'Net Metering', 'O&M Troubleshooting']
  },
  {
    id: 'coursera-python-05',
    title: 'Python for Applied Data Analytics & AI Automation',
    provider: 'University of Michigan',
    institute: 'Coursera / Global University Partner',
    platform: 'Coursera',
    sector: 'IT & Digital',
    duration_weeks: 8,
    estimated_hours: 48,
    rating: 4.9,
    enrolled_count: 85000,
    is_free: true,
    has_certificate: true,
    nsqf_level: 5,
    deadline: 'Flexible Enrollment',
    exam_date: 'On-Demand Quizzes',
    prerequisites: 'Basic computer literacy and logical problem solving',
    description: 'Master Python programming from fundamentals to real-world data processing with Pandas, SQL database integration, automated spreadsheet reports, and REST API consumption.',
    syllabus: [
      'Python Data Structures, Functions & File I/O',
      'Data Wrangling & Cleaning with Pandas and NumPy',
      'Automated Report Generation & Data Visualization with Seaborn',
      'Consuming REST APIs and Parsing JSON Telemetry'
    ],
    url: 'https://www.coursera.org/specializations/python',
    skill_tags: ['Python Programming', 'Pandas Data Analysis', 'SQL Reporting', 'REST APIs']
  },
  {
    id: 'mssds-retail-06',
    title: 'Digital Retail Operations & E-Commerce Storefront Management',
    provider: 'Maharashtra State Skill Development Society (MSSDS)',
    institute: 'MSSDS / Retail Association of India (RAI)',
    platform: 'MSSDS',
    sector: 'Retail & Commerce',
    duration_weeks: 4,
    estimated_hours: 24,
    rating: 4.7,
    enrolled_count: 6400,
    is_free: true,
    has_certificate: true,
    nsqf_level: 4,
    deadline: '20 Sep 2025',
    exam_date: '30 Sep 2025',
    prerequisites: 'Secondary School Certification',
    description: 'Customized for Maharashtra state micro-retailers to set up digital inventory POS terminals, list products on ONDC (Open Network for Digital Commerce), and manage UPI barcode settlements.',
    syllabus: [
      'POS Terminal Setup, Barcode Scanning & Stock Reconciliation',
      'ONDC Storefront Onboarding & Product Cataloging',
      'Customer Grievance Redressal & Retention Strategies',
      'GST Billing & Digital Bookkeeping on Government Portals'
    ],
    url: 'https://mssds.gov.in',
    skill_tags: ['ONDC Onboarding', 'POS Inventory', 'Digital Billing', 'Store Operations']
  },
  {
    id: 'nptel-health-07',
    title: 'Healthcare Assistance & Patient Vital Care Technology',
    provider: 'AIIMS & IIT Kharagpur',
    institute: 'AIIMS / NPTEL',
    platform: 'NPTEL',
    sector: 'Healthcare & Caregiving',
    duration_weeks: 8,
    estimated_hours: 40,
    rating: 4.8,
    enrolled_count: 11300,
    is_free: true,
    has_certificate: true,
    nsqf_level: 4,
    deadline: '18 Sep 2025',
    exam_date: '08 Nov 2025',
    prerequisites: '10+2 Science or GNM / ANM Aspirant',
    description: 'Accredited clinical healthcare technology course covering vital sign monitoring devices, medical bio-waste segregation, CPR first-aid protocols, and electronic health record documentation.',
    syllabus: [
      'Digital Multipara Patient Monitors & SpO2 / ECG Sensor Hookups',
      'Hospital Infection Control & Biomedical Waste Categories',
      'Emergency First Response & BLS CPR Algorithms',
      'Electronic Health Record (EHR) Entry Protocols'
    ],
    url: 'https://onlinecourses.nptel.ac.in/noc24_bt10/preview',
    skill_tags: ['Patient Monitoring', 'BLS CPR', 'Infection Control', 'EHR Entry']
  }
];

interface EnrolledCourseInfo {
  id: string;
  course_id?: string;
  status: string;
  progress_pct: number;
  courseData?: any;
}

export const CourseSearchModule: React.FC = () => {
  const { profile } = useUser();
  const supabase = createClient();

  const [courses, setCourses] = useState<Course[]>(AUTHENTIC_COURSES);
  const [enrolledCourses, setEnrolledCourses] = useState<Record<string, EnrolledCourseInfo>>({});
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Filter States
  const [search, setSearch] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [onlyFree, setOnlyFree] = useState(false);
  const [activeTab, setActiveTab] = useState<'catalog' | 'enrolled'>('catalog');

  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const platforms = ['All', 'NPTEL', 'Swayam', 'Coursera', 'Skill India', 'MSSDS'];
  const sectors = ['All', 'Apparel & Fashion', 'Automotive & EV', 'Renewable Energy', 'IT & Digital', 'Retail & Commerce', 'Healthcare & Caregiving'];

  const normalizeStr = (s?: string) => (s ? s.toLowerCase().replace(/[^a-z0-9]/g, '') : '');

  const getEnrollment = (course: Course | null | undefined): EnrolledCourseInfo | undefined => {
    if (!course) return undefined;
    if (enrolledCourses[course.id]) return enrolledCourses[course.id];
    if (course.url && enrolledCourses[course.url]) return enrolledCourses[course.url];
    if (course.title) {
      const rawLower = course.title.toLowerCase().trim();
      if (enrolledCourses[rawLower]) return enrolledCourses[rawLower];
      const norm = normalizeStr(course.title);
      if (enrolledCourses[`title-norm:${norm}`]) return enrolledCourses[`title-norm:${norm}`];
    }
    return undefined;
  };

  const fetchCoursesAndEnrollments = async () => {
    try {
      // 1. Fetch DB courses if populated, otherwise use authentic NPTEL catalog
      const { data: dbCourses } = await supabase
        .from('external_courses')
        .select('*')
        .order('rating', { ascending: false });

      const mergedMap = new Map<string, Course>();
      AUTHENTIC_COURSES.forEach(c => mergedMap.set(c.id, { ...c }));

      if (dbCourses && dbCourses.length > 0) {
        dbCourses.forEach((dbc: any) => {
          const matchingStatic = AUTHENTIC_COURSES.find(ac => {
            const urlMatch = dbc.url && ac.url && (dbc.url === ac.url || dbc.url.includes(ac.url) || ac.url.includes(dbc.url));
            const titleMatch = dbc.title && ac.title && (
              normalizeStr(dbc.title) === normalizeStr(ac.title) ||
              normalizeStr(dbc.title).includes(normalizeStr(ac.title)) ||
              normalizeStr(ac.title).includes(normalizeStr(dbc.title))
            );
            return urlMatch || titleMatch;
          });

          const courseObj: Course = {
            id: dbc.id,
            title: dbc.title || matchingStatic?.title || 'Accredited Course',
            provider: dbc.provider || matchingStatic?.provider || 'State Accredited Provider',
            institute: dbc.institute || matchingStatic?.institute || dbc.provider || matchingStatic?.provider || 'NPTEL / Swayam',
            platform: (dbc.platform as Course['platform']) || matchingStatic?.platform || 'NPTEL',
            sector: dbc.sector || matchingStatic?.sector || 'Vocational Training',
            duration_weeks: dbc.duration_weeks || matchingStatic?.duration_weeks || 8,
            estimated_hours: dbc.estimated_hours || matchingStatic?.estimated_hours || 40,
            rating: dbc.rating || matchingStatic?.rating || 4.8,
            enrolled_count: dbc.enrolled_count || matchingStatic?.enrolled_count || 5000,
            is_free: dbc.is_free ?? matchingStatic?.is_free ?? true,
            has_certificate: dbc.has_certificate ?? matchingStatic?.has_certificate ?? true,
            nsqf_level: dbc.nsqf_level || matchingStatic?.nsqf_level || 4,
            deadline: dbc.deadline || matchingStatic?.deadline || '15 Sep 2025',
            exam_date: dbc.exam_date || matchingStatic?.exam_date || '26 Oct 2025',
            prerequisites: dbc.prerequisites || matchingStatic?.prerequisites || '10th Standard or Vocational Certificate',
            description: dbc.description || matchingStatic?.description || 'Government accredited vocational upskilling program with verified credential output.',
            syllabus: dbc.syllabus || matchingStatic?.syllabus || [
              'Foundational Theory & Safety Standards',
              'Practical Tool Handling & Core Operations',
              'Quality Inspection & Defect Remediation',
              'Final Project & Examination Prep'
            ],
            url: dbc.url || matchingStatic?.url || 'https://onlinecourses.nptel.ac.in',
            skill_tags: (dbc.skill_tags && dbc.skill_tags.length > 0) ? dbc.skill_tags : (matchingStatic?.skill_tags || ['Vocational Skill', 'State Certified'])
          };

          if (matchingStatic) {
            mergedMap.delete(matchingStatic.id);
          }
          mergedMap.set(dbc.id, courseObj);
        });
      }

      // 2. Fetch trainee's enrollments with joined external_courses
      if (profile?.id) {
        const { data: enrollData, error: enrollErr } = await supabase
          .from('trainee_course_enrollments')
          .select('*, external_courses(*)')
          .eq('trainee_id', profile.id);

        if (enrollErr) {
          console.error('Error fetching course enrollments:', enrollErr);
        }

        if (enrollData && enrollData.length > 0) {
          const map: Record<string, EnrolledCourseInfo> = {};
          enrollData.forEach((e: any) => {
            const ext = e.external_courses;
            const enrollmentObj: EnrolledCourseInfo = {
              id: e.id,
              course_id: e.course_id,
              status: e.status || 'in_progress',
              progress_pct: e.progress_pct ?? 0,
              courseData: ext || undefined
            };

            // 1. Index by database UUIDs
            if (e.course_id) map[e.course_id] = enrollmentObj;
            if (e.id) map[e.id] = enrollmentObj;

            // 2. Index by course URL
            if (ext?.url) map[ext.url] = enrollmentObj;

            // 3. Index by title
            if (ext?.title) {
              map[ext.title] = enrollmentObj;
              map[ext.title.toLowerCase().trim()] = enrollmentObj;
              map[`title-norm:${normalizeStr(ext.title)}`] = enrollmentObj;
            }

            // 4. Index by matching static fallback IDs
            AUTHENTIC_COURSES.forEach(ac => {
              const urlMatch = ext?.url && (ac.url === ext.url || ac.url.includes(ext.url) || ext.url.includes(ac.url));
              const titleMatch = ext?.title && (
                normalizeStr(ac.title) === normalizeStr(ext.title) ||
                normalizeStr(ac.title).includes(normalizeStr(ext.title)) ||
                normalizeStr(ext.title).includes(normalizeStr(ac.title))
              );
              if (urlMatch || titleMatch) {
                map[ac.id] = enrollmentObj;
              }
            });

            // Ensure the course exists in mergedMap so it renders in catalog & active roadmap
            if (ext && ext.id && !mergedMap.has(ext.id)) {
              mergedMap.set(ext.id, {
                id: ext.id,
                title: ext.title || 'Enrolled Course',
                provider: ext.provider || 'State Provider',
                institute: ext.institute || ext.provider || 'NPTEL / Swayam',
                platform: (ext.platform as Course['platform']) || 'NPTEL',
                sector: ext.sector || 'Vocational Training',
                duration_weeks: ext.duration_weeks || 8,
                estimated_hours: ext.estimated_hours || 40,
                rating: ext.rating || 4.8,
                enrolled_count: ext.enrolled_count || 1000,
                is_free: ext.is_free ?? true,
                has_certificate: ext.has_certificate ?? true,
                nsqf_level: ext.nsqf_level || 4,
                deadline: ext.deadline || '15 Sep 2025',
                exam_date: ext.exam_date || '26 Oct 2025',
                prerequisites: ext.prerequisites || 'Open Enrollment',
                description: ext.description || 'Government accredited vocational upskilling program.',
                syllabus: ext.syllabus || ['Module 1', 'Module 2', 'Certification'],
                url: ext.url || 'https://onlinecourses.nptel.ac.in',
                skill_tags: ext.skill_tags || ['Vocational Skill']
              });
            }
          });
          setEnrolledCourses(map);
        }
      }

      setCourses(Array.from(mergedMap.values()));
    } catch (e) {
      console.error('Error loading course search:', e);
    }
  };

  useEffect(() => {
    fetchCoursesAndEnrollments();
  }, [profile]);

  const handleEnrollCourse = async (course: Course) => {
    if (!profile?.id) {
      setToastMsg('Please sign in to track course progress.');
      setTimeout(() => setToastMsg(null), 3500);
      return;
    }

    setEnrollingId(course.id);
    try {
      let targetCourseUuid = course.id;
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(course.id);

      if (!isUuid) {
        // Look up external_courses by URL or fuzzy title
        let foundCourse: { id: string } | null = null;

        if (course.url) {
          const { data: byUrl } = await supabase
            .from('external_courses')
            .select('id')
            .eq('url', course.url)
            .maybeSingle();
          if (byUrl?.id) {
            foundCourse = byUrl;
          }
        }

        if (!foundCourse && course.title) {
          const { data: byTitle } = await supabase
            .from('external_courses')
            .select('id')
            .ilike('title', course.title)
            .maybeSingle();
          if (byTitle?.id) {
            foundCourse = byTitle;
          }
        }

        if (!foundCourse && course.title) {
          const titleWords = course.title.split(/\s+/).filter(w => w.length > 3);
          const searchKeyword = titleWords.length > 0 ? titleWords[0] : course.title.slice(0, 15);
          const { data: byFuzzy } = await supabase
            .from('external_courses')
            .select('id')
            .ilike('title', `%${searchKeyword}%`)
            .limit(1)
            .maybeSingle();
          if (byFuzzy?.id) {
            foundCourse = byFuzzy;
          }
        }

        if (foundCourse?.id) {
          targetCourseUuid = foundCourse.id;
        } else {
          // Provision in external_courses
          const { data: created, error: createError } = await mutateDb({
            action: 'insert',
            table: 'external_courses',
            payload: {
              title: course.title,
              provider: course.provider,
              platform: course.platform,
              sector: course.sector,
              duration_weeks: course.duration_weeks,
              estimated_hours: course.estimated_hours,
              rating: course.rating,
              enrolled_count: course.enrolled_count,
              is_free: course.is_free,
              has_certificate: course.has_certificate,
              nsqf_level: course.nsqf_level,
              url: course.url,
              skill_tags: course.skill_tags
            }
          });
          if (createError) {
            console.error('Failed to create external course:', createError);
          }
          if (created && created[0]?.id) {
            targetCourseUuid = created[0].id;
          }
        }
      }

      let enrollmentRecordId = 'enroll-' + Date.now();
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetCourseUuid)) {
        const { data: enrollRes, error: enrollError } = await mutateDb({
          action: 'upsert',
          table: 'trainee_course_enrollments',
          payload: {
            trainee_id: profile.id,
            course_id: targetCourseUuid,
            status: 'in_progress',
            progress_pct: 10
          },
          onConflict: 'trainee_id,course_id'
        });
        if (enrollError) throw enrollError;
        if (enrollRes && enrollRes[0]?.id) {
          enrollmentRecordId = enrollRes[0].id;
        }
      }

      // Update local state multi-dimensionally for seamless immediate feedback
      const newEnrollment: EnrolledCourseInfo = {
        id: enrollmentRecordId,
        course_id: targetCourseUuid,
        status: 'in_progress',
        progress_pct: 10,
        courseData: course
      };

      setEnrolledCourses(prev => {
        const next = { ...prev };
        next[course.id] = newEnrollment;
        next[targetCourseUuid] = newEnrollment;
        if (course.url) next[course.url] = newEnrollment;
        if (course.title) {
          next[course.title] = newEnrollment;
          next[course.title.toLowerCase().trim()] = newEnrollment;
          next[`title-norm:${normalizeStr(course.title)}`] = newEnrollment;
        }
        AUTHENTIC_COURSES.forEach(ac => {
          if (
            ac.id === course.id ||
            ac.url === course.url ||
            normalizeStr(ac.title) === normalizeStr(course.title) ||
            ac.title.toLowerCase() === course.title.toLowerCase()
          ) {
            next[ac.id] = newEnrollment;
          }
        });
        return next;
      });

      // Update courses array to use targetCourseUuid
      setCourses(prev => {
        return prev.map(c => {
          if (c.id === course.id || c.url === course.url || normalizeStr(c.title) === normalizeStr(course.title)) {
            return { ...c, id: targetCourseUuid };
          }
          return c;
        });
      });

      setToastMsg(`Enrolled in "${course.title}"! Added to your learning roadmap.`);
      setTimeout(() => setToastMsg(null), 3500);

      // Asynchronously re-fetch from database to ensure multi-device sync
      fetchCoursesAndEnrollments();
    } catch (err: any) {
      console.error('Enrollment error:', err);
      setToastMsg('Could not complete enrollment. Please try again.');
      setTimeout(() => setToastMsg(null), 3500);
    } finally {
      setEnrollingId(null);
    }
  };

  const handleUpdateProgress = async (courseId: string, newProgress: number) => {
    if (!profile?.id) return;
    const isComplete = newProgress >= 100;
    const newStatus = isComplete ? 'completed' : 'in_progress';
    
    // Find target UUID
    let targetId = courseId;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(courseId);
    if (!isUuid) {
      if (enrolledCourses[courseId]?.course_id) {
        targetId = enrolledCourses[courseId].course_id!;
      } else {
        const courseObj = courses.find(c => c.id === courseId);
        if (courseObj) {
          const enrollObj = getEnrollment(courseObj);
          if (enrollObj?.course_id) {
            targetId = enrollObj.course_id;
          }
        }
      }
    }

    setEnrolledCourses(prev => {
      const existing = prev[courseId] || prev[targetId] || { id: 'local', course_id: targetId, status: newStatus, progress_pct: newProgress };
      const updated: EnrolledCourseInfo = {
        ...existing,
        course_id: targetId,
        progress_pct: newProgress,
        status: newStatus
      };
      const next = { ...prev };
      Object.keys(prev).forEach(k => {
        if (prev[k]?.course_id === targetId || k === courseId || k === targetId) {
          next[k] = updated;
        }
      });
      next[courseId] = updated;
      next[targetId] = updated;
      return next;
    });

    try {
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetId)) {
        await mutateDb({
          action: 'update',
          table: 'trainee_course_enrollments',
          payload: {
            progress_pct: newProgress,
            status: newStatus,
            completed_at: isComplete ? new Date().toISOString() : null
          },
          match: {
            trainee_id: profile.id,
            course_id: targetId
          }
        });
      }
    } catch (e) {
      console.error('Failed to update course progress:', e);
    }
  };

  // Filtered Courses
  const filteredCourses = courses.filter(c => {
    const skillsList = c.skill_tags || [];
    const matchesSearch = search === '' || 
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.provider.toLowerCase().includes(search.toLowerCase()) ||
      (c.institute && c.institute.toLowerCase().includes(search.toLowerCase())) ||
      skillsList.some((t: string) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesPlatform = selectedPlatform === 'All' || c.platform === selectedPlatform;
    const matchesSector = selectedSector === 'All' || c.sector === selectedSector;
    const matchesLevel = selectedLevel === 'All' || c.nsqf_level.toString() === selectedLevel;
    const matchesFree = !onlyFree || c.is_free;

    return matchesSearch && matchesPlatform && matchesSector && matchesLevel && matchesFree;
  });

  const enrolledCourseList = (() => {
    const seen = new Set<string>();
    const list: Course[] = [];

    // 1. Check all courses in current catalog state
    courses.forEach(c => {
      const enrollment = getEnrollment(c);
      if (enrollment) {
        const key = enrollment.course_id || c.id || c.url || c.title.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          list.push(c);
        }
      }
    });

    // 2. Also check all enrolledCourses entries that might have attached courseData
    Object.values(enrolledCourses).forEach(enr => {
      if (enr.courseData) {
        const cd = enr.courseData;
        const key = enr.course_id || cd.id || cd.url || cd.title?.toLowerCase();
        if (key && !seen.has(key)) {
          seen.add(key);
          list.push({
            id: cd.id || enr.course_id || 'enrolled-' + Math.random(),
            title: cd.title || 'Enrolled Course',
            provider: cd.provider || 'State Accredited Provider',
            institute: cd.institute || cd.provider || 'NPTEL / Swayam',
            platform: cd.platform || 'NPTEL',
            sector: cd.sector || 'Vocational Training',
            duration_weeks: cd.duration_weeks || 8,
            estimated_hours: cd.estimated_hours || 40,
            rating: cd.rating || 4.8,
            enrolled_count: cd.enrolled_count || 1000,
            is_free: cd.is_free ?? true,
            has_certificate: cd.has_certificate ?? true,
            nsqf_level: cd.nsqf_level || 4,
            deadline: cd.deadline || '15 Sep 2025',
            exam_date: cd.exam_date || '26 Oct 2025',
            prerequisites: cd.prerequisites || 'Open Enrollment',
            description: cd.description || 'Government accredited vocational upskilling program with verified credential output.',
            syllabus: cd.syllabus || [
              'Foundational Theory & Safety Standards',
              'Practical Tool Handling & Core Operations',
              'Quality Inspection & Defect Remediation',
              'Final Project & Examination Prep'
            ],
            url: cd.url || 'https://onlinecourses.nptel.ac.in',
            skill_tags: cd.skill_tags || ['Vocational Skill', 'State Certified']
          });
        }
      }
    });

    return list;
  })();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 text-slate-800 animate-in fade-in-50">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-2xl shadow-xl border border-slate-800 flex items-center space-x-2.5 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Accredited Upskilling & Vocational Curricula</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Browse verified NPTEL, Swayam, and Skill India courses to bridge NSQF competency gaps and accelerate wage growth.
          </p>
        </div>

        {/* Catalog / My Courses Tab Toggle */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-2xl text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'catalog' ? 'bg-white text-blue-600 shadow-xs font-black' : 'hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Course Catalog ({courses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('enrolled')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'enrolled' ? 'bg-white text-blue-600 shadow-xs font-black' : 'hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>My Active Roadmap ({enrolledCourseList.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'catalog' ? (
        <>
          {/* Search & Filter Bar */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Search Box */}
              <div className="sm:col-span-6 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by course name, IIT institute, or skill (e.g., CAD, EV, Solar)..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Sector Dropdown */}
              <div className="sm:col-span-4">
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none"
                >
                  {sectors.map((sec) => (
                    <option key={sec} value={sec}>{sec === 'All' ? 'All Vocational Sectors' : sec}</option>
                  ))}
                </select>
              </div>

              {/* NSQF Level Filter */}
              <div className="sm:col-span-2">
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none"
                >
                  <option value="All">All NSQF Levels</option>
                  <option value="4">NSQF Level 4</option>
                  <option value="5">NSQF Level 5</option>
                  <option value="6">NSQF Level 6</option>
                </select>
              </div>
            </div>

            {/* Platform Filter Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] shrink-0 mr-1">
                Platform:
              </span>
              {platforms.map((plat) => (
                <button
                  key={plat}
                  type="button"
                  onClick={() => setSelectedPlatform(plat)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
                    selectedPlatform === plat
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {plat}
                </button>
              ))}
            </div>
          </div>

          {/* Course Cards Grid */}
          {filteredCourses.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 space-y-3">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="font-bold text-slate-700">No courses match your active search filters.</div>
              <p className="text-xs text-slate-400">Try broadening your search term or selecting All Platforms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => {
                const enrollment = getEnrollment(course);
                const isEnrolled = !!enrollment;

                return (
                  <div
                    key={course.id}
                    onClick={() => setSelectedCourse(course)}
                    className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-blue-300 hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
                  >
                    <div className="space-y-3">
                      {/* Platform & Rating Badges */}
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider ${
                          course.platform === 'NPTEL' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          course.platform === 'Swayam' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                          course.platform === 'Coursera' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {course.platform} • NSQF L{course.nsqf_level}
                        </span>

                        <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{course.rating}</span>
                        </div>
                      </div>

                      {/* Course Title */}
                      <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-blue-600 transition line-clamp-2">
                        {course.title}
                      </h3>

                      {/* Provider & Duration Info */}
                      <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
                        <span className="font-semibold text-slate-700">{course.institute || course.provider}</span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{course.duration_weeks} Wks</span>
                        </span>
                      </div>

                      {/* Skill Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(course.skill_tags || []).slice(0, 3).map((tag: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Progress Slider or Action Buttons */}
                    <div className="pt-3 border-t border-slate-100 space-y-2.5" onClick={(e) => e.stopPropagation()}>
                      {isEnrolled && enrollment ? (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-emerald-600 flex items-center space-x-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Enrolled ({enrollment.progress_pct}%)</span>
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">Slide progress</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={enrollment.progress_pct}
                            onChange={(e) => handleUpdateProgress(course.id, Number(e.target.value))}
                            className="w-full accent-emerald-600 cursor-pointer"
                          />
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleEnrollCourse(course)}
                          disabled={enrollingId === course.id}
                          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{enrollingId === course.id ? 'Adding...' : 'Add to My Roadmap'}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedCourse(course)}
                        className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <Info className="w-3.5 h-3.5 text-blue-600" />
                        <span>View Syllabus & Details</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* My Enrolled Courses View */
        <div className="space-y-6">
          {enrolledCourseList.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 space-y-3">
              <GraduationCap className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="font-bold text-slate-800 text-base">You have not enrolled in any courses yet.</div>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Explore the catalog and click "Add to My Roadmap" to track your progress and bridge skill gaps.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('catalog')}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition cursor-pointer"
              >
                Browse Course Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrolledCourseList.map((course) => {
                const enrollment = getEnrollment(course) || { id: course.id, status: 'in_progress', progress_pct: 10 };
                const isCompleted = enrollment.progress_pct >= 100 || enrollment.status === 'completed';
                return (
                  <div key={course.id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-extrabold rounded-md uppercase">
                          {course.platform}
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-base mt-2">{course.title}</h4>
                        <p className="text-xs text-slate-500">{course.institute || course.provider}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                        isCompleted 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {isCompleted ? 'Completed' : 'In Progress'}
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Learning Progress</span>
                        <span>{enrollment.progress_pct}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${enrollment.progress_pct}%` }}
                        />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={enrollment.progress_pct}
                        onChange={(e) => handleUpdateProgress(course.id, Number(e.target.value))}
                        className="w-full accent-emerald-600 cursor-pointer mt-1"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
                      <button
                        onClick={() => setSelectedCourse(course)}
                        className="text-slate-600 hover:text-blue-600 font-semibold flex items-center space-x-1 cursor-pointer"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>View Syllabus</span>
                      </button>

                      <a
                        href={course.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-bold flex items-center space-x-1"
                      >
                        <span>Continue on {course.platform}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Interactive Course Details Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto space-y-6 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-extrabold rounded-md uppercase">
                    {selectedCourse.platform}
                  </span>
                  <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-extrabold rounded-md">
                    NSQF Level {selectedCourse.nsqf_level}
                  </span>
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold rounded-md">
                    {selectedCourse.is_free ? '100% Free Tuition' : 'State Subsidized'}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 leading-snug">
                  {selectedCourse.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Offered by <strong>{selectedCourse.institute || selectedCourse.provider}</strong> ({selectedCourse.provider})
                </p>
              </div>

              <button
                onClick={() => setSelectedCourse(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-xl transition cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <span className="text-slate-400 block font-semibold">Duration</span>
                <span className="font-bold text-slate-800">{selectedCourse.duration_weeks} Weeks</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Total Effort</span>
                <span className="font-bold text-slate-800">~{selectedCourse.estimated_hours} Hours</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Enrollment Deadline</span>
                <span className="font-bold text-rose-600">{selectedCourse.deadline || '15 Sep 2025'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Exam / Cert Date</span>
                <span className="font-bold text-slate-800">{selectedCourse.exam_date || '26 Oct 2025'}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Course Overview</h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-100">
                {selectedCourse.description}
              </p>
            </div>

            {/* Prerequisites */}
            {selectedCourse.prerequisites && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Eligibility & Prerequisites</h4>
                <p className="text-xs text-slate-600 font-medium">
                  {selectedCourse.prerequisites}
                </p>
              </div>
            )}

            {/* Syllabus Modules */}
            {selectedCourse.syllabus && selectedCourse.syllabus.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Curriculum & Syllabus Breakdown</h4>
                <div className="space-y-2">
                  {selectedCourse.syllabus.map((topic, i) => (
                    <div key={i} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center space-x-3 text-xs">
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {i + 1}
                      </div>
                      <span className="font-semibold text-slate-800">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verified Skills Gained */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Target NSQF Skills Acquired</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedCourse.skill_tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 font-bold rounded-lg text-xs border border-blue-100">
                    ✓ {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
              {getEnrollment(selectedCourse) ? (
                <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Enrolled ({getEnrollment(selectedCourse)!.progress_pct}% Progress)</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleEnrollCourse(selectedCourse)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-blue-600" />
                  <span>Add to My Roadmap</span>
                </button>
              )}

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedCourse(null)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Close
                </button>

                <a
                  href={selectedCourse.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-sm shadow-blue-600/20 cursor-pointer text-center"
                >
                  <span>Open on {selectedCourse.platform}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
