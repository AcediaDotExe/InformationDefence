function getRndPrimeNumbers() {
  const maxPrimeNumber = 200;
  const minPrimeNumber = 100;
  const generator = getPrimeNumbers(minPrimeNumber, maxPrimeNumber);
  let primeNumbers = [];
  primeNumbers[0] = generator.next().value;
  primeNumbers[1] = generator.next().value;
  return primeNumbers;
}

function isPrimeNumber(number) {
  for (let i = 2; i < number; i++) {
    if (number % i === 0) {
      return false;
    }
  }
  return true;
}

function* getPrimeNumbers(minPrimeNumber, maxPrimeNumber) {
  for (let i = minPrimeNumber; i < maxPrimeNumber; i++) {
    if (isPrimeNumber(i)) yield i;
  }
}

function getEulerFunc(p, q) {
  return (p - 1) * (q - 1);
}

function getCoprimeToEulerFunc(euler) {
  for (let i = 2; i < euler; i++) {
    if (isCoprime(i, euler)) return i;
  }
}

function isCoprime(first, second) {
  const max = Math.max(first, second);
  for (let i = 2; i < max; i++) {
    if (first % i === 0 && second % i === 0) return false;
  }
  return true;
}

function getSecretExponent(euler, exponent) {
  for (let i = 1; i < euler; i++) {
    if ((i * euler + 1) % exponent === 0) return (i * euler + 1) / exponent;
  }
}

function getKeys() {
  const [p, q] = getRndPrimeNumbers();
  const n = p * q;
  const euler = getEulerFunc(p, q);
  const exponent = getCoprimeToEulerFunc(euler);
  const secretExponent = getSecretExponent(euler, exponent);
  const openKey = [exponent, n];
  const secretKey = [secretExponent, n];
  return [openKey, secretKey];
}

exports.keys = getKeys();
