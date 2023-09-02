import { Route } from 'next';
import Link, { LinkProps } from '@/components/Link';
import ThemeSwitcher from '../ThemeSwitcher';

type MenuItem = {
  text: string;
  href: LinkProps['href'];
};

export type HeaderProps = {
  title: string;
  menu: MenuItem[];
};

function Header({ title, menu }: HeaderProps) {
  return (
    <nav className="sticky top-0 z-10 bg-slate-600 p-4 drop-shadow-xl">
      <div className="prose prose-xl mx-auto flex justify-between">
        <Link href="/" className="text-white/90 no-underline hover:text-white">
          {title}
        </Link>
        <div className="flex gap-4">
          {menu.map(({ text, href }) => (
            <Link
              key={text}
              href={href as Route}
              className="text-white/90 no-underline hover:text-white"
            >
              {text}
            </Link>
          ))}
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}

export default Header;