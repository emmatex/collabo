'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var TaskSchema = new mongoose.Schema({
  content: String
});

module.exports = mongoose.model('task', TaskSchema);
