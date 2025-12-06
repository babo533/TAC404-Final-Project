import { renderHook } from '@testing-library/react';
import useDocumentTitle from './useDocumentTitle';

describe('useDocumentTitle Hook', () => {
  test('sets document title correctly', () => {
    const originalTitle = document.title;

    renderHook(() => useDocumentTitle('Dashboard'));

    expect(document.title).toBe('Dashboard - Soccer Training Logger');

    document.title = originalTitle;
  });

  test('updates document title when title changes', () => {
    const { rerender } = renderHook(({ title }) => useDocumentTitle(title), {
      initialProps: { title: 'Dashboard' },
    });

    expect(document.title).toBe('Dashboard - Soccer Training Logger');

    rerender({ title: 'Sessions' });

    expect(document.title).toBe('Sessions - Soccer Training Logger');
  });

  test('restores previous title on unmount', () => {
    const originalTitle = 'Original Title';
    document.title = originalTitle;

    const { unmount } = renderHook(() => useDocumentTitle('Test'));

    expect(document.title).toBe('Test - Soccer Training Logger');

    unmount();

    expect(document.title).toBe(originalTitle);
  });
});
