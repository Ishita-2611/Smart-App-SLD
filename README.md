# Smart Learning App

A comprehensive learning application with features like speech-to-text conversion, handwriting recognition, calculator, notes management, and exam mode.

## Features

- User Authentication
- Speech to Text Conversion
- Handwriting Recognition
- Calculator
- Notes Management
- Exam Mode
- User Profile Management

## Tech Stack

### Backend
- Django
- Django REST Framework
- PostgreSQL
- JWT Authentication
- Speech Recognition
- Image Processing

### Frontend
- React Native
- React Navigation
- React Native Paper
- Axios
- AsyncStorage

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 14+
- PostgreSQL
- Android Studio / Xcode

### Backend Setup

1. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install backend dependencies:
```bash
cd backend
pip install -r requirements.txt
```

3. Create a `.env` file in the backend directory with the following content:
```
DEBUG=True
DJANGO_SECRET_KEY=your-secret-key-here
DB_NAME=smart_app_db
DB_USER=postgres
DB_PASSWORD=your-password-here
DB_HOST=localhost
DB_PORT=5432
```

4. Set up the database:
```bash
python manage.py migrate
python manage.py createsuperuser
```

5. Run the backend server:
```bash
python manage.py runserver
```

### Frontend Setup

1. Install frontend dependencies:
```bash
cd starlus
npm install
```

2. For iOS (Mac only):
```bash
cd ios
pod install
cd ..
```

3. Start the Metro bundler:
```bash
npm start
```

4. Run the app:
```bash
# For Android
npm run android

# For iOS
npm run ios
```

## API Endpoints

### Authentication
- POST /api/token/ - Get access token
- POST /api/token/refresh/ - Refresh access token

### Users
- POST /api/users/ - Register new user
- GET /api/profiles/ - Get user profile
- PATCH /api/profiles/ - Update user profile

### Notes
- GET /api/notes/ - List notes
- POST /api/notes/ - Create note
- GET /api/notes/{id}/ - Get note details
- PATCH /api/notes/{id}/ - Update note
- DELETE /api/notes/{id}/ - Delete note

### Speech to Text
- POST /api/speech/ - Convert speech to text

### Handwriting Recognition
- POST /api/handwritten/ - Convert handwritten text to digital

### Calculations
- POST /api/calculations/ - Perform calculations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.