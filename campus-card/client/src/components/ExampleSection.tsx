import React from "react";
import { useInView } from "../hooks/useInView";

interface ExampleSectionProps {
  title: string;
  subtitle: string;
  index: number;
}

const ExampleSection: React.FC<ExampleSectionProps> = ({
  title,
  subtitle,
  index,
}) => {
  const { ref, isInView } = useInView<HTMLDivElement>();

  return (
    <section
      ref={ref}
      className={`transition-all duration-700 ease-out transform ${
        isInView
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-6"
      }`}
    >
      <div className="bg-white/90 rounded-3xl shadow-md p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-3">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
            Example page {index}
          </p>
          <h2 className="text-xl md:text-2xl font-semibold text-prussian">
            {title}
          </h2>
          <p className="text-sm text-slate-600">{subtitle}</p>
        </div>

        {/* Placeholder "chart" */}
        <div className="flex-1 w-full max-w-sm">
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-4">
            <p className="text-xs font-medium text-slate-500 mb-2">
              Temp analytics preview
            </p>
            <div className="flex items-end gap-2 h-28">
              <div className="flex-1 bg-blaze/20 rounded-t-xl" style={{ height: "40%" }} />
              <div className="flex-1 bg-blaze/50 rounded-t-xl" style={{ height: "70%" }} />
              <div className="flex-1 bg-prussian/30 rounded-t-xl" style={{ height: "55%" }} />
              <div className="flex-1 bg-prussian/70 rounded-t-xl" style={{ height: "85%" }} />
            </div>
            <p className="mt-2 text-[11px] text-slate-500">
              Replace this with real charts and campus spend analysis later.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExampleSection;
