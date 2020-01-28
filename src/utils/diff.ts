import { flattenDeep, isArray, isEqual, isPlainObject, isString } from 'lodash';
import * as Diff from 'diff';
import { ObjDiff } from '@zoonk/models';

interface Changes {
  added: boolean;
  removed: boolean;
  field: string;
  value: string;
}

/**
 * Compare two objects and get a list with the keys from all changed fields.
 */
export const getChangedFields = (before: any, after: any): string[] => {
  const previous = { ...before };
  const newest = { ...after };
  const fields = { ...previous, ...newest };

  return Object.keys(fields).filter(
    (key) => !isEqual(previous?.[key], newest?.[key]),
  );
};

const getStringChanges = (
  before: string | undefined,
  after: string | undefined,
  action: 'added' | 'removed',
): string => {
  const diff = Diff.diffSentences(before || '', after || '');
  const added = diff.filter((item) => item[action]);
  const mapValue = added.map((item) => item.value);

  return mapValue.join(' [...] ');
};

const getObjChanges = (
  before: any,
  after: any,
  action: 'added' | 'removed',
): Changes[] => {
  const mainObj = action === 'added' ? { ...after } : { ...before };

  const items = Object.entries(mainObj || {}).map(([key, value]) => {
    const oldObjField = before?.[key];
    const newObjField = after?.[key];
    const isEqualObjField = isEqual(oldObjField, newObjField);
    let changes = value;

    // Get changes for a string.
    if (isString(value)) {
      changes = getStringChanges(oldObjField, newObjField, action);
    }

    if (isArray(value)) {
      const mapArrFields = value.map((item, index) => {
        const oldArrField = before?.[key]?.[index];
        const newArrField = after?.[key]?.[index];
        const isEqualArrField = isEqual(oldArrField, newArrField);

        if (isPlainObject(item)) {
          return getObjChanges(oldArrField, newArrField, action);
        }

        return {
          added: action === 'added' && !isEqualArrField,
          removed: action === 'removed' && !isEqualArrField,
          field: key,
          value: String(item),
        };
      });

      return mapArrFields;
    }

    if (isPlainObject(value)) {
      return getObjChanges(oldObjField, newObjField, action);
    }

    return {
      added: action === 'added' && !isEqualObjField,
      removed: action === 'removed' && !isEqualObjField,
      field: key,
      value: String(changes),
    };
  });

  return flattenDeep(items).filter((item) => item[action]);
};

/**
 * Compare two objects and display which fields have changed.
 */
export const getObjDiff = (before: any, after: any): ObjDiff => {
  const removedItems = getObjChanges(before, after, 'removed');
  const addedItems = getObjChanges(before, after, 'added');

  const beforeChanges = removedItems.map((item) => ({
    field: item.field,
    value: item.value,
  }));
  const afterChanges = addedItems.map((item) => ({
    field: item.field,
    value: item.value,
  }));

  return { before: beforeChanges, after: afterChanges };
};
