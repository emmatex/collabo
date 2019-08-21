const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const config = require('../util/database');
const transporter = nodemailer.createTransport(config.mailer);

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login', {
        pageTitle: 'Login',
        errorMessage: message
    });
};

exports.getRegister = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/register', {
        pageTitle: 'Register',
        errorMessage: message
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email }).then(user => {
        if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }
        bcrypt.compare(password, user.password).then(doMatch => {
            if (doMatch) {
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save(err => {
                    console.log(err);
                    res.redirect('/home');
                });
            }
            req.flash('error', 'Invalid email or password.');
            res.redirect('/login');
        }).catch(err => {
            console.log(err);
            res.redirect('/login');
        });
    }).catch(err => console.log(err));
};


exports.postRegister = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({ email: email }).then(userDoc => {
        if (userDoc) {
            req.flash('error', 'That email is taken. Please try another.');
            return res.redirect('/register');
        }
        return bcrypt.hash(password, 12).then(hashedPassword => {
            const user = new User({
                name: name,
                email: email,
                password: hashedPassword,
            });
            return user.save();
        }).then(result => {
            res.redirect('/login');
            return transporter.sendMail({
                to: email,
                from: 'Collabo <no-reply@collabo.com>',
                subject: 'Welcome to Collabo! Signup Succeeded 👌 💋',
                html: '<h4>You successfully signed up! 👨‍💻 👍</h4>'
            })
        }).catch(err => {
            console.log(err);
        });
    }).catch(err => {
        console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};

exports.getResetPassword = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/reset', {
        pageTitle: 'Reset  password',
        errorMessage: message
    });
};

exports.postResetPassword = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email }).then(user => {
            if (!user) {
                req.flash('error', 'No account with that email found.');
                return res.redirect('/reset');
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save();
        }).then(result => {
            res.redirect('/');
            transporter.sendMail({
                to: req.body.email,
                from: 'support@collabo.com',
                subject: 'Password reset 👨‍💻',
                html: `<p>You requested a password reset</p>
               <p>Click this <a href="https://calm-plateau-70181.herokuapp.com/reset/${token}">link</a> 
                  to set a new password.</p>`
            });
        }).catch(err => {
            console.log(err);
        });
    });
};

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    //Note: $gt stand for greater than sign
    User.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() }
    }).then(user => {
        let message = req.flash('error');
        if (message.length > 0) {
            message = message[0];
        } else {
            message = null;
        }
        res.render('auth/new-password', {
            pageTitle: 'New Password',
            errorMessage: message,
            userId: user._id.toString(),
            passwordToken: token
        });
        console.log(userId);
    }).catch(err => {
        console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;
    User.findOne({
        resetToken: passwordToken,
        resetTokenExpiration: { $gt: Date.now() },
        _id: userId
    }).then(user => {
        resetUser = user;
        return bcrypt.hash(newPassword, 12);
    }).then(hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
    }).then(result => {
        res.redirect('/login');
    }).catch(err => {
        console.log(err);
    });
};