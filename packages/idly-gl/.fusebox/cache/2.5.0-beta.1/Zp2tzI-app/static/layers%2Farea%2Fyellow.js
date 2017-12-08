module.exports = { contents: "\"use strict\";\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar helper_1 = require(\"./helper\");\nvar constants_1 = require(\"../../constants\");\nvar filter = [\n    'all',\n    ['==', '$type', 'Polygon'],\n    [\n        'in',\n        constants_1.PLUGIN_NAME + \"--tagsClassType\",\n        'tag-sport-beachvolleyball',\n        'tag-natural-beach',\n        'tag-natural-sand',\n        'tag-natural-scrub',\n        'tag-amenity-childcare',\n        'tag-amenity-kindergarten',\n        'tag-amenity-school',\n        'tag-amenity-college',\n        'tag-amenity-university'\n    ]\n];\nexports.default = [\n    {\n        selectable: false,\n        priority: 1,\n        layer: {\n            id: 'areaYellowLayer',\n            type: 'line',\n            source: undefined,\n            layout: {\n                'line-join': 'round',\n                'line-cap': 'round'\n            },\n            paint: {\n                'line-color': '#ffff94',\n                'line-width': 2,\n                'line-opacity': 1\n            },\n            filter: filter\n        }\n    },\n    {\n        selectable: false,\n        priority: 1,\n        layer: {\n            id: 'areaYellowLayerCasing',\n            type: 'line',\n            source: undefined,\n            layout: {\n                'line-join': 'round',\n                'line-cap': 'round'\n            },\n            paint: Object.assign({}, helper_1.areaPaintStyle, { 'line-color': '#ffff94' }),\n            filter: filter\n        }\n    }\n];\n",
dependencies: ["./helper","../../constants"],
sourceMap: "{\"version\":3,\"file\":\"layers/area/yellow.js\",\"sourceRoot\":\"\",\"sources\":[\"/src/layers/area/yellow.ts\"],\"names\":[],\"mappings\":\";;AAAA,qCAA0C;AAC1C,+CAA8C;AAE9C,MAAM,MAAM,GAAG;IACb,KAAK;IACL,CAAC,IAAI,EAAE,OAAO,EAAE,SAAS,CAAC;IAC1B;QACE,IAAI;QACJ,GAAG,uBAAW,iBAAiB;QAC/B,2BAA2B;QAC3B,mBAAmB;QACnB,kBAAkB;QAClB,mBAAmB;QACnB,uBAAuB;QACvB,0BAA0B;QAC1B,oBAAoB;QACpB,qBAAqB;QACrB,wBAAwB;KACzB;CACF,CAAC;AAEF,kBAAe;IACb;QACE,UAAU,EAAE,KAAK;QACjB,QAAQ,EAAE,CAAC;QACX,KAAK,EAAE;YACL,EAAE,EAAE,iBAAiB;YACrB,IAAI,EAAE,MAAM;YACZ,MAAM,EAAE,SAAS;YACjB,MAAM,EAAE;gBACN,WAAW,EAAE,OAAO;gBACpB,UAAU,EAAE,OAAO;aACpB;YACD,KAAK,EAAE;gBACL,YAAY,EAAE,SAAS;gBACvB,YAAY,EAAE,CAAC;gBACf,cAAc,EAAE,CAAC;aAClB;YACD,MAAM;SACP;KACF;IACD;QACE,UAAU,EAAE,KAAK;QACjB,QAAQ,EAAE,CAAC;QACX,KAAK,EAAE;YACL,EAAE,EAAE,uBAAuB;YAC3B,IAAI,EAAE,MAAM;YACZ,MAAM,EAAE,SAAS;YACjB,MAAM,EAAE;gBACN,WAAW,EAAE,OAAO;gBACpB,UAAU,EAAE,OAAO;aACpB;YACD,KAAK,oBAAO,uBAAc,IAAE,YAAY,EAAE,SAAS,GAAE;YACrD,MAAM;SACP;KACF;CACF,CAAC\",\"sourcesContent\":[\"import { areaPaintStyle } from './helper';\\nimport { PLUGIN_NAME } from '../../constants';\\n\\nconst filter = [\\n  'all',\\n  ['==', '$type', 'Polygon'],\\n  [\\n    'in',\\n    `${PLUGIN_NAME}--tagsClassType`,\\n    'tag-sport-beachvolleyball',\\n    'tag-natural-beach',\\n    'tag-natural-sand',\\n    'tag-natural-scrub',\\n    'tag-amenity-childcare',\\n    'tag-amenity-kindergarten',\\n    'tag-amenity-school',\\n    'tag-amenity-college',\\n    'tag-amenity-university'\\n  ]\\n];\\n\\nexport default [\\n  {\\n    selectable: false,\\n    priority: 1,\\n    layer: {\\n      id: 'areaYellowLayer',\\n      type: 'line',\\n      source: undefined,\\n      layout: {\\n        'line-join': 'round',\\n        'line-cap': 'round'\\n      },\\n      paint: {\\n        'line-color': '#ffff94',\\n        'line-width': 2,\\n        'line-opacity': 1\\n      },\\n      filter\\n    }\\n  },\\n  {\\n    selectable: false,\\n    priority: 1,\\n    layer: {\\n      id: 'areaYellowLayerCasing',\\n      type: 'line',\\n      source: undefined,\\n      layout: {\\n        'line-join': 'round',\\n        'line-cap': 'round'\\n      },\\n      paint: { ...areaPaintStyle, 'line-color': '#ffff94' },\\n      filter\\n    }\\n  }\\n];\\n\"]}",
headerContent: undefined,
mtime: 1512124205000,
devLibsRequired : undefined,
_ : {}
}