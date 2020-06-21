import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { withReact } from 'slate-react';
import { withImages } from './images';
import { withLinks } from './links';
import { withPDF } from './pdf';
import { withTables } from './tables';
import { withVideos } from './videos';

export const withEditor = () =>
  withTables(
    withPDF(
      withVideos(withImages(withLinks(withHistory(withReact(createEditor()))))),
    ),
  );
