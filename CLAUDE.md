# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack SaaS web application called "Calcolatore Tassa di Soggiorno - Comuni Italiani 2025" (Tourist Tax Calculator for Italian Municipalities 2025). It's a specialized tool for calculating tourist taxes for accommodation facilities across Italian municipalities according to 2025 municipal regulations.

**Architecture**: React frontend + Node.js/Express backend + SQLite database

### Key Features
- **Multi-Municipality Support**: Comprehensive database of Italian municipalities with specific tax rules (Rome, Milan, Florence, Venice, Naples, Bologna, etc.)
- **Smart File Processing**: Excel/CSV file processing for booking data from platforms like Booking.com, Airbnb with flexible column mapping
- **Dynamic Tax Calculation**: Municipality-specific rates, exemption ages, maximum taxable nights, and seasonal pricing
- **Advanced Analytics**: Multi-month booking support, geographic analysis of guests by country, monthly compliance reporting
- **Export Capabilities**: GECOS portal integration, CSV/PDF export functionality with proper encoding
- **User Authentication**: JWT-based authentication system with registration, login, password reset
- **Admin Panel**: User management dashboard for administrators
- **Modern UI**: Dark/light mode toggle, fully responsive design optimized for desktop/tablet/mobile, landing page, legal pages
- **Data Persistence**: SQLite database for user data, localStorage for preferences and manual exemptions

## Development Commands

### Frontend
```bash
# Start development server with hot reload (port 3000)
npm start

# Build optimized production version
npm run build

# Run tests (uses Create React App test runner with Jest)
npm test

# Run tests once and exit (for CI/CD)
npm test -- --watchAll=false

# Run specific test by name pattern
npm test -- --testNamePattern="specific test name"
```

### Backend
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Start development server with auto-reload (port 3001)
npm run dev

# Start production server
npm start
```

### Full-Stack Development
Run both frontend and backend simultaneously in separate terminals:
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
npm start
```

## Architecture Overview

### Full-Stack Architecture
The application is split into two main parts:

**Frontend** (`/src`): React SPA that handles UI, file processing, and tax calculations
**Backend** (`/server`): Node.js/Express API that handles authentication, user management, and data persistence

### Frontend Architecture

#### Component Architecture
- **App.js**: Root component with React Router, authentication flow, and theme management
- **LandingPage**: Public homepage with feature showcase
- **LoginPage**: Authentication interface with login and registration
- **ResetPassword**: Password reset flow
- **PrivateRoute**: Route guard for authenticated pages
- **AdminPage**: User management dashboard (admin-only)
- **Header**: Navigation and user controls
- **FileUpload**: File upload and validation
- **BookingsTable**: Data table with pagination
- **ResultsCards**: Analytics dashboard
- **Legal Components**: PrivacyPolicy, TermsOfService, CookiePolicy

#### Core Business Logic (useBookingProcessor Hook)
The `useBookingProcessor` custom hook (src/hooks/useBookingProcessor.js) handles all tax calculation logic:

- **File Processing**: Flexible parsing of Excel (.xlsx/.xls) and CSV files with intelligent column mapping
- **Municipality-Aware Tax Calculation**:
  - Dynamic rules based on selected municipality (via `getRegolaComune()` function)
  - Municipality-specific maximum taxable nights (varies by location)
  - Age-based exemptions (configurable per municipality)
  - Seasonal rate support for applicable municipalities (high/low season)
  - Manual exemption system with localStorage persistence
- **Data Transformation**: Maps various input formats (Booking.com exports, custom CSV) to internal structure
- **Monthly Analysis**: Splits bookings across months for GECOS portal reporting
- **Export Functionality**: CSV and PDF export of processed results with municipality-specific formatting

### Backend Architecture

#### Server Structure (`/server/server.js`)
Express API with the following features:

**Security Middleware**:
- Helmet for security headers
- CORS configured for specific frontend origin
- Rate limiting (global: 100 req/15min, auth: 5 req/15min)
- JWT token authentication
- Express Validator for input validation

**Database**: SQLite with tables:
- `users`: User accounts with email, hashed passwords, roles
- `password_resets`: Temporary tokens for password reset flow

