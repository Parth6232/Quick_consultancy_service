// src/utils/formatText.js
export const unescapeNewlines = (text) => {
  if (!text) return ''
  return text.replace(/\\n/g, '\n')
}
