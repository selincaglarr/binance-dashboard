import axios from 'axios';

const COINGECKO_API_URL = process.env.REACT_APP_COINGECKO_API_URL;
const CURRENCY = process.env.REACT_APP_CURRENCY;
const API_KEY = process.env.REACT_APP_API_KEY;

export interface Crypto {
  price_change_percentage_24h: number;
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_24h: number; // 24 saatlik değişim yüzdesi
}

// Statik veri cache'i
let staticDataCache: { [symbol: string]: { name: string; image: string } } = {};

// Statik verileri cache'leme
export const fetchStaticCryptoData = async () => {
  try {
    if (Object.keys(staticDataCache).length === 0) {
      const response = await axios.get(`${COINGECKO_API_URL}/coins/list`, {
        headers: {
          accept: 'application/json',
          'x-cg-demo-api-key': API_KEY,
        },
      });
      response.data.forEach((crypto: any) => {
        staticDataCache[crypto.symbol.toLowerCase()] = {
          name: crypto.name,
          image: crypto.image,
        };
      });
    }
    return staticDataCache;
  } catch (error) {
    console.error('Error fetching static crypto data:', error);
    throw error;
  }
};

// Dinamik veri için WebSocket kullanımı
export const subscribeToCryptoPrices = (symbols: string[], callback: (newData: any) => void) => {
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
    const data = JSON.parse(event.data);
    callback(data);
  };

  ws.onclose = () => {
    console.log('WebSocket closed');
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
};

// Crypto verilerini getirme
export const fetchCryptoData = async (
  page: number,
  perPage: number
): Promise<Crypto[]> => {
  try {
    const response = await axios.get<Crypto[]>(`${COINGECKO_API_URL}/coins/markets`, {
      params: {
        vs_currency: CURRENCY,
        order: 'market_cap_desc',
        per_page: perPage,
        page: page,
        sparkline: false,
      },
      headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': API_KEY,
      },
    });

    // Hesaplanmış 24 saatlik değişim yüzdesini ekleyelim
    const cryptoDataWithChange = response.data.map((crypto: Crypto) => ({
      ...crypto,
      price_change_24h: crypto.price_change_percentage_24h ?? 0,
    }));

    return cryptoDataWithChange;
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    throw error;
  }
};
