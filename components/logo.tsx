import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center", className)}>
      <Image
        src="/quiron.png?v=2"
        alt="Quirón Logo"
        width={60}
        height={17}
        className="object-contain"
        priority
      />
    </div>
  );
}
