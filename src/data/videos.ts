export interface TranscriptLine {
  id: string;
  time: string;
  seconds: number;
  speaker: string;
  speakerRole: string;
  avatar: string;
  text: string;
  isActionItem?: boolean;
}

export interface Participant {
  name: string;
  role: string;
  avatar: string;
  speakingTime: string;
  speakingPercent: number;
}

export interface Chapter {
  id: string;
  title: string;
  time: string;
  seconds: number;
  description: string;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  department: string;
  presenter: {
    name: string;
    role: string;
    avatar: string;
  };
  date: string;
  duration: string;
  durationSeconds: number;
  progressPercent: number;
  currentSeconds: number;
  resolution: "4K ULTRA HD" | "HD 1080P";
  thumbnail: string;
  videoUrl: string;
  isFavorite: boolean;
  views: number;
  tags: string[];
  keyTakeaways: string[];
  participants: Participant[];
  chapters: Chapter[];
  transcript: TranscriptLine[];
  resources: Array<{
    name: string;
    type: string;
    size: string;
  }>;
}

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: "qbr-q3-2024",
    title: "Quarterly Business Review – Q3 2024",
    description: "Executive review of Q3 performance, cloud transformation progress, pipeline metrics, and Q4 strategic initiatives.",
    department: "Executive & Strategy",
    presenter: {
      name: "Dr. Aris Thorne",
      role: "Chief Strategy Officer",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAO6omun6R5oL9qCHRGIlB8qOIlIDUNT5UBHwcMZwiWzKIKb7jpouPMz6SD1ev-VSvPMOYPMgk83Z1NZsgN53S_eKbpKgsWmISpC9d02_U2a13q1CXR3DHb2z_yZMDrQTt-3xrAcTL_Anugf5T34wEiBZQUvolPda94t-Qz4gR3-aw8Uh1zAUeKIGs1a4THL5iETeZQko_j2qWlbvD0qUO-1chC3kwy1iJ9fNhdjWz0IOenw3tfdP4k",
    },
    date: "Sep 28, 2024",
    duration: "42:15",
    durationSeconds: 2535,
    progressPercent: 68,
    currentSeconds: 1723,
    resolution: "4K ULTRA HD",
    thumbnail: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    isFavorite: true,
    views: 1420,
    tags: ["Executive", "QBR", "Strategy", "Revenue", "Q4 Roadmap"],
    keyTakeaways: [
      "Enterprise ARR expanded by 24% year-over-year, driven by CSM TRAC platform adoption.",
      "Cloud transformation phase 2 completed 3 weeks ahead of schedule across APAC and EMEA.",
      "Allocated $4.2M capital investment for accelerated AI workflow automation in Q4.",
      "Customer satisfaction score (CSAT) reached historic high of 94.2% across tier-1 clients."
    ],
    participants: [
      {
        name: "Dr. Aris Thorne",
        role: "Chief Strategy Officer",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAO6omun6R5oL9qCHRGIlB8qOIlIDUNT5UBHwcMZwiWzKIKb7jpouPMz6SD1ev-VSvPMOYPMgk83Z1NZsgN53S_eKbpKgsWmISpC9d02_U2a13q1CXR3DHb2z_yZMDrQTt-3xrAcTL_Anugf5T34wEiBZQUvolPda94t-Qz4gR3-aw8Uh1zAUeKIGs1a4THL5iETeZQko_j2qWlbvD0qUO-1chC3kwy1iJ9fNhdjWz0IOenw3tfdP4k",
        speakingTime: "18m 40s",
        speakingPercent: 44,
      },
      {
        name: "Sarah Jenkins",
        role: "VP of Product Strategy",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
        speakingTime: "14m 12s",
        speakingPercent: 34,
      },
      {
        name: "Alex Mercer",
        role: "Chief Financial Officer",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
        speakingTime: "6m 50s",
        speakingPercent: 16,
      },
      {
        name: "Elena Rostova",
        role: "Director of Enterprise Ops",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
        speakingTime: "2m 33s",
        speakingPercent: 6,
      },
    ],
    chapters: [
      {
        id: "ch-1",
        title: "Executive Welcome & Q3 Key Highlights",
        time: "00:00",
        seconds: 0,
        description: "Opening address by Dr. Thorne summarizing milestones and market position.",
      },
      {
        id: "ch-2",
        title: "Financial Performance & ARR Growth",
        time: "08:15",
        seconds: 495,
        description: "Alex Mercer breaks down Q3 gross revenue, margins, and recurring software revenue.",
      },
      {
        id: "ch-3",
        title: "Product Roadmaps & AI Video Automation",
        time: "19:30",
        seconds: 1170,
        description: "Sarah Jenkins presents upcoming CSM TRAC capabilities and multi-modal transcript search.",
      },
      {
        id: "ch-4",
        title: "Operational Scaling & Infrastructure Migration",
        time: "31:45",
        seconds: 1905,
        description: "Elena Rostova details cloud infrastructure latency benchmarks and ISO certification compliance.",
      },
      {
        id: "ch-5",
        title: "Q4 Strategic Priorities & Open Q&A",
        time: "38:10",
        seconds: 2290,
        description: "Executive alignment on year-end targets and open floor questions.",
      },
    ],
    transcript: [
      {
        id: "t-1",
        time: "00:05",
        seconds: 5,
        speaker: "Dr. Aris Thorne",
        speakerRole: "Chief Strategy Officer",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAO6omun6R5oL9qCHRGIlB8qOIlIDUNT5UBHwcMZwiWzKIKb7jpouPMz6SD1ev-VSvPMOYPMgk83Z1NZsgN53S_eKbpKgsWmISpC9d02_U2a13q1CXR3DHb2z_yZMDrQTt-3xrAcTL_Anugf5T34wEiBZQUvolPda94t-Qz4gR3-aw8Uh1zAUeKIGs1a4THL5iETeZQko_j2qWlbvD0qUO-1chC3kwy1iJ9fNhdjWz0IOenw3tfdP4k",
        text: "Good morning everyone, and welcome to our Q3 Quarterly Business Review. We have a packed agenda today spanning our operational benchmarks, financial expansion, and our roadmap for the final stretch of the fiscal year.",
      },
      {
        id: "t-2",
        time: "01:24",
        seconds: 84,
        speaker: "Dr. Aris Thorne",
        speakerRole: "Chief Strategy Officer",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAO6omun6R5oL9qCHRGIlB8qOIlIDUNT5UBHwcMZwiWzKIKb7jpouPMz6SD1ev-VSvPMOYPMgk83Z1NZsgN53S_eKbpKgsWmISpC9d02_U2a13q1CXR3DHb2z_yZMDrQTt-3xrAcTL_Anugf5T34wEiBZQUvolPda94t-Qz4gR3-aw8Uh1zAUeKIGs1a4THL5iETeZQko_j2qWlbvD0qUO-1chC3kwy1iJ9fNhdjWz0IOenw3tfdP4k",
        text: "The macro outlook for enterprise digital operations remains resilient. Over the last 90 days, we observed a 24% year-over-year surge in recurring contract value across our primary enterprise clients.",
      },
      {
        id: "t-3",
        time: "03:10",
        seconds: 190,
        speaker: "Sarah Jenkins",
        speakerRole: "VP of Product Strategy",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
        text: "Adding to Aris's point, customer feedback on the automated transcription and intelligent video indexing engine has been overwhelmingly enthusiastic. Search latency dropped by 65%.",
      },
      {
        id: "t-4",
        time: "08:15",
        seconds: 495,
        speaker: "Alex Mercer",
        speakerRole: "Chief Financial Officer",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
        text: "From a P&L perspective, our gross margin on managed infrastructure broadened to 71.4%. Operating expenses remained disciplined, tracking 3.2% below our projected forecast.",
        isActionItem: true,
      },
      {
        id: "t-5",
        time: "12:40",
        seconds: 760,
        speaker: "Dr. Aris Thorne",
        speakerRole: "Chief Strategy Officer",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAO6omun6R5oL9qCHRGIlB8qOIlIDUNT5UBHwcMZwiWzKIKb7jpouPMz6SD1ev-VSvPMOYPMgk83Z1NZsgN53S_eKbpKgsWmISpC9d02_U2a13q1CXR3DHb2z_yZMDrQTt-3xrAcTL_Anugf5T34wEiBZQUvolPda94t-Qz4gR3-aw8Uh1zAUeKIGs1a4THL5iETeZQko_j2qWlbvD0qUO-1chC3kwy1iJ9fNhdjWz0IOenw3tfdP4k",
        text: "Let us ensure that our procurement and legal reviews for tier-1 vendor renewals are completely finalized before November 15th to lock in preferential enterprise pricing.",
        isActionItem: true,
      },
      {
        id: "t-6",
        time: "19:35",
        seconds: 1175,
        speaker: "Sarah Jenkins",
        speakerRole: "VP of Product Strategy",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
        text: "Looking into Q4, the CSM TRAC portal is releasing multi-lingual speech-to-text models and deep semantic search across all archived video libraries. Early pilot testers noted a 40% reduction in review cycles.",
      },
      {
        id: "t-7",
        time: "31:50",
        seconds: 1910,
        speaker: "Elena Rostova",
        speakerRole: "Director of Enterprise Ops",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
        text: "Our zero-downtime database partitioning was completed last weekend. We have verified 99.995% uptime across all regional media clusters with full SOC2 Type II compliance.",
      }
    ],
    resources: [
      { name: "Q3_Executive_Presentation_Final.pdf", type: "PDF Slide Deck", size: "14.2 MB" },
      { name: "Q3_Financial_Performance_Model.xlsx", type: "Financial Spreadsheet", size: "4.8 MB" },
      { name: "Executive_QBR_Meeting_Minutes.docx", type: "Word Document", size: "840 KB" },
    ],
  },
  {
    id: "client-onboarding",
    title: "Client Onboarding & Compliance Standard Operating Procedures",
    description: "End-to-end operational walkthrough for institutional client verification, KYC compliance, and automated data handoffs.",
    department: "Legal & Ops",
    presenter: {
      name: "Priya Patel",
      role: "Head of Regulatory Compliance",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    },
    date: "Oct 17, 2024",
    duration: "39:20",
    durationSeconds: 2360,
    progressPercent: 72,
    currentSeconds: 1699,
    resolution: "HD 1080P",
    thumbnail: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    isFavorite: false,
    views: 890,
    tags: ["Compliance", "SOP", "Legal", "Operations", "KYC"],
    keyTakeaways: [
      "Client verification cycle time reduced from 5 business days to under 4 hours.",
      "Introduced automated risk scoring matrix integrating sanctions screening.",
      "Mandatory re-certification protocol established for all compliance leads."
    ],
    participants: [
      {
        name: "Priya Patel",
        role: "Head of Regulatory Compliance",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
        speakingTime: "26m 10s",
        speakingPercent: 67,
      },
      {
        name: "Marcus Vance",
        role: "Lead Counsel",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
        speakingTime: "13m 10s",
        speakingPercent: 33,
      }
    ],
    chapters: [
      { id: "co-1", title: "Compliance Framework Overview", time: "00:00", seconds: 0, description: "Regulatory scope and adherence standards." },
      { id: "co-2", title: "Identity Verification & Document Intake", time: "11:20", seconds: 680, description: "Automated OCR intake and cross-checking." },
      { id: "co-3", title: "Escalation Matrix & Audit Trails", time: "25:40", seconds: 1540, description: "Handling compliance red flags and audit logging." }
    ],
    transcript: [
      {
        id: "t-co1",
        time: "00:10",
        seconds: 10,
        speaker: "Priya Patel",
        speakerRole: "Head of Regulatory Compliance",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
        text: "Welcome team. Today we will establish our unified operating procedures for client onboarding across all enterprise subsidiaries.",
      },
      {
        id: "t-co2",
        time: "05:40",
        seconds: 340,
        speaker: "Marcus Vance",
        speakerRole: "Lead Counsel",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
        text: "Please remember that all customer signatures must pass through our cryptographic verification gateway before account provisioning.",
      }
    ],
    resources: [
      { name: "Enterprise_Compliance_Playbook_v4.pdf", type: "Compliance PDF", size: "8.6 MB" }
    ]
  },
  {
    id: "global-sales-kickoff",
    title: "Global Sales Kickoff – Enterprise AI Adoption & Key Verticals",
    description: "Strategic sales briefing on value propositions, competitor battlecards, and enterprise packaging for the coming fiscal quarter.",
    department: "Sales & Marketing",
    presenter: {
      name: "David Sterling",
      role: "VP of Global Enterprise Sales",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
    },
    date: "Oct 14, 2024",
    duration: "43:30",
    durationSeconds: 2610,
    progressPercent: 35,
    currentSeconds: 915,
    resolution: "HD 1080P",
    thumbnail: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    isFavorite: true,
    views: 2150,
    tags: ["Sales", "GTM", "Keynote", "Strategy", "Pricing"],
    keyTakeaways: [
      "Targeting 35% net new expansion in Banking, Financial Services, and Healthcare.",
      "New enterprise tier includes bespoke LLM fine-tuning and private tenant deployment.",
      "Partner co-selling initiative launched with major cloud hyperscalers."
    ],
    participants: [
      {
        name: "David Sterling",
        role: "VP of Global Enterprise Sales",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
        speakingTime: "31m 20s",
        speakingPercent: 72,
      },
      {
        name: "Claire Becker",
        role: "Head of Solutions Engineering",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
        speakingTime: "12m 10s",
        speakingPercent: 28,
      }
    ],
    chapters: [
      { id: "gs-1", title: "Market Landscape & Competitive Win Rates", time: "00:00", seconds: 0, description: "Analysis of market momentum and enterprise buyer priorities." },
      { id: "gs-2", title: "Packaging & Multi-Year Enterprise Tiers", time: "15:20", seconds: 920, description: "New contract structures and volume pricing models." },
      { id: "gs-3", title: "Proof-of-Concept Best Practices", time: "29:10", seconds: 1750, description: "Speeding up technical evaluations and security approvals." }
    ],
    transcript: [
      {
        id: "t-gs1",
        time: "00:05",
        seconds: 5,
        speaker: "David Sterling",
        speakerRole: "VP of Global Enterprise Sales",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
        text: "Good morning team! Thank you all for dialing in from across our regions. Today we unveil our strategic enterprise playbook for Q4.",
      }
    ],
    resources: [
      { name: "Q4_Enterprise_Sales_Battlecards.pdf", type: "Sales Enablement", size: "12.1 MB" }
    ]
  },
  {
    id: "cloud-infrastructure",
    title: "Multi-Region Cloud Infrastructure & Disaster Recovery Simulation",
    description: "Deep-dive technical review of the automated failover architecture, latency optimizations, and high-availability benchmarks.",
    department: "Engineering",
    presenter: {
      name: "Tariq Al-Mansoor",
      role: "Principal Cloud Architect",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
    },
    date: "Oct 10, 2024",
    duration: "51:10",
    durationSeconds: 3070,
    progressPercent: 0,
    currentSeconds: 0,
    resolution: "4K ULTRA HD",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    isFavorite: false,
    views: 640,
    tags: ["DevOps", "Infrastructure", "High Availability", "AWS", "Security"],
    keyTakeaways: [
      "Simulated primary datacenter outage recovered in 42 seconds with zero committed data loss.",
      "Achieved sub-15ms p99 read latency across all North American and European edge nodes.",
      "Zero-trust network access (ZTNA) policy fully enforced across all production workloads."
    ],
    participants: [
      {
        name: "Tariq Al-Mansoor",
        role: "Principal Cloud Architect",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
        speakingTime: "38m 45s",
        speakingPercent: 76,
      },
      {
        name: "Devon Reed",
        role: "Site Reliability Engineer Lead",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
        speakingTime: "12m 25s",
        speakingPercent: 24,
      }
    ],
    chapters: [
      { id: "ci-1", title: "Failover Architecture Architecture", time: "00:00", seconds: 0, description: "Overview of Kubernetes cluster replication." },
      { id: "ci-2", title: "Chaos Engineering Simulation Run", time: "18:00", seconds: 1080, description: "Live execution of multi-zone network severance." }
    ],
    transcript: [
      {
        id: "t-ci1",
        time: "00:08",
        seconds: 8,
        speaker: "Tariq Al-Mansoor",
        speakerRole: "Principal Cloud Architect",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
        text: "Welcome everyone to our engineering architecture sync. Today we inspect the results of our multi-region disaster recovery simulation.",
      }
    ],
    resources: [
      { name: "DR_Simulation_Benchmark_Results.pdf", type: "Technical Whitepaper", size: "5.4 MB" }
    ]
  },
  {
    id: "ai-roadmap",
    title: "Generative AI & Intelligent Meeting Intelligence Roadmap",
    description: "Product demonstration of automated action item synthesis, sentiment analysis, and multi-modal meeting search.",
    department: "Product",
    presenter: {
      name: "Sarah Jenkins",
      role: "VP of Product Strategy",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    },
    date: "Oct 04, 2024",
    duration: "34:45",
    durationSeconds: 2085,
    progressPercent: 100,
    currentSeconds: 2085,
    resolution: "HD 1080P",
    thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
    isFavorite: true,
    views: 3100,
    tags: ["AI", "Product Roadmap", "Meeting Intelligence", "UX", "Innovation"],
    keyTakeaways: [
      "AI action item extraction precision improved to 96.8% in customer beta tests.",
      "Speaker diarization now distinguishes overlapping speech with high fidelity.",
      "Enterprise customer telemetry confirms average 45-minute savings per meeting attendee weekly."
    ],
    participants: [
      {
        name: "Sarah Jenkins",
        role: "VP of Product Strategy",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
        speakingTime: "24m 15s",
        speakingPercent: 70,
      },
      {
        name: "Kavita Rao",
        role: "Lead AI Researcher",
        avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=300&q=80",
        speakingTime: "10m 30s",
        speakingPercent: 30,
      }
    ],
    chapters: [
      { id: "ai-1", title: "Executive Vision & Market Demand", time: "00:00", seconds: 0, description: "Why meeting intelligence is the fastest-growing enterprise sector." },
      { id: "ai-2", title: "Live Product Demonstration", time: "12:10", seconds: 730, description: "Interactive demo of automated minutes and task delegation." }
    ],
    transcript: [
      {
        id: "t-ai1",
        time: "00:05",
        seconds: 5,
        speaker: "Sarah Jenkins",
        speakerRole: "VP of Product Strategy",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
        text: "Hello everyone, today we are unveiling the next leap in the CSM TRAC intelligence engine.",
      }
    ],
    resources: [
      { name: "Product_Roadmap_2025_Unredacted.pdf", type: "Product Specs", size: "9.7 MB" }
    ]
  },
  {
    id: "cybersecurity-audit",
    title: "Annual SOC 2 Type II & FedRAMP Readiness Audit Briefing",
    description: "Comprehensive information security review covering cryptographic key rotation, endpoint compliance, and incident response readiness.",
    department: "Security",
    presenter: {
      name: "Nathaniel Cole",
      role: "Chief Information Security Officer",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80",
    },
    date: "Sep 22, 2024",
    duration: "28:50",
    durationSeconds: 1730,
    progressPercent: 15,
    currentSeconds: 260,
    resolution: "HD 1080P",
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    isFavorite: false,
    views: 740,
    tags: ["Security", "SOC2", "FedRAMP", "Compliance", "Audit"],
    keyTakeaways: [
      "Zero audit exceptions noted in the external third-party SOC 2 Type II report.",
      "Hardware token MFA enforcement expanded to 100% of employees and contractors.",
      "Annual penetration testing revealed zero critical or high vulnerabilities."
    ],
    participants: [
      {
        name: "Nathaniel Cole",
        role: "Chief Information Security Officer",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80",
        speakingTime: "21m 40s",
        speakingPercent: 75,
      },
      {
        name: "Jessica Wu",
        role: "Security Operations Manager",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
        speakingTime: "7m 10s",
        speakingPercent: 25,
      }
    ],
    chapters: [
      { id: "sec-1", title: "Audit Scope & External Findings", time: "00:00", seconds: 0, description: "Third-party auditor letter and scope matrix." },
      { id: "sec-2", title: "Encryption & Key Management", time: "10:30", seconds: 630, description: "HSM integration and automated 90-day rotation." }
    ],
    transcript: [
      {
        id: "t-sec1",
        time: "00:04",
        seconds: 4,
        speaker: "Nathaniel Cole",
        speakerRole: "Chief Information Security Officer",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80",
        text: "Good afternoon. I am pleased to announce that our annual SOC 2 Type II assessment concluded with zero exceptions.",
      }
    ],
    resources: [
      { name: "SOC2_Type_II_Executive_Summary_2024.pdf", type: "Security Attestation", size: "2.1 MB" }
    ]
  }
];
