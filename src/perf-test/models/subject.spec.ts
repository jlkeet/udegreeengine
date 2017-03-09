import { Subject } from './subject';

describe('subject/', () => {
  describe('Subject', () => {
    it('should set subject', () => {
      expect(new Subject( {name: 'subject', $key:'key'}).name).toBe('subject');
    });
  });
});
