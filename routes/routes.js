const express = require("express");
const Validation = require("../middlewares/Validation"); // Adjust the path as needed
const UserController = require("../Controllers/UserController"); // Adjust the path as needed
const ModuleController = require("../Controllers/ModuleController");
const multer = require("multer");
const authenticateToken = require("../middlewares/authenticateToken");

// const upload = multer({ dest: "uploads/" });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });
const router = express.Router();

/**
 * @swagger
 * paths:
 *   /v1/login:
 *     post:
 *       summary: User login
 *       tags: [User]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   example: "samarth123@gmail.com"
 *                 password:
 *                   type: string
 *                   example: "Samarth@123"
 *       responses:
 *         200:
 *           description: Login successful
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                   data:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: string
 *                       name:
 *                         type: string
 *                       token:
 *                         type: string
 *         400:
 *           description: Bad request
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     msg:
 *                       type: string
 *                     param:
 *                       type: string
 *                     location:
 *                       type: string
 *         404:
 *           description: Username does not exist
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *         500:
 *           description: Error in login
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                   error:
 *                     type: object
 */

router.post(
  "/login",
  Validation.validateUser(),
  Validation.checkValidation,
  UserController.login
);

/**
 * @swagger
 * paths:
 *   /v1/signup:
 *     post:
 *       summary: User signup
 *       tags: [User]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "samarth"
 *                 email:
 *                   type: string
 *                   example: "samarth123@gmail.com"
 *                 password:
 *                   type: string
 *                   example: "Samarth@123"
 *       responses:
 *         201:
 *           description: Signup successful
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                   data:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *         500:
 *           description: Error in signup
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                   error:
 *                     type: object
 */
router.post("/signup", UserController.signup);

/**
 * @swagger
 * /v1/getalldetails:
 *   get:
 *     summary: Get all details
 *     tags: [Details]
 *     description: Retrieve all details of properties.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items to return per page
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: Filter by Bhktype
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query for text search
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: 'models/moduleListingSchema/Property'
 *                 totalCount:
 *                   type: integer
 *       500:
 *         description: Internal server error
 */

router.get("/getalldetails", authenticateToken, ModuleController.getall);

/**
 * @swagger
 * /v1/getById/{id}:
 *   get:
 *     summary: Get details by ID
 *     tags: [Details]
 *     description: Retrieve details of a property by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the property to retrieve
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: 'models/moduleListingSchema/Property'
 *       404:
 *         description: Property not found
 *       422:
 *         description: Invalid ID  
 *       500:
 *         description: Internal server error
 */
router.get("/getById/:id", authenticateToken, ModuleController.getbyid);

/**
 * @swagger
 * /v1/edit/{id}:
 *   patch:
 *     summary: Update details by ID
 *     tags: [Details]
 *     description: Update details of a property by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the property to update
 *       - in: body
 *         name: body
 *         description: Updated property details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: "Updated Name"
 *             address:
 *               type: object
 *               properties:
 *                 street:
 *                   type: string
 *                   example: "Updated Street"
 *                 city:
 *                   type: string
 *                   example: "Updated City"
 *                 state:
 *                   type: string
 *                   example: "Updated State"
 *                 pinCode:
 *                   type: string
 *                   example: "Updated PinCode"
 *             description:
 *               type: string
 *               example: "Updated Description"
 *             startDate:
 *               type: string
 *               format: date
 *               example: "2024-06-27T00:00:00.000Z"
 *             endDate:
 *               type: string
 *               format: date
 *               example: "2024-07-27T00:00:00.000Z"
 *             Bhktype:
 *               type: string
 *               example: "Updated Bhktype"
 *             owner:
 *               type: string
 *               example: "Updated Owner"
 *             price:
 *               type: number
 *               example: 1000000
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: 'models/moduleListingSchema/Property'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Property not found
 *       422:
 *         description: Invalid ID
 *       500:
 *         description: Internal server error
 */
router.patch("/edit/:id", authenticateToken, ModuleController.updatebyid);

/**
 * @swagger
 * /v1/getbulk:
 *   get:
 *     summary: Get bulk upload data
 *     tags: [BulkUpload]
 *     description: Retrieve bulk upload data with pagination.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: 'models/bulkUploadSchema/BulkUpload'
 *                 totalCount:
 *                   type: integer
 *       500:
 *         description: Internal server error
 */
router.get("/getbulk", authenticateToken, ModuleController.getbulk);

/**
 * @swagger
 * /v1/getbyuploadid/{uploadId}:
 *   get:
 *     summary: Get data by upload ID
 *     tags: [BulkUpload]
 *     parameters:
 *       - in: path
 *         name: uploadId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the upload
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: The limit of items per page
 *     responses:
 *       200:
 *         description: Successful response with data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message
 *                 data:
 *                   type: array
 *                   description: Array of data
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The ID of the data
 *                 totalCount:
 *                   type: integer
 *                   description: The total count of data
 *       500:
 *         description: Error response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message
 *                 error:
 *                   type: object
 *                   description: The error details
 */

router.get(
  "/getbyuploadid/:uploadId",
  authenticateToken,
  ModuleController.getbyuploadid
);

/**
 * @swagger
 * /v1/create:
 *   post:
 *     summary: Create a new property detail
 *     tags: [Property]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "samarth123@gmail.com"
 *               name:
 *                 type: string
 *                 example: "Property Name"
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: "Street Name"
 *                   city:
 *                     type: string
 *                     example: "City Name"
 *                   state:
 *                     type: string
 *                     example: "State Name"
 *                   pinCode:
 *                     type: string
 *                     example: "123456"
 *               description:
 *                 type: string
 *                 example: "Property Description"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2022-06-30"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2023-06-30"
 *               Bhktype:
 *                 type: string
 *                 example: "2BHK"
 *               owner:
 *                 type: string
 *                 example: "Owner Name"
 *               price:
 *                 type: number
 *                 example: 1000000
 *     responses:
 *       201:
 *         description: Property detail created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message
 *                 data:
 *                   type: object
 *                   description: The newly created property detail
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the error
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the error
 */

router.post(
  "/create",
  authenticateToken,
  Validation.checkvalid,
  ModuleController.add
);

/**
 * @swagger
 * /v1/uploadfile:
 *   post:
 *     summary: Upload a CSV file
 *     tags: [Bulk Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the error
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the error
 */
const saveRequestData = (req, res, next) => {
  req.savedBody = { ...req.body }; // Save the body data before multer processing
  next();
};

const restoreRequestData = (req, res, next) => {
  req.body = { ...req.savedBody }; // Restore the saved body data after multer processing
  delete req.savedBody; // Clean up the saved body data
  next();
};
router.post(
  '/uploadfile',
  authenticateToken,
  saveRequestData,
  upload.single('file'),
  restoreRequestData,
  ModuleController.upload
);



module.exports = router;
