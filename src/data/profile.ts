import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Code2,
  Cpu,
  FileText,
  Music2,
  Users,
} from "lucide-react";

export type ProjectCategory = "Web" | "Embedded" | "AI" | "Music" | "Visualization";
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
  chineseName: "费浩然",
  role: "Electronic Information Student · Developer · Music Creator",
  email: "1379475267@qq.com",
  github: "https://github.com/1379475267-svg",
  heroIntro:
    "我是费浩然，电子信息科学与技术专业本科生。正在探索嵌入式系统、AI Coding、Web 可视化与开源项目实践，也长期学习吉他和钢琴。我希望把技术能力、表达能力和创造力结合起来，做出真正有个人风格的作品。",
  about:
    "我是费浩然，电子信息科学与技术专业本科生。现阶段主要学习 C、Python、Linux、嵌入式开发、前端项目构建与 AI Coding 工具使用。我喜欢把学习过程做成可以展示、可以沉淀、可以持续迭代的项目。",
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
  { value: "10+", label: "Projects" },
  { value: "2016", label: "Music Started" },
  { value: "STM32", label: "Learning" },
  { value: "AI", label: "Coding Workflow" },
];

export const ribbonItems = [
  {
    label: "Currently Learning",
    value: "C · Python · Linux · STM32 · Frontend",
  },
  {
    label: "Building",
    value: "Portfolio · GameMemory · Music Theory Tutorial",
  },
  {
    label: "Direction",
    value: "Embedded Systems · AI-assisted Development · Creative Coding",
  },
];

export const projects: Project[] = [
  {
    id: "gamememory",
    title: "GameMemory",
    category: "Web",
    tagline: "A personal archive for every game worth remembering.",
    description: "个人游戏记录与评价系统，用于记录游玩经历、评分、评价和游戏资料。",
    longDescription:
      "从游戏资料检索到个人评分与游玩记录，把分散的体验整理成一套可持续维护的数字档案。",
    tech: ["Vue 3", "Django", "SQLite", "RAWG API", "SteamGridDB"],
    coverType: "game",
    featured: true,
    github: "https://github.com/1379475267-svg/GameMemory",
    demo: "https://github.com/1379475267-svg/GameMemory",
  },
  {
    id: "music-theory",
    title: "Music Theory Tutorial",
    category: "Music",
    tagline: "Music theory explained from the fretboard outward.",
    description: "面向零基础学习者的音乐乐理入门教程，从吉他 CAGED 系统扩展到完整乐理上手教程。",
    longDescription:
      "用更直观的吉他指板、和弦结构和练习路径，让抽象乐理变成可听、可弹、可理解的知识。",
    tech: ["HTML", "CSS", "JavaScript", "GitHub Pages"],
    coverType: "music",
    featured: false,
    github: "https://github.com/1379475267-svg/fretboard-caged-lab",
    demo: "https://github.com/1379475267-svg/fretboard-caged-lab",
  },
  {
    id: "particle-saturn",
    title: "Interactive Particle Saturn",
    category: "Visualization",
    tagline: "A particle experiment orbiting between code and space.",
    description: "基于 Three.js 的交互式粒子土星项目，结合视觉动画与交互体验。",
    longDescription:
      "通过粒子、轨道和空间层次练习实时视觉表达，探索代码如何形成具有呼吸感的数字场景。",
    tech: ["Three.js", "JavaScript", "WebGL"],
    coverType: "saturn",
    featured: false,
    github: "https://github.com/1379475267-svg/interactive-particle-saturn",
    demo: "https://github.com/1379475267-svg/interactive-particle-saturn",
  },
  {
    id: "fishing-alert",
    title: "Smart Fishing Alert",
    category: "Embedded",
    tagline: "Sensors, signals and a practical embedded response.",
    description: "基于 STM32 与传感器的智能钓鱼提醒项目，探索嵌入式系统在生活场景中的应用。",
    longDescription:
      "将姿态传感、信号判断和硬件提醒组合成一个小型工程原型，练习从电路到交互的完整思考。",
    tech: ["STM32", "MPU6050", "C", "Embedded"],
    coverType: "embedded",
    featured: false,
    github: "https://github.com/1379475267-svg/smart-fishing-alert",
    demo: "https://github.com/1379475267-svg/smart-fishing-alert",
  },
  {
    id: "aigc-trainer",
    title: "AIGC 智训师",
    category: "AI",
    tagline: "AI recognition meets structured training workflow.",
    description: "结合 AI 识别、训练管理和数据处理的综合平台项目。",
    longDescription:
      "将目标识别能力嵌入训练管理界面，关注模型输出、业务流程与可读数据展示之间的连接。",
    tech: ["Vue", "Django", "YOLOv7", "OSS"],
    coverType: "ai",
    featured: false,
    github: "https://github.com/1379475267-svg?tab=repositories&q=aigc",
    demo: "https://github.com/1379475267-svg?tab=repositories&q=aigc",
  },
  {
    id: "neural-cosmos",
    title: "Neural Cosmos",
    category: "Visualization",
    tagline: "A visual system of nodes, signals and imagined space.",
    description: "偏视觉表达和交互体验的 Web 可视化项目，探索粒子、空间和科技感界面设计。",
    longDescription:
      "以神经网络节点和宇宙空间为视觉隐喻，练习 Canvas 动效、信息层级与沉浸式界面氛围。",
    tech: ["JavaScript", "Canvas", "Creative Coding"],
    coverType: "cosmos",
    featured: false,
    github: "https://github.com/1379475267-svg/Neural-Cosmos",
    demo: "https://github.com/1379475267-svg/Neural-Cosmos",
  },
];

export const projectCategories = ["All", "Web", "Embedded", "AI", "Music", "Visualization"] as const;

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
    description: "STM32、传感器、串口通信与硬件控制，持续积累软硬件结合的工程实践。",
    level: "Learning",
    progress: 58,
    icon: Cpu,
  },
  {
    title: "AI-assisted Coding",
    description: "使用 AI Coding 工具辅助原型、重构、文档整理和复杂任务拆解。",
    level: "Building",
    progress: 76,
    icon: Bot,
  },
  {
    title: "Web Visualization",
    description: "关注 Three.js、Canvas、交互动效与现代界面的视觉表达。",
    level: "Exploring",
    progress: 68,
    icon: Code2,
  },
  {
    title: "Project Documentation",
    description: "重视 README、复盘、技术文档、展示材料和清晰表达。",
    level: "Practicing",
    progress: 72,
    icon: FileText,
  },
  {
    title: "Music Creation",
    description: "长期学习吉他与钢琴，关注节奏、结构、编配与作品氛围。",
    level: "Long-term",
    progress: 82,
    icon: Music2,
  },
  {
    title: "Team Collaboration",
    description: "在实验室与项目中参与组织、推进、协作和成果展示。",
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
