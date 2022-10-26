const express = require("express");
const cors = require("cors");
const server = express();

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use((_, res, next) => {
  res.header("Content-Type", "application/json; charset=utf-8");
  next();
});

// "In memory" data store
let dataStore = require("./data/orders.js");

server.get("/orders", (_, res) => {
  res.json(dataStore);
});

module.exports = {
  server,
  dataStore,
};
