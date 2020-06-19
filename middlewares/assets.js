const express = require("express");
const path = require("path");

module.exports = function () {
    return express.static(path.join(process.cwd(), "public"))
};
