const express = require('express');
const cors = require('cors');
const monk = require('monk');
const Filter = require('bad-words');
const rateLimit = require('express-rate-limit');

const app = express();

const db = monk(process.env.MONGO_URI); //'mongodb+srv://username:password@cluster0.4dteb.mongodb.net/chatapp?retryWrites=true&w=majority');
const chats = db.get('chats');
const filter = new Filter();

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.json({
        message: 'MESSAGE!!!'
    });
});

app.get('/chats', (req, res) => {
    chats
    .find()
    .then(chats => {
        res.json(chats);
    });
});



function isValidChat(chat) {
    return chat.name && chat.name.toString().trim() !=='' && 
    chat.content && chat.content.toString().trim() !=='';
}

app.use(rateLimit({
    windowMs: 5 * 1000,
    max: 1
}));

app.post('/chats', (req, res) => {
    if(isValidChat(req.body)) {
        //insert into DB
        const chat = {
            name: filter.clean(req.body.name.toString()),
            content: filter.clean(req.body.content.toString()),
            created: new Date()
        };
        console.log(chat);

        chats
        .insert(chat)
        .then(createdChat => {
            res.json(createdChat);
        });

    } else {
        res.status(422);
        res.json({
            message: 'Hey! Name and chat are required!'
        });
    }
});

app.listen(5000, () => {
    console.log('Listening on https://localhost:5000');
});

