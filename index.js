// // index.js
// import bodyParser from "body-parser";
// import cors from "cors";
// import dotenv from "dotenv";
// import express from "express";
// import connectDB from "./config/db.js";
// import projectRoutes from "./routes/projectRoutes.js";

// dotenv.config();
// connectDB();

// const allowedOrigins = [
//   "https://katana-portfolio-final.vercel.app/",
//   process.env.FRONTEND_URL_DEPLOY,
//   "http://localhost:3000",
// ]; // Add your frontend URLs here

// const app = express();

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.includes(origin)) return callback(null, true);
//       return callback(new Error("Not allowed by CORS"));
//     },
//     origin: allowedOrigins, // your frontend domain
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );

// app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// app.use("/api/projects", projectRoutes);

// app.get("/", (req, res) => {
//   res.send("Hello, Node.js project is running!");
// });

// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });

import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import projectRoutes from "./routes/projectRoutes.js";

dotenv.config();
connectDB();

const allowedOrigins = [
  "https://katana-portfolio-final.vercel.app", // removed trailing slash
  process.env.FRONTEND_URL_DEPLOY,
  "http://localhost:3000",
];

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/projects", projectRoutes);

app.get("/", (req, res) => {
  res.send("Hello, Node.js project is running!");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
