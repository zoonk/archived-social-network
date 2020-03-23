import * as Diff from 'diff';

export const getFieldDiff = (
  oldText: any = '',
  newText: any = '',
): Diff.Change[] => {
  return Diff.diffWords(JSON.stringify(oldText), JSON.stringify(newText)).map(
    (item) => {
      const hasChanges = item.added || item.removed;
      let newValue = item.value;

      if (item.value.length > 150) {
        const start = item.value.slice(0, 75);
        const end = item.value.slice(item.value.length - 75);
        newValue = `${start} [...] ${end}`;
      }

      return hasChanges ? item : { ...item, value: newValue };
    },
  );
};
