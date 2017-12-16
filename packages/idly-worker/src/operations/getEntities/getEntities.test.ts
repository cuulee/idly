import { XML3 } from '../../misc/fixtures';
import { stubWorkerLogic } from '../../mocks/PromiseWorkerStub';
import { xmlFetchMock } from '../../mocks/xmlFetchMock';

import { setOsmTiles } from '../setOsmTiles/main';
import { getEntities } from './main';

declare var global: any;

describe('getEntities', () => {
  const promiseWorker = stubWorkerLogic();
  global.fetch = xmlFetchMock(XML3);
  test('small xml test', async () => {
    await setOsmTiles(promiseWorker)({
      bbox: [
        -73.98630242339283,
        40.73537277780156,
        -73.98264244865518,
        40.73941515574535,
      ],
      zoom: 17.54,
    });
    const resp1 = getEntities(promiseWorker)({ entityIds: ['n1'] });
    const resp2 = getEntities(promiseWorker)({
      entityIds: ['n2', 'w1'],
    });
    expect(await resp1).toMatchSnapshot();
    expect(await resp2).toMatchSnapshot();
  });
});

describe('should throw Error when entity not found', () => {
  const promiseWorker = stubWorkerLogic();
  global.fetch = xmlFetchMock(XML3);
  test('small xml test', async () => {
    await setOsmTiles(promiseWorker)({
      bbox: [
        -73.98630242339283,
        40.73537277780156,
        -73.98264244865518,
        40.73941515574535,
      ],
      zoom: 17.54,
    });

    try {
      await getEntities(promiseWorker)({ entityIds: ['n8'] });
    } catch (e) {
      expect(e).toMatch('Entity IDs not found');
    }
  });
});