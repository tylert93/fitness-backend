import { displayCalendar, saveCalendar } from "../../controllers/api/calendar.js";
import express from 'express'

const calendarRouter = express.Router()

calendarRouter.get('/:id', async (req, res) => displayCalendar(req,res))

calendarRouter.post('/new', async (req, res) => saveCalendar(req,res))

export default calendarRouter