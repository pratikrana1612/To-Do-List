const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs')
const path = require('path');
const date = require(path.resolve('./date.js'));

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'))
const tasks = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

app.get('/', (req, res) => {
    // let day = new Date();
    // if (day.getDay() === 6 || day.getDay() === 0) {
    //     day = 'WeekDay'
    //     // res.sendFile(path.resolve('./index.html'));
    // } else {
    //     day = 'WorkDay'
    //     // res.sendFile(path.resolve('./index.html'));
    // }
    const day = date.getDay();
    res.render('lists', {
        listTitle: day,
        tasks: tasks
    })
})

app.get('/work', (req, res) => {
    res.render('lists', { listTitle: 'Work List', tasks: workItems })
})

app.post('/', (req, res) => {
    const task = req.body.task;
    if (!task) {
        res.send("Don't Try to be Smart. Please")
    }
    if (req.body.list === 'Work List') {
        workItems.push(task);
        res.redirect('/work');
    }
    else {
        tasks.push(task);
        res.redirect('/');
    }
})

app.get("/about", (req, res) => {
    res.render('about');
})

app.post('/work', (req, res) => {
    let newWork = req.body.task;
    if (!newWork) {
        res.send("Don't Try to be Smart. Please")
    }

})

app.listen(3000, () => {
    console.log('listing server')
});