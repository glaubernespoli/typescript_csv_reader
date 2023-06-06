/**
 * An utils function that checks if a given string is completely between double quotes. If it is, is extracts the value between the outermost quotes, and weakly escapes innermost double quotes if they are escaped by another double quote.
 * Does so in a weak way, where it simply replaces every encounter of '""' with '"', without checking for unescaped double quotes on the string.
 * @param value the value to be escaped
 * @returns the escaped value
 */
export const weakEscapeDoubleQuotes = (value: string): string => {
  //gets the value between the first and last quotes
  const betweenQuotesRegEx = /"((?:""|[^"])*)"/;

  const r = betweenQuotesRegEx.exec(value);

  //returns if its not a quoted value
  if (!r) return value;

  //gets the value of the first group
  let betweenQuotesValue = r[1]!;
  betweenQuotesValue = betweenQuotesValue.replaceAll('""', '"');

  return betweenQuotesValue;
};
