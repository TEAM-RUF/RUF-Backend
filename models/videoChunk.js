import mongoose from 'mongoose';

// Use GridFs "chunks" model so we can set expiry date to enable
// DB managed TTL.
export default mongoose.model('VideoChunk', new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    files_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    n: {
        type: Number,
        required: false,
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    uploadDate: {
        type: Date,
        required: false,
        expires: process.env.EXPIRE_AFTER_SECOND,
    },
}, {
    collection: 'videos.chunks',
    autoCreate: false,
    autoIndex: true,
    minimize: false,
    versionKey: false,
}));