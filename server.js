import "express-async-errors";
import express from "express";
import multer from "multer";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { MONGO_URI, PORT } from "./config/globals.config.js";
import { getBaseDirname } from "./utils/getBaseDirname.js";
import multerImageFilter from "./utils/imageFilter.util.js";
import path from "path";
const app = express();
// import { generateFakeProperties } from './faker.js'
// proxy (if behind a proxy server or load balancer)
app.set("trust proxy", 1);

const __dirname = getBaseDirname();

// App Configurations

// Rate limiter
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 4000, // 4000 every 15 mins
    standardHeaders: true,
    legacyHeaders: false,
  }),
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json({ limit: "5mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));
app.use(morgan("short"));
app.use(
  "/api/v1/assets",
  express.static(path.join(__dirname, "public/assets")),
);

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "public/assets"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB in bytes
  fileFilter: multerImageFilter,
});

// Custom Middleware
import errorHandlerMiddleware from "./middleware/error-handler.middleware.js";
import notFoundMiddleware from "./middleware/not-found.middleware.js";
import authMiddleware from "./middleware/auth.middleware.js";

// Connect
import connect from "./config/db.config.js";

// Route Imports
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import propertyRoute from "./routes/property.route.js";
import publicRoute from "./routes/public.route.js";

// Routes

// Public route
app.use("/api/v1/public", publicRoute);
// Auth route
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", authMiddleware, userRoute);
app.use(
  "/api/v1/property",
  upload.array("pictures", 5),
  authMiddleware,
  propertyRoute,
);

app.get("/", (req, res) => {
  res.status(200).send("<h1>Server Working</h1>");
});

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

app.listen(PORT, async () => {
  try {
    await connect(MONGO_URI);
    console.log(`Server listening at http://localhost:${PORT}`);
  } catch (error) {
    console.log(error);
  }
});
