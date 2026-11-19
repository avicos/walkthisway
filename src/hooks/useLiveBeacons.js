import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function useLiveBeacons(
  enabled = true,
  channelName = "walk-this-way-live"
) {
  const [beacons, setBeacons] = useState({});

  useEffect(() => {
    if (!enabled) {
      setBeacons({});
      return;
    }

    const channel = supabase.channel(channelName);

    channel
      .on("broadcast", { event: "location" }, ({ payload }) => {
        console.log("Received beacon:", payload);

        setBeacons((previous) => ({
          ...previous,
          [payload.deviceId]: payload,
        }));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled, channelName]);

  return beacons;
}