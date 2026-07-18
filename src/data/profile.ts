import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Code2,
  Cpu,
  FileText,
  Music2,
  Users,
} from "lucide-react";

export type ProjectCategory = "Robotics" | "Web" | "Embedded" | "AI" | "Data" | "Music" | "Tool" | "Visualization";
export type ProjectCoverType = "drone" | "game" | "music" | "saturn" | "embedded" | "ai" | "cosmos";

export interface NavItem {
  label: string;
  href: string;
}

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  tagline: string;
  description: string;
  longDescription: string;
  tech: string[];
  coverType: ProjectCoverType;
  featured: boolean;
  github: string;
  demo: string;
  globalDemo?: string;
  chinaDemo?: string;
  coverImage?: string;
  coverPoster?: string;
  coverVideoWebm?: string;
  coverVideoMp4?: string;
  coverLabel?: string;
  demoLabel?: string;
  period?: string;
  status?: string;
  highlights?: Array<{
    label: string;
    value: string;
  }>;
}

export interface Skill {
  title: string;
  description: string;
  level: string;
  progress: number;
  icon: LucideIcon;
}

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
  current?: boolean;
}

export interface FocusItem {
  index: string;
  title: string;
  description: string;
  tags: string[];
}

export interface Stat {
  label: string;
  value: string;
}

export const profile = {
  name: "Haoran Fei",
  chineseName: "Haoran Fei",
  role: "Electronic Information Student / Developer",
  email: "1379475267@qq.com",
  qq: "1379475267",
  wechat: "Congee",
  wechatQr: "./projects/wechat-qr.webp",
  github: "https://github.com/1379475267-svg",
  heroIntro:
    "I build hands-on systems across autonomous robotics, embedded development, and music technology. I turn learning into tangible work - quietly, clearly, and with personal style.",
  about:
    "I am currently focused on autonomous robotics, C, Python, Linux, embedded development, frontend project building and AI coding tools. I like turning the learning process into projects that can be shown, reviewed and improved over time.",
  signature: "Quiet, focused, and always building.",
};

export const navItems: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Now", href: "#now" },
  { label: "Timeline", href: "#timeline" },
  { label: "Contact", href: "#contact" },
];

export const stats: Stat[] = [
  { value: "8", label: "Projects" },
  { value: "2012", label: "Music Started" },
  { value: "ROS / PX4", label: "Learning" },
  { value: "AI", label: "Coding Workflow" },
];

export const ribbonItems = [
  {
    label: "Currently Learning",
    value: "ROS / PX4 / Localization / Planning / Linux",
  },
  {
    label: "Building",
    value: "Nonconvex α Drone / Portfolio / ChordPilot",
  },
  {
    label: "Direction",
    value: "Autonomous Robotics / Embedded Systems / Creative Technology",
  },
];

