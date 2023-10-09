"use strict";
exports.__esModule = true;
var express_1 = require("express");
var cors_1 = require("cors");
require("dotenv/config");
console.log(process.env.API_PORT);
var app = (0, express_1["default"])();
app.use((0, cors_1["default"])());
