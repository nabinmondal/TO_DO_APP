const express = require('express');
const app = express();
const userRouter = require('./routes/usersRoutes');
const taskRouter = require('./routes/tasksRoutes');
const path = require('path');


app.use('/',express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use('/users',userRouter);
app.use('/tasks',taskRouter);

module.exports = app;