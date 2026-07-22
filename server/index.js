import "dotenv/config";

import express from "express";
import cors from "cors";

import productRoutes from "./routes/productRoutes.js";
import geoRoutes from "./routes/geo.routes.js";
import shippingRoutes from "./routes/shipping.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/webhooks", webhookRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Backend Cerebria funcionando correctamente",
  });
});

app.use("/api/products", productRoutes);
app.use("/api/geo", geoRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/payments", paymentRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});