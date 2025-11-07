# 🎯 PrepForge - AI-Powered Interview Preparation Platform# 🎯 PrepForge - AI-Powered Interview Preparation Platform



> A comprehensive full-stack platform for interview preparation featuring AI-powered mock interviews, real-time human interviews, and intelligent chatbot assistance.> A comprehensive full-stack platform for interview preparation featuring AI-powered mock interviews, real-time human interviews, and intelligent chatbot assistance.



PrepForge helps students and professionals ace their job interviews through practice with AI and real interviewers. Built with modern technologies and a dual-role system for collaborative learning.PrepForge helps students and professionals ace their job interviews through practice with AI and real interviewers. Built with modern technologies and a dual-role system for collaborative learning.



[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)



## ✨ Key Features## ✨ Key Features



### 🤖 AI-Powered Mock Interviews### � AI-Powered Mock Interviews

- **Multiple Interview Types**: Technical, HR, Behavioral, Domain-specific- **Multiple Interview Types**: Technical, HR, Behavioral, Domain-specific

- **Smart AI Interviewer**: Powered by Google Gemini API- **Smart AI Interviewer**: Powered by Google Gemini API

- **Real-time Feedback**: Communication skills, technical correctness, confidence analysis- **Real-time Feedback**: Communication skills, technical correctness, confidence analysis

- **Performance Tracking**: Detailed reports and session history- **Performance Tracking**: Detailed reports and session history

- **Voice & Text Support**: Practice speaking or typing responses- **Voice & Text Support**: Practice speaking or typing responses



### 👥 Live Human Interviews  ### � Live Human Interviews  

- **WebRTC Video Calls**: High-quality, secure video interviews- **WebRTC Video Calls**: High-quality, secure video interviews

- **Real-time Features**: Chat, screen sharing, interview timer- **Real-time Features**: Chat, screen sharing, interview timer

- **Scheduling System**: Request and manage interview sessions- **Scheduling System**: Request and manage interview sessions

- **Rating System**: Give and receive feedback- **Rating System**: Give and receive feedback



### 💬 AI Chatbot Assistant (Candidates Only)### 💬 AI Chatbot Assistant (Candidates Only)

- **24/7 Availability**: Get help anytime you need it- **24/7 Availability**: Get help anytime you need it

- **Interview Tips**: Preparation strategies and best practices  - **Interview Tips**: Preparation strategies and best practices  

- **Resume Guidance**: Advice on resume writing and optimization- **Resume Guidance**: Advice on resume writing and optimization

- **Career Support**: Job search tips and platform navigation- **Career Support**: Job search tips and platform navigation

- **Powered by Gemini**: Advanced AI responses tailored for interview prep- **Powered by Gemini**: Advanced AI responses tailored for interview prep



### 🎭 Dual-Role System### 🎭 Dual-Role System

- **👤 Candidates**: Schedule interviews, practice with AI, track progress, get chatbot help- **👤 Candidates**: Schedule interviews, practice with AI, track progress, get chatbot help

- **👨‍🏫 Interviewers**: Accept requests, conduct sessions, help others improve- **👨‍🏫 Interviewers**: Accept requests, conduct sessions, help others improve

- **Role-Based Views**: Personalized dashboards and navigation for each role- **Role-Based Views**: Personalized dashboards and navigation for each role



### 🔐 Additional Features### 🔐 Additional Features

- JWT-based authentication and authorization- JWT-based authentication and authorization

- Role-specific dashboards with analytics- Role-specific dashboards with analytics

- Email notifications for interview scheduling  - Email notifications for interview scheduling  

- Admin panel for user management- Admin panel for user management

- Modern, responsive UI with TailwindCSS- Modern, responsive UI with TailwindCSS

- Real-time updates with Socket.io- Real-time updates with Socket.io



## 🛠️ Tech Stack## 🛠️ Tech Stack



### Frontend### Frontend

- **Framework**: React 18 + TypeScript- **Framework**: React 18 + TypeScript

- **Styling**: TailwindCSS- **Styling**: TailwindCSS

- **Build Tool**: Vite- **Build Tool**: Vite

- **Routing**: React Router v6- **Routing**: React Router v6

- **HTTP Client**: Axios- **HTTP Client**: Axios

- **State Management**: Zustand- **State Management**: Zustand

- **Video**: WebRTC- **Video**: WebRTC

- **UI Icons**: Lucide React- **UI Icons**: Lucide React



### Backend### Backend

- **Runtime**: Node.js 18+- **Runtime**: Node.js 18+

- **Framework**: Express + TypeScript- **Framework**: Express + TypeScript

- **Database**: PostgreSQL 14+- **Database**: PostgreSQL 14+

- **ORM**: Prisma- **ORM**: Prisma

- **Authentication**: JWT- **Authentication**: JWT

- **Real-time**: Socket.io- **Real-time**: Socket.io

- **AI Integration**: Google Gemini API- **AI Integration**: Google Gemini API

