import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import CryptoDashboard from './components/CryptoDashboard';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">

        <main>
          <CryptoDashboard />
        </main>
      </div>
    </QueryClientProvider>
  );
};

export default App;
