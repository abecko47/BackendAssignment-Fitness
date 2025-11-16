import http from "http";
import express from "express";
import dotenv from "dotenv";
import middleware from "i18next-http-middleware";
import i18next from "i18next";
import Backend from "i18next-fs-backend";

dotenv.config();

import { sequelize } from "./db";
import ProgramRouter from "./routes/programs";
import ExerciseRouter from "./routes/exercises";
import AuthRouter from "./routes/auth";
import UserRouter from "./routes/users";
import AdminRouter from "./routes/admin";

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: "en",
    preload: ["en", "sk"],
    backend: {
      loadPath: __dirname + "/locales/{{lng}}/{{ns}}.json",
    },
    detection: {
      order: ["header"],
      lookupHeader: "language",
      caches: false,
    },
  });

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(middleware.handle(i18next));

app.use("/admin", AdminRouter());

app.use("/auth", AuthRouter());
app.use("/programs", ProgramRouter());
app.use("/exercises", ExerciseRouter());
app.use("/users", UserRouter());

const httpServer = http.createServer(app);

try {
  sequelize.sync();
} catch (error) {
  console.log("Sequelize sync error");
}

httpServer
  .listen(8000)
  .on("listening", () => console.log(`Server started at port ${8000}`));

export default httpServer;
