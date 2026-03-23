
# Receipt Splitter 🧾

An AI-powered web application that automatically parses receipt images and helps users split bills among multiple people. Built with Flask and powered by Anthropic's Claude AI for intelligent receipt recognition.

![Receipt Splitter Demo](https://img.shields.io/badge/Status-Active-brightgreen) ![Python](https://img.shields.io/badge/Python-3.11+-blue) ![Flask](https://img.shields.io/badge/Flask-3.1+-red) ![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple)

## Features ✨

- **AI-Powered Receipt Parsing**: Upload receipt images and let Claude AI automatically extract items, prices, taxes, and totals
- **Smart Bill Splitting**: Assign specific items to different people with intelligent cost distribution
- **Real-Time Calculations**: See split amounts update instantly as you make assignments
- **Multiple Image Formats**: Support for JPG, PNG, HEIC, and other common image formats
- **Mobile-Friendly Interface**: Responsive design optimized for both desktop and mobile devices
- **Dark Theme UI**: Modern, easy-on-the-eyes interface with Bootstrap 5
- **Drag & Drop Upload**: Intuitive file upload with drag-and-drop functionality
- **Receipt Preview**: View uploaded receipts in full-screen modal for verification

## Technology Stack 🛠️

### Backend
- **Python 3.11+**: Core programming language
- **Flask 3.1+**: Web framework for API endpoints and routing
- **Flask-CORS**: Cross-origin resource sharing support
- **Anthropic Claude API**: AI model for receipt text extraction (`claude-sonnet-4-20250514`)
- **Pillow (PIL)**: Image processing and format conversion
- **Pillow-HEIF**: Support for iPhone HEIC image format
- **Gunicorn**: WSGI HTTP Server for production deployment

### Frontend
- **HTML5 & CSS3**: Modern web standards
- **JavaScript ES6+**: Client-side functionality with vanilla JS
- **Bootstrap 5.3**: Responsive UI framework
- **Font Awesome 6**: Icon library
- **Custom CSS**: Dark theme with CSS variables

### Deployment
- **Replit**: Cloud platform for hosting and deployment
- **Nix**: Package management and environment configuration


## How to Use 📱

### Step 1: Upload Receipt
- Click the upload area or drag and drop a receipt image
- Supported formats: JPG, PNG, HEIC, GIF, WebP
- The AI will automatically extract items and prices

### Step 2: Review Items
- Verify the extracted items and prices are correct
- Manually edit the tip amount if needed (updates totals in real-time)
- Review restaurant name, date, and totals

### Step 3: Add People
- Enter names of people splitting the bill
- Add as many people as needed
- Remove people by clicking the X next to their name

### Step 4: Assign Items
- Click on person buttons to assign items to specific individuals
- Items can be split among multiple people (cost automatically divided)
- See real-time calculations as you make assignments

### Step 5: View Results
- See detailed breakdown with subtotal, tax, and tip splits for each person
- Total amounts automatically calculated with proportional tax and tip distribution
- Verify totals match the original receipt


## License 📄

This project is open source and available under the [MIT License](LICENSE).

---

Made with ❤️ using AI and modern web technologies
