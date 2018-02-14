import * as mongoose from 'mongoose';

const ObjectId = mongoose.Schema.ObjectId;

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: ObjectId,
    required: true,
  },
});

module.exports = mongoose.model('Category', schema);
