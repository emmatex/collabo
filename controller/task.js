const Task = require('../models/Task');

exports.createTask = (req, res, next) => {
    const task = new Task();
    task.save((err, data) => {
        if (err) {
            console.log(err);
        } else {
            // res.redirect('/task/:id');
            res.redirect('/task/' + data._id);
        }
    });
};

exports.getSingleTask = (req, res, next) => {
    if (req.params.id) {
        Task.findOne({ _id: req.params.id }, function (err, data) {
            if (data) {
                res.render('task/task', { content: data.content, roomId: data.id });
            } else {
                console.log(err);
                res.render('error/404');
            }
        })
    } else {
        res.render('error/404');
    }
}

