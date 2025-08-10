const Form = require("../models/form");
const puppeteer = require("puppeteer");
const { fileToDataURI, fullUploadPath } = require("../utils/fileHelpers");
const { generatePDFHTML, generateHTML2 } = require("../utils/htmlTemplates");

// Submit form
exports.submitForm = async (req, res) => {
  try {
    const familyMembers = JSON.parse(req.body.familyMembers || "[]");

    const formData = {
      name: req.body.name,
      designation: req.body.designation,
      emp_no: req.body.emp_no,
      dob: req.body.dob,
      department: req.body.department,
      station: req.body.station,
      bill_unit: req.body.bill_unit,
      address: req.body.address,
      mobile: req.body.mobile,
      rly_contact: req.body.rly_contact,
      reason: req.body.reason,
      emergency_name: req.body.emergency_name,
      emergency_number: req.body.emergency_number,
      familyMembers,
      uploadedFiles: {
        photo: req.files["photo"]?.[0]?.filename || null,
        signature: req.files["signature"]?.[0]?.filename || null,
        hindi_photo: req.files["hindi_photo"]?.[0]?.filename || null,
        hindi_signature: req.files["hindi_signature"]?.[0]?.filename || null,
      },
      gazetted: req.body.gazetted || "Non-Gazetted",
    };

    const newForm = new Form(formData);
    await newForm.save();

    res.status(200).send("Form submitted and saved to MongoDB successfully!");
  } catch (error) {
    console.error("❌ Error in /submit:", error);
    res.status(500).send("Failed to submit form.");
  }
};

// Get all applications with filters
exports.getApplications = async (req, res) => {
  const { from, to, status, gazetted } = req.query;
  const query = {};

  if (from && to) {
    query.submittedAt = {
      $gte: new Date(from),
      $lte: new Date(to + "T23:59:59Z"),
    };
  }
  if (status) query.status = status;
  if (gazetted) query.gazetted = gazetted;

  try {
    const forms = await Form.find(query).sort({ submittedAt: -1 });
    res.json(forms);
  } catch (err) {
    console.error("❌ MongoDB error:", err);
    res.status(500).json({ error: "Error fetching data" });
  }
};

// Update application status
exports.updateStatus = async (req, res) => {
  try {
    await Form.findByIdAndUpdate(req.params.id, { status: req.body.status });
    res.send("Status updated successfully.");
  } catch (err) {
    console.error("❌ Status update error:", err);
    res.status(500).send("Update failed.");
  }
};

// Download ID Card as PDF
exports.downloadPDF = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id).lean();
    if (!form) return res.status(404).send("Form not found");

    form.photoDataURI = fileToDataURI(fullUploadPath(form.uploadedFiles.photo));
    form.signatureDataURI = fileToDataURI(fullUploadPath(form.uploadedFiles.signature));

    const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(generatePDFHTML(form), { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      width: "960px",
      height: "560px",
      printBackground: true,
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="id_card_${form.emp_no}.pdf"`,
      "Content-Length": pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("❌ PDF Error:", err);
    res.status(500).send("PDF generation failed.");
  }
};

// Preview form as HTML
exports.previewHTML = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id).lean();
    if (!form) return res.status(404).send("Form not found");

    res.send(generateHTML2(form));
  } catch (err) {
    console.error("❌ Preview Error:", err);
    res.status(500).send("Preview failed.");
  }
};

// Print all pending applications of a type
exports.printAll = async (req, res) => {
  const gazettedType = req.params.type === "Gazetted" ? "Gazetted" : "Non-Gazetted";

  try {
    const forms = await Form.find({ gazetted: gazettedType, status: "Pending" }).sort({ submittedAt: -1 }).lean();

    const content = forms.map((form, idx) => generateHTML2(form)).join("");
    res.send(`<html><body>${content}</body></html>`);
  } catch (err) {
    console.error("❌ Print All Error:", err);
    res.status(500).send("Print preview failed.");
  }
};

// Check form status
exports.checkStatus = async (req, res) => {
  const { emp_no, dob } = req.query;
  if (!emp_no || !dob) return res.status(400).json({ success: false, message: "Missing parameters" });

  try {
    const form = await Form.findOne({ emp_no: emp_no.trim(), dob: dob.trim() });
    if (form) {
      res.json({ success: true, status: form.status, gazetted: form.gazetted });
    } else {
      res.json({ success: false, message: "Form not found" });
    }
  } catch (err) {
    console.error("❌ Status Check Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
