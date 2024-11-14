const prisma = require("../../prisma/prismaClient");

// Create a subscription
async function createSubscription(req, res) {
  const { userId, startDate, endDate } = req.body;
  try {
    const subscription = await prisma.subscription.create({
      data: {
        userId,
        startDate,
        endDate,
        active: true,
      },
    });
    res
      .status(201)
      .json({ message: "Subscription created successfully", subscription });
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(500).json({ error: "Failed to create subscription" });
  }
}

// Get subscription by user ID
async function getSubscriptionByUser(req, res) {
  console.log("createSubscription function called");
  const { userId } = req.params;
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: parseInt(userId) },
    });
    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    res.json(subscription);
  } catch (error) {
    console.error("Error retrieving subscription:", error);
    res.status(500).json({ error: "Failed to retrieve subscription" });
  }
}

module.exports = { createSubscription, getSubscriptionByUser };
