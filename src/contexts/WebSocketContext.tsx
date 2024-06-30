import React, { createContext, useContext, useEffect, useState } from 'react';

interface WebSocketContextType {
  socketData: any[] | null;
}

const initialContext: WebSocketContextType = {
  socketData: null,
};

const WebSocketContext = createContext<WebSocketContextType>(initialContext);

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socketData, setSocketData] = useState<any[] | null>(null);

  useEffect(() => {
    const symbols = ['BTC', 'ETH']; // Example symbols to subscribe

    const ws = new WebSocket('wss://stream.binance.com:9443/ws');
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          method: 'SUBSCRIBE',
          params: symbols.map((symbol) => `${symbol.toLowerCase()}@ticker`),
          id: 1,
        })
      );
    };

    ws.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setSocketData([newData]);
    };

    ws.onclose = () => {
      console.log('WebSocket closed');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ socketData }}>
      {children}
    </WebSocketContext.Provider>
  );
};
