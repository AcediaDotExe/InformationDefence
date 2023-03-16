const fs = require("fs");

function readFromFile(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (err) {
    throw err;
  }
}

function getEncryptedText(text, key) {
  const columns = key.length;
  let matrix = createMatrixWithKeys(text, key, columns);
  let keyIndex;
  let encryptedText = "";
  key = Array.from(key);
  for (let j = 1; j <= columns; j++) {
    keyIndex = key.indexOf(String(j));
    for (let i = 1; i < matrix.length; i++) {
      encryptedText += matrix[i][keyIndex];
    }
  }
  // console.log(matrix)
  return encryptedText;
}

function createMatrixWithKeys(text, key, columns) {
  const arr = [Array.from(key)];
  let buffArray = [];
  for (let i = 0; i < text.length; i++) {
    buffArray.push(text[i]);
    if (i === text.length - 1) {
      while (buffArray.length !== columns) {
        buffArray.push("z");
      }
      arr.push(buffArray);
    }
    if ((i + 1) % columns === 0) {
      arr.push(buffArray);
      buffArray = [];
    }
  }
  return arr;
}

function getDecryptedText(encryptedText, key) {
  const columns = key.length;
  let chuckLen = encryptedText.length / columns;
  let recombinationMatrix = [];
  let buffArray = [];
  const decryptedMatrix = [];
  for (let i = 0; i < encryptedText.length; i++) {
    buffArray.push(encryptedText[i]);
    if (buffArray.length === chuckLen) {
      recombinationMatrix.push(buffArray);
      buffArray = [];
    }
  }
  key = Array.from(key);
  for (let i = 0; i < chuckLen; i++) {
    for (let j = 0; j < columns; j++) {
      let keyIndex = key[j] - 1;
      decryptedMatrix.push(recombinationMatrix[keyIndex][i]);
    }
  }
  let decryptedText = decryptedMatrix.join("");
  let countOfEndingSymbols = 0;
  for (
    let i = decryptedText.length - 1;
    i > decryptedText.length - columns - 1;
    i--
  ) {
    if (decryptedText[i] === "z") {
      countOfEndingSymbols++;
    }
  }
  decryptedText = decryptedText.substring(
    0,
    decryptedText.length - countOfEndingSymbols
  );
  return decryptedText;
}

function main() {
  const filePath = "../crpExample.txt";
  const keyPath = "../key.txt";
  const text = readFromFile(filePath);
  const key = readFromFile(keyPath);
  const encryptedText = getEncryptedText(text, key);
  const decryptedText = getDecryptedText(encryptedText, key);
  console.log("key: " + key);
  console.log("initial text: " + text);
  console.log("encrypted text: " + encryptedText);
  console.log("decrypted text: " + decryptedText);
}

main();
