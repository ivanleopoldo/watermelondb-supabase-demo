import { RealtimeChannel } from "@supabase/supabase-js";
import { createContext, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { database } from "../lib/db";
import { supabase } from "../lib/supabase";
import { sync } from "../lib/sync";

export const SyncContext = createContext<{
  isSyncing: boolean;
  triggerSync: () => void;
}>({
  isSyncing: false,
  triggerSync: () => {},
});

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const [channel, setChannel] = useState<RealtimeChannel>();
  const [isSyncing, setIsSyncing] = useState(false);
  const { user } = useAuth();

  // Ref to track ongoing sync and queued triggers
  const syncLock = useRef(false);
  const queued = useRef(false);

  function triggerSync() {
    if (syncLock.current) {
      queued.current = true; // queue one sync if already running
      return;
    }

    syncLock.current = true;
    setIsSyncing(true);

    (async () => {
      try {
        await sync(); // your WatermelonDB sync function
        sendSyncEvent();
      } catch (err) {
        console.error("Sync error:", err);
      } finally {
        syncLock.current = false;
        setIsSyncing(false);

        // If another trigger was queued while syncing, run it immediately
        if (queued.current) {
          queued.current = false;
          triggerSync();
        }
      }
    })();
  }

  function sendSyncEvent() {
    if (channel) {
      channel.send({
        type: "broadcast",
        event: "sync",
        payload: { message: "Sync event triggered" },
      });
    }
  }

  // Subscribe to user-specific sync broadcasts
  useEffect(() => {
    if (!user) return;

    const ch = supabase.channel(`sync-${user.id}`);
    const subscription = ch
      .on("broadcast", { event: "sync" }, () => triggerSync())
      .subscribe();
    setChannel(ch);

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  // Listen to database changes
  useEffect(() => {
    const subscription = database
      .withChangesForTables(["todos"])
      .subscribe(() => triggerSync());

    return () => subscription.unsubscribe();
  }, []);

  // Listen to app state changes (foreground/background)
  useEffect(() => {
    const subscription = AppState.addEventListener("change", () => {
      triggerSync();
    });

    return () => subscription.remove();
  }, []);

  return (
    <SyncContext.Provider value={{ isSyncing, triggerSync }}>
      {children}
    </SyncContext.Provider>
  );
}
