# vidTube

vidTube is a video streaming platform built with modern web technologies.

## 🚀 Features

- **User Authentication & Authorization**
  - Sign up, log in, and log out
  - Password hashing with bcrypt
  - JWT-based authentication with token blacklisting

- **Video Management**
  - Upload videos to **Cloudinary**
  - Retrieve videos with pagination
  - Update and delete videos

- **User Interactions**
  - Like/Dislike videos
  - Comment on videos
  - Subscribe/Unsubscribe to channels

- **Playlist Management**
  - Create and delete playlists
  - Add and remove videos from playlists

- **Secure APIs**
  - Input validation
  - Role-based access control
  - Error handling middleware


## 🛠 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT, bcrypt
- **File Storage**: Cloudinary
- **Other**: Multer, dotenv, cookie-parser


📂 Project Structure

Youtube-backend-clone/
├── src/
│ ├── config/ # DB and Cloudinary configs
│ ├── controllers/ # Route logic
│ ├── middlewares/ # Authentication, error handling
│ ├── models/ # Mongoose schemas
│ ├── routes/ # API endpoints
│ ├── utils/ # Helper functions
│ └── app.js # Express app setup
├── .env # Environment variables
├── package.json
└── README.md

## Getting Started

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/vidTube.git
    ```
2. Install dependencies:
    ```bash
    cd vidTube
    npm install
    ```
3. Start the development server:
    ```bash
    npm start
    ```


## Contributing

Contributions are welcome! Please open issues or submit pull requests.

## License

This project is licensed under the MIT License.