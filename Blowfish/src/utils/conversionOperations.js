function hexToBin(hex) {
  return hex.toString(2).padStart(32, "0");
}

function strToBin(str) {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    result += charToBin(str[i]);
  }
  return result;
}

function binToStr(bin) {
  let result = "";
  for (let i = 0; i < bin.length; i += 8) {
    result += binToChar(bin.substring(i, i + 8));
  }
  return result;
}

function binToChar(bin) {
  return String.fromCharCode(parseInt(bin, 2));
}

function charToBin(char) {
  let result = "";
  for (let i = 0; i < char.length; i++) {
    result += char.charCodeAt(i).toString(2).padStart(8, "0");
  }
  return result;
}

export { charToBin, binToStr, strToBin, hexToBin, binToChar };
