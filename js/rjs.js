/* global require */

require.config({
  shim: {

  },
  paths: {
      d3: "http://cdnjs.cloudflare.com/ajax/libs/d3/3.4.13/d3.min",
      lodash: "http://cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min",
      requirejs: "http://cdnjs.cloudflare.com/ajax/libs/require.js/2.1.15/require.min",
      sdp: "sdp"
  },
  packages: [

  ]
});

require( ["sdp/main"], function(main) {
    "use strict";
    // main();
});
