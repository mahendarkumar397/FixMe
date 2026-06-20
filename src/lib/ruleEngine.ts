export const ALLOWED_CATEGORIES = [
  'fitness',
  'sleep',
  'career',
  'money',
  'stress',
  'productivity',
  'relationships',
  'health',
] as const;

export type ProblemCategory = typeof ALLOWED_CATEGORIES[number];

type RuleSet = {
  category: ProblemCategory;
  keywords: string[];
};

const CATEGORY_RULES: RuleSet[] = [
  {
    category: 'fitness',
    keywords: ['gym', 'workout', 'run', 'weights', 'exercise', 'train', 'sport'],
  },
  {
    category: 'sleep',
    keywords: ['sleep', 'late', 'tired', 'bed', 'woke', 'alarm', 'insomnia', 'nap'],
  },
  {
    category: 'career',
    keywords: ['office', 'work', 'job', 'interview', 'boss', 'prep', 'meeting', 'colleague'],
  },
  {
    category: 'money',
    keywords: ['money', 'spend', 'overspent', 'buy', 'expensive', 'cash', 'budget', 'finance', 'debt'],
  },
  {
    category: 'stress',
    keywords: ['stress', 'anxious', 'overwhelmed', 'panic', 'worry', 'nervous', 'pressure'],
  },
  {
    category: 'productivity',
    keywords: ['focus', 'lazy', 'procrastinate', 'task', 'distracted', 'unproductive', 'delay'],
  },
  {
    category: 'relationships',
    keywords: ['friend', 'partner', 'argument', 'date', 'lonely', 'fight', 'family', 'social'],
  },
  {
    category: 'health',
    keywords: ['sick', 'doctor', 'diet', 'food', 'ill', 'pain', 'headache', 'eat', 'meal'],
  },
];

/**
 * Layer 1: Rule Engine
 * Attempts to categorize a problem based on simple keyword matching.
 * Returns the matched category, or null if it requires AI analysis (Layer 2).
 */
export function categorizeProblem(problemText: string): ProblemCategory | null {
  const normalizedText = problemText.toLowerCase();

  for (const rule of CATEGORY_RULES) {
    for (const keyword of rule.keywords) {
      // Use regex word boundary to ensure we match whole words, not partials 
      // (e.g. 'run' shouldn't match 'running', though we could tweak this if needed)
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      if (regex.test(normalizedText)) {
        return rule.category;
      }
    }
  }

  // If no keyword matched, we fallback to null, indicating AI is needed
  return null;
}
