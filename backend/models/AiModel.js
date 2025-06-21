const mongoose = require('mongoose');
const { Schema } = mongoose;

const AiSchema = new Schema({
  claim_id: {
    type: String,
    required: false
  },
  text_extraction: {
    type: Schema.Types.Mixed,
    required: false
  },
  extract_status: {
    type: Number, // use Number instead of BigInt
    required: false
  },
  text_summarize: {
    type: String,
    required: false
  },
  summarize_status: {
    type: Number, // use Number instead of BigInt
    required: false
  },
  classify: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AiSchema', AiSchema);
