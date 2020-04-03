const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');

app.use('/public', express.static(`${__dirname}/public`));

const indexRouter = require('./routes/index');

app.use('/', indexRouter);

app.listen(process.env.DVIZPORT, () => console.log(`App listening on port ${process.env.DVIZPORT}`));
