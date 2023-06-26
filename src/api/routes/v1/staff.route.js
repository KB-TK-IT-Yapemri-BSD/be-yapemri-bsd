const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/staff.controller');
const { authorize, ADMIN } = require('../../middlewares/auth');
const {
    listStaffs,
    createStaff,
    updateStaff,
} = require('../../validations/staff.validation');

const router = express.Router();

/**
 * Load user when API with staffId route parameter is hit
 */
router.param('staffId', controller.load);

router
    .route('/')
    /**
     * @api {get} v1/staffs List Staffs
     * @apiDescription Get a list of staffs
     * @apiVersion 1.0.0
     * @apiName ListStaffs
     * @apiGroup Staff
     * @apiPermission admin
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiParam  {Number{1-}}     [page=1]          List page
     * @apiParam  {Number{1-100}}  [perPage=1]       Staffs per page
     * @apiParam  {String}         [id]              Staff's id
     * @apiParam  {String}         [status]          Staff's status
     * @apiParam  {String}         [firstName]       Staff's first name
     * @apiParam  {String}         [lastName]        Staff's last name
     * @apiParam  {String}         [birthplace]      Staff's birthplace
     * @apiParam  {Date}           [birthdate]       Staff's birthdate
     * @apiParam  {Boolean}        [gender]          Staff's gender
     * @apiParam  {String}         [religion]        Staff's religion
     * @apiParam  {String}         [citizenship]     Staff's citizenship
     * @apiParam  {String}         [address]         Staff's address
     * @apiParam  {String}         [phone]           Staff's phone
     * @apiParam  {String}         [education]       Staff's education
     *
     * @apiSuccess {Object[]} forms List of staffs.
     *
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
     * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
     */
    .get(authorize(ADMIN), validate(listStaffs), controller.list)
    /**
     * @api {post} v1/staffs Create Staff
     * @apiDescription Create a new staff
     * @apiVersion 1.0.0
     * @apiName CreateStaff
     * @apiGroup Staff
     * @apiPermission admin
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiParam  {String}         [id]              Staff's id
     * @apiParam  {String}         [status]          Staff's status
     * @apiParam  {String}         [firstName]       Staff's first name
     * @apiParam  {String}         [lastName]        Staff's last name
     * @apiParam  {String}         [birthplace]      Staff's birthplace
     * @apiParam  {Date}           [birthdate]       Staff's birthdate
     * @apiParam  {Boolean}        [gender]          Staff's gender
     * @apiParam  {String}         [religion]        Staff's religion
     * @apiParam  {String}         [citizenship]     Staff's citizenship
     * @apiParam  {String}         [address]         Staff's address
     * @apiParam  {String}         [phone]           Staff's phone
     * @apiParam  {String}         [education]       Staff's education
     *
     * @apiSuccess (Created 201)  {String}         id              Staff's id
     * @apiSuccess (Created 201)  {String}         status          Staff's status
     * @apiSuccess (Created 201)  {String}         firstName       Staff's first name
     * @apiSuccess (Created 201)  {String}         lastName        Staff's last name
     * @apiSuccess (Created 201)  {String}         birthplace      Staff's birthplace
     * @apiSuccess (Created 201)  {Date}           birthdate       Staff's birthdate
     * @apiSuccess (Created 201)  {Boolean}        gender          Staff's gender
     * @apiSuccess (Created 201)  {String}         religion        Staff's religion
     * @apiSuccess (Created 201)  {String}         citizenship     Staff's citizenship
     * @apiSuccess (Created 201)  {String}         address         Staff's address
     * @apiSuccess (Created 201)  {String}         phone           Staff's phone
     * @apiSuccess (Created 201)  {String}         education       Staff's education
     * @apiSuccess (Created 201)  {Date}           createdAt       Timestamp
     *
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     */
    .post(authorize(ADMIN), validate(createStaff), controller.create);

router
    .route('/download')
    .get(controller.download);

router
    .route('/:staffId')
    /**
     * @api {get} v1/staffs/:id Get Staff
     * @apiDescription Get staff information
     * @apiVersion 1.0.0
     * @apiName GetStaff
     * @apiGroup Staff
     * @apiPermission admin
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiSuccess  {String}         id              Staff's id
     * @apiSuccess  {String}         status          Staff's status
     * @apiSuccess  {String}         firstName       Staff's first name
     * @apiSuccess  {String}         lastName        Staff's last name
     * @apiSuccess  {String}         birthplace      Staff's birthplace
     * @apiSuccess  {Date}           birthdate       Staff's birthdate
     * @apiSuccess  {Boolean}        gender          Staff's gender
     * @apiSuccess  {String}         religion        Staff's religion
     * @apiSuccess  {String}         citizenship     Staff's citizenship
     * @apiSuccess  {String}         address         Staff's address
     * @apiSuccess  {String}         phone           Staff's phone
     * @apiSuccess  {String}         education       Staff's education
     * @apiSuccess  {Date}           createdAt       Timestamp
     *
     * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
     * @apiError (Forbidden 403)    Forbidden   Only user with same id or admins can access the data
     * @apiError (Not Found 404)    NotFound     User does not exist
     */
    .get(authorize(), controller.get)

    /**
     * @api {patch} v1/staffs/:id Update Staff
     * @apiDescription Update some fields of a staff document
     * @apiVersion 1.0.0
     * @apiName UpdateStaff
     * @apiGroup Staff
     * @apiPermission admin
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiParam  {String}         [id]              Staff's id
     * @apiParam  {String}         [status]          Staff's status
     * @apiParam  {String}         [firstName]       Staff's first name
     * @apiParam  {String}         [lastName]        Staff's last name
     * @apiParam  {String}         [birthplace]      Staff's birthplace
     * @apiParam  {Date}           [birthdate]       Staff's birthdate
     * @apiParam  {Boolean}        [gender]          Staff's gender
     * @apiParam  {String}         [religion]        Staff's religion
     * @apiParam  {String}         [citizenship]     Staff's citizenship
     * @apiParam  {String}         [address]         Staff's address
     * @apiParam  {String}         [phone]           Staff's phone
     * @apiParam  {String}         [education]       Staff's education
     *
     * @apiSuccess  {String}         id              Staff's id
     * @apiSuccess  {String}         status          Staff's status
     * @apiSuccess  {String}         firstName       Staff's first name
     * @apiSuccess  {String}         lastName        Staff's last name
     * @apiSuccess  {String}         birthplace      Staff's birthplace
     * @apiSuccess  {Date}           birthdate       Staff's birthdate
     * @apiSuccess  {Boolean}        gender          Staff's gender
     * @apiSuccess  {String}         religion        Staff's religion
     * @apiSuccess  {String}         citizenship     Staff's citizenship
     * @apiSuccess  {String}         address         Staff's address
     * @apiSuccess  {String}         phone           Staff's phone
     * @apiSuccess  {String}         education       Staff's education
     * @apiSuccess  {Date}           createdAt       Timestamp
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
     * @apiError (Forbidden 403)    Forbidden Only user with same id or admins can modify the data
     * @apiError (Not Found 404)    NotFound     User does not exist
     */
    .patch(authorize(ADMIN), validate(updateStaff), controller.update)

    /**
     * @api {patch} v1/staffs/:id Delete Staff
     * @apiDescription Delete a staff
     * @apiVersion 1.0.0
     * @apiName DeleteStaff
     * @apiGroup Staff
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
