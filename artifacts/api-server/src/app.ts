import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.set("trust proxy", 1);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use((req, res, next) => {
  // Skip global body parsers for the upload route so express.raw() on that route
  // can capture the raw multipart/form-data bytes correctly.
  if (req.path === '/api/upload/image' || req.path === '/upload/image') {
    return next();
  }
  express.json({ limit: '1mb' })(req, res, next);
});
app.use((req, res, next) => {
  if (req.path === '/api/upload/image' || req.path === '/upload/image') {
    return next();
  }
  express.urlencoded({ extended: true })(req, res, next);
});

app.use("/api", router);

app.use((error: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if ((error as { type?: string })?.type === "entity.too.large") {
    res.status(413).json({ error: "Images must be 10 MB or smaller." });
    return;
  }
  next(error);
});

export default app;
