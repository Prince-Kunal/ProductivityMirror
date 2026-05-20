import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/5 bg-background/50 px-6 backdrop-blur-xl xl:px-10">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-white/50">{currentDate}</span>
        <h1 className="text-xl font-bold tracking-tight text-white/90">Good morning, Kunal</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 transition-colors focus-within:border-white/20 focus-within:bg-white/10 md:flex">
          <Search className="h-4 w-4 text-white/40" />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="w-48 bg-transparent text-sm text-white/80 placeholder:text-white/30 focus:outline-none"
          />
        </div>
        
        <Button variant="ghost" size="icon" className="rounded-full border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white">
          <Bell className="h-4 w-4" />
        </Button>
        
        <div className="h-9 w-9 overflow-hidden rounded-full border border-white/10 bg-white/5 p-1 flex items-center justify-center">
          <User className="h-5 w-5 text-white/50" />
        </div>
      </div>
    </header>
  );
}
