import Image from "next/image";

interface CategoryCardProps {
  title: string;
  count: string;
  image: string;
  href?: string;
}

export function CategoryCard({ title, count, image, href = "/shop" }: CategoryCardProps) {
  return (
    <a href={href} className="block w-full group">
      <div className="relative w-full aspect-3/4 sm:aspect-4/5 rounded-[20px] overflow-hidden shadow-sm hover:shadow-sm shadow-green-100/80 transition-shadow duration-300 border border-black/5">
        
        {/* Background Image */}
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Subtle Dark Gradient Overlay (Only at the bottom for text readability) */}
        <div className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-[#0f172a]/90 via-[#0f172a]/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Content Wrapper */}
        <div className="absolute bottom-0 left-0 w-full p-5 sm:p-6">
          <h3 className="text-white font-bold text-lg sm:text-xl mb-0.5 tracking-tight drop-shadow-md">
            {title}
          </h3>
          <p className="text-gray-300 text-xs sm:text-sm font-medium drop-shadow-sm">
            {count}
          </p>
        </div>

      </div>
    </a>
  );
}