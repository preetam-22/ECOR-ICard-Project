const fs = require("fs");
const path = require("path");

function fullUploadPath(fname) {
  if (!fname) return "";
  if (path.isAbsolute(fname) || fname.startsWith("http")) return fname;
  return fname.startsWith("uploads/")
    ? path.join(__dirname, "..", fname)
    : path.join(__dirname, "..", "uploads", fname);
}

function fileToDataURI(filePath) {
  try {
    const data = fs.readFileSync(filePath);
    const ext = path.extname(filePath).substring(1) || "png";
    return `data:image/${ext};base64,${data.toString("base64")}`;
  } catch {
    console.warn("⚠️ Missing image:", filePath);
    return "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
  }
}

module.exports = { fullUploadPath, fileToDataURI };
