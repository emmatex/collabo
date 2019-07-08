const express = require('express');
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const config = require('./util/database');
//controllers
const errorController = require('./controller/error');

const app = express();
const store = new MongoDBStore({
    uri: config.connectionString,
    collection: 'sessions'
  });

const indexRoute = require('./routes/index');
const authRoute = require('./routes/auth');

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(session({secret: config.sessionKey, resave: false, saveUninitialized: false, store: store}))

//static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(indexRoute);
app.use(authRoute);

app.use(errorController.get404);

mongoose.connect(config.connectionString)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});