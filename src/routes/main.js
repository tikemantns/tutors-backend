const express = require('express');
const router = express.Router();
const Menu = require('../_models/menu');


router.get('/main-header-menu', async (req, res) => {
    try{
        const menu = await Menu.find()
        return res.json({response: menu});
    }catch(e){
        res.status(500).send({Error: 'Something went wrong.'})
    }
})

module.exports = router;
