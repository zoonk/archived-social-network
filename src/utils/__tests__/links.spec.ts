import {
  containsVimeoUrl,
  containsYoutubeUrl,
  getDomainFromUrl,
} from '../links';

describe('getDomainFromUrl', () => {
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
    const url2 = 'zoonk.org/some/random/path?q=123';
    expect(getDomainFromUrl(url)).toEqual('dev.zoonk.org');
    expect(getDomainFromUrl(url2)).toEqual('unknown');
  });

  test('get a domain for urls with multiple paths', () => {
    const url = 'http://zoonk.com.br/some/random/path?q=123';
    const url2 = 'https://zoonk.co.uk/some/random/path?q=123';
    const url3 = 'zoonk.com.br/some/random/path?q=123';
    expect(getDomainFromUrl(url)).toEqual('zoonk.com.br');
    expect(getDomainFromUrl(url2)).toEqual('zoonk.co.uk');
    expect(getDomainFromUrl(url3)).toEqual('unknown');
  });

  test('remove www from the domain name', () => {
    const url = 'http://www.zoonk.org/some/random/path?q=123';
    expect(getDomainFromUrl(url)).toEqual('zoonk.org');
  });
});

describe('containsYoutubeUrl', () => {
  test('return a valid Youtube ID', () => {
    expect(containsYoutubeUrl('youtu.be/GTpSRxyQL8Q')).toEqual('GTpSRxyQL8Q');
    expect(containsYoutubeUrl('www.youtu.be/GTpSRxyQL8Q')).toEqual(
      'GTpSRxyQL8Q',
    );
    expect(containsYoutubeUrl('http://youtu.be/GTpSRxyQL8Q')).toEqual(
      'GTpSRxyQL8Q',
    );
    expect(containsYoutubeUrl('http://www.youtu.be/GTpSRxyQL8Q')).toEqual(
      'GTpSRxyQL8Q',
    );
    expect(containsYoutubeUrl('https://youtu.be/GTpSRxyQL8Q')).toEqual(
      'GTpSRxyQL8Q',
    );
    expect(containsYoutubeUrl('https://www.youtu.be/GTpSRxyQL8Q')).toEqual(
      'GTpSRxyQL8Q',
    );
    expect(containsYoutubeUrl('youtube.com/embed/GTpSRxyQL8Q')).toEqual(
      'GTpSRxyQL8Q',
    );
    expect(
      containsYoutubeUrl('youtube.com/embed/GTpSRxyQL8Q&other_params'),
    ).toEqual('GTpSRxyQL8Q');
    expect(containsYoutubeUrl('www.youtube.com/embed/GTpSRxyQL8Q')).toEqual(
      'GTpSRxyQL8Q',
    );
    expect(
      containsYoutubeUrl('www.youtube.com/embed/GTpSRxyQL8Q&other_params'),
    ).toEqual('GTpSRxyQL8Q');
    expect(containsYoutubeUrl('http://youtube.com/embed/GTpSRxyQL8Q')).toEqual(
      'GTpSRxyQL8Q',
    );
    expect(
      containsYoutubeUrl('http://youtube.com/embed/GTpSRxyQL8Q&other_params'),
    ).toEqual('GTpSRxyQL8Q');
    expect(
      containsYoutubeUrl('http://www.youtube.com/embed/GTpSRxyQL8Q'),
    ).toEqual('GTpSRxyQL8Q');
    expect(
      containsYoutubeUrl(
        'http://www.youtube.com/embed/GTpSRxyQL8Q&other_params',
      ),
    ).toEqual('GTpSRxyQL8Q');
    expect(containsYoutubeUrl('https://youtube.com/embed/GTpSRxyQL8Q')).toEqual(
      'GTpSRxyQL8Q',
    );
    expect(
      containsYoutubeUrl('https://youtube.com/embed/GTpSRxyQL8Q&other_params'),
    ).toEqual('GTpSRxyQL8Q');
    expect(
      containsYoutubeUrl('https://www.youtube.com/embed/GTpSRxyQL8Q'),
    ).toEqual('GTpSRxyQL8Q');
    expect(
      containsYoutubeUrl(
        'https://www.youtube.com/embed/GTpSRxyQL8Q&other_params',
      ),
    ).toEqual('GTpSRxyQL8Q');
    expect(containsYoutubeUrl('youtube.com/v/GTpSRxyQL8Q')).toEqual(
      'GTpSRxyQL8Q',
    );
    expect(
      containsYoutubeUrl('youtube.com/v/GTpSRxyQL8Q&other_params'),
    ).toEqual('GTpSRxyQL8Q');
    expect(containsYoutubeUrl('www.youtube.com/v/GTpSRxyQL8Q')).toEqual(
      'GTpSRxyQL8Q',
    );
    expect(
      containsYoutubeUrl('www.youtube.com/v/GTpSRxyQL8Q&other_params'),
    ).toEqual('GTpSRxyQL8Q');
    expect(containsYoutubeUrl('http://youtube.com/v/GTpSRxyQL8Q')).toEqual(
      'GTpSRxyQL8Q',
    );
    expect(
      containsYoutubeUrl('http://youtube.com/v/GTpSRxyQL8Q&other_params'),
    ).toEqual('GTpSRxyQL8Q');
    expect(containsYoutubeUrl('http://www.youtube.com/v/GTpSRxyQL8Q')).toEqual(
      'GTpSRxyQL8Q',
    );
    expect(
      containsYoutubeUrl('http://www.youtube.com/v/GTpSRxyQL8Q&other_params'),
    ).toEqual('GTpSRxyQL8Q');
    expect(containsYoutubeUrl('https://youtube.com/v/GTpSRxyQL8Q')).toEqual(
      'GTpSRxyQL8Q',
    );
    expect(
      containsYoutubeUrl('https://youtube.com/v/GTpSRxyQL8Q&other_params'),
    ).toEqual('GTpSRxyQL8Q');
    expect(containsYoutubeUrl('https://www.youtube.com/v/GTpSRxyQL8Q')).toEqual(
      'GTpSRxyQL8Q',
    );
    expect(
      containsYoutubeUrl('https://www.youtube.com/v/GTpSRxyQL8Q&other_params'),
    ).toEqual('GTpSRxyQL8Q');
    expect(containsYoutubeUrl('youtube.com/watch?v=GTpSRxyQL8Q')).toEqual(
      'GTpSRxyQL8Q',
    );
    expect(
      containsYoutubeUrl('youtube.com/watch?v=GTpSRxyQL8Q&other_params'),
    ).toEqual('GTpSRxyQL8Q');
    expect(
      containsYoutubeUrl('youtube.com/watch?other_params&v=GTpSRxyQL8Q'),
    ).toEqual('GTpSRxyQL8Q');
    expect(
      containsYoutubeUrl(
        'youtube.com/watch?other_params&v=GTpSRxyQL8Q&more_params',
      ),
    ).toEqual('GTpSRxyQL8Q');
    expect(containsYoutubeUrl('www.youtube.com/watch?v=GTpSRxyQL8Q')).toEqual(
      'GTpSRxyQL8Q',
    );
    expect(
      containsYoutubeUrl('www.youtube.com/watch?v=GTpSRxyQL8Q&other_params'),
    ).toEqual('GTpSRxyQL8Q');
    expect(
      containsYoutubeUrl('www.youtube.com/watch?other_params&v=GTpSRxyQL8Q'),
    ).toEqual('GTpSRxyQL8Q');
    expect(
      containsYoutubeUrl(
        'www.youtube.com/watch?other_params&v=GTpSRxyQL8Q&more_params',
      ),
    ).toEqual('GTpSRxyQL8Q');
    expect(
      containsYoutubeUrl('http://youtube.com/watch?v=GTpSRxyQL8Q'),
    ).toEqual('GTpSRxyQL8Q');
    expect(
      containsYoutubeUrl('http://youtube.com/watch?v=GTpSRxyQL8Q&other_params'),
    ).toEqual('GTpSRxyQL8Q');
    expect(
      containsYoutubeUrl('http://youtube.com/watch?other_params&v=GTpSRxyQL8Q'),
    ).toEqual('GTpSRxyQL8Q');
    expect(
      containsYoutubeUrl(
        'http://youtube.com/watch?other_params&v=GTpSRxyQL8Q&more_params',
      ),
    ).toEqual('GTpSRxyQL8Q');
    expect(
      containsYoutubeUrl('http://www.youtube.com/watch?v=GTpSRxyQL8Q'),
    ).toEqual('GTpSRxyQL8Q');
    expect(
      containsYoutubeUrl(
        'http://www.youtube.com/watch?v=GTpSRxyQL8Q&other_params',
      ),
    ).toEqual('GTpSRxyQL8Q');
    expect(
      containsYoutubeUrl(
        'http://www.youtube.com/watch?other_params&v=GTpSRxyQL8Q',
      ),
    ).toEqual('GTpSRxyQL8Q');
    expect(
      containsYoutubeUrl(
        'http://www.youtube.com/watch?other_params&v=GTpSRxyQL8Q&more_params',
      ),
    ).toEqual('GTpSRxyQL8Q');
    expect(
      containsYoutubeUrl('https://youtube.com/watch?v=GTpSRxyQL8Q'),
    ).toEqual('GTpSRxyQL8Q');
    expect(
      containsYoutubeUrl(
        'https://youtube.com/watch?v=GTpSRxyQL8Q&other_params',
      ),
    ).toEqual('GTpSRxyQL8Q');
    expect(
      containsYoutubeUrl(
        'https://youtube.com/watch?other_params&v=GTpSRxyQL8Q',
      ),
    ).toEqual('GTpSRxyQL8Q');
    expect(
      containsYoutubeUrl(
        'https://youtube.com/watch?other_params&v=GTpSRxyQL8Q&more_params',
      ),
    ).toEqual('GTpSRxyQL8Q');
    expect(
      containsYoutubeUrl('https://www.youtube.com/watch?v=GTpSRxyQL8Q'),
    ).toEqual('GTpSRxyQL8Q');
    expect(
      containsYoutubeUrl(
        'https://www.youtube.com/watch?v=GTpSRxyQL8Q&other_params',
      ),
    ).toEqual('GTpSRxyQL8Q');
    expect(
      containsYoutubeUrl(
        'https://www.youtube.com/watch?other_params&v=GTpSRxyQL8Q',
      ),
    ).toEqual('GTpSRxyQL8Q');
    expect(
      containsYoutubeUrl(
        'https://www.youtube.com/watch?other_params&v=GTpSRxyQL8Q&more_params',
      ),
    ).toEqual('GTpSRxyQL8Q');
  });

  test('return a Youtube ID when the link is inside a text', () => {
    const beginning =
      'https://youtube.com/watch?v=GTpSRxyQL8Q is the link of the video.';
    const middle =
      'I saw this video: https://youtube.com/watch?v=GTpSRxyQL8Q.it rocks!';
    const end = 'Check out this video:https://youtube.com/watch?v=GTpSRxyQL8Q';

    expect(containsYoutubeUrl(beginning)).toEqual('GTpSRxyQL8Q');
    expect(containsYoutubeUrl(middle)).toEqual('GTpSRxyQL8Q');
    expect(containsYoutubeUrl(end)).toEqual('GTpSRxyQL8Q');
  });

  test('return null when the link is not a valid Youtube url', () => {
    expect(containsYoutubeUrl('https://zoonk.org')).toBe(null);
    expect(containsYoutubeUrl('https://youtube.com/watch?v=invalid')).toBe(
      null,
    );
  });
});

