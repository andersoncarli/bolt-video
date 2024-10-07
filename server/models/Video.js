import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  fileId: { type: mongoose.Schema.Types.ObjectId, required: true },
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Video = mongoose.model('Video', videoSchema);

export default Video;