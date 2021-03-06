export const areaTemplate = {
  selectable: false,
  layer: {
    id: undefined,
    type: 'line',
    source: undefined,
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': '#fff',
      'line-width': 1,
      'line-opacity': 1,
    },
    filter: undefined,
  },
};

export const areaCasingTemplate = {
  selectable: false,
  layer: {
    id: undefined,
    type: 'line',
    source: undefined,
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': '#fff',
      'line-width': {
        base: 4,
        stops: [[16, 8], [18, 16], [22, 40]],
      },
      'line-opacity': {
        base: 0.2,
        stops: [[16, 0.6], [18, 0.3], [22, 0.4]],
      },
      'line-offset': {
        base: 4,
        stops: [[16, 4], [18, 8], [22, 21]],
      },
    },
    filter: undefined,
  },
};
