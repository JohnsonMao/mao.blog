import type { Metadata } from 'next';

import { locales } from '~/i18n';
import { createMetadata, createFeedOptions } from '~/data/metadata';
import generateRSS from '@/utils/generateRSS';

import Html from './Html';
import Providers from './Providers';
import './css/globals.css';

export const dynamic = 'force-static';

export async function generateMetadata(): Promise<Metadata> {
  const allFeedOptions = await Promise.all(locales.map(createFeedOptions));

  allFeedOptions.forEach(generateRSS);

  return createMetadata();
}

function HtmlLayout({ children }: React.PropsWithChildren) {
  return (
    <Html>
      <body>
        <div className="root-background fixed inset-x-0 top-0 -z-50 h-screen"></div>
        <Providers>{children}</Providers>
      </body>
    </Html>
  );
}

export default HtmlLayout;
