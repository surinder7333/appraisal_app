MERN Stack Appraisal System
A comprehensive employee appraisal management system built with the MERN stack (MongoDB, Express.js, Node.js) and Next.js and tailwind css and shadcn.

Appraisal System Dashboard

Features

Backend Setup
Frontend Setup

Features
Multi-role Authentication: Admin, Manager, and Employee roles with different permissions
Dashboard: Role-specific dashboards with relevant metrics and actions

Appraisal Management: Create, view, edit, and manage employee appraisals
Self-Appraisals: Employees can submit self-appraisals
Manager Reviews: Managers can review and provide feedback on employee appraisals
Reporting: Generate reports on employee performance and appraisal status
Notifications: Email notifications for appraisal deadlines and updates
Responsive Design: Works on desktop, tablet, and mobile devices

Tech Stack
Frontend
Next.js: React framework 
React: UI library for building component-based interfaces
Tailwind CSS: Utility-first CSS framework
shadcn/ui: High-quality UI components built with Radix UI and Tailwind
Lucide Icons: Beautiful open-source icons


Backend
Node.js: JavaScript runtime
Express.js: Web application framework
MongoDB: NoSQL database
Mongoose: MongoDB object modeling for Node.js


Authentication
NextAuth.js: Authentication for Next.js applications
JWT: JSON Web Tokens for secure authentication



Getting Started
Clone the Repository

cd mern-appraisal-system


Backend Setup
Navigate to the backend directory:
cd backend
Install dependencies:
npm install
# or
yarn install
Create a .env file in the backend directory with the following variables:

Start the backend server:

npm start

The backend server will run on http://localhost:5000.

Frontend Setup
Navigate to the frontend directory:
cd ../frontend
Install dependencies:
npm install

Start the frontend development server:
npm run dev



User Roles
Admin
Create and manage user accounts
Configure system settings
Access all appraisals and reports
Manage departments and roles
Manager
View employees under their management
Create and manage appraisals for their team
Review and approve/reject employee self-appraisals
Generate reports for their team
Employee
Submit self-appraisals
View their own appraisal history
Receive feedback from managers
Track personal performance metrics
Manager Dashboard Features
The Manager Dashboard includes the following key features:

Appraisal Management:

View appraisals submitted by the manager
View self-appraisals from team members
Filter appraisals by employee
Approve or reject pending appraisals
Provide feedback on appraisals
Employee Overview:

View all employees under management
See appraisal history for each employee
Create new appraisals for specific employees
Reporting:

View appraisal status metrics
See department-based appraisal statistics
Track team performance over time
Permission System:

Managers can only see appraisals they've submitted
When selecting a specific employee, managers can see:

That employee's self-appraisals
Appraisals the manager has submitted for that employee



API Documentation
Authentication Endpoints
POST /api/auth/register - Register a new user
POST /api/auth/login - Login a user
GET /api/auth/me - Get current user info
User Endpoints
GET /api/users - Get all users (admin only)
GET /api/users/:id - Get user by ID
PUT /api/users/:id - Update user
DELETE /api/users/:id - Delete user (admin only)
Appraisal Endpoints
GET /api/appraisals - Get all appraisals (filtered by role)
POST /api/appraisals - Create a new appraisal
GET /api/appraisals/:id - Get appraisal by ID
PUT /api/appraisals/:id - Update appraisal
DELETE /api/appraisals/:id - Delete appraisal
Department Endpoints
GET /api/departments - Get all departments
POST /api/departments - Create a new department (admin only)
GET /api/departments/:id - Get department by ID
PUT /api/departments/:id - Update department (admin only)
DELETE /api/departments/:id - Delete department (admin only)


Deployment
backend deployed on render 
frontend deployed on netlify





