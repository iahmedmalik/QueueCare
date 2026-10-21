"use client";

import { useEffect } from "react";
import { track, type PulseEventName } from "@/lib/pulse";

/** Sends one usage event when it first appears on the page, and renders nothing. */
export function PulseEvent({ name }: { name: PulseEventName }) {
  useEffect(() => {
    track(name);
  }, [name]);
  return null;
}
