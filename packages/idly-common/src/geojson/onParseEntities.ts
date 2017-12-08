import { Set as ImSet } from 'immutable';

import {
  EntityTable,
  EntityType,
  FeaturePropsTable,
  ParentWays,
} from '../osm/structures';
import { nodePropertiesGen } from './nodeProps';
import { wayPropertiesGen } from './wayProps';

export const PLUGIN_NAME = 'osm_basic';

function nameSpaceKeys(name: string, obj: { [index: string]: string }) {
  var newObj = {};
  Object.keys(obj).forEach(k => {
    newObj[name + '--' + k] = obj[k];
  });
  return newObj;
}
/**
 * meant to run purely on a separate thread.
 * @param entityTable
 * @param parentWays
 */
export function onParseEntities(
  entityTable: EntityTable,
  parentWays: ParentWays,
): FeaturePropsTable {
  const fProps: FeaturePropsTable = new Map();
  entityTable.forEach((entity, id) => {
    if (entity.type === EntityType.NODE) {
      // @TOFIX why do we need to send the entire parentWays lol.
      var x = nameSpaceKeys(
        PLUGIN_NAME,
        nodePropertiesGen(entity, parentWays.get(entity.id) || ImSet()),
      );
      fProps.set(id, x);
    }
    if (entity.type === EntityType.WAY) {
      fProps.set(id, nameSpaceKeys(PLUGIN_NAME, wayPropertiesGen(entity)));
    }
  });
  return fProps;
}