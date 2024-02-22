const express = require("express");
const validate = require("express-validation");
const controller = require("../../controllers/approval.controller");
const { authorize, ADMIN } = require("../../middlewares/auth");

const router = express.Router();

router.param("approvalId", controller.load);

router
  .route("/")
  .get(authorize(), controller.list)
  .post(authorize(), controller.create);

router
  .route("/:approvalId")
  .get(authorize(ADMIN), controller.get)
  .put(authorize(ADMIN), controller.replace)
  .patch(authorize(ADMIN), controller.update)
  .delete(authorize(), controller.remove);

module.exports = router;
