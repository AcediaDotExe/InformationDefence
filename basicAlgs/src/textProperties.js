let fs = require("fs");
function getFileInfo(filePath) {
  let stats = fs.statSync(filePath);
  if (stats) {
    return stats;
  }
}

function readBytes(filePath) {
  fs.readFile(filePath, function (err, data) {
    if (err) throw err;
    const bytes = [...data];
    const bytesFreq = {};
    for (const byte of bytes) {
      bytesFreq[byte] = bytesFreq[byte] ? bytesFreq[byte] + 1 : 1;
    }
    const sortedByFreq = [];
    for (let i = 0; i < 256; i++) {
      sortedByFreq.push([i, bytesFreq[i]]);
    }
    sortedByFreq.sort((a, b) => {
      return b[1] - a[1];
    });
    for (const byteInfo of sortedByFreq) {
      console.log(byteInfo[0] + ": " + byteInfo[1]);
    }
  });
}

function main() {
  // const filePath = "../template.doc";
  // console.log(`File size: ${getFileInfo(filePath).size} bytes`);
  // readBytes(filePath);
}
main();
