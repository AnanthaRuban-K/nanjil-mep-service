# 🔌 நாஞ்சில் MEP சேவை (Nanjil MEP Service)

> **Tamil MEP (Mechanical, Electrical, Plumbing) Service Booking Platform**

A simplified service booking application for electrical and plumbing services in Tamil Nadu, built with Next.js frontend and Hono backend.

## 🎯 Features

- ✅ **Bilingual Support**: Tamil and English interface
- ✅ **Service Booking**: Electrical and plumbing services
- ✅ **Emergency Services**: 24/7 priority booking
- ✅ **Admin Dashboard**: Booking management system
- ✅ **Mobile-First**: Responsive design for mobile users
- ✅ **Cash Payment**: Simple payment model
- ✅ **Real-time Status**: Booking status tracking

## 🏗️ Tech Stack

### Frontend (Port 3100)
- **Framework**: Next.js 14 with App Router
- **Styling**: TailwindCSS with Tamil font support
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Authentication**: Clerk
- **API Client**: Axios + React Query

### Backend (Port 3101)
- **Framework**: Hono (Fast web framework)
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod schemas
- **Authentication**: Clerk backend integration
- **Deployment**: Docker ready

### Infrastructure
- **Monorepo**: Nx workspace
- **Database**: Neon PostgreSQL
- **Deployment**: Coolify on Hostinger
- **Containerization**: Docker & Docker Compose

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL database (Neon recommended)
- Clerk account for authentication

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/nanjil-mep-service.git
cd nanjil-mep-service

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your actual values

# Setup database
npm run db:migrate
npm run db:seed

# Start development servers
npm run dev
# Frontend: http://localhost:3100
# Backend: http://localhost:3101
```

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3101
```

## 📁 Project Structure

```
nanjil-mep-service/
├── apps/
│   ├── frontend/          # Next.js app (Port 3100)
│   │   ├── src/app/       # App Router pages
│   │   ├── src/components/# React components
│   │   ├── src/stores/    # Zustand stores
│   │   └── src/utils/     # Utilities
│   └── backend/           # Hono API (Port 3101)
│       ├── src/db/        # Database schema & connection
│       ├── src/routes/    # API routes
│       └── src/services/  # Business logic
├── libs/shared/           # Shared libraries
├── docker-compose.yml     # Development environment
└── package.json          # Monorepo configuration
```

## 🔄 Development Workflow

### Available Scripts

```bash
# Development
npm run dev              # Start both frontend & backend
npm run dev:frontend     # Start only frontend (3100)
npm run dev:backend      # Start only backend (3101)

# Building
npm run build            # Build both apps
npm run build:frontend   # Build frontend only
npm run build:backend    # Build backend only

# Database
npm run db:generate      # Generate database migrations
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database with initial data
npm run db:studio        # Open Drizzle Studio

# Testing & Quality
npm run lint             # Lint all projects
npm run test             # Run tests
npm run type-check       # TypeScript type checking
```

## 🌐 API Endpoints

### Customer Endpoints
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `POST /api/bookings/:id/feedback` - Submit feedback

### Admin Endpoints
- `GET /api/admin/dashboard` - Dashboard metrics
- `GET /api/admin/bookings` - All bookings
- `PUT /api/admin/bookings/:id/status` - Update booking status

## 🔐 Authentication

This project uses [Clerk](https://clerk.com/) for authentication:

1. **Customer Authentication**: Simple sign-up/sign-in
2. **Admin Authentication**: Role-based access control
3. **Session Management**: Handled by Clerk

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build individual services
docker build -f Dockerfile.frontend -t nanjil-frontend .
docker build -f Dockerfile.backend -t nanjil-backend .
```

### Production Deployment (Coolify)
1. Push code to GitHub
2. Configure Coolify with your repository
3. Set environment variables
4. Deploy!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 📱 Usage

### For Customers:
1. Visit the website
2. Select service type (Electrical/Plumbing)
3. Describe the problem
4. Provide contact details
5. Choose preferred time
6. Confirm booking
7. Receive booking confirmation

### For Admins:
1. Login to admin panel
2. View dashboard metrics
3. Manage bookings
4. Update job status
5. View simple reports

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commit messages
- Add tests for new features
- Ensure mobile responsiveness
- Support both Tamil and English

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Wiki](https://github.com/yourusername/nanjil-mep-service/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/nanjil-mep-service/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/nanjil-mep-service/discussions)

## 🙏 Acknowledgments

- Built for Tamil-speaking communities in rural areas
- Inspired by the need for accessible service booking
- Special thanks to the open-source community

---

**நன்றி! (Thank you!)** for using Nanjil MEP Service 🙏