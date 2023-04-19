const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/paymentType.controller');
const { authorize, ADMIN } = require('../../middlewares/auth');
const {
    listPaymentTypes,
    createPaymentType,
} = require('../../validations/paymentType.validation');

const router = express.Router();

/**
 * Load user when API with paymentTypeId route parameter is hit
 */
router.param('paymentTypeId', controller.load);

router
    .route('/')
    /**
     * @api {get} v1/payments/types List Payment Types
     * @apiDescription Get a list of payment types
     * @apiVersion 1.0.0
     * @apiName ListPaymentTypes
     * @apiGroup PaymentType
     * @apiPermission admin
     *
     * @apiHeader {String}             Authorization    User's access token
     *
     * @apiParam  {Number{1-}}         [page=1]         List page
     * @apiParam  {Number{1-100}}      [perPage=1]      Formss per page
     * @apiParam  {String}             [id]             Payment Type's id
     * @apiParam  {String}             [type]           Payment Type's name
     *
     * @apiSuccess {Object[]} forms List of payment types.
     *
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
     * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
     */
    .get(authorize(ADMIN), validate(listPaymentTypes), controller.list)
    /**
     * @api {post} v1/payments/types Create Payment Type
     * @apiDescription Create a new payment type
     * @apiVersion 1.0.0
     * @apiName CreatePaymentType
     * @apiGroup PaymentType
     * @apiPermission admin
     *
     * @apiHeader {String}             Authorization   User's access token
     *
     * @apiParam  {String}             [type]           Payment's type
     *
     * @apiSuccess (Created 201) {String}  id               Payment Type's id
     * @apiSuccess (Created 201) {String}  type             Payment Type's name
     * @apiSuccess (Created 201) {Date}    createdAt        Timestamp
     *
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     */
    .post(authorize(ADMIN), validate(createPaymentType), controller.create);

router
    .route('/:paymentTypeId')
    /**
     * @api {get} v1/payments/types/:id Get Payment Type
     * @apiDescription Get payment type information
     * @apiVersion 1.0.0
     * @apiName GetPaymentType
     * @apiGroup Payment Type
     * @apiPermission admin
     *
     * @apiHeader {String}   Authorization   User's access token
     *
     * @apiSuccess {String}  id             Payment Type's id
     * @apiSuccess {String}  type           Payment Type's name
     * @apiSuccess {Date}    createdAt      Timestamp
     *
     * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
     * @apiError (Forbidden 403)    Forbidden   Only user with same id or admins can access the data
     * @apiError (Not Found 404)    NotFound     User does not exist
     */
    .get(authorize(ADMIN), controller.get)

    /**
     * @api {patch} v1/payments/types/:id Delete Payment Type
     * @apiDescription Delete a payment type
     * @apiVersion 1.0.0
     * @apiName DeletePaymentType
     * @apiGroup PaymentType
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
