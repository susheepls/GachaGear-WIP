# auth-testing

# Dependencies
-cors
-dotenv
-express
-@prisma.client
-jsonwebtoken

## Dev-Dependencies
-typescript
-ts-node

## --save-dev 
- @types/express
- @types/node
- @types/cors
- @types/bcrypt
- @types/jsonwebtoken
- prisma

## messages sent
- 200 Account creation: Success!
- 200 password changed success
- 200 login success
- 200 user inventory found
- 400 Invalid password. Must be at least 8 characters.
- 400 account not found
- 401 invalid credentials
- 403 user not authenticated
- 403 login again
- 500 Internal Server Error

# Steps I followed
1. npm-init;
2. install dependencies with npm install ___;
3. create a /src folder with a server.ts;
4. add tsc script and then run 'npm run tsc -- --init'
5. comment in line 30: module resolutions
6. set up some app.use in server; app.use(express.json()); app.use(cors());
7. set up routes.ts file importing Router from express
8. install prisma and run 'npx prisma' 'npx prisma init' which creates a new directory called prisma that has schema.prisma
9. setup db 'npx prisma migrate dev --name initial_migration'; install prisma client package and use 'npx prisma generate'
10. set up inital model of prisma with a simple Accounts in schema.prisma
11. Then make a model file, and import PrismaClient and const variable = new PrismaClient() to start querying the schema db;
12. const accountModel object and add methods that query. Export the model.
13. add a controller for the model and import {Request, Response} from express and import the accountModel.
14. const accountController object and add methods that use methods from the model but give a status response and such.
15. in routes file import { Router } from express and set up variable = Router();
16. import controllers and then set up routes: variable.get('/endpoint', controllermethod);
17. export router and import router in server.ts. app.use(router);
18. Create more routes for getting account by id and username
19. create global middleware for error handling in server.ts
20. add more fields into the schema and then run 'npx prisma migrate dev --name asdfasdf'
21. after editing schema, have to run 'npx prisma generate' again , but must close server first
22. edit post request to utilize type safety. just send the data as object itself;
23. learned new RESTful practices for api so made changes accordingly in changeAccountPassword Controller
24. install bcrypt for password hashing; import it into account controller
25. set up a salt for the post request and make varialbe that takes the password and then the salt
26. change model of the account model for the controller changes
27. learn how to set type to req.body using Request<{}, {}, TYPE>
28. make account model for userlogin that fetches the user based on username
29. set up controller for user login -> res.status401 = unauthorized -> using invalid credentials to prevent user/password mismatch
30. add package jsonwebtoken
31. import jwt from jsonwebtoken in account controller.
32. create env varaibles named ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET.
33. to create secret key, open node in another terminal and use 'require('crypto').randomBytes(64).toString('hex')'
34. copy and pasted that into envs; import dotenv and dotenv.config() in server.ts
35. create token whenever user logs in; refactored bit of login code. if bcrypt.compare is falsy, immediately return 401
36. const user object that is username and id key; this is the JWT payload
37. const accesstoken using jwt.sign. takes in user, the secret key in env, an object that has expiresIn and algorithm keys
38. return json with message key and accessTokenKey
39. next created a middlewarefile that authenticaates token
40. function takes in req, res and next. Must create a interface that extends request: user?: string|JWTPayload
41. const authHeader = req.headers['authorization']; const token = authHeader && authHeader.split(' ')[1]; 
42. req.headers['authorization'] retrieves the Authorization header from the HTTP request; 
43. authHeader &&.. extracts the JWT token cuz its usually in a format of Bearer*space*token
44. if there is no token return a unauthorized status
45. verify token jwet.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>)...
46. if there is no err, set req.user, which allows other routes to acces the user data from the req
47. call next()
48. create a one to many relation addition to the db. one account can have many items (Inventory Table)
49. in Account model, named the new Inventory as items because its a collection of things (multiple Inventory items)
50. for Inventory model, its called Inventory because each row is a single inventory item, table represents the concept of inventory as a whole.
51. add owner Account @relation(fields: [ownerId], references: [id]) <br/> ownerId Int     to inventory model
52. add a new query to model that takes account id and returns items (Inventory table where ownderid = id)
53. add a new controller where request type is a string | JWTPayload which is from the Authenticate token middleware
54. we treat req.user as a custom type from auth middleware and take the id
55. we send the usual message object but also send the query data back with the message
56. i made a new types folder for jwt stuff. authenticatedToken extends request, by having a user key(string|jwtpayload)
57. and customJwtPayload extends jwtpayload by having an id and username
58. add new route, add the middleware as 2nd arg. it passes thru there first, then runs the controller function