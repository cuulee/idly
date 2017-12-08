module.exports = { contents: "\"use strict\";\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar constants_1 = require(\"../../constants\");\nexports.default = [\n    {\n        selectable: true,\n        priority: 2,\n        layer: {\n            id: 'highwayTrunk',\n            type: 'line',\n            source: undefined,\n            layout: {\n                'line-join': 'round',\n                'line-cap': 'round'\n            },\n            paint: {\n                'line-color': '#DD2F22',\n                'line-opacity': 0.85,\n                'line-width': 5\n            },\n            filter: [\n                'all',\n                [\n                    'in',\n                    constants_1.PLUGIN_NAME + \"--tagsClassType\",\n                    'tag-highway-trunk',\n                    'tag-highway-trunk_link'\n                ]\n            ]\n        }\n    }\n];\n",
dependencies: ["../../constants"],
sourceMap: "{\"version\":3,\"file\":\"layers/highway/trunk.js\",\"sourceRoot\":\"\",\"sources\":[\"/src/layers/highway/trunk.ts\"],\"names\":[],\"mappings\":\";;AAAA,+CAA8C;AAE9C,kBAAe;IACb;QACE,UAAU,EAAE,IAAI;QAChB,QAAQ,EAAE,CAAC;QACX,KAAK,EAAE;YACL,EAAE,EAAE,cAAc;YAClB,IAAI,EAAE,MAAM;YACZ,MAAM,EAAE,SAAS;YACjB,MAAM,EAAE;gBACN,WAAW,EAAE,OAAO;gBACpB,UAAU,EAAE,OAAO;aACpB;YACD,KAAK,EAAE;gBACL,YAAY,EAAE,SAAS;gBACvB,cAAc,EAAE,IAAI;gBACpB,YAAY,EAAE,CAAC;aAChB;YACD,MAAM,EAAE;gBACN,KAAK;gBACL;oBACE,IAAI;oBACJ,GAAG,uBAAW,iBAAiB;oBAC/B,mBAAmB;oBACnB,wBAAwB;iBACzB;aACF;SACF;KACF;CACF,CAAC\",\"sourcesContent\":[\"import { PLUGIN_NAME } from '../../constants';\\n\\nexport default [\\n  {\\n    selectable: true,\\n    priority: 2,\\n    layer: {\\n      id: 'highwayTrunk',\\n      type: 'line',\\n      source: undefined,\\n      layout: {\\n        'line-join': 'round',\\n        'line-cap': 'round'\\n      },\\n      paint: {\\n        'line-color': '#DD2F22',\\n        'line-opacity': 0.85,\\n        'line-width': 5\\n      },\\n      filter: [\\n        'all',\\n        [\\n          'in',\\n          `${PLUGIN_NAME}--tagsClassType`,\\n          'tag-highway-trunk',\\n          'tag-highway-trunk_link'\\n        ]\\n      ]\\n    }\\n  }\\n];\\n\"]}",
headerContent: undefined,
mtime: 1512123567000,
devLibsRequired : undefined,
_ : {}
}