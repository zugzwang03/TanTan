const app = require('./app.js');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config/config.env' });

const connDb = () => {
    mongoose.connect(process.env.MONGO_URI, {
        dbName: 'Tantan',
    }).then(() => {
        console.log('Db Connected!');
    }).catch((e) => {
        console.log(e);
    })
};

connDb();

app.listen(process.env.PORT, () => {
    console.log(`Server running on Port: ${process.env.PORT}`);
});