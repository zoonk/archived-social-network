export const initialTable = [
  {
    type: 'table',
    children: [
      {
        type: 'table-row',
        children: [
          {
            type: 'table-cell',
            children: [{ text: 'col1', bold: true }],
          },
          {
            type: 'table-cell',
            children: [{ text: 'col2', bold: true }],
          },
          {
            type: 'table-cell',
            children: [{ text: 'col3', bold: true }],
          },
        ],
      },
      {
        type: 'table-row',
        children: [
          {
            type: 'table-cell',
            children: [{ text: '' }],
          },
          {
            type: 'table-cell',
            children: [{ text: '' }],
          },
          {
            type: 'table-cell',
            children: [{ text: '' }],
          },
        ],
      },
    ],
  },
  { type: 'paragraph', children: [{ text: '' }] },
];
