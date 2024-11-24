const mongoose = require("mongoose");
const moduleListingSchema = mongoose.Schema(
  {
    email:{type:String,required:true},
    name: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pinCode: { type: String, required: true }
    },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    Bhktype: { type: String, required: true },
    owner: { type: String, required: true },
    price:{type:Number,required:true}
  },
  { timestamps: true }
);
moduleListingSchema.index({ name: "text", description: "text", owner: "text" });
module.exports = mongoose.model("modulelister",moduleListingSchema);
