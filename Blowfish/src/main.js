import blowfish from "./blowfishAlg/blowfish.js";

function main() {
  const initialText =
    "It is during our darkest moments that we must focus to see the light.";
  blowfish.setKey("Please kill me");

  const encryptedText = blowfish.encrypt(initialText);
  const decryptedText = blowfish.decrypt(encryptedText);

  blowfish.setKey("WRONG KEY");
  const wrongDecryptedText = blowfish.decrypt(encryptedText);

  console.log("Initial text: " + initialText);
  console.log("Encrypted text: " + encryptedText);
  console.log("Decrypted text: " + decryptedText);
  console.log("Decrypted with wrong key: " + wrongDecryptedText);
}

main();
