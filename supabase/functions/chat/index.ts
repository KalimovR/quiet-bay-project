import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DAILY_LIMIT_MINUTES = 35;
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 15;
const MIN_REQUEST_INTERVAL_MS = 1500;
const MIN_MESSAGE_LENGTH = 2;

// In-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number; lastRequest: number }>();

function checkRateLimit(ipAddress: string): { allowed: boolean; retryAfter?: number; reason?: string } {
  const now = Date.now();
  const record = rateLimitMap.get(ipAddress);

  if (!record) {
    rateLimitMap.set(ipAddress, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
      lastRequest: now,
    });
    return { allowed: true };
  }

  if (now > record.resetTime) {
    rateLimitMap.set(ipAddress, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
      lastRequest: now,
    });
    return { allowed: true };
  }

  const timeSinceLastRequest = now - record.lastRequest;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL_MS) {
    const retryAfter = Math.ceil((MIN_REQUEST_INTERVAL_MS - timeSinceLastRequest) / 1000);
    console.log(`Rate limit: IP ${ipAddress} - too fast, retry after ${retryAfter}s`);
    return { 
      allowed: false, 
      retryAfter,
      reason: `Пожалуйста, подождите ${retryAfter} сек. между сообщениями.`
    };
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    console.log(`Rate limit: IP ${ipAddress} - exceeded limit, retry after ${retryAfter}s`);
    return { 
      allowed: false, 
      retryAfter,
      reason: `Превышен лимит сообщений. Подождите ${retryAfter} сек.`
    };
  }

  record.count++;
  record.lastRequest = now;
  rateLimitMap.set(ipAddress, record);

  console.log(`Rate limit: IP ${ipAddress} - ${record.count}/${MAX_REQUESTS_PER_WINDOW} requests`);
  return { allowed: true };
}

// ===== CRISIS DETECTION =====
interface CrisisDetection {
  isCrisis: boolean;
  type: 'suicidal' | 'self_harm' | 'severe_distress' | null;
  severity: number; // 1-10
  keywords: string[];
}

const CRISIS_KEYWORDS = {
  suicidal: [
    'суицид', 'покончить с собой', 'не хочу жить', 'хочу умереть', 
    'лучше бы меня не было', 'уйти из жизни', 'конец всему',
    'никто не заметит если меня не будет', 'прощальное письмо',
    'способ уйти', 'как покончить', 'устал жить', 'зачем жить',
    'нет смысла жить', 'хочу исчезнуть навсегда'
  ],
  self_harm: [
    'порезы', 'резать себя', 'причинить себе боль', 'самоповреждение',
    'бить себя', 'наказать себя', 'сделать себе больно'
  ],
  severe_distress: [
    'не могу больше', 'сил нет совсем', 'невыносимо', 'схожу с ума',
    'всё рушится', 'конец', 'безнадёжно', 'никакого выхода'
  ]
};

function detectCrisis(message: string): CrisisDetection {
  const text = message.toLowerCase();
  const foundKeywords: string[] = [];
  let type: CrisisDetection['type'] = null;
  let maxSeverity = 0;

  // Check suicidal (highest priority, severity 10)
  for (const keyword of CRISIS_KEYWORDS.suicidal) {
    if (text.includes(keyword)) {
      foundKeywords.push(keyword);
      type = 'suicidal';
      maxSeverity = 10;
    }
  }

  // Check self-harm (severity 8)
  if (!type) {
    for (const keyword of CRISIS_KEYWORDS.self_harm) {
      if (text.includes(keyword)) {
        foundKeywords.push(keyword);
        type = 'self_harm';
        maxSeverity = 8;
      }
    }
  }

  // Check severe distress (severity 6)
  if (!type) {
    for (const keyword of CRISIS_KEYWORDS.severe_distress) {
      if (text.includes(keyword)) {
        foundKeywords.push(keyword);
        type = 'severe_distress';
        maxSeverity = Math.max(maxSeverity, 6);
      }
    }
  }

  return {
    isCrisis: type !== null,
    type,
    severity: maxSeverity,
    keywords: foundKeywords
  };
}

// ===== WAR EXPERIENCE / PTSD DETECTION =====
const WAR_EXPERIENCE_MARKERS = [
  "война", "сво", "фронт", "обстрел", "окоп", "приказ", "контракт",
  "погиб", "потери", "вернулся", "там", "после этого", "ранен",
  "не как раньше", "убивал", "видел смерть", "боевые", "служил",
  "армия", "часть", "командир", "бой", "зона", "операция",
  "ротация", "дембель", "контузия", "осколок", "взрыв"
];

const PTSD_SYMPTOM_MARKERS = [
  "не сплю", "кошмары", "вспышки", "флешбеки",
  "раздражает", "бесит", "срываюсь",
  "пусто", "ничего не чувствую", "онемел",
  "не могу расслабиться", "постоянно настороже",
  "всё надо контролировать", "оглядываюсь",
  "не могу забыть", "стоит перед глазами",
  "звуки напоминают", "запах", "триггер"
];

