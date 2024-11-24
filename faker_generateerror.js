const fs = require("fs");
const { faker } = require('@faker-js/faker');
const logger = require("./utils/logger");

const numberOfEntries = 500000;
const filename = "property1_ten_error.csv";

let data =
  "name,address.street,address.city,address.state,address.pinCode,description,startDate,endDate,Bhktype,owner,price\n";

for (let i = 0; i < numberOfEntries; i++) {
  let name = `${faker.word.adjective()} ${faker.word.noun()} Apartments`; // Generate property names
  let street = faker.location.streetAddress();
  let city = faker.location.city();
  let state = faker.location.state();
  let pinCode = faker.location.zipCode();
  let description = faker.lorem.sentence();
  let startDate = faker.date.recent();
  let endDate = faker.date.future();
  let Bhktype = `${faker.number.int({ min: 1, max: 5 })}BHK`;
  let owner = faker.person.fullName();
  let price = faker.number.int({ min: 1000, max: 100000 });

  if (i % 10 === 0) {
    name = ""; 
    description = ""; 
  }

  if (i % 15 === 0) {
    price = "NotANumber"; 
  }

  if (i % 20 === 0) {
    startDate = "NotADate"; 
    street="";
  }

  if (i % 25 === 0) {
    endDate = ""; 
  }

  if (i % 30 === 0) {
    owner = "";
  }
  if(i%40===0)
  {
    street="";
  }

  const rowData = `${name},${street},${city},${state},${pinCode},${description},${startDate.toISOString ? startDate.toISOString() : startDate},${endDate.toISOString ? endDate.toISOString() : endDate},${Bhktype},${owner},${price}\n`;
  data += rowData;
}

// Asynchronous file writing
fs.writeFile(filename, data, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`Generated data with redundancies written to ${filename}`);
  logger.info(`Generated data with redundancies written to ${filename}`);
});
