const mongoose = require("mongoose");

const familySchema = new mongoose.Schema({
  name: String,
  bloodGroup: String,
  relationship: String,
  dob: String,
  idMark: String,
}, { _id: false });

const formSchema = new mongoose.Schema({
  name: String,
  designation: String,
  emp_no: String,
  dob: String,
  department: String,
  station: String,
  bill_unit: String,
  address: String,
  mobile: String,
  rly_contact: String,
  reason: String,
  emergency_name: String,
  emergency_number: String,
  familyMembers: [familySchema],
  uploadedFiles: {
    photo: String,
    signature: String,
    hindi_photo: String,
    hindi_signature: String,
  },
  gazetted: {
    type: String,
    enum: ["Gazetted", "Non-Gazetted"],
    default: "Non-Gazetted",
  },
  status: { type: String, default: "Pending" },
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Form", formSchema);
