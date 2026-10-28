# CrewUp — Student Project Team Finder & Collaboration Platform

[![Frontend Deployed on Vercel](https://img.shields.io/badge/Frontend-Deployed%20on%20Vercel-black?logo=vercel)](https://endterm5.vercel.app)
[![Backend Deployed on Render](https://img.shields.io/badge/Backend-Deployed%20on%20Render-46E3B7?logo=render&logoColor=white)](https://crewup-backend-api.onrender.com/api/health)
[![GitHub Repository](https://img.shields.io/badge/GitHub-pujith2007%2Fendterm5-181717?logo=github)](https://github.com/pujith2007/endterm5)
[![MERN Stack](https://img.shields.io/badge/Stack-MERN-6366f1.svg)](https://reactjs.org/)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas%20%2B%20Mongoose-47a248.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**CrewUp** is a full-stack MERN web application engineered for university students to pitch project concepts, discover complementary teammates through smart skill matching, review team applications, and collaborate in real-time Kanban workspaces.

---

## 🌐 Live Deployment Links

| Component | Platform | Live URL | Status |
| :--- | :--- | :--- | :--- |
| **Frontend Application** | **Vercel** | [https://endterm5.vercel.app](https://endterm5.vercel.app) | 🟢 Live & Active |
| **Backend API Service** | **Render** | [https://crewup-backend-api.onrender.com](https://crewup-backend-api.onrender.com) | 🟢 Live & Active |
| **API Health Check** | **Render** | [https://crewup-backend-api.onrender.com/api/health](https://crewup-backend-api.onrender.com/api/health) | 🟢 Healthy (`200 OK`) |
| **GitHub Repository** | **GitHub** | [https://github.com/pujith2007/endterm5](https://github.com/pujith2007/endterm5) | 🟢 Public Repository |

> **Quick Evaluator Demo Credentials:**
> - **Student 1 (Full-stack):** `alex@student.edu` / `password123`
> - **Student 2 (AI/ML):** `sarah@student.edu` / `password123`
> - **Student 3 (Mobile):** `marcus@student.edu` / `password123`
> *(One-click demo buttons are also available on the Login screen!)*

---

## 📑 Project Submission Metadata

```text
Project Name: CrewUp — Student Project Team Finder & Collaboration Platform
Student Name: Srivasthav Sarathy
Problem Statement: University students struggle to discover hackathon and capstone teammates with complementary technical skills, track team applications, and manage task collaboration in a single organized workspace.
Tech Stack: MongoDB Atlas, Express.js, React.js (Vite), Node.js, Tailwind CSS, JWT Authentication, Context API, Axios
Frontend Live URL: https://endterm5.vercel.app
Backend Live URL: https://crewup-backend-api.onrender.com
GitHub Repository: https://github.com/pujith2007/endterm5
```

---

## 📸 Platform Highlights

- **Smart Skill Matching Engine**: Compares applicant and user profile skills against project requirements in real time, calculating true mathematical compatibility percentages ($\frac{\text{matching skills}}{\text{required skills}} \times 100\%$) with alias normalization.
- **Dynamic Project Discovery**: Full-text search and faceted filtering by domain category (*Web Development*, *Mobile App*, *AI / Machine Learning*, *Blockchain*, *IoT / Robotics*, *Game Dev*), technology stack, recruitment status, or skill match.
- **Team Application & Review Flow**: In-app application flow with custom pitch notes, duplicate application prevention, max member capacity guards, and owner accept/reject decision tools.
- **Private Agile Workspace**: Real-time project collaboration boards with 3-column Kanban sprint management (*To Do*, *In Progress*, *Done*), member task assignments, priority labels, due date tracking, and overall sprint progress meters.
- **Instant In-App Notifications**: Real-time activity alerts for project owners when applications arrive, for applicants when accepted/rejected, and for members when assigned tasks.
- **Secure Authentication & Profiles**: Custom JWT authentication with bcrypt password hashing, input validation, and customizable student profiles with colleges, technical skills, and GitHub links.
- **Resilient MongoDB Configuration**: Configured for MongoDB Atlas with user credentials, featuring an automatic embedded fallback with pre-seeded demo data for immediate zero-config evaluation.

---

## 🏗️ Ordered Project Structure

```
mern_end_term_project/
├── frontend/                   # All Frontend Source Code (React 18 + Vite + Tailwind)
│   ├── public/                 # Static assets & SVG icons
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Navbar, Footer, ProtectedRoute, Modal, Badges, SkillTags
│   │   │   ├── projects/       # ProjectCard with skill compatibility badges
│   │   │   └── workspace/      # TaskCard (Kanban) and TaskModal
│   │   ├── context/
│   │   │   ├── AuthContext.jsx         # User auth, JWT token, profile state
│   │   │   └── NotificationContext.jsx # In-app notification polling & read state
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx         # Hero, stats, 4-step workflow, demo fills
│   │   │   ├── LoginPage.jsx           # JWT login with one-click demo accounts
│   │   │   ├── RegisterPage.jsx        # Student registration & technical skills setup
│   │   │   ├── DashboardPage.jsx       # Overview, recommended skill matches, metrics
│   │   │   ├── ExploreProjectsPage.jsx # Faceted search, category chips, sort
│   │   │   ├── ProjectDetailsPage.jsx  # Detailed overview, skill breakdown, apply
│   │   │   ├── CreateEditProjectPage.jsx # Project creator & configurator
│   │   │   ├── MyProjectsPage.jsx      # Owned projects, joined teams, applications
│   │   │   ├── WorkspacePage.jsx       # Private Kanban board, sprint progress
│   │   │   ├── ProfilePage.jsx         # Student profile & skill cloud editor
│   │   │   └── NotificationsPage.jsx   # In-app alerts center
│   │   ├── services/
│   │   │   └── api.js                  # Axios client with JWT interceptor
│   │   ├── App.jsx                     # Route declarations
│   │   ├── main.jsx                    # React entry root
│   │   └── index.css                   # Tailwind base & glassmorphic utilities
│   ├── tailwind.config.js
│   ├── vite.config.js                  # Dev server with /api proxy to port 5000
│   └── package.json
│
├── backend/                    # All Backend Source Code (Node.js + Express + Mongoose)
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                   # Resilient MongoDB connector (Atlas + Embedded fallback)
│   │   ├── controllers/
│   │   │   ├── authController.js       # Register, login, getMe, updateProfile
│   │   │   ├── projectController.js    # CRUD, search, filter, recommendations
│   │   │   ├── requestController.js    # Apply, approve, reject, withdraw
│   │   │   ├── taskController.js       # Workspace task management
│   │   │   └── notificationController.js# Notifications & unread counts
│   │   ├── middleware/
│   │   │   ├── auth.js                 # JWT verification (protect & optionalAuth)
│   │   │   └── error.js                # Centralized error handler & 404
│   │   ├── models/
│   │   │   ├── User.js                 # User schema with bcrypt pre-save
│   │   │   ├── Project.js              # Project schema with members sub-docs & virtuals
│   │   │   ├── JoinRequest.js          # Unique compound index application schema
│   │   │   ├── Task.js                 # Workspace task schema
│   │   │   └── Notification.js         # In-app notification schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── projectRoutes.js
│   │   │   ├── requestRoutes.js
│   │   │   ├── taskRoutes.js
│   │   │   └── notificationRoutes.js
│   │   ├── services/
│   │   │   ├── skillMatcher.js         # Skill normalization & compatibility calculator
│   │   │   └── seedService.js          # Reusable seed runner with demo datasets
│   │   ├── seed.js                     # Standalone CLI seeder
│   │   └── server.js                   # Express app initialization
│   ├── .env                            # Backend configuration with MongoDB credentials
│   ├── .env.example
│   └── package.json
│
├── package.json                # Monorepo root scripts (dev:backend, dev:frontend)
└── README.md
```

---

## ⚡ Quick Start & Installation

### Prerequisites

- **Node.js** v18+ (tested on Node v20/v22)
- **npm** v9+

### 1. Install Dependencies

In the root repository folder:

```bash
npm run install:all
```

*(Installs dependencies across both `backend/` and `frontend/`)*

### 2. Database & Environment Configuration

The backend environment file is configured in `backend/.env`:

```env
PORT=5000

# MongoDB Configuration
MONGODB_USER=srivasthav2007_db_user
MONGODB_PASS=ohYO0lAh572onLfb
MONGODB_URI=mongodb+srv://srivasthav2007_db_user:ohYO0lAh572onLfb@<cluster-host>/crewup?retryWrites=true&w=majority

# JWT & Secrets
JWT_SECRET=supersecret_crewup_jwt_token_key_2026_dev
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

> **Note on MongoDB**: If a remote cluster host is provided in `backend/.env`, CrewUp connects to it directly. If the cluster is unreachable or no local daemon is running, CrewUp's connector automatically initializes a local embedded MongoDB instance with pre-seeded demo data, guaranteeing **zero crashes and instantaneous testability**!

### 3. Run Development Servers

Start the backend and frontend:

**Terminal 1 — Backend:**
```bash
npm run dev:backend
# API server running on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
npm run dev:frontend
# Vite React app running on http://localhost:5173
```

Open your browser to: **[http://localhost:5173](http://localhost:5173)**.

---

## 👥 Demo Accounts

The database comes pre-seeded with realistic student accounts spanning multiple domains. All demo accounts use the password: `password123`.

| Student Name | Email | College | Primary Focus | Role in Seed Data |
| :--- | :--- | :--- | :--- | :--- |
| **Alex Rivera** | `alex@student.edu` | MIT | Full-Stack (React, Node, Mongo, Tailwind) | Owner of *CampusHub*, Member of *DecentraCred* |
| **Sarah Chen** | `sarah@student.edu` | Stanford | AI/ML (Python, PyTorch, FastAPI, Docker) | Owner of *MediScan AI*, Applicant to *CampusHub* |
| **Marcus Johnson** | `marcus@student.edu` | UC Berkeley | Mobile & Cloud (React Native, AWS, Firebase)| Owner of *EchoVerse* & *GreenTrack IoT* |
| **Elena Rostova** | `elena@student.edu` | CMU | UI/UX & Frontend (React, Figma, Next.js) | Member of *CampusHub* |
| **Devon Patel** | `devon@student.edu` | Georgia Tech | Blockchain (Solidity, Ethereum, Web3, Go) | Owner of *DecentraCred* |

> 💡 **Quick Login**: The Login and Landing pages feature **one-click Demo buttons** to instantaneously sign in as any of these users without typing credentials.

---

## 🧠 Smart Skill Matching Algorithm

Unlike basic keyword searches, CrewUp implements algorithmic skill compatibility calculation in `backend/src/services/skillMatcher.js`:

1. **Normalization & Canonical Aliasing**:
   - Matches synonymous technologies seamlessly (e.g. `react.js` $\leftrightarrow$ `react`, `node` $\leftrightarrow$ `node.js` $\leftrightarrow$ `nodejs`, `mongo` $\leftrightarrow$ `mongodb`, `py` $\leftrightarrow$ `python`).
2. **Formula**:
   $$\text{Compatibility} = \left\lfloor \frac{|\text{User Skills} \cap \text{Project Required Skills}|}{|\text{Project Required Skills}|} \times 100\% \right\rfloor$$
3. **Deep Feedback**:
   - Returns exact matching skills (highlighted in emerald with checkmarks).
   - Returns missing skills to help students see growth opportunities.
   - Powers the **Recommended for You** feed on the dashboard and compatibility sorting on the Explore page.

---

## 📋 RESTful API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new student account & receive JWT |
| `POST` | `/api/auth/login` | Public | Authenticate student & receive JWT |
| `GET` | `/api/auth/me` | Private | Fetch logged-in user profile |
| `PUT` | `/api/auth/profile` | Private | Update student bio, skills, college, and links |

### Projects (`/api/projects`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/projects` | Optional Auth | List projects with search, filter, and skill scoring |
| `GET` | `/api/projects/my-projects`| Private | Retrieve owned and joined projects |
| `GET` | `/api/projects/recommendations` | Private | Get top projects scored by user skill match |
| `GET` | `/api/projects/:id` | Optional Auth | Single project details, team roster & application status |
| `POST` | `/api/projects` | Private | Create a new project (sets user as Owner) |
| `PUT` | `/api/projects/:id` | Private (Owner) | Update project metadata, status, or capacity |
| `DELETE`| `/api/projects/:id` | Private (Owner) | Delete project and cascade delete tasks & requests |

### Applications (`/api/requests`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/requests` | Private | Submit join application with pitch message |
| `GET` | `/api/requests/my-applications` | Private | List applications submitted by current user |
| `GET` | `/api/requests/project/:projectId`| Private (Owner)| List all applicants for a project with skill scores |
| `PUT` | `/api/requests/:id` | Private (Owner)| Accept or reject application (updates team roster) |
| `DELETE`| `/api/requests/:id` | Private (Applicant)| Withdraw pending application |

### Workspace Tasks (`/api/tasks`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks/project/:projectId`| Private (Team) | Fetch tasks for private team workspace |
| `POST` | `/api/tasks` | Private (Team) | Create task with assignee, priority, and due date |
| `PUT` | `/api/tasks/:id` | Private (Team) | Update task title, status (To Do / In Progress / Done) |
| `DELETE`| `/api/tasks/:id` | Private (Team) | Delete task from workspace |

### Notifications (`/api/notifications`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/notifications` | Private | Retrieve user notifications & unread count |
| `PUT` | `/api/notifications/:id/read` | Private | Mark single notification as read |
| `PUT` | `/api/notifications/mark-all-read` | Private | Bulk mark all notifications as read |

---

## 🔒 Security & Data Integrity

- **Password Hashing**: Bcrypt with salt rounds of 10 applied on Mongoose `pre('save')`.
- **JWT Protection**: Tokens verified via standard Authorization `Bearer` header with 30-day expiration.
- **Resource-Based Authorization**:
  - Only project owners can edit/delete projects or review/accept applicants.
  - Only approved project team members can access private workspaces or manage sprint tasks.
- **Duplicate Prevention**:
  - Compound unique database index on `{ project: 1, applicant: 1 }` prevents double applications.
  - Application logic prevents project owners from applying to their own projects.
  - Team capacity checks prevent applicants from joining full projects.

---

## 🚀 Production Deployment Guidance

### Deploying the Backend (Render / Railway / Heroku)
1. Push repository to GitHub.
2. In host dashboard, create a Web Service pointing to `backend/`.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Configure environment variables:
   - `MONGODB_URI`: `mongodb+srv://srivasthav2007_db_user:ohYO0lAh572onLfb@<cluster-host>/crewup?retryWrites=true&w=majority`
   - `JWT_SECRET`: A secure random cryptographic secret string
   - `CLIENT_URL`: Your deployed frontend URL

### Deploying the Frontend (Vercel / Netlify)
1. In Vercel or Netlify, select repository with root pointing to `frontend/`.
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Environment Variable:
   - `VITE_API_URL`: Your deployed backend API URL

---

## 📄 License

This project is licensed under the MIT License — free for educational and commercial use.
