import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    welcomeBack: 'Welcome Back',
    signInToAccount: 'Sign in to your Saudi Arabia Olympics account',
    emailAddress: 'Email Address',
    enterEmail: 'Enter your email',
    password: 'Password',
    enterPassword: 'Enter your password',
    signIn: 'Sign In',
    signingIn: 'Signing In...',
    dontHaveAccount: "Don't have an account?",
    signUp: 'Sign up',
    demoAccounts: 'Demo Accounts:',
    superAdmin: 'Super Admin',
    entityAdmin: 'Entity Admin',
    joinOlympics: 'Join Saudi Arabia Olympics',
    createAccount: 'Create your entity account',
    yourName: 'Your Name',
    enterFullName: 'Enter your full name',
    entityName: 'Entity Name',
    enterEntityName: 'Enter entity name',
    phoneNumber: 'Phone Number',
    enterPhone: 'Enter phone number',
    entityAddress: 'Entity Address',
    enterEntityAddress: 'Enter entity address',
    confirmPassword: 'Confirm Password',
    confirmYourPassword: 'Confirm your password',
    createAccountBtn: 'Create Account',
    creatingAccount: 'Creating Account...',
    alreadyHaveAccount: 'Already have an account?',
    signInLink: 'Sign in',
    invalidCredentials: 'Invalid credentials. Please try again.',
    passwordsDoNotMatch: 'Passwords do not match',
    passwordMinLength: 'Password must be at least 6 characters',
    accountCreationFailed: 'Failed to create account. Please try again.',
    saudiOlympicsSystem: 'Saudi Arabia Olympics System',
    forEntityManagement: 'For Entity Management Platform',
    loadingSystem: 'Loading Saudi Arabia Olympics System...'
  },
  ar: {
    welcomeBack: 'مرحباً بعودتك',
    signInToAccount: 'تسجيل الدخول إلى حساب أولمبياد السعودية',
    emailAddress: 'البريد الإلكتروني',
    enterEmail: 'أدخل بريدك الإلكتروني',
    password: 'كلمة المرور',
    enterPassword: 'أدخل كلمة المرور',
    signIn: 'تسجيل الدخول',
    signingIn: 'جاري تسجيل الدخول...',
    dontHaveAccount: 'ليس لديك حساب؟',
    signUp: 'إنشاء حساب',
    demoAccounts: 'حسابات تجريبية:',
    superAdmin: 'مدير النظام',
    entityAdmin: 'مدير الجهة',
    joinOlympics: 'انضم إلى أولمبياد السعودية',
    createAccount: 'إنشاء حساب الجهة الخاصة بك',
    yourName: 'اسمك',
    enterFullName: 'أدخل اسمك الكامل',
    entityName: 'اسم الجهة',
    enterEntityName: 'أدخل اسم الجهة',
    phoneNumber: 'رقم الهاتف',
    enterPhone: 'أدخل رقم الهاتف',
    entityAddress: 'عنوان الجهة',
    enterEntityAddress: 'أدخل عنوان الجهة',
    confirmPassword: 'تأكيد كلمة المرور',
    confirmYourPassword: 'أكد كلمة المرور',
    createAccountBtn: 'إنشاء الحساب',
    creatingAccount: 'جاري إنشاء الحساب...',
    alreadyHaveAccount: 'لديك حساب بالفعل؟',
    signInLink: 'تسجيل الدخول',
    invalidCredentials: 'بيانات الاعتماد غير صالحة. يرجى المحاولة مرة أخرى.',
    passwordsDoNotMatch: 'كلمات المرور غير متطابقة',
    passwordMinLength: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
    accountCreationFailed: 'فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.',
    saudiOlympicsSystem: 'نظام أولمبياد السعودية',
    forEntityManagement: 'منصة إدارة الجهات',
    loadingSystem: 'جاري تحميل نظام أولمبياد السعودية...'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'ar' || saved === 'en') ? saved : 'en';
  });

  const isRTL = language === 'ar';

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  const value = {
    language,
    setLanguage,
    t,
    isRTL
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
