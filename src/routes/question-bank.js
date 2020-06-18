const express = require('express')
const router = express.Router()
const Course = require('../_models/course')
const Subject = require('../_models/subject')
const Topic = require('../_models/topic')
const Question = require('../_models/question')


router.post('/add-course', async (req, res) => {
    try {
        const newCourse = new Course(req.body) 
        const course = await newCourse.save()
        if(!course) return res.json({error: "Something went wrong. Please try again."})
        return res.json({"success": true, "course": course})
    }catch(err){
        return res.json({error: err});
    }
})

router.get('/get-course-list', async (req, res) => {
    try{
            
        let obj = { 'name': { $regex: new RegExp(req.query.search, 'i') } }

        let sortObject = {};
        let sortby = req.query.sortby;
        let sortorder = req.query.sortorder;
        sortObject[sortby] = sortorder;

        let options = {
            sort:     sortObject,
            lean:     true,
            offset:   parseInt(req.query.page), 
            limit:    parseInt(req.query.per_page)
        }
        return res.json({response: await Course.paginate(obj, options)}) 
    }catch(err){
        return res.json({error: err}) 
    }
})

router.get('/get-subject-list', async (req, res) => {
    try{
            
        let obj = { 'name': { $regex: new RegExp(req.query.search, 'i') } }
        
        let sortObject = {};
        let sortby = req.query.sortby;
        let sortorder = req.query.sortorder;
        sortObject[sortby] = sortorder;

        let options = {
            populate: 'course',
            sort:     sortObject,
            lean:     true,
            offset:   parseInt(req.query.page), 
            limit:    parseInt(req.query.per_page)
        }
        return res.json({response: await Subject.paginate(obj, options)}) 
    }catch(err){
        return res.json({error: err}) 
    }
})


router.post('/add-subject', async (req, res) => {
    try {
        const newSubject = new Subject(req.body) 
        const subject = await newSubject.save()
        if(!subject) return res.json({error: "Something went wrong. Please try again."})
        return res.json({"success": true, "subject": subject})
    }catch(err){
        return res.json({error: err});
    }
})


router.post('/add-topic', async (req, res) => {
    try {
        const newTopic = new Topic(req.body) 
        const topic = await newTopic.save()
        if(!topic) return res.json({error: "Something went wrong. Please try again."})
        return res.json({"success": true, "topic": topic})
    }catch(err){
        return res.json({error: err});
    }
})

router.get('/get-topic-list', async (req, res) => {
    try{
            
        let obj = { 'name': { $regex: new RegExp(req.query.search, 'i') } }
        
        let sortObject = {};
        let sortby = req.query.sortby;
        let sortorder = req.query.sortorder;
        sortObject[sortby] = sortorder;

        let options = {
            populate: ['course','subject'],
            sort:     sortObject,
            lean:     true,
            offset:   parseInt(req.query.page), 
            limit:    parseInt(req.query.per_page)
        }
        return res.json({response: await Topic.paginate(obj, options)}) 
    }catch(err){
        return res.json({error: err}) 
    }
})

router.post('/add-questions', async (req, res) => {
    try {
        const newQuestion = new Question(req.body) 
        const question = await newQuestion.save()
        if(!question) return res.json({error: "Something went wrong. Please try again."})
        return res.json({"success": true, "question": question})
    }catch(err){
        return res.json({error: err});
    }
})


router.get('/get-question-list', async (req, res) => {
    try{
            
        let obj = { 'name': { $regex: new RegExp(req.query.search, 'i') } }
        
        let sortObject = {};
        let sortby = req.query.sortby;
        let sortorder = req.query.sortorder;
        sortObject[sortby] = sortorder;

        let options = {
            populate: ['course','subject', 'topic'],
            sort:     sortObject,
            lean:     true,
            offset:   parseInt(req.query.page), 
            limit:    parseInt(req.query.per_page)
        }
        return res.json({response: await Question.paginate(obj, options)}) 
    }catch(err){
        return res.json({error: err}) 
    }
})









module.exports = router;
