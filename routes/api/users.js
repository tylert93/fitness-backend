import { saveUser, deleteUser, displayUser, updateUser } from "../../controllers/api/users.js";
import express from 'express'

const userRouter = express.Router()

// User Endpoints

userRouter.get('/:email', async (req,res) => displayUser(req,res))

userRouter.post('/new', async (req,res) => saveUser(req,res))

userRouter.put('/:id', async (req,res) => updateUser(req,res))

userRouter.delete('/:id', async (req,res) => deleteUser(req,res))

export default userRouter