**API Endpoints**:
- `POST /api/register`: User registration with email verification
- `POST /api/login`: User login returning JWT token
- `POST /api/reset-password-request`: Request password reset email
- `POST /api/reset-password`: Complete password reset with token
- `GET /api/users`: Get all users (admin only)
- `DELETE /api/users/:id`: Delete user (admin only)

**Email Service** (`/server/config/email.js`):
- Nodemailer integration for welcome and password reset emails
- Configurable SMTP settings via environment variables

### API Service Layer (`src/services/api.js`)
Frontend service that handles all backend communication:
- Authentication APIs (register, login, logout)
- User management APIs (getUsers, deleteUser)
- Token management in localStorage
- Centralized error handling
- Auth header injection

### Key Libraries & Dependencies

**Frontend**:
- **React**: Core framework (`^18.2.0`) with Create React App (`5.0.1`)
- **React Router DOM**: Client-side routing (`^7.9.3`)
- **XLSX**: Excel file processing (`^0.18.5`)
- **Papa Parse**: CSV file processing (`^5.4.1`)
- **D3**: Data visualization for country statistics (`^7.8.5`)
- **jsPDF**: PDF generation (`^3.0.1`) with jsPDF-AutoTable (`^5.0.2`)
- **Lodash**: Utility functions (`^4.17.21`)
- **Math.js**: Mathematical calculations (`^11.11.0`)
- **Lucide React**: Modern icon library (`^0.263.1`)
- **Heroicons React**: Additional icon library (`^2.2.0`)
- **Tailwind CSS**: Utility-first styling framework (`^3.4.1`)

**Backend**:
- **Express**: Web framework (`^4.18.2`)
- **SQLite3**: Database (`^5.1.6`)
- **bcryptjs**: Password hashing (`^2.4.3`)
- **jsonwebtoken**: JWT authentication (`^9.0.2`)
- **express-validator**: Input validation (`^7.0.1`)
- **express-rate-limit**: Rate limiting (`^8.1.0`)
- **helmet**: Security headers (`^8.1.0`)
- **cors**: CORS middleware (`^2.8.5`)
- **nodemailer**: Email service (`^7.0.7`)
- **dotenv**: Environment variables (`^16.3.1`)

### State Management Pattern
- React hooks (`useState`, `useEffect`) for local state management
- `localStorage` for JWT tokens, theme preferences, and manual exemptions
- Custom hook pattern (`useBookingProcessor`) for complex business logic encapsulation
- API calls centralized in `services/api.js`

### Data Flow Architecture
1. **Authentication**: User registers/logs in via `LoginPage` → Backend validates → JWT token returned → Stored in localStorage
2. **Protected Routes**: `PrivateRoute` checks token validity before rendering calculator
3. **File Upload**: User uploads Excel/CSV file via `FileUpload` component
4. **Processing**: `useBookingProcessor` hook parses and transforms data (client-side)
5. **Calculation**: Tax calculations applied based on business rules (client-side)
6. **Display**: Results shown in `ResultsCards` and `BookingsTable` components
7. **Export**: Processed data exported as CSV/PDF for GECOS portal submission

## Municipality Database (`comuniItaliani.js`)

The application includes a comprehensive database of Italian municipalities with their specific tourist tax regulations (src/data/comuniItaliani.js):

### Municipality Data Structure
Each municipality entry includes:
- `nome_comune`: Municipality name
- `regione`: Italian region
- `tariffa_min`, `tariffa_max`, `tariffa_default`: Tax rate ranges
- `esenzione_eta`: Age below which guests are exempt
- `max_notti_tassabili`: Maximum taxable nights per booking
- `ha_stagionalita`: Boolean for seasonal rate support
- `tariffa_alta_stagione`, `tariffa_bassa_stagione`: Seasonal rates
- `periodo_alta_stagione`: High season date ranges
- `note`: Additional municipality-specific information

### Key Functions
- `getTuttiComuni()`: Returns array of all municipalities for dropdown
- `getTariffaPerComune(comune)`: Gets default tax rate for municipality
- `isAltaStagione(date, comune)`: Determines if date falls in high season

## File Processing Details

### Supported File Formats
- **Excel**: `.xlsx`, `.xls` files processed via XLSX library
- **CSV**: Standard CSV files with automatic delimiter detection

### Column Mapping Strategy
The application uses flexible column mapping to handle various export formats:

