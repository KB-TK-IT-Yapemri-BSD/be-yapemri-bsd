const express = require("express");

const userRoutes = require("./user.route");
const authRoutes = require("./auth.route");
const registrationRoutes = require("./registration.route");
const paymentRoutes = require("./payment.route");
const paymentTypeRoutes = require("./paymentType.route");
const studentRoutes = require("./student.route");
const parentRoutes = require("./parent.route");
const staffRoutes = require("./staff.route");
const evaluationRoutes = require("./evaluation.route");
const approvalRoutes = require("./approval.route");

const router = express.Router();

/**
 * GET v1/status
 */
router.get("/status", (req, res) => res.send("OK"));

/**
 * GET v1/docs
 */
router.use("/docs", express.static("docs"));

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/forms", registrationRoutes);
router.use("/payments", paymentRoutes);
router.use("/paymentTypes", paymentTypeRoutes);
router.use("/students", studentRoutes);
router.use("/parents", parentRoutes);
router.use("/staffs", staffRoutes);
router.use("/evaluations", evaluationRoutes);
router.use("/approvals", approvalRoutes);
module.exports = router;
