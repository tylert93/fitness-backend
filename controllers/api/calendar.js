import '../../config/database.js'
import { Calendar } from '../../models/calendar.js'
import { User } from '../../models/user.js'

export async function displayCalendar( req, res ) {
    try {
        const weights = await Calendar.find({"userId": req.params.id})
        res.json(weights)
    }
    catch {
        console.log("Error");
        res.sendStaus(400)
    }
}

export async function saveCalendar (req, res) {
    const user = await User.findById(req.body.userId)
    const calendar = new Calendar ({
        weight: parseFloat(req.body.weight),
        userId: user
    })
    calendar.save()
    .then(() => {
        console.log("Calendar Saved");
        res.sendStatus(200)
    })
    .catch(error => console.error(error))
}