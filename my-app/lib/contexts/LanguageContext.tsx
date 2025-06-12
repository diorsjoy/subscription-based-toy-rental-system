// lib/contexts/LanguageContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Translation function type
interface TranslateFunction {
  (key: string, params?: Record<string, any>): string;
}

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
  t: TranslateFunction;
}

// Translation data type
interface TranslationData {
  [key: string]: any;
}

interface Translations {
  [languageCode: string]: TranslationData;
}

// Translation data
const translations: Translations = {
  en: {
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      confirm: "Confirm",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      back: "Back",
      next: "Next",
      search: "Search",
      filter: "Filter",
      sort: "Sort",
      clear: "Clear",
      apply: "Apply",
      close: "Close",
      open: "Open",
      yes: "Yes",
      no: "No",
      tokens: "tokens",
    },
    nav: {
      home: "Home",
      browse: "Browse Toys",
      account: "My Account",
      rentals: "My Rentals",
      tokens: "Tokens",
      profile: "Profile",
      settings: "Settings",
      logout: "Logout",
      login: "Login",
      signup: "Sign Up",
      contact: "Contact",
      about: "About",
      careers: "Careers",
      wishlist: "Wishlist",
      howItWorks: "How it Works",
      pricing: "Pricing",
      getStarted: "Get Started",
    },
    auth: {
      login: "Login",
      signup: "Sign Up",
      logout: "Logout",
      email: "Email",
      password: "Password",
      forgotPassword: "Forgot Password?",
      rememberMe: "Remember Me",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
    },
    toys: {
      rent: "Rent Now",
      details: "View Details",
      available: "Available",
      unavailable: "Unavailable",
      category: "Category",
      ageRange: "Age Range",
      rating: "Rating",
      price: "Price",
      duration: "Duration",
    },
    tokens: {
      balance: "Token Balance",
      purchase: "Purchase Tokens",
      history: "Transaction History",
      insufficient: "Insufficient tokens",
      added: "Tokens added successfully",
      used: "Tokens used",
    },
    rentals: {
      active: "Active Rentals",
      history: "Rental History",
      extend: "Extend Rental",
      return: "Return Toy",
      status: "Status",
      startDate: "Start Date",
      endDate: "End Date",
      daysLeft: "Days Left",
      overdue: "Overdue",
    },
    membership: {
      starter: "Starter",
      premium: "Premium",
      family: "Family",
      free: "Free",
    },
  },
  ru: {
    common: {
      loading: "Загрузка...",
      error: "Ошибка",
      success: "Успех",
      cancel: "Отмена",
      confirm: "Подтвердить",
      save: "Сохранить",
      delete: "Удалить",
      edit: "Редактировать",
      back: "Назад",
      next: "Далее",
      search: "Поиск",
      filter: "Фильтр",
      sort: "Сортировка",
      clear: "Очистить",
      apply: "Применить",
      close: "Закрыть",
      open: "Открыть",
      yes: "Да",
      no: "Нет",
      tokens: "токенов",
    },
    nav: {
      home: "Главная",
      browse: "Игрушки",
      account: "Мой аккаунт",
      rentals: "Мои аренды",
      tokens: "Токены",
      profile: "Профиль",
      settings: "Настройки",
      logout: "Выйти",
      login: "Войти",
      signup: "Регистрация",
      contact: "Контакты",
      about: "О нас",
      careers: "Карьера",
      wishlist: "Избранное",
      howItWorks: "Как это работает",
      pricing: "Цены",
      getStarted: "Начать",
    },
    auth: {
      login: "Войти",
      signup: "Регистрация",
      logout: "Выйти",
      email: "Электронная почта",
      password: "Пароль",
      forgotPassword: "Забыли пароль?",
      rememberMe: "Запомнить меня",
      noAccount: "Нет аккаунта?",
      hasAccount: "Уже есть аккаунт?",
    },
    toys: {
      rent: "Арендовать",
      details: "Подробности",
      available: "Доступно",
      unavailable: "Недоступно",
      category: "Категория",
      ageRange: "Возраст",
      rating: "Рейтинг",
      price: "Цена",
      duration: "Длительность",
    },
    tokens: {
      balance: "Баланс токенов",
      purchase: "Купить токены",
      history: "История транзакций",
      insufficient: "Недостаточно токенов",
      added: "Токены успешно добавлены",
      used: "Токены использованы",
    },
    rentals: {
      active: "Активные аренды",
      history: "История аренд",
      extend: "Продлить аренду",
      return: "Вернуть игрушку",
      status: "Статус",
      startDate: "Дата начала",
      endDate: "Дата окончания",
      daysLeft: "Дней осталось",
      overdue: "Просрочено",
    },
    membership: {
      basic: "Базовый",
      premium: "Премиум",
      vip: "ВИП",
    },
  },
  kk: {
    common: {
      loading: "Жүктелуде...",
      error: "Қате",
      success: "Сәтті",
      cancel: "Болдырмау",
      confirm: "Растау",
      save: "Сақтау",
      delete: "Жою",
      edit: "Өңдеу",
      back: "Артқа",
      next: "Алдыға",
      search: "Іздеу",
      filter: "Сүзгі",
      sort: "Сұрыптау",
      clear: "Тазалау",
      apply: "Қолдану",
      close: "Жабу",
      open: "Ашу",
      yes: "Иә",
      no: "Жоқ",
      tokens: "токендер",
    },
    nav: {
      home: "Басты бет",
      browse: "Ойыншықтар",
      account: "Менің аккаунтым",
      rentals: "Менің жалдауларым",
      tokens: "Токендер",
      profile: "Профиль",
      settings: "Баптаулар",
      logout: "Шығу",
      login: "Кіру",
      signup: "Тіркелу",
      contact: "Байланыс",
      about: "Біз туралы",
      careers: "Мансап",
      wishlist: "Таңдаулылар",
      howItWorks: "Қалай жұмыс істейді",
      pricing: "Баға",
      getStarted: "Бастау",
    },
    auth: {
      login: "Кіру",
      signup: "Тіркелу",
      logout: "Шығу",
      email: "Электрондық пошта",
      password: "Құпия сөз",
      forgotPassword: "Құпия сөзді ұмыттыңыз ба?",
      rememberMe: "Мені есте сақта",
      noAccount: "Аккаунтыңыз жоқ па?",
      hasAccount: "Аккаунтыңыз бар ма?",
    },
    toys: {
      rent: "Жалдау",
      details: "Толық ақпарат",
      available: "Қолжетімді",
      unavailable: "Қолжетімсіз",
      category: "Санат",
      ageRange: "Жас шегі",
      rating: "Рейтинг",
      price: "Баға",
      duration: "Ұзақтығы",
    },
    tokens: {
      balance: "Токен балансы",
      purchase: "Токен сатып алу",
      history: "Транзакция тарихы",
      insufficient: "Токендер жеткіліксіз",
      added: "Токендер сәтті қосылды",
      used: "Токендер пайдаланылды",
    },
    rentals: {
      active: "Белсенді жалдаулар",
      history: "Жалдау тарихы",
      extend: "Жалдауды ұзарту",
      return: "Ойыншықты қайтару",
      status: "Мәртебе",
      startDate: "Басталған күні",
      endDate: "Аяқталған күні",
      daysLeft: "Қалған күндер",
      overdue: "Мерзімі өткен",
    },
    membership: {
      basic: "Негізгі",
      premium: "Премиум",
      vip: "ВИП",
    },
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("language") || "en";
    }
    return "en";
  });

  // Save language to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("language", currentLanguage);
    }
  }, [currentLanguage]);

  // Change language function
  const changeLanguage = (lang: string) => {
    if (translations[lang]) {
      setCurrentLanguage(lang);
    }
  };

  // Translate function
  const t = (key: string, params?: Record<string, any>): string => {
    const keys = key.split(".");

    // Get translation based on current language
    let translation: any = translations[currentLanguage];

    // Navigate through nested keys
    for (const k of keys) {
      if (!translation || typeof translation !== "object") {
        return key; // Return the key if translation not found
      }
      translation = translation[k];
    }

    // If translation not found, return the key
    if (typeof translation !== "string") {
      // Try to get from English if available
      if (currentLanguage !== "en") {
        let fallbackTranslation = translations["en"];
        for (const k of keys) {
          if (!fallbackTranslation || typeof fallbackTranslation !== "object") {
            return key;
          }
          fallbackTranslation = fallbackTranslation[k];
        }

        // Use fallback translation if available
        if (typeof fallbackTranslation === "string") {
          translation = fallbackTranslation;
        } else {
          return key;
        }
      } else {
        return key;
      }
    }

    // Replace parameters in translation string
    if (params) {
      return Object.entries(params).reduce((str, [param, value]) => {
        return str.replace(
          new RegExp(`{{\\s*${param}\\s*}}`, "g"),
          String(value)
        );
      }, translation as string);
    }

    return translation as string;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
