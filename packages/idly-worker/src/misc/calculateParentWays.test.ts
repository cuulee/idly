import { Map as ImMap, Set as ImSet } from 'immutable';

import { entityTableGen } from 'idly-common/lib/osm/entityTableGen';

import { nodeFactory, wayFactory } from 'idly-common/lib/osm/entityFactory';
import { calculateParentWays } from './calculateParentWays';

describe('calculateParentWays ', () => {
  const n1 = nodeFactory({
    id: 'n1',
  });
  const n2 = nodeFactory({
    id: 'n2',
  });
  const w1 = wayFactory({
    id: 'w1',
    nodes: ['n1', 'n2'],
  });
  entityTableGen();
  it('works', () => {
    expect(calculateParentWays(ImMap(), ImSet())).toEqual(ImMap());
  });
  it('simple parentWays generation', () => {
    expect(calculateParentWays(entityTableGen([n1, n2, w1]))).toEqual(
      ImMap({
        n1: ImSet(['w1']),
        n2: ImSet(['w1']),
      })
    );
  });
  it('takes existing parentways and adds a way', () => {
    const existingParentWay = ImMap({
      n1: ImSet(['w1']),
      n2: ImSet(['w1']),
    });

    const w2 = wayFactory({ id: 'w2', nodes: ['n1'] });
    expect(
      calculateParentWays(
        entityTableGen([n1, n2, w1, w2]),
        undefined,
        existingParentWay
      )
    ).toEqual(
      ImMap({
        n1: ImSet(['w1', 'w2']),
        n2: ImSet(['w1']),
      })
    );
  });
});
