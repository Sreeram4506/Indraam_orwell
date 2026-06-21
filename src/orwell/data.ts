import { heroStats, philosophyPrinciples, projects, services, site } from '../data/content';

const dealerOs = projects[0];

export const LOADER_TITLE = 'WHERE BUSINESS MEETS AUTOMATION';
export const LOADER_NUMBERS = [0, 50, 85, 100] as const;

export const CORNERS = {
  topLeft: 'AI NEVER SLEEPS',
  topRight: 'SHIP OR SINK',
  bottomLeft: 'MANUAL IS COSTLY',
  bottomRight: 'SCALE IS SURVIVAL',
} as const;

export const S2_QUOTE = `"${philosophyPrinciples[0].description}"`;

export const S4_QUOTE =
  '"WHO CONTROLS THE DATA CONTROLS THE FUTURE. WHO CONTROLS THE STACK CONTROLS THE MARKET."';

export const NEWSPAPER = {
  masthead: `${site.name.toUpperCase()} DISPATCH — BUSINESS EDITION`,
  date: 'MONDAY, JUNE 14, 2026 — VOL. I NO. 001',
  edition: 'GROWTH EDITION — ALL METRICS VERIFIED BY INDRAAM STUDIO',
  headline: `${dealerOs.title.toUpperCase()}\nCASE STUDY DEPLOYED`,
  footer: `${site.name.toUpperCase()} STUDIO — ALL DELIVERABLES APPROVED AND SHIPPED`,
  photoSrc: dealerOs.video,
  photoAlt: dealerOs.title,
  photoCaption: `${dealerOs.title.toUpperCase()} — ${dealerOs.category}. AI DOCUMENT PARSING, LIVE INVENTORY, AUTOMATED REGISTRIES.`,
  lines: [
    { text: 'OUR CLIENTS HAVE ACHIEVED TOTAL DIGITAL VICTORY' },
    {
      text: '████████████████████████████',
      redacted: true,
      truth: 'MOST BUSINESSES STILL RUN ON SPREADSHEETS AND HOPE',
    },
    { text: 'PEACE HAS BEEN RESTORED ACROSS ALL OPERATIONS' },
    {
      text: '████████████████████████',
      redacted: true,
      truth: 'MANUAL WORKFLOWS STILL EAT 40+ HOURS EVERY WEEK',
    },
    { text: 'THE MARKET HAS SURRENDERED TO YOUR VELOCITY' },
    {
      text: '█████████████████████████████████',
      redacted: true,
      truth: 'COMPETITORS ARE ALREADY SHIPPING AI-POWERED PRODUCTS',
    },
    { text: 'TEAMS ARE ADVISED TO CELEBRATE THE LAUNCH' },
    {
      text: '████████████████████',
      redacted: true,
      truth: 'CELEBRATION IS OPTIONAL — SHIPPING IS MANDATORY',
    },
  ],
} as const;

export const S6_LEFT_TEXT = `${philosophyPrinciples.map((p) => `${p.title.toUpperCase()}: ${p.description}`).join(' ')} ${services
  .slice(0, 4)
  .map((s) => `${s.title.toUpperCase()} — ${s.description}`)
  .join(' ')} We build agentic AI, custom applications, and automations that remove busywork so your team focuses on revenue, not repetition. Every system we ship is designed to scale — clean architecture, reliable infrastructure, and interfaces people actually enjoy using. ${site.description} ${philosophyPrinciples[0].description} ${philosophyPrinciples[1].description}`;

export const S6_RIGHT_TEXT = `${services
  .slice(4)
  .map((s) => `${s.title.toUpperCase()} — ${s.description}`)
  .join(' ')} Manual processes are a tax on growth. Every hour spent copying data between tools is an hour not spent closing deals, serving customers, or building what matters. We connect your CRM, dashboards, mobile apps, and cloud stack into one coherent machine that runs ${heroStats[2].label.toLowerCase()}. ${heroStats[0].value} projects shipped. ${heroStats[1].value} less manual grunt work. We turn "someday" into shipped yesterday — with AI automation, cinematic web experiences, and branding that makes people stop scrolling. ${site.tagline}.`;

export const S7_EXPERTISE_LABEL = 'EXPERTISE';

export const S7_EXPERTISE = services.map((service, index) => ({
  num: String(index + 1).padStart(2, '0'),
  title: service.title,
}));

export const S7_COUNT = S7_EXPERTISE.length;

export const S7_MATH = '1 + 1 = 10X';

export const S6_THOUGHTCRIME = {
  title: 'OPPORTUNITY DETECTED',
  subtitle: 'YOUR GROWTH SESSION HAS BEEN LOGGED',
} as const;

export const S8_QUOTE_LINES = [
  '"WE BUILD THE THINGS',
  'THAT MAKE BUSINESSES',
  'IMPOSSIBLE',
  'TO IGNORE."',
] as const;

export const S8_AUTHOR = `— ${site.name}, Digital Studio`;
export const S8_CREDIT = `PRESENTED BY ${site.name.toUpperCase()}`;
export const S8_URL = 'indraam.com';

export const CURSOR_WORDS = ['AUTOMATE', 'SCALE'] as const;

export const HERO_FLOATING_CHARS = ['2', '0', '2', '6'] as const;

export const HERO_BRAND = {
  name: site.name.toUpperCase(),
  tagline: 'WHERE BUSINESS MEETS AUTOMATIONS',
} as const;

export const CONTACT = {
  masthead: 'INDRAAM STUDIO — SECURE TRANSMISSION CHANNEL',
  kicker: 'TRANSMISSION OPEN',
  headline: 'INITIATE CONTACT',
  subhead: "Tell us what you're building. We'll reply with a clear path forward — no sales theater.",
  email: 'hello@indraam.com',
  phone: '+1 (203) 640-2437',
  phoneHref: 'tel:+12036402437',
  scheduleLabel: 'SCHEDULE A CALL',
  scheduleHref: 'https://cal.com',
  submitLabel: 'SEND TRANSMISSION',
  successLabel: 'TRANSMISSION SENT',
  footerCredit: `© ${new Date().getFullYear()} ${site.name.toUpperCase()} — WHERE BUSINESS MEETS AUTOMATION`,
  footerUrl: 'indraam.com',
} as const;
