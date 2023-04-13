function bitwise32Sum(op1, op2) {
  if (op1.length !== 32 && op2.length !== 32)
    throw new RangeError("Operands must have 32 length");
  let result = "";
  let transferBit = 0;
  let bitwiseSumResult = 0;
  for (let i = op1.length - 1; i >= 0; i--) {
    bitwiseSumResult = bitwiseSum(op1[i], op2[i], transferBit);
    transferBit = bitwiseSumResult.transferBit;
    result += bitwiseSumResult.value;
  }
  return result.split("").reverse().join("");
}

function bitwiseSum(op1, op2, transferBit) {
  if (op1.length !== 1 || op2.length !== 1)
    throw new RangeError("Operands must consist of single number");
  const value = +op1 + +op2 + +transferBit;
  const newTransferBit = value > 1 ? 1 : 0;
  return {
    value: value % 2,
    transferBit: newTransferBit,
  };
}

function XOR(op1, op2) {
  if (op1.length !== op2.length)
    throw new RangeError("Operands must have same size");
  let result = "";
  for (let i = 0; i < op1.length; i++) {
    result += op1[i] ^ op2[i];
  }
  return result;
}

export { XOR, bitwiseSum, bitwise32Sum };