describe('containsVimeoUrl', () => {
  test('return a player Vimeo ID', () => {
    const url = 'https://player.vimeo.com/video/26689853';
    const id = '26689853';
    expect(containsVimeoUrl(url)).toEqual(id);
  });

  test('return a Vimeo ID containg url params', () => {
    const url = 'https://player.vimeo.com/video/26689853?test=true&test2=false';
    const id = '26689853';
    expect(containsVimeoUrl(url)).toEqual(id);
  });

  test('return a Vimeo ID from a channel', () => {
    const url = 'https://vimeo.com/channels/staffpicks/422276660';
    const id = '422276660';
    expect(containsVimeoUrl(url)).toEqual(id);
  });

  test('return a Vimeo ID when the link is inside a text', () => {
    const beginning = 'https://vimeo.com/184374353 is the link of the video.';
    const middle = 'I saw this video: https://vimeo.com/184374353.it rocks!';
    const end = 'Check out this video:https://vimeo.com/184374353';

    expect(containsVimeoUrl(beginning)).toEqual('184374353');
    expect(containsVimeoUrl(middle)).toEqual('184374353');
    expect(containsVimeoUrl(end)).toEqual('184374353');
  });

  test('return null when the link is not a valid Vimeo url', () => {
    expect(containsVimeoUrl('https://zoonk.org')).toBe(null);
    expect(containsVimeoUrl('https://vimeo.com/invalid')).toBe(null);
  });
});
