/* global require */

require.config({
  shim: {

  },
  paths: {
    d3: "../bower_components/d3/d3",
    lodash: "../bower_components/lodash/dist/lodash.compat",
      requirejs: "../bower_components/requirejs/require",
      sdp: "sdp"
  },
  packages: [

  ]
});

require( ["sdp/main"], function(main) {
    "use strict";
    main();
});
