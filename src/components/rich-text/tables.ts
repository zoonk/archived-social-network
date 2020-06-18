/* eslint-disable no-param-reassign */
import { Editor, Path, Point, Range, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { isBlockActive } from './blocks';
import { initialTable } from './data';
import { OperationFn, PointFn, Unit } from './types';

export const withTables = (editor: ReactEditor) => {
  const { deleteBackward, deleteForward, insertBreak } = editor;

  const preventDeleteCell = (operation: OperationFn, point: PointFn) => (
    unit: Unit,
  ) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [cell] = Editor.nodes(editor, {
        match: (n) => n.type === 'table-cell',
      });

      if (cell) {
        const [, cellPath] = cell;
        const start = point(editor, cellPath);

        if (Point.equals(selection.anchor, start)) {
          return;
        }
      }
    }

    operation(unit);
  };

  editor.deleteBackward = preventDeleteCell(deleteBackward, Editor.start);
  editor.deleteForward = preventDeleteCell(deleteForward, Editor.end);

  editor.insertBreak = () => {
    const { selection } = editor;

    if (selection) {
      const [table] = Editor.nodes(editor, {
        match: (n) => n.type === 'table',
      });

      if (table) {
        return;
      }
    }

    insertBreak();
  };

  return editor;
};

export const deleteTable = (editor: Editor) => {
  const tableItem = Editor.above(editor, {
    match: (n) => n.type === 'table',
  });

  if (tableItem) {
    Transforms.removeNodes(editor, {
      at: tableItem[1],
    });
  }
};

export const insertTable = (editor: Editor) => {
  const { selection } = editor;
  if (!selection) return;

  if (isBlockActive(editor, 'table')) {
    deleteTable(editor);
    return;
  }

  Transforms.insertNodes(editor, initialTable);
};

export const deleteRow = (editor: Editor) => {
  const currentTableItem = Editor.above(editor, {
    match: (n) => n.type === 'table',
  });

  const currentRowItem = Editor.above(editor, {
    match: (n) => n.type === 'table-row',
  });

  if (
    currentRowItem &&
    currentTableItem &&
    currentTableItem[0].children.length > 1
  ) {
    Transforms.removeNodes(editor, {
      at: currentRowItem[1],
    });
  }
};

export const deleteColumn = (editor: Editor) => {
  const currentCellItem = Editor.above(editor, {
    match: (n) => n.type === 'table-cell',
  });

  const currentRowItem = Editor.above(editor, {
    match: (n) => n.type === 'table-row',
  });

  const currentTableItem = Editor.above(editor, {
    match: (n) => n.type === 'table',
  });

  if (
    currentCellItem &&
    currentRowItem &&
    currentTableItem &&
    currentRowItem[0].children.length > 1
  ) {
    const currentCellPath = currentCellItem[1];
    const pathToDelete = currentCellPath.slice();
    const replacePathPos = pathToDelete.length - 2;

    currentTableItem[0].children.forEach((row, rowIdx) => {
      pathToDelete[replacePathPos] = rowIdx;

      Transforms.removeNodes(editor, {
        at: pathToDelete,
      });
    });
  }
};

export const addColumn = (editor: Editor) => {
  const currentCellItem = Editor.above(editor, {
    match: (n) => n.type === 'table-cell',
  });

  const currentTableItem = Editor.above(editor, {
    match: (n) => n.type === 'table',
  });

  const column = {
    type: 'table-cell',
    children: [{ text: '' }],
  };
  const firstColumn = {
    type: 'table-cell',
    children: [{ text: 'col', bold: true }],
  };

  if (currentCellItem && currentTableItem) {
    const nextCellPath = Path.next(currentCellItem[1]);
    const newCellPath = nextCellPath.slice();
    const replacePathPos = newCellPath.length - 2;
    const currentRowIdx = nextCellPath[replacePathPos];

    currentTableItem[0].children.forEach((row, rowIdx) => {
      newCellPath[replacePathPos] = rowIdx;
      const node = rowIdx === 0 ? firstColumn : column;

      Transforms.insertNodes(editor, node, {
        at: newCellPath,
        select: rowIdx === currentRowIdx,
      });
    });
  }
};

export const addRow = (editor: Editor) => {
  const currentRowItem = Editor.above(editor, {
    match: (n) => n.type === 'table-row',
  });

  if (currentRowItem) {
    const [currentRowElem, currentRowPath] = currentRowItem;
    const columns = currentRowElem.children.length;

    const row = {
      type: 'table-row',
      children: Array(columns)
        .fill(columns)
        .map((_, index) => ({
          type: 'table-cell',
          id: index,
          children: [{ text: '' }],
        })),
    };

    Transforms.insertNodes(editor, row, {
      at: Path.next(currentRowPath),
      select: false,
    });
  }
};
