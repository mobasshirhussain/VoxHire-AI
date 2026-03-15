import Image from "next/image";
import { cn, getTechLogos } from "@/lib/utils";

const DisplayTechIcons = async ({ techStack }: TechIconProps) => {
  const techIcons = await getTechLogos(techStack);

  return (
    <div className="flex flex-row items-center">
      {techIcons.slice(0, 3).map(({ tech, url }, index) => (
        <div
          key={tech}
          className={cn(
            "relative group flex items-center justify-center w-8 h-8 rounded-full bg-[#161b26] border border-white/[0.08] transition-all duration-200 hover:border-[#63b3ed]/40 hover:bg-[#1a2535] hover:z-10 hover:scale-110",
            index >= 1 && "-ml-2.5"
          )}
        >
          {/* Tooltip */}
          <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[6px] bg-[#0f1219] border border-white/[0.08] px-2 py-0.5 text-[0.65rem] font-medium text-[#8a96b0] opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-lg">
            {tech}
          </span>

          <Image
            src={url}
            alt={tech}
            width={18}
            height={18}
            className="object-contain"
          />
        </div>
      ))}
    </div>
  );
};

export default DisplayTechIcons;