import { NotFoundError } from "../errors/index.js";

import { fetchFilteredPropertiesService, fetchPropertiesForHomepageService } from "../services/property.service.js";

const getHomepageProperties = async (req, res) => {
  const { limit, except } = req.body;
  const properties = await fetchPropertiesForHomepageService({
    limit: limit || 20,
    except: except || [],
  });
  if (!properties) {
    throw new NotFoundError("No properties found");
  }
  return res.status(200).send({ properties });
};

const getFilteredProperties = async (req, res) => {
  const { limit, searchQuery, searchFilters } = req.body;
  const { properties, queryResults } = await fetchFilteredPropertiesService({
    limit: limit || 10, searchQuery, searchFilters
  });

  if (!properties) {
    throw new NotFoundError("No properties found");
  }
  return res.status(200).send({ properties, queryResults, msg: "success" });
};

export { getHomepageProperties, getFilteredProperties };