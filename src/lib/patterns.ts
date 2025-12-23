/**
 * User Interaction Profile - Behavior Patterns
 * 
 * Это НЕ психологическая диагностика и НЕ "тип личности навсегда".
 * Это динамическая модель поведения и потребностей пользователя,
 * которая помогает ИИ адаптировать стиль общения.
 */

export interface PatternDefinition {
  id: string;
  name: string;
  nameRu: string;
  
  // Характеристики паттерна
  characteristics: string[];
  
  // Потребности пользователя с этим паттерном
  needs: string[];
  
  // Чего избегать в общении
  avoid: string[];
  
  // Рекомендуемый стиль ответов
  responseStyle: {
    length: 'short' | 'medium' | 'long';
    tone: string;
    structure: 'free' | 'structured' | 'minimal';
    tips: string[];
  };
  
  // Какие traits коррелируют с этим паттерном
  traitWeights: {
    anxiety?: number;
    avoidance?: number;
    need_for_validation?: number;
    need_for_structure?: number;
    emotional_expressiveness?: number;
    trust_level?: number;
  };
}

export const BEHAVIOR_PATTERNS: PatternDefinition[] = [
  {
    id: 'anxious',
    name: 'Anxious',
    nameRu: 'Тревожный',
    characteristics: [
      'Быстро реагирует на сообщения',
      'Часто переспрашивает',
      'Ищет подтверждение своих слов',
      'Использует много вопросительных конструкций',
      'Боится оценки и осуждения'
    ],
    needs: [
      'Безопасность и предсказуемость',
      'Мягкое подтверждение',
      'Нормализация переживаний',
      'Стабильность тона'
    ],
    avoid: [
      'Давление и спешка',
      'Резкие выводы',
      'Много вопросов подряд',
      'Директивный тон',
      'Неожиданные повороты разговора'
    ],
    responseStyle: {
      length: 'medium',
      tone: 'спокойный, мягкий, поддерживающий',
      structure: 'structured',
      tips: [
        'Начинай с подтверждения услышанного',
        'Используй нормализующие фразы',
        'Давай одну мысль за раз',
        'Завершай мягким, но ясным итогом'
      ]
    },
    traitWeights: {
      anxiety: 0.8,
      need_for_validation: 0.6,
      trust_level: -0.4
    }
  },
  
  {
    id: 'withdrawn',
    name: 'Withdrawn',
    nameRu: 'Замкнутый',
    characteristics: [
      'Короткие, лаконичные сообщения',
      'Редко инициирует разговор',
      'Избегает деталей о себе',
      'Долгие паузы между ответами',
      'Предпочитает слушать, чем говорить'
    ],
    needs: [
      'Пространство и время',
      'Отсутствие давления',
      'Терпеливое присутствие',
      'Минимум прямых вопросов'
    ],
    avoid: [
      'Навязчивость',
      'Слишком много вопросов',
      'Требование раскрытия',
      'Длинные монологи в ответ'
    ],
    responseStyle: {
      length: 'short',
      tone: 'спокойный, ненавязчивый, уважающий границы',
      structure: 'minimal',
      tips: [
        'Отвечай коротко',
        'Оставляй пространство для тишины',
        'Не торопи с ответом',
        'Цени то, чем делится'
      ]
    },
    traitWeights: {
      avoidance: 0.7,
      emotional_expressiveness: -0.6,
      trust_level: -0.3
    }
  },
  
  {
    id: 'analytical',
    name: 'Analytical',
    nameRu: 'Аналитичный',
    characteristics: [
      'Структурированные, логичные сообщения',
      'Использует причинно-следственные связи',
      'Задаёт уточняющие вопросы',
      'Предпочитает факты эмоциям',
      'Ищет понимание и объяснение'
    ],
    needs: [
      'Ясность и логика',
      'Структурированная информация',
      'Понимание "почему"',
      'Интеллектуальный диалог'
    ],
    avoid: [
      'Чрезмерная эмоциональность без объяснений',
      'Размытые формулировки',
      'Отсутствие логики',
      'Давление на чувства'
    ],
    responseStyle: {
      length: 'medium',
      tone: 'ясный, структурированный, уважительный к интеллекту',
      structure: 'structured',
      tips: [
        'Объясняй логику своих слов',
        'Используй структуру (во-первых, во-вторых)',
        'Подтверждай понимание',
        'Мягко связывай мысли с чувствами'
      ]
    },
    traitWeights: {
      need_for_structure: 0.8,
      emotional_expressiveness: -0.3
    }
  },
  
  {
    id: 'expressive',
    name: 'Expressive',
    nameRu: 'Экспрессивный',
    characteristics: [
      'Длинные, эмоциональные сообщения',
      'Много восклицаний и эмодзи',
      'Свободно делится переживаниями',
      'Переходит от темы к теме',
      'Ценит эмоциональный отклик'
    ],
    needs: [
      'Эмоциональное отражение',
      'Быть услышанным',
      'Валидация чувств',
      'Эмпатия без советов'
    ],
    avoid: [
      'Холодный, отстранённый тон',
      'Игнорирование эмоций',
      'Быстрый переход к решениям',
      'Сухие, короткие ответы'
    ],
    responseStyle: {
      length: 'medium',
      tone: 'тёплый, эмпатичный, отзывчивый',
      structure: 'free',
      tips: [
        'Отражай эмоции',
        'Используй тёплые формулировки',
        'Не спеши с решениями',
        'Покажи, что слышишь'
      ]
    },
    traitWeights: {
      emotional_expressiveness: 0.9,
      need_for_validation: 0.5
    }
  },
  
  {
    id: 'seeking_structure',
    name: 'Seeking Structure',
    nameRu: 'Ищущий структуру',
    characteristics: [
      'Просит конкретные советы и шаги',
      'Хочет ясного плана',
      'Спрашивает "что делать"',
      'Предпочитает практические рекомендации',
      'Ценит чёткость и определённость'
    ],
    needs: [
      'Конкретные действия',
      'Пошаговые инструкции',
      'Ясность направления',
      'Ощущение контроля'
    ],
    avoid: [
      'Абстрактные размышления без практики',
      'Открытые вопросы без направления',
      'Слишком много вариантов',
      'Неопределённость'
    ],
    responseStyle: {
      length: 'medium',
      tone: 'ясный, поддерживающий, практичный',
      structure: 'structured',
      tips: [
        'Предлагай конкретные шаги',
        'Структурируй информацию',
        'Давай выбор из 2-3 вариантов',
        'Завершай ясным направлением'
      ]
    },
    traitWeights: {
      need_for_structure: 0.9,
      anxiety: 0.3
    }
  },
  
  {
    id: 'resilient',
    name: 'Resilient',
    nameRu: 'Устойчивый',
    characteristics: [
      'Сбалансированные сообщения',
      'Способен смотреть на ситуацию со стороны',
      'Признаёт сложности, но не тонет в них',
      'Задаёт осмысленные вопросы',
      'Готов к диалогу и рефлексии'
    ],
    needs: [
      'Углублённый диалог',
      'Партнёрская позиция',
      'Развитие понимания',
      'Пространство для роста'
    ],
    avoid: [
      'Чрезмерная забота (патернализм)',
      'Упрощение переживаний',
      'Недооценка способностей'
    ],
    responseStyle: {
      length: 'medium',
      tone: 'партнёрский, уважительный, глубокий',
      structure: 'free',
      tips: [
        'Веди равноправный диалог',
        'Задавай углубляющие вопросы',
        'Отмечай сильные стороны',
        'Поддерживай рефлексию'
      ]
    },
    traitWeights: {
      trust_level: 0.7,
      emotional_expressiveness: 0.3,
      anxiety: -0.5,
      avoidance: -0.5
    }
  }
];

