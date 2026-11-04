export const toList = <T>(data: T[] | { content: T[] } | null | undefined): T[] => {
  if (!data) return [];
  return Array.isArray(data) ? data : data.content ?? [];
};