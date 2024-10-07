import express from 'express';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import crypto from 'crypto';
import path from 'path';
import mongoose from 'mongoose';
import passport from 'passport';
import Video from '../models/Video.js';

const router = express.Router();

const storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'videos'
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({ storage });

router.post('/upload', passport.authenticate('jwt', { session: false }), upload.single('video'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const video = new Video({
      title,
      description,
      fileId: req.file.id,
      uploader: req.user._id
    });
    await video.save();
    res.status(201).json(video);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().populate('uploader', 'username');
    res.json(videos);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate('uploader', 'username');
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.json(video);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/:id/stream', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'videos'
    });
    const downloadStream = gfs.openDownloadStream(video.fileId);
    downloadStream.pipe(res);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/:id/download', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'videos'
    });
    const downloadStream = gfs.openDownloadStream(video.fileId);
    res.set('Content-Type', 'video/mp4');
    res.set('Content-Disposition', `attachment; filename="${video.title}.mp4"`);
    downloadStream.pipe(res);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;