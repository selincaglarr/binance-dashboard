import React, { useState, useEffect } from "react";
import { fetchCryptoData } from "../services/api";
import CryptoChart from "./CryptoChart";
import { formatNumber } from "../utils/formatters";
import { LuArrowUpRight, LuArrowDownRight } from "react-icons/lu";

export interface Crypto {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_24h: number;
}

const CryptoDashboard: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<Crypto[]>([]);
  const [socketData, setSocketData] = useState<Crypto | null>(null);
  const [flashUpdate, setFlashUpdate] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCryptoData();
        setCryptoData(data);
        setFlashUpdate(true);
        setTimeout(() => setFlashUpdate(false), 1000);
      } catch (error) {
        console.error("Error fetching crypto data:", error);
      }
    };

    const socket = new WebSocket(process.env.REACT_APP_BINANCE_SOCKET_URL!);

    socket.onopen = () => {
      console.log("Connected to WebSocket");
    };

    socket.onclose = () => {
      console.log("Disconnected from WebSocket");
    };

    socket.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setSocketData(newData);
      setFlashUpdate(true);
      setTimeout(() => setFlashUpdate(false), 1000);
    };

    fetchData();

    const interval = setInterval(fetchData, 60000);

    return () => {
      clearInterval(interval);
      socket.close();
    };
  }, []);

  const renderChangeIcon = (change: number) => {
    if (change > 0) {
      return <LuArrowUpRight className="text-green-500" />;
    } else if (change < 0) {
      return <LuArrowDownRight className="text-red-500" />;
    } else {
      return null;
    }
  };

  const highlightPriceChange = (change: number) => {
    if (change > 0) {
      return "bg-green-100";
    } else if (change < 0) {
      return "bg-red-100";
    } else {
      return "";
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-semibold text-center my-8">
        Crypto Dashboard
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border-gray-400 shadow-xs rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-400 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left">Crypto</th>
              <th className="py-3 px-6 text-left">Price (USD)</th>
              <th className="py-3 px-6 text-left">Market Cap (USD)</th>
              <th className="py-3 px-6 text-left">24h Change (%)</th>
              <th className="py-3 px-6 text-left">Chart</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {cryptoData.map((crypto) => (
              <tr key={crypto.id} className={flashUpdate ? "bg-yellow-100" : ""}>
                <td className="py-3 px-6 text-left">
                  <div className="flex items-center">
                    <img
                      src={crypto.image}
                      alt={crypto.name}
                      className="h-8 w-8 object-contain rounded-full mr-2"
                    />
                    <div>
                      <p className="text-s text-gray-500 font-semibold">
                        {crypto.symbol.toUpperCase()}
                        <span className="text-xs text-gray-400">/ USDT</span>
                      </p>
                      <p className="text-gray-400">{crypto.name}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-6 text-left font-semibold">
                  ${formatNumber(crypto.current_price)}
                </td>
                <td className="py-3 px-6 text-left font-semibold">
                  ${formatNumber(crypto.market_cap)}
                </td>
                <td className={`py-3 px-6 text-left flex items-center font-semibold ${highlightPriceChange(crypto.price_change_24h)}`}>
                  {renderChangeIcon(crypto.price_change_24h)}
                  {crypto.price_change_24h.toFixed(2)}%
                </td>
                <td className="py-3 px-6 text-left">
                  <CryptoChart id={crypto.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CryptoDashboard;
