\# CampusConnect – College Event Management System



\## Project Description

CampusConnect is a full-stack web application developed to manage college events and student registrations. Students can explore upcoming events, search for events, and register for their preferred activities. Organizers can create and delete events and view registration history.



\## Technologies Used

\- \*\*Frontend:\*\* React.js, HTML, CSS, JavaScript

\- \*\*Backend:\*\* Node.js, Express.js

\- \*\*Database:\*\* MySQL

\- \*\*Tools:\*\* Visual Studio Code, MySQL Workbench, Git, GitHub



\## Features

1\. View upcoming college events.

2\. Search events by title, description, or venue.

3\. Register for events using student name and email.

4\. Create new events with date, venue, and description.

5\. Delete existing events.

6\. View registration history.

7\. Store event and registration information in MySQL.



\## Project Structure

\- `src/` – React frontend

\- `backend/server.js` – Express API and database operations

\- `backend/package.json` – Backend dependencies

\- `package.json` – Frontend dependencies



\## How to Run the Project



\### 1. Set up the database

Create a MySQL database named `college\_events` and create the `events` and `registrations` tables. Add sample events if needed.



\### 2. Configure the backend

Create a `backend/.env` file containing your local MySQL credentials:



```env

DB\_USER=root

DB\_PASSWORD=your\_mysql\_password

```



Replace the example password with your own. Do not upload the `.env` file to GitHub.



\### 3. Start the backend

Open a terminal in the `backend` folder and run:



```bash

npm install

node server.js

```



The backend runs at `http://localhost:5000`.



\### 4. Start the frontend

Open another terminal in the project folder and run:



```bash

npm install

npm run dev

```



Open the local URL shown in the terminal, usually `http://localhost:5173`.



\## Result

The CampusConnect application provides a simple platform for managing college events and student registrations using React, Express.js, Node.js, and MySQL.



\## GitHub Repository

https://github.com/Nithya-1829/CollegeEventManagement

