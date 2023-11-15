const router = require("express").Router();

const UserActivity = require("../models/user/UserActivity");

router.post("/add", async (req, res) => {
  try {

    let newActivity = {
      idUser: req.body.id,
      action: req.body.action,
  };

    await UserActivity.create(newActivity);

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