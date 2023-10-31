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
          console.log("user saved")
        });
    } else {
        res.sendStatus(500)
        console.log("user not saved")
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
        const user = await User.findOne({ userEmail: req.params.email }); // Find user by email
        console.log(req.params.email);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user); // Return user information if found
    } catch (error) {
        console.error(error);
        res.sendStatus(500); // Send a server error response
    }
}

export async function deleteUser (req,res) {
    User.deleteOne({"_id": req.params.id})
    .then(() => {
        res.sendStatus(200)
    })
    .catch(error => console.error(error))
}