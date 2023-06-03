import * as fs from "fs";
import * as path from "path";
import * as rl from "readline";

export function csvParser(inputStream: NodeJS.ReadableStream): Promise<Array<Record<string, string>>> {
  inputStream.setEncoding("utf8");

  //TODO fix
  return new Promise((_resolve, _reject) => {
    processLineByLine(inputStream);
  });
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

// function processLine(line: string, splitter: RegExp, lineNumber:number, numberOfFields:number) {
//   const splitLine = line.split(splitter);
//   if (lineNumber == 1) {
//     numberOfFields = splitLine.length;
//   } else if (splitLine.length != numberOfFields) {
//     console.log(
//       `Rejecting line [${lineNumber}], invalid number or arguments. Expected: [${numberOfFields}], found [${splitLine.length}]`
//     );
//   }
// }
async function processLineByLine(inputStream: NodeJS.ReadableStream) {
  const rli = createReadLineInterface(inputStream);
  const re = getLineSplitterRegex();

  let lineNumber = 1;
  let numberOfFields = 0;

  for await (const line of rli) {
    const splitLine = line.split(re);
    if (lineNumber == 1) {
      numberOfFields = splitLine.length;
    } else if (splitLine.length != numberOfFields) {
      console.log(
        `Rejecting line [${lineNumber}], invalid number or arguments. Expected: [${numberOfFields}], found [${splitLine.length}]`
      );

      //DO SOMETHING
    }
    // console.log({
    //   lineNumber: lineNumber++,
    //   data: splitLine,
    // });
  }
  // line.on("line", (data) => {
  //   const lineData = data.split(re);
  //   console.log(lineData);
  // });

  //await once(line, "close");
}

// var read = async (inputStream: ReadableStream<Buffer>): Promise<ReadableStreamReadResult<Buffer>> => {
//   return inputStream.getReader().read();
// };

// async function* makeTextFileLineIterator(buffer: Buffer) {
//   const utf8Decoder = new TextDecoder("utf-8");
//   // Initiate the source
//   var bufferStream = new Stream.PassThrough();
//   bufferStream.end(buffer);

//   bufferStream.pipe(process.stdout);

//   //   let reader = response.body.getReader();
//   //   let { value, done: readerDone } = await reader.read();
//   //   let chunk = value ? utf8Decoder.decode(value, { stream: true }) : "";

//   //   let re = /\r\n|\n|\r/gm;
//   //   let startIndex = 0;

//   //   for (;;) {
//   //     let result = re.exec(chunk);
//   //     if (!result) {
//   //       if (readerDone) {
//   //         break;
//   //       }
//   //       let remainder = chunk.substr(startIndex);
//   //       ({ value, done: readerDone } = await reader.read());
//   //       chunk = remainder + (value ? utf8Decoder.decode(value, { stream: true }) : "");
//   //       startIndex = re.lastIndex = 0;
//   //       continue;
//   //     }
//   //     yield chunk.substring(startIndex, result.index);
//   //     startIndex = re.lastIndex;
//   //   }
//   //   if (startIndex < chunk.length) {
//   //     // last line didn't end in a newline char
//   //     yield chunk.substr(startIndex);
//   //   }
// }

async function test() {
  const csvFilePath = path.resolve(__dirname, "../test/data/example.csv");
  // const fileContent = fs.readFileSync(csvFilePath, { encoding: "utf-8" });
  const buffer = Buffer.from(csvFilePath);
  // const fileStream = Readable.from(buffer, {
  //   encoding: "utf8",
  // });
  const fileStream = fs.createReadStream(buffer);
  csvParser(fileStream);

  // const buffer = Buffer.from(fileContent);
  // for await (let line of makeTextFileLineIterator(buffer)) {
  //   console.log(line);
  // }
}

// function readFile(path: string): Buffer {
//     return fs.readFile(path, { encoding: "utf8" }, (err, data) => {

//     })
// }

test();
