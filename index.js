const app = require('./app/app.js');
const mongoose = require('mongoose');


const port = process.env.PORT || 3000;

app.locals.db = mongoose.connect(process.env.DATABASE_URI)
.then(
    ()=> {
        console.log("Connected to MongoDB"),
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`)
        })
    }
)
.catch(
    err => console.error("Could not connect to MongoDB", err)
);