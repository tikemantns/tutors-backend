const express = require('express')
const router = express.Router()
const Menu = require('../_models/menu')
const Footer = require('../_models/footer')


router.get('/main-header-menu', async (req, res) => {
    try{
        const menu = await Menu.find()
        return res.json({response: menu})
    }catch(e){
        res.status(500).send({Error: 'Something went wrong.'})
    }
})

router.get('/footer-details', async (req, res) => {
    try{
        const footerData = await Footer.find()
        return res.json({response: footerData})
    }catch (e) {
        res.status(500).send({Error: 'Something went wrong.'})
    }

}) 

module.exports = router;
