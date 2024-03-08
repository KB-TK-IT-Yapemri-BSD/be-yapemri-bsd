const express = require("express");
const validate = require("express-validation");
const controller = require("../../controllers/evaluation.controller");
const { authorize, ADMIN } = require("../../middlewares/auth");
const {
  listEvaluations,
  createEvaluation,
  updateEvaluation,
} = require("../../validations/evaluation.validation");

const router = express.Router();

/**
 * Load user when API with evaluationId route parameter is hit
 */
router.param("evaluationId", controller.load);

router
  .route("/")
  /**
   * @api {get} v1/evaluations List Evaluations
   * @apiDescription Get a list of evaluations
   * @apiVersion 1.0.0
   * @apiName ListEvaluations
   * @apiGroup Evaluation
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}     [page=1]          List page
   * @apiParam  {Number{1-100}}  [perPage=1]       Evaluations per page
   * @apiParam  {String}         [id]              Evaluation's id
   * @apiParam  {String}         [status]          Evaluation's status
   * @apiParam  {String}         [firstName]       Evaluation's first name
   * @apiParam  {String}         [lastName]        Evaluation's last name
   * @apiParam  {String}         [birthplace]      Evaluation's birthplace
   * @apiParam  {Date}           [birthdate]       Evaluation's birthdate
   * @apiParam  {Boolean}        [gender]          Evaluation's gender
   * @apiParam  {String}         [religion]        Evaluation's religion
   * @apiParam  {String}         [citizenship]     Evaluation's citizenship
   * @apiParam  {String}         [address]         Evaluation's address
   * @apiParam  {String}         [phone]           Evaluation's phone
   * @apiParam  {String}         [education]       Evaluation's education
   *
   * @apiSuccess {Object[]} forms List of evaluations.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(
    authorize(["teachers", "secondary_teachers", "supervisors"]),
    validate(listEvaluations),
    controller.list
  )
  /**
   * @api {post} v1/evaluations Create Evaluation
   * @apiDescription Create a new evaluation
   * @apiVersion 1.0.0
   * @apiName CreateEvaluation
   * @apiGroup Evaluation
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}         [id]              Evaluation's id
   * @apiParam  {String}         [status]          Evaluation's status
   * @apiParam  {String}         [firstName]       Evaluation's first name
   * @apiParam  {String}         [lastName]        Evaluation's last name
   * @apiParam  {String}         [birthplace]      Evaluation's birthplace
   * @apiParam  {Date}           [birthdate]       Evaluation's birthdate
   * @apiParam  {Boolean}        [gender]          Evaluation's gender
   * @apiParam  {String}         [religion]        Evaluation's religion
   * @apiParam  {String}         [citizenship]     Evaluation's citizenship
   * @apiParam  {String}         [address]         Evaluation's address
   * @apiParam  {String}         [phone]           Evaluation's phone
   * @apiParam  {String}         [education]       Evaluation's education
   *
   * @apiSuccess (Created 201)  {String}         id              Evaluation's id
   * @apiSuccess (Created 201)  {String}         status          Evaluation's status
   * @apiSuccess (Created 201)  {String}         firstName       Evaluation's first name
   * @apiSuccess (Created 201)  {String}         lastName        Evaluation's last name
   * @apiSuccess (Created 201)  {String}         birthplace      Evaluation's birthplace
   * @apiSuccess (Created 201)  {Date}           birthdate       Evaluation's birthdate
   * @apiSuccess (Created 201)  {Boolean}        gender          Evaluation's gender
   * @apiSuccess (Created 201)  {String}         religion        Evaluation's religion
   * @apiSuccess (Created 201)  {String}         citizenship     Evaluation's citizenship
   * @apiSuccess (Created 201)  {String}         address         Evaluation's address
   * @apiSuccess (Created 201)  {String}         phone           Evaluation's phone
   * @apiSuccess (Created 201)  {String}         education       Evaluation's education
   * @apiSuccess (Created 201)  {Date}           createdAt       Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   */
  .post(authorize(["teachers"]), validate(createEvaluation), controller.create);

