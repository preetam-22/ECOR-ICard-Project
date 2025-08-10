const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const suffixMap = {
      photo: "photo",
      signature: "signature",
      hindi_photo: "hindi_photo",
      hindi_signature: "hindi_signature",
    };
    const empNo = req.body.emp_no || "unknown";
    const ext = file.originalname.split(".").pop();
    const suffix = suffixMap[file.fieldname] || "file";
    cb(null, `${empNo}_${suffix}.${ext}`);
  },
});

module.exports = multer({ storage });
