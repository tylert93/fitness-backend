import '../../config/database.js'
import { User } from '../../models/user.js'

export async function saveUser(req, res) {
    if ((await User.count({ userEmail: req.body.email })) === 0) {
        const newuser = new User({
          userEmail: req.body.email,
          name: req.body.name,
        });
        newuser.save().then(() => {
          res.sendStatus(200);
        });
    } else {
        res.sendStatus(500)
    }
}

export async function updateUser(req, res) {
    await User.findByIdAndUpdate(req.params.id, { height: req.body.height, weight: parseFloat(req.body.weight), age: req.body.age, gender: req.body.gender})
    .then(() => {
        res.sendStatus(200)
    })
    .catch((error) => {
        res.sendStatus(400)
    })
}

export async function displayUser(req, res) {
    try {
        const user = await User.findById(req.params.id)
        res.json(user)
    } catch {
        console.log('Error');
        res.sendStatus(400)
    }
}

export async function deleteUser (req,res) {
    User.deleteOne({"_id": req.params.id})
    .then(() => {
        res.sendStatus(200)
    })
    .catch(error => console.error(error))
}