export const projects: Project[] = [
  {
    id: "nonconvex-alpha",
    title: "Nonconvex α / Drone Lab",
    category: "Robotics",
    tagline: "A student-team development archive for a real LiDAR autonomous flight stack.",
    description: "A traceable workspace for restoring, testing, and extending an education and research drone.",
    longDescription:
      "A student team workspace for preserving the factory baseline and extending a real research drone. The current stack combines Livox Mid-360 and Faster-LIO localization and mapping with Diff-Planner local trajectory planning and PX4 control on Jetson Orin NX.",
    tech: ["ROS 1", "PX4", "Faster-LIO", "Diff-Planner"],
    coverType: "drone",
    featured: true,
    github: "https://github.com/1379475267-svg/nonconvex-alpha-standard",
    demo: "https://github.com/1379475267-svg/nonconvex-alpha-standard",
    coverImage: "./projects/nonconvex-navigation.gif",
    coverPoster: "./projects/nonconvex-navigation.webp",
    coverVideoWebm: "./projects/nonconvex-navigation.webm",
    coverVideoMp4: "./projects/nonconvex-navigation.mp4",
    demoLabel: "Open Flight Archive",
    period: "FIELD PROJECT · JUL 2026",
    status: "ACTIVE · TEAM R&D",
    highlights: [
      { label: "Compute", value: "Jetson Orin NX" },
      { label: "Sensing", value: "Livox Mid-360" },
      { label: "Control", value: "PX4 / H743" },
    ],
  },
  {
    id: "chordpilot",
    title: "ChordPilot",
    category: "Music",
    tagline: "Automatic chord timeline analysis for local music files.",
    description: "A local Vue and FastAPI music-tech app for automatic chord timeline analysis.",
    longDescription:
      "ChordPilot turns uploaded MP3 or WAV files into a synchronized chord timeline, using chroma analysis and lightweight template matching to create a useful draft for listening, practice, and transcription.",
    tech: ["Vue 3", "FastAPI", "librosa"],
    coverType: "music",
    featured: false,
    github: "https://github.com/1379475267-svg/ChordPilot",
    demo: "https://github.com/1379475267-svg/ChordPilot",
    chinaDemo: "http://47.109.136.234/projects/chordpilot/",
    coverPoster: "./projects/chordpilot-timeline.webp",
    demoLabel: "View Repository",
  },
  {
    id: "python-data-analysis-quiz",
    title: "python-data-analysis-quiz",
    category: "Data",
    tagline: "A browser-based final-exam practice space for Python data analysis.",
    description: "A static study site with 123 questions, answer checking, explanations and mistake review.",
    longDescription:
      "A focused revision site covering true-or-false, single choice, fill-in, code completion and short programming questions, with automatic marking for objective questions and a dedicated mistake-review flow.",
    tech: ["JavaScript", "Data Analysis", "Static Web"],
    coverType: "ai",
    featured: false,
    github: "https://github.com/1379475267-svg/python-data-analysis-quiz",
    demo: "https://1379475267-svg.github.io/python-data-analysis-quiz/",
    globalDemo: "https://1379475267-svg.github.io/python-data-analysis-quiz/",
    coverPoster: "./projects/python-data-analysis-quiz.webp",
    coverLabel: "DATA / PROJECT",
    demoLabel: "Open Live Demo",
  },
  {
    id: "gamememory",
    title: "GameMemory",
    category: "Web",
    tagline: "A full-stack personal archive for every game worth remembering.",
    description: "A Vue-based game archive for importing, rating, reviewing, and organizing a personal library.",
    longDescription:
      "GameMemory is a full-stack personal game archive with RAWG search, Steam library import, SteamGridDB artwork, Supabase data, ratings, reviews, statistics, and a public Memory Wall.",
    tech: ["Vue 3", "Supabase", "Netlify"],
    coverType: "game",
    featured: false,
    github: "https://github.com/1379475267-svg/GameMemory",
    demo: "https://1gamememory1.netlify.app",
    globalDemo: "https://1gamememory1.netlify.app",
    chinaDemo: "http://47.109.136.234/projects/gamememory/",
    coverPoster: "./projects/gamememory-library.webp",
    demoLabel: "Open Live Site",
  },
  {
    id: "string-blade",
    title: "String-Blade",
    category: "Music",
    tagline: "A browser guitar-chord combat game powered by live musical input.",
    description: "Play chords to attack, guard, parry and follow rhythm-based progressions.",
    longDescription:
      "String Blade turns guitar chords into battle actions across Duel and Progression modes, combining Phaser combat with microphone chord recognition, Web MIDI input, calibration tools and rhythm timing.",
    tech: ["Phaser", "Web Audio", "Web MIDI"],
    coverType: "game",
    featured: false,
    github: "https://github.com/1379475267-svg/String-Blade",
    demo: "https://stringblade.netlify.app",
    globalDemo: "https://stringblade.netlify.app",
    chinaDemo: "http://47.109.136.234/projects/string-blade/",
    coverPoster: "./projects/string-blade.webp",
    coverLabel: "CHORD COMBAT / PROJECT",
    demoLabel: "Open Live Demo",
  },
  {
    id: "fretboard-caged-lab",
    title: "Fret & Key Theory Lab",
    category: "Music",
    tagline: "A bilingual guitar and piano music-theory visualizer.",
    description: "An interactive theory lab connecting CAGED shapes, fretboard notes, piano keys, and staff notation.",
    longDescription:
      "Fret & Key Theory Lab is a bilingual visual learning space for guitar and piano, connecting CAGED shapes, chord tones, scale intervals, keyboard layout, and beginner staff notation.",
    tech: ["JavaScript", "CAGED", "Music Theory"],
    coverType: "music",
    featured: false,
    github: "https://github.com/1379475267-svg/fretboard-caged-lab",
    demo: "https://1379475267-svg.github.io/fretboard-caged-lab/",
    globalDemo: "https://1379475267-svg.github.io/fretboard-caged-lab/",
    chinaDemo: "http://47.109.136.234/projects/fretboard/",
    coverPoster: "./projects/fretboard-guitar-view.webp",
    demoLabel: "Open Live Demo",
  },
  {
    id: "interactive-particle-saturn",
    title: "interactive-particle-saturn",
    category: "Visualization",
    tagline: "A gesture-driven particle Saturn with orbital dynamics.",
    description: "A cinematic Three.js particle system with hand tracking, orbital motion, and controlled chaos transitions.",
    longDescription:
      "Interactive Particle Saturn is a browser artwork built from a responsive particle field, combining Three.js, MediaPipe hand tracking, GLSL, drag interaction, and real-time transitions from stable orbit to turbulence.",
    tech: ["Three.js", "MediaPipe", "GLSL"],
    coverType: "saturn",
    featured: false,
    github: "https://github.com/1379475267-svg/interactive-particle-saturn",
    demo: "https://1379475267-svg.github.io/interactive-particle-saturn/",
    globalDemo: "https://1379475267-svg.github.io/interactive-particle-saturn/",
    coverPoster: "./projects/interactive-particle-saturn-live.webp",
    coverVideoWebm: "./projects/interactive-particle-saturn.webm",
    coverVideoMp4: "./projects/interactive-particle-saturn.mp4",
    demoLabel: "Open Live Demo",
  },
  {
    id: "smart-fishing-alert",
    title: "smart-fishing-alert",
    category: "Embedded",
    tagline: "STM32-based fishing bite detection and alert system.",
    description: "An embedded STM32 project for fishing bite detection and alerting.",
    longDescription:
      "smart-fishing-alert combines sensors, signal judgment and embedded hardware feedback into a practical STM32 prototype.",
    tech: ["STM32", "Sensors", "C"],
    coverType: "embedded",
    featured: false,
    github: "https://github.com/1379475267-svg/smart-fishing-alert",
    demo: "https://github.com/1379475267-svg/smart-fishing-alert",
    demoLabel: "View Repository",
  },
];

