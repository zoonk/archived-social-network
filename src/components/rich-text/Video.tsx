import { forwardRef } from 'react';
import dynamic from 'next/dynamic';
import { containsVimeoUrl, containsYoutubeUrl } from '@zoonk/utils';

const VimeoPlayer = dynamic(() => import('../VimeoPlayer'));
const YoutubePlayer = dynamic(() => import('../YoutubePlayer'));

interface VideoProps {
  url: string;
}

const Video = forwardRef<HTMLDivElement, VideoProps>((props, ref) => {
  const { children, url } = props;
  const vimeo = containsVimeoUrl(url);
  const youtube = containsYoutubeUrl(url);

  return (
    <div ref={ref} contentEditable={false}>
      {youtube && <YoutubePlayer id={youtube} />}
      {vimeo && <VimeoPlayer id={vimeo} />}
      {children}
    </div>
  );
});

export default Video;
