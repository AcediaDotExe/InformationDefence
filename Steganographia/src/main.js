const fs = require("fs");

const startBitmapIndex = 54;

function readImageBytes(filePath) {
  const fd = fs.openSync(filePath, "r");
  return fs.readFileSync(fd);
}

function decodeImageBytes(fileBytes) {
  const hex = bufferToHex(fileBytes);
  let decodedImageBits = "";
  for (let i = startBitmapIndex; i < hex.length; i += 4) {
    decodedImageBits += hexToBin(hex[i + 2]).substring(6, 8);
    decodedImageBits += hexToBin(hex[i + 1]).substring(6, 8);
    decodedImageBits += hexToBin(hex[i]).substring(6, 8);
    decodedImageBits += hexToBin(hex[i + 3]).substring(6, 8);
    if (decodedImageBits.substr(decodedImageBits.length - 8) === "11111111") {
      break;
    }
    decodedImageBits += " ";
  }
  return binaryStrToString(decodedImageBits);
}

function writeBytesToImage(filePath, writeData) {
  const writeDataBits = prepareWriteData(writeData);
  let initialHex = prepareInitialBitmapData(filePath);
  let finalBits = encryptTextInImgBytes(writeDataBits, initialHex);

  finalBits = finalBits.join("");
  const buffer = new Buffer.from(
    finalBits.match(/../g).map((h) => parseInt(h, 16))
  );

  writeBufferToFile(filePath, buffer);
}

function prepareWriteData(writeData) {
  let writeDataBits = toHex(writeData).split(" ");
  writeDataBits[writeDataBits.length - 1] = "ff";
  for (let i = 0; i < writeDataBits.length; i++) {
    writeDataBits[i] = hexToBin(writeDataBits[i]);
  }
  return writeDataBits;
}

function prepareInitialBitmapData(filePath) {
  let initialImgBytes = readImageBytes(filePath);
  return bufferToHex(initialImgBytes);
}

function encryptTextInImgBytes(writeDataBits, hex) {
  let binary = "";
  for (let i = 0; i < 54; i++) {
    binary += hexToBin(hex[i]) + " ";
  }
  let wI = 0;
  for (let i = startBitmapIndex; i < hex.length; i += 4) {
    if (writeDataBits[wI]) {
      binary +=
        hexToBin(hex[i]).substring(0, 6) +
        writeDataBits[wI].substring(4, 6) +
        " ";
      binary +=
        hexToBin(hex[i + 1]).substring(0, 6) +
        writeDataBits[wI].substring(2, 4) +
        " ";
      binary +=
        hexToBin(hex[i + 2]).substring(0, 6) +
        writeDataBits[wI].substring(0, 2) +
        " ";
      binary +=
        hexToBin(hex[i + 3]).substring(0, 6) +
        writeDataBits[wI].substring(6, 8) +
        " ";
      wI++;
    } else {
      binary += hexToBin(hex[i]) + " ";
      binary += hexToBin(hex[i + 1]) + " ";
      binary += hexToBin(hex[i + 2]) + " ";
      binary += hexToBin(hex[i + 3]) + " ";
    }
  }

  binary = binary.split(" ");
  for (let i = 0; i < binary.length; i++) {
    binary[i] = parseInt(binary[i], 2).toString(16);
    if (binary[i].length === 1) {
      binary[i] = "0" + binary[i];
    }
  }
  return binary;
}

function writeBufferToFile(filePath, buffer) {
  fs.writeFile(filePath, buffer, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
}

function bufferToHex(buffer) {
  let hex = "";
  buffer = buffer.toString("hex");
  for (let i = 0; i < buffer.length; i += 2) {
    hex += buffer[i];
    hex += buffer[i + 1];
    hex += " ";
  }
  return hex.split(" ");
}

function binaryStrToString(str) {
  var binString = "";
  str = str.split(" ");
  str.pop();
  str.map(function (bin) {
    binString += String.fromCharCode(parseInt(bin, 2));
  });
  return binString;
}

function hexToBin(hex) {
  return parseInt(hex, 16).toString(2).padStart(8, "0");
}

function toHex(str) {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    result += str.charCodeAt(i).toString(16);
    result += " ";
  }
  return result;
}

(function main() {
  const filePath = "D:\\MIET\\3.2\\information_defence\\Steganographia\\5.bmp";
  const text =
    '"It is during our darkest moments that we must focus to see the light." -Aristotle';
  const fileBytes = readImageBytes(filePath);
  const decodedText = decodeImageBytes(fileBytes);

  writeBytesToImage(filePath, text);
  console.log("Decoded: " + decodedText);
})();
