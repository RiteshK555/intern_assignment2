const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    default: 'pending'
  },
  user_id: {
    type: String
  }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
