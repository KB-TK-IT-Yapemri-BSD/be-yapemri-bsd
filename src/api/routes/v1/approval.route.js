const express = require("express");

const controller = require("../../controllers/approval.controller");
const { authorize } = require("../../middlewares/auth");

const router = express.Router();

router.param("approvalId", controller.load);

router
  .route("/")
  .get(authorize(), controller.list)
  .post(authorize(), controller.create);

router
  .route("/:approvalId")
  .get(authorize(), controller.get)
  .put(authorize(), controller.replace)
  .patch(authorize(), controller.update)
  .delete(authorize(), controller.remove);

router.route("/:approvalId/approved").patch(authorize(), controller.approve);
router.route("/:approvalId/rejected").patch(authorize(), controller.reject);

module.exports = router;