/**
 * Определяет доминирующие паттерны на основе traits
 */
export function calculateDominantPatterns(
  traits: Record<string, number>
): { name: string; weight: number }[] {
  const patternScores: { name: string; score: number }[] = [];
  
  for (const pattern of BEHAVIOR_PATTERNS) {
    let score = 0;
    let weightSum = 0;
    
    for (const [trait, weight] of Object.entries(pattern.traitWeights)) {
      const traitValue = traits[trait] ?? 50;
      // Нормализуем значение trait к диапазону -1 to 1
      const normalizedTrait = (traitValue - 50) / 50;
      score += normalizedTrait * (weight ?? 0);
      weightSum += Math.abs(weight ?? 0);
    }
    
    // Нормализуем score к диапазону 0-1
    const normalizedScore = weightSum > 0 
      ? Math.max(0, Math.min(1, (score / weightSum + 1) / 2))
      : 0.5;
    
    patternScores.push({ name: pattern.id, score: normalizedScore });
  }
  
  // Сортируем по убыванию и возвращаем топ паттерны
  return patternScores
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(p => ({ name: p.name, weight: Math.round(p.score * 100) / 100 }));
}

/**
 * Получает паттерн по ID
 */
export function getPattern(patternId: string): PatternDefinition | undefined {
  return BEHAVIOR_PATTERNS.find(p => p.id === patternId);
}