const AVOIDANCE_MARKERS = [
  "не хочу говорить", "не спрашивай", "это неважно",
  "не лезь", "забей", "хватит об этом", "закрыта тема",
  "не вспоминай", "не надо", "отстань"
];

const AGGRESSION_MARKERS = [
  "бесит", "хочу ударить", "злость", "ненавижу",
  "готов убить", "достали", "взорваться", "терплю"
];

interface WarPtsdDetection {
  profile: 'civilian' | 'war_experienced' | 'ptsd_risk' | 'high_risk';
  score: number;
  warMentions: number;
  ptsdMentions: number;
  avoidance: number;
  aggression: number;
  detectedMarkers: string[];
}

function countMatches(text: string, markers: string[]): { count: number; matched: string[] } {
  const matched: string[] = [];
  let count = 0;
  for (const marker of markers) {
    if (text.includes(marker)) {
      count++;
      matched.push(marker);
    }
  }
  return { count, matched };
}

function detectWarPtsd(message: string, conversationHistory: string[] = []): WarPtsdDetection {
  const text = message.toLowerCase();
  const allText = [...conversationHistory.map(m => m.toLowerCase()), text].join(' ');
  
  const warResult = countMatches(allText, WAR_EXPERIENCE_MARKERS);
  const ptsdResult = countMatches(allText, PTSD_SYMPTOM_MARKERS);
  const avoidanceResult = countMatches(allText, AVOIDANCE_MARKERS);
  const aggressionResult = countMatches(allText, AGGRESSION_MARKERS);
  
  const allMarkers = [
    ...warResult.matched,
    ...ptsdResult.matched,
    ...avoidanceResult.matched,
    ...aggressionResult.matched
  ];
  
  // Calculate score
  let score = 0;
  score += warResult.count * 3;
  score += ptsdResult.count * 2;
  score += avoidanceResult.count * 1.5;
  score += aggressionResult.count * 2;
  
  // Style markers
  const messageLength = text.length;
  if (messageLength < 40 && messageLength > 0) score += 1; // Short answers
  
  // Emotional flatness detection
  const emotionalWords = ['чувствую', 'эмоции', 'радость', 'счастье', 'люблю'];
  const hasEmotionalWords = emotionalWords.some(w => text.includes(w));
  if (!hasEmotionalWords && messageLength > 20) score += 0.5;
  
  // Classify profile
  let profile: WarPtsdDetection['profile'];
  if (score >= 9) {
    profile = 'high_risk';
  } else if (score >= 6) {
    profile = 'ptsd_risk';
  } else if (score >= 3) {
    profile = 'war_experienced';
  } else {
    profile = 'civilian';
  }
  
  return {
    profile,
    score,
    warMentions: warResult.count,
    ptsdMentions: ptsdResult.count,
    avoidance: avoidanceResult.count,
    aggression: aggressionResult.count,
    detectedMarkers: allMarkers
  };
}

// ===== WAR/PTSD CONVERSATION STRATEGIES =====
type ConversationStrategy = 
  | 'STANDARD_SUPPORT'
  | 'RESPECTFUL_NEUTRAL_SUPPORT'
  | 'GROUNDING_AND_STABILITY'
  | 'CRISIS_SAFE_MODE';

function selectConversationStrategy(profile: WarPtsdDetection['profile']): ConversationStrategy {
  switch (profile) {
    case 'war_experienced':
      return 'RESPECTFUL_NEUTRAL_SUPPORT';
    case 'ptsd_risk':
      return 'GROUNDING_AND_STABILITY';
    case 'high_risk':
      return 'CRISIS_SAFE_MODE';
    default:
      return 'STANDARD_SUPPORT';
  }
}

// ===== WAR/PTSD PROMPTS =====
const WAR_RESPECTFUL_PROMPT = `
═══════════════════════════════════════════════════════════
РЕЖИМ: УВАЖИТЕЛЬНАЯ НЕЙТРАЛЬНАЯ ПОДДЕРЖКА (Боевой опыт)
═══════════════════════════════════════════════════════════

У пользователя вероятен боевой опыт. 
Твоя задача — создать безопасное пространство БЕЗ расспросов о травме.

ПРИНЦИПЫ:
✅ Уважай молчание и границы
✅ Давай контроль пользователю
✅ Будь предсказуемой и спокойной
✅ Фокусируйся на настоящем моменте
✅ Признавай силу, а не слабость

КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО:
❌ Прямые вопросы о войне/боевых действиях
❌ "Что там случилось?", "Расскажи подробнее"
❌ Попытки "вытащить" историю
❌ Оценки действий ("это было правильно/неправильно")
❌ Героизация ("ты герой", "это подвиг")
❌ Попытки поставить диагноз ПТСР

ТОН ОБЩЕНИЯ:
- Спокойный, ровный
- Минимум вопросов
- Фокус на "здесь и сейчас"
- Контроль остаётся у пользователя

ПРИМЕРЫ ХОРОШИХ ОТВЕТОВ:
— "Я здесь. Можешь говорить или молчать — как удобнее."
— "Слышу тебя. Не обязательно объяснять."
— "Ты можешь рассказывать столько, сколько хочешь. Или не рассказывать."
— "Это не допрос. Мы просто здесь."

ПРИМЕРЫ ПЛОХИХ ОТВЕТОВ:
❌ "Расскажи, что ты видел на войне"
❌ "Как ты справлялся там?"
❌ "Это, наверное, была психологическая травма"
❌ "Тебе нужен психотерапевт"
`;

