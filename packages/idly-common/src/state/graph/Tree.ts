import { Set as ImSet } from 'immutable';

import { Leaf } from './Leaf';

export class Tree {
  public static create(leaf: Leaf): Tree {
    return new Tree(undefined, ImSet([leaf]));
  }
  private readonly parent: Tree | undefined;
  private readonly branch: ImSet<Leaf>;
  constructor(parent: Tree | undefined, branch: ImSet<Leaf>) {
    /* tslint:disable */
    this.parent = parent;
    this.branch = branch;
    /* tslint:enable */
  }

  public getParent(): Tree | undefined {
    return this.parent;
  }
  public getBranch(): ImSet<Leaf> {
    return this.branch;
  }

  // for debugging
  public getDepth(count = 1): number {
    return this.parent ? this.parent.getDepth(count + 1) : count;
  }

  public newBranch(branch: ImSet<Leaf>): Tree {
    return new Tree(this, branch);
  }

  public getOldLeaves(): ImSet<Leaf> {
    if (!this.parent) {
      return ImSet();
    }
    return this.parent.getAllLeaves().subtract(this.branch);
  }

  public getAllLeaves(): ImSet<Leaf> {
    if (!this.parent) {
      return this.branch;
    }
    return this.branch.union(this.parent.getAllLeaves());
  }

  public getAllVirginIds(): string[] {
    const allEntities = this.getAllLeaves().toArray();
    return Array.from(
      allEntities
        .filter((en: Leaf | undefined) => {
          if (en) {
            return en.isFirstGeneration();
          }
          return false;
        })
        .reduce((prev: Set<string>, e: Leaf | undefined) => {
          if (e) {
            /* tslint:disable */
            for (const elem of e.getDependencies()) {
              prev.add(elem);
            }
            /* tslint:enable */
          }
          return prev;
        }, new Set())
    );
  }
}
