import * as React from 'react';
import * as turf from 'turf';

import { Entities } from 'osm/entities/entities';

import { Layer } from 'map/layer';

interface IPropsType {
  sourceName: string;
  dirtyMapAccess;
}

export class Source extends React.PureComponent<IPropsType, {}> {
  state = {
    sourceLoaded: false
  };
  componentDidMount() {
    this.props.dirtyMapAccess(map => {
      map.addSource(this.props.sourceName, {
        type: 'geojson',
        data: turf.featureCollection([])
      });
      // might want to check back on this
      this.setState({ sourceLoaded: true });
    });
  }
  render() {
    if (this.state.sourceLoaded) {
      return (
        <span>
          {this.props.children}
        </span>
      );
    }
    return null;
  }
}