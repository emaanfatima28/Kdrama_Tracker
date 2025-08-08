const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const dramaRoutes = require('./routes/dramas');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); 
app.use('/api/dramas', dramaRoutes);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "frontend", "dist"))); 

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
  });
}

mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
