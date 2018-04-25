const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  code: { type: String, required: true },
});

module.exports = mongoose.model('Project', projectSchema);
