const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app  = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const MenuItem = require('./models/menuItem.js')


app.use(express.urlencoded({ extended: false }));
app.use(express.static('public')); 
app.use(methodOverride('_method'));
app.use(morgan('dev'));



mongoose.connect(process.env.MONGODB_URI);

app.get('/menu' , async (req, res) => {
   
    const menu = await MenuItem.find();
    res.render('index.ejs', {menu: menu});
})

app.get('/menu/new', (req, res) => {
    res.render('./menu/new.ejs');
})
app.get('/menu/:itemId', async (req, res) => {
    const item = await MenuItem.findById(req.params.itemId);
    
    res.render('./menu/showItem.ejs', {item: item});
})
app.get('/menu/:itemId/edit', async (req, res) => {
    const item = await MenuItem.findById(req.params.itemId);
    
    res.render('./menu/edit.ejs', {item: item});
})
app.put('/menu/:itemId', async(req, res) => {
    await MenuItem.findByIdAndUpdate(req.params.itemId, req.body);
    res.redirect(`/menu/${req.params.itemId}`)
})

app.post('/menu', async (req, res) => {
    //console.log(req.body);
    //res.send(req.body);
    await MenuItem.create(req.body);
    res.redirect('/menu');
})

app.delete('/menu/:itemId', async (req, res) => {
    await MenuItem.findByIdAndDelete(req.params.itemId); 
    res.redirect('/menu');
})


mongoose.connection.on('connected', ()=>{
    console.log(`Connected to MongoDB ${mongoose.connection.name}`)
})

app.listen(3000, () => {
    console.log('WE ARE ON 3000 PLAYAAA');
})

