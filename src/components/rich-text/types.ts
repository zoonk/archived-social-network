import { Editor, Location, Point } from 'slate';

export type Unit = 'character' | 'word' | 'line' | 'block';
export type OperationFn = (unit: Unit) => void;
export type PointFn = (editor: Editor, at: Location) => Point;

export type AlignOption = 'center' | 'left' | 'right';
