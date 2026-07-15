import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type V3Language = "zh" | "en";

const copy = {
  zh: {
    skip: "跳到项目",
    nav: { about: "关于我", capabilities: "能力", projects: "项目", contact: "联系我" },
    switchLanguage: "切换到英文",
    hero: {
      kicker: "电子信息 / 开发者",
      location: "2026",
      greeting: "你好，我是",
      body: "一名正在构建自主飞行系统、嵌入式工具与创意技术项目的学生开发者。",
      viewProject: "查看无人机项目",
      explore: "浏览项目档案",
      exploreAria: "继续浏览项目档案",
      live: "进行中的项目",
      mediaAlt: "自主无人机在林荫走廊中飞行，画面包含定位与建图视图",
      mediaAria: "自主无人机导航测试画面",
    },
    reel: { eyebrow: "项目影像 / 精选系统", title: "项目进行时。", open: "在 GitHub 查看" },
    about: {
      eyebrow: "个人简介 / 当前方向",
      title: "关于我",
      lead: "我目前专注于自主机器人、嵌入式开发和音乐技术，喜欢把学习过程变成可以展示、复盘并持续改进的真实项目。",
      priority: "现在最重要的方向是一套真实的激光雷达自主飞行系统：在实践中理解定位、规划、控制、硬件与团队工程记录如何连接起来。",
      email: "给我发邮件",
    },
    capabilities: { eyebrow: "能力 / 我在构建什么", title: "我在构建什么" },
    projects: {
      eyebrow: "精选项目 / GitHub",
      title: "项目档案",
      intro: "五个项目，记录我如何在真实系统、实用工具、音乐与视觉实验之间推进想法。",
      active: "团队研发中",
      personal: "个人项目",
      open: "在 GitHub 查看",
      openAria: "在 GitHub 查看项目",
      detailLabels: ["方向", "构建", "技术"],
    },
    footer: {
      question: "想聊聊这些项目？",
      title: "联系我",
      scan: "扫码添加",
      qrAlt: "微信二维码",
      qrCaption: "微信 / WeChat",
      version: "个人网站 / 第 03 版",
    },
    music: { play: "播放背景音乐", pause: "暂停背景音乐" },
  },
  en: {
    skip: "Skip to projects",
    nav: { about: "About", capabilities: "Capabilities", projects: "Projects", contact: "Contact" },
    switchLanguage: "Switch to Chinese",
    hero: {
      kicker: "Electronic information / developer",
      location: "2026",
      greeting: "Hi, I’m",
      body: "A student developer building autonomous flight systems, embedded tools, and creative technology.",
      viewProject: "View drone project",
      explore: "Explore the archive",
      exploreAria: "Continue to project reel",
      live: "Live project",
      mediaAlt: "Autonomous drone navigating through a tree-lined corridor with mapping views",
      mediaAria: "Autonomous drone navigation test footage",
    },
    reel: { eyebrow: "Project reel / selected systems", title: "Work in motion.", open: "Open on GitHub" },
    about: {
      eyebrow: "Profile / current direction",
      title: "About me",
      lead: "I am currently focused on autonomous robotics, embedded development, and music technology. I like turning the learning process into projects that can be shown, reviewed, and improved over time.",
      priority: "My current priority is a real LiDAR autonomous-flight stack: understanding how localization, planning, control, hardware, and team documentation connect in practice.",
      email: "Email me",
    },
    capabilities: { eyebrow: "Capabilities / what I build", title: "What I build" },
    projects: {
      eyebrow: "Selected projects / GitHub",
      title: "Project",
      intro: "Five projects that show how I move between physical systems, practical tools, music, and visual experiments.",
      active: "Active team R&D",
      personal: "Personal project",
      open: "Open on GitHub",
      openAria: "Open project on GitHub",
      detailLabels: ["Focus", "Build", "Stack"],
    },
    footer: {
      question: "Have a question about the work?",
      title: "Contact",
      scan: "Scan to add",
      qrAlt: "WeChat QR code",
      qrCaption: "WeChat / 微信",
      version: "Portfolio / version 03",
    },
    music: { play: "Play background music", pause: "Pause background music" },
  },
} as const;

