import { app } from "./app";
import { connectDB } from "./config/db";
import { ENV } from "./config/env";

const startServer = async () => {
  try {
    await connectDB();

    app.listen(ENV.PORT, () => {
      console.log(`🚀 Server running at http://localhost:${ENV.PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
