const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const { default: mongoose } = require('mongoose');
const Task = require('./models/Task');
const User = require('./models/User');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const http = require('http');
const { initSocket, getIO } = require('./socket');

const PORT = 8080;
const DATABASE_HOST = 'localhost';
const DATABASE_PORT = 27017;

const DATA_PATH = path.join(__dirname, 'todolist.json');

app.use(cors());
app.use(express.json());

const dbURL = `mongodb://${DATABASE_HOST}:${DATABASE_PORT}/to_do_flow_tasks`;
mongoose.connect(dbURL);

const db = mongoose.connection;
db.on('error', function (e) {
  console.log('error connecting:' + e);
});
db.on('open', function () {
  console.log('database connected!');
});

function readData() {
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
}

function writeData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

async function addTestUsersToMongoDB() {
  const admin = await User.findOne({ username: 'admin' });

  if (!admin) {
    console.log('Adding test user to db ...');
    const user = readData().users[0];
    const newUser = new User(user);
    newUser
      .save()
      .then(() => console.log('Admin user added'))
      .catch((err) => console.error('Error adding admin user: ' + err));
  } else {
    console.log('Admin user already exists. Not adding Admin user.');
  }
  return;
}

async function addTestTasksToMongoDB() {
  const admin = await User.findOne({ username: 'admin' });

  if (!admin) {
    console.log('Admin user does not exist. Not adding test tasks.');
    return;
  }

  const count = await Task.countDocuments({ assignedTo: admin._id });

  if (count === 0) {
    console.log('Adding test tasks to db ...');
    const tasks = readData().todos;
    tasks.forEach((task) => {
      const newTask = new Task({ ...task, assignedTo: admin._id });
      newTask
        .save()
        .then(() => console.log('Task added with ID ' + task.id))
        .catch((err) => console.error('Error adding task with ID ' + task.id + ' ' + err));
    });
  } else {
    console.log('Tasks already exist. Not adding test tasks.');
  }
  return;
}

async function setUpDatabase() {
  await addTestUsersToMongoDB();
  await addTestTasksToMongoDB();
}

setUpDatabase();

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    req.user = decoded;
    next();
  });
}

/* AUTH */

app.post('/api/auth/login', express.json(), async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await User.findOne({
      username: String(username).trim()
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'Login successful',
      user: { username: user.username },
      token
    });
  } catch (err) {
    console.error('Error during login: ' + err);
    return res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/signup', express.json(), async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const existingUser = await User.findOne({ username: String(username).trim() });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const newUser = new User({
      username: String(username).trim(),
      password: String(password).trim(),
      role: 'user'
    });

    await newUser.save();

    return res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Error during signup: ' + err);
    return res.status(500).json({ error: 'Signup failed' });
  }
});

app.get('/api/auth/check', authenticateToken, (req, res) => {
  res.status(200).json({
    userId: req.user.userId
  });
});

/* READ */

// GET all tasks
app.get('/api/to_do_items', authenticateToken, express.json(), async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.userId }).sort({ id: 1 });
    return res.status(200).json(tasks);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch Tasks' });
  }
});

// GET tasks by status
app.get('/api/to_do_items/status/:status', authenticateToken, express.json(), async (req, res) => {
  try {
    const status = String(req.params.status || '').trim().toLowerCase();
    if (!status) return res.status(400).json({ error: 'Status is required' });

    const tasks = await Task.find({
      status: { $regex: new RegExp(`^${status}$`, 'i') },
      assignedTo: req.user.userId
    }).sort({ id: 1 });

    return res.status(200).json(tasks);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch Tasks by status' });
  }
});

// GET tasks by title
app.get('/api/to_do_items/title/:title', authenticateToken, express.json(), async (req, res) => {
  try {
    const title = String(req.params.title || '').trim();
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const tasks = await Task.find({
      title: { $regex: new RegExp(`^${title}$`, 'i') },
      assignedTo: req.user.userId
    }).sort({ id: 1 });

    return res.status(200).json(tasks);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch Tasks by title' });
  }
});

// GET one task by id
app.get('/api/to_do_items/:id', authenticateToken, express.json(), async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid id (must be a number)' });
  }

  try {
    const task = await Task.findOne({ id: id, assignedTo: req.user.userId });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    return res.status(200).json(task);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch Task' });
  }
});

/* CREATE */

