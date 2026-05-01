A3 Multi-state Web Application and Testing
ToDoFlow

Overview

ToDoFlow is a multi-page task management web application built with React, Express, MongoDB, JWT authentication, and Socket.io. The goal of the project was to build a more complete full-stack application instead of just a basic CRUD demo.

Users can create accounts, log in securely, and manage their own tasks through a cleaner and more interactive interface. The app supports creating, searching, updating, and deleting tasks, while also tracking progress with an XP and level system. Real-time communication is used for online user tracking and live notifications.

This version of the project goes beyond a simple task manager by combining frontend design, backend API development, authentication, database integration, and real-time features into one system.

⸻

Main Features
	•	user signup and login
	•	jwt-based authentication
	•	protected routes and protected api endpoints
	•	user-specific task management
	•	create, read, update, and delete tasks
	•	search tasks by id
	•	search tasks by status
	•	xp and level progress system
	•	live online user count using socket.io
	•	real-time notification system
	•	floating notification widget
	•	responsive multi-page interface
	•	polished dashboard-style layout
	•	improved centered login page

⸻

Tech Stack

Frontend
	•	React
	•	Vite
	•	CSS

Backend
	•	Node.js
	•	Express
	•	MongoDB
	•	Mongoose
	•	Socket.io
	•	JWT
	•	bcrypt

⸻

Project Structure

group47_CPS630_A3/
	•	frontend/
	•	src/
	•	components/
	•	views/
	•	utils/
	•	css/
	•	App.jsx
	•	main.jsx
	•	vite.config.js
	•	backend/
	•	models/
	•	server.js
	•	socket.js
	•	todolist.json
	•	README.md

⸻

How to Run
	1.	Clone the repository and open the project folder.
	2.	Install backend dependencies:

cd backend
npm install

	3.	Install frontend dependencies:

cd ../frontend
npm install

	4.	Make sure MongoDB is running locally on the default port.
	5.	Start the backend server:

cd backend
npm start

The backend runs on:

http://localhost:8080

	6.	Start the frontend server:

cd frontend
npm run dev

The frontend runs on the Vite development server, usually:

http://localhost:5173

	7.	Open the frontend link in your browser.

Demo Account

If the seeded admin account exists, you can log in with:

username: admin
password: admin123

If not, you can create a new account using the sign up button on the login page.

⸻

How to Use

Login / Signup

When the application opens, the user begins on the login page. A new user can create an account by entering a username and password and clicking the sign up button. After that, the user can log in and access the protected pages of the app.

Home Page

The Home page acts as the dashboard. It introduces the app, shows task information, and gives a cleaner overview of what the user currently has to do.

Edit Page

The Edit page is where the user manages tasks. On this page, the user can:
	•	view all tasks
	•	search for a task by id
	•	search tasks by status
	•	create a new task
	•	update an existing task
	•	delete tasks that are no longer needed

About Page

The About page explains the app’s purpose and main features.

XP System

Each task can have experience points. When tasks are completed, they contribute to the user’s total XP and level progress.

Real-Time Features

The app supports real-time features through Socket.io. Users can see how many users are online, and task activity can trigger live notifications.

⸻

API Routes

Authentication
	•	POST /api/auth/login
	•	POST /api/auth/signup
	•	GET /api/auth/check

Tasks
	•	GET /api/to_do_items
	•	GET /api/to_do_items/:id
	•	GET /api/to_do_items/status/:status
	•	GET /api/to_do_items/title/:title
	•	POST /api/to_do_items
	•	PUT /api/to_do_items/:id
	•	DELETE /api/to_do_items/:id
	•	DELETE /api/to_do_items/title/:title

⸻

Database Models

User Model

The user model stores:
	•	username
	•	password
	•	role

Passwords are hashed before being stored in the database.

Task Model

The task model stores:
	•	id
	•	title
	•	description
	•	status
	•	due date
	•	experience points
	•	assigned user id

The assignedTo field connects tasks to a specific logged-in user.

⸻

Authentication

Authentication is handled using JWT. After login, the user receives a token that is stored locally and used to access protected routes and protected API requests.

This means:
	•	only logged-in users can access the main app
	•	each user only sees their own tasks
	•	task routes are protected from unauthorized access

This made the app more realistic than a basic shared task list.

⸻

Real-Time Communication

Socket.io was added to support real-time communication.

The app uses it for:
	•	live online user count
	•	task activity events
	•	real-time notification updates