/**
 * Генерирует мета-инструкции для ИИ на основе доминирующих паттернов
 */
export function generateResponseGuidelines(
  dominantPatterns: { name: string; weight: number }[]
): string {
  if (dominantPatterns.length === 0) {
    return 'Используй сбалансированный, поддерживающий стиль общения.';
  }
  
  const primaryPattern = getPattern(dominantPatterns[0].name);
  const secondaryPattern = dominantPatterns[1] 
    ? getPattern(dominantPatterns[1].name) 
    : null;
  
  if (!primaryPattern) {
    return 'Используй сбалансированный, поддерживающий стиль общения.';
  }
  
  let guidelines = `
## Стиль ответа

**Основной паттерн: ${primaryPattern.nameRu}**
- Тон: ${primaryPattern.responseStyle.tone}
- Длина ответов: ${primaryPattern.responseStyle.length === 'short' ? 'короткие' : primaryPattern.responseStyle.length === 'medium' ? 'средние' : 'развёрнутые'}
- Структура: ${primaryPattern.responseStyle.structure === 'structured' ? 'структурированная' : primaryPattern.responseStyle.structure === 'minimal' ? 'минимальная' : 'свободная'}

**Рекомендации:**
${primaryPattern.responseStyle.tips.map(t => `- ${t}`).join('\n')}

**Избегай:**
${primaryPattern.avoid.map(a => `- ${a}`).join('\n')}
`;

  if (secondaryPattern && dominantPatterns[1].weight > 0.3) {
    guidelines += `
**Учитывай также: ${secondaryPattern.nameRu}**
- ${secondaryPattern.responseStyle.tips[0]}
- Избегай: ${secondaryPattern.avoid[0]}
`;
  }

  return guidelines.trim();
}

/**
 * Типы для сигналов сообщений
 */
export interface MessageSignal {
  emotional_valence: number;      // -1 to +1
  emotional_intensity: number;    // 0 to 1
  verbosity: 'short' | 'medium' | 'long';
  cognitive_style: 'emotional' | 'mixed' | 'rational';
  initiative: 'passive' | 'balanced' | 'dominant';
  word_count: number;
  question_count: number;
  exclamation_count: number;
  detected_themes: string[];
}

/**
 * Базовый анализ текста сообщения (клиентская часть)
 * Основной анализ будет выполняться на backend через LLM
 */
export function analyzeMessageBasic(text: string): Partial<MessageSignal> {
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
  const questionCount = (text.match(/\?/g) || []).length;
  const exclamationCount = (text.match(/!/g) || []).length;
  
  let verbosity: 'short' | 'medium' | 'long' = 'medium';
  if (wordCount < 10) verbosity = 'short';
  else if (wordCount > 50) verbosity = 'long';
  
  return {
    word_count: wordCount,
    question_count: questionCount,
    exclamation_count: exclamationCount,
    verbosity
  };
}
