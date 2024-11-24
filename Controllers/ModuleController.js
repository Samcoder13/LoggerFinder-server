const SystemResponse = require("../utils/response-handler/SystemResponse");
const detailofproperty = require("../models/moduleListingSchema");
const logger = require("../utils/logger");
const csv = require("@fast-csv/parse");
const fs = require("fs");
const path = require("path");
const Validation = require("../middlewares/Validation");
const bulkErrorModel = require("../models/bulkUploadErrorSchema");
const bulkUpload = require("../models/bulkUploadSchema");
const mongoose = require("mongoose");
class ModuleController {
  static async getall(req, res) {
    try {
      logger.info("Controller getall ");
      const { page = 1, limit = 5, filter, search } = req.query;
      const query = {};
      if (filter) {
        query.Bhktype = filter;
      }
      if (search) {
        query.$text = { $search: search };
      }
      const data = await detailofproperty
        .find(query)
        .select("-address -startDate -endDate -createdAt -updatedAt -__v")
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      // const totalCount = await detailofproperty.find(query).count();
      const totalCount = await detailofproperty.countDocuments(query);

      return res
        .status(200)
        .send(
          SystemResponse.success(
            "Data Retrieved Successfully",
            data,
            totalCount
          )
        );
    } catch (error) {
      logger.error(`Error in getall api: ${error}`);
      return res
        .status(500)
        .send(SystemResponse.getErrorResponse(error.message, error));
    }
  }

  static async getbyid(req, res) {

    try {

      logger.info(" Controller - start getById");
      const { id } = req.params;
      if (!mongoose.isValidObjectId(id)) {
        return res.status(422).send(SystemResponse.invalidData("Invalid ID"));
      }
      const response = await detailofproperty
        .find({ _id: id })
        .select({ __v: 0, createdAt: 0, updatedAt: 0 });

      if (response.length !== 0) {
        return res
          .status(200)
          .send(
            SystemResponse.success("Data retrieved Successfully", response)
          );
      }

      logger.info(" Controller - end getById");
      return res.status(404).send(SystemResponse.notFound("Data not found"));
    } catch (error) {
      logger.error(` Controller - getById :${error}`);
      return res
        .status(500)
        .json(
          SystemResponse.getErrorResponse(
            error?.message,
            "Error in finding an module by id",
            error
          )
        );
    }
  }

  static async getbulk(req, res) {
    try {
      logger.info(" Controller - getBulk");

      const { page = 1, limit = 5 } = req.query;
      const response = await bulkUpload
        .find({})
        .select("-createdAt,-updatedAt")
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
      const totalCount = await bulkUpload.countDocuments({});

      return res
        .status(200)
        .send(
          SystemResponse.success(
            "Data Retrieved Successfully",
            response,
            totalCount
          )
        );
    } catch (error) {
      logger.error(` Controller - getBulk: ${error}`);
      return res
        .status(500)
        .send(
          SystemResponse.getErrorResponse(
            error?.message || "error in getting bulk uploaded data",
            error
          )
        );
    }
  }

  static async getbyuploadid(req, res) {
    try {
      logger.info(`Controller - getbyuploadid`);

      const { page = 1, limit = 5 } = req.query;
      const { uploadId } = req.params;
      const response = await bulkErrorModel
        .find({ uploadId })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
      const totalCount = await bulkErrorModel.countDocuments({uploadId});

      return res
        .status(200)
        .send(
          SystemResponse.success(
            "Data Retrieved Successfully",
            response,
            totalCount
          )
        );
    } catch (error) {
      logger.error(` Controller - getbyuploadid : ${error}`);
      return res
        .status(500)
        .send(
          SystemResponse.getErrorResponse(
            error?.message || "error in getting the logs",
            error
          )
        );
    }
  }
  static async add(req, res) {
    try {
      logger.info("Controller add ");
      const {
        email,
        name,
        address,
        description,
        startDate,
        endDate,
        Bhktype,
        owner,
        price,
      } = req.body;

      const newdetailsofproperty = await detailofproperty.create({
        email,
        name,
        address,
        description,
        startDate,
        endDate,
        Bhktype,
        owner,
        price,
      });
      return res
        .status(201)
        .send(
          SystemResponse.createsuccess(
            "Data Retrieved Successfully",
            newdetailsofproperty
          )
        );
    } catch (error) {
      logger.error(`Controller add :${error}`);
      return res
        .status(500)
        .send(SystemResponse.getErrorResponse(error.message, error));
    }
  }

