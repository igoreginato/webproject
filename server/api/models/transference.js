const mongoose = require('mongoose');

const transferenceSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true},
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true},
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true},
  when: { type: Date, default: Date.now },
  quantity: { type: Number, default: 1 }
});

module.exports = mongoose.model('Transference', transferenceSchema);
