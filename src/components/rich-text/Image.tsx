import { forwardRef } from 'react';
import { Element } from 'slate';
import { useFocused, useSelected } from 'slate-react';
import { theme } from '@zoonk/utils';

interface ImageProps {
  attributes: any;
  children: React.ReactNode;
  element: Element;
}

const Image = forwardRef<HTMLImageElement, ImageProps>((props, ref) => {
  const { attributes, children, element } = props;
  const { src, height, width, align, title } = element as any;
  const selected = useSelected();
  const focused = useFocused();
  const float = align === 'left' || align === 'right' ? align : 'none';

  if (!src) return null;

  return (
    <div {...attributes}>
      <div
        contentEditable={false}
        style={{
          float,
          textAlign: align,
          marginRight: align === 'right' ? 0 : theme.spacing(2),
          marginLeft: align === 'left' ? 0 : theme.spacing(2),
          marginTop: theme.spacing(2),
          marginBottom: theme.spacing(2),
        }}
      >
        <img
          ref={ref}
          src={src}
          title={title}
          alt={title}
          style={{
            maxWidth: '100%',
            width,
            height: height || 'auto',
            boxShadow: selected && focused ? '0 0 0 3px #B4D5FF' : 'none',
          }}
        />
        {title && (
          <figcaption
            style={{
              textAlign: 'center',
              color: theme.palette.text.secondary,
              padding: theme.spacing(1),
            }}
          >
            {title}
          </figcaption>
        )}
      </div>
      {children}
    </div>
  );
});

export default Image;