const chineseProjectCopy: Record<string, { longDescription: string; coverLabel: string }> = {
  "nonconvex-alpha": {
    longDescription:
      "这是学生团队用于保存出厂基线、逐步扩展真实科研无人机的工程工作区。目前系统以 Jetson Orin NX 为计算平台，结合 Livox Mid-360、Faster-LIO 定位建图、Diff-Planner 局部轨迹规划与 PX4 飞控。",
    coverLabel: "飞行系统 / 项目",
  },
  chordpilot: {
    longDescription:
      "ChordPilot 将上传的 MP3 或 WAV 音频转换为同步和弦时间线，通过色度分析和轻量模板匹配，为听音、练习与扒谱生成一份可继续修正的初稿。",
    coverLabel: "音乐 / 项目",
  },
  "python-data-analysis-quiz": {
    longDescription:
      "面向 Python 数据分析期末复习的静态刷题网页，包含判断、单选、填空、代码补全与简单编程题，并提供客观题自动判分和错题回看。",
    coverLabel: "数据 / 项目",
  },
  gamememory: {
    longDescription:
      "GameMemory 是一个个人游戏档案网站，支持 RAWG 搜索、Steam 游戏库导入、SteamGridDB 封面、Supabase 数据、评分、短评、统计与公开记忆墙。",
    coverLabel: "游戏 / 项目",
  },
  "string-blade": {
    longDescription:
      "String Blade 把吉他和弦转换为战斗动作，通过 Phaser、麦克风和弦识别、Web MIDI、校准工具与节奏判定，构成 Duel 和 Progression 两种玩法。",
    coverLabel: "和弦战斗 / 项目",
  },
  "fretboard-caged-lab": {
    longDescription:
      "一个连接吉他与钢琴的双语乐理学习空间，把 CAGED 指型、和弦音、音程、键盘布局与五线谱基础放在同一套交互视图中。",
    coverLabel: "音乐 / 项目",
  },
  "interactive-particle-saturn": {
    longDescription:
      "一个由响应式粒子场构成的浏览器艺术作品，结合 Three.js、MediaPipe 手势追踪、GLSL、拖拽交互与实时状态切换，让稳定轨道逐渐进入湍动。",
    coverLabel: "土星 / 项目",
  },
  "smart-fishing-alert": {
    longDescription:
      "一个基于 STM32 的钓鱼咬钩检测原型，将传感器输入、信号判断与硬件反馈组合成可实际验证的提醒系统。",
    coverLabel: "嵌入式 / 项目",
  },
};

export const categoryLabel: Record<string, { zh: string; en: string }> = {
  Robotics: { zh: "机器人", en: "Robotics" },
  Web: { zh: "Web", en: "Web" },
  Embedded: { zh: "嵌入式", en: "Embedded" },
  AI: { zh: "人工智能", en: "AI" },
  Data: { zh: "数据", en: "Data" },
  Music: { zh: "音乐", en: "Music" },
  Tool: { zh: "工具", en: "Tool" },
  Visualization: { zh: "可视化", en: "Visualization" },
};

export const highlightLabel: Record<string, string> = {
  Compute: "算力",
  Sensing: "感知",
  Control: "控制",
};

export function getProjectLanguage(project: {
  id: string;
  longDescription: string;
  coverLabel?: string;
}, language: V3Language) {
  if (language === "zh" && chineseProjectCopy[project.id]) return chineseProjectCopy[project.id];
  return { longDescription: project.longDescription, coverLabel: project.coverLabel };
}

interface LanguageContextValue {
  language: V3Language;
  setLanguage: (language: V3Language) => void;
  t: (typeof copy)[V3Language];
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function V3LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<V3Language>("zh");
  const value = useMemo(() => ({ language, setLanguage, t: copy[language] }), [language]);

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.title = language === "zh"
      ? "费浩然｜自主系统与创意技术"
      : "Haoran Fei — Autonomous Systems & Creative Technology";
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) {
      description.content = language === "zh"
        ? "费浩然的个人网站：记录自主无人机、嵌入式系统、音乐技术与交互项目。"
        : "Haoran Fei's portfolio of autonomous robotics, embedded systems, music technology, and interactive projects.";
    }
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useV3Language() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useV3Language must be used inside V3LanguageProvider");
  return value;
}
