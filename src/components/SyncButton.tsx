"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { syncTasksAction } from "@/app/actions/syncTasks";
import { useRouter } from "next/navigation";

export default function SyncButton() {
  const { providerToken } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const router = useRouter();

  const handleSync = async () => {
    if (!providerToken) {
      alert("Missing Google Calendar access. Please log out and log in again.");
      return;
    }

    setIsSyncing(true);
    try {
      const res = await syncTasksAction(providerToken);
      if (res.success) {
        // Refresh the page data
        router.refresh();
      } else {
        alert("Failed to sync: " + res.error);
      }
    } catch (err: any) {
      alert("Failed to sync: " + err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Button 
      onClick={handleSync} 
      disabled={isSyncing || !providerToken}
      variant="outline"
      className="glass-card border-white/10 text-white hover:bg-white/10 hover:text-white"
    >
      <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
      {isSyncing ? "Syncing..." : "Sync Calendar"}
    </Button>
  );
}
