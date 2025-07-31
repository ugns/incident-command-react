import { formatLocalDateTime } from '../dateFormat';

describe('formatLocalDateTime', () => {
  it('formats a date string', () => {
    expect(formatLocalDateTime('2025-07-31')).toMatch(/2025/);
  });
});
