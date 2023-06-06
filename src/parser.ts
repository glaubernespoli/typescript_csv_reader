import * as fs from "fs";
import { argv } from "node:process";
import * as rl from "readline";
import { weakEscapeDoubleQuotes } from "./utils/escapeUtils";

/**
 * Interface containing the data of a CSV header.
 */
interface CsvHeader {
  values: Record<number, string>;
  numberOfFields: number;
}

/**
 * Public method of the API. Parses a CSV file sourced from a stream. Defaults the encoding to UTF-8 and the field separator to ','.
 * **Personal Note:** I could have created an interface to receive values such as encoding, field separator, line separator etc. and pass is as a parameter
 * but given the specification I didn't find it necessary.
 * @param inputStream the stream of the CSV file.
 * @returns a Promise containing an array of Records. Each record represents a line of the CSV file, containing the values of each field.
 */
export function csvParser(inputStream: NodeJS.ReadableStream): Promise<Array<Record<string, string>>> {
  inputStream.setEncoding("utf8");

  return parseCsvFile(inputStream);
}

/**
 * Creates a ReadLine Interface. The ReadLine is a default module from Node, and is responsible for reading line by line on the CSV file.
 * More at: https://nodejs.org/api/readline.html#readlinepromisescreateinterfaceoptions
 * @param inputStream the stream of the CSV file.
 * @returns a basic interface for reading line by line
 */
function createReadLineInterface(inputStream: NodeJS.ReadableStream): rl.Interface {
  return rl.createInterface({
    input: inputStream,
    crlfDelay: Infinity,
  });
}

/**
 * Returns a regex to split the lines of the CSV file into blocks. Splits line by comma, double quotes are considered.
 * Explanation: https://regexr.com/7esa1
 * @returns a regex to get the fields on the line
 */
function getLineSplitterRegex(): RegExp {
  return /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
}

/**
 * Reads the first line of the CSV file (the header), and returns a CsvHeader.
 * @param rli the readLine interface
 * @returns a CsvHeader, containing a record of each header of the file plus the number of data fields present in the CSV file.
 */
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

/**
 * Parses the CSV file, reading each line and returning an array containing the data of each line (header exluded).
 * @param inputStream the stream of the CSV file.
 * @returns an array containing the data of each line
 */
async function parseCsvFile(inputStream: NodeJS.ReadableStream): Promise<Array<Record<string, string>>> {
  const rli = createReadLineInterface(inputStream);

  const header = await getCsvHeader(rli);
  return processDataLineByLine(rli, header);
}

/**
 * Iterates through each line of data from the CSV file. The header was already processed, so it's ignored here.
 * @param rli the readLine interface
 * @param header the CsvHeader data
 * @returns an array containing the data of each line
 */
async function processDataLineByLine(rli: rl.Interface, header: CsvHeader): Promise<Array<Record<string, string>>> {
  const re = getLineSplitterRegex();
  const data: Array<Record<string, string>> = [];

  let lineNumber = 1;
  for await (const line of rli) {
    const splitLine = line.split(re);
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
        lineData[headerName] = weakEscapeDoubleQuotes(value);
      }
    });

    data.push(lineData);
    lineNumber++;
  }

  return data;
}

//CLI execution
const filePath = argv[2];
exec(filePath);

/**
 * Function executed as a CLI command.
 * @param filePath The path of the CSV file
 */
async function exec(filePath: string | undefined) {
  if (!filePath) {
    throw new SyntaxError("The path of the CSV file must be provided.");
  }

  const buffer = Buffer.from(filePath);
  const fileStream = fs.createReadStream(buffer);

  const result = await csvParser(fileStream);

  console.log(result);
}
