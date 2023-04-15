const express = require('express');
const router = express.Router();
const Task = require('../models/Task'); 

router.get('/', async (req, res) => {
   try {
    let filter = {};
    if(req.query.user_id){
      filter.user_id = req.query.user_id;
    }
    if (req.query.taskName) {
      filter.taskName = { $regex: req.query.taskName, $options: 'i' };
    }
    if(req.query.status){
      filter.status = req.query.status;
    }
    console.log(req.query);
    if (req.query.dueDate && req.query.dueDate !== "any") {
      const parsedDueDate = Date.parse(req.query.dueDate);
      filter.dueDate = { $lte: new Date(parsedDueDate) };
    }
    const tasks = await Task.find(filter);
    res.status(200).json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }

});

router.get('/:id', getTask, (req, res) => {
  res.json(res.task);
});

router.post('/', async (req, res) => {
  const task = new Task({
    taskName: req.body.taskName,
    dueDate: req.body.dueDate,
    status: req.body.status
  });
  try {
    const newTask = await task.save();
    res.status(201).json({success: true, task: newTask});
  } catch (err) {
    res.status(400).json({success:false ,message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const dateString = req.body.dueDate;
  const date = new Date(dateString);
  const isoDateString = date.toISOString();
  const taskVar = new Task({
    _id : req.params.id,
    taskName: req.body.taskName,
    dueDate: isoDateString,
    status: req.body.status
  });
  Task.findByIdAndUpdate(req.params.id, taskVar, {new : true})
  .then(updatedTask => {
    res.status(201).json({success: true, task: updatedTask});
  })
  .catch(err => {
    res.status(400).json({success:false ,message: err.message });
    console.error(err);
  });

});


async function getTask(req, res, next) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({success: false,  message: 'task not found' });
    }
    res.task = task;
    next();
  } catch (err) {
    return res.status(500).json({success: false,  message: err.message });
  }
}

module.exports = router;
