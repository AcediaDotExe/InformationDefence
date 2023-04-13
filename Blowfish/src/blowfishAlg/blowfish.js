import { blowfishData } from "./initialData.js";
import { binToStr, hexToBin, strToBin } from "../utils/conversionOperations.js";
import { bitwise32Sum, XOR } from "../utils/binaryOperations.js";

export default (function () {
  const MAX_KEY_LEN = 72;
  const MAX_AMOUNT_OF_BLOWFISH_P = 18;
  const BIT_CHUNK_LEN = 64;
  const BIT_PART_CHUNK_LEN = BIT_CHUNK_LEN / 2;
  const BYTE_SIZE = 8;

  let secretKey = [];
  let sBoxMatrix = [];

  const setKey = (key) => {
    if (key.length > MAX_KEY_LEN)
      throw new RangeError(
        `Key must have length ${MAX_KEY_LEN} letters, when yours ${key.length}`
      );
    initializeBlowfishData();
    const dividerToArray = new RegExp(".{" + BIT_PART_CHUNK_LEN + "}", "g");
    key = strToBin(increaseKeyLen(key)).match(dividerToArray);
    setInitialSecretKey(key);
    encryptKeyAndMatrix();
  };

  const encrypt = (text) => {
    const dividerToArray = new RegExp(".{1," + BIT_CHUNK_LEN + "}", "g");
    const initialBitsArray = strToBin(text).match(dividerToArray);
    initialBitsArray[initialBitsArray.length - 1] = (
      initialBitsArray[initialBitsArray.length - 1] + "0".repeat(BIT_CHUNK_LEN)
    ).substring(0, BIT_CHUNK_LEN);
    let encryptedBinText = "";
    let feistelResult;
    for (const bits of initialBitsArray) {
      feistelResult = feistelCipherEncrypt(bits);
      encryptedBinText += feistelResult.left + feistelResult.right;
    }
    return binToStr(encryptedBinText);
  };

  const decrypt = (encryptedText) => {
    const dividerToArray = new RegExp(".{1," + BIT_CHUNK_LEN + "}", "g");
    const initialBitsArray = strToBin(encryptedText).match(dividerToArray);
    let decryptedBinText = "";
    for (const bits of initialBitsArray) {
      const { left, right } = feistelCipherDecrypt(bits);
      decryptedBinText += left + right;
    }
    return binToStr(decryptedBinText);
  };

  function feistelCipherEncrypt(initialBits) {
    const partLen = initialBits.length / 2;
    let left = initialBits.substring(0, partLen);
    let right = initialBits.substring(partLen, initialBits.length);
    for (let i = 0; i < MAX_AMOUNT_OF_BLOWFISH_P - 2; i++) {
      left = XOR(left, secretKey[i]);
      right = XOR(feistelFunction(left), right);
      [left, right] = swap(left, right);
    }
    [left, right] = swap(left, right);
    left = XOR(left, secretKey[17]);
    right = XOR(right, secretKey[16]);
    return {
      left,
      right,
    };
  }

  function feistelCipherDecrypt(encryptedBits) {
    const partLen = encryptedBits.length / 2;
    let left = encryptedBits.substring(0, partLen);
    let right = encryptedBits.substring(partLen, encryptedBits.length);
    left = XOR(left, secretKey[17]);
    right = XOR(right, secretKey[16]);
    for (let i = MAX_AMOUNT_OF_BLOWFISH_P - 3; i >= 0; i--) {
      right = XOR(feistelFunction(left), right);
      left = XOR(left, secretKey[i]);
      [left, right] = swap(left, right);
    }
    [left, right] = swap(left, right);
    return {
      left,
      right,
    };
  }

  function feistelFunction(bit32str) {
    const dividerToArray = new RegExp(".{" + BYTE_SIZE + "}", "g");
    const bit8arr = bit32str.match(dividerToArray);
    const decimal8arr = bit8arr.map((el) => parseInt(el, 2));
    const sBox = [];
    for (let i = 0; i < decimal8arr.length; i++) {
      sBox[i] = hexToBin(sBoxMatrix[i][decimal8arr[i]]);
    }
    const res = XOR(bitwise32Sum(sBox[0], sBox[1]), sBox[2]);
    return bitwise32Sum(res, sBox[3]);
  }

  function initializeBlowfishData() {
    for (let i = 0; i < MAX_AMOUNT_OF_BLOWFISH_P; i++) {
      blowfishData.P[i] = hexToBin(blowfishData.P[i]);
    }
    for (let i = 0; i < blowfishData.S.length; i++) {
      sBoxMatrix[i] = [];
      for (let j = 0; j < blowfishData.S[i].length; j++) {
        sBoxMatrix[i][j] = hexToBin(blowfishData.S[i][j]);
      }
    }
  }

  function encryptKeyAndMatrix() {
    encryptKey();
    encryptSBox();
  }

  function encryptKey() {
    const initialStr = "0".repeat(BIT_CHUNK_LEN);
    let feistelResult = feistelCipherEncrypt(initialStr);
    secretKey[0] = feistelResult.left;
    secretKey[1] = feistelResult.right;
    for (let i = 2; i < MAX_AMOUNT_OF_BLOWFISH_P; i += 2) {
      feistelResult = feistelCipherEncrypt(secretKey[i - 2] + secretKey[i - 1]);
      secretKey[i] = feistelResult.left;
      secretKey[i + 1] = feistelResult.right;
    }
  }

  function encryptSBox() {
    let feistelResult;
    for (let i = 0; i < blowfishData.S.length; i++) {
      for (let j = 0; j < blowfishData.S[i].length; j += 2) {
        feistelResult = feistelCipherEncrypt(
          sBoxMatrix[i][j] + sBoxMatrix[i][j + 1]
        );
        sBoxMatrix[i][j] = feistelResult.left;
        sBoxMatrix[i][j + 1] = feistelResult.right;
      }
    }
  }

  function setInitialSecretKey(key) {
    for (let i = 0; i < MAX_AMOUNT_OF_BLOWFISH_P; i++) {
      secretKey[i] = XOR(key[i], blowfishData.P[i]);
    }
  }

  function increaseKeyLen(key) {
    while (key.length < MAX_KEY_LEN) {
      key += key;
    }
    return key.substring(0, MAX_KEY_LEN);
  }

  function swap(a, b) {
    return [b, a];
  }

  return {
    setKey,
    encrypt,
    decrypt,
  };
})();
