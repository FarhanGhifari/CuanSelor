import express from "express";

export const healthRouter = express.Router();

healthRouter.get("/", (req, res) => {
  res.json({
    success: true,
    service: "cuanselor-backend",
    status: "healthy",
  });
});
