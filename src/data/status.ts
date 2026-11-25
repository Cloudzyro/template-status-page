// Everything on the status page comes from this file.
// Add an incident to `incidents`, set `updatedAt`, rebuild, and the bars,
// uptime figures, banner and history update themselves.
// All times are UTC, written as ISO strings.

export const site = {
  name: "Parcelwise",
  title: "Parcelwise status",
  description: "Live status of the Parcelwise shipping API, dashboard and carrier connections, with incident history and scheduled maintenance.",
  productUrl: "https://parcelwise.example.com",
  supportUrl: "https://parcelwise.example.com/support",
  email: "status@parcelwise.example.com",
  // The moment this data describes. The 90-day bars end on this day.
  updatedAt: "2026-11-24T16:20:00Z",
  days: 90,
};

export type ComponentId =
  | "labels"
  | "rates"
  | "tracking"
  | "webhooks"
  | "dashboard"
  | "signin"
  | "ground"
  | "express"
  | "freight";

export const groups: { name: string; components: { id: ComponentId; name: string; description: string }[] }[] = [
  {
    name: "API",
    components: [
      { id: "labels", name: "Label API", description: "Creating and voiding shipping labels" },
      { id: "rates", name: "Rates API", description: "Quotes across carriers and service levels" },
      { id: "tracking", name: "Tracking API", description: "Tracking events and delivery estimates" },
      { id: "webhooks", name: "Webhooks", description: "Event delivery to your endpoints" },
    ],
  },
  {
    name: "Dashboard",
    components: [
      { id: "dashboard", name: "Web dashboard", description: "Shipments, reports and settings" },
      { id: "signin", name: "Sign-in and SSO", description: "Email, Google and SAML sign-in" },
    ],
  },
  {
    name: "Carrier connections",
    components: [
      { id: "ground", name: "Ground network", description: "Ground and economy services" },
      { id: "express", name: "Express network", description: "Overnight and two-day services" },
      { id: "freight", name: "Freight partners", description: "LTL and pallet bookings" },
    ],
  },
];

export type Impact = "minor" | "major" | "maintenance";
export type Phase = "investigating" | "identified" | "monitoring" | "resolved" | "scheduled" | "in progress" | "completed";

export type Incident = {
  id: string;
  title: string;
  impact: Impact;
  components: ComponentId[];
  startedAt: string;
  // Leave out while the incident is still open.
  resolvedAt?: string;
  updates: { at: string; phase: Phase; text: string }[];
};

