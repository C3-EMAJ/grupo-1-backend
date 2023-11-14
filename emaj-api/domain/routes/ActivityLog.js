const router = require("express").Router();

const Activity = require("../models/Activity")

router.post("/add", async (req, res) => {
    try {
        let newActivity = {
            id: req.body.id,
            action: req.body.action,
        };
        await Activity.create(newActivity);
        res.status(200).json();
      } catch (err) {
        console.log(err)
        res.status(500).json(err);
      }
  
  });

router.get("/find/:id", async (req, res) => {
    try {
        const activity = await Activity.findAll({ where: { id: req.params.id } })
        res.status(200).json(activity);
      } catch (error) {
        res.status(500).json(error);
      }
})

module.exports = router;