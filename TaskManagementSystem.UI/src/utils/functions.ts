export const formatLabel = (text: string): string => {
  if (!text) return "";
  
  return text
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};