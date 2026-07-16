"use client";

import { useEffect } from "react";
import { createClient } from "./client";

export function useRealtimeSubscription(
  channelName: string, 
  eventName: string, 
  callback: (payload: any) => void
) {
  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      return;
    }

    const channel = supabase
      .channel(channelName)
      .on("broadcast", { event: eventName }, (response) => {
        callback(response.payload);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelName, eventName, callback]);
}
