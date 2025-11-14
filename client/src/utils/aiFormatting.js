export function parseMealPlanResponse(rawText) {
  if (!rawText || typeof rawText !== 'string') return null;

  const text = rawText.trim();
  if (!text.includes('Meal Plan')) return null;

  const intro = text.split('---')[0]?.trim() || '';

  const titleMatch = text.match(/###\s*\*\*(.+?)\*\*/);
  const title = titleMatch ? titleMatch[1].trim() : '';

  const focusMatch = text.match(/\*\*Target Focus:\*\*\s*(.+)/);
  const targetFocus = focusMatch ? focusMatch[1].trim() : '';

  const adviceHeadingIndex = text.indexOf('### **Short Advice');
  const adviceBlock = adviceHeadingIndex >= 0 ? text.substring(adviceHeadingIndex) : '';
  const adviceLines = adviceBlock
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^\d+\./.test(line))
    .map((line) => line.replace(/^\d+\.\s*/, '').replace(/\*\*/g, ''));

  const mealRegex = /\*\*(\d+\.\s*[^*]+)\*\*/g;
  const mealMatches = [];
  let match;
  while ((match = mealRegex.exec(text)) !== null) {
    mealMatches.push({
      heading: match[1].trim(),
      start: match.index + match[0].length
    });
  }

  if (!mealMatches.length) {
    return null;
  }

  const meals = mealMatches.map((entry, idx) => {
    const end = mealMatches[idx + 1]?.start ?? (adviceHeadingIndex >= 0 ? adviceHeadingIndex : text.length);
    const block = text.substring(entry.start, end).trim();
    const items = block
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('*'))
      .map((line) => {
        const cleaned = line.replace(/^\*+\s*/, '').trim();
        const withoutBold = cleaned.replace(/\*\*/g, '').trim();
        const [label, ...rest] = withoutBold.split(':');
        return {
          label: label.trim(),
          description: rest.join(':').trim()
        };
      })
      .filter((item) => item.label);

    const cleanedHeading = entry.heading.replace(/^\d+\.\s*/, '').trim();
    const timeMatch = cleanedHeading.match(/\((.*?)\)/);
    return {
      title: cleanedHeading.replace(/\(.*?\)/, '').trim(),
      time: timeMatch ? timeMatch[1] : '',
      items
    };
  });

  return {
    intro,
    title,
    targetFocus,
    meals,
    advice: adviceLines
  };
}