app.post('/api/to_do_items', authenticateToken, express.json(), async (req, res) => {
  try {
    const { title, description, status, dueDate, experiencePoints } = req.body || {};

    if (!title || !description) {
      return res.status(400).json({ error: 'title and description are required' });
    }

    const lastTask = await Task.findOne({}).sort({ id: -1 });
    const nextId = lastTask ? lastTask.id + 1 : 1;

    const taskBody = {
      id: nextId,
      title: String(title).trim(),
      description: String(description).trim(),
      status: status ? String(status).trim() : 'todo',
      dueDate: dueDate ? String(dueDate).trim() : '',
      experiencePoints: experiencePoints ? Number(experiencePoints) : 0,
      assignedTo: req.user.userId
    };

    const created = await Task.create(taskBody);

    try {
      const data = readData();
      if (typeof data.nextId === 'number' && data.nextId <= nextId) {
        data.nextId = nextId + 1;
        writeData(data);
      }
    } catch (_) {}

    getIO().emit('taskActivity', {
      type: 'create',
      message: `${req.user.username} created task "${created.title}"`,
      taskId: created.id,
      username: req.user.username,
      timestamp: new Date().toISOString()
    });

    return res.status(201).json(created);
  } catch (err) {
    console.error('Error creating Task: ' + err);
    return res.status(400).json({ error: 'Failed to create Task' });
  }
});

/* UPDATE */

app.put('/api/to_do_items/:id', authenticateToken, express.json(), async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid id (must be a number)' });
  }

  const { title, description, status, dueDate, experiencePoints } = req.body || {};
  const updateFields = {};

  if (title !== undefined) {
    const t = String(title).trim();
    if (!t) return res.status(400).json({ error: 'title cannot be empty' });
    updateFields.title = t;
  }

  if (description !== undefined) {
    const d = String(description).trim();
    if (!d) return res.status(400).json({ error: 'description cannot be empty' });
    updateFields.description = d;
  }

  if (status !== undefined) {
    const s = String(status).trim().toLowerCase();
    if (!['todo', 'doing', 'done'].includes(s)) {
      return res.status(400).json({ error: 'status must be todo, doing, or done' });
    }
    updateFields.status = s;
  }

  if (dueDate !== undefined) {
    updateFields.dueDate = String(dueDate).trim();
  }

  if (experiencePoints !== undefined) {
    const xp = Number(experiencePoints);
    if (!Number.isFinite(xp) || xp < 0) {
      return res.status(400).json({ error: 'experiencePoints must be a non-negative number' });
    }
    updateFields.experiencePoints = xp;
  }

  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ error: 'No fields provided to update' });
  }

  try {
    const updated = await Task.findOneAndUpdate(
      { id: id, assignedTo: req.user.userId },
      { $set: updateFields },
      { returnDocument: 'after' }
    );

    if (!updated) return res.status(404).json({ error: 'Task not found' });

    let activityMessage = `${req.user.username} updated task "${updated.title}"`;
    let activityType = 'update';

    if (updateFields.status === 'done') {
      activityMessage = `${req.user.username} completed task "${updated.title}"`;
      activityType = 'complete';
    }

    getIO().emit('taskActivity', {
      type: activityType,
      message: activityMessage,
      taskId: updated.id,
      username: req.user.username,
      timestamp: new Date().toISOString()
    });

    return res.status(200).json(updated);
  } catch (err) {
    console.error('Error updating Task: ' + err);
    return res.status(500).json({ error: 'Failed to update Task' });
  }
});

/* DELETE */

// delete by title
app.delete('/api/to_do_items/title/:title', authenticateToken, express.json(), async (req, res) => {
  try {
    const title = String(req.params.title || '').trim();
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const deletedTask = await Task.findOneAndDelete({
      title: title,
      assignedTo: req.user.userId
    });

    if (!deletedTask) return res.status(404).json({ error: 'Task not found' });

    getIO().emit('taskActivity', {
      type: 'delete',
      message: `${req.user.username} deleted task "${deletedTask.title}"`,
      taskId: deletedTask.id,
      username: req.user.username,
      timestamp: new Date().toISOString()
    });

    return res.status(200).json(deletedTask);
  } catch (err) {
    console.error('Error deleting Task by title: ' + err);
    return res.status(500).json({ error: 'Failed to delete Task' });
  }
});

// delete by id
app.delete('/api/to_do_items/:id', authenticateToken, express.json(), async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid id (must be a number)' });
  }

  try {
    const deletedTask = await Task.findOneAndDelete({ id: id, assignedTo: req.user.userId });
    if (!deletedTask) return res.status(404).json({ error: 'Task not found' });

    getIO().emit('taskActivity', {
      type: 'delete',
      message: `${req.user.username} deleted task "${deletedTask.title}"`,
      taskId: deletedTask.id,
      username: req.user.username,
      timestamp: new Date().toISOString()
    });

    return res.status(200).json(deletedTask);
  } catch (err) {
    console.error('Error deleting Task: ' + err);
    return res.status(500).json({ error: 'Failed to delete Task' });
  }
});

app.use('/api', (req, res) => {
  return res.status(404).json({ error: 'API route not found', path: req.originalUrl });
});

app.use((req, res) => {
  return res.status(404).send('404 - Not Found');
});

app.use((err, req, res, next) => {
  console.error('Unexpected error:', err);
  return res.status(500).json({ error: 'Server error' });
});

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log('Server started on port: ' + PORT);
});