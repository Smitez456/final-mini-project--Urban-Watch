import { Router, type IRouter } from "express";
import healthRouter from "./health";
import uploadRouter from "./upload";
import classifyRouter from "./classify";
import weatherRouter from "./weather";
import trafficRouter from "./traffic";
import departmentsRouter from "./departments";
import alertsRouter from "./alerts";

const router: IRouter = Router();

router.use(healthRouter);
router.use(uploadRouter);
router.use(classifyRouter);
router.use(weatherRouter);
router.use(trafficRouter);
router.use(departmentsRouter);
router.use(alertsRouter);

export default router;
