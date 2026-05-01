const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    id: {
        type:       Number,
        unique:     true,
        required:   true
    },
    title: {
        type:       String,
        unique:     false,
        required:   true,
        trim:       true
    },
    description: {
        type:       String,
        unique:     false,
        required:   true,
        trim:       true
    },
    status: {
        type:       String,
        unique:     false,
        required:   true
    },
    dueDate: {
        type:       String,
        unique:     false,
        required:   false,
        default:    ''
    },
    experiencePoints: {
        type:       Number,
        unique:     false,
        required:   false,
        default:    0
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
});

const Task = mongoose.model('task', TaskSchema);
module.exports = Task;