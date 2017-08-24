import { ParentWays } from 'idly-common/lib';

export function dummyParentWaysGen(obj: any) {
  const parentWays: ParentWays = new Map();
  Object.keys(obj).forEach(k => parentWays.set(k, obj[k]));
  return parentWays;
}
