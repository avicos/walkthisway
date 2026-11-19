import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function useLiveLocation(
  enabled = false,
  channelName = "walk-this-way-live",
) {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const DEVICE_ID =
    localStorage.getItem("walk-this-way-device-id") || crypto.randomUUID();

  localStorage.setItem("walk-this-way-device-id", DEVICE_ID);

  useEffect(() => {
    if (!enabled) {
      setLocation(null);
      return;
    }

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    let watchId = null;
    let channel = null;
    let lastSent = 0;

    const start = async () => {
      channel = supabase.channel(channelName);

      const status = await new Promise((resolve) => {
        channel.subscribe((status) => {
          resolve(status);
        });
      });

      if (status !== "SUBSCRIBED") {
        setError(`Could not connect to Supabase: ${status}`);
        return;
      }

      watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const newLocation = {
            deviceId: DEVICE_ID,
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };

          setLocation(newLocation);
          setError(null);

          // Don't send GPS updates more often than every 3 seconds.
          const now = Date.now();

          if (now - lastSent < 3000) {
            return;
          }

          lastSent = now;

          const result = await channel.send({
            type: "broadcast",
            event: "location",
            payload: newLocation,
          });

          if (result !== "ok") {
            console.error("Location broadcast failed:", result);
          }
        },
        (err) => {
          setError(err.message);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 2000,
          timeout: 10000,
        },
      );
    };

    start();

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }

      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [enabled, channelName]);

  return {
    location,
    error,
  };
}
