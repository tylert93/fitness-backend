const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());            // Enable CORS for all routes
app.use(express.json());    // Parse JSON request body

// Listen for port
const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL)

// Define a schema and model for the nutrition data
const nutritionSchema = new mongoose.Schema({
    foodId: String,       // Unique identifier for the food item
    name: String,         // Name of the food
    description: String,  // A brief description or additional details about the food
    calories: Number,     // Calories for the mentioned servingSize
    servingSize: String,  // E.g., '100g', '1 cup', '1 piece'
    category: String,     // E.g., 'Fruit', 'Vegetable', 'Dairy'
    protein: Number,
    carbs: Number,
    fats: Number,
    fiber: Number,
    sugar: Number
});

const Nutrition = mongoose.model('Nutrition', nutritionSchema);

// Routes
app.get('/nutrition', async (req, res) => {
    try {
        const foods = await Nutrition.find();
        res.json(foods);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/nutrition', async (req, res) => {
    try {
        const food = new Nutrition(req.body);
        await food.save();
        res.json(food);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.put('/nutrition/:id', async (req, res) => {
    try {
        const food = await Nutrition.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(food);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.delete('/nutrition/:id', async (req, res) => {
    try {
        await Nutrition.findByIdAndDelete(req.params.id);
        res.json({ message: 'Nutrition item deleted' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});
