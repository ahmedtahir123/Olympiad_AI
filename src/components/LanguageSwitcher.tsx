import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-2">
      <Languages className="w-4 h-4 text-white" />
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded text-sm font-medium transition-all ${
          language === 'en'
            ? 'bg-white text-blue-600'
            : 'text-white hover:bg-white hover:bg-opacity-10'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('ar')}
        className={`px-3 py-1 rounded text-sm font-medium transition-all ${
          language === 'ar'
            ? 'bg-white text-blue-600'
            : 'text-white hover:bg-white hover:bg-opacity-10'
        }`}
      >
        ع
      </button>
    </div>
  );
};
