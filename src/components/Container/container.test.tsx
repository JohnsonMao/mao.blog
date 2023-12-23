import { render, screen } from '@testing-library/react';

import Container from '.';

describe('Container component', () => {
  it.each([
    [undefined, 'DIV'],
    ['main', 'MAIN'],
  ] as const)('should render correct element', async (as, expectedTagName) => {
    // Arrange
    render(<Container as={as} data-testid="container" />);
    const container = screen.getByTestId('container');
    // Assert
    expect(container).toBeInTheDocument();
    expect(container.tagName).toBe(expectedTagName);
  });
});
