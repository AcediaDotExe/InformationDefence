const fs = require("fs");
const pathToInitialText = "../template.txt";
const pathToEncryptedText = "../encodedTemplate.txt";

const { getKeys } = require("./RSAKeys");

function readFromFile(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (err) {
    throw err;
  }
}

function writeToFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content);
  } catch (err) {
    console.error(err);
  }
}

function getEncryptedText(initialText, [exponent, n]) {
  let encryptedText = "";
  for (let i = 0; i < initialText.length; i++) {
    encryptedText += BigInt(initialText.charCodeAt(i)) ** BigInt(exponent) % BigInt(n);
    if (i !== initialText.length - 1) encryptedText += ", ";
  }
  return encryptedText;
}

function Encrypt(initialText, openKey) {
  const encryptedText = getEncryptedText(initialText, openKey);
  writeToFile(pathToEncryptedText, encryptedText);
  return encryptedText;
}

function Decrypt(secretKey) {
  const encryptedText = readFromFile(pathToEncryptedText);
  return getDecryptedText(secretKey, encryptedText);
}

function getDecryptedText([secretExponent, n], encryptedText){
  encryptedText = encryptedText.split(",");
  let decryptedText = "";
  for (let i = 0; i < encryptedText.length; i++) {
    const EncryptedSymbolCode = Number(encryptedText[i]);
    const symbolCode = BigInt(EncryptedSymbolCode) ** BigInt(secretExponent) % BigInt(n);
    decryptedText += String.fromCharCode(Number(symbolCode));
  }
  return decryptedText;
}



function main() {
  const initialText = readFromFile(pathToInitialText);

  const [openKey, secretKey] = require("./RSAKeys").keys;
  console.log("Open key: ", openKey);
  console.log("Secret key: ", secretKey);

  const encryptedText = Encrypt(initialText, openKey);
  const decryptedText = Decrypt(secretKey);

  console.log("Initial text\n" + initialText);
  console.log("Encrypted text\n" + encryptedText);
  console.log("Decrypted text\n" + decryptedText);
}

main();
