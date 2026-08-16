import { app } from "./app";
import { ENV } from "./config/env";
import { connectDB } from "./config/db";

const PORT = Number(ENV.PORT) || 4000;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();
