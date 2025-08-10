const express = require("express");
const upload = require("../middlewares/upload");
const {
  submitForm,
  getApplications,
  updateStatus,
  downloadPDF,
  previewHTML,
  printAll,
  checkStatus,
} = require("../controllers/formController");

const router = express.Router();

router.post("/submit", upload.fields([
  { name: "photo" },
  { name: "signature" },
  { name: "hindi_photo" },
  { name: "hindi_signature" },
]), submitForm);

router.get("/applications", getApplications);
router.patch("/status/:id", updateStatus);
router.get("/download/:id", downloadPDF);
router.get("/preview/:id", previewHTML);
router.get("/print-all/:type", printAll);
router.get("/status-check", checkStatus);

module.exports = router;
