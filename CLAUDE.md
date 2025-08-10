# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based web application called "Calcolatore Tassa di Soggiorno - Comuni Italiani 2025" (Tourist Tax Calculator for Italian Municipalities 2025). It's a specialized tool for calculating tourist taxes for accommodation facilities across Italian municipalities according to 2025 municipal regulations.

### Key Features
- **Multi-Municipality Support**: Comprehensive database of Italian municipalities with specific tax rules (Rome, Milan, Florence, Venice, Naples, Bologna, etc.)
- **Smart File Processing**: Excel/CSV file processing for booking data from platforms like Booking.com, Airbnb with flexible column mapping
- **Dynamic Tax Calculation**: Municipality-specific rates, exemption ages, maximum taxable nights, and seasonal pricing
- **Advanced Analytics**: Multi-month booking support, geographic analysis of guests by country, monthly compliance reporting
- **Export Capabilities**: GECOS portal integration, CSV/PDF export functionality with proper encoding
- **Modern UI**: Dark/light mode toggle, fully responsive design optimized for desktop/tablet/mobile, integrated help system
- **Data Persistence**: Authentication system, manual exemptions, user preferences via localStorage

## Development Commands

```bash
# Start development server with hot reload
npm start

# Build optimized production version
npm run build

# Run tests (uses Create React App test runner with Jest)
npm test

# Run tests in watch mode (default behavior)
npm test

# Run tests once and exit (for CI/CD)
npm test -- --watchAll=false

# Run specific test by name pattern
npm test -- --testNamePattern="specific test name"

# Eject from Create React App (irreversible - exposes webpack config)
npm run eject
```

## Architecture Overview

### Component Architecture
The application follows a modern React pattern with a main component (`TassaSoggiornoCalculator` in `App.js`) that orchestrates the entire application flow:

- **TassaSoggiornoCalculator**: Root component handling authentication, theme management, and overall application state
- **LoginScreen**: Authentication component with hardcoded credentials (admin/gecos2024)
- **useBookingProcessor**: Custom hook containing all core business logic for file processing and calculations
- **Component Library**: Modular components in `/src/components/` for specific UI sections
- **GuidePage**: Integrated help system with step-by-step user guide modal

### Core Business Logic (useBookingProcessor Hook)
The heart of the application is the `useBookingProcessor` custom hook which handles:

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

### Key Libraries & Dependencies
- **React**: Core framework (`^18.2.0`) with Create React App (`5.0.1`)
- **XLSX**: Excel file processing (`^0.18.5`)
- **Papa Parse**: CSV file processing (`^5.4.1`)
- **D3**: Data visualization for country statistics (`^7.8.5`)
- **jsPDF**: PDF generation (`^3.0.1`) with jsPDF-AutoTable (`^5.0.2`)
- **Lodash**: Utility functions (`^4.17.21`)
- **Math.js**: Mathematical calculations (`^11.11.0`)
- **Lucide React**: Modern icon library (`^0.263.1`)
- **Heroicons React**: Additional icon library (`^2.2.0`)
- **Tailwind CSS**: Utility-first styling framework (`^3.4.1`)
- **Web Vitals**: Performance monitoring (`^5.0.3`)

### Styling & UI
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **PostCSS**: CSS processing with autoprefixer and Tailwind integration
- **Responsive Design**: Mobile-first approach optimized for desktop, tablet, and mobile
- **Dark Mode**: Complete light/dark theme toggle with user preference persistence
- **Icons**: Lucide React and Heroicons for consistent iconography

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

## Municipality Database (`comuniItaliani.js`)

The application includes a comprehensive database of Italian municipalities with their specific tourist tax regulations:

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

