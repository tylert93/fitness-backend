import "dotenv/config";
import express, { response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.DATABASE_URL);



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