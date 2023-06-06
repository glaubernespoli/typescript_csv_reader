import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { weakEscapeDoubleQuotes } from "../../src/utils/escapeUtils";

/**
 * NOTE: This test is under src folder instead of src/utils folder, due to the built-in testrunner from node being unable to recognize .ts files by default.
 * Due to that, a path is required to be passed as an argument on the package.json (line 12).
 * But then, apparently, globstar is not supported by default by the /bin/sh and is not expanded by neither node or npm, thus the ** on the pattern becomes a single *, making subfolders be ignored.
 * More info at: https://github.com/nodejs/help/issues/3902
 * And more specifically at the answer: https://github.com/nodejs/help/issues/3902#issuecomment-1307124174
 */
describe("Weakling escaping general string values", async () => {
  it("Should ignore values that are not between double quotes", () => {
    assert.strictEqual(weakEscapeDoubleQuotes("Vickie"), "Vickie");
    assert.strictEqual(weakEscapeDoubleQuotes("2021-10-06T11:35:30Z"), "2021-10-06T11:35:30Z");
    assert.strictEqual(weakEscapeDoubleQuotes("Portugal"), "Portugal");
  });

  it("Should return values that are between double quotes", () => {
    assert.strictEqual(weakEscapeDoubleQuotes('"Vickie Parrish"'), "Vickie Parrish");
    assert.strictEqual(weakEscapeDoubleQuotes('"Barcelona, Spain"'), "Barcelona, Spain");
  });

  it("Should return values that are between double quotes, escaping double quotes that are followed by other double quotes", () => {
    assert.strictEqual(weakEscapeDoubleQuotes('"""sJlPH """"peDTynn4PQ"""" wzIpO"""'), '"sJlPH ""peDTynn4PQ"" wzIpO"');
    assert.strictEqual(weakEscapeDoubleQuotes('"""3NsWT """"ZD9FHWnYXN"""" cArRA"""'), '"3NsWT ""ZD9FHWnYXN"" cArRA"');
  });
});
