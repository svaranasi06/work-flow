import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import leaveRoutes from "./routes/leave.routes";
import notificationRoutes from "./routes/notification.routes";
import attendanceRoutes from "./routes/attendance.routes";
import holidayRoutes from "./routes/holiday.routes";
import calendarRoutes from "./routes/calendar.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import reportRoutes from "./routes/report.routes";
import authRoutes from "./routes/auth.routes";
import leavePolicyRoutes from "./routes/leavePolicy.routes";
import profileRoutes from "./routes/profile.routes";



const app: Application = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   limit: 100,
//   message: {
//     success: false,
//     message: "Too many requests from this IP, please try again later.",
//   },
// });

// app.use(limiter);

app.get("/api/v1/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Workforce Management System API is running",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/leaves", leaveRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/attendance", attendanceRoutes);
app.use("/api/v1/holidays", holidayRoutes);
app.use("/api/v1/calendar", calendarRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/reports", reportRoutes);
app.use("/api/v1/leave-policies", leavePolicyRoutes);
app.use("/api/v1/profile", profileRoutes);

export default app;