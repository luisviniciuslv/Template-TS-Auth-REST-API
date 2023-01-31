# Example API with Email Verification and JWT Authentication

## Introduction

This API provides an example of how to create accounts with email verification and JWT authentication, following best practices. Simply clone this repository and you can start building your project.

## Features

- User registration with email verification
- Login with JWT authentication
- Secure password storage with bcrypt
- Proper error handling and input validation
- Uses Node.js, Express, and MongoDB

## Getting Started

1. Clone the repository
```git clone https://github.com/luisviniciuslv/AuthAPI.git```

2. Install the dependencies
```npm install --legacy-peer-deps```

3. Configure .env file
```
EMAIL_ADRESS=yougmail@gmail.com
PASSWORD_EMAIL_ADRESS=yourpassword
DATABASE_ADDRESS=mongodb+srv://123:123@cluster0.rmlvs.mongodb.net
JWT_SECRET=123
```

4. Start the API
```npm run start```

## Endpoints
```  
  - POST /creationRequest - creates an account creation request, sending a code to the user's email.
  - POST /verifyCodeCreation - checks if the email and account creation code are valid, and if so, it registers the account in the database
  - POST '/login' - receives an email and password, if they exist in the database, returns an access token.
  - GET '/:id' - returns a user based on its id, but access token is required to receive!
```
