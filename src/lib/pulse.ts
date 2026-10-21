// Usage measurement with PulseMetrics. It counts that something happened, never who or where.
//
// Rule (PulseMetrics P-1): an event is a fixed name chosen here, in code, from this list, and nothing else.
// No page address (the patient's link is a private token), no name, no health detail is ever passed in.
// The names are lowercase words joined by underscores, as PulseMetrics requires.

export const PULSE_EVENTS = [
  "status_viewed", // a patient opened their status page
  "step_out_advice_seen", // a patient was told they can step out
  "called_in", // a patient's page said "Please go in now"
  "patient_registered", // reception issued a token
] as const;

export type PulseEventName = (typeof PULSE_EVENTS)[number];

type Pulse = { track?: (name: string) => void };

/** Sends one event, if PulseMetrics is installed. It never throws and never changes what the page does. */
export function track(name: PulseEventName): void {
  try {
    (globalThis as { pulse?: Pulse }).pulse?.track?.(name);
  } catch {
    // measuring must never break the app
  }
}
