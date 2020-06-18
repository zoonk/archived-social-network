interface VimeoPlayerProps {
  id: string;
}

const VimeoPlayer = ({ id }: VimeoPlayerProps) => {
  return (
    <div style={{ padding: '42.19% 0 0 0', position: 'relative' }}>
      <iframe
        src={`https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
        frameBorder={0}
        allow="fullscreen"
        allowFullScreen
        title="Vimeo"
      />
      <script src="https://player.vimeo.com/api/player.js" />
    </div>
  );
};

export default VimeoPlayer;
