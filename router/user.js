const req = require("express/lib/request");

const router = require("express").Router();

router.get("/users",(req,res) => {
    res.send("List of users")
});

router.post("/login",(req,res) => {
    const {username,password} = req.body
    res.status(200).send({username,password})
});


module.exports = router