import type { ErrorRequestHandler } from "express";
import { z } from "zod";

export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  next,
) => {
  void next;
  if (error instanceof z.ZodError)
    return response
      .status(400)
      .json({ error: "Invalid request", details: error.issues });
  return response.status(400).json({
    error: error instanceof Error ? error.message : "Unable to process request",
  });
};
