import type { Metadata } from "next";
import { PULSE_EVENTS } from "@/lib/pulse";

export const metadata: Metadata = { title: "Privacy · QueueCare" };

/** What QueueCare counts about its own use, in plain words. Public: no sign-in needed. */
export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-2xl py-10">
      <h1 className="text-[40px] leading-tight text-primary">Privacy</h1>
      <p className="mt-3 text-muted-foreground">
        Patients never sign in. A patient&apos;s status page shows a token number and their place in the queue, and never a name.
      </p>

      <h2 className="mt-8 text-[24px] text-primary">How we measure use</h2>
      <p className="mt-2 text-muted-foreground">
        QueueCare counts how the app is used so it can be improved. It does this with PulseMetrics, a small analytics tool built to know nothing about people. It
        counts only these things:
      </p>
      <ul className="mt-3 list-disc space-y-1 pl-6 text-muted-foreground">
        <li>a patient opened their status page ({PULSE_EVENTS[0]})</li>
        <li>a patient was told they can step out ({PULSE_EVENTS[1]})</li>
        <li>a patient&apos;s page said &ldquo;Please go in now&rdquo; ({PULSE_EVENTS[2]})</li>
        <li>reception issued a token ({PULSE_EVENTS[3]})</li>
      </ul>

      <h2 className="mt-8 text-[24px] text-primary">What is never sent</h2>
      <p className="mt-2 text-muted-foreground">
        Only the name of the event and a random id that stays in the browser. Never the page address (a patient&apos;s link is private), never a name, a phone
        number, an email or any health detail, and never an IP address. A browser that has Do Not Track switched on is not counted at all.
      </p>
      <p className="mt-6 text-sm text-muted-foreground">
        Read the full detail in PulseMetrics&apos; own privacy page. Last updated 21 October 2026.
      </p>
    </section>
  );
}
