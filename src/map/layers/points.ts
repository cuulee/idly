import { Set } from 'immutable';
import * as React from 'react';

import { Entities } from 'core/coreOperations';

interface IPropsType {
  name: string;
  sourceName: string;
  dirtyMapAccess;
  entities: Entities;
  updateSource: (
    data: Entities,
    dirtyMapAccess: (map: any) => void,
    sourceId: string
  ) => void;
}

export class Layer extends React.PureComponent<IPropsType, {}> {
  private style;
  private layerId;
  private layers;
  private hiddenEntites: Entities = Set();
  constructor(props: IPropsType) {
    super(props);
    this.layerId = props.name;
    this.layers = styleFactory(this.layerId, props.sourceName);
    this.addLayer(this.layers);
    this.props.dirtyMapAccess(map => {
      map.on('mouseenter', this.layerId, e => {
        // Change the cursor style as a UI indicator.
        const bbox = [
          [e.point.x - 4, e.point.y - 4],
          [e.point.x + 4, e.point.y + 4]
        ];
        if (map.queryRenderedFeatures(bbox, this.layerId).length > 0) {
          map.getCanvas().style.cursor = 'pointer';
        }
      });
      map.on('mouseleave', this.layerId, () => {
        map.getCanvas().style.cursor = '';
      });
    });
  }
  componentWillReceiveProps(nextProps) {
    // console.log(
    //   'layer receive props',
    //   this.props.name,
    //   nextProps.entities.size
    // );
    // check for less new entities
    // so you can simply hide them.
    const removedEntities = this.props.entities.subtract(nextProps.entities);
    const addedEntites = nextProps.entities.subtract(this.props.entities);
    if (removedEntities.size > 0 && addedEntites.size === 0) {
      console.log(
        'hidding simply at',
        this.layerId,
        'removed entities',
        removedEntities.toJS()
      );
      this.hiddenEntites = this.hiddenEntites.union(removedEntities);
      this.hideEntities(this.hiddenEntites);
    } else if (addedEntites.size > 0) {
      console.log(
        'doing full reload, addedEntites=',
        addedEntites,
        ' at',
        this.layerId,
        'removed=',
        removedEntities
      );
      this.hiddenEntites = this.hiddenEntites.clear();
      this.clearFilter();
      // else update the entire source
      // it is expensive. Need to think of more ways to
      // avoid this.
      this.props.updateSource(
        nextProps.entities,
        this.props.dirtyMapAccess,
        this.props.sourceName
      );
    }
  }
  clearFilter = () => {
    this.props.dirtyMapAccess(map => {
      map.setFilter(this.layerId, ['all']);
    });
  };
  hideEntities = (entities: Entities) => {
    this.props.dirtyMapAccess(map => {
      console.log(
        'hiding these',
        entities.map(e => e.id).toArray(),
        'at',
        this.layerId
      );
      map.setFilter(this.layerId, [
        '!in',
        'id',
        ...entities.map(e => e.id).toArray()
      ]);
    });
  };
  addLayer = layer => {
    this.props.dirtyMapAccess(map => map.addLayer(layer));
  };
  render() {
    return null;
  }
}
/**
 * @TOFIX add text-halo, seems to not work now
 */
const styleFactory = (layerId, sourceId) => ({
  id: layerId,
  type: 'symbol',
  source: sourceId,
  layout: {
    'icon-image': '{icon}-11',
    'icon-allow-overlap': true,
    'text-field': '{name}',
    'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
    'text-size': 9,
    'text-transform': 'uppercase',
    'text-letter-spacing': 0.05,
    'text-offset': [0, 1.5],
    'text-optional': true,
    'text-anchor': 'top',
    'text-allow-overlap': false
  },
  filter: ['all']
});