import type { Route } from 'next';
import { render, screen } from '@testing-library/react';

import Link from '.';

const mockPathname = jest.fn();

jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}));

describe('Link component', () => {
  beforeEach(() => {
    mockPathname.mockClear();
  });

  it.each([
    ['#anchor', 'The anchor link text', '#anchor'],
    ['/internal', 'The internal link text', '/internal'],
    ['https://external.com', 'The external link text', 'https://external.com'],
    [{ pathname: '/internal' }, 'The object href text', '/internal'],
  ])('should render correct element', (href, name, expectedHref) => {
    render(<Link href={href as Route}>{name}</Link>);

    const link = screen.getByRole('link', { name });

    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent(name);
    expect(link).toHaveAttribute('href', expectedHref);
    expect(link.tagName).toBe('A');
  });

  it.each([
    ['/internal', '/internal'],
    ['/en/internal', '/en/internal'],
    ['/zh-TW/internal', '/zh-TW/internal'],
    ['/fr-CH/internal', '/internal'],
  ])(
    'should render correct link element with pathname %s',
    (pathname, expected) => {
      const name = 'internal link';
      const href = '/internal';

      mockPathname.mockReturnValueOnce(pathname);

      render(<Link href={href}>{name}</Link>);

      const link = screen.getByRole('link', { name });

      expect(link).toHaveAttribute('href', expected);
    }
  );
});
