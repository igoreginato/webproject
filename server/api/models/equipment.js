const mongoose = require('mongoose');

const equipmentSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true},
  type: { type: String, required: true },
  brand: { type: String, required: true },
  description: { type: String, required: true },
  acquisition_date: { type: Date, default: Date.now },
  status: { type: String, required: true },
  equipmentImage: { type: String, required: true }
});

module.exports = mongoose.model('Equipment', equipmentSchema);
