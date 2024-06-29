import axios from 'axios';

const COINGECKO_API_URL = process.env.REACT_APP_COINGECKO_API_URL;

// Kripto türü tanımla, CoinGecko API'den gelen veri yapısına uygun
export interface Crypto {
  id: string; // Kripto para biriminin ID'si
  name: string; // Kripto para biriminin adı
  symbol: string; // Kripto para biriminin simgesi
  image: string; // Kripto para biriminin ikon URL'si
  current_price: number; // Güncel fiyat
  market_cap: number; // Piyasa değeri
  price_change_24h: number; // Son 24 saatteki fiyat değişimi
}

// CoinGecko API'den kripto verilerini almak için fonksiyon
export const fetchCryptoData = async (): Promise<Crypto[]> => {
  try {
    const response = await axios.get<Crypto[]>(`${COINGECKO_API_URL}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 30,
        page: 1,
        sparkline: false,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    throw error; // Hata durumunda hatayı yukarıya fırlat
  }
};
