import * as fs from "fs";
import * as path from "path";
import * as rl from "readline";

interface CsvHeader {
  values: Record<number, string>;
  numberOfFields: number;
}

export function csvParser(inputStream: NodeJS.ReadableStream): Promise<Array<Record<string, string>>> {
  inputStream.setEncoding("utf8");

  return processLineByLine(inputStream);
}

function createReadLineInterface(inputStream: NodeJS.ReadableStream): rl.Interface {
  return rl.createInterface({
    input: inputStream,
    crlfDelay: Infinity,
  });
}

function getLineSplitterRegex(): RegExp {
  //explanation: https://regexr.com/7esa1
  //splits line by comma, double quotes are considered
  return /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
}

async function getCsvHeader(rli: rl.Interface): Promise<CsvHeader> {
  const re = getLineSplitterRegex();
  const headersStr: string = (await rli[Symbol.asyncIterator]().next()).value;

  const headers = headersStr.split(re);
  const headerRecord: Record<number, string> = {};

  headers.forEach((value, index) => {
    headerRecord[index] = value;
  });

  return {
    values: headerRecord,
    numberOfFields: headers.length,
  };
}

async function processLineByLine(inputStream: NodeJS.ReadableStream): Promise<Array<Record<string, string>>> {
  const rli = createReadLineInterface(inputStream);
  const re = getLineSplitterRegex();

  const header = await getCsvHeader(rli);
  const data: Array<Record<string, string>> = [];

  let lineNumber = 1;
  let splitLine: string[];

  for await (const line of rli) {
    splitLine = line.split(re);
    if (splitLine.length != header.numberOfFields) {
      console.log(
        `Rejecting line [${lineNumber}], invalid number or arguments. Expected: [${header.numberOfFields}], found [${splitLine.length}]`
      );
      continue;
    }

    const lineData: Record<string, string> = {};
    splitLine.forEach((value, index) => {
      const headerName = header.values[index];
      if (headerName) {
        lineData[headerName] = value;
      }
    });

    data.push(lineData);
    lineNumber++;
  }

  return data;
}

export default async function test() {
  const csvFilePath = path.resolve(__dirname, "../test/data/example.csv");
  const buffer = Buffer.from(csvFilePath);
  const fileStream = fs.createReadStream(buffer);

  const result = await csvParser(fileStream);

  console.log(result);
}