- **Email**: Nodemailer- **Email**: Nodemailer



### DevOps & Tools### DevOps & Tools

- ESLint + Prettier for code quality- ESLint + Prettier for code quality

- Nodemon for development- Nodemon for development

- PM2 for production deployment- PM2 for production deployment



## 📁 Project Structure## 📁 Project Structure



``````

PrepForge/PrepForge/

├── backend/                    # Node.js + Express backend├── frontend/           # React frontend application

│   ├── src/│   ├── src/

│   │   ├── controllers/       # Request handlers│   │   ├── components/ # Reusable components

│   │   ├── routes/            # API routes│   │   ├── pages/      # Page components

│   │   ├── services/          # Business logic (AI, email, socket)│   │   ├── services/   # API services

│   │   ├── middleware/        # Auth & error handling│   │   ├── hooks/      # Custom React hooks

│   │   ├── config/            # Database & configuration│   │   ├── contexts/   # React contexts

│   │   └── utils/             # Helper functions│   │   ├── utils/      # Utility functions

│   ├── prisma/                # Database schema & migrations│   │   └── types/      # TypeScript types

│   └── package.json│   └── public/

│├── backend/            # Express backend

├── frontend/                   # React + TypeScript frontend│   ├── src/

│   ├── src/│   │   ├── routes/     # API routes

│   │   ├── components/        # Reusable components (Chatbot, Layout)│   │   ├── controllers/# Route controllers

│   │   ├── pages/             # Page components│   │   ├── models/     # Database models

│   │   ├── services/          # API service (Axios)│   │   ├── services/   # Business logic

│   │   ├── store/             # State management (Zustand)│   │   ├── middleware/ # Express middleware

│   │   └── types/             # TypeScript interfaces│   │   ├── config/     # Configuration

│   └── package.json│   │   └── utils/      # Utility functions

││   └── tests/

└── README.md                   # This file└── README.md

``````



## 🚀 Getting Started## 🚀 Getting Started



### Prerequisites### Prerequisites



Before you begin, ensure you have installed:Before you begin, ensure you have installed:

