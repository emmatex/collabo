const express = require("express");
const exphbs = require("express-handlebars");
const path = require('path');

const app = express();

// express-handlebars middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//static folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
   res.render('index');
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});