import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Currency {
  code: string;
  symbol: string;
  rate: number; // Rate relative to PHP
}

interface SettingsContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatCurrency: (amount: number) => string;
}

const currencies: Currency[] = [
  { code: 'PHP', symbol: '₱', rate: 1 },
  { code: 'USD', symbol: '$', rate: 0.018 },
  { code: 'EUR', symbol: '€', rate: 0.017 },
  { code: 'JPY', symbol: '¥', rate: 2.75 },
  { code: 'GBP', symbol: '£', rate: 0.014 },
];

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [currency, setCurrencyState] = useState<Currency>(currencies[0]);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedCurrency = localStorage.getItem('currency');
    
    if (savedDarkMode === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    
    if (savedCurrency) {
      const found = currencies.find(c => c.code === savedCurrency);
      if (found) setCurrencyState(found);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('currency', newCurrency.code);
  };

  const formatCurrency = (amount: number) => {
    const converted = amount * currency.rate;
    return `${currency.symbol}${converted.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  return (
    <SettingsContext.Provider value={{ darkMode, toggleDarkMode, currency, setCurrency, formatCurrency }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}

export { currencies };
export type { Currency };
