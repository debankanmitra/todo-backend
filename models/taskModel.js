const mongoose = require('mongoose');
const { PRIORITY, STATUS } = require('../utils/enums');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: String, enum: [PRIORITY.LOW, PRIORITY.MEDIUM, PRIORITY.HIGH], required: true },
    dueDate: { type: Date, required: true },
    dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    status: { type: String, enum: [STATUS.PENDING, STATUS.IN_PROGRESS, STATUS.COMPLETED], default: STATUS.PENDING },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    estimatedDuration: { type: Number, default: 0 },
});

taskSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
