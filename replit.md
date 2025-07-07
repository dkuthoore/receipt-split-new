# Receipt Splitter Application

## Overview

Receipt Splitter is a web-based application that uses AI to automatically parse receipt images and help users split bills among multiple people. The application leverages Anthropic's Claude AI model to extract itemized information from uploaded receipt images and provides an intuitive interface for assigning items to different people and calculating individual amounts.

## System Architecture

### Frontend Architecture
- **Framework**: Vanilla JavaScript with Bootstrap 5 for UI components
- **Styling**: Custom CSS with dark theme implementation
- **Structure**: Single-page application (SPA) with step-based workflow
- **Responsive Design**: Mobile-first approach using Bootstrap's grid system

### Backend Architecture
- **Framework**: Flask (Python web framework)
- **API Design**: RESTful endpoints for image processing and bill splitting
- **Image Processing**: PIL (Python Imaging Library) for image manipulation and optimization
- **AI Integration**: Anthropic Claude API for receipt text extraction and analysis

### Technology Stack
- **Backend**: Python 3.x, Flask, PIL
- **Frontend**: HTML5, CSS3, JavaScript ES6+, Bootstrap 5, Font Awesome
- **AI/ML**: Anthropic Claude (claude-sonnet-4-20250514 model)
- **HTTP Client**: Anthropic Python SDK

## Key Components

### 1. Image Upload and Processing
- **Purpose**: Handle receipt image uploads with drag-and-drop functionality
- **Features**: 
  - Multiple image format support (JPG, PNG, HEIC)
  - Image optimization and resizing for Claude API compatibility
  - Automatic format conversion to JPEG
  - File validation and error handling

### 2. AI-Powered Receipt Analysis
- **Model**: Claude Sonnet 4 (claude-sonnet-4-20250514) - latest Anthropic model
- **Functionality**: Extract itemized data from receipt images including item names, prices, taxes, and totals
- **Image Processing**: Automatic image resizing and format optimization for API compliance

### 3. Bill Splitting Interface
- **People Management**: Add/remove people participating in the bill split
- **Item Assignment**: Assign receipt items to specific individuals
- **Calculation Engine**: Automatic calculation of individual amounts including tax and tip distribution

### 4. User Interface Components
- **Step-based Workflow**: Guided process from upload to final calculation
- **Dark Theme**: Modern dark mode interface with custom CSS variables
- **Responsive Design**: Mobile-optimized layout using Bootstrap grid system
- **Interactive Elements**: Drag-and-drop upload, dynamic person management, real-time calculations

## Data Flow

1. **Image Upload**: User uploads receipt image via drag-and-drop or file selection
2. **Image Processing**: Backend processes and optimizes image for Claude API
3. **AI Analysis**: Claude analyzes receipt and extracts structured data
4. **Data Presentation**: Frontend displays extracted items and prices
5. **People Management**: User adds participants for bill splitting
6. **Item Assignment**: User assigns items to specific people
7. **Calculation**: System calculates individual amounts including proportional tax/tip
8. **Results Display**: Final breakdown showing each person's total amount

## External Dependencies

### AI Services
- **Anthropic Claude API**: Primary dependency for receipt text extraction and analysis
- **API Key**: Required environment variable `ANTHROPIC_API_KEY`

### Frontend Libraries
- **Bootstrap 5**: UI framework for responsive design and components
- **Font Awesome 6**: Icon library for enhanced user interface
- **CDN Delivery**: External dependencies loaded via CDN for performance

### Python Packages
- **Flask**: Web framework and routing
- **flask-cors**: Cross-origin resource sharing support
- **anthropic**: Official Anthropic API client
- **Pillow (PIL)**: Image processing and manipulation

## Deployment Strategy

### Environment Configuration
- **Development**: Local development server with debug mode enabled
- **Environment Variables**: 
  - `ANTHROPIC_API_KEY`: Required for AI functionality
  - `SESSION_SECRET`: Flask session security (defaults to dev key)

### Server Configuration
- **Host**: 0.0.0.0 (accessible from all network interfaces)
- **Port**: 5000 (standard Flask development port)
- **CORS**: Enabled for cross-origin requests
- **Static Files**: Served directly by Flask for CSS/JS assets

### File Structure
```
/
├── app.py              # Main Flask application
├── main.py             # Application entry point
├── templates/
│   └── index.html      # Main HTML template
└── static/
    ├── css/
    │   └── styles.css  # Custom styling
    └── js/
        └── app.js      # Frontend JavaScript
```

## Changelog

```
Changelog:
- July 07, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```