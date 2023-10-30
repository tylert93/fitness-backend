app.use('/users', userRouter)

import "dotenv/config";
import express, { response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.DATABASE_URL);


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


//WORKOUT SCHEMA---------------------------------------------------------

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  workoutName: String,
  workoutDate: Date, // Date when the workout was completed
  exercises: [
    {
      exerciseName: String,
      sets: Number,
      reps: Number,
      weight: Number,
    },
  ],
  cardio: {
    cardioType: String,
    durationMinutes: Number,
    distance: Number,
  },
  // Other workout-related attributes if needed
});

const Workout = mongoose.model("workout", workoutSchema);

const port = process.env.PORT || 4000;

//WORKOUT ENDPOINTS---------------------------------------------------------

app.listen(port, () => {
    console.log(`listening on port: ${port}`);
  });
app.get("/", async (req, res) => {
  res.json({ message: "Hello!" });
});

// add new workout

app.post("/workout/new", async (req, res) => {
  const findUserId = await User.findById(req.body.findUserId);
  const exercises = req.body.exercises.map((exerciseData) => ({
    exerciseName: exerciseData.exerciseName,
    sets: exerciseData.sets,
    reps: exerciseData.reps,
    weight: exerciseData.weight,
  }));
  const workoutRoutine = new Workout({
    user: findUserId,
    workoutName: req.body.workoutName,
    workoutDate: req.body.workoutDate,
    exercises,
    cardio: {
      cardioType: req.body.cardio.cardioType,
      durationMinutes: req.body.cardio.durationMinutes,
      distance: req.body.cardio.distance,
    },
  });
  await workoutRoutine
    .save()
    .then(() => {
      console.log("workout added");
      res.sendStatus(200);
    })
    .catch((error) => console.error(error));
});

// delete workout

app.delete("/workout/:id", async (req, res) => {
  Workout.deleteOne({ _id: req.params.id })
    .then(() => {
      console.log("workout deleted");
      res.sendStatus(200);
    })
    .catch((error) => console.error(error));
});

// edit a workout

app.put("/workout/:id", async (req, res) => {
    try {
      const workoutId = req.params.id;
      const updatedWorkoutData = req.body;
  
      const singleWorkout = await Workout.findById(workoutId);
  
      if (!singleWorkout) {
        return res.status(404).json({ error: 'Workout not found' });
      }
  
      singleWorkout.set(updatedWorkoutData);
      await singleWorkout.save();
  
      console.log("Workout updated");
      res.status(202).json(singleWorkout);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });
  

// display all workouts

app.get("/workout", async (req, res) => {
  const workouts = await Workout.find({});
  res.json(workouts);
});

// display a single workout

app.get("/workout/:id", async (req, res) => {
    try {
      const singleWorkout = await Workout.findById(req.params.id);
      if (!singleWorkout) {
        return res.status(404).json({ error: 'Workout not found' });
      }
      console.log("Single workout");
      res.json(singleWorkout);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });
