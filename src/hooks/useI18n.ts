import { usePathname } from 'next/navigation';
import zhTW from '~/i18n/locales/zh-TW';
import en from '~/i18n/locales/en';
import getLocale from '@/utils/getLocale';

const dictionaries = {
  'zh-TW': zhTW,
  en,
};

function useI18n() {
  const pathname = usePathname();
  const lang = getLocale(pathname);
  const dict = dictionaries[lang];

  return { lang, dict };
}

export default useI18n;