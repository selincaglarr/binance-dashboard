import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { fetchCryptoData, Crypto, fetchStaticCryptoData } from "../services/api";
import CryptoChart from "./CryptoChart";
import { formatNumber } from "../utils/formatters";
import { useWebSocket } from "../contexts/WebSocketContext";
import { renderChangeIcon } from "../utils/icon";

const CryptoDashboard: React.FC = () => {
  const { socketData } = useWebSocket();
  const [cryptoData, setCryptoData] = useState<Crypto[]>([]);
  const [staticDataLoaded, setStaticDataLoaded] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const perPage = 30;
  const currentPageRef = useRef<number>(1);
  const [loadingError, setLoadingError] = useState<boolean>(false);

  const {
    data: initialCryptoData = [],
    isLoading,
  } = useQuery<Crypto[]>(
    ["cryptoData", perPage],
    () => fetchCryptoData(currentPageRef.current, perPage),
    {
      refetchInterval: 60000,
      keepPreviousData: true,
      cacheTime: 5 * 60 * 1000,
      staleTime: 2 * 60 * 1000,
      onError: () => {
        setLoadingError(true);
      }
    }
  );

  useEffect(() => {
    if (!staticDataLoaded) {
      fetchStaticCryptoData().then(() => setStaticDataLoaded(true));
    }
  }, [staticDataLoaded]);

  useEffect(() => {
    setCryptoData(initialCryptoData);
  }, [initialCryptoData]);

  useEffect(() => {
    if (socketData && socketData.length > 0) {
      const updatedCryptoData = cryptoData.map((crypto) =>
        crypto.id === socketData[0].s ? { ...crypto, ...socketData[0] } : crypto
      );
      setCryptoData(updatedCryptoData);
    }
  }, [socketData, cryptoData]);

  const handleScroll = () => {
    if (
      containerRef.current &&
      containerRef.current.scrollTop + containerRef.current.clientHeight >=
        containerRef.current.scrollHeight
    ) {
      fetchMoreData();
    }
  };

  const fetchMoreData = async () => {
    currentPageRef.current++;
    try {
      const newData = await fetchCryptoData(currentPageRef.current, perPage);
      setCryptoData((prevData) => [...prevData, ...newData]);
      setLoadingError(false);
    } catch (error) {
      setLoadingError(true);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div className="container mx-auto" ref={containerRef} style={{ height: "100vh", overflowY: "auto" }}>
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
              <tr key={crypto.id}>
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
                <td
                  className={`py-3 px-6 text-left flex items-center font-semibold`}
                >
                  {renderChangeIcon(crypto.price_change_24h)}
                  <span
                    className={`ml-1 ${
                      crypto.price_change_24h > 0
                        ? "text-green-500"
                        : crypto.price_change_24h < 0
                        ? "text-red-500"
                        : ""
                    }`}
                  >
                    {crypto.price_change_24h.toFixed(2)}%
                  </span>
                </td>
                <td className="py-3 px-6 text-left">
                  <CryptoChart id={crypto.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isLoading && (
          <div className="flex justify-center items-center h-32">
            <p className="text-gray-500 text-lg">Loading...</p>
          </div>
        )}
        {loadingError && (
          <div className="flex justify-center items-center h-32">
            <p className="text-red-500 text-lg">Error fetching data. Please try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CryptoDashboard;
