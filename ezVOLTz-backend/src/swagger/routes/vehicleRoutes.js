//Vehicle Route
/**
 * @openapi
 * /vehicle:
 *   post:
 *    tags:
 *     - Vehicle
 *    summary: Add Vehicle
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
 * /vehicle/{userId}:
 *   get:
 *    tags:
 *     - Vehicle
 *    summary: Get All Vehicles By User
 *    parameters:
 *     - name: userId
 *       in: path
 *       required: true
 *       description: Please enter your user id
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
 * /vehicle/{userId}/{vehicleId}:
 *   patch:
 *    tags:
 *     - Vehicle
 *    summary: Update User Vehicle
 *    parameters:
 *     - name: userId
 *       in: path
 *       required: true
 *       description: Please enter your user id
 *     - name: vehicleId
 *       in: path
 *       required: true
 *       description: Please enter your vehicle id
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/VehicleUpdate'
 *    security:
 *     - bearerAuth: []
 *    responses:
 *     200:
 *      description: Vehicle updated successfully!
 *     401:
 *      description: Validation error will occur if response not according to the api!
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorSchema'
 *   delete:
 *    tags:
 *     - Vehicle
 *    summary: Delete User Vehicle
 *    parameters:
 *     - name: userId
 *       in: path
 *       required: true
 *       description: Please enter your user id
 *     - name: vehicleId
 *       in: path
 *       required: true
 *       description: Please enter your vehicle id
 *    security:
 *     - bearerAuth: []
 *    responses:
 *     200:
 *      description: Vehicle deleted successfully!
 *     401:
 *      description: Validation error will occur if response not according to the api!
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorSchema'
 */
