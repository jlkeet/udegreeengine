import { Subject } from './subject';

describe('subject/', () => {
  describe('Subject', () => {
    it('should set subject', () => {
      expect(new Subject( {subject: 'subject', $key:'key'}).subject).toBe('subject');
    });
  });
});
