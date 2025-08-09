# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based web application called "Calcolatore Tassa di Soggiorno Roma 2025" (Tourist Tax Calculator for Rome 2025). It's a specialized tool for calculating tourist taxes for accommodation facilities in Rome according to 2025 municipal regulations.

### Key Features
- Excel/CSV file processing for booking data from platforms like Booking.com
- Automatic tourist tax calculation with configurable rates
- Multi-month booking support with proper splitting across periods
- Geographic analysis of guests by country
- GECOS portal integration for tax reporting
- Monthly reporting for compliance
- Dark/light mode toggle
- Authentication system

## Development Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests (uses Create React App test runner)
npm test

# Run a single test file
npm test -- --testNamePattern="specific test name"

# Run tests in watch mode (default)
npm test

# Run tests once and exit
npm test -- --watchAll=false

# Eject from Create React App (irreversible)
npm run eject
```

## Architecture Overview

### Component Architecture
The application follows a modern React pattern with a main component (`TassaSoggiornoCalculator` in `App.js`) that orchestrates the entire application flow:

- **TassaSoggiornoCalculator**: Root component handling authentication, theme management, and overall application state
- **LoginScreen**: Authentication component with hardcoded credentials (admin/gecos2024)
- **useBookingProcessor**: Custom hook containing all core business logic for file processing and calculations
- **Component Library**: Modular components in `/src/components/` for specific UI sections

### Core Business Logic (useBookingProcessor Hook)
The heart of the application is the `useBookingProcessor` custom hook which handles:

- **File Processing**: Flexible parsing of Excel (.xlsx/.xls) and CSV files with intelligent column mapping
- **Tourist Tax Calculation**: 
  - Max 10 taxable nights per booking
  - Children under 10 are exempted from tax
  - Configurable tax rates (default €6.00)
- **Data Transformation**: Maps various input formats (Booking.com exports, custom CSV) to internal structure
- **Monthly Analysis**: Splits bookings across months for GECOS portal reporting
- **Export Functionality**: CSV export of processed results

### Key Libraries & Dependencies
- **XLSX**: Excel file processing (`^0.18.5`)
- **Papa Parse**: CSV file processing (`^5.4.1`)
- **D3**: Data visualization for country statistics (`^7.8.5`)
- **Lodash**: Utility functions (`^4.17.21`)
- **Math.js**: Mathematical calculations (`^11.11.0`)
- **Lucide React**: Icon library (`^0.263.1`)
- **React**: Core framework (`^18.2.0`) with Create React App (`5.0.1`)
- **Web Vitals**: Performance monitoring (`^5.0.3`)

### Styling & UI
- **Tailwind CSS**: Primary styling framework (`^3.4.1`)
- **PostCSS**: CSS processing with autoprefixer
- Fully responsive design with comprehensive dark mode support
- Custom color schemes and animations

### State Management Pattern
- React hooks (`useState`, `useEffect`) for local state management
- `localStorage` for persistence of authentication and theme preferences
- Custom hook pattern (`useBookingProcessor`) for complex business logic encapsulation
- No external state management library (Redux, Zustand, etc.)

### Data Flow Architecture
1. **Authentication**: User authenticates via `LoginScreen` component
2. **File Upload**: User uploads Excel/CSV file via `FileUpload` component
3. **Processing**: `useBookingProcessor` hook parses and transforms data
4. **Calculation**: Tax calculations applied based on business rules
5. **Display**: Results shown in `ResultsCards` and `BookingsTable` components
6. **Export**: Processed data exported as CSV for GECOS portal submission

## File Processing Details

### Supported File Formats
- **Excel**: `.xlsx`, `.xls` files processed via XLSX library
- **CSV**: Standard CSV files with automatic delimiter detection

### Column Mapping Strategy
The application uses flexible column mapping to handle various export formats:

**Excel Mapping** (`mapExcelData` function):
- Guest names: `'Booker'`, `'Nome'`, `'Guest Name'`
- Guest count: `'Persone'`, `'Ospiti'`, `'Adults'`, `'Total Guests'`
- Children: `'Bambini'`, `'Children'`
- Country: `'Booker country'`, `'Paese'`, `'Country'`
- Dates: `'Arrivo'`, `'Check-in'` / `'Partenza'`, `'Check-out'`

**CSV Mapping** (`mapCsvData` function):
- Similar mapping with additional flexibility for custom formats

### Business Rules Implementation
- **MAX_NOTTI_TASSABILI**: 10 nights maximum per booking
- **ETA_ESENZIONE_BAMBINI**: Children under 10 exempted
- **Status Mapping**: Handles cancellations and no-shows
- **Date Formatting**: Robust date parsing for various formats including Excel serial dates

## Development Notes

### Authentication System
- Hardcoded credentials: `admin` / `gecos2024` (should be externalized for production)
- Session persistence via `localStorage`
- Simple boolean authentication state

### Component Structure Considerations
- Main logic concentrated in single `App.js` file and `useBookingProcessor` hook
- Could benefit from further component decomposition for maintainability
- Business logic properly separated into custom hook

### Project Structure
```
src/
├── App.js                 # Main component with authentication and theme logic
├── hooks/
│   └── useBookingProcessor.js  # Core business logic hook
├── components/            # UI components
│   ├── BookingsTable.js
│   ├── ConfigPanel.js
│   ├── FileUpload.js
│   ├── GuidaGECOS.js
│   ├── Header.js
│   ├── InfoFooter.js
│   ├── LoginScreen.js
│   └── ResultsCards.js
└── index.js              # App entry point
```

### Configuration Files
- `tailwind.config.js`: Standard Tailwind configuration for React
- `postcss.config.js`: PostCSS with Tailwind and Autoprefixer
- Standard Create React App structure maintained

## Important Constants
- **MAX_NOTTI_TASSABILI**: 10 nights maximum per booking (in useBookingProcessor.js:16)
- **ETA_ESENZIONE_BAMBINI**: Children under 10 exempted (in useBookingProcessor.js:17)
- **Default tax rate**: €6.00 per night per adult guest
- **Authentication credentials**: admin/gecos2024 (hardcoded in LoginScreen component)