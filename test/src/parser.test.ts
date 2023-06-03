import * as fs from "fs";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as path from "path";
import { csvParser } from "../../src/parser";

describe("Reads the csv file successfully", () => {
  let filePath: string;
  it("File is open", () => {
    assert.doesNotThrow(
      () => {
        filePath = path.resolve(__dirname, "data/example.csv");
      },
      TypeError,
      "Failed to open the file."
    );
  });

  let buffer: Buffer;
  it("Buffer is created from file", () => {
    assert.doesNotThrow(
      () => {
        // buffer = fs.readFileSync(new URL("data/example.csv", import.meta.url));
        buffer = Buffer.from(filePath);
      },
      TypeError,
      "Failed to create the buffer"
    );
  });

  let fileStream: fs.ReadStream;
  it("Stream is created from Buffer", () => {
    assert.ok(() => {
      fileStream = fs.createReadStream(buffer);
    });
  });

  let result: Array<Record<string, string>>;
  it("File is parsed successfully", () => {
    assert.ok(() => {
      csvParser(fileStream).then((value) => {
        result = value;
      });
    });
  });

  it("blabla", () => {
    assert.ok(() => {
      console.log(`Result is: ${result}`);
    });
  });
});
