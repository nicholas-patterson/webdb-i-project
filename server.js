const express = require("express");

const accountRouter = require("./routes/accountsRouter");

const server = express();

server.use(express.json());

server.use("/accounts", accountRouter);

module.exports = server;
