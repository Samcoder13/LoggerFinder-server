const mongoose = require("mongoose");

const bulkUploadError = mongoose.Schema({
  uploadId: { type: String, required: true },
  rowNo: { type: Number, required: true },
  errormessage: { type: [String], required: true },
});

module.exports = mongoose.model("bulkUploadError", bulkUploadError);
