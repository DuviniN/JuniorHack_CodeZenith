const CLEAN_HEADING_REGEX = /^\*\*(.+?)\*\*:?$/;

export function parseMealPlanResponse(rawText) {
  if (!rawText || typeof rawText !== 'string') return null;

  const text = rawText.replace(/\r/g, '').trim();
  const hasPlanKeywords = /(meal plan|recommended meals|key principles|snacks)/i.test(text);
  if (!hasPlanKeywords) return null;

  const result = {
    intro: '',
    title: '',
    keyPrinciples: [],
    mealSections: [],
    snacks: [],
    advice: []
  };

  const lines = text.split('\n').map((line) => line.trim());
  let section = 'intro';
  let currentMealSection = null;

  lines.forEach((line) => {
    if (!line) return;
    if (/^---+$/.test(line)) return;

    const headingMatch = line.match(CLEAN_HEADING_REGEX);
    if (headingMatch) {
      const heading = headingMatch[1].trim();
      const lowerHeading = heading.toLowerCase();

      if (!result.title && /meal plan/i.test(heading)) {
        result.title = heading.replace(/\*\*/g, '').trim();
      }

      if (lowerHeading.includes('key principles')) {
        section = 'principles';
        return;
      }
      if (lowerHeading.includes('recommended meals')) {
        section = 'meals';
        currentMealSection = null;
        return;
      }
      if (lowerHeading.includes('snack')) {
        section = 'snacks';
        currentMealSection = null;
        return;
      }
      if (lowerHeading.includes('short advice')) {
        section = 'advice';
        currentMealSection = null;
        return;
      }

      if (section === 'meals') {
        const timeMatch = heading.match(/\((.*?)\)/);
        currentMealSection = {
          title: heading.replace(/\(.*?\)/, '').trim(),
          subtitle: timeMatch ? timeMatch[1] : '',
          items: []
        };
        result.mealSections.push(currentMealSection);
        return;
      }

      return;
    }

    switch (section) {
      case 'principles': {
        const principle = stripMarkdownBullet(line);
        if (principle) result.keyPrinciples.push(principle);
        break;
      }
      case 'snacks': {
        const snack = stripMarkdownBullet(line, true);
        if (snack) result.snacks.push(snack);
        break;
      }
      case 'advice': {
        const advice = line.replace(/^\d+\.\s*/, '').replace(/\*\*/g, '').trim();
        if (advice) result.advice.push(advice);
        break;
      }
      case 'meals': {
        const cleaned = line.replace(/^\d+\.\s*/, '').trim();
        if (!cleaned) break;
        const parsedItem = parseMealItem(cleaned);
        if (!currentMealSection) {
          currentMealSection = { title: 'Meal', subtitle: '', items: [] };
          result.mealSections.push(currentMealSection);
        }
        currentMealSection.items.push(parsedItem);
        break;
      }
      default: {
        result.intro = result.intro ? `${result.intro}\n${line.replace(/\*\*/g, '')}` : line.replace(/\*\*/g, '');
      }
    }
  });

  const hasStructuredContent =
    result.keyPrinciples.length || result.mealSections.length || result.snacks.length || result.advice.length;

  if (!hasStructuredContent) {
    return null;
  }

  return result;
}

function stripMarkdownBullet(line, allowNumbered = false) {
  if (!line) return '';
  let cleaned = line;
  cleaned = cleaned.replace(/^[-*•]\s*/, '');
  if (allowNumbered) cleaned = cleaned.replace(/^\d+\.\s*/, '');
  return cleaned.replace(/\*\*/g, '').trim();
}

function parseMealItem(line) {
  const bulletStripped = line.replace(/^[-*•]\s*/, '');
  const boldMatch = bulletStripped.match(/\*\*(.+?)\*\*\s*:?(.*)/);
  if (boldMatch) {
    return {
      label: boldMatch[1].trim(),
      description: boldMatch[2]?.trim() || ''
    };
  }

  const [label, ...rest] = bulletStripped.replace(/\*\*/g, '').split(':');
  return {
    label: (label && label.trim()) || bulletStripped.replace(/\*\*/g, ''),
    description: rest.join(':').trim()
  };
}