**Excel Mapping** (`mapExcelData` function in useBookingProcessor.js):
- Guest names: `'Booker'`, `'Nome'`, `'Guest Name'`
- Guest count: `'Persone'`, `'Ospiti'`, `'Adults'`, `'Total Guests'`
- Children: `'Bambini'`, `'Children'`
- Country: `'Booker country'`, `'Paese'`, `'Country'`
- Dates: `'Arrivo'`, `'Check-in'` / `'Partenza'`, `'Check-out'`

**CSV Mapping** (`mapCsvData` function):
- Similar mapping with additional flexibility for custom formats

### Business Rules Implementation
- **Dynamic Municipality Rules**: Tax rules are municipality-specific via `comuniItaliani.js` database
- **Configurable Tax Limits**: Each municipality has its own maximum taxable nights and age exemptions
- **Seasonal Rates**: Some municipalities support high/low season pricing (e.g., Florence, Venice)
- **Status Mapping**: Handles cancellations and no-shows
- **Date Formatting**: Robust date parsing for various formats including Excel serial dates

## Environment Variables

### Frontend (`.env.local`)
```env
REACT_APP_API_URL=http://localhost:3001/api
```

### Backend (`server/.env`)
```env
# Required
JWT_SECRET=<64-character-random-string>
ADMIN_EMAILS=admin@example.com,another@admin.com
NODE_ENV=development|production
FRONTEND_URL=http://localhost:3000

# Optional (Email service)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=app-specific-password
EMAIL_FROM=noreply@tassasoggiorno.it
```

**Generate JWT_SECRET**:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Authentication System

### Flow
1. **Registration**: User provides email, password → Backend hashes password → User saved to database → Welcome email sent → JWT token returned
2. **Login**: User provides credentials → Backend validates → JWT token returned
3. **Password Reset**: User requests reset → Token generated and emailed → User submits new password with token → Password updated
4. **Authorization**: Frontend includes JWT token in Authorization header for protected routes

### Admin System
- Users with emails listed in `ADMIN_EMAILS` environment variable have admin privileges
- Admin users can access `/admin` route to view and delete users
- Admin status is checked server-side on protected endpoints

### Token Storage
- JWT tokens stored in `localStorage` under key `authToken`
- User data stored in `localStorage` under key `user`
- Tokens automatically included in API requests via `api.js` service

## Project Structure

```
/
├── src/                          # Frontend React application
│   ├── App.js                    # Root component with routing
│   ├── index.js                  # App entry point
│   ├── hooks/
│   │   └── useBookingProcessor.js # Core business logic for tax calculations
│   ├── components/               # UI components
│   │   ├── LandingPage.js        # Public homepage
│   │   ├── LoginPage.js          # Authentication UI
│   │   ├── ResetPassword.js      # Password reset flow
│   │   ├── PrivateRoute.js       # Route guard component
│   │   ├── AdminPage.js          # User management dashboard
│   │   ├── Header.js             # Navigation bar
│   │   ├── FileUpload.js         # File upload component
│   │   ├── BookingsTable.js      # Data table with pagination
│   │   ├── ResultsCards.js       # Analytics cards
│   │   ├── ConfigPanel.js        # Municipality selection
│   │   ├── GuidaGECOS.js         # GECOS guide
│   │   ├── GuidePage.js          # Help modal
│   │   ├── InfoFooter.js         # Footer
│   │   ├── CookieBanner.js       # Cookie consent
│   │   ├── PrivacyPolicy.js      # Privacy policy page
│   │   ├── TermsOfService.js     # Terms of service page
│   │   └── CookiePolicy.js       # Cookie policy page
│   ├── services/
│   │   └── api.js                # Backend API service layer
│   └── data/
│       └── comuniItaliani.js     # Municipality database
├── server/                       # Backend Node.js API
│   ├── server.js                 # Express server with all routes
│   ├── config/
│   │   └── email.js              # Email service configuration
│   ├── package.json              # Backend dependencies
│   ├── .env.example              # Environment variables template
│   └── database.sqlite           # SQLite database (created at runtime)
├── public/                       # Static assets
├── build/                        # Production build output
├── package.json                  # Frontend dependencies
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
├── .env.local                    # Frontend environment variables
├── .env.example                  # Frontend env template
├── README.md                     # Project documentation
└── DEPLOYMENT.md                 # Deployment guide
```

## Important Constants & Functions

