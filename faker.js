  const fs = require("fs");
  const { faker } = require('@faker-js/faker');

  const numberOfEntries = 100;
  const filename = "property4_100.csv";

  let data =
    "name,address.street,address.city,address.state,address.pinCode,description,startDate,endDate,Bhktype,owner,price\n";

  for (let i = 0; i < numberOfEntries; i++) {
    const name = `${faker.word.adjective()} ${faker.word.noun()} Apartments`; // Generate property names
    const street = faker.location.streetAddress();
    const city = faker.location.city();
    const state = faker.location.state();
    const pinCode = faker.location.zipCode();
    const description = faker.lorem.sentence();
    const startDate = faker.date.recent();
    const endDate = faker.date.future();
    const Bhktype = `${faker.number.int({ min: 1, max: 5 })}BHK`;
    const owner = faker.person.fullName();
    const price = faker.number.int({ min: 1000, max: 100000 });

    const rowData = `${name},${street},${city},${state},${pinCode},${description},${startDate.toISOString()},${endDate.toISOString()},${Bhktype},${owner},${price}\n`;
    data += rowData;
  }

  // Asynchronous file writing
  fs.writeFile(filename, data, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Generated data written to ${filename}`);
  });
