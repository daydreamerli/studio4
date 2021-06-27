const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const authorSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
}, {
  versionKey: false,
});

module.exports = mongoose.model('authors', authorSchema);


