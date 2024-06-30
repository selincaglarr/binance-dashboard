# Binance Dashboard

## Project Overview
The Binance Dashboard is a React application that fetches cryptocurrency data from the Binance API and displays it in a dynamic dashboard format. It includes real-time updates using WebSocket, data visualization with Recharts, and utilizes Tailwind CSS for styling.

## Features
- **Real-time Data Updates:** Utilizes WebSocket to provide live updates on cryptocurrency prices.
- **Interactive Charts:** Displays historical price data using Recharts.
- **Pagination:** Loads data incrementally with infinite scroll functionality.
- **Responsive Design:** Tailwind CSS ensures a responsive and modern UI.
- **Error Handling:** Manages errors gracefully when fetching data.

## Technologies Used
- **React**: Frontend framework for building user interfaces.
- **WebSocket**: Provides real-time communication between the client and server.
- **Recharts**: Data visualization library for creating charts.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Axios**: HTTP client for making API requests.
- **React Query**: Handles data fetching, caching, and synchronization.

## Installation
1. **Clone Repository:**
   ```bash
   git clone <repository-url>
   cd binance-dashboard

2. **Set Up Environment Variables:**
- Create a .env file in the root directory. Define the following environment variables:

    ```bash
    REACT_APP_COINGECKO_API_URL=https://api.coingecko.com/api/v3
    REACT_APP_API_KEY=<your-api-key>
    REACT_APP_CURRENCY=usd

- Get your API key from CoinGecko API Documentation.


3. **Run the Application:**
    ```bash
    npm start

- Open http://localhost:3000 to view it in the browser.

## Project Structure
  ```bash
binance-dashboard/
├── public/
│   └── index.html
├── src/
   ├── components/
   │   ├── CryptoDashboard.tsx
   │   ├── CryptoChart.tsx
   │   └── ...
   ├── contexts/
   │   └── WebSocketContext.tsx
   ├── services/
   │   └── api.ts
   ├── utils/
   │   ├── formatters.ts
   │   └── icon.ts
   ├── App.tsx
   ├── index.tsx
   └── ...