  static async uploadValidData(validData) {
    logger.info(" Controller uploadValidData ");
    let currentIndex = 0;
    while (currentIndex < validData.length) {
      const chunk = validData.slice(currentIndex, currentIndex + 100000);
      await detailofproperty.insertMany(chunk, { ordered: false });
      currentIndex += 100000;
    }
  }

  static async uploadInValidData(invalidData) {
    logger.info("Controller uploadInValidData ");

    let currentIndex = 0;
    while (currentIndex < invalidData.length) {
      const chunk = invalidData.slice(currentIndex, currentIndex + 100000);
      await bulkErrorModel.insertMany(chunk);
      currentIndex += 100000;
    }
  }

  static insertintodataArray(row, data,email) {
    logger.info("Controller insertintoarray ");
    const  emailid  = email;

    data.push({
      email: emailid,
      name: row.name ?? "",
      address: {
        street: row["address.street"] ?? "",
        city: row["address.city"] ?? "",
        state: row["address.state"] ?? "",
        pinCode: row["address.pinCode"] ?? "",
      },
      description: row.description ?? "",
      startDate: row.startDate ?? "",
      endDate: row.endDate ?? "",
      Bhktype: row.Bhktype ?? "",
      owner: row.owner ?? "",
      price: row.price ?? "",
    });
  }

  static upload = async (req, res) => {
    try {
      logger.info("Controller upload ");
      const data = [];
      const validData = [];
      const invalidData = [];
      const startTime = new Date().toLocaleString();
      const uploadId = new Date().getTime().toString();

      logger.info("Controller upload ");
      const fileName = req.file?.filename;
      // console.log("functionrequest"+req.body);

      // console.log("function"+req.body.email);

      const email=req.body.email;
      // console.log("funsssssction"+req.body.email);

      console.log(fileName);
      if (!fileName) {
        return res
          .status(400)
          .send(SystemResponse.badRequest("No file provided"));
      }

      fs.createReadStream(path.resolve(__dirname, "../uploads", fileName))
        .pipe(csv.parse({ headers: true }))
        .on("error", (error) => {
          logger.error(`Error reading CSV file: ${error.message}`);
          return res
            .status(500)
            .send(SystemResponse.getErrorResponse(error.message, error));
        })
        .on("data", (row) => {
          ModuleController.insertintodataArray(row, data,email);
        })
        .on("end", async () => {
          data.forEach((item, index) => {
            const { error } = Validation.bulkUpload(item, {
              abortEarly: false,
            });
            if (!error) {
              validData.push(item);
            } else {
              invalidData.push({
                uploadId,
                rowNo: index + 1,
                errormessage: error?.details.map((items) => items.message),
              });
            }
          });
          fs.unlinkSync(path.resolve(__dirname, "../uploads", fileName));

          await ModuleController.uploadValidData(validData);

          await ModuleController.uploadInValidData(invalidData);
          const endTime = new Date().toLocaleString();
          const fileorignalName = req.file?.originalname;
          const bulkuploadobj = {
            _id: uploadId,
            startTime,
            endTime,
            noOfItemsToBeUpload: data.length,
            filename: fileorignalName,
            successfullyUpload: validData.length,
            failedDuringUpload: invalidData.length,
          };
          await bulkUpload.create(bulkuploadobj);
          return res
            .status(200)
            .send(SystemResponse.success("File uploaded Successfully"));
        });
    } catch (error) {
      console.log(error);
      logger.error(`Error in upload file api: ${error}`);
      return res
        .status(500)
        .send(SystemResponse.getErrorResponse(error.message, error));
    }
  };

  static updatebyid = async (req, res) => {
    try {
      logger.info(" Controller - start getById");
      const { id } = req.params;
      if (!mongoose.isValidObjectId(id)) {
        return res.status(422).send(SystemResponse.invalidData("Invalid ID"));
      }
      const response = await detailofproperty.findOne({ _id: id });
      if (response.length !== 0) {
      const foundemail = response.email;
      console.log(foundemail);
      if (foundemail !== req.body.email) {
        return res
          .status(401)
          .send(SystemResponse.unAuthourized("Not Access"));
      }
      const updatedProperty = await detailofproperty.updateOne(
        { _id: id },
        { $set: req.body }
    );
    console.log(updatedProperty);
        return res
          .status(200)
          .send(
            SystemResponse.success("Data Updated Successfully", updatedProperty)
          );
      }
      logger.info(" Controller - end getById");

      return res.status(404).send(SystemResponse.notFound("Data not found"));
    } catch (error) {
      logger.error(` Controller - getById :${error}`);
      return res
        .status(500)
        .json(
          SystemResponse.getErrorResponse(
            error?.message,
            "Error in finding an module by id",
            error
          )
        );
    }
  };
}
module.exports = ModuleController;