### Core Business Logic
- **Dynamic Rules**: Tax rules retrieved via `getRegolaComune()` function (useBookingProcessor.js:25)
- **Municipality Database**: Complete Italian municipalities data in `comuniItaliani.js` with specific regulations
- **File Processing**: Flexible column mapping for Excel/CSV files from various booking platforms
- **Tax Calculation**: Municipality-specific rates with seasonal support and age-based exemptions

### Key Configuration Points
- **Backend API URL**: Configured via `REACT_APP_API_URL` environment variable (defaults to http://localhost:3001/api)
- **Admin Emails**: Configured via `ADMIN_EMAILS` environment variable in backend (comma-separated list)
- **Municipality Rules**: Each municipality has unique tax rates, maximum nights, and exemption ages:
  - Rome: 10 nights max, €6.00 rate, under-10 exemption
  - Milan: 14 nights max, €3.00 rate, under-10 exemption
  - Florence: 7 nights max, €4.50 rate, under-12 exemption, seasonal rates
  - Venice: 5 nights max, €4.00 rate, under-10 exemption, seasonal rates
- **Data Persistence**: Manual exemptions and preferences via localStorage (client-side only)
- **Export Formats**: CSV with UTF-8 encoding and Italian separators, PDF with municipality headers

### Security & Privacy Notes
- **File Processing**: All tax calculation and file processing happens in browser, no file uploads to server
- **Authentication**: JWT-based with secure password hashing (bcrypt)
- **Rate Limiting**: API endpoints protected with rate limiters to prevent abuse
- **CORS**: Backend configured to only accept requests from specified frontend URL
- **Database**: User data persisted in SQLite database (server-side)
- **Secrets**: JWT_SECRET and email credentials stored in environment variables, never committed to git

## Development Notes

### Adding New Municipalities
To add a new municipality, edit `src/data/comuniItaliani.js`:

```javascript
"NomeCittà": {
  nome_comune: "Nome Città",
  regione: "Nome Regione",
  tariffa_min: 1.00,
  tariffa_max: 10.00,
  tariffa_default: 4.50,
  esenzione_eta: 12,
  max_notti_tassabili: 7,
  ha_stagionalita: true, // optional
  tariffa_alta_stagione: 6.00, // if stagionalità
  tariffa_bassa_stagione: 3.00,
  periodo_alta_stagione: "2025-06-01 to 2025-09-30",
  note: "Additional information"
}
```

### Database Schema
The SQLite database (`server/database.sqlite`) is automatically created on first run with:

**users table**:
- `id`: INTEGER PRIMARY KEY AUTOINCREMENT
- `email`: TEXT UNIQUE NOT NULL
- `password`: TEXT NOT NULL (bcrypt hashed)
- `nome`: TEXT
- `cognome`: TEXT
- `azienda`: TEXT
- `telefono`: TEXT
- `created_at`: DATETIME DEFAULT CURRENT_TIMESTAMP

**password_resets table**:
- `id`: INTEGER PRIMARY KEY AUTOINCREMENT
- `email`: TEXT NOT NULL
- `token`: TEXT UNIQUE NOT NULL
- `expires_at`: DATETIME NOT NULL
- `used`: INTEGER DEFAULT 0

### Common Development Tasks

**Testing Backend API**:
```bash
# Health check
curl http://localhost:3001/health

# Register user
curl -X POST http://localhost:3001/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","nome":"Test"}'
```

**Debugging Authentication Issues**:
1. Check browser localStorage for `authToken` and `user` keys
2. Verify backend `.env` file has correct `JWT_SECRET` and `ADMIN_EMAILS`
3. Check backend console for authentication errors
4. Verify `REACT_APP_API_URL` points to correct backend URL

**Clearing All Data**:
```bash
# Clear frontend data
# In browser console: localStorage.clear()

# Clear backend database
cd server && rm database.sqlite
# Database will be recreated on next server start
```

## Deployment

See `DEPLOYMENT.md` for comprehensive deployment instructions. Key points:

- **Frontend**: Deploy to Vercel, Netlify, or any static host (build output in `/build`)
- **Backend**: Deploy to Render, Railway, or VPS (requires Node.js 18+)
- **Database**: SQLite file persists on backend server (backup regularly)
- **Environment Variables**: Must be configured in hosting platform for both frontend and backend
