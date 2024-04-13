require('dotenv').config();
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const cookieParser = require("cookie-parser");

const helmet = require("helmet");
const morgan = require('morgan');


const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

app.use(express.json());
app.use(express.urlencoded({ extended:false }));
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(morgan('combined', {stream: accessLogStream}));



const db = require('./models');

const userRouter = require('./routes/User');
app.use('/user',userRouter);
const expenseRouter = require('./routes/Expense');
app.use('/expense',expenseRouter);
const purchaseRouter = require('./routes/Purchase');
app.use('/orders',purchaseRouter);
const LeaderBoardRouter = require('./routes/LeaderBoard');
app.use('/leader_board',LeaderBoardRouter);
const ForgetPasswordRouter = require('./routes/ForgetPassword');
app.use('/password',ForgetPasswordRouter);
const DownloadExpensesRouter = require('./routes/DownloadExpenses');
app.use('/download',DownloadExpensesRouter);

db.sequelize.sync().then(()=>{
    app.listen(process.env.PORT, ()=>{
    console.log('server is running on port 3001');
});
});  