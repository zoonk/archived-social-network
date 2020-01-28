export interface Dictionary<T> {
  [id: string]: T;
}

export interface Dropdown<T> {
  label: string;
  value: T;
}

export interface MaterialSelect {
  name?: string;
  value: unknown;
}
