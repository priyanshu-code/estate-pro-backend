import { locations, propertyTypes } from "../fakerData.js";
import Property from "../models/property.model.js";

const createPropertyService = async (propertyData) => {
  const property = await Property.create(propertyData);
  return property;
};

const fetchAllPropertiesByUserIdService = async (userId) => {
  const properties = await Property.find({ owner: userId });
  return properties;
};
const fetchPropertyByIdService = async (propertyId) => {
  const property = await Property.findById({ _id: propertyId });
  return property;
};

const fetchManyPropertiesByIdService = async (propertyIds) => {
  const properties = await Property.find({ _id: { $in: propertyIds } });
  return properties;
};

const updatePropertyByIdService = async ({ propertyId, data }) => {
  const updatedProperty = await Property.findByIdAndUpdate(propertyId, data, {
    runValidators: true,
    new: true,
  });
  return updatedProperty;
};
const deletePropertyByIdService = async (propertyId) => {
  const deletedProperty = await Property.findByIdAndDelete({ _id: propertyId });
  return deletedProperty;
};

const fetchPropertiesForHomepageService = async ({ limit, except }) => {
  // Construct the aggregation pipeline to sample random properties
  const pipeline = [
    { $match: { _id: { $nin: except } } }, // Exclude properties with IDs in the 'except' array
    { $sample: { size: limit } }, // Sample random properties up to the specified limit
  ];
  const properties = await Property.aggregate(pipeline);
  return properties;
};

const fetchFilteredPropertiesService = async ({ limit, searchQuery, searchFilters }) => {
  const { location, type, minPrice, maxPrice } = searchFilters;

  // Build the initial pipeline with all filters and search query
  let pipeline = [

    // Match stage for filtering based on location if it's provided
    ...(location ? [{ $match: { location } }] : []),

    // Match stage for filtering based on type if it's provided
    ...(type ? [{ $match: { type } }] : []),

    // Add filter for price range
    { $match: { price: { $gte: minPrice, $lte: maxPrice } } },

    // Add search query
    {
      $match: {
        $or: [
          { title: { $regex: searchQuery, $options: "i" } },
          { description: { $regex: searchQuery, $options: "i" } },
          { location: { $regex: searchQuery, $options: "i" } },
          { type: { $regex: searchQuery, $options: "i" } },
        ],
      },
    },

    // Add limit stage
    { $limit: limit > 20 ? 20 : limit },
  ];

  // Execute the initial aggregation pipeline
  let properties = await Property.aggregate(pipeline);
  let queryResults = {
    queryGiven: searchQuery.length > 0,
    resultsFound: properties.length > 0
  }
  // If no results are found with the search query, remove the search query stage from the pipeline
  if (properties.length === 0 && searchQuery) {
    console.log("No results found with the search query. Removing the search query from the pipeline.");

    // Find the $match stage and check if it contains the $or operator
    const matchStage = pipeline.find(stage => "$match" in stage && "$or" in stage["$match"]);

    // Remove the $match stage if found
    if (matchStage) {
      pipeline = pipeline.filter(stage => stage !== matchStage);
    }

    // Execute the updated aggregation pipeline without the search query
    properties = await Property.aggregate(pipeline);
  }

  return { properties, queryResults };
};


export {
  createPropertyService,
  fetchPropertyByIdService,
  fetchManyPropertiesByIdService,
  fetchAllPropertiesByUserIdService,
  updatePropertyByIdService,
  deletePropertyByIdService,
  fetchFilteredPropertiesService,
  fetchPropertiesForHomepageService,
};
