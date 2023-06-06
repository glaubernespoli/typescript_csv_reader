import * as fs from "fs";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as path from "path";
import { csvParser } from "../../src/parser";

describe("Parsing the CSV file", () => {
  let filePath: string;
  let buffer: Buffer;
  let fileStream: fs.ReadStream;
  let result: Array<Record<string, string>>;

  it("Should read the file successfully", async (t) => {
    filePath = path.resolve(__dirname, "../data/example.csv");
    buffer = Buffer.from(filePath);
    fileStream = fs.createReadStream(buffer);
    result = await csvParser(fileStream);

    assert.ok(result, "No results were generated.");

    await t.test("Should have correct number of records", () => {
      //1000 is the number or records in example.csv
      const numberOfRecords = 1000;
      assert.strictEqual(
        result.length,
        numberOfRecords,
        `Expected to find [${numberOfRecords}] records, found [${result.length}]`
      );
    });

    await t.test("Should have correct data on the first record", () => {
      const exampleHeaders = [
        "id",
        "first_name",
        "last_name",
        "email",
        "local_currency",
        "created_at",
        "country",
        "country_code",
        "approx_lat",
        "approx_long",
        "time_zone",
        "description",
      ];

      const expected = [
        "b47a3710-02c4-4bda-a616-ed0c33d0cc96",
        "Carol",
        "Girth",
        "cgirth0@toplist.cz",
        "CNY",
        "2021-11-19T21:50:09Z",
        "China",
        "CN",
        "41.790245",
        "123.374698",
        "Asia/Shanghai",
        '"sJlPH ""peDTynn4PQ"" wzIpO"',
      ];

      const firstEntry = result.shift();
      assert.notEqual(firstEntry, undefined);

      exampleHeaders.forEach((header, idx) => {
        assert.strictEqual(firstEntry![header], expected[idx]);
      });
    });
  });
});
