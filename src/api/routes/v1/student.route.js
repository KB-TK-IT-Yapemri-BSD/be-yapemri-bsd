const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/student.controller');
const { authorize, ADMIN, ROLE1 } = require('../../middlewares/auth');
const {
    listStudents,
    createStudent,
    updateStudent,
} = require('../../validations/student.validation');

const router = express.Router();

/**
 * Load user when API with studentId route parameter is hit
 */
router.param('studentId', controller.load);

router
    .route('/')
    /**
     * @api {get} v1/students List Students
     * @apiDescription Get a list of students
     * @apiVersion 1.0.0
     * @apiName ListStudents
     * @apiGroup Student
     * @apiPermission teacher, admin
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiParam  {Number{1-}}     [page=1]          List page
     * @apiParam  {Number{1-100}}  [perPage=1]       Students per page
     * @apiParam  {String}         [id]              Student's id
     * @apiParam  {String}         [grade]           Student's grade
     * @apiParam  {String}         [firstName]       Student's first name
     * @apiParam  {String}         [lastName]        Student's last name
     * @apiParam  {String}         [birthplace]      Student's birthplace
     * @apiParam  {Date}           [birthdate]       Student's birthdate
     * @apiParam  {Boolean}        [gender]          Student's gender
     * @apiParam  {String}         [religion]        Student's religion
     * @apiParam  {String}         [citizenship]     Student's citizenship
     * @apiParam  {String}         [picture]         Student's picture url
     * @apiParam  {String}         [address]         Student's address
     * @apiParam  {String}         [nickname]        Student's nickname
     * @apiParam  {String}         [birthOrder]      Student's birth of order
     * @apiParam  {String}         [numOfSiblings]   Student's number of siblings
     * @apiParam  {String}         [statusInFamily]  Student's status in family
     * @apiParam  {Number}         [height]          Student's height
     * @apiParam  {String}         [bloodType]       Student's blood type
     * @apiParam  {String}         [diseaseHistory]  Student's history of disease
     * @apiParam  {String}         [distanceToHome]  Student's distance to home
     * @apiParam  {String}         [language]        Student's language
     * @apiParam  {Date}           [createdAt]       Timestamp
     *
     * @apiSuccess {Object[]} forms List of students.
     *
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
     * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
     */
    .get(authorize(ROLE1), validate(listStudents), controller.list)
    /**
     * @api {post} v1/students Create Student
     * @apiDescription Create a new student
     * @apiVersion 1.0.0
     * @apiName CreateStudent
     * @apiGroup Student
     * @apiPermission admin
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiParam  {String}         [id]              Student's id
     * @apiParam  {String}         [grade]           Student's grade
     * @apiParam  {String}         [firstName]       Student's first name
     * @apiParam  {String}         [lastName]        Student's last name
     * @apiParam  {String}         [birthplace]      Student's birthplace
     * @apiParam  {Date}           [birthdate]       Student's birthdate
     * @apiParam  {Boolean}        [gender]          Student's gender
     * @apiParam  {String}         [religion]        Student's religion
     * @apiParam  {String}         [citizenship]     Student's citizenship
     * @apiParam  {String}         [picture]         Student's picture url
     * @apiParam  {String}         [address]         Student's address
     * @apiParam  {String}         [nickname]        Student's nickname
     * @apiParam  {String}         [birthOrder]      Student's birth of order
     * @apiParam  {String}         [numOfSiblings]   Student's number of siblings
     * @apiParam  {String}         [statusInFamily]  Student's status in family
     * @apiParam  {Number}         [height]          Student's height
     * @apiParam  {String}         [bloodType]       Student's blood type
     * @apiParam  {String}         [diseaseHistory]  Student's history of disease
     * @apiParam  {String}         [distanceToHome]  Student's distance to home
     * @apiParam  {String}         [language]        Student's language
     *
     * @apiSuccess (Created 201)   {String}  id               Student's id
     * @apiSuccess (Created 201)   {String}  grade            Student's grade
     * @apiSuccess (Created 201)   {String}  firstName        Student's first name
     * @apiSuccess (Created 201)   {String}  lastName         Student's last name
     * @apiSuccess (Created 201)   {String}  birthplace       Student's birthplace
     * @apiSuccess (Created 201)   {Date}    birthdate        Student's birthdate
     * @apiSuccess (Created 201)   {Boolean} gender           Student's gender
     * @apiSuccess (Created 201)   {String}  religion         Student's religion
     * @apiSuccess (Created 201)   {String}  citizenship      Student's citizenship
     * @apiSuccess (Created 201)   {String}  picture          Student's picture url
     * @apiSuccess (Created 201)   {String}  address          Student's address
     * @apiSuccess (Created 201)   {String}  nickname         Student's nickname
     * @apiSuccess (Created 201)   {String}  birthOrder       Student's birth of order in family
     * @apiSuccess (Created 201)   {String}  numOfSiblings    Student's number of siblings
     * @apiSuccess (Created 201)   {String}  statusInFamily   Student's status in family
     * @apiSuccess (Created 201)   {Number}  height           Student's height
     * @apiSuccess (Created 201)   {String}  bloodType        Student's blood type
     * @apiSuccess (Created 201)   {String}  diseaseHistory   Student's history of disease
     * @apiSuccess (Created 201)   {String}  distanceToHome   Student's school distance to home
     * @apiSuccess (Created 201)   {String}  language         Student's language
     * @apiSuccess (Created 201)   {Date}    createdAt        Timestamp
     *
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     */
    .post(authorize(ADMIN), validate(createStudent), controller.create);