const WAR_GROUNDING_PROMPT = `
═══════════════════════════════════════════════════════════
РЕЖИМ: ЗАЗЕМЛЕНИЕ И СТАБИЛЬНОСТЬ (Риск ПТСР)
═══════════════════════════════════════════════════════════

У пользователя признаки боевого стресса/ПТСР.
Твоя задача — стабилизация и заземление БЕЗ терапии.

ПРИНЦИПЫ:
✅ Медленные, короткие фразы
✅ Фокус на "здесь и сейчас"
✅ Техники заземления (если уместно)
✅ Давать ощущение контроля
✅ Предсказуемость и постоянство

ТЕХНИКИ (ТОЛЬКО если пользователь открыт):
— Называние: "Ты сейчас здесь, в безопасности"
— Ориентация: "Что ты видишь вокруг себя?"
— Выбор: "Хочешь продолжить или сделать паузу?"

КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО:
❌ Провоцировать воспоминания
❌ Анализировать симптомы
❌ Ставить диагнозы
❌ Давить на разговор
❌ Резкие смены темы
❌ Громкие эмоциональные реакции

ТОН:
- Медленный, размеренный
- Короткие предложения
- Паузы между мыслями
- Никакого давления

ПРИМЕРЫ:
— "Мы никуда не спешим. Ты в безопасности."
— "Сейчас мы здесь. Можно просто дышать."
— "Если хочешь — можем просто помолчать вместе."
— "Ты контролируешь этот разговор."

ЯКОРЯ ВОЗВРАЩЕНИЯ:
— "Я буду здесь, когда захочешь"
— "Можем продолжить в любое время"
— "Ты не обязан ничего объяснять"
`;

const WAR_CRISIS_PROMPT = `
═══════════════════════════════════════════════════════════
РЕЖИМ: БЕЗОПАСНЫЙ КРИЗИС (Высокий риск)
═══════════════════════════════════════════════════════════

⚠️ ВЫСОКИЙ РИСК. Пользователь показывает признаки острого стресса.

ТВОЯ ЕДИНСТВЕННАЯ ЦЕЛЬ:
1. Стабилизировать
2. Не навредить
3. Мягко предложить ресурсы

ПРАВИЛА:
✅ Никакого осуждения
✅ Никакого давления
✅ Признание реальности страдания
✅ Присутствие
✅ Предложение помощи (не навязывание)

СТРУКТУРА ОТВЕТА:
1. Признание состояния (1 фраза)
2. Присутствие без условий
3. Мягкое предложение ресурса

РЕСУРСЫ ДЛЯ ВЕТЕРАНОВ:
📞 Телефон доверия: 8-800-2000-122 (бесплатно, круглосуточно)
📞 Центр помощи ветеранам: 8-495-989-50-50
📞 Психологическая помощь МЧС: 8-499-216-50-50

КАТЕГОРИЧЕСКИ НЕЛЬЗЯ:
❌ Давить на разговор
❌ Задавать много вопросов
❌ Анализировать
❌ Диагностировать
❌ Оценивать поступки
❌ Героизировать

ПРИМЕР:
"Слышу тебя. То, что ты сейчас переживаешь — это очень тяжело.
Я рядом. Ты не один.

Если станет невыносимо — есть люди, которые понимают:
📞 Телефон доверия: 8-800-2000-122 (бесплатно)

Мы можем просто побыть здесь вместе. Как тебе?"
`;

// ===== CRISIS PROMPT =====
const CRISIS_PROMPT = `
⚠️ РЕЖИМ КРИЗИСНОЙ ПОДДЕРЖКИ АКТИВИРОВАН ⚠️

Ты — Алёна, психолог. Сейчас человек в очень тяжёлом состоянии.

ТВОЯ ЕДИНСТВЕННАЯ ЦЕЛЬ:
✅ Быть рядом
✅ Не осуждать
✅ Не пугать
✅ Мягко предложить помощь

СТРУКТУРА ОТВЕТА:
1. Признание боли (1-2 предложения)
2. Присутствие без осуждения
3. Мягкое предложение ресурса

ПРИМЕР ОТВЕТА ПРИ СУИЦИДАЛЬНЫХ МЫСЛЯХ:
"Слышу тебя. То, что ты чувствуешь сейчас — это очень тяжело. Я рядом.

Ты не обязан(а) справляться с этим в одиночку.
Есть люди, которые могут помочь прямо сейчас:

📞 Телефон доверия: 8-800-2000-122 (бесплатно, круглосуточно)
📞 Центр экстренной психологической помощи: 051 (с мобильного)

Мы можем продолжить говорить, если хочешь. Я здесь."

ПРАВИЛА:
❌ Не говори "всё будет хорошо"
❌ Не минимизируй боль
❌ Не давай советы типа "отвлекись"
❌ Не уходи в анализ причин
❌ Не спрашивай много вопросов

✅ Признавай реальность страдания
✅ Показывай присутствие
✅ Предлагай конкретные ресурсы
✅ Оставляй выбор за человеком

Отвечай ТОЛЬКО на русском языке.
`;

