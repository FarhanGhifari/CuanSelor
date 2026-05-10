const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint uji coba
app.get("/", (req, res) => {
  res.json({
    message: "Selamat! API CUAN SELOR berhasil menyala.",
    status: "Active",
  });
});

// Menyalakan server
app.listen(PORT, () => {
  console.log(`🚀 Server Backend berjalan di http://localhost:${PORT}`);
});
