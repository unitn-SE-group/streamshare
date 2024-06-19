const app = require('./app/app.js');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

/**
 * https://devcenter.heroku.com/articles/preparing-a-codebase-for-heroku-deployment#4-listen-on-the-correct-port
 */
const port = process.env.PORT || 8080;


/**
 * Configure mongoose
 */
mongoose.Promise = global.Promise;
app.locals.db = mongoose.connect(process.env.MONGO_URI)
.then ( () => {
    
    //console.log("Connected to Database");
    
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
    
});