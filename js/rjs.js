/* global require */

require.config({
  shim: {

  },
  paths: {
    d3: "../bower_components/d3/d3",
    lodash: "../bower_components/lodash/dist/lodash.compat",
    requirejs: "../bower_components/requirejs/require"
  },
  packages: [

  ]
});

require( ["sdp"], function(sdp) {
    "use strict";
    sdp.main();
});
