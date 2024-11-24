const mongoose=require('mongoose');


const bulkUploadSchema=mongoose.Schema({
    _id: { type: String, required: true },//
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    noOfItemsToBeUpload: { type: Number, required: true },
    filename: { type: String, required: true },
    successfullyUpload: { type: Number, required: true },
    failedDuringUpload: { type: Number, required: true },
  },
  { timestamps: true}
);

module.exports=mongoose.model('bulkupload',bulkUploadSchema);