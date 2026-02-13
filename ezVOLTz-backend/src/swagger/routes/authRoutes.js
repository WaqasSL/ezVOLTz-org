//Register Route
/**
 * @openapi
 * /register:
 *   post:
 *    tags:
 *     - Auth
 *    summary: Register user
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/RegisterUser'
 *    responses:
 *     200:
 *      description: Verification email is sent. Please verify your email!
 *     401:
 *      description: Validation error will occur if response not according to the api!
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorSchema'
 */

//verify Email Route
/**
 * @openapi
 * /verify/{token}:
 *   get:
 *    tags:
 *     - Auth
 *    summary: Verify user through email
 *    parameters:
 *     - name: token
 *       in: path
 *       description: Verify email token that you got in email
 *       required: true
 *    responses:
 *     200:
 *      description: Login Successfully!
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          message:
 *           type: string
 *           default: Thanks for verifying email!
 *     401:
 *      description: Validation error will occur if response not according to the api!
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorSchema'
 */

//Resend verify Email Route
/**
 * @openapi
 * /resend-verify:
 *   post:
 *    tags:
 *     - Auth
 *    summary: Resend user verification email
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         email:
 *          type: string
 *          default: ezVOLTz@gmail.com
 *    responses:
 *     200:
 *      description: Login Successfully!
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          message:
 *           type: string
 *           default: Verification email is sent. Please verify your email!
 *     400:
 *      description: Bad Request
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorSchema'
 *     401:
 *      description: Validation error will occur if response not according to the api!
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorSchema'
 */

//Login Route
/**
 * @openapi
 * /login:
 *   post:
 *    tags:
 *     - Auth
 *    summary: Login user
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/LoginUser'
 *    responses:
 *     200:
 *      description: Login Successfully!
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/UserLoginSuccessfylly'
 *     401:
 *      description: Validation error will occur if response not according to the api!
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorSchema'
 */

//Generate New refresh Token Route
/**
 * @openapi
 * /refresh-token/{refreshToken}:
 *   get:
 *    tags:
 *     - Auth
 *    summary: Get new refresh and access token token
 *    parameters:
 *     - name: refreshToken
 *       in: path
 *       description: Verify email token that you got in email
 *       required: true
 *    responses:
 *     200:
 *      description: Login Successfully!
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          accessToken:
 *           type: string
 *           default: eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhcHAiOiJFWlZvbHR6In0.4EBUn9BSw1Q6vYTWrZlOG9w56FO7UFxVzQVEvCEq6AE4Y-OpMQBm9n1Csaxp_dznSQK5JApbDqagNPg8I3txhQ
 *          refreshToken:
 *           type: string
 *           default: eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhcHAiOiJFWlZvbHR6In0.4EBUn9BSw1Q6vYTWrZlOG9w56FO7UFxVzQVEvCEq6AE4Y-OpMQBm9n1Csaxp_dznSQK5JApbDqagNPg8I3txhQ
 *     401:
 *      description: Validation error will occur if response not according to the api!
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorSchema'
 */

//Forgot Password Route
/**
 * @openapi
 * /forgot-password:
 *   post:
 *    tags:
 *     - Auth
 *    summary: Forgot Password
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         email:
 *          type: string
 *          default: ezVOLTz@gmail.com
 *    responses:
 *     200:
 *      description: Login Successfully!
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          message:
 *           type: string
 *           default: Forgot Password Email is sent. Please verify your email!
 *     401:
 *      description: Validation error will occur if response not according to the api!
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorSchema'
 *     404:
 *      description: Email not valid or not exist
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorSchema'
 */

//Generate New refresh Token Route
/**
 * @openapi
 * /set-password/{token}:
 *   post:
 *    tags:
 *     - Auth
 *    summary: Set new password
 *    parameters:
 *     - name: token
 *       in: path
 *       description: Verify token that you got in email
 *       required: true
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         password:
 *          type: string
 *          default: ezVOLTzPassword
 *    responses:
 *     200:
 *      description: Password update successfully!
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          message:
 *           type: string
 *           default: New password is set.Please login with updated password!
 *     500:
 *      description: Serve Error
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorSchema'
 *     401:
 *      description: Validation error will occur if response not according to the api!
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorSchema'
 */
