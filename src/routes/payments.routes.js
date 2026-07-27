import express from "express";
import Stripe from "stripe";
import { verifyToken } from "../middleware/verifyToken.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();
const stripeSecret = process.env.STRIPE_SECRET_KEY || "sk_test_mock_axleway_key";
const stripe = new Stripe(stripeSecret);

router.post("/create-payment-intent", verifyToken, asyncHandler(async (req, res) => {
  const { amount } = req.body;

  if (!amount || Number(amount) <= 0) {
    return res.status(400).send({ message: "Invalid payment amount" });
  }

  const amountInCents = Math.round(Number(amount) * 100);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      payment_method_types: ["card"],
      metadata: {
        userEmail: req.user.email,
        purpose: "AxleWay Car Rental Checkout & Security Deposit Hold"
      }
    });

    res.send({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.send({
        clientSecret: `mock_secret_${Date.now()}`
      });
    }
    res.status(500).send({ message: error.message || "Failed to create Stripe payment intent" });
  }
}));

export default router;
