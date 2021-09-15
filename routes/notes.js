const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fetchToken = require('../middlewere/fetchToken');
const User = require('../models/User');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');

// const JWT_SECRET_SIGN="alchamyaaligerd6Feb1999#";

//route for new note POST /api/note/newnote login requried
router.post('/newnote', fetchToken, [
    //validation 
    body('title', 'enter a valid title').isLength({ min: 10 }),
    body('description', 'enter a valid description with 20 length').isLength({ min: 20 })],
    async (req, res) => {
        //if error occure in validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const userData = await User.findById(req.user.id);
            if (!userData) {
                return res.status(401).json({ error: "please login with  right credential" });
            }
            let { title, description, tag } = req.body;
            userid = req.user.id;
            //set the values in Database
            const saveNote = await Notes.create({
                title: title,
                description: description,
                tag: tag,
                user: userid
            });
            res.send(saveNote);
        } catch (error) {
            console.log(error.message);
            res.status(400).json({ error: "Internal Server Error" });
        }

    });


//route for fetch personalized notes from db POST /api/note/fetchnote login requried
router.post('/fetchnote', fetchToken, async (req, res) => {
    try {
        const user_id = req.user.id
        const userNotes = await Notes.find({ user: user_id })
        res.send(userNotes);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ error: "Internal Server Error" });
    }

});


//route for update existing note  PUT /api/note/update login requried
router.put('/updatenote/:id', fetchToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, description, tag } = req.body;
        let updateNotes = {};
        if (title) { updateNotes.title = title };
        if (description) { updateNotes.description = description };
        if (tag) { updateNotes.tag = tag };
        const noteFind = await Notes.findById(req.params.id);
        if (!noteFind) { return res.status(404).send("Note Not Found"); }
        if (noteFind.user.toString() !== userId) { return res.status(406).send("You are not allow to do that"); }
        const saveNote = await Notes.findByIdAndUpdate(req.params.id, { $set: updateNotes }, { new: true });
        res.send(saveNote);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ error: "Internal Server Error" });
    }
});


//route for delete existing note  delete /api/note/delete login requried
router.delete('/delete/:id', fetchToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const noteFind = await Notes.findById(req.params.id);
        if (!noteFind) { return res.status(404).send("Note Not Found"); }
        if (noteFind.user.toString() !== userId) { return res.status(203).send("You are not allow to do that"); }
        await Notes.findByIdAndDelete(req.params.id);
        res.status(200).send("success");
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ error: "Internal Server Error" });
    }
});

module.exports = router;