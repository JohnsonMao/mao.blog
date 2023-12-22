import { render, screen } from '@testing-library/react';
import { GiscusProps } from '@giscus/react';
import giscusConfigs from '~/data/giscus';

import Comment from '.';

const getGiscusProps = jest.fn();
const mockUseTheme = jest.fn();

jest.mock('@giscus/react', () => function MockGiscus(props: GiscusProps) {
  getGiscusProps(props);
  return <div data-testid="comment"></div>;
});
jest.mock('next-themes', () => ({
  useTheme: () => mockUseTheme(),
}));

describe('Comment component', () => {
  it.each(['light', 'dark'])('should render correct element', async (theme) => {
    // Arrange
    mockUseTheme.mockReturnValue({ resolvedTheme: theme });
    render(<Comment />);
    const comment = screen.getByTestId('comment');
    const expectedProps: GiscusProps = JSON.parse(JSON.stringify(giscusConfigs));
    expectedProps.theme = `noborder_${theme}`;
    // Assert
    expect(comment).toBeInTheDocument();
    expect(getGiscusProps).toHaveBeenCalledWith(expectedProps);
  });
});
