const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/registration.controller');
const { authorize, ROLE1 } = require('../../middlewares/auth');
const {
    listForms,
    createForm,
} = require('../../validations/registration.validation');

const router = express.Router();

/**
 * Load user when API with formId route parameter is hit
 */
router.param('formId', controller.load);

router
    .route('/')
    /**
     * @api {get} v1/forms List Forms
     * @apiDescription Get a list of forms
     * @apiVersion 1.0.0
     * @apiName ListForms
     * @apiGroup Registration
     * @apiPermission teacher, admin
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiParam  {Number{1-}}         [page=1]         List page
     * @apiParam  {Number{1-100}}      [perPage=1]      Forms per page
     * @apiParam  {String}             [id]             Form's id
     * @apiParam  {String}             [name]           Name for registration
     * @apiParam  {String}             [email]          Email for registration
     * @apiParam  {String}             [phone]          Phone for registration
     * @apiParam  {String}             [address]        Address for Registration
     * @apiParam  {Number}             [numChildrens]   Number of childrens for registration
     * @apiParam  {String}             [ageChildrens]   Children's age for registration
     * @apiParam  {String}             [grade]          Preffered grade
     * @apiParam  {String}             [reason]         Reason for registration
     *
     * @apiSuccess {Object[]} forms List of forms.
     *
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
     * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
     */
    .get(authorize(ROLE1), validate(listForms), controller.list)
    /**
     * @api {post} v1/forms Create Form
     * @apiDescription Create a new form
     * @apiVersion 1.0.0
     * @apiName CreateForm
     * @apiGroup Registration
     * @apiPermission none
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiParam  {String}             [name]           Name for registration
     * @apiParam  {String}             [email]          Email for registration
     * @apiParam  {String}             [phone]          Phone for registration
     * @apiParam  {String}             [address]        Address for Registration
     * @apiParam  {Number}             [numChildrens]   Number of childrens for registration
     * @apiParam  {String}             [ageChildrens]   Children's age for registration
     * @apiParam  {String}             [grade]          Preffered grade
     * @apiParam  {String}             [reason]         Reason for registration
     *
     * @apiSuccess (Created 201) {String}  id               Form's id
     * @apiSuccess (Created 201) {String}  name             Form's name
     * @apiSuccess (Created 201) {String}  email            Form's email
     * @apiSuccess (Created 201) {String}  phone            Form's phone
     * @apiSuccess (Created 201) {String}  address          Form's address
     * @apiSuccess (Created 201) {String}  numChildrens     Form's number of childrens
     * @apiSuccess (Created 201) {String}  ageChildrens     Form's age of childrens
     * @apiSuccess (Created 201) {String}  grade            Form's preferred grade
     * @apiSuccess (Created 201) {Date}    createdAt        Timestamp
     *
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     */
    .post(validate(createForm), controller.create);

router
    .route('/download')
    .get(controller.download);

router
    .route('/:formId')
    /**
     * @api {get} v1/forms/:id Get Form
     * @apiDescription Get form information
     * @apiVersion 1.0.0
     * @apiName GetForm
     * @apiGroup Registration
     * @apiPermission teacher, admin
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiSuccess {String}  id               Form's id
     * @apiSuccess {String}  name             Form's name
     * @apiSuccess {String}  email            Form's email
     * @apiSuccess {String}  phone            Form's phone
     * @apiSuccess {String}  address          Form's address
     * @apiSuccess {String}  numChildrens     Form's number of childrens
     * @apiSuccess {String}  ageChildrens     Form's age of childrens
     * @apiSuccess {String}  grade            Form's preferred grade
     * @apiSuccess {Date}    createdAt        Timestamp
     *
     * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
     * @apiError (Forbidden 403)    Forbidden   Only user with same id or admins can access the data
     * @apiError (Not Found 404)    NotFound     User does not exist
     */
    .get(authorize(ROLE1), controller.get)

    /**
     * @api {patch} v1/forms/:id Delete Form
     * @apiDescription Delete a form
     * @apiVersion 1.0.0
     * @apiName DeleteForm
     * @apiGroup Registration
     * @apiPermission teacher, admin
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiSuccess (No Content 204)  Successfully deleted
     *
     * @apiError (Unauthorized 401) Unauthorized  Only authenticated users can delete the data
     * @apiError (Forbidden 403)    Forbidden   Only user with same id or admins can delete the data
     * @apiError (Not Found 404)    NotFound      User does not exist
     */
    .delete(authorize(ROLE1), controller.remove);

module.exports = router;