router.route("/filter").get(authorize(), controller.filter);

router.route("/download").get(controller.download);

router.route("/chart-filtered").get(controller.count);

router
  .route("/:evaluationId")
  /**
   * @api {get} v1/evaluations/:id Get Evaluation
   * @apiDescription Get evaluation information
   * @apiVersion 1.0.0
   * @apiName GetEvaluation
   * @apiGroup Evaluation
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess  {String}         id              Evaluation's id
   * @apiSuccess  {String}         status          Evaluation's status
   * @apiSuccess  {String}         firstName       Evaluation's first name
   * @apiSuccess  {String}         lastName        Evaluation's last name
   * @apiSuccess  {String}         birthplace      Evaluation's birthplace
   * @apiSuccess  {Date}           birthdate       Evaluation's birthdate
   * @apiSuccess  {Boolean}        gender          Evaluation's gender
   * @apiSuccess  {String}         religion        Evaluation's religion
   * @apiSuccess  {String}         citizenship     Evaluation's citizenship
   * @apiSuccess  {String}         address         Evaluation's address
   * @apiSuccess  {String}         phone           Evaluation's phone
   * @apiSuccess  {String}         education       Evaluation's education
   * @apiSuccess  {Date}           createdAt       Timestamp
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
   * @apiError (Forbidden 403)    Forbidden   Only user with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .get(
    authorize(["teachers", "secondary_teachers", "supervisors"]),
    controller.get
  )

  /**
   * @api {patch} v1/evaluations/:id Update Evaluation
   * @apiDescription Update some fields of a evaluation document
   * @apiVersion 1.0.0
   * @apiName UpdateEvaluation
   * @apiGroup Evaluation
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}         [id]              Evaluation's id
   * @apiParam  {String}         [status]          Evaluation's status
   * @apiParam  {String}         [firstName]       Evaluation's first name
   * @apiParam  {String}         [lastName]        Evaluation's last name
   * @apiParam  {String}         [birthplace]      Evaluation's birthplace
   * @apiParam  {Date}           [birthdate]       Evaluation's birthdate
   * @apiParam  {Boolean}        [gender]          Evaluation's gender
   * @apiParam  {String}         [religion]        Evaluation's religion
   * @apiParam  {String}         [citizenship]     Evaluation's citizenship
   * @apiParam  {String}         [address]         Evaluation's address
   * @apiParam  {String}         [phone]           Evaluation's phone
   * @apiParam  {String}         [education]       Evaluation's education
   *
   * @apiSuccess  {String}         id              Evaluation's id
   * @apiSuccess  {String}         status          Evaluation's status
   * @apiSuccess  {String}         firstName       Evaluation's first name
   * @apiSuccess  {String}         lastName        Evaluation's last name
   * @apiSuccess  {String}         birthplace      Evaluation's birthplace
   * @apiSuccess  {Date}           birthdate       Evaluation's birthdate
   * @apiSuccess  {Boolean}        gender          Evaluation's gender
   * @apiSuccess  {String}         religion        Evaluation's religion
   * @apiSuccess  {String}         citizenship     Evaluation's citizenship
   * @apiSuccess  {String}         address         Evaluation's address
   * @apiSuccess  {String}         phone           Evaluation's phone
   * @apiSuccess  {String}         education       Evaluation's education
   * @apiSuccess  {Date}           createdAt       Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
   * @apiError (Forbidden 403)    Forbidden Only user with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .patch(authorize(["teachers"]), validate(updateEvaluation), controller.update)

  /**
   * @api {patch} v1/evaluations/:id Delete Evaluation
   * @apiDescription Delete a evaluation
   * @apiVersion 1.0.0
   * @apiName DeleteEvaluation
   * @apiGroup Evaluation
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated users can delete the data
   * @apiError (Forbidden 403)    Forbidden   Only user with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      User does not exist
   */
  .delete(authorize(["teachers"]), controller.remove);

module.exports = router;
