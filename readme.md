## Assignmentof users and posts with comment and like functionalities

## Introduction
created user and post models where user can be created ,updated,deleted along with implementation of login api and created an post Model on which ,we can perform CRUD with Authentication and Authorization and added functionalities like an logged in user can comment the post as well as can like the comments. tech stacks used here are Nodejs,Expressjs,Mongoose,MongoDB,Jwt,Redis,nodemon,bcrypt for password encryption,and dotenv to save sensative credentials like mongoDb string and Secret-keys of Jwt used redis to implement refresh token system to get fast response from refreshable jwt token

## Usage
this project main aim is to create user who can create,delete,update,his posts and can see others post by logging himself in,along if he is logged in or authorized user he can also comment on some other users post as well as can like the comments of others 

## Setup
1. Clone this repository:
   ```bash
   git clone [<repository-url>](https://github.com/Kartik-Shrikhande/Assignment_users_posts.git)
   ```


2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the necessary environment variables in a `.env` file (see [Environment Variables](#environment-variables)).

4. Run the API:
   ```bash
   npm start
   ```

5. Access the API at `http://localhost:3000`.


## Database Configuration
1. Ensure you have a running MongoDB instance.
2. Set up environment variables in a `.env` file:

        PORT=API server port. (Default: 3000)
        MONGO_URL=your-mongodb-url
        SECRET_KEY=your-secret-key
        REFRESH_SECRET_KEY='r_key'
        REDIS_HOST='redis String'
        REDIS_PORT='Port Number'
        REDIS_PASS='Redis -password'

...


## Authentication
This API requires authentication using JSON Web Tokens (JWT). Users need to register and log in to obtain a JWT token for accessing protected routes.


## Password Hashing
User passwords are securely hashed using the bcrypt library before being stored in the database. This adds an extra layer of security to protect user data.



## Environment Variables
Before running the project, you need to set up the following environment variables in a `.env` file:

- `PORT`: The port on which the API server will listen. (Default: 3000)

- `MongoDB`: MongoDB connection URL.

- `SECRET_KEY`: Secret key used for generating and verifying JSON Web Tokens (JWT) for authentication.

- `REFRESH_SECRET_KEY`:'refersh secret key to refresh Jwt expired token '

- `REDIS_HOST`:'redis hosting String'

- `REDIS_PORT`:'Port Number'
   
- `REDIS_PASS`:'Redis -password'

Example `.env` file:

```Plaintext:-
PORT=3000
MongoDB=mongodb://localhost:27017/your-database-name
SECRET_KEY=your-secret-key
REFRESH_SECRET_KEY='r_key'
REDIS_HOST='redis String'
REDIS_PORT='Port Number'
REDIS_PASS='Redis -password'
```

## Running the Project
1. Run the API:
   ```bash
   npm start
   ```

2. Access the API at `http://localhost:3000`.



## Testing
To run tests, execute:
```bash
npm test
```


## License
This project is licensed under the MIT License. ![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)