// Newest first is easiest to edit, but any order works.
export const incidents: Incident[] = [
  {
    id: "2026-11-24-express-tracking-delays",
    title: "Delayed tracking events for Express shipments",
    impact: "minor",
    components: ["tracking", "express"],
    startedAt: "2026-11-24T13:05:00Z",
    updates: [
      {
        at: "2026-11-24T15:40:00Z",
        phase: "monitoring",
        text: "The Express network is sending events again and the backlog is draining. Events are arriving about 12 minutes late and catching up. We'll post again once they're on time.",
      },
      {
        at: "2026-11-24T14:10:00Z",
        phase: "identified",
        text: "The Express network's event feed is returning errors after a change on their side. We're retrying with backoff, and no events have been lost; they'll be delivered once the feed recovers.",
      },
      {
        at: "2026-11-24T13:20:00Z",
        phase: "investigating",
        text: "Tracking events for Express shipments are arriving late, by up to 45 minutes. Labels, rates and other networks are not affected.",
      },
    ],
  },
  {
    id: "2026-11-12-dashboard-reports",
    title: "Shipment reports failing to load",
    impact: "minor",
    components: ["dashboard"],
    startedAt: "2026-11-12T09:14:00Z",
    resolvedAt: "2026-11-12T10:02:00Z",
    updates: [
      {
        at: "2026-11-12T10:02:00Z",
        phase: "resolved",
        text: "Reports load normally again. A slow query added in this morning's release was rolled back.",
      },
      {
        at: "2026-11-12T09:31:00Z",
        phase: "identified",
        text: "Reports covering more than 30 days time out. We've found the cause and are rolling back the change.",
      },
      { at: "2026-11-12T09:18:00Z", phase: "investigating", text: "Some customers can't open shipment reports in the dashboard." },
    ],
  },
  {
    id: "2026-11-03-label-api-errors",
    title: "Elevated errors creating labels",
    impact: "major",
    components: ["labels", "rates"],
    startedAt: "2026-11-03T17:42:00Z",
    resolvedAt: "2026-11-03T18:19:00Z",
    updates: [
      {
        at: "2026-11-03T18:19:00Z",
        phase: "resolved",
        text: "Error rates are back to normal. A database failover took longer than expected; we're adding a check so the next one switches within a minute. A full write-up will follow within five working days.",
      },
      {
        at: "2026-11-03T17:58:00Z",
        phase: "identified",
        text: "The primary database for labels and rates failed over to its standby. Requests are recovering as connections move across.",
      },
      {
        at: "2026-11-03T17:46:00Z",
        phase: "investigating",
        text: "About 40% of label and rate requests are failing with 503 errors. Retrying requests is safe.",
      },
    ],
  },
  {
    id: "2026-10-22-webhook-delays",
    title: "Webhook deliveries delayed",
    impact: "minor",
    components: ["webhooks"],
    startedAt: "2026-10-22T02:10:00Z",
    resolvedAt: "2026-10-22T03:25:00Z",
    updates: [
      {
        at: "2026-10-22T03:25:00Z",
        phase: "resolved",
        text: "All delayed webhooks have been delivered. One delivery worker stopped picking up jobs and wasn't replaced automatically; it now is.",
      },
      { at: "2026-10-22T02:24:00Z", phase: "investigating", text: "Webhooks are being delivered up to 30 minutes late." },
    ],
  },
  {
    id: "2026-10-18-maintenance-database",
    title: "Database upgrade",
    impact: "maintenance",
    components: ["labels", "rates", "tracking"],
    startedAt: "2026-10-18T06:00:00Z",
    resolvedAt: "2026-10-18T06:40:00Z",
    updates: [
      { at: "2026-10-18T06:40:00Z", phase: "completed", text: "The upgrade is done. Everything is running on the new database version." },
      { at: "2026-10-18T06:00:00Z", phase: "in progress", text: "Maintenance has started. Expect a few seconds of errors during the switch." },
      { at: "2026-10-11T12:00:00Z", phase: "scheduled", text: "We'll upgrade the main database on October 18 between 06:00 and 07:00 UTC." },
    ],
  },
  {
    id: "2026-10-07-sso-errors",
    title: "SAML sign-in failing for some workspaces",
    impact: "major",
    components: ["signin"],
    startedAt: "2026-10-07T14:02:00Z",
    resolvedAt: "2026-10-07T14:51:00Z",
    updates: [
      {
        at: "2026-10-07T14:51:00Z",
        phase: "resolved",
        text: "SAML sign-in works again. An expired signing certificate on our side caused it; we now alert 30 days before any certificate expires.",
      },
      {
        at: "2026-10-07T14:15:00Z",
        phase: "investigating",
        text: "Workspaces using SAML single sign-on can't sign in. Email and Google sign-in work.",
      },
    ],
  },
  {
    id: "2026-09-26-freight-quotes",
    title: "Freight quotes unavailable from one partner",
    impact: "minor",
    components: ["freight", "rates"],
    startedAt: "2026-09-26T19:30:00Z",
    resolvedAt: "2026-09-27T01:10:00Z",
    updates: [
      {
        at: "2026-09-27T01:10:00Z",
        phase: "resolved",
        text: "The partner's quoting service is back and freight quotes include them again.",
      },
      {
        at: "2026-09-26T19:45:00Z",
        phase: "identified",
        text: "One freight partner's quoting service is down. Quotes from other partners are returned as normal.",
      },
    ],
  },
  {
    id: "2026-09-09-tracking-outage",
    title: "Tracking API unavailable",
    impact: "major",
    components: ["tracking"],
    startedAt: "2026-09-09T11:20:00Z",
    resolvedAt: "2026-09-09T11:48:00Z",
    updates: [
      {
        at: "2026-09-09T11:48:00Z",
        phase: "resolved",
        text: "The Tracking API is answering normally. A configuration change sent traffic to servers that were being retired; it has been reverted.",
      },
      { at: "2026-09-09T11:24:00Z", phase: "investigating", text: "Requests to the Tracking API are failing." },
    ],
  },
  {
    id: "2026-09-02-ground-delays",
    title: "Slow label creation for Ground services",
    impact: "minor",
    components: ["ground", "labels"],
    startedAt: "2026-09-02T15:00:00Z",
    resolvedAt: "2026-09-02T16:30:00Z",
    updates: [
      { at: "2026-09-02T16:30:00Z", phase: "resolved", text: "Ground labels are created in normal time again." },
      {
        at: "2026-09-02T15:12:00Z",
        phase: "investigating",
        text: "Ground labels take up to 20 seconds to create. Other services are not affected.",
      },
    ],
  },
];

// Planned work that hasn't happened yet.
export const maintenance: Incident[] = [
  {
    id: "2026-11-29-network-maintenance",
    title: "Network maintenance in the US East region",
    impact: "maintenance",
    components: ["webhooks", "dashboard"],
    startedAt: "2026-11-29T07:00:00Z",
    resolvedAt: "2026-11-29T08:00:00Z",
    updates: [
      {
        at: "2026-11-22T10:00:00Z",
        phase: "scheduled",
        text: "We're replacing network switches in US East. Webhooks may be delayed by a few minutes and the dashboard may be slow to load. The API isn't affected.",
      },
    ],
  },
];

export const subscribe = {
  title: "Get notified",
  text: "We email you when an incident starts, when it changes and when it's resolved, plus a notice before planned maintenance.",
  done: "You're subscribed. We'll only email about incidents and maintenance.",
};
