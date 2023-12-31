import { getDataById, getAllDataFrontmatter } from '../mdx';

const mockReaddir = jest.fn();
const mockExists = jest.fn();
const mockReadFile = jest.fn();

jest.mock('fs', () => ({
  readdirSync: () => mockReaddir(),
  existsSync: () => mockExists(),
  readFileSync: () => mockReadFile(),
}));
jest.mock('remark-gfm', () => ({}));
jest.mock('rehype-slug', () => ({}));
jest.mock('rehype-prism-plus', () => ({}));
jest.mock('rehype-code-titles', () => ({}));
jest.mock('sharp', () => ({}));
jest.mock('unist-util-visit', () => ({}));
jest.mock('next-mdx-remote/rsc', () => ({
  compileMDX: ({ source }: { source: string }) => ({
    frontmatter: { date: source.replace(/[^/\d]/g, '') },
    content: source.replace(/^---\n.*\n---\n\n/g, ''),
  }),
}));

describe('Get post list function', () => {
  beforeEach(() => {
    mockReaddir.mockClear();
    mockExists.mockClear();
    mockReadFile.mockClear();
  });

  it('should get post list descending by date', async () => {
    // Arrange
    mockReaddir.mockReturnValueOnce(['test_A.md', 'test_B.mdx', 'test_C.md']);
    mockReadFile.mockReturnValueOnce(mockFileA);
    mockReadFile.mockReturnValueOnce(mockFileB);
    mockReadFile.mockReturnValueOnce(mockFileC);
    // Act
    const postList = await getAllDataFrontmatter('posts');
    // Assert
    expect(postList).toStrictEqual([
      { id: 'test_C', date: '2023/07/09' },
      { id: 'test_A', date: '2023/07/08' },
      { id: 'test_B', date: '2023/07/07' },
    ]);
  });

  it('should return same id error with reject', async () => {
    // Arrange
    const expected = Error('Duplicate id "test_A" found in "test_A.mdx"');
    mockReaddir.mockReturnValueOnce(['test_A.md', 'test_A.mdx']);
    mockReadFile.mockReturnValue('');
    expect.assertions(1);
    // Act
    const result = getAllDataFrontmatter('posts');
    // Assert
    await expect(result).rejects.toStrictEqual(expected);
  });
});

describe('Get post data function', () => {
  beforeEach(() => {
    mockReaddir.mockClear();
    mockExists.mockClear();
    mockReadFile.mockClear();
  });

  it('should get post data by mdx file', async () => {
    // Arrange
    mockExists.mockReturnValueOnce(true);
    mockReadFile.mockReturnValueOnce(mockFileB);
    // Act
    const postData = await getDataById('posts', 'test_B');
    // Assert
    expect(postData).toStrictEqual({
      content: '測試文章B',
      frontmatter: { date: '2023/07/07' },
      id: 'test_B',
    });
  });

  it('should get post data by md file', async () => {
    // Arrange
    mockExists.mockReturnValueOnce(false);
    mockReadFile.mockReturnValueOnce(mockFileC);
    // Act
    const postData = await getDataById('posts', 'test_C');
    // Assert
    expect(postData).toStrictEqual({
      content: '測試文章C',
      frontmatter: { date: '2023/07/09' },
      id: 'test_C',
    });
  });

  it('should return null when trying to get post data for a non-existing file', async () => {
    // Arrange
    mockExists.mockReturnValueOnce(false);
    mockReadFile.mockImplementation(() => {
      throw new Error('File not found');
    });
    // Act
    const postData = await getDataById('posts', 'not_found');
    // Assert
    expect(postData).toBe(null);
  });
});

const mockFileA = `---
date: 2023/07/08
---

測試文章A`;

const mockFileB = `---
date: 2023/07/07
---

測試文章B`;

const mockFileC = `---
date: 2023/07/09
---

測試文章C`;
