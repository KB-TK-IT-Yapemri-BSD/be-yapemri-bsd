const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/parent.controller');
const { authorize, ADMIN, ROLE1 } = require('../../middlewares/auth');
const {
    listParents,
    createParent,
    updateParent,
} = require('../../validations/parent.validation');

const router = express.Router();

/**
 * Load user when API with parentId route parameter is hit
 */
router.param('parentId', controller.load);

router
    .route('/')
    /**
     * @api {get} v1/parents List Parents
     * @apiDescription Get a list of parents
     * @apiVersion 1.0.0
     * @apiName ListParents
     * @apiGroup Parent
     * @apiPermission teacher, admin
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiParam  {Number{1-}}     [page=1]          List page
     * @apiParam  {Number{1-100}}  [perPage=1]       Parents per page
     * @apiParam  {String}         [id]              Parent's id
     * @apiParam  {String}         [status]          Parent's status
     * @apiParam  {String}         [firstName]       Parent's first name
     * @apiParam  {String}         [lastName]        Parent's last name
     * @apiParam  {String}         [birthplace]      Parent's birthplace
     * @apiParam  {Date}           [birthdate]       Parent's birthdate
     * @apiParam  {Boolean}        [gender]          Parent's gender
     * @apiParam  {String}         [religion]        Parent's religion
     * @apiParam  {String}         [citizenship]     Parent's citizenship
     * @apiParam  {String}         [address]         Parent's address
     * @apiParam  {String}         [phone]           Parent's phone
     * @apiParam  {String}         [occupation]      Parent's occupation
     * @apiParam  {String}         [education]       Parent's education
     *
     * @apiSuccess {Object[]} forms List of parents.
     *
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
     * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
     */
    .get(authorize(ROLE1), validate(listParents), controller.list)
    /**
     * @api {post} v1/parents Create Parent
     * @apiDescription Create a new parent
     * @apiVersion 1.0.0
     * @apiName CreateParent
     * @apiGroup Parent
     * @apiPermission admin
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiParam  {Number{1-}}     [page=1]          List page
     * @apiParam  {Number{1-100}}  [perPage=1]       Parents per page
     * @apiParam  {String}         [id]              Parent's id
     * @apiParam  {String}         [status]          Parent's status
     * @apiParam  {String}         [firstName]       Parent's first name
     * @apiParam  {String}         [lastName]        Parent's last name
     * @apiParam  {String}         [birthplace]      Parent's birthplace
     * @apiParam  {Date}           [birthdate]       Parent's birthdate
     * @apiParam  {Boolean}        [gender]          Parent's gender
     * @apiParam  {String}         [religion]        Parent's religion
     * @apiParam  {String}         [citizenship]     Parent's citizenship
     * @apiParam  {String}         [address]         Parent's address
     * @apiParam  {String}         [phone]           Parent's phone
     * @apiParam  {String}         [occupation]      Parent's occupation
     * @apiParam  {String}         [education]       Parent's education
     *
     * @apiSuccess (Created 201)  {String}     id              Parent's id
     * @apiSuccess (Created 201)  {String}     status          Parent's status
     * @apiSuccess (Created 201)  {String}     firstName       Parent's first name
     * @apiSuccess (Created 201)  {String}     lastName        Parent's last name
     * @apiSuccess (Created 201)  {String}     birthplace      Parent's birthplace
     * @apiSuccess (Created 201)  {Date}       birthdate       Parent's birthdate
     * @apiSuccess (Created 201)  {Boolean}    gender          Parent's gender
     * @apiSuccess (Created 201)  {String}     religion        Parent's religion
     * @apiSuccess (Created 201)  {String}     citizenship     Parent's citizenship
     * @apiSuccess (Created 201)  {String}     address         Parent's address
     * @apiSuccess (Created 201)  {String}     phone           Parent's phone
     * @apiSuccess (Created 201)  {String}     occupation      Parent's occupation
     * @apiSuccess (Created 201)  {String}     education       Parent's education
     * @apiSuccess (Created 201)  {Date}       createdAt       Timestamp
     *
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     */
    .post(authorize(ADMIN), validate(createParent), controller.create);

router
    .route('/fathers')
    .get(authorize(ROLE1), validate(listParents), controller.listFathers);

