import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis } from 'recharts';

interface CryptoChartProps {
  id: string;
}

const CryptoChart: React.FC<CryptoChartProps> = ({ id }) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [flashing, setFlashing] = useState(false);

  useEffect(() => {
    const fetchCryptoChartData = async () => {
      const now = new Date();
      const to = Math.floor(now.getTime() / 1000);
      const from = to - (24 * 60 * 60);

      const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart/range?vs_currency=usd&from=${from}&to=${to}&x_cg_demo_api_key=CG-rY5A4SjBrmRuWeFFSuciBNDW`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch crypto chart data');
        }
        const json = await response.json();

        const formattedData = json.prices.map((priceData: any) => ({
          date: new Date(priceData[0]),
          price: priceData[1],
        }));

        setChartData(formattedData);

        setFlashing(true);
        setTimeout(() => setFlashing(false), 1000);

      } catch (error) {
        console.error('Error fetching crypto chart data:', error);
      }
    };

    fetchCryptoChartData();
  }, [id]);

  const renderLineColor = (data: any[]) => {
    if (data.length === 0) return '#3182CE';

    const firstPrice = data[0].price;
    const lastPrice = data[data.length - 1].price;

    if (lastPrice > firstPrice) {
      return '#38A169';
    } else if (lastPrice < firstPrice) {
      return '#E53E3E';
    } else {
      return '#A0AEC0';
    }
  };

  return (
    <div className={`mt-4 ${flashing ? 'flash' : ''}`}>
      <LineChart width={70} height={25} data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
        <Line
          type="monotone"
          dataKey="price"
          stroke={renderLineColor(chartData)}
          strokeWidth={1}
          dot={false}
        />
        <XAxis hide />
        <YAxis hide domain={['dataMin', 'dataMax']} />
      </LineChart>
    </div>
  );
};

export default CryptoChart;
