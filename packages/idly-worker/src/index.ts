

import { getDerived } from './operations/getDerived/main';
import { GetDerived } from './operations/getDerived/type';

import { getEntity } from './operations/getEntity/main';
import { GetEntity } from './operations/getEntity/type';

import { getMoveNode } from './operations/getMoveNode/main';
import { GetMoveNode } from './operations/getMoveNode/type';

import { getQuadkey } from './operations/getQuadkey/main';
import { GetQuadkey } from './operations/getQuadkey/type';

import { MainOperation } from './operations/helpers';

export interface WorkerType {
    getDerived: MainOperation<GetDerived>;
    getEntity: MainOperation<GetEntity>;
    getMoveNode: MainOperation<GetMoveNode>;
    getQuadkey: MainOperation<GetQuadkey>;
}

export default function(promiseWorker: any): WorkerType {
    return {
        getDerived: getDerived(promiseWorker),
        getEntity: getEntity(promiseWorker),
        getMoveNode: getMoveNode(promiseWorker),
        getQuadkey: getQuadkey(promiseWorker)
    };
}