router
    .route('/:studentId')
    /**
     * @api {get} v1/students/:id Get Student
     * @apiDescription Get student information
     * @apiVersion 1.0.0
     * @apiName GetStudent
     * @apiGroup Student
     * @apiPermission teacher, admin
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiSuccess {String}  id               Student's id
     * @apiSuccess {String}  grade            Student's grade
     * @apiSuccess {String}  firstName        Student's first name
     * @apiSuccess {String}  lastName         Student's last name
     * @apiSuccess {String}  birthplace       Student's birthplace
     * @apiSuccess {Date}    birthdate        Student's birthdate
     * @apiSuccess {Boolean} gender           Student's gender
     * @apiSuccess {String}  religion         Student's religion
     * @apiSuccess {String}  citizenship      Student's citizenship
     * @apiSuccess {String}  picture          Student's picture url
     * @apiSuccess {String}  address          Student's address
     * @apiSuccess {String}  nickname         Student's nickname
     * @apiSuccess {String}  birthOrder       Student's birth of order in family
     * @apiSuccess {String}  numOfSiblings    Student's number of siblings
     * @apiSuccess {String}  statusInFamily   Student's status in family
     * @apiSuccess {Number}  height           Student's height
     * @apiSuccess {String}  bloodType        Student's blood type
     * @apiSuccess {String}  diseaseHistory   Student's history of disease
     * @apiSuccess {String}  distanceToHome   Student's school distance to home
     * @apiSuccess {String}  language         Student's language
     * @apiSuccess {Date}    createdAt        Timestamp
     *
     * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
     * @apiError (Forbidden 403)    Forbidden   Only user with same id or admins can access the data
     * @apiError (Not Found 404)    NotFound     User does not exist
     */
    .get(authorize(ROLE1), controller.get)

    /**
     * @api {patch} v1/students/:id Update Student
     * @apiDescription Update some fields of a student document
     * @apiVersion 1.0.0
     * @apiName UpdateStudent
     * @apiGroup Student
     * @apiPermission admin
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiParam  {String}         [id]              Student's id
     * @apiParam  {String}         [grade]           Student's grade
     * @apiParam  {String}         [firstName]       Student's first name
     * @apiParam  {String}         [lastName]        Student's last name
     * @apiParam  {String}         [birthplace]      Student's birthplace
     * @apiParam  {Date}           [birthdate]       Student's birthdate
     * @apiParam  {Boolean}        [gender]          Student's gender
     * @apiParam  {String}         [religion]        Student's religion
     * @apiParam  {String}         [citizenship]     Student's citizenship
     * @apiParam  {String}         [picture]         Student's picture url
     * @apiParam  {String}         [address]         Student's address
     * @apiParam  {String}         [nickname]        Student's nickname
     * @apiParam  {String}         [birthOrder]      Student's birth of order
     * @apiParam  {String}         [numOfSiblings]   Student's number of siblings
     * @apiParam  {String}         [statusInFamily]  Student's status in family
     * @apiParam  {Number}         [height]          Student's height
     * @apiParam  {String}         [bloodType]       Student's blood type
     * @apiParam  {String}         [diseaseHistory]  Student's history of disease
     * @apiParam  {String}         [distanceToHome]  Student's distance to home
     * @apiParam  {String}         [language]        Student's language
     *
     * @apiSuccess {String}  id               Student's id
     * @apiSuccess {String}  firstName        Student's first name
     * @apiSuccess {String}  lastName         Student's last name
     * @apiSuccess {String}  birthplace       Student's birthplace
     * @apiSuccess {Date}    birthdate        Student's birthdate
     * @apiSuccess {Boolean} gender           Student's gender
     * @apiSuccess {String}  religion         Student's religion
     * @apiSuccess {String}  citizenship      Student's citizenship
     * @apiSuccess {String}  picture          Student's picture url
     * @apiSuccess {String}  address          Student's address
     * @apiSuccess {String}  nickname         Student's nickname
     * @apiSuccess {String}  birthOrder       Student's birth of order in family
     * @apiSuccess {String}  numOfSiblings    Student's number of siblings
     * @apiSuccess {String}  statusInFamily   Student's status in family
     * @apiSuccess {Number}  height           Student's height
     * @apiSuccess {String}  bloodType        Student's blood type
     * @apiSuccess {String}  diseaseHistory   Student's history of disease
     * @apiSuccess {String}  distanceToHome   Student's school distance to home
     * @apiSuccess {String}  language         Student's language
     * @apiSuccess {Date}    createdAt        Timestamp
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
     * @apiError (Forbidden 403)    Forbidden Only user with same id or admins can modify the data
     * @apiError (Not Found 404)    NotFound     User does not exist
     */
    .patch(authorize(ADMIN), validate(updateStudent), controller.update)

    /**
     * @api {patch} v1/students/:id Delete Student
     * @apiDescription Delete a student
     * @apiVersion 1.0.0
     * @apiName DeleteStudent
     * @apiGroup Student
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
