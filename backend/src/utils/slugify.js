/**
 * যেকোনো স্ট্রিংকে URL-friendly স্লাগে রূপান্তর করে।
 * @param {string} text
 * @returns {string}
 */
export const generateSlug = (text) => {
  if (!text) return "";

  return text
    .toLowerCase()
    .trim()
    .split(" ")
    .join("-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
};
