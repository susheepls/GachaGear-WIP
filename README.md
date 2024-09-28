# auth-testing

# Dependencies
-cors
-dotenv
-express
-@prisma.client

## Dev-Dependencies
-typescript
-ts-node

## --save-dev 
- @types/express
- @types/node
- @types/cors
- @types/bcrypt
- prisma

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