const { verifyToken, verifyTokenandAuth, verifyTokenannAdmin} = require('./verifyToken');
const CryptoJS = require("crypto-js");
const User = require('../models/User')
const router = require('express').Router();

//Update
router.put('/:id',verifyTokenandAuth, async (req, res) => {
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASSWORD_SEC
        ).toString()
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true})
        res.status(200).json(updatedUser)
    }catch (e) {
     return  res.status(500).json(e)
    }

});
//Delete
router.delete('/:id',verifyTokenandAuth,async (req,res) => {
    try {
    await User.findByIdAndDelete(req.params.id)
        res.status(200).json('User has been deleted')
    }catch (e) {
        return res.status(500).json(err)
    }
})

//GET USER
router.get('/find/:id',verifyTokenannAdmin,async (req,res) => {
    try {
      const user =   await User.findById(req.params.id)
        const { password, ...others } = user._doc;

         res.status(200).json(others );
    }catch (e) {
         res.status(500).json(e)
    }
})
//GET ALL USERS
router.get('/',verifyTokenannAdmin,async (req,res) => {
    const query = req.query.new
    try {
        const users = query ? await User.find().sort({_id: -1}).limit(5)  : await User.find(req.params.id)
        res.status(200).json(users);
    }catch (e) {
        res.status(500).json(e)
    }
})
//GET USER STATS
router.get('/stats',verifyTokenannAdmin, async (req,res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear()-1))
    
    try {

        const data = await User.aggregate([
            {$match:{createdAt:{$gte:lastYear}}},
            {
                $project:{
                    month:{$month:'$createdAt'}
                }
            },
            {
                $group:{
                    _id:"$month",
                    total:{$sum:1}
                }
            }
        ]);
        res.status(200).json(data)
        
    }catch (e) {
        res.status(500).json(e)
    }
})
module.exports = router;
