# chamak

# Chamak - MERN Stack Project

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- Postgres
- Git

### Frontend Setup

1. Clone the repository

```bash
git clone <repository-url>
cd chamak/frontend
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the frontend directory and add necessary environment variables:

```
REACT_APP_API_URL=http://localhost:5000
```

4. Start the development server

```bash
npm start
```

### Backend Setup

1. Navigate to backend directory

```bash
cd ../backend
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the backend directory and add:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chamak
JWT_SECRET=your_jwt_secret
```

4. Start the server

```bash
npm start
```

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from create-react-app

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.
