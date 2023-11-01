import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userEmail: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    }, 
    height: Number,
    weight: Number,
    age: Number,
    gender: String

  });

export const User = mongoose.model('User', userSchema)