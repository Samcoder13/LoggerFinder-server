const request = require("supertest");
const server = require("./server");
const { connectDB, closeTestDB, clearTestDB } = require("./Config/db");
const User = require("./models/userSchema");
const detailofproperty = require("./models/moduleListingSchema");
// const bcrypt=require('bcrypt');
const { ObjectId } = require("mongoose").Types; // Import ObjectId from mongoose

let app;
let gettoken;
beforeAll(async () => {
  // process.env.NODE_ENV = "test";
  console.log('process.env', process.env);
  app = await server();
  await connectDB();
});

afterAll(async () => {
  await closeTestDB();
});

// afterEach(async () => {
//   await clearTestDB();
// });

describe("POST /v1/signup", () => {
  it("should signup a user successfully", async () => {
    const response = await request(app).post("/v1/signup").send({
      name: "samarth",
      email: "samarth123@gmail.com",
      password: "Samarth@123",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("message", "Signup successful");
    expect(response.body.data).toHaveProperty("name", "samarth");
    expect(response.body.data).toHaveProperty("email", "samarth123@gmail.com");
  });

  it("should return 500 if there is an error in signup", async () => {
    const response = await request(app).post("/v1/signup").send({
      name: "",
      email: "invalidemail",
      password: "short",
    });

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("error");
  });
});

describe("POST /v1/login", () => {
  it("check healthcheck", async () => {
    const response = await request(app).get("/healthCheck");
    expect(response.status).toBe(200);
  });

  it("should login a user successfully", async () => {
    const response = await request(app).post("/v1/login").send({
      email: "samarth123@gmail.com",
      password: "Samarth@123",
    });
    gettoken = response.body.data.token;
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Login successful");
    expect(response.body.data).toHaveProperty("email", "samarth123@gmail.com");
    expect(response.body.data).toHaveProperty("token");
  }, 10000);
});

describe("GET /v1/getalldetails", () => {
  let token;

  beforeEach(async () => {
    await detailofproperty.create([
      {
        email: "test1@example.com",
        name: "Property1",
        address: {
          street: "Street1",
          city: "City1",
          state: "State1",
          pinCode: "123456",
        },
        description: "Description1",
        startDate: new Date(),
        endDate: new Date(new Date().getTime() + 86400000),
        Bhktype: "2BHK",
        owner: "Owner1",
        price: 1000,
      },
      {
        email: "test2@example.com",
        name: "Property2",
        address: {
          street: "Street2",
          city: "City2",
          state: "State2",
          pinCode: "654321",
        },
        description: "Description2",
        startDate: new Date(),
        endDate: new Date(new Date().getTime() + 86400000),
        Bhktype: "3BHK",
        owner: "Owner2",
        price: 2000,
      },
      {
        email: "test3@example.com",
        name: "Property3",
        address: {
          street: "Street3",
          city: "City3",
          state: "State3",
          pinCode: "112233",
        },
        description: "Description3",
        startDate: new Date(),
        endDate: new Date(new Date().getTime() + 86400000),
        Bhktype: "2BHK",
        owner: "Owner3",
        price: 1500,
      },
    ]);
  });

  it("should retrieve all details successfully without filter and search", async () => {
    const response = await request(app)
      .get("/v1/getalldetails")
      .set("Authorization", gettoken)
      .query({ page: 1, limit: 2 });

    // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Data Retrieved Successfully"
    );
    expect(response.body.data).toHaveLength(2);
    expect(response.body.datalength).toEqual(3);
  });

  it("should retrieve filtered details successfully", async () => {
    const response = await request(app)
      .get("/v1/getalldetails")
      .set("Authorization", gettoken)
      .query({ page: 1, limit: 2, filter: "2BHK" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Data Retrieved Successfully"
    );
    expect(response.body.data).toHaveLength(2);
    expect(response.body.datalength).toEqual(4);
  });

  it("should retrieve searched details successfully", async () => {
    const response = await request(app)
      .get("/v1/getalldetails")
      .set("Authorization", gettoken)
      .query({ page: 1, limit: 2, search: "Property1" });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Data Retrieved Successfully"
    );
    expect(response.body.data).toHaveLength(2);
  });

  it("should return 403 if token is not provided", async () => {
    const response = await request(app)
      .get("/v1/getalldetails")
      .query({ page: 1, limit: 2 });

    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty("message", "UnAuthorized");
  });

  it("should return 403 if token is invalid or expired", async () => {
    const response = await request(app)
      .get("/v1/getalldetails")
      .set("Authorization", `invalid_token`)
      .query({ page: 1, limit: 2 });

    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty("message", "UnAuthorized");
  });
});

describe("GET /getById/:id", () => {
  let validId;

  beforeEach(async () => {
    // Create a valid document for testing
    const property = await detailofproperty.create({
      name: "Property1",
      price: 100000,
      email: "samarth123@gmail.com",
      address: {
        street: "123 Main St",
        city: "Cityville",
        state: "Stateville",
        pinCode: "123456",
      },
      description: "This is a test property",
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 86400000),
      Bhktype: "2BHK",
      owner: "Owner1",
    });

    validId = property._id;
  });

  it("should return data for valid ID", async () => {
    const response = await request(app)
      .get(`/v1/getById/${validId}`)
      .set("Authorization", gettoken);
    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty(
      "message",
      "Data retrieved Successfully"
    );
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.data[0]).toHaveProperty("_id", validId.toString());
  });

  it("should return 422 for invalid ID", async () => {
    const invalidId = "invalidId";

    const response = await request(app)
      .get(`/v1/getById/${invalidId}`)
      .set("Authorization", gettoken);

    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty("message", "Invalid ID");
  });
});