**Excel Mapping** (`mapExcelData` function):
- Guest names: `'Booker'`, `'Nome'`, `'Guest Name'`
- Guest count: `'Persone'`, `'Ospiti'`, `'Adults'`, `'Total Guests'`
- Children: `'Bambini'`, `'Children'`
- Country: `'Booker country'`, `'Paese'`, `'Country'`
- Dates: `'Arrivo'`, `'Check-in'` / `'Partenza'`, `'Check-out'`

**CSV Mapping** (`mapCsvData` function):
- Similar mapping with additional flexibility for custom formats

### Business Rules Implementation
- **Dynamic Municipality Rules**: Tax rules are now municipality-specific via `comuniItaliani.js` database
- **Configurable Tax Limits**: Each municipality has its own maximum taxable nights and age exemptions
- **Seasonal Rates**: Some municipalities support high/low season pricing (e.g., Florence)
- **Status Mapping**: Handles cancellations and no-shows
- **Date Formatting**: Robust date parsing for various formats including Excel serial dates

## Development Notes

### Municipality System Architecture
- **comuniItaliani.js**: Comprehensive database of Italian municipalities with specific tax rules
- **Dynamic Configuration**: Tax rates, exemption ages, and maximum nights are municipality-specific
- **Extensible Design**: Easy to add new municipalities with custom rules
- Current municipalities include Rome, Milan, Florence, Venice, Naples, Bologna, and others

### Authentication System  
- Hardcoded credentials: `admin` / `gecos2024` (should be externalized for production)
- Session persistence via `localStorage`
- Simple boolean authentication state

### Component Structure Considerations
- Main logic concentrated in single `App.js` file and `useBookingProcessor` hook
- Municipality selection integrated into main workflow (Step 1)
- Business logic properly separated into custom hook with municipality awareness
- Manual exemptions system with localStorage persistence

### Project Structure
```
src/
├── App.js                 # Main component with authentication and theme logic
├── hooks/
│   └── useBookingProcessor.js  # Core business logic hook with municipality support
├── components/            # UI components
│   ├── BookingsTable.js
│   ├── ConfigPanel.js
│   ├── FileUpload.js
│   ├── GuidaGECOS.js
│   ├── GuidePage.js       # Integrated user guide modal
│   ├── Header.js
│   ├── InfoFooter.js
│   ├── LoginScreen.js
│   └── ResultsCards.js
├── data/
│   └── comuniItaliani.js  # Municipality database with tax rules
└── index.js              # App entry point
```

### Configuration Files
- `tailwind.config.js`: Standard Tailwind configuration for React
- `postcss.config.js`: PostCSS with Tailwind and Autoprefixer  
- Standard Create React App structure maintained

## Important Constants & Functions

### Core Business Logic
- **Dynamic Rules**: Tax rules retrieved via `getRegolaComune()` function (useBookingProcessor.js:25)
- **Municipality Database**: Complete Italian municipalities data in `comuniItaliani.js` with specific regulations
- **File Processing**: Flexible column mapping for Excel/CSV files from various booking platforms
- **Tax Calculation**: Municipality-specific rates with seasonal support and age-based exemptions

### Key Configuration Points  
- **Authentication**: Hardcoded credentials `admin`/`gecos2024` (LoginScreen.js)
- **Municipality Rules**: Each municipality has unique tax rates, maximum nights, and exemption ages
  - Rome: 10 nights max, €6.00 rate, under-10 exemption
  - Milan: 14 nights max, €3.00 rate, under-10 exemption  
  - Florence: 7 nights max, €4.50 rate, under-12 exemption, seasonal rates
  - Venice: 5 nights max, €4.00 rate, under-10 exemption, seasonal rates
- **Data Persistence**: Manual exemptions and preferences via localStorage
- **Export Formats**: CSV with UTF-8 encoding and Italian separators, PDF with municipality headers

### Security & Privacy Notes
- **Local Processing**: All file processing happens in browser, no server uploads
- **No External Dependencies**: No CDN links, all libraries bundled locally
- **Data Privacy**: Only UI preferences and manual exemptions stored locally