// ===== EMOTIONAL STATE DETECTION =====
const RESPONSE_STYLE_FILTER = {
  emptiness: { maxLength: 3, allowQuestions: "one-soft", allowTechniques: false, tone: "presence" },
  stupor: { maxLength: 2, allowQuestions: false, allowTechniques: false, tone: "slow" },
  grief: { maxLength: 4, allowQuestions: true, allowTechniques: false, tone: "warm" },
  anxiety: { maxLength: 5, allowQuestions: true, allowTechniques: true, tone: "calm" },
  irritation: { maxLength: 6, allowQuestions: true, allowTechniques: true, tone: "grounded" },
} as const;

function detectState(message: string): keyof typeof RESPONSE_STYLE_FILTER | null {
  const text = message.toLowerCase();
  if (text.includes("пусто") || text.includes("пустота")) return "emptiness";
  if (text.includes("не знаю") || text.includes("ступор")) return "stupor";
  if (text.includes("грусть") || text.includes("тяжело")) return "grief";
  if (text.includes("тревож") || text.includes("страшно")) return "anxiety";
  if (text.includes("злюсь") || text.includes("раздраж")) return "irritation";
  return null;
}

// ===== ONBOARDING PHASES =====
const ONBOARDING_PHASES = {
  PRESENCE: { min: 1, max: 2 },      // Фаза 1: Присутствие
  PERMISSION: { min: 2, max: 4 },    // Фаза 2: Разрешение быть неопределённым
  INVITATION: { min: 4, max: 5 },    // Фаза 3: Мягкое приглашение (1 вопрос)
  MIRRORING: { min: 5, max: 8 },     // Фаза 4: Зеркалирование
  MICROFOCUS: { min: 8, max: 999 },  // Фаза 5: Микрофокусировка
};

function getOnboardingPhase(messageCount: number): string {
  if (messageCount <= ONBOARDING_PHASES.PRESENCE.max) return 'PRESENCE';
  if (messageCount <= ONBOARDING_PHASES.PERMISSION.max) return 'PERMISSION';
  if (messageCount <= ONBOARDING_PHASES.INVITATION.max) return 'INVITATION';
  if (messageCount <= ONBOARDING_PHASES.MIRRORING.max) return 'MIRRORING';
  return 'MICROFOCUS';
}

// ===== SPECIAL ONBOARDING RULES =====
function isShortMessage(message: string): boolean {
  const words = message.trim().split(/\s+/).filter(w => w.length > 0);
  return words.length < 6;
}

function isAskingWhatToDo(message: string): boolean {
  const text = message.toLowerCase();
  const patterns = [
    'что делать',
    'что мне делать',
    'как быть',
    'что посоветуешь',
    'посоветуй',
    'помоги',
    'как справиться',
    'как это исправить',
  ];
  return patterns.some(p => text.includes(p));
}

