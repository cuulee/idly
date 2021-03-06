import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { map as rxMap } from 'rxjs/operators/map';
import { switchMap } from 'rxjs/operators/switchMap';
import { Store } from '../store/index';
import { workerOperations } from '../worker';
import { Actions } from './Actions';

export function selectEntityStream(
  store: Observable<Store['interaction']>,
  actions: Actions
) {
  store
    .pipe(
      rxMap(({ selectedId }) => selectedId),
      distinctUntilChanged(),
      switchMap((selectedId = '') =>
        fromPromise(workerOperations.getEntityMetadata({ id: selectedId }))
      )
    )
    .subscribe(r => actions.addEntityTree(r));
}
