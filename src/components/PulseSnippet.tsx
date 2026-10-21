// The PulseMetrics snippet. It is only added when all three settings exist, so a copy of QueueCare without them
// (a developer's laptop, a test run) sends nothing at all.
//   NEXT_PUBLIC_PULSE_KEY  the site key from the PulseMetrics dashboard
//   NEXT_PUBLIC_PULSE_SRC  the address of the snippet file (the dashboard's /p.js)
//   NEXT_PUBLIC_PULSE_API  the address of the PulseMetrics API
export function PulseSnippet() {
  const key = process.env.NEXT_PUBLIC_PULSE_KEY;
  const src = process.env.NEXT_PUBLIC_PULSE_SRC;
  const api = process.env.NEXT_PUBLIC_PULSE_API;
  if (!key || !src || !api) return null;
  return <script async src={src} data-key={key} data-api={api} />;
}
