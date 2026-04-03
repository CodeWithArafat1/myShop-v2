import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function FeatureCard({ title, description, icon: Icon }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-2xl p-8 flex flex-col items-center text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] group cursor-pointer">
      
      {/* Icon Container */}
      <div className="w-14 h-14 bg-[#e8f7ed] rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110">
        <Icon className="w-6 h-6 text-[#16a34a]" strokeWidth={2.5} />
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-gray-900 font-serif mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-500 leading-relaxed max-w-[200px]">
        {description}
      </p>
      
    </div>
  );
}