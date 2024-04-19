import { StatusCodes } from "http-status-codes";

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  let customError = {
    // Set default values
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, please try again later.",
  };

  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.name === "CastError") {
    customError.msg = `No item found with id ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose a different ${Object.keys(err.keyValue)}`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // Handle JWT-related errors
  if (err.name === "JsonWebTokenError") {
    customError.msg = "Invalid token";
    customError.statusCode = StatusCodes.UNAUTHORIZED;
  }

  if (err.name === "TokenExpiredError") {
    customError.msg = "Token expired";
    customError.statusCode = StatusCodes.UNAUTHORIZED;
  }

  // Handle authentication errors
  if (err.name === "AuthenticationError") {
    customError.msg = "Authentication failed";
    customError.statusCode = StatusCodes.UNAUTHORIZED;
  }

  // Handle authorization errors
  if (err.name === "AuthorizationError") {
    customError.msg = "Authorization failed";
    customError.statusCode = StatusCodes.FORBIDDEN;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

export default errorHandlerMiddleware;
