# Insilicology - Advanced Computational Biology Platform

A comprehensive Next.js platform for computational biology education and services, featuring live and recorded courses, user management, and administrative tools.

## 🚀 About

Insilicology is a leading computational biology platform that provides advanced molecular modeling, drug discovery, and bioinformatics services. The platform offers both live and recorded courses, comprehensive user management, and administrative tools for course and content management.

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase
- **CMS**: Sanity.io
- **Authentication**: Supabase Auth
- **UI Components**: Lucide React, React Hot Toast
- **File Upload**: React Dropzone
- **Date Handling**: Day.js

## 📁 Project Structure

```
insilicology.org/
├── app/                          # Next.js App Router
│   ├── (admin)/                  # Admin dashboard routes
│   │   ├── admin/                # Admin panel
│   │   │   ├── courses/          # Course management
│   │   │   ├── recordings/       # Recording management
│   │   │   ├── resources/        # Resource management
│   │   │   └── users/            # User management
│   │   └── layout.tsx
│   ├── (auth)/                   # Authentication routes
│   │   ├── auth/                 # Auth callbacks
│   │   ├── login/                # Login page
│   │   ├── signup/               # Signup page
│   │   └── layout.tsx
│   ├── (dashboard)/              # User dashboard routes
│   │   ├── dashboard/            # User dashboard
│   │   │   ├── account/          # Account management
│   │   │   ├── my-courses/       # User's courses
│   │   │   ├── payments/         # Payment history
│   │   │   ├── recordings/       # User recordings
│   │   │   └── resources/        # User resources
│   │   └── layout.tsx
│   ├── (public)/                 # Public routes
│   │   ├── (legal)/              # Legal pages
│   │   ├── blog/                 # Blog section
│   │   ├── contact/              # Contact page
│   │   ├── courses/              # Course listings
│   │   ├── enroll/               # Enrollment pages
│   │   └── layout.tsx
│   ├── api/                      # API routes
│   └── studio/                   # Sanity Studio
├── components/                   # React components
│   ├── admin/                    # Admin components
│   ├── blog/                     # Blog components
│   ├── courses/                  # Course components
│   ├── dashboard/                # Dashboard components
│   ├── home/                     # Homepage components
│   └── ui/                       # UI components
├── lib/                          # Utility libraries
│   └── supabase/                 # Supabase utilities
├── sanity/                       # Sanity CMS configuration
├── types/                        # TypeScript type definitions
└── utils/                        # Utility functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Supabase account
- Sanity.io account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd insilicology.org
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up environment variables:
Create a `.env.local` file with the following variables:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_api_token
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Key Features

### Public Features
- **Homepage**: Hero section, services overview, statistics, and FAQ
- **Course Catalog**: Live and recorded courses with detailed information
- **Blog**: Content management with Sanity CMS
- **Contact Form**: User inquiry submission
- **Legal Pages**: Privacy policy, terms, and refund policy

### User Dashboard
- **Account Management**: Profile editing and settings
- **My Courses**: Access to enrolled courses (live and recorded)
- **Payment History**: Transaction records
- **Resources**: Downloadable course materials
- **Support**: Help and support system

### Admin Panel
- **Course Management**: Create, edit, and manage courses
- **User Management**: View and manage user accounts
- **Recording Management**: Handle course recordings
- **Resource Management**: Upload and manage course resources
- **Analytics**: Platform usage statistics

### Authentication
- **Login/Signup**: User registration and authentication
- **OAuth Integration**: Social login options
- **Session Management**: Secure session handling

## 🎨 Styling

The project uses Tailwind CSS 4 for styling with a custom design system featuring:
- Amber color scheme for branding
- Responsive design for all devices
- Modern UI components
- Smooth animations and transitions

## 📊 Database Schema

The application uses Supabase with the following main tables:
- `users` - User accounts and profiles
- `courses` - Course information and metadata
- `user_courses` - User enrollment relationships
- `recordings` - Course recording data
- `payments` - Payment transaction records

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Structure

- **TypeScript**: Full type safety throughout the application
- **Component Architecture**: Modular, reusable components
- **API Routes**: Server-side API endpoints
- **Middleware**: Authentication and routing middleware

## 🚀 Deployment

The application is optimized for deployment on Vercel:

1. Connect your repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 🤝 Development Partner

This project was developed by **[Oimi Web Agency](https://agency.oimi.io)** - a leading web development agency specializing in modern web applications and digital solutions.

**Oimi Web Agency Services:**
- Custom web application development
- E-commerce solutions
- CMS integration
- API development
- UI/UX design
- Digital transformation

## 📄 License

This project is private and proprietary. All rights reserved.

## 📞 Support

For technical support or questions about this project, please contact:
- **Oimi Web Agency**: [agency.oimi.io](https://agency.oimi.io)
- **Insilicology**: [insilicology.org](https://insilicology.org)
