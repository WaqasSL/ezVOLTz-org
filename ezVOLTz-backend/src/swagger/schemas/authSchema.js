//Register Schema
/**
 * @openapi
 * components:
 *  schemas:
 *   RegisterUser:
 *    type: object
 *    required:
 *     - name
 *     - email
 *     - password
 *     - country
 *     - city
 *     - registerMethod
 *     - platform
 *    properties:
 *     name:
 *      type: string
 *      default: ezVOLTz
 *     email:
 *      type: string
 *      default: ezVOLTz@gmail.com
 *     password:
 *      type: string
 *      default: ezVOLTz123
 *     registerMethod:
 *      type: string
 *      default: google | facebook | email
 *     platform:
 *      type: string
 *      default: web | android | ios
 *     country:
 *      type: string
 *      default: USA
 *     state:
 *      type: string
 *      default: California
 *     city:
 *      type: string
 *      default: San Jose
 *     zipCode:
 *      type: string
 *      default: 94088
 *   LoginUser:
 *    type: object
 *    required:
 *     - email
 *     - password
 *     - registerMethod
 *    properties:
 *     email:
 *      type: string
 *      default: ezVOLTz@gmail.com
 *     password:
 *      type: string
 *      default: ezVOLTz123
 *     registerMethod:
 *      type: string
 *      default: google | facebook | email
 *   UserLoginSuccessfylly:
 *    type: object
 *    properties:
 *     user:
 *      type: object
 *      properties:
 *       id:
 *        type: string
 *        default: 1
 *       name:
 *        type: string
 *        default: ezVOLTz
 *       profileImage:
 *        type: string
 *        default: https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/640px-User_icon_2.svg.png
 *       email:
 *        type: string
 *        default: ezVOLTz@gmail.com
 *       password:
 *        type: string
 *        default: ezVOLTzHasingPassword
 *       registerMethod:
 *        type: string
 *        default: google | facebook | email
 *       platform:
 *        type: string
 *        default: web | android | ios
 *       country:
 *        type: string
 *        default: USA
 *       state:
 *        type: string
 *        default: California
 *       city:
 *        type: string
 *        default: San Jose
 *       zipCode:
 *        type: string
 *        default: 94088
 *       isActive:
 *        type: boolean
 *        default: true
 *       createdAt:
 *        type: string
 *        default: 2023-01-04T09:32:00.000Z
 *       updatedAt:
 *        type: string
 *        default: 2023-01-04T09:32:00.000Z
 *     accessToken:
 *      type: string
 *      default: eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhcHAiOiJFWlZvbHR6In0.4EBUn9BSw1Q6vYTWrZlOG9w56FO7UFxVzQVEvCEq6AE4Y-OpMQBm9n1Csaxp_dznSQK5JApbDqagNPg8I3txhQ
 *     refreshToken:
 *      type: string
 *      default: eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhcHAiOiJFWlZvbHR6In0.4EBUn9BSw1Q6vYTWrZlOG9w56FO7UFxVzQVEvCEq6AE4Y-OpMQBm9n1Csaxp_dznSQK5JApbDqagNPg8I3txhQ
 *   UserProfile:
 *    type: object
 *    properties:
 *     user:
 *      type: object
 *      properties:
 *       id:
 *        type: string
 *        default: 1
 *       name:
 *        type: string
 *        default: ezVOLTz
 *       profileImage:
 *        type: string
 *        default: https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/640px-User_icon_2.svg.png
 *       email:
 *        type: string
 *        default: ezVOLTz@gmail.com
 *       password:
 *        type: string
 *        default: ezVOLTzHasingPassword
 *       registerMethod:
 *        type: string
 *        default: google | facebook | email
 *       platform:
 *        type: string
 *        default: web | android | ios
 *       country:
 *        type: string
 *        default: USA
 *       state:
 *        type: string
 *        default: California
 *       city:
 *        type: string
 *        default: San Jose
 *       zipCode:
 *        type: string
 *        default: 94088
 *       isActive:
 *        type: boolean
 *        default: true
 *       createdAt:
 *        type: string
 *        default: 2023-01-04T09:32:00.000Z
 *       updatedAt:
 *        type: string
 *        default: 2023-01-04T09:32:00.000Z
 *   UpdateUser:
 *    required:
 *    type: object
 *    properties:
 *     name:
 *      type: string
 *      default: Name
 *     country:
 *      type: string
 *      default: USA
 *     state:
 *      type: string
 *      default: California
 *     city:
 *      type: string
 *      default: San Jose
 *     zipCode:
 *      type: string
 *      default: 94088
 */

//Error Schema
/**
 * @openapi
 * components:
 *  schemas:
 *   ErrorSchema:
 *    type: object
 *    properties:
 *     error:
 *      type: string
 *      default: Error Message
 */

//Authen Schema
/**
 * @openapi
 * components:
 *  securitySchemes:
 *   bearerAuth:
 *    type: http
 *    scheme: bearer
 *    bearerFormat: JWT
 */
