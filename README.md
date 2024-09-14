
## Description

This project is a part of recruitment process. 

## Project setup

```bash
$ npm install
$ npx prisma generate
```

## Configure environment variables
Before running the application, you need to create a .env file in the root of the project and set the DATABASE_URL variable. This variable should contain the MongoDB connection URL. Use the following format and replace <MONGO_CONNECTION_STRING> with your actual MongoDB connection URL:

```bash
DATABASE_URL=<MONGO_CONNECTION_STRING>
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## API Documentation
It is possible to access the API documentation by accessing the following URL: http://localhost:3000/api based on Swagger.


## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
