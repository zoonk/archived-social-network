export interface FieldDiff {
  field: string;
  value: string;
}

export interface ObjDiff {
  after: FieldDiff[];
  before: FieldDiff[];
}
