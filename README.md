
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

## Getting Started 🚀

### Prerequisites

1. **Replit Account**: Create a free account at [replit.com](https://replit.com)
2. **Anthropic API Key**: Get your API key from [Anthropic Console](https://console.anthropic.com/)

### Installation

1. **Fork this Repl** or create a new Python Repl and copy the code
2. **Set up Environment Variables**:
   - Click on "Secrets" in the left sidebar
   - Add `ANTHROPIC_API_KEY` with your Anthropic API key value
3. **Run the Application**:
   - Click the "Run" button
   - The app will be available at the provided URL

### Local Development (Optional)

If running locally outside of Replit:

```bash
# Clone the repository
git clone <your-repo-url>
cd receipt-splitter

# Install dependencies
pip install -r requirements.txt

# Set environment variable
export ANTHROPIC_API_KEY="your-api-key-here"

# Run the application
python main.py
```

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

## API Endpoints 🔗

### POST `/api/process-receipt`
Processes uploaded receipt images using Claude AI.

**Request**: Form data with image file
**Response**: JSON with extracted receipt data
```json
{
  "items": [{"name": "item name", "price": 12.99}],
  "subtotal": 45.99,
  "tax": 4.60,
  "tip": 9.00,
  "total": 59.59,
  "establishment": "Restaurant Name",
  "date": "2025-01-07"
}
```

### POST `/api/calculate-split`
Calculates bill split based on item assignments.

**Request**: JSON with people, items, and assignments
**Response**: JSON with individual split amounts

## File Structure 📁

```
receipt-splitter/
├── app.py                 # Main Flask application
├── main.py               # Application entry point
├── templates/
│   └── index.html        # Main HTML template
├── static/
│   ├── css/
│   │   └── styles.css    # Custom styling with dark theme
│   └── js/
│       └── app.js        # Frontend JavaScript logic
├── .replit               # Replit configuration
├── pyproject.toml        # Python dependencies
└── README.md             # This file
```

## Configuration ⚙️

### Environment Variables

- `ANTHROPIC_API_KEY`: Required for AI receipt processing
- `SESSION_SECRET`: Flask session security (optional, defaults to dev key)

### Model Configuration

The app uses Claude Sonnet 4 (`claude-sonnet-4-20250514`) - Anthropic's latest model for optimal receipt parsing accuracy.

## Contributing 🤝

Contributions are welcome! Here are some ways you can help:

1. **Report Issues**: Found a bug? Open an issue with details
2. **Feature Requests**: Suggest new features or improvements
3. **Code Contributions**: Fork the repo and submit pull requests
4. **Documentation**: Help improve documentation and examples

### Development Guidelines

- Follow Python PEP 8 style guidelines
- Write descriptive commit messages
- Test with various receipt formats
- Ensure mobile responsiveness for UI changes

## Troubleshooting 🔧

### Common Issues

**"No image file provided" Error**
- Ensure you're uploading a valid image file
- Check file size is under 10MB

**"Failed to process receipt" Error**
- Verify your Anthropic API key is set correctly
- Ensure the receipt image is clear and readable
- Try a different image format

**Items not extracted correctly**
- Use higher quality images with good lighting
- Ensure receipt text is clearly visible
- Try straightening curved or angled receipts

**Deployment Issues**
- Check that all environment variables are set in Replit Secrets
- Verify the Run button is configured to use the correct workflow

## License 📄

This project is open source and available under the [MIT License](LICENSE).

## Support 💬

- **Issues**: Report bugs or request features via GitHub Issues
- **Community**: Join discussions in the Replit community
- **Documentation**: Check this README and inline code comments

## Acknowledgments 🙏

- [Anthropic](https://www.anthropic.com/) for providing the Claude AI API
- [Bootstrap](https://getbootstrap.com/) for the responsive UI framework
- [Flask](https://flask.palletsprojects.com/) for the lightweight web framework
- [Replit](https://replit.com/) for the development and hosting platform

---

Made with ❤️ using AI and modern web technologies
