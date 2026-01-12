# Tekion Lead Management Frontend

A modern, professional frontend for the Tekion Lead Management System built with vanilla JavaScript, HTML, and CSS.

## Features

✨ **Modern UI/UX**
- Tekion's official color scheme (#0066FF primary blue)
- Smooth animations and transitions
- Responsive design for all devices
- Professional automotive-focused design

🎯 **Key Functionality**
- View all leads in a beautiful table
- Create new leads with a modal form
- Real-time statistics dashboard
- Lead scoring visualization
- Toast notifications for user feedback
- Auto-refresh capability

📊 **Dashboard Stats**
- Total leads count
- Average lead score
- New leads count

## Quick Start

### Option 1: Using Python's Built-in Server (Recommended)

```bash
cd frontend
python3 -m http.server 8000
```

Then open your browser to: **http://localhost:8000**

### Option 2: Using Node.js http-server

```bash
# Install http-server globally (one time)
npm install -g http-server

# Run the server
cd frontend
http-server -p 8000
```

Then open your browser to: **http://localhost:8000**

### Option 3: Using VS Code Live Server

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## Prerequisites

⚠️ **Important**: Make sure your Spring Boot backend is running on port 8080 before using the frontend.

```bash
# In the project root directory
cd demo
mvn spring-boot:run
```

The backend should be accessible at: **http://localhost:8080**

## Configuration

The frontend is configured to connect to the backend at `http://localhost:8080/api/leads`.

If you need to change the backend URL, edit the `API_BASE_URL` constant in `app.js`:

```javascript
const API_BASE_URL = 'http://localhost:8080/api/leads';
```

The default dealer ID is set to `dealer001`. You can change this in `app.js`:

```javascript
const CURRENT_DEALER_ID = 'dealer001';
```

## Usage

### Creating a Lead

1. Click the **"Create New Lead"** button
2. Fill in the required fields:
   - First Name *
   - Last Name *
   - Lead Source *
3. Optionally add:
   - Email
   - Phone
   - Vehicle Make, Model, Year
   - Trade-in Value
4. Click **"Create Lead"**

### Viewing Leads

- All leads are displayed in the table automatically
- Click **"Refresh"** to reload the latest data
- Click **"View"** on any lead to see detailed information

### Understanding Lead Scores

Leads are automatically scored based on:
- **Source Quality**: Referral (highest), Website, Phone, Walk-in
- **Vehicle Interest**: Presence of vehicle data, trade-in value, vehicle age
- **Contact Information**: Email and phone availability
- **Recency**: Newer leads score higher

Score badges:
- 🟢 **Green (75-100)**: High-quality lead
- 🟡 **Yellow (50-74)**: Medium-quality lead
- 🔴 **Red (0-49)**: Low-quality lead

## Color Scheme

The frontend uses Tekion's official color palette:

- **Primary Blue**: #0066FF
- **Secondary Green**: #00C9A7
- **Accent Orange**: #FF6B35
- **Dark**: #1A1D29
- **Success**: #10B981
- **Warning**: #F59E0B
- **Error**: #EF4444

## Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## Troubleshooting

### "Failed to load leads" error

1. Make sure the backend is running on port 8080
2. Check the browser console for CORS errors
3. Verify the backend URL in `app.js`

### CORS Issues

If you encounter CORS errors, you may need to add CORS configuration to your Spring Boot backend:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:8000")
                .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}
```

## File Structure

```
frontend/
├── index.html      # Main HTML structure
├── styles.css      # Tekion-themed styles
├── app.js          # JavaScript functionality
└── README.md       # This file
```

## Development

The frontend is built with vanilla JavaScript (no frameworks) for simplicity and performance. All code is well-commented and easy to modify.

To customize:
- **Styling**: Edit `styles.css`
- **Functionality**: Edit `app.js`
- **Layout**: Edit `index.html`

Enjoy your beautiful Tekion Lead Management System! 🚗✨

