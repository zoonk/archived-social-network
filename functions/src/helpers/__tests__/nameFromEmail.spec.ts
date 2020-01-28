import { getNameFromEmail } from '../nameFromEmail';

it('should return a name coming before @', () => {
  expect(getNameFromEmail('elon@gmail.com')).toBe('elon');
  expect(getNameFromEmail('davinci')).toBe('davinci');
});
