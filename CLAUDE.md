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

# Run tests
npm test

# Eject from Create React App (irreversible)
npm run eject
```

## Architecture Overview

### Main Components Structure
- **TassaSoggiornoCalculator**: Root component handling authentication and theme
- **LoginScreen**: Authentication component with hardcoded credentials (admin/gecos2024)
- **MainApp**: Main application containing all business logic
- **GuidaGECOS**: Modal component with step-by-step GECOS portal guide
- **WorldMap**: D3.js-powered visualization for guest country analysis

### Core Business Logic
- **Tourist Tax Calculation**: Max 10 nights per booking, children under 10 exempted
- **File Processing**: Supports Excel (.xlsx/.xls) and CSV formats with flexible column mapping
- **Monthly Data Splitting**: Handles bookings spanning multiple months for GECOS reporting
- **Country Analysis**: Maps country codes to names and provides visual statistics

### Key Libraries
- **XLSX**: Excel file processing
- **Papa Parse**: CSV file processing  
- **D3.js**: Data visualization for country statistics
- **Lodash**: Utility functions
- **Math.js**: Mathematical calculations
- **Lucide React**: Icons

### Styling
- **Tailwind CSS**: Primary styling framework
- **PostCSS**: CSS processing with autoprefixer
- Responsive design with dark mode support

### State Management
- Uses React hooks (useState, useEffect) for local state
- LocalStorage for authentication and theme persistence
- No external state management library

### Data Flow
1. User uploads Excel/CSV file with booking data
2. File is parsed and mapped to internal data structure
3. Tourist tax calculated based on configurable rates
4. Monthly breakdown generated for GECOS reporting
5. Results displayed in tables with export functionality

## File Structure Patterns
- Single large component file (`App.js`) containing all functionality
- Standard Create React App structure
- Configuration files for Tailwind CSS and PostCSS in root

## Development Notes
- The README.md appears to be generated with batch commands rather than traditional markdown
- No test files exist beyond the default Create React App setup
- Hard-coded authentication credentials should be externalized for production use
- Component could benefit from being split into smaller, more focused components