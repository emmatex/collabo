exports.get404 = (req, res, next) => {
    res.status(400).render('error/404');
};