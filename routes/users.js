const express = require('express');
const { User } = require("../models");
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const user = await User.findAll()
    if (user) {
      return res.json({success: true, user})
    } else {
      return res.json({success: false, user: null})
    }
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
