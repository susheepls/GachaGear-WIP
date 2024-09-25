# auth-testing

# Dependencies
-cors
-dotenv
-express

## Dev-Dependencies
-typescript
-ts-node

## --save-dev 
- @types/express
- @types/node
- @types/cors

# Steps I followed
1. npm-init;
2. install dependencies with npm install ___;
3. create a /src folder with a server.ts;
4. add tsc script and then run 'npm run tsc -- --init'
5. comment in line 30: module resolutions
6. set up some app.use in server; app.use(express.json()); app.use(cors());