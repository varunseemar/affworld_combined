Full Stack Web Application
Project Description
This is a full-stack web application that allows users to create accounts, manage tasks, and post content in a feed. The project has three primary features: user authentication, a task management system, and a feed where users can post content. The application is built using the MERN (MongoDB, Express.js, React, Node.js) stack and integrates a drag-and-drop task management feature along with a content feed powered by Cloudinary for media storage.

Features Implemented
1. User Authentication
Register: Users can create an account by providing their name, email, and password.
Login: Registered users can log in using their email and password.
Forgot Password: Users can reset their password via OTP on email or email link.
2. Task Management System
Create Task: Users can add new tasks by providing a name and description.
Task Columns: The tasks are divided into three columns:
Pending
To Do
Done Users can drag and drop tasks between these columns, and the task's status is updated accordingly.
Delete Task: Users can delete tasks, with a confirmation prompt before deletion.
3. Feed Section
Post Content: Users can post content with a photo,m heading and a caption.
View Story: Users can click on any story and view it in a modal.
Cloudinary Integration: Photos are stored and retrieved using Cloudinary.
Note:-** Only .Jpg , .png are supported so choose only these files for photos.
Steps to Run the Project
Prerequisites:
Node.js (version 14 or higher)
MongoDB (Local or Atlas)
Cloudinary account (for photo storage)
1. Clone the Repository
Clone the project repository to your local machine.

git clone https://github.com/varunseemar/affworld_combined
2. Install Dependencies
Navigate to the project directory and install the backend and frontend dependencies.

Backend:
Navigate to the backend folder and install the dependencies:

cd backend
npm install

Frontend:
Navigate to the frontend folder and install the dependencies:

cd frontend
npm install

3. Setup Environment Variables
Create a .env file in both the backend and frontend directories and add the following environment variables.

PORT = 3000
JWTOKEN = your_jwt_secret_key
MONGOOSE_URL = your_mongodb_connection_string
EMAIL_USER= your_email_for_sending_reset_email
EMAIL_PASS= your_app_password_for_sending_reset_email
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

4. Start the Project
Backend:
Start the backend server:

cd backend
npm start
The backend will run on http://localhost:3000.

Frontend:
Start the frontend development server:

cd frontend
npm start

5. Access the Application
Open your browser and go to http://localhost:your_port_for_react_projects to access the application.
