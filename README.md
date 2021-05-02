<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Description

User authentication and authorization built on top of the [Nest](https://github.com/nestjs/nest) framework and PostgresSQL.

## Installation

```bash
$ npm install
```

## Running the database
```bash
$ docker-compose up
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Usage
Use [Postman](https://www.getpostman.com/) to send API requests:

- Register (POST api/v1/register)
```typescript
{
  email: string,
  password: string
}
```

- Login (POST api/v1/login)
```typescript
{
  email: string,
  password: string
}
```

- Reset password (POST api/v1/reset-password)
```typescript
{
  email: string
}
```

- Refresh token (POST api/v1/refresh-token)
```typescript
{
  refreshToken: string
}
```

- Me (GET api/v1/users/me)
 
- Swagger documentations (GET /api/v1/docs)
 
## License
[MIT licensed](LICENSE).
