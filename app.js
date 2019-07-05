const express = require('express');
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();

const indexRoute = require('./routes/index');
const authRoute = require('./routes/auth');

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// express-handlebars middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(indexRoute);
app.use('/access', authRoute);

app.use((req, res, next) => {
    res.status(400).render('404');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});