export const projectCategories = ["All", "Robotics", "Embedded", "Web", "Music", "Data", "Tool", "Visualization"] as const;

export const techStack = [
  "React",
  "TypeScript",
  "Vue",
  "Django",
  "Python",
  "C",
  "STM32",
  "ROS 1",
  "PX4",
  "Faster-LIO",
  "Jetson Orin NX",
  "Linux",
  "Git",
  "Three.js",
  "Canvas",
  "Tailwind CSS",
  "Framer Motion",
  "YOLOv7",
  "SQLite",
  "GitHub Pages",
];

export const skills: Skill[] = [
  {
    title: "Robotics & Embedded",
    description: "Working across ROS, PX4, LiDAR localization, STM32, sensors and hardware control with a safety-first testing workflow.",
    level: "Building",
    progress: 62,
    icon: Cpu,
  },
  {
    title: "AI-assisted Coding",
    description: "Using AI coding tools to support prototypes, refactoring, documentation and complex task breakdowns.",
    level: "Building",
    progress: 76,
    icon: Bot,
  },
  {
    title: "Web Visualization",
    description: "Exploring Three.js, Canvas, interaction motion and modern interface expression.",
    level: "Exploring",
    progress: 68,
    icon: Code2,
  },
  {
    title: "Project Documentation",
    description: "Practicing clear READMEs, project reviews, technical notes, presentation materials and structured communication.",
    level: "Practicing",
    progress: 72,
    icon: FileText,
  },
  {
    title: "Music Creation",
    description: "Long-term guitar and piano learning, with attention to rhythm, structure, arrangement and atmosphere.",
    level: "Long-term",
    progress: 82,
    icon: Music2,
  },
  {
    title: "Team Collaboration",
    description: "Taking part in organizing, coordination, collaboration and project presentation in labs and project work.",
    level: "Active",
    progress: 64,
    icon: Users,
  },
];

export const focusItems: FocusItem[] = [
  {
    index: "01",
    title: "Autonomous Drone Systems",
    description: "Understanding a real LiDAR flight stack from localization and mapping through planning and PX4 control.",
    tags: ["ROS 1", "Faster-LIO", "PX4"],
  },
  {
    index: "02",
    title: "Simulation Before Flight",
    description: "Testing paths, parameters and recovery steps in simulation before controlled hardware validation.",
    tags: ["Diff-Planner", "RViz", "Safety"],
  },
  {
    index: "03",
    title: "Team Engineering Record",
    description: "Keeping every experiment reviewable through baselines, branches, pull requests and clear technical notes.",
    tags: ["Git", "Review", "Documentation"],
  },
];

export const timeline: TimelineItem[] = [
  {
    year: "2012",
    title: "A beginning in music",
    description: "Started learning guitar and music.",
  },
  {
    year: "2025",
    title: "Electronic information",
    description: "Entered Electronic Information Science and Technology.",
  },
  {
    year: "2026",
    title: "Projects became a practice",
    description: "Moved from personal prototypes into a team autonomous-drone project, with GitHub, simulation and engineering documentation as part of the practice.",
  },
  {
    year: "Now",
    title: "A focused, long-term direction",
    description:
      "Focusing on embedded systems, Web visualization, project documentation and long-term personal growth.",
    current: true,
  },
];

export const contact = {
  title: "Let's build something meaningful.",
  subtitle:
    "If you are interested in my projects, music, ideas or collaboration, feel free to reach out.",
  email: profile.email,
  github: profile.github,
  status: "open to ideas",
};
