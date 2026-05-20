import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-full min-h-[400px] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-white/50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium tracking-wide">Loading Mirror...</p>
      </div>
    </div>
  );
}
