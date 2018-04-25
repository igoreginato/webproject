const mongoose = require('mongoose');

const employeeSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  role: { type: String, required: true },
  identification: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  registered: { type: Date, default: Date.now },
  status: { type: Boolean, default: true}
});

module.exports = mongoose.model('Employee', employeeSchema);
