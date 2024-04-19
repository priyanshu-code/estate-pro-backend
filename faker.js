import { faker } from "@faker-js/faker";
import mongoose from "mongoose"; // Import mongoose to create ObjectId
import Property from "./models/property.model.js"; // Adjust the import path as needed
import { amenities, locations, propertyTypes } from "./fakerData.js";
import connect from "./config/db.config.js";

// Put mongo uri here
const mongoURI = 'mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority';

// Function to generate fake property data
const generateFakeProperty = () => {
  const ownerId = new mongoose.Types.ObjectId("661f9afa9eed1d3c773dd223"); // Use provided ObjectId
  return {
    owner: ownerId,
    title: faker.lorem.words(2), // Generate a random title with 3 words
    description: faker.lorem.paragraph(), // Generate a random paragraph for description
    price: faker.number.int({ min: 100000, max: 10000000 }), // Generate a random price between 1,00,000 and 10,00,00,000
    location: faker.helpers.arrayElement(locations), // Generate a random city for location
    type: faker.helpers.arrayElement(propertyTypes), // Random property type
    amenities: faker.helpers.arrayElements(amenities, 8), // Generate an array of 8 random amenities
    propertyImages: [
      faker.image.urlLoremFlickr({ category: "buildings" }),
      faker.image.urlLoremFlickr({ category: "apartments" }),
      faker.image.urlLoremFlickr({ category: "house" }),
      faker.image.urlLoremFlickr({ category: "skyscrapers" }),
    ], // Generate a random image URL for property image
    bedrooms: faker.number.int({ min: 1, max: 20 }), // Generate a random number of bedrooms between 1 and 5
    bathrooms: faker.number.int({ min: 1, max: 20 }), // Generate a random number of bathrooms between 1 and 5
    area: faker.number.int({ min: 1000, max: 10000 }), // Generate a random area size between 50 and 500 square ft
  };
};

// Function to generate multiple fake properties
export const generateFakeProperties = (count) => {
  const fakeProperties = [];
  for (let i = 0; i < count; i++) {
    fakeProperties.push(generateFakeProperty());
  }
  return fakeProperties;
};

// Generate 10 fake properties
const fakeProperties = generateFakeProperties(300);
await connect(mongoURI)
// Insert the fake properties into the database
Property.insertMany(fakeProperties)
  .then(() => {
    console.log("Fake properties inserted successfully.");
    mongoose.connection.close(); // Close the database connection
  })
  .catch((error) => {
    console.error("Error inserting fake properties:", error);
    mongoose.connection.close(); // Close the database connection
  });
