const express = require("express");
const {
  createSubscription,
  getSubscriptionByUser,
} = require("../controllers/subscriptionController");
const router = express.Router();

router.post("/subscriptions", createSubscription);
router.get("/subscriptions/user/:userId", getSubscriptionByUser);

module.exports = router;
