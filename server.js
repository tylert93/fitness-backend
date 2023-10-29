require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Listen for port
const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });

// Define a schema for Foods
const foodSchema = new mongoose.Schema({
    name: String,
    description: String,
    calories: Number,
    servingSize: String,
    category: String,
    protein: Number,
    carbs: Number,
    fats: Number,
    fiber: Number,
    sugar: Number
});

const Food = mongoose.model('Food', foodSchema);

// Define a schema for Meals
const mealSchema = new mongoose.Schema({
    mealName: String,
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }]
});

const Meal = mongoose.model('Meal', mealSchema);

// Routes for Foods
app.get('/foods', async (req, res) => {
    try {
        const foods = await Food.find();
        res.json(foods);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/foods/new', async (req, res) => {
    try {
        const food = new Food(req.body);
        await food.save();
        res.json(food);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.put('/foods/:id', async (req, res) => {
    try {
        const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(food);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.delete('/foods/:id', async (req, res) => {
    try {
        await Food.findByIdAndDelete(req.params.id);
        res.json({ message: 'Nutrition item deleted' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Routes for Meals
app.get('/meals', async (req, res) => {
    try {
        const meals = await Meal.find().populate('items');
        res.json(meals);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/meals/new', async (req, res) => {
    try {
        const meal = new Meal(req.body);
        await meal.save();
        res.json(meal);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.put('/meals/:id', async (req, res) => {
    try {
        const meal = await Meal.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(meal);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.delete('/meals/:id', async (req, res) => {
    try {
        await Meal.findByIdAndDelete(req.params.id);
        res.json({ message: 'Nutrition item deleted' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});