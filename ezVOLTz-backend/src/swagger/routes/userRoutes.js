//Register Route
/**
 * @openapi
 * /user/profile:
 *   get:
 *    tags:
 *     - User
 *    summary: Get User Own Profile
 *    security:
 *     - bearerAuth: []
 *    responses:
 *     200:
 *      description: You will get your own profile!
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/UserProfile'
 *     401:
 *      description: Validation error will occur if response not according to the api!
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorSchema'
 * /user/profile/{userId}:
 *   patch:
 *    tags:
 *     - User
 *    summary: Update User Profile
 *    parameters:
 *     - name: userId
 *       in: path
 *       required: true
 *       description: Please enter your user id
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/UpdateUser'
 *       required: true
 *    security:
 *     - bearerAuth: []
 *    responses:
 *     200:
 *      description: Profile updated successfully!
 *     401:
 *      description: Validation error will occur if response not according to the api!
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorSchema'
 * /user/profile-password/{userId}:
 *   patch:
 *    tags:
 *     - User
 *    summary: Update User Password
 *    parameters:
 *     - name: userId
 *       in: path
 *       required: true
 *       description: Please enter your user id
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        properties:
 *          password:
 *           type: string
 *           default: ezVOLTz123
 *       required: true
 *    security:
 *     - bearerAuth: []
 *    responses:
 *     200:
 *      description: Password updated successfully!
 *     401:
 *      description: Validation error will occur if response not according to the api!
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorSchema'
 * /user/profile-image/{userId}:
 *   post:
 *    tags:
 *     - User
 *    summary: Update User Profile Image
 *    parameters:
 *     - name: userId
 *       in: path
 *       required: true
 *       description: Please your user id
 *    requestBody:
 *     required: true
 *     content:
 *      multipart/form-data:
 *       schema:
 *        type: object
 *        properties:
 *          image:
 *           type: string
 *           format: binary
 *       required: true
 *    security:
 *     - bearerAuth: []
 *    responses:
 *     200:
 *      description: Profile updated successfully!
 *     401:
 *      description: Validation error will occur if response not according to the api!
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorSchema'
 */
