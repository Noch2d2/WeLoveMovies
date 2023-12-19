if (process.env.USER) require("dotenv").config();

const express = require("express");
const app = express();
const cors = require('cors');
const moviesRouter = require("./movies/movies.router");
const theatersRouter = require("./theaters/theaters.router");
const reviewsRouter = require("./reviews/reviews.router");



app.use(cors());
app.use(express.json());

app.use("/movies", moviesRouter);
app.use("/theaters", theatersRouter);
app.use("/reviews", reviewsRouter);


app.use((err,req,res,next)=>{
  console.error(err);
  const { status = 500, message = "Something went wrong!" } = err;
  res.status(status).json({ error: message });
})

module.exports = app;
