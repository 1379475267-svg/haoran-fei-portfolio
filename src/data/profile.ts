import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Code2,
  Cpu,
  FileText,
  Music2,
  Users,
} from "lucide-react";

export type ProjectCategory = "Web" | "Embedded" | "AI" | "Data" | "Music" | "Tool" | "Visualization";
export type ProjectCoverType = "game" | "music" | "saturn" | "embedded" | "ai" | "cosmos";

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
  role: "Electronic Information Student / Developer / Music Creator",
  email: "1379475267@qq.com",
  github: "https://github.com/1379475267-svg",
  heroIntro:
    "I am an Electronic Information Science and Technology undergraduate exploring embedded systems, AI-assisted coding, web visualization and open-source project practice. I also study guitar and piano over the long term, and I want my work to connect technical ability, expression and personal style.",
  about:
    "I am currently focused on C, Python, Linux, embedded development, frontend project building and AI coding tools. I like turning the learning process into projects that can be shown, reviewed and improved over time.",
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
  { value: "7", label: "Projects" },
  { value: "2016", label: "Music Started" },
  { value: "STM32", label: "Learning" },
  { value: "AI", label: "Coding Workflow" },
];

export const ribbonItems = [
  {
    label: "Currently Learning",
    value: "C / Python / Linux / STM32 / Frontend",
  },
  {
    label: "Building",
    value: "Portfolio / GameMemory / Music Theory Tutorial",
  },
  {
    label: "Direction",
    value: "Embedded Systems / AI-assisted Development / Creative Coding",
  },
];

export const projects: Project[] = [
  {
    id: "chordpilot",
    title: "ChordPilot",
    category: "Music",
    tagline: "Automatic chord timeline analysis for local music files.",
    description: "A local music-tech app for automatic chord timeline analysis.",
    longDescription:
      "ChordPilot is a local music-tech app for automatic chord timeline analysis, connecting music learning with practical listening and review tools.",
    tech: ["Music Tech", "Audio Analysis", "Local App"],
    coverType: "music",
    featured: true,
    github: "https://github.com/1379475267-svg/ChordPilot",
    demo: "https://github.com/1379475267-svg/ChordPilot",
  },
  {
    id: "python-data-analysis-quiz",
    title: "python-data-analysis-quiz",
    category: "Data",
    tagline: "A Python quiz project for data analysis practice.",
    description: "A compact Python project for reviewing data-analysis concepts through quiz-style practice.",
    longDescription:
      "python-data-analysis-quiz is a focused learning repository for Python data-analysis review, practice questions and small technical exercises.",
    tech: ["Python", "Data Analysis", "Quiz"],
    coverType: "ai",
    featured: false,
    github: "https://github.com/1379475267-svg/python-data-analysis-quiz",
    demo: "https://github.com/1379475267-svg/python-data-analysis-quiz",
  },
  {
    id: "gamememory",
    title: "GameMemory",
    category: "Web",
    tagline: "A personal archive for every game worth remembering.",
    description: "A JavaScript project for recording game memories, ratings and play history.",
    longDescription:
      "GameMemory keeps game records, ratings and personal notes in one maintainable archive for long-term play history.",
    tech: ["JavaScript", "Game Archive", "Ratings"],
    coverType: "game",
    featured: false,
    github: "https://github.com/1379475267-svg/GameMemory",
    demo: "https://github.com/1379475267-svg/GameMemory",
  },
  {
    id: "string-blade",
    title: "String-Blade",
    category: "Tool",
    tagline: "A TypeScript project with a small, sharp tool-building focus.",
    description: "A public TypeScript project with MIT licensing, built as part of my tooling practice.",
    longDescription:
      "String-Blade is a TypeScript project from my public GitHub workspace, focused on concise implementation and reusable tool-building practice.",
    tech: ["TypeScript", "MIT License", "Tooling"],
    coverType: "cosmos",
    featured: false,
    github: "https://github.com/1379475267-svg/String-Blade",
    demo: "https://github.com/1379475267-svg/String-Blade",
  },
  {
    id: "fretboard-caged-lab",
    title: "fretboard-caged-lab",
    category: "Music",
    tagline: "Interactive CAGED system visualizer for guitar learners.",
    description: "An interactive CAGED system visualizer for guitar learners.",
    longDescription:
      "fretboard-caged-lab turns guitar theory into an interactive visual system for learning shapes, positions and fretboard relationships.",
    tech: ["JavaScript", "Guitar", "CAGED"],
    coverType: "music",
    featured: false,
    github: "https://github.com/1379475267-svg/fretboard-caged-lab",
    demo: "https://github.com/1379475267-svg/fretboard-caged-lab",
  },
  {
    id: "interactive-particle-saturn",
    title: "interactive-particle-saturn",
    category: "Visualization",
    tagline: "A cinematic particle Saturn with orbital dynamics.",
    description: "A cinematic interactive particle Saturn built with Three.js and real-time chaos transitions.",
    longDescription:
      "interactive-particle-saturn explores particle motion, orbital dynamics and real-time visual transitions through a cinematic Three.js scene.",
    tech: ["Three.js", "JavaScript", "WebGL"],
    coverType: "saturn",
    featured: false,
    github: "https://github.com/1379475267-svg/interactive-particle-saturn",
    demo: "https://github.com/1379475267-svg/interactive-particle-saturn",
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
  },
];

export const projectCategories = ["All", "Web", "Music", "Data", "Tool", "Embedded", "Visualization"] as const;

export const techStack = [
  "React",
  "TypeScript",
  "Vue",
  "Django",
  "Python",
  "C",
  "STM32",
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
    title: "Embedded Development",
    description: "STM32, sensors, serial communication and hardware control, with steady practice across software and hardware.",
    level: "Learning",
    progress: 58,
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
    title: "Embedded Systems",
    description: "STM32, sensors, serial communication, hardware control.",
    tags: ["STM32", "Sensors", "C"],
  },
  {
    index: "02",
    title: "AI Coding Workflow",
    description: "Using AI tools to prototype, refactor and document projects.",
    tags: ["Prototype", "Refactor", "Document"],
  },
  {
    index: "03",
    title: "Personal Brand",
    description: "Building a portfolio that connects engineering, music and creativity.",
    tags: ["Engineering", "Music", "Creative"],
  },
];

export const timeline: TimelineItem[] = [
  {
    year: "2016",
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
    description: "Built multiple personal projects, explored GitHub, AI Coding and engineering practice.",
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