router
    .route('/mothers')
    .get(authorize(ROLE1), validate(listParents), controller.listMothers);

router
    .route('/download')
    .get(controller.download);

router
    .route('/chart-filtered')
    .get(controller.count);

router
    .route('/:parentId')
    /**
     * @api {get} v1/parents/:id Get Parent
     * @apiDescription Get parent information
     * @apiVersion 1.0.0
     * @apiName GetParent
     * @apiGroup Parent
     * @apiPermission teacher, admin
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiSuccess (Created 201)  {String}     id              Parent's id
     * @apiSuccess (Created 201)  {String}     status          Parent's status
     * @apiSuccess (Created 201)  {String}     firstName       Parent's first name
     * @apiSuccess (Created 201)  {String}     lastName        Parent's last name
     * @apiSuccess (Created 201)  {String}     birthplace      Parent's birthplace
     * @apiSuccess (Created 201)  {Date}       birthdate       Parent's birthdate
     * @apiSuccess (Created 201)  {Boolean}    gender          Parent's gender
     * @apiSuccess (Created 201)  {String}     religion        Parent's religion
     * @apiSuccess (Created 201)  {String}     citizenship     Parent's citizenship
     * @apiSuccess (Created 201)  {String}     address         Parent's address
     * @apiSuccess (Created 201)  {String}     phone           Parent's phone
     * @apiSuccess (Created 201)  {String}     occupation      Parent's occupation
     * @apiSuccess (Created 201)  {String}     education       Parent's education
     * @apiSuccess (Created 201)  {Date}       createdAt       Timestamp
     *
     * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
     * @apiError (Forbidden 403)    Forbidden   Only user with same id or admins can access the data
     * @apiError (Not Found 404)    NotFound     User does not exist
     */
    .get(authorize(ROLE1), controller.get)

    /**
     * @api {patch} v1/parents/:id Update Parent
     * @apiDescription Update some fields of a parent document
     * @apiVersion 1.0.0
     * @apiName UpdateParent
     * @apiGroup Parent
     * @apiPermission admin
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiParam  {Number{1-}}     [page=1]          List page
     * @apiParam  {Number{1-100}}  [perPage=1]       Parents per page
     * @apiParam  {String}         [id]              Parent's id
     * @apiParam  {String}         [status]          Parent's status
     * @apiParam  {String}         [firstName]       Parent's first name
     * @apiParam  {String}         [lastName]        Parent's last name
     * @apiParam  {String}         [birthplace]      Parent's birthplace
     * @apiParam  {Date}           [birthdate]       Parent's birthdate
     * @apiParam  {Boolean}        [gender]          Parent's gender
     * @apiParam  {String}         [religion]        Parent's religion
     * @apiParam  {String}         [citizenship]     Parent's citizenship
     * @apiParam  {String}         [address]         Parent's address
     * @apiParam  {String}         [phone]           Parent's phone
     * @apiParam  {String}         [occupation]      Parent's occupation
     * @apiParam  {String}         [education]       Parent's education
     *
     * @apiSuccess  {String}     id              Parent's id
     * @apiSuccess  {String}     status          Parent's status
     * @apiSuccess  {String}     firstName       Parent's first name
     * @apiSuccess  {String}     lastName        Parent's last name
     * @apiSuccess  {String}     birthplace      Parent's birthplace
     * @apiSuccess  {Date}       birthdate       Parent's birthdate
     * @apiSuccess  {Boolean}    gender          Parent's gender
     * @apiSuccess  {String}     religion        Parent's religion
     * @apiSuccess  {String}     citizenship     Parent's citizenship
     * @apiSuccess  {String}     address         Parent's address
     * @apiSuccess  {String}     phone           Parent's phone
     * @apiSuccess  {String}     occupation      Parent's occupation
     * @apiSuccess  {String}     education       Parent's education
     * @apiSuccess  {Date}       createdAt       Timestamp
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
     * @apiError (Forbidden 403)    Forbidden Only user with same id or admins can modify
     * @apiError (Not Found 404)    NotFound     User does not exist
     */
    .patch(authorize(ADMIN), validate(updateParent), controller.update)

    /**
     * @api {patch} v1/parents/:id Delete PArent
     * @apiDescription Delete a parent
     * @apiVersion 1.0.0
     * @apiName DeleteParent
     * @apiGroup Parent
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
