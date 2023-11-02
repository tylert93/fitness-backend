import { displayCalendar, displayMostRecentWeight, saveCalendar, deleteCalendar, updateCalendar } from "../../controllers/api/calendar.js";
import express from 'express'

const calendarRouter = express.Router()

calendarRouter.get('/:id', async (req, res) => displayCalendar(req,res))

calendarRouter.get('/recent/:id', async (req,res) => displayMostRecentWeight(req, res))

calendarRouter.post('/new', async (req, res) => saveCalendar(req,res))

calendarRouter.put('/update/:id', async (req, res) => updateCalendar(req, res))

calendarRouter.delete('/delete/:id', async (req, res) => deleteCalendar(req, res))

export default calendarRouter