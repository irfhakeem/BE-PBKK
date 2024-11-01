import express from "express";
import bodyParser from "body-parser";
import routes from "./routes/index.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.FE_HOST,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/v1", routes);

// Serve static files
app.use("/avatar", express.static("upload/avatar"));
app.use("/banner", express.static("upload/banner"));
app.use("/thumbnail", express.static("upload/thumbnail"));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
