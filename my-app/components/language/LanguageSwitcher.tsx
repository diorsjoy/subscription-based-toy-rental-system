// components/language-switcher.tsx
"use client";

import React from "react";
import { ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useTranslation from "@/hooks/useTranslation";

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
  native: string;
}

const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, changeLanguage } = useTranslation();

  // Available languages
  const languages: LanguageOption[] = [
    {
      code: "en",
      name: "English",
      flag: "🇬🇧",
      native: "English",
    },
    {
      code: "ru",
      name: "Russian",
      flag: "🇷🇺",
      native: "Русский",
    },
    {
      code: "kk",
      name: "Kazakh",
      flag: "🇰🇿",
      native: "Қазақша",
    },
  ];

  // Get current language data
  const getCurrentLanguage = (): LanguageOption => {
    return (
      languages.find((lang) => lang.code === currentLanguage) || languages[0]
    );
  };

  // Handle language change
  const handleLanguageChange = (languageCode: string): void => {
    changeLanguage(languageCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <span>{getCurrentLanguage().flag}</span>
          <span className="hidden sm:inline">
            {getCurrentLanguage().native}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span>{language.flag}</span>
              <span>{language.native}</span>
            </div>
            {language.code === currentLanguage && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
