import {
  call,
  all,
  takeLatest,
  take,
  select,
  fork,
  put,
  cancel,
  cancelled
} from 'redux-saga/effects';
import { SagaIterator, Effect, Pattern } from 'redux-saga';
import { LngLatBounds } from 'mapbox-gl';
import { bboxPolygon, featureCollection } from 'turf';
import { cancelablePromise } from 'src/network/helper';
import { fetchTile } from 'src/network/osm';

import { action, Action } from 'src/store/actions';

import { OSM_TILES, GetOSMTilesType } from 'src/store/osm_tiles/actions';
import { RootStateType } from 'src/store/';
import { ZOOM } from 'src/map/init';
const SphericalMercator = require('@mapbox/sphericalmercator');

var mercator = new SphericalMercator({
  size: 256
});

export function* watchOSMTiles(): SagaIterator {
  // yield all([takeLatest<Action<GetOSMTilesType>>(OSM_TILES.get, fetchSaga)]);
  yield all([call(watchFetch)]);
}
function* watchFetch(): SagaIterator {
  let forks = [];
  while (true) {
    let { xy, zoom }: Action<GetOSMTilesType> = yield take(OSM_TILES.get);
    if (zoom < ZOOM) continue;
    for (let f = 0; f < forks.length; f++) {
      yield cancel(forks[f]);
    }

    forks = [];
    for (var i = 0; i < xy.length; i++) {
      forks.push(yield fork(fetchTileSaga, xy[i][0], xy[i][1], zoom));
    }
  }
}

function* fetchTileSaga(x: number, y: number, zoom: number) {
  try {
    const tiles = yield select((state: RootStateType) =>
      state.osmTiles.getIn(['tiles', [x, y, zoom].join(',')])
    );
    if (tiles) {
      return;
    }
    const data = yield call(fetchTile, x, y, zoom);
    yield put(
      action(OSM_TILES.saveTile, {
        coords: [x, y, zoom],
        data
      })
    );
  } catch (e) {
  } finally {
    if (yield cancelled()) {
      console.log('canceled');
    }
  }
}