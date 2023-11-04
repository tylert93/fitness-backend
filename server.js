import "dotenv/config";
import express, { response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from './routes/api/users.js'
import { User } from "./models/user.js";
import calendarRouter from "./routes/api/calendar.js";


const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/users', userRouter)
app.use('/calendar', calendarRouter)

mongoose.connect(process.env.DATABASE_URL);


const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`listening on port: ${port}`);
  });

app.get("/", async (req, res) => {
  res.json({ message: "Hello!" });
});


// Define a schema for Foods
const foodSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    date: {
      type: Date,
      default: Date.now
  },
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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    mealName: String,
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }]
});

const Meal = mongoose.model('Meal', mealSchema);

// Routes for Foods
app.get('/foods', async (req, res) => {
  try {
      const query = {};
      if (req.query.userId) {
          query.user = req.query.userId;
      }
      if (req.query.date) {
        const date = new Date(req.query.date);
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
    
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
    
        query.date = { $gte: startOfDay, $lte: endOfDay };
    }    
      const foods = await Food.find(query);
      res.json(foods);
  } catch (err) {
      res.status(500).send(err.message);
  }
});

app.get('/calories/total/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const date = new Date();
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const foods = await Food.find({ user: userId, date: { $gte: startOfDay, $lte: endOfDay } });

    const totalCalories = foods.reduce((total, food) => total + food.calories, 0);

    res.json({ totalCalories });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/foods/new/:id', async (req, res) => {
  try {
      const user = await User.findById(req.params.id);
      if (!user) {
          return res.status(404).send('User not found');
      }
      const food = new Food({
          ...req.body,
          user: user._id,
          date: new Date() // Explicitly set to the current date-time
      });
      await food.save();
      res.json(food);
  } catch (err) {
      res.status(500).send(err.message);
  }
});


app.put('/foods/:id', async (req, res) => {
  try {
      const updateData = { ...req.body };
      delete updateData.date;  // Prevent date from being updated

      const food = await Food.findByIdAndUpdate(req.params.id, updateData, { new: true });
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
        const query = {};
        if (req.query.userId) {
            query.user = req.query.userId;
        }
        const meals = await Meal.find(query).populate('items');
        res.json(meals);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/meals/new', async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        const meal = new Meal({
            ...req.body,
            user: user._id
        });
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

app.get("/foods/:id", async (req, res) => {
    try {
      const singleFood = await Food.findById(req.params.id);
      if (!singleFood) {
        return res.status(404).json({ error: 'Food not found' });
      }
      console.log("Single Food");
      res.json(singleFood);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
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

const Workout = mongoose.model("Workout", workoutSchema);

//WORKOUT ENDPOINTS---------------------------------------------------------

// add new workout

app.post("/workouts/new/:id", async (req, res) => {
  // console.log("User ID to find:", req.headers);
  const userId = req.params.id;
  console.log(req.params.id)
  const findUserId = await User.findById(userId);
  console.log(findUserId)
  
  // const { userid } = req.headers
  console.log("User ID found:", userId);
  const exercises = req.body.exercises.map((exerciseData) => ({
    exerciseName: exerciseData.exerciseName,
    sets: exerciseData.sets,
    reps: exerciseData.reps,
    weight: exerciseData.weight,
  }));

  const workoutRoutineData = {
    user: userId,
    workoutName: req.body.workoutName,
    workoutDate: req.body.workoutDate,
    exercises,
  };

  if (req.body.cardio !== null) {
    workoutRoutineData.cardio = {
      cardioType: req.body.cardio.cardioType,
      durationMinutes: req.body.cardio.durationMinutes,
      distance: req.body.cardio.distance,
    };
  }

  const workoutRoutine = new Workout(workoutRoutineData);


  await workoutRoutine
    .save()
    .then(() => {
      console.log("workout added");
      res.sendStatus(200);
    })
    .catch((error) => console.error(error));
});

// delete workout

app.delete("/workouts/:id", async (req, res) => {
  Workout.deleteOne({ _id: req.params.id })
    .then(() => {
      console.log("workout deleted");
      res.sendStatus(200);
    })
    .catch((error) => console.error(error));
});

// edit a workout

app.put("/workouts/:id", async (req, res) => {
    try {
      const workoutId = req.params.id;
      console.log("edit workout", workoutId)
      const updatedWorkoutData = req.body;
  
      const singleWorkout = await Workout.findById(workoutId);
  
      if (!singleWorkout) {
        return res.status(404).json({ error: 'Edit: Workout not found' });
      }
  
      singleWorkout.set(updatedWorkoutData);
      await singleWorkout.save();
  
      console.log("Edit: Workout updated");
      res.status(200).json(singleWorkout);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });
  

// display all workouts

app.get("/workouts", async (req, res) => {
  const { userid } = req.headers
  // console.log(userid)
  // Convert the userId to a MongoDB ObjectId
  const userObjectId = new mongoose.Types.ObjectId(userid);

  // Use the userObjectId to filter workouts by user
  const workouts = await Workout.find({ user: userObjectId });
  
  res.json(workouts);
});

// display a single workout

app.get("/workouts/:id", async (req, res) => {
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

  module.exports = app