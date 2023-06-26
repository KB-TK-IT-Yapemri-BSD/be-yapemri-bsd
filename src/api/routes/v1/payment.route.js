const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/payment.controller');
const { authorize, ADMIN, ROLE1 } = require('../../middlewares/auth');
const {
    listPayments,
    createPayment,
} = require('../../validations/payment.validation');

const router = express.Router();

/**
 * Load user when API with paymentId route parameter is hit
 */
router.param('paymentId', controller.load);

router
    .route('/')
    /**
     * @api {get} v1/payments List Payments
     * @apiDescription Get a list of payments
     * @apiVersion 1.0.0
     * @apiName ListPayments
     * @apiGroup Payment
     * @apiPermission teachers, admin
     *
     * @apiHeader {String}              Authorization   User's access token
     *
     * @apiParam  {Number{1-}}         [page=1]         List page
     * @apiParam  {Number{1-100}}      [perPage=1]      Payments per page
     * @apiParam  {String}             [id]             Payment's id
     * @apiParam  {String}             [user_id]        Payment's user based on id
     * @apiParam  {String}             [type_id]        Payment's type based on id
     * @apiParam  {Date}               [deadline]       Payment's deadline
     * @apiParam  {Number}             [amount]         Payment's amount
     * @apiParam  {String}             [status]         Payment's status
     * @apiParam  {String}             [receipt]        Payment's receipt
     * @apiParam  {String}             [isOverdue]      Payment's overdue status
     *
     * @apiSuccess {Object[]} forms List of payments.
     *
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
     * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
     */
    .get(authorize(ROLE1), validate(listPayments), controller.list)
    /**
     * @api {post} v1/payments Create Payment
     * @apiDescription Create a new payment
     * @apiVersion 1.0.0
     * @apiName CreatePayment
     * @apiGroup Payment
     * @apiPermission admin
     *
     * @apiHeader {String}             Authorization   User's access token
     *
     * @apiParam  {String}             [user_id]           Payment's user based on id
     * @apiParam  {Date}               [type_id]           Payment's type based on id
     * @apiParam  {Number}             [deadline]          Payment's deadline
     * @apiParam  {Number}             [amount]            Payment's amount
     *
     * @apiSuccess (Created 201) {String}  id               Payment's id
     * @apiSuccess (Created 201) {String}  type             Payment's type
     * @apiSuccess (Created 201) {Date}    deadline         Payment's deadline
     * @apiSuccess (Created 201) {Number}  amount           Payment's amount
     * @apiSuccess (Created 201) {Date}    createdAt        Timestamp
     *
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     */
    .post(authorize(ADMIN), validate(createPayment), controller.create);

router
    .route('/filter')
    .get(authorize(), controller.filter);

router
    .route('/download')
    .get(controller.download);

router
    .route('/:paymentId')
    /**
     * @api {get} v1/payments/:id Get Payment
     * @apiDescription Get payment information
     * @apiVersion 1.0.0
     * @apiName GetPayment
     * @apiGroup Payment
     * @apiPermission teachers, admin
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiSuccess {String}  id         Payment's id
     * @apiSuccess {String}  user_id    Payment's user based on id
     * @apiSuccess {String}  type_id    Payment's type based on id
     * @apiSuccess {Date}    deadline   Payment's deadline
     * @apiSuccess {Number}  amount     Payment's amount
     * @apiSuccess {String}  status     Payment's status
     * @apiSuccess {String}  receipt    Payment's receipt
     * @apiSuccess {String}  isOverdue  Payment's overdue status
     * @apiSuccess {Date}    createdAt  Timestamp
     *
     * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
     * @apiError (Forbidden 403)    Forbidden   Only user with same id or admins can access the data
     * @apiError (Not Found 404)    NotFound     User does not exist
     */
    .get(authorize(ROLE1), controller.get)
    /**
       * @api {patch} v1/payments/:id Update Payment
       * @apiDescription Update some fields of a payment document
       * @apiVersion 1.0.0
       * @apiName UpdatePayment
       * @apiGroup Payment
       * @apiPermission admin
       *
       * @apiHeader {String} Authorization   User's access token
       *
       * @apiParam  {String}             [user_id]           Payment's user based on id
       * @apiParam  {Date}               [type_id]           Payment's type based on id
       * @apiParam  {Number}             [deadline]          Payment's deadline
       * @apiParam  {Number}             [amount]            Payment's amount
       * @apiParam  {String}             [status]            Payment's status
       * @apiParam  {String}             [receipt]           Payment's receipt
       * @apiParam  {String}             [isOverdue]         Payment's overdue status
       *
       * @apiSuccess {String}  id         Payment's id
       * @apiSuccess {String}  user_id    Payment's user based on id
       * @apiSuccess {String}  type_id    Payment's type based on id
       * @apiSuccess {Date}    deadline   Payment's deadline
       * @apiSuccess {Number}  amount     Payment's amount
       * @apiSuccess {String}  status     Payment's status
       * @apiSuccess {String}  receipt    Payment's receipt
       * @apiSuccess {String}  isOverdue  Payment's overdue status
       * @apiSuccess {Date}    createdAt  Timestamp
       *
       * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
       * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
       * @apiError (Forbidden 403)    Forbidden Only user with same id or admins can modify the data
       * @apiError (Not Found 404)    NotFound     User does not exist
       */
    .patch(authorize(), controller.update)
    /**
     * @api {patch} v1/payments/:id Delete Payment
     * @apiDescription Delete a payment
     * @apiVersion 1.0.0
     * @apiName DeletePayment
     * @apiGroup Payment
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
    .delete(authorize(ADMIN), controller.remove);

module.exports = router;
