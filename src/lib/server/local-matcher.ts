import 'server-only';
import { type CachedKnowledgeRecord } from './knowledge-cache';
import { getFixedCopy, type Source } from '@/lib/chat-contract';

export function normalizeQuery(text: string): string {
  return text
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[?!.,;:"`~@#$%^&*()_+=/\\|<>\[\]{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const GREETINGS_PATTERNS = [
  // English greetings & courtesies
  /^hello(\s+(there|fauzi|assistant|bot))?$/,
  /^hi(\s+(there|fauzi|assistant|bot))?$/,
  /^hey(\s+(there|fauzi|assistant|bot))?$/,
  /^good\s+(morning|afternoon|evening|day|night)$/,
  /^greetings$/,
  /^howdy$/,
  /^(thank\s+you|thanks|thx|ty)(\s+(very\s+much|a\s+lot|fauzi))?$/,
  /^(bye|goodbye|see\s+you|cya)$/,

  // Indonesian greetings & courtesies
  /^halo(\s+(fauzi|asisten|bot|kak|mas))?$/,
  /^hai(\s+(fauzi|asisten|bot|kak|mas))?$/,
  /^hei(\s+(fauzi|asisten|bot|kak|mas))?$/,
  /^selamat\s+(pagi|siang|sore|malam|datang)$/,
  /^(terima\s+kasih|makasih|matur\s+nuwun|terimakasih|makasi)(\s+(banyak|fauzi|mas))?$/,
  /^(sampai\s+jumpa|dadah|bye)$/,
];

/**
 * Tier 0: Instant Greeting and Thanks Fast Path (Item 15 / CR-014).
 * Returns a friendly fixed reply in the visitor's language with a pointer to what can be asked.
 * Zero AI calls, zero failure possible, instant HTTP 200.
 */
export function matchGreetingOrThanks(
  message: string,
  language: 'en' | 'id' = 'en',
): { matched: true; status: 'greeting'; answer: string } | { matched: false } {
  const normalized = normalizeQuery(message);
  if (!normalized) return { matched: false };

  const isMatch = GREETINGS_PATTERNS.some((pattern) => pattern.test(normalized));
  if (isMatch) {
    return {
      matched: true,
      status: 'greeting',
      answer: getFixedCopy('greeting', language),
    };
  }

  return { matched: false };
}

export interface StarterMatchResult {
  matched: true;
  status: 'ok';
  answer: string;
  sources: Source[];
}

interface StarterIntentDefinition {
  patterns: RegExp[];
  recordIds: string[];
  compose: (records: CachedKnowledgeRecord[], lang: 'en' | 'id') => string;
}

const STARTER_INTENTS: StarterIntentDefinition[] = [
  // 1. Profile / Professional Background
  {
    patterns: [
      /^(what\s+is\s+)?fauzi('?s)?\s+professional\s+background$/,
      /^apa\s+latar\s+belakang\s+profesional\s+fauzi$/,
      /^tell\s+me\s+about\s+fauzi('?s)?\s+background$/,
      /^ceritakan\s+tentang\s+profil\s+fauzi$/,
    ],
    recordIds: ['profile:main', 'education:amikom', 'education:smk'],
    compose: (recs, lang) => {
      const isId = lang === 'id';
      const p = recs.find((r) => r.id === 'profile:main');
      const amikom = recs.find((r) => r.id === 'education:amikom');
      const smk = recs.find((r) => r.id === 'education:smk');

      if (isId) {
        return [
          p?.bodyId || p?.body || '',
          amikom ? `Pendidikan: ${amikom.bodyId || amikom.body}` : '',
          smk ? `Pendidikan Vokasi: ${smk.bodyId || smk.body}` : '',
        ]
          .filter(Boolean)
          .join('\n\n');
      }

      return [
        p?.body || '',
        amikom ? `Education: ${amikom.body}` : '',
        smk ? `Vocational Education: ${smk.body}` : '',
      ]
        .filter(Boolean)
        .join('\n\n');
    },
  },

  // 2. Core Technical Skills
  {
    patterns: [
      /^(what\s+are\s+)?fauzi('?s)?\s+core\s+technical\s+skills$/,
      /^what\s+(technical\s+)?skills\s+and\s+(tools|technologies)\s+does\s+(fauzi|he)\s+use$/,
      /^keahlian\s+teknis\s+dan\s+perangkat\s+apa\s+yang\s+dikuasai\s+fauzi$/,
      /^apa\s+(saja\s+)?keahlian\s+dan\s+teknologi\s+yang\s+dikuasai(nya|\s+fauzi)$/,
      /^apa\s+saja\s+keahlian\s+teknis\s+utama\s+fauzi$/,
      /^what\s+are\s+his\s+skills$/,
    ],
    recordIds: [
      'skill:networking',
      'skill:languages',
      'skill:frontend',
      'skill:backend-api',
      'skill:database-caching',
      'skill:devops-tools',
    ],
    compose: (recs, lang) => {
      const isId = lang === 'id';
      const net = recs.find((r) => r.id === 'skill:networking');
      const langSkill = recs.find((r) => r.id === 'skill:languages');
      const fe = recs.find((r) => r.id === 'skill:frontend');
      const be = recs.find((r) => r.id === 'skill:backend-api');
      const db = recs.find((r) => r.id === 'skill:database-caching');
      const devops = recs.find((r) => r.id === 'skill:devops-tools');

      const lines = [
        isId
          ? 'Fauzi Budikusuma menguasai 35 keahlian teknis terverifikasi dalam rekayasa perangkat lunak dan infrastruktur jaringan:'
          : "Fauzi Budikusuma possesses 35 verified technical competencies across software engineering and network infrastructure:",
        net ? `• ${isId ? net.titleId : net.title}: ${isId ? net.bodyId : net.body}` : '',
        langSkill ? `• ${isId ? langSkill.titleId : langSkill.title}: ${isId ? langSkill.bodyId : langSkill.body}` : '',
        be ? `• ${isId ? be.titleId : be.title}: ${isId ? be.bodyId : be.body}` : '',
        fe ? `• ${isId ? fe.titleId : fe.title}: ${isId ? fe.bodyId : fe.body}` : '',
        db ? `• ${isId ? db.titleId : db.title}: ${isId ? db.bodyId : db.body}` : '',
        devops ? `• ${isId ? devops.titleId : devops.title}: ${isId ? devops.bodyId : devops.body}` : '',
      ];

      return lines.filter(Boolean).join('\n');
    },
  },

  // 3. Featured / Selected Projects
  {
    patterns: [
      /^(tell\s+me\s+about\s+)?fauzi('?s)?\s+(featured|selected)\s+projects$/,
      /^ceritakan\s+proyek\s+(unggulan|pilihan)\s+(yang\s+dibangun\s+)?fauzi$/,
      /^what\s+projects\s+has\s+(fauzi|he)\s+built$/,
      /^apa\s+saja\s+proyek\s+(fauzi|yang\s+pernah\s+dibuat(nya|\s+fauzi))$/,
    ],
    recordIds: [
      'project:network-monitoring-dashboard',
      'project:stacklab',
      'project:sentinel',
      'project:research-news-intelligence-center',
      'project:enterprise-network-lab',
      'project:datacenter-simulation',
    ],
    compose: (recs, lang) => {
      const isId = lang === 'id';
      const intro = isId
        ? 'Berikut adalah 6 proyek unggulan terverifikasi yang dibangun oleh Fauzi Budikusuma:'
        : "Here are the 6 verified featured projects engineered by Fauzi Budikusuma:";

      const projectLines = recs
        .filter((r) => r.category === 'PROJECT')
        .map((p) => `• ${p.title}: ${isId ? p.bodyId : p.body}`);

      return [intro, ...projectLines].join('\n\n');
    },
  },

  // 4. Certifications and Internship Experience
  {
    patterns: [
      /^what\s+certifications\s+does\s+fauzi\s+hold$/,
      /^what\s+certifications\s+and\s+(internship\s+)?experience\s+does\s+(fauzi|he)\s+have$/,
      /^sertifikasi\s+dan\s+pengalaman\s+magang\s+apa\s+yang\s+dimiliki\s+fauzi$/,
      /^apa\s+(saja\s+)?sertifikasi\s+dan\s+pengalaman\s+yang\s+dimiliki(nya|\s+fauzi)$/,
      /^apa\s+saja\s+sertifikasi\s+yang\s+dimiliki\s+fauzi$/,
    ],
    recordIds: [
      'experience:kominfo',
      'certification:mtcna',
      'certification:google-cybersecurity',
      'certification:google-ai',
      'certification:uji-kompetensi-1',
      'certification:nilai-pkl-1',
    ],
    compose: (recs, lang) => {
      const isId = lang === 'id';
      const exp = recs.find((r) => r.id === 'experience:kominfo');
      const certs = recs.filter((r) => r.category === 'CERTIFICATION');

      const intro = isId
        ? 'Fauzi Budikusuma memiliki pengalaman magang resmi di instansi pemerintahan serta 7 kredensial terverifikasi:'
        : "Fauzi Budikusuma possesses verified public-sector internship experience and 7 verified technical credentials:";

      const expLine = exp
        ? `${isId ? 'Pengalaman Magang' : 'Internship Experience'}: ${isId ? exp.bodyId : exp.body}`
        : '';

      const certLines = certs.map((c) => `• ${c.title}: ${isId ? c.bodyId : c.body}`);

      return [intro, expLine, ...certLines].filter(Boolean).join('\n\n');
    },
  },

  // 5. Contact Channels
  {
    patterns: [
      /^how\s+can\s+i\s+contact\s+fauzi(\s+directly)?$/,
      /^bagaimana\s+cara\s+menghubungi\s+fauzi(\s+secara\s+langsung)?$/,
      /^contact\s+fauzi$/,
      /^kontak\s+fauzi$/,
    ],
    recordIds: [
      'contact:email',
      'contact:linkedin',
      'contact:github',
      'contact:instagram',
      'contact:credly',
    ],
    compose: (recs, lang) => {
      const isId = lang === 'id';
      const intro = isId
        ? 'Anda dapat menghubungi Fauzi Budikusuma secara langsung melalui saluran komunikasi resmi berikut:'
        : "You can contact Fauzi Budikusuma directly through his approved verified communication channels:";

      const contactLines = recs
        .filter((r) => r.category === 'CONTACT')
        .map((c) => `• ${isId ? c.titleId : c.title}: ${isId ? c.bodyId : c.body}`);

      return [intro, ...contactLines].join('\n\n');
    },
  },
];

/**
 * Tier 0: Starter-Chip Matcher (Item 16 / CR-014).
 * Returns deterministically composed answers for the 5 starter questions.
 * Zero AI calls, zero failure possible, instant HTTP 200.
 */
export function matchStarterChip(
  message: string,
  language: 'en' | 'id',
  records: CachedKnowledgeRecord[],
): StarterMatchResult | { matched: false } {
  const normalized = normalizeQuery(message);
  if (!normalized) return { matched: false };

  for (const intent of STARTER_INTENTS) {
    const isMatch = intent.patterns.some((pattern) => pattern.test(normalized));
    if (isMatch) {
      const matchingRecords = records.filter((r) => intent.recordIds.includes(r.id));
      const answer = intent.compose(matchingRecords, language);
      const sources: Source[] = matchingRecords.slice(0, 6).map((r) => ({
        slug: r.id,
        title: language === 'id' ? (r.titleId || r.title) : r.title,
        category: r.category,
      }));

      return {
        matched: true,
        status: 'ok',
        answer,
        sources,
      };
    }
  }

  return { matched: false };
}
