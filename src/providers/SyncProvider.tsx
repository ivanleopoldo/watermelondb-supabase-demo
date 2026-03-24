import {
  REALTIME_SUBSCRIBE_STATES,
  RealtimeChannel,
} from "@supabase/supabase-js";
import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { database } from "../lib/db";
import { supabase } from "../lib/supabase";
import { sync } from "../lib/sync";

export const SyncContext = createContext<{
  isSyncing: boolean;
  triggerSync: () => void;
  sendSyncBroadcast: () => void;
}>({
  isSyncing: false,
  triggerSync: () => {},
  sendSyncBroadcast: () => {},
});

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const channel = useRef<RealtimeChannel | null>(null);

  const { user } = useAuth();

  const sendSyncBroadcast = useCallback(() => {
    if (channel.current && channel.current.state === "joined") {
      console.log("♻️ Sending Sync Broadcast...");
      channel.current
        .send({ type: "broadcast", event: "sync" })
        .then((response) => {
          console.log("♻️ Broadcast sent: ", response);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [channel]);

  function triggerSync() {
    if (!isSyncing) {
      console.log("🔄 Syncing...");
      setIsSyncing(true);
      sync()
        .then(() => {
          sendSyncBroadcast();
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          setIsSyncing(false);
        });
    }
  }

  // listen to sync broadcasts
  useEffect(() => {
    if (!user) return;
    const syncChannel = supabase.channel(`sync-${user.id}`);

    const subscription = syncChannel
      .on("broadcast", { event: "sync" }, (payload) => {
        console.log("♻️ Received Broadcast: ", payload);
        triggerSync();
      })
      .subscribe((status) => {
        if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
          channel.current = subscription;
        }
      });
    return () => {
      subscription.unsubscribe();
      channel.current = null;
    };
  }, [user]);

  // listen to database changes and sync
  useEffect(() => {
    const subscription = database.withChangesForTables(["todos"]).subscribe({
      next: (changes) => {
        if (changes) {
          const unsynced = changes.filter(
            (c) => c.record.syncStatus !== "synced",
          );

          if (unsynced.length && changes.length) {
            console.log("🔔 Detected changes in database...");
          }

          if (unsynced.length) {
            triggerSync();
          }
        }
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [database]);

  // listen to app state (check if its in foreground)
  useEffect(() => {
    triggerSync();

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        triggerSync();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SyncContext.Provider
      value={{
        isSyncing,
        triggerSync,
        sendSyncBroadcast,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
}
