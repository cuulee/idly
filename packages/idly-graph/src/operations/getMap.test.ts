import { BBox } from '@turf/helpers';
import { ImMap } from 'idly-common/lib/misc/immutable';
import { entityTableGen } from 'idly-common/lib/osm/entityTableGen';
import { nodeFactory } from 'idly-common/lib/osm/nodeFactory';
import { wayFactory } from 'idly-common/lib/osm/wayFactory';
import { calculateParentWays } from '../misc/calculateParentWays';
import { miniXML3, stubXML } from '../misc/fixtures';
import { pluginsStub } from '../misc/pluginsStub';
import { PromiseWorkerStub } from '../misc/PromiseWorkerStub';
import { getMap, workerGetMap } from './getMap';
import { operations } from './operations';
import { WorkerState } from './operationsTypes';
import { setOsmTiles } from './setOsmTiles';

declare var global: any;
// tslint:disable no-expression-statement no-object-mutation

describe('fetchMap: custom controller', () => {
  const req = {
    bbox: [
      -73.98630242339283,
      40.73537277780156,
      -73.98264244865518,
      40.73941515574535,
    ] as BBox,
    zoom: 17.54,
  };
  test('small xml test', async () => {
    global.fetch = jest.fn().mockImplementation(() => {
      return new Promise((resolve, reject) => {
        resolve({
          id: '123',
          text(): Promise<any> {
            return Promise.resolve(miniXML3);
          },
          ok: true,
        });
      });
    });
    const promiseWorker = new PromiseWorkerStub();
    const controller = operations(pluginsStub());

    promiseWorker.registerPromiseWorker(controller);
    // TOFIX use a static state
    await setOsmTiles(promiseWorker)({
      bbox: [
        -73.98630242339283,
        40.73537277780156,
        -73.98264244865518,
        40.73941515574535,
      ],
      zoom: 17.54,
    });
    const bindedFetchMap = getMap(promiseWorker);
    const resp = await bindedFetchMap({
      bbox: [
        -73.98630242339283,
        40.73537277780156,
        -73.98264244865518,
        40.73941515574535,
      ],
      zoom: 17.54,
    });
    expect(resp).toMatchSnapshot();
  });

  test('filtering of hidden entities', async () => {
    global.fetch = jest.fn().mockImplementation(() => {
      return new Promise((resolve, reject) => {
        resolve({
          id: '123',
          text(): Promise<any> {
            return Promise.resolve(miniXML3);
          },
          ok: true,
        });
      });
    });
    const promiseWorker = new PromiseWorkerStub();
    const controller = operations(pluginsStub());

    promiseWorker.registerPromiseWorker(controller);
    // TOFIX use a static state
    await setOsmTiles(promiseWorker)({
      bbox: [
        -73.98630242339283,
        40.73537277780156,
        -73.98264244865518,
        40.73941515574535,
      ],
      zoom: 17.54,
    });
    const bindedFetchMap = getMap(promiseWorker);

    const resp = await bindedFetchMap({
      bbox: [
        -73.98630242339283,
        40.73537277780156,
        -73.98264244865518,
        40.73941515574535,
      ],
      hiddenIds: ['w2', 'n1', 'n2'],
      zoom: 17.54,
    });
    expect(resp.features.map(r => r.id)).toEqual(['n3', 'w1']);
  });
  test('big xml test', async () => {
    global.fetch = jest.fn().mockImplementation(() => {
      return new Promise((resolve, reject) => {
        resolve({
          id: '123',
          text(): Promise<any> {
            return Promise.resolve(stubXML);
          },
          ok: true,
        });
      });
    });
    const promiseWorker = new PromiseWorkerStub();
    const controller = operations(pluginsStub());

    promiseWorker.registerPromiseWorker(controller);
    // TOFIX use a static state
    await setOsmTiles(promiseWorker)({
      bbox: [
        -73.98630242339283,
        40.73537277780156,
        -73.98264244865518,
        40.73941515574535,
      ],
      zoom: 17.54,
    });
    const bindedFetchMap = getMap(promiseWorker);
    const resp = await bindedFetchMap({
      bbox: [
        -73.98630242339283,
        40.73537277780156,
        -73.98264244865518,
        40.73941515574535,
      ],
      zoom: 17.54,
    });
    expect(resp).toMatchSnapshot();
  });
});
