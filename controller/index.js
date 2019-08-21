exports.LandingPage = (req, res, next) => {
    res.render('index', { pageTitle: 'Landing'});
};

exports.homePage = (req, res, next) => {
    res.render('home', { pageTitle: 'Home'});
};