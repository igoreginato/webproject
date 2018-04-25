const mongoose = require('mongoose');

const loansSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  equipament: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true},
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true},
  when: { type: Date, default: Date.now },
  quantity: { type: Number, default: 1 }
});

module.exports = mongoose.model('Loans', loansSchema);
