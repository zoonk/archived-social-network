import functions from 'firebase-functions-test';
import * as helpers from '../../../helpers/url';

const testEnv = functions();

import { onWritePostUpdateSites } from '../updateSites';

beforeEach(() => {
  spyOn(helpers, 'getMetadataFromUrl').and.returnValue('site');
});

afterEach(() => {
  jest.clearAllMocks();
});

test('return when a post is deleted', async (done) => {
  const changes = {
    before: { data: () => ({ links: ['https://zoonk.org'] }) },
    after: { data: () => undefined, ref: { update: jest.fn() } },
  };
  const wrapped = testEnv.wrap(onWritePostUpdateSites);
  const req = await wrapped(changes);

  expect(req).toBe(false);
  expect(changes.after.ref.update).not.toHaveBeenCalled();
  expect(helpers.getMetadataFromUrl).not.toHaveBeenCalled();
  done();
});

test('return when links did not change', async (done) => {
  const links = ['https://zoonk.org'];
  const changes = {
    before: { data: () => ({ links }) },
    after: { data: () => ({ links }), ref: { update: jest.fn() } },
  };
  const wrapped = testEnv.wrap(onWritePostUpdateSites);
  const req = await wrapped(changes);

  expect(req).toBe(false);
  expect(changes.after.ref.update).not.toHaveBeenCalled();
  expect(helpers.getMetadataFromUrl).not.toHaveBeenCalled();
  done();
});

test('return when an array has falsy links only', async (done) => {
  const changes = {
    before: { data: () => ({ links: null }) },
    after: { data: () => ({ links: [''] }), ref: { update: jest.fn() } },
  };
  const wrapped = testEnv.wrap(onWritePostUpdateSites);
  const req = await wrapped(changes);

  expect(req).toBe(false);
  expect(changes.after.ref.update).not.toHaveBeenCalled();
  expect(helpers.getMetadataFromUrl).not.toHaveBeenCalled();
  done();
});

test('update sites for added links', async (done) => {
  const changes = {
    before: { data: () => ({ links: null }) },
    after: {
      data: () => ({ links: ['https://zoonk.org', 'https://wikipedia.org'] }),
      ref: { update: jest.fn().mockReturnValue('updated') },
    },
  };
  const wrapped = testEnv.wrap(onWritePostUpdateSites);
  const req = await wrapped(changes);
  const sites = ['site', 'site'];

  expect(req).toBe('updated');
  expect(changes.after.ref.update).toHaveBeenCalledWith({ sites });
  expect(helpers.getMetadataFromUrl).toHaveBeenCalledWith('https://zoonk.org');
  expect(helpers.getMetadataFromUrl).toHaveBeenCalledWith(
    'https://wikipedia.org',
  );
  done();
});

test('update sites for removed links', async (done) => {
  const changes = {
    before: { data: () => ({ links: ['https://zoonk.org'] }) },
    after: {
      data: () => ({ links: ['https://en.zoonk.org'] }),
      ref: { update: jest.fn().mockReturnValue('updated') },
    },
  };
  const wrapped = testEnv.wrap(onWritePostUpdateSites);
  const req = await wrapped(changes);

  expect(req).toBe('updated');
  expect(changes.after.ref.update).toHaveBeenCalledWith({ sites: ['site'] });
  expect(helpers.getMetadataFromUrl).toHaveBeenCalledWith(
    'https://en.zoonk.org',
  );
  done();
});

test('update sites when links become null', async (done) => {
  const changes = {
    before: { data: () => ({ links: ['https://zoonk.org'] }) },
    after: {
      data: () => ({ links: null }),
      ref: { update: jest.fn().mockReturnValue('updated') },
    },
  };
  const wrapped = testEnv.wrap(onWritePostUpdateSites);
  const req = await wrapped(changes);

  expect(req).toBe('updated');
  expect(changes.after.ref.update).toHaveBeenCalledWith({ sites: [] });
  expect(helpers.getMetadataFromUrl).not.toHaveBeenCalled();
  done();
});
