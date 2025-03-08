import { Keyword, KeywordGroup } from '../types/keyword';

// Helper function to calculate similarity between two strings
const calculateSimilarity = (str1: string, str2: string): number => {
  const words1 = str1.toLowerCase().split(' ');
  const words2 = str2.toLowerCase().split(' ');
  const commonWords = words1.filter(word => words2.includes(word));
  return commonWords.length / Math.max(words1.length, words2.length);
};

// Helper function to calculate average difficulty
const calculateAverageDifficulty = (keywords: Keyword[]): number => {
  return Math.round(
    keywords.reduce((acc, kw) => acc + kw.difficulty, 0) / keywords.length
  );
};

// Helper function to calculate total volume
const calculateTotalVolume = (keywords: Keyword[]): number => {
  return keywords.reduce((acc, kw) => acc + kw.searchVolume, 0);
};

export const groupKeywords = (keywords: Keyword[]): KeywordGroup[] => {
  const groups: KeywordGroup[] = [];
  const processedKeywords = new Set<string>();

  keywords.forEach(keyword => {
    if (processedKeywords.has(keyword.id)) return;

    const relatedKeywords = keywords.filter(kw => {
      if (processedKeywords.has(kw.id)) return false;
      return calculateSimilarity(keyword.term, kw.term) > 0.3; // Adjust threshold as needed
    });

    if (relatedKeywords.length > 0) {
      const groupName = keyword.term.split(' ').slice(0, 2).join(' '); // Use first two words as group name
      const group: KeywordGroup = {
        id: `group-${groups.length + 1}`,
        name: groupName,
        keywords: relatedKeywords,
        totalVolume: calculateTotalVolume(relatedKeywords),
        averageDifficulty: calculateAverageDifficulty(relatedKeywords)
      };
      groups.push(group);

      // Mark all keywords in this group as processed
      relatedKeywords.forEach(kw => processedKeywords.add(kw.id));
    }
  });

  return groups;
}; 