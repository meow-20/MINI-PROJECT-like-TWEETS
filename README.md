# Mini Social Media Project

This project is a simple social media platform with essential features like user authorization, profile management, and tweet posting. Users can sign up, log in, update their profiles, and post tweets. The project demonstrates backend authentication, profile management, and frontend rendering.

## Features

- **User Authorization**: Secure login and signup with JSON Web Tokens (JWT) and `cookie-parser`.
- **Password Hashing**: Passwords are securely hashed with `bcryptjs` before being saved to the database.
- **Profile Page**: Users have a profile page where they can:
  - Upload and update their profile picture.
  - Update their display name.
  - Write and post tweets.
  - View their tweets displayed in reverse chronological order.
- **Protected Routes**: Routes are protected with an `isLoggedIn` middleware to ensure only authenticated users can access specific functionalities.
- **Logout Functionality**: Users can securely log out and invalidate their session.

## Tech Stack

- **Backend**:
  - Node.js and Express.js
  - MongoDB as the database
  - JWT and `cookie-parser` for authentication and authorization
  - `bcryptjs` for password hashing
  - `multer` for handling profile picture uploads
- **Frontend**:
  - EJS for templating and rendering dynamic HTML content

## Project Structure

```plaintext
project-root
│
├── models               # Database models (e.g., User, Tweet)
├── routes               # Defines application routes
├── public               # Static assets (e.g., CSS, images)
├── views                # EJS templates for rendering frontend pages
├── middleware           # Middleware functions (e.g., isLoggedIn for route protection)
└── app.js               # Main server file
