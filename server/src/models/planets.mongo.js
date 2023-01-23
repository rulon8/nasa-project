const mongoose = require('mongoose');

const planetsSchema = new mongoose.Schema({
  keplerName: {
    type: String,
    required: true,
  }
});

// Creates a model from the schema. The model connects the schema to the
// planets collection. A model's name must be singular.
const planetsModel = mongoose.model('Planet', planetsSchema);

module.exports = planetsModel;