When tasks are created, updated, completed, or deleted, the backend can emit real-time events. This helps make the application feel more interactive and modern.

⸻

Meeting Assignment Standards

This project was designed to meet the main assignment requirements by combining frontend, backend, database, authentication, and real-time communication into one complete application.

The frontend uses React to build multiple pages and reusable components.
The backend uses Express and MongoDB with Mongoose models.
Authentication is handled with JWT and protected routes.
Each user only sees their own tasks after logging in.
Real-time communication is handled with Socket.io.

Because of this, the project goes beyond a simple single-user CRUD demo and becomes a more complete full-stack application.

⸻

Being Creative

One of the goals was to avoid making the app feel too plain or too close to a tutorial example. To make it more creative, the project includes:
	•	an XP and level system for gamification
	•	real-time online user tracking
	•	a floating notification system
	•	a more polished login page
	•	a cleaner dashboard-style layout

These choices were made to help the app feel more like a product instead of just a class exercise.

⸻

Design and Modularity

A major focus of the project was improving both design and organization.

Design Improvements

The interface was improved with:
	•	cleaner spacing
	•	better alignment
	•	stronger visual hierarchy
	•	more consistent styling
	•	improved responsiveness across screen sizes

Modularity

The project was split into reusable components and separate views. Examples include:
	•	navbar
	•	xp bar
	•	notification component
	•	login, home, edit, and about views
	•	backend models for users and tasks
	•	separate socket setup

This made the project easier to manage, easier to update, and more organized overall.

⸻

Usability Considerations

The app was improved with usability in mind. Some of the main areas considered were:
	•	making pages easier to scan
	•	making actions easier to find
	•	using clearer layouts and spacing
	•	keeping navigation more consistent
	•	reducing clutter
	•	improving responsiveness
	•	giving users better visual feedback
	•	making the login experience feel cleaner and more centered

These changes helped make the application easier to understand and use.

⸻

Challenges

Some of the biggest challenges in this project were:
	•	connecting authentication properly across frontend and backend
	•	making sure each user only sees their own tasks
	•	setting up MongoDB models and references correctly
	•	getting Socket.io to work without duplicate connections
	•	fixing online user counts while testing in multiple tabs
	•	improving the notification system
	•	making the UI feel more polished and professional
	•	keeping the layout responsive and consistent across different screen sizes

A big lesson was that even when features technically work, the app still needs careful design and testing to feel complete.

⸻

Reflection

This project helped us understand how different parts of a full-stack application connect together. We worked with frontend design, backend API development, database design, user authentication, and real-time communication in one project. Compared to a more basic task manager, this version felt much closer to a real-world web app because it supported user accounts, protected data, and live updates.

One of the biggest lessons from this project was that usability and polish matter a lot. Even if an app works technically, small issues in layout, responsiveness, and interaction can make it feel unfinished. Improving those details and testing the full user flow made a big difference in the final result.

⸻

Learning Conclusions

Overall, this project helped us understand:
	•	React component structure
	•	state handling
	•	frontend routing logic
	•	Express API development
	•	MongoDB schema design
	•	JWT authentication
	•	bcrypt password hashing
	•	Socket.io real-time communication
	•	frontend usability and polish

In conclusion, ToDoFlow became more than just a task manager. It became a stronger example of how multiple web development concepts can be combined into one application. The project also showed us that adding creativity, better design, and real-time features can make a simple idea feel much more advanced and much more useful.

⸻

Things to Consider

Before running or grading the project, a few important things should be considered:
	•	MongoDB must be running locally
	•	backend should run on port 8080
	•	frontend should run through Vite
	•	JWT secret must be set in the backend environment
	•	some seeded data may depend on the local database state
	•	socket behavior can look different during development if React StrictMode is enabled
	•	notification history may depend on local session or browser storage depending on implementation

⸻

Future Improvements

If this project were extended further, some possible improvements would be:
	•	database-backed notification history
	•	drag-and-drop task organization
	•	better role-based permissions
	•	profile settings
	•	due date filtering
	•	calendar integration
	•	better mobile-first layouts
	•	richer analytics for task completion and XP progress

⸻

Writers / Contributors
	•	Josh Fernando
	•	NumAir Jaan
	•	Jeremy Matthew
	•	Adam Barre

⸻

Final Note

ToDoFlow was built as a full-stack task management app that combines task organization, authentication, gamification, real-time updates, and improved UI design into one project. The final result is much stronger and more polished than a basic CRUD application, and it reflects both technical implementation and usability improvements.
