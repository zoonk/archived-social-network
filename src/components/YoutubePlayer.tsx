interface YoutubePlayerProps {
  id: string;
}

function YoutubePlayer({ id }: YoutubePlayerProps) {
  return (
    <div
      style={{
        position: 'relative',
        paddingBottom: '56.25%',
        paddingTop: '25px',
        height: 0,
      }}
    >
      <iframe
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${id}`}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={id}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
}

export default YoutubePlayer;
