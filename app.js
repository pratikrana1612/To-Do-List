const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs')
const _ = require('lodash')

const path = require('path');
const mongoose = require('mongoose')
// const createDB = require('./mongodb');

const date = require(path.resolve('./date.js'));

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'))
// const tasks = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];


async function createAndConnect(schema = { name: String, tasks: [new mongoose.Schema({ name: String })] }, collection = 'Item') {
    await mongoose.connect("mongodb://127.0.0.1:27017/todolistDB")
    const todolistSchema = new mongoose.Schema(schema)
    const Item = mongoose.models[collection] || new mongoose.model(collection, todolistSchema)
    return Item
}

async function InsertItems(listName, listOfTasks) {
    const Item = await createAndConnect();
    const firstItem = new Item({ name: listName, tasks: listOfTasks })
    const result = await Item.insertMany([firstItem])
    // console.log(result)
}
async function readItems(toDoName) {
    const Item = await createAndConnect()
    const result = await Item.find({ name: toDoName })
    return result
}


app.get('/', (req, res) => {
    // let day = new Date();
    // if (day.getDay() === 6 || day.getDay() === 0) {
    //     day = 'WeekDay'
    //     // res.sendFile(path.resolve('./index.html'));
    // } else {
    //     day = 'WorkDay'
    //     // res.sendFile(path.resolve('./index.html'));
    // }
    // const day = date.getDay();
    readItems('General').then(async (tasks) => {
        if (tasks.length === 0) {
            const defaultTodos = [{ name: 'Buy Food' }, { name: 'Cook Food' }, { name: 'Eat Food' }]
            const result = await InsertItems('General', defaultTodos);
            console.log("Saved Default Items");
            res.redirect('/');
        }
        else {
            res.render('lists', {
                listTitle: tasks[0].name,
                tasks: tasks[0].tasks
            })
        }
        // mongoose.connection.close()
    }).catch(err => console.log(err))

})

app.get('/:title', async (req, res) => {
    // req.params
    const title = _.capitalize(req.params.title);
    const doc = await readItems(title)
    if (doc.length === 0) {
        const result = await InsertItems(title, [{ name: 'Yes it working' }]);
        res.redirect(`/${title}`);
    } else {
        res.render('lists', { listTitle: title, tasks: doc[0].tasks })
    }
})

app.post('/', (req, res) => {
    const task = req.body.task;
    const title = req.body.list
    if (!task) {
        res.send("Don't Try to be Smart. Please")
    }
    // if (req.body.list === 'Work List') {
    //     workItems.push(task);
    //     res.redirect('/work');
    // }
    createAndConnect().then(async Item => {
        const doc = await Item.findOne({ name: title })
        doc.tasks.push({ name: task })
        doc.save()
        title === 'General' ? res.redirect('/') : res.redirect(`/${title}`)

    })
})
app.post('/delete', async (req, res) => {
    // console.log(req.body);
    const title = req.body.listName;
    const Item = await createAndConnect();
    const result = await Item.findOneAndUpdate({ name: title }, { $pull: { tasks: { _id: req.body.checkbox } } })
    title === 'General' ? res.redirect('/') : res.redirect(`/${title}`)
    // createAndConnect().then(async (Item) => {
    //     await Item.deleteOne({ _id: req.body.checkbox })
    //     res.redirect('/')
    // })
})
app.get("/about", (req, res) => {
    res.render('about');
})


// app.post('/work', (req, res) => {
//     let newWork = req.body.task;
//     if (!newWork) {
//         res.send("Don't Try to be Smart. Please")
//     }
// })

app.listen(3000, () => {
    console.log('listing server')
});