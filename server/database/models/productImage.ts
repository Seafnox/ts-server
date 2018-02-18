import * as mongoose from 'mongoose';

const schema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true,
  },
  thumbs: {
    type: Array,
    required: true,
  },
});

export default mongoose.model('ProductImage', schema);
