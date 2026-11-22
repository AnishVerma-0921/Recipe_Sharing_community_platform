import morgan from "morgan";

// Colourful in dev, compact in production
const format =
  process.env.NODE_ENV === "production"
    ? "combined"
    : "[:date[iso]] :method :url :status :response-time ms";

export const requestLogger = morgan(format);