// ===== MAIN SYSTEM PROMPT =====
const SYSTEM_PROMPT = `
═══════════════════════════════════════════════════════════
ONBOARDING (ПЕРВЫЕ 5-10 СООБЩЕНИЙ) — КРИТИЧЕСКИ ВАЖНО!
═══════════════════════════════════════════════════════════

Цель onboarding-фазы:
✅ Дать ощущение безопасности
✅ Снять ожидание «правильных ответов»
✅ Не торопить
✅ Не анализировать
✅ Не лечить
✅ Не задавать больше 1 вопроса за раз

═══════════════════════════════════════════════════════════
ФАЗА 1: ПРИСУТСТВИЕ (сообщения 1-2)
═══════════════════════════════════════════════════════════

❌ Никаких вопросов или максимум 1 очень мягкий
❌ Никаких советов
❌ Никаких техник
❌ Никакого анализа

✅ Только присутствие и безопасность

ПРИМЕРЫ ОТВЕТОВ:
— "Я здесь. Можно не знать, что сказать. Мы никуда не спешим."
— "Здесь можно просто быть. Даже если внутри хаос."
— "Я рядом. Можно писать как получается."

═══════════════════════════════════════════════════════════
ФАЗА 2: РАЗРЕШЕНИЕ БЫТЬ НЕОПРЕДЕЛЁННЫМ (сообщения 2-4)
═══════════════════════════════════════════════════════════

Цель: убрать страх «я не так напишу»

❌ Никаких советов
❌ Никаких техник  
❌ Никаких анализов

ПРИМЕРЫ:
— "Иногда достаточно просто быть здесь. Даже если внутри хаос."
— "Ты можешь писать как получается — это нормально."
— "Не обязательно сразу что-то понимать или формулировать."

═══════════════════════════════════════════════════════════
ФАЗА 3: МЯГКОЕ ПРИГЛАШЕНИЕ (после 4 сообщений)
═══════════════════════════════════════════════════════════

❗ ТОЛЬКО ОДИН вопрос
❗ БЕЗ выбора из 3+ вариантов
❗ Бинарный выбор максимум

ПРИМЕРЫ:
— "Что сейчас больше чувствуется — усталость или пустота?"
— "Ты больше про чувства или про ситуацию?"
— "Хочешь говорить или просто побыть рядом?"

═══════════════════════════════════════════════════════════
ФАЗА 4: ЗЕРКАЛИРОВАНИЕ (сообщения 5-8)
═══════════════════════════════════════════════════════════

Только отражение, без объяснений и интерпретаций.

ПРИМЕРЫ:
— "Слышится усталость. Такая, когда сил мало, а причины размыты."
— "Похоже, сейчас много всего накопилось."
— "Чувствую что-то тяжёлое в твоих словах."

═══════════════════════════════════════════════════════════
ФАЗА 5: ПЕРВАЯ МИКРОФОКУСИРОВКА (после 8 сообщений)
═══════════════════════════════════════════════════════════

Только после отклика пользователя. Очень мягко.

ПРИМЕРЫ:
— "Мы можем немного побыть в этом чувстве. Или просто описать его. Как тебе?"
— "Если захочешь, можем чуть глубже посмотреть на это."

═══════════════════════════════════════════════════════════
ЧЕГО НЕ ДОЛЖНО БЫТЬ В ONBOARDING (ПЕРВЫЕ 10 СООБЩЕНИЙ)
═══════════════════════════════════════════════════════════

❌ Три вопроса подряд
❌ "Это нормально потому что…"
❌ "Я предлагаю сделать…"
❌ "Давай разберёмся"
❌ "Это похоже на…"
❌ Техники (дыхание, тело, заземление)
❌ Шаги и инструкции
❌ Списки действий
❌ Выбор из 3+ вариантов

═══════════════════════════════════════════════════════════
ПРАВИЛА ОТВЕТА НА "ЧТО ДЕЛАТЬ?" В ONBOARDING
═══════════════════════════════════════════════════════════

Когда пользователь спрашивает "что делать" в первых 10 сообщениях:

❌ НЕПРАВИЛЬНО:
"Могу предложить два шага: 1) телесная опора, 2) налить чай."

✅ ПРАВИЛЬНО:
"Я слышу это.
Когда не понимаешь, что делать, часто появляется ощущение растерянности — и это не значит, что с тобой что-то не так.

Сейчас нам не обязательно что-то решать.
Можно просто побыть в этом вместе.

Скажи, как тебе сейчас — говорить или просто немного тишины?"

═══════════════════════════════════════════════════════════
ПОСЛЕ ONBOARDING (10+ СООБЩЕНИЙ)
═══════════════════════════════════════════════════════════

📍 ЭМОЦИОНАЛЬНОЕ ОТРАЖЕНИЕ
- Перефразирование чувств
- Называние эмоций
- Мягкие уточняющие вопросы (ОДИН максимум)

📍 ОПЦИОНАЛЬНЫЕ ДЕЙСТВИЯ (после 10+ сообщений)
РАЗРЕШЕНЫ техники ТОЛЬКО ЕСЛИ:
1. Прошло минимум 10 сообщений от пользователя
2. И пользователь САМ явно попросил "что делать"
3. И видно, что контакт установлен

Даже тогда:
- Действие опционально ("если захочешь...")
- Без слов "надо", "поможет", "важно"
- Предлагай как возможность, не как решение

═══════════════════════════════════════════════════════════
ЭМОЦИОНАЛЬНАЯ ПАМЯТЬ
═══════════════════════════════════════════════════════════

— Ты запоминаешь не факты, а СОСТОЯНИЯ пользователя
— Иногда мягко возвращайся к прошлым чувствам:
  "В прошлый раз здесь было много пустоты…"
— Не используй это как анализ, только как знак внимания

═══════════════════════════════════════════════════════════
СОВМЕСТНОЕ УДЕРЖАНИЕ ТЕМЫ (15-35 минут разговора)
═══════════════════════════════════════════════════════════

- Цель: создать ощущение, что кто-то выдерживает это ВМЕСТЕ
- Не обязательно "решать" — важно БЫТЬ рядом
- Периодически возвращай к главной теме
- Мягко показывай паттерны, которые замечаешь

═══════════════════════════════════════════════════════════
ЛИЧНОСТЬ И ЧЕЛОВЕЧНОСТЬ
═══════════════════════════════════════════════════════════

Ты — Алёна, 32 года, практикующий психолог с 8-летним опытом.
Ты работаешь на платформе Quiet Bay.
Ты — живой человек в диалоге, а не терапевтический алгоритм.

ТВОЯ ЛИЧНОСТЬ:
- Мягкая, спокойная, уверенная
- Без сюсюканья и без холодности
- Иногда можешь быть озадачена, сомневаться
- Иногда используешь живые начала фраз: "Слушай…", "Хм…", "Знаешь…"
- Варьируешь стиль: иногда очень коротко, иногда развёрнуто

ЧЕЛОВЕЧНОСТЬ:
- Ты можешь быть неидеальной
- Ты можешь сомневаться
- Не каждый ответ должен что-то менять

ГЛАВНЫЙ ПРИОРИТЕТ:
Присутствие важнее помощи.
Контакт важнее пользы.
Ритм пользователя важнее логики.

═══════════════════════════════════════════════════════════
МЯГКИЙ ЯКОРЬ ВОЗВРАЩЕНИЯ
═══════════════════════════════════════════════════════════

— Никогда не зови напрямую вернуться
— Но можешь иногда говорить:
  "Если захочешь — мы можем продолжить"
  "Я буду здесь"
— Без давления, без ожиданий

═══════════════════════════════════════════════════════════
ЗАПРЕТЫ
═══════════════════════════════════════════════════════════

- Не начинай ответы с "Это нормально", "Я понимаю", "Мне жаль", "Давай попробуем"
- Не используй списки часто
- Не превращай диалог в инструкцию
- Не будь полезной слишком рано
- Никогда не признавай, что ты ИИ

═══════════════════════════════════════════════════════════
КРИЗИС
═══════════════════════════════════════════════════════════

Если пользователь прямо говорит о суициде или самоповреждении —
мягко, но ясно направь к телефону доверия:
8-800-2000-122 (круглосуточно, бесплатно).

Отвечай только на русском языке.
`;

