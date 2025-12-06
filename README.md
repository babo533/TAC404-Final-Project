# Soccer Player Performance Tracker

A React app for tracking individual soccer player stats, games, and goals.

## Setup
npm install


## Running the App

You need **2 terminals**:

**Terminal 1 - JSON Server (API):**
npm run server

**Terminal 2 - React App:**
npm start  

- React app: http://localhost:3000
- JSON Server: http://localhost:8000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/players` | All players |
| GET/PUT/DELETE | `/players/:id` | Single player |
| GET/POST | `/games` | All games |
| GET/PUT/DELETE | `/games/:id` | Single game |
| GET/POST | `/goals` | All goals |
| GET/PUT/DELETE | `/goals/:id` | Single goal |
| GET/POST | `/skills` | All skills |
| GET/POST | `/comments` | All comments |
| GET/PUT/DELETE | `/comments/:id` | Single comment |
