import { getDomainFromUrl } from '../links';

test('get a domain when the url has http://', () => {
  const url = 'http://zoonk.org/some/random/path?q=123';
  expect(getDomainFromUrl(url)).toEqual('zoonk.org');
});

test('get a domain when the url has https://', () => {
  const url = 'https://zoonk.org/some/random/path?q=123';
  expect(getDomainFromUrl(url)).toEqual('zoonk.org');
});

test('get a domain when the url has ftp://', () => {
  const url = 'ftp://zoonk.org/some/random/path?q=123';
  expect(getDomainFromUrl(url)).toEqual('zoonk.org');
});

test('get a domain when the url has ws://', () => {
  const url = 'ws://zoonk.org/some/random/path?q=123';
  expect(getDomainFromUrl(url)).toEqual('zoonk.org');
});

test('get a domain when the url has a subdomain.', () => {
  const url = 'http://dev.zoonk.org/some/random/path?q=123';
  const url2 = 'https://www.zoonk.org/some/random/path?q=123';
  const url3 = 'www.zoonk.org/some/random/path?q=123';
  expect(getDomainFromUrl(url)).toEqual('dev.zoonk.org');
  expect(getDomainFromUrl(url2)).toEqual('www.zoonk.org');
  expect(getDomainFromUrl(url3)).toEqual('unknown');
});

test('get a domain for urls with multiple paths', () => {
  const url = 'http://zoonk.com.br/some/random/path?q=123';
  const url2 = 'https://zoonk.co.uk/some/random/path?q=123';
  const url3 = 'zoonk.com.br/some/random/path?q=123';
  expect(getDomainFromUrl(url)).toEqual('zoonk.com.br');
  expect(getDomainFromUrl(url2)).toEqual('zoonk.co.uk');
  expect(getDomainFromUrl(url3)).toEqual('unknown');
});
