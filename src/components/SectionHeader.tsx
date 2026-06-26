import Reveal from "./Reveal";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeaderProps) {
  return (
    <Reveal className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <div className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
        <span className="h-px w-8 bg-cyan-400/70" />
        {eyebrow}
      </div>
      <h2 className="text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400 lg:text-lg">{description}</p>
      )}
    </Reveal>
  );
}
