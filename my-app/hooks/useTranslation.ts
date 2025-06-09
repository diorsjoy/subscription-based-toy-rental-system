// hooks/useTranslation.ts
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function useTranslation() {
  const { currentLanguage, changeLanguage, t } = useLanguage();

  return {
    currentLanguage,
    changeLanguage,
    t,
  };
}
