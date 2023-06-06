/**
 * An utils function that escapes
 * @param value
 * @returns
 */
export const weakEscapeDoubleQuotes = (value: string): string => {
  //gets the value between the first and last quotes
  const betweenQuotesRegEx = /"((?:""|[^"])*)"/;
  //   const r = value.match(betweenQuotesRegEx);

  const r = betweenQuotesRegEx.exec(value);

  //returns if its not a quoted value
  if (!r) return value;

  //gets the value of the first group
  let betweenQuotesValue = r[1]!;
  betweenQuotesValue = betweenQuotesValue.replaceAll('""', '"');

  return betweenQuotesValue;
};
