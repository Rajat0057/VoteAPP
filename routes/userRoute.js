const express = require('express');
const User = require('../models/user')
const router = express.Router();
const { jwtAuthMiddleWare, genrateToken } = require("./../jwt");



router.post('/signup', async (req, resp) => {
    try {
        const data = req.body;

        const newUser = new User(data);
        const savePerson = await newUser.save()
        console.log('data response')
        const payload = {
            id: savePerson.id,

        }

        const token = genrateToken(payload);
        console.log("my token is", token)

        resp.status(200).json({ savePerson: savePerson, token: token });
    } catch (err) {
        console.log("the err", err);
        resp.status(500).json({ err })



    }

})


router.post('/login', async (req, resp) => {
    try {
        const { aadharCardNumber, password } = req.body;

        const user = await User.findOne({ aadharCardNumber: aadharCardNumber });
        if (!user || !(await user.comparePassword(password))) {

            return resp.status(401).json({ error: 'user ot password not valid' })
        }


        const payload = {
            id: user.id,

        }

        const token = genrateToken(payload)

        resp.status(200).json(token);
    } catch (err) {
        console.log("the err", err);
        resp.status(500).json({ err })



    }

})


router.get('/getAll', jwtAuthMiddleWare, async (req, resp) => {

    try {

        const data = await User.find();
        resp.status(200).json(data)

    } catch (err) {
        resp.status(500).json(err)
    }

})

router.put('/profile/password', jwtAuthMiddleWare, async (req, resp) => {
    try {

        const userId = req.user;
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(userId);
        if (!(await user.comparePassword(currentPassword))) {

            return resp.status(401).json({ error: 'user ot password not valid' })
        }
        user.password = newPassword;
        await user.save();

        console.log("password changed");

        resp.status(200).json({ messgae:"password changed"})

    } catch (err) {
        resp.status(500).json(err)
    }




})

router.put('/update/:id', jwtAuthMiddleWare, async (req, resp) => {
    try {
        const userId = req.user;

        const data = req.body;
        console.log("the us", userId)
        const response = await User.findByIdAndUpdate(userId, data, {
            new: true,
            runValidators: true
        })
        if (!response) {
            return resp.status(400).json({ err: 'not found' })
        }
        console.log("updated");
        resp.status(200).json(response)
    }

    catch (err) {
        resp.status(500).json({ err })
    }
})


module.exports = router;


