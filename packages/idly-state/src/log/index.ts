import { weakCache } from 'idly-common/lib/misc/weakCache';

import {
  iterableFlattenToSet,
  setCreate,
  setFind,
  setIntersect,
  setSome,
} from '../helper';

export type ModifiedId = string;

export type Log = ReadonlyArray<Entry>;

export type Entry = ReadonlySet<string>;

export const validVirginId = (str: string) => str.indexOf('#') === 0;

export const validModifiedId = (str: string) => !validVirginId(str);

/**
 * Key Terms
 * log - is the linear history of all modified ids
 * entry - is the smallest revertible set of log i.e the ids in
 *         entry would need to be added or reverted together to be legal modification of log.
 * virginId - is the untouched OSM id, eg n1212, r121
 * modifiedId - is `virginId#version` eg, n121#121, r12#11
 * version - the part after hash # eg, for 12#0 version is 0.
 * currentId - is the most recent modifiedId in the log
 * baseId - the virginId that that relevant id descended from
 */

export const logGetBaseIds: (log: Log) => ReadonlySet<string> = weakCache(
  (log: Log) =>
    log.reduce((prev: Set<string>, cur) => {
      cur.forEach(index => prev.add(modifiedIdGetBaseId(index)));
      return prev;
    }, setCreate())
);

export const logGetCurrentIds: (log: Log) => ReadonlySet<string> = weakCache(
  (log: Log) =>
    new Set(
      log
        .reduce((prev, entry) => {
          entry.forEach(
            index =>
              !prev.has(modifiedIdGetBaseId(index)) &&
              prev.set(modifiedIdGetBaseId(index), index)
          );
          return prev;
        }, new Map<string, string>())
        .values()
    )
);

export const logGetEveryId: (log: Log) => ReadonlySet<string> = weakCache(
  (log: Log) => iterableFlattenToSet<string>(log)
);

export const logRecreate = (...entries: Entry[]) =>
  entries
    .slice(0)
    .reverse()
    .reduce((l, e) => {
      const newLog = logAddEntry(e)(l);
      if (l === newLog) {
        throw new Error('malformed entries');
      }
      return newLog;
    }, logCreate());

export const logCreate = (): Log => Object.freeze([]);

export const doesLogContain = (entry: Entry) => (log: Log) =>
  log.some(e => setIntersect(entry, e).size > 0);

export const logAddEntry = (entry: Entry) => (log: Log) =>
  setSome(index => doesLogHaveNewerOrCurrentVersion(index)(log), entry)
    ? log
    : Object.freeze([entry, ...log]);

export const doesLogHaveNewerOrCurrentVersion = (index: string) => (log: Log) =>
  logGetLatestVersion(index)(log) >= modifiedIdGetVersion(index);

export const modifiedIdGetVersion = (index: ModifiedId) =>
  parseInt(modifiedIdParse(index)[1], 10);

export const logGetLatestVersion = (id: string) => (log: Log) => {
  const finder = entryFindModifiedId(modifiedIdGetBaseId(id));
  let index;
  for (const entry of log) {
    index = finder(entry);
    if (index) {
      return modifiedIdGetVersion(index);
    }
  }
  return -1;
};

export const logGenerateNextModifiedId = (id: string) => (log: Log) =>
  `${modifiedIdGetBaseId(id)}#${logGetLatestVersion(id)(log) + 1}`;

export const entryFindModifiedId = (indexOrId: string) => (entry: Entry) =>
  setFind(i => modifiedIdGetBaseId(i) === indexOrId, entry);

export const modifiedIdGetBaseId = (index: ModifiedId) =>
  modifiedIdParse(index)[0];

const modifiedIdParse = (index: ModifiedId) => index.split('#');

export const modifiedIdIncrement = (index: ModifiedId) =>
  `${modifiedIdGetBaseId(index)}#${modifiedIdGetVersion(index) + 1}`;