- **Node.js 18+** - [Download here](https://nodejs.org/)- **Node.js 18+** - [Download here](https://nodejs.org/)

- **PostgreSQL 14+** - [Download here](https://www.postgresql.org/download/)- **PostgreSQL 14+** - [Download here](https://www.postgresql.org/download/)

- **Git** - [Download here](https://git-scm.com/)- **Git** - [Download here](https://git-scm.com/)



### Installation### Installation



1. **Clone the repository**1. **Clone the repository**

```bash```bash

git clone https://github.com/yourusername/prepforge.gitgit clone https://github.com/yourusername/prepforge.git

cd prepforgecd prepforge

``````



2. **Install dependencies**2. **Install dependencies**

```bash```bash

# Install backend dependencies# Install backend dependencies

cd backendcd backend

npm installnpm install



# Install frontend dependencies# Install frontend dependencies

cd ../frontendcd ../frontend

npm installnpm install

``````



3. **Setup database**3. **Setup database**



Create a PostgreSQL database:Create a PostgreSQL database:

```bash```bash

# Using psql# Using psql

psql -U postgrespsql -U postgres

CREATE DATABASE prepforge;CREATE DATABASE prepforge;

\q\q

``````



Or use the provided script:Or use the provided script:

```powershell```powershell

# Windows PowerShell# Windows PowerShell

.\setup-database.ps1.\setup-database.ps1

``````



4. **Configure environment variables**4. **Configure environment variables**



**Backend** - Create `backend/.env`:**Backend** - Create `backend/.env`:

```env```env

# Database# Database

DATABASE_URL="postgresql://postgres:password@localhost:5432/prepforge?schema=public"DATABASE_URL="postgresql://postgres:password@localhost:5432/prepforge?schema=public"



# JWT Secret (generate a strong random string)# JWT Secret (generate a strong random string)

SECRET_KEY="your-super-secret-jwt-key-change-this"SECRET_KEY="your-super-secret-jwt-key-change-this"



# AI APIs (at least one required for chatbot)# AI APIs (at least one required for chatbot)

GEMINI_API_KEY="your-gemini-api-key"GEMINI_API_KEY="your-gemini-api-key"

GROQ_API_KEY="your-groq-api-key"GROQ_API_KEY="your-groq-api-key"

OPENAI_API_KEY="your-openai-api-key"OPENAI_API_KEY="your-openai-api-key"



# Email (optional - for notifications)# Email (optional - for notifications)

EMAIL_HOST="smtp.gmail.com"EMAIL_HOST="smtp.gmail.com"

EMAIL_PORT=587EMAIL_PORT=587

EMAIL_USER="your-email@gmail.com"EMAIL_USER="your-email@gmail.com"

EMAIL_PASSWORD="your-app-password"EMAIL_PASSWORD="your-app-password"



# Server# Server

PORT=8000PORT=8000

NODE_ENV="development"NODE_ENV="development"

``````



**Frontend** - Create `frontend/.env`:**Frontend** - Create `frontend/.env`:

```env```env

VITE_API_URL=http://localhost:8000VITE_API_URL=http://localhost:8000

VITE_WS_URL=ws://localhost:8000VITE_WS_URL=ws://localhost:8000

``````



5. **Initialize database**5. **Initialize database**

```bash```bash

cd backendcd backend

npx prisma generatenpx prisma generate

npx prisma migrate deploynpx prisma migrate deploy

``````



6. **Start the application**6. **Start the application**



Open **two terminal windows**:Open **two terminal windows**:



**Terminal 1 - Backend:****Terminal 1 - Backend:**

```bash```bash

cd backendcd backend

npm run devnpm run dev

``````



**Terminal 2 - Frontend:****Terminal 2 - Frontend:**

```bash```bash

cd frontendcd frontend

npm run devnpm run dev

``````



7. **Access the application**7. **Access the application**



🎉 Open your browser and navigate to: **http://localhost:5173**🎉 Open your browser and navigate to: **http://localhost:5173**



### Default Test Accounts### Default Test Accounts



After setup, you can create accounts or use these test credentials (if seeded):After setup, you can create accounts or use these test credentials (if seeded):



| Role | Email | Password || Role | Email | Password |

|------|-------|----------||------|-------|----------|

| Candidate | candidate@test.com | password123 || Candidate | candidate@test.com | password123 |

| Interviewer | interviewer@test.com | password123 || Interviewer | interviewer@test.com | password123 |

| Admin | admin@test.com | password123 || Admin | admin@test.com | password123 |



## 📖 Usage Guide## 📝 API Documentation



### For CandidatesOnce the backend is running, visit:

- Swagger UI: `http://localhost:8000/docs`

1. **Register** as a Candidate- ReDoc: `http://localhost:8000/redoc`

2. **Practice with AI**: Go to "AI Interview" and select interview type

3. **Get Help**: Click the chatbot icon (💬) for 24/7 AI assistance## 🤝 Contributing

4. **Schedule Live Interviews**: Use "Schedule Interview" to request human interviewers

5. **Track Progress**: View your performance analytics on the dashboardContributions are welcome! Please feel free to submit a Pull Request.



### For Interviewers## � Contact



1. **Register** as an InterviewerFor questions, support, or collaboration:

2. **Accept Requests**: View and accept interview requests on "Interview Requests"- **Email:** prepforge563@gmail.com

3. **Conduct Interviews**: Join scheduled sessions via video call- **Phone:** +91 7232915352

4. **Provide Feedback**: Rate and review candidates after interviews

5. **Help Others**: Build your reputation by conducting quality interviews## �📄 License



## 🔑 API EndpointsThis project is licensed under the MIT License.



### Authentication## 🌟 Future Enhancements

- `POST /api/auth/register` - Register new user- Mobile application

- `POST /api/auth/login` - Login user- Interview scheduling system

- `GET /api/auth/me` - Get current user- Group interview support

- Advanced analytics with ML insights

### AI Interview- Interview marketplace

- `POST /api/ai-interview/start` - Start AI interview session
- `POST /api/ai-interview/submit` - Submit answer
- `GET /api/ai-interview/history` - Get interview history

### Live Interview
- `POST /api/live-interview/request` - Request interview
- `GET /api/live-interview/requests` - Get interview requests
- `POST /api/live-interview/accept/:id` - Accept interview request

### Chatbot (Candidates Only)
- `POST /api/chatbot` - Send message to AI chatbot

### User & Dashboard
- `GET /api/dashboard/stats` - Get user statistics
- `PUT /api/user/profile` - Update user profile

## 🐛 Troubleshooting

### Common Issues

**Database connection error:**
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `backend/.env`
- Ensure database exists: `psql -U postgres -l`

**Chatbot not responding:**
- Check if backend is running on port 8000
- Verify `GEMINI_API_KEY` is set in `backend/.env`
- Refresh browser after backend restart
- Check browser console for errors

**Port already in use:**
```bash
# Windows - Find and kill process
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Prisma migration errors:**
```bash
cd backend
npx prisma migrate reset  # Warning: This will delete all data
npx prisma migrate deploy
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact & Support

For questions, support, or collaboration:

- **Email**: prepforge563@gmail.com
- **Phone**: +91 7232915352

## 🌟 Roadmap

Future enhancements planned:
- [ ] Mobile application (React Native)
- [ ] Advanced analytics with ML insights
- [ ] Group interview support
- [ ] Interview marketplace for paid sessions
- [ ] Video recording and playback
- [ ] Code editor integration for technical interviews
- [ ] Multi-language support

## 🙏 Acknowledgments

- Google Gemini for AI capabilities
- React and Node.js communities
- All contributors and testers

---

**Built with ❤️ by the PrepForge Team**