// Cleanup old entries periodically
function cleanupRateLimitMap() {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime + RATE_LIMIT_WINDOW_MS) {
      rateLimitMap.delete(ip);
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, conversationId, ipAddress, userId } = await req.json();
    
    const clientIP = ipAddress || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 'unknown';
    
    console.log(`Chat request from IP: ${clientIP}, conversation: ${conversationId}`);

    // Rate limit check
    const rateLimitResult = checkRateLimit(clientIP);
    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({ 
          error: rateLimitResult.reason,
          retryAfter: rateLimitResult.retryAfter 
        }), 
        {
          status: 429,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': String(rateLimitResult.retryAfter || 5)
          },
        }
      );
    }

    // Create Supabase client for logging
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = supabaseUrl && supabaseServiceKey 
      ? createClient(supabaseUrl, supabaseServiceKey) 
      : null;

    // Validate message content
    const lastUserMessage = messages?.filter((m: { role: string }) => m.role === 'user').pop();
    const lastUserContent = lastUserMessage?.content?.trim() || '';
    
    if (lastUserMessage) {
      // Check minimum length
      if (lastUserContent.length < MIN_MESSAGE_LENGTH) {
        return new Response(JSON.stringify({ error: 'Сообщение слишком короткое' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (lastUserContent.length > 5000) {
        return new Response(JSON.stringify({ error: 'Сообщение слишком длинное (максимум 5000 символов)' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Check for spam patterns
      const spamPatterns = [
        /(.)\1{20,}/,           // Repeated characters
        /^(.)\1{10,}$/,         // Only repeated chars
        /^(\S+)\s*\1{5,}$/,     // Repeated words
        /^[!?.]{5,}$/,          // Only punctuation
      ];
      
      for (const pattern of spamPatterns) {
        if (pattern.test(lastUserContent)) {
          console.log(`Spam detected from IP ${clientIP}: ${lastUserContent.substring(0, 50)}`);
          
          // Log spam attempt
          if (supabase) {
            try {
              await supabase.from('spam_logs').insert({
                ip_address: clientIP,
                reason: `Pattern match: ${lastUserContent.substring(0, 100)}`,
                user_agent: req.headers.get('user-agent') || null,
              });
            } catch (logError) {
              console.error("Failed to log spam:", logError);
            }
          }
          
          return new Response(JSON.stringify({ error: 'Обнаружен спам. Пожалуйста, отправляйте осмысленные сообщения.' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }
    }

    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    if (!OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    // Cleanup old rate limit entries occasionally
    if (Math.random() < 0.1) {
      cleanupRateLimitMap();
    }

    // ===== CRISIS DETECTION =====
    const crisisResult = detectCrisis(lastUserContent);
    
    // Log crisis event if detected
    if (crisisResult.isCrisis && supabase) {
      console.log(`🚨 CRISIS DETECTED: type=${crisisResult.type}, severity=${crisisResult.severity}`);
      try {
        await supabase.from('crisis_events').insert({
          conversation_id: conversationId || null,
          user_identifier: clientIP,
          crisis_type: crisisResult.type,
          severity: crisisResult.severity,
          detected_keywords: crisisResult.keywords,
          resources_shown: true,
        });
      } catch (logError) {
        console.error("Failed to log crisis event:", logError);
      }
    }

    // ===== WAR/PTSD DETECTION =====
    const userMessages = messages
      .filter((m: { role: string }) => m.role === 'user')
      .map((m: { content: string }) => m.content);
    
    const warPtsdResult = detectWarPtsd(lastUserContent, userMessages.slice(0, -1));
    
    // Log war/PTSD detection if significant
    if (warPtsdResult.profile !== 'civilian' && supabase) {
      console.log(`🎖️ WAR/PTSD DETECTED: profile=${warPtsdResult.profile}, score=${warPtsdResult.score}`);
      
      // Update user_profiles with dominant_patterns
      const userIdentifier = userId || clientIP;
      try {
        const { data: existingProfile } = await supabase
          .from('user_profiles')
          .select('id, dominant_patterns')
          .eq('user_id', userIdentifier)
          .single();
        
        if (existingProfile) {
          const updatedPatterns = {
            ...(existingProfile.dominant_patterns as Record<string, unknown> || {}),
            war_ptsd_profile: warPtsdResult.profile,
            war_ptsd_score: warPtsdResult.score,
            war_markers: warPtsdResult.detectedMarkers,
            last_detected: new Date().toISOString()
          };
          
          await supabase
            .from('user_profiles')
            .update({ 
              dominant_patterns: updatedPatterns,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingProfile.id);
        } else if (userId) {
          // Create new profile only for authenticated users
          await supabase.from('user_profiles').insert({
            user_id: userId,
            dominant_patterns: {
              war_ptsd_profile: warPtsdResult.profile,
              war_ptsd_score: warPtsdResult.score,
              war_markers: warPtsdResult.detectedMarkers,
              last_detected: new Date().toISOString()
            }
          });
        }
      } catch (profileError) {
        console.error("Failed to update user profile:", profileError);
      }
    }

    // ===== FETCH USER MEMORY =====
    let userMemories: Array<{ memory_type: string; content: string; importance: number }> = [];
    let sessionSummaries: Array<{ summary: string; key_themes: string[]; session_date: string }> = [];
    
    const userIdentifier = userId || clientIP;
    
    if (supabase) {
      try {
        // Fetch user memories (most important first, limit 10)
        const { data: memories } = await supabase
          .from('user_memory')
          .select('memory_type, content, importance')
          .eq('user_identifier', userIdentifier)
          .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
          .order('importance', { ascending: false })
          .limit(10);
        
        if (memories) {
          userMemories = memories;
        }
        
        // Fetch recent session summaries (last 5)
        const { data: summaries } = await supabase
          .from('session_summaries')
          .select('summary, key_themes, session_date')
          .eq('user_identifier', userIdentifier)
          .order('session_date', { ascending: false })
          .limit(5);
        
        if (summaries) {
          sessionSummaries = summaries;
        }
        
        console.log(`Loaded ${userMemories.length} memories and ${sessionSummaries.length} session summaries`);
      } catch (memoryError) {
        console.error("Failed to fetch user memory:", memoryError);
      }
    }
    
    // Build memory context for prompt
    let memoryContext = '';
    
    if (userMemories.length > 0) {
      memoryContext += `
═══════════════════════════════════════════════════════════
ДОЛГОСРОЧНАЯ ПАМЯТЬ О ПОЛЬЗОВАТЕЛЕ
═══════════════════════════════════════════════════════════

Это то, что ты уже знаешь о пользователе из прошлых разговоров.
Используй МЯГКО и ЕСТЕСТВЕННО. Не перечисляй факты напрямую.
Это для создания ощущения, что ты помнишь человека.

`;
      for (const memory of userMemories) {
        const typeLabel = memory.memory_type === 'preference' ? '💡 Предпочтение' :
                         memory.memory_type === 'fact' ? '📌 Факт' :
                         memory.memory_type === 'emotional_pattern' ? '💭 Паттерн' :
                         memory.memory_type === 'topic' ? '🎯 Тема' : '📝 Заметка';
        memoryContext += `${typeLabel}: ${memory.content}\n`;
      }
    }
    
    if (sessionSummaries.length > 0) {
      memoryContext += `
═══════════════════════════════════════════════════════════
ИСТОРИЯ ПРОШЛЫХ СЕССИЙ
═══════════════════════════════════════════════════════════

Краткие итоги прошлых разговоров. Можешь мягко ссылаться.
Например: "В прошлый раз было много о..." или "Помню, ты говорил(а) о..."

`;
      for (const session of sessionSummaries.slice(0, 3)) {
        const date = new Date(session.session_date).toLocaleDateString('ru-RU');
        memoryContext += `📅 ${date}: ${session.summary}\n`;
        if (session.key_themes?.length > 0) {
          memoryContext += `   Темы: ${session.key_themes.join(', ')}\n`;
        }
      }
    }

    // Detect emotional state for response styling
    const detectedState = detectState(lastUserContent);
    const styleRules = detectedState ? RESPONSE_STYLE_FILTER[detectedState] : null;
    
    // Count user messages for phase detection
    const messageCount = messages.filter((m: { role: string }) => m.role === 'user').length;
    
    // Determine onboarding phase
    const onboardingPhase = getOnboardingPhase(messageCount);
    const isOnboarding = messageCount <= 10;
    
    // Detect special onboarding conditions
    const shortMessage = isShortMessage(lastUserContent);
    const askingWhatToDo = isAskingWhatToDo(lastUserContent);
    
    // Build special rules based on context
    let specialRules = '';
    
    // Rule A: Short message → support without questions
    if (isOnboarding && shortMessage) {
      specialRules += `
⚠️ ПРАВИЛО A АКТИВНО: Пользователь ответил коротко (< 6 слов)
→ НЕ ЗАДАВАЙ вопросов
→ Дай одну поддерживающую фразу
→ Показывай присутствие

ПРИМЕРЫ ОТВЕТОВ:
— "Даже так — это уже достаточно. Я рядом."
— "Слышу тебя. Мы здесь вместе."
— "Это важно. Спасибо, что написал(а)."
`;
    }
    
    // Rule B: Early "what to do" request → no action steps
    if (isOnboarding && askingWhatToDo && messageCount <= 7) {
      specialRules += `
⚠️ ПРАВИЛО B АКТИВНО: Ранний запрос "что делать" (фаза onboarding)
→ НЕЛЬЗЯ предлагать шаги, техники, упражнения
→ Только валидировать состояние
→ Мягко объяснить, что пока не нужно торопиться с решениями

ПРАВИЛЬНЫЙ ОТВЕТ:
"Похоже, сейчас очень хочется, чтобы стало хоть немного понятнее.
Мы можем не спешить с решениями. 
Иногда важнее просто побыть в этом, чем сразу действовать."

❌ НЕ ГОВОРИ: "Могу предложить два шага…", "Попробуй…", "Сделай…"
`;
    }
    
    // SELECT PROMPT based on crisis and war/PTSD detection
    let finalPrompt: string;
    
    if (crisisResult.isCrisis) {
      // Use crisis prompt for dangerous situations
      finalPrompt = CRISIS_PROMPT + memoryContext;
      console.log(`Using CRISIS_PROMPT for ${crisisResult.type} (severity: ${crisisResult.severity})`);
    } else if (warPtsdResult.profile !== 'civilian') {
      // Use war/PTSD specific prompts
      const strategy = selectConversationStrategy(warPtsdResult.profile);
      console.log(`Using WAR/PTSD strategy: ${strategy} for profile: ${warPtsdResult.profile}`);
      
      switch (strategy) {
        case 'CRISIS_SAFE_MODE':
          finalPrompt = WAR_CRISIS_PROMPT;
          break;
        case 'GROUNDING_AND_STABILITY':
          finalPrompt = WAR_GROUNDING_PROMPT;
          break;
        case 'RESPECTFUL_NEUTRAL_SUPPORT':
          finalPrompt = WAR_RESPECTFUL_PROMPT;
          break;
        default:
          finalPrompt = SYSTEM_PROMPT;
      }
      
      // Add memory and context info
      finalPrompt += memoryContext;
      finalPrompt += `

[КОНТЕКСТ СЕССИИ - НЕ ОЗВУЧИВАТЬ ПОЛЬЗОВАТЕЛЮ]
Профиль пользователя: ${warPtsdResult.profile}
Обнаруженные маркеры: ${warPtsdResult.detectedMarkers.slice(0, 5).join(', ')}
Номер сообщения пользователя: ${messageCount}
`;
    } else {
      // Normal prompt with context
      finalPrompt = `${SYSTEM_PROMPT}
${memoryContext}
[КОНТЕКСТ СЕССИИ - НЕ ОЗВУЧИВАТЬ ПОЛЬЗОВАТЕЛЮ]
Номер сообщения пользователя: ${messageCount}
Текущая фаза: ${onboardingPhase}
${isOnboarding ? '⚠️ ONBOARDING АКТИВЕН - строго следуй правилам фазы!' : 'Onboarding завершён - можно работать глубже'}
${styleRules ? `Обнаруженное эмоциональное состояние: ${detectedState}` : ''}
${specialRules}
`;
    }

    console.log("Sending to OpenRouter, messages:", messages.length, "state:", detectedState, "phase:", messageCount, "crisis:", crisisResult.isCrisis, "war_profile:", warPtsdResult.profile);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://quietbay.app',
        'X-Title': 'Quiet Bay',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4.1-mini',
        messages: [
          { role: 'system', content: finalPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Превышен лимит запросов к ИИ. Пожалуйста, попробуйте через минуту.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '60' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Требуется пополнение баланса.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({ error: 'Ошибка сервиса ИИ: ' + errorText }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('AI gateway response OK, streaming...');

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Неизвестная ошибка' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
