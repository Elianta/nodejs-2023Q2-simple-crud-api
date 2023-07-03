# Simple CRUD API

[Assignment: Simple CRUD API](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md)

## :hammer: Installation:

    git clone git@github.com:Elianta/nodejs-2023Q2-simple-crud-api.git
    git checkout develop
    npm install

## :globe_with_meridians: Enviroment variables (.env):

    PORT=4000 // setup port on which application is running

## :runner: Run in development mode:

    npm run start:dev

## :running: Run in production mode:

    npm run start:prod

## :coffee: Run test scenarios :tea::

    npm run test

## API

Endpoint **api/users**

| Method                       | Description           |
| ---------------------------- | --------------------- |
| `GET api/users`              | Get all users         |
| `GET api/users/${userId}`    | Get user by id (uuid) |
| `POST api/users`             | Add new user          |
| `PUT api/users/${userId}`    | Update existing user  |
| `DELETE api/users/${userId}` | Delete user           |
