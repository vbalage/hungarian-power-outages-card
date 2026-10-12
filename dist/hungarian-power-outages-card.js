/* Hungarian Power Outages Card — MIT. No external scripts or provider requests. */
export const VERSION = "0.1.0";
const DOMAIN = "hungarian_power_outages";
export const KEYS = [
  "planned_count",
  "planned_now",
  "next_planned_start",
  "next_planned_end",
  "fault_reports",
  "planned_health",
  "faults_health",
  "planned_last_success",
  "faults_last_success",
  "refresh",
  "nearby_planned_count",
  "nearby_fault_reports",
];
const LEAFLET_CSS = "/* required styles */\r\n\r\n.leaflet-pane,\r\n.leaflet-tile,\r\n.leaflet-marker-icon,\r\n.leaflet-marker-shadow,\r\n.leaflet-tile-container,\r\n.leaflet-pane > svg,\r\n.leaflet-pane > canvas,\r\n.leaflet-zoom-box,\r\n.leaflet-image-layer,\r\n.leaflet-layer {\r\n\tposition: absolute;\r\n\tleft: 0;\r\n\ttop: 0;\r\n\t}\r\n.leaflet-container {\r\n\toverflow: hidden;\r\n\t}\r\n.leaflet-tile,\r\n.leaflet-marker-icon,\r\n.leaflet-marker-shadow {\r\n\t-webkit-user-select: none;\r\n\t   -moz-user-select: none;\r\n\t        user-select: none;\r\n\t  -webkit-user-drag: none;\r\n\t}\r\n/* Prevents IE11 from highlighting tiles in blue */\r\n.leaflet-tile::selection {\r\n\tbackground: transparent;\r\n}\r\n/* Safari renders non-retina tile on retina better with this, but Chrome is worse */\r\n.leaflet-safari .leaflet-tile {\r\n\timage-rendering: -webkit-optimize-contrast;\r\n\t}\r\n/* hack that prevents hw layers \"stretching\" when loading new tiles */\r\n.leaflet-safari .leaflet-tile-container {\r\n\twidth: 1600px;\r\n\theight: 1600px;\r\n\t-webkit-transform-origin: 0 0;\r\n\t}\r\n.leaflet-marker-icon,\r\n.leaflet-marker-shadow {\r\n\tdisplay: block;\r\n\t}\r\n/* .leaflet-container svg: reset svg max-width decleration shipped in Joomla! (joomla.org) 3.x */\r\n/* .leaflet-container img: map is broken in FF if you have max-width: 100% on tiles */\r\n.leaflet-container .leaflet-overlay-pane svg {\r\n\tmax-width: none !important;\r\n\tmax-height: none !important;\r\n\t}\r\n.leaflet-container .leaflet-marker-pane img,\r\n.leaflet-container .leaflet-shadow-pane img,\r\n.leaflet-container .leaflet-tile-pane img,\r\n.leaflet-container img.leaflet-image-layer,\r\n.leaflet-container .leaflet-tile {\r\n\tmax-width: none !important;\r\n\tmax-height: none !important;\r\n\twidth: auto;\r\n\tpadding: 0;\r\n\t}\r\n\r\n.leaflet-container img.leaflet-tile {\r\n\t/* See: https://bugs.chromium.org/p/chromium/issues/detail?id=600120 */\r\n\tmix-blend-mode: plus-lighter;\r\n}\r\n\r\n.leaflet-container.leaflet-touch-zoom {\r\n\t-ms-touch-action: pan-x pan-y;\r\n\ttouch-action: pan-x pan-y;\r\n\t}\r\n.leaflet-container.leaflet-touch-drag {\r\n\t-ms-touch-action: pinch-zoom;\r\n\t/* Fallback for FF which doesn't support pinch-zoom */\r\n\ttouch-action: none;\r\n\ttouch-action: pinch-zoom;\r\n}\r\n.leaflet-container.leaflet-touch-drag.leaflet-touch-zoom {\r\n\t-ms-touch-action: none;\r\n\ttouch-action: none;\r\n}\r\n.leaflet-container {\r\n\t-webkit-tap-highlight-color: transparent;\r\n}\r\n.leaflet-container a {\r\n\t-webkit-tap-highlight-color: rgba(51, 181, 229, 0.4);\r\n}\r\n.leaflet-tile {\r\n\tfilter: inherit;\r\n\tvisibility: hidden;\r\n\t}\r\n.leaflet-tile-loaded {\r\n\tvisibility: inherit;\r\n\t}\r\n.leaflet-zoom-box {\r\n\twidth: 0;\r\n\theight: 0;\r\n\t-moz-box-sizing: border-box;\r\n\t     box-sizing: border-box;\r\n\tz-index: 800;\r\n\t}\r\n/* workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=888319 */\r\n.leaflet-overlay-pane svg {\r\n\t-moz-user-select: none;\r\n\t}\r\n\r\n.leaflet-pane         { z-index: 400; }\r\n\r\n.leaflet-tile-pane    { z-index: 200; }\r\n.leaflet-overlay-pane { z-index: 400; }\r\n.leaflet-shadow-pane  { z-index: 500; }\r\n.leaflet-marker-pane  { z-index: 600; }\r\n.leaflet-tooltip-pane   { z-index: 650; }\r\n.leaflet-popup-pane   { z-index: 700; }\r\n\r\n.leaflet-map-pane canvas { z-index: 100; }\r\n.leaflet-map-pane svg    { z-index: 200; }\r\n\r\n.leaflet-vml-shape {\r\n\twidth: 1px;\r\n\theight: 1px;\r\n\t}\r\n.lvml {\r\n\tbehavior: url(#default#VML);\r\n\tdisplay: inline-block;\r\n\tposition: absolute;\r\n\t}\r\n\r\n\r\n/* control positioning */\r\n\r\n.leaflet-control {\r\n\tposition: relative;\r\n\tz-index: 800;\r\n\tpointer-events: visiblePainted; /* IE 9-10 doesn't have auto */\r\n\tpointer-events: auto;\r\n\t}\r\n.leaflet-top,\r\n.leaflet-bottom {\r\n\tposition: absolute;\r\n\tz-index: 1000;\r\n\tpointer-events: none;\r\n\t}\r\n.leaflet-top {\r\n\ttop: 0;\r\n\t}\r\n.leaflet-right {\r\n\tright: 0;\r\n\t}\r\n.leaflet-bottom {\r\n\tbottom: 0;\r\n\t}\r\n.leaflet-left {\r\n\tleft: 0;\r\n\t}\r\n.leaflet-control {\r\n\tfloat: left;\r\n\tclear: both;\r\n\t}\r\n.leaflet-right .leaflet-control {\r\n\tfloat: right;\r\n\t}\r\n.leaflet-top .leaflet-control {\r\n\tmargin-top: 10px;\r\n\t}\r\n.leaflet-bottom .leaflet-control {\r\n\tmargin-bottom: 10px;\r\n\t}\r\n.leaflet-left .leaflet-control {\r\n\tmargin-left: 10px;\r\n\t}\r\n.leaflet-right .leaflet-control {\r\n\tmargin-right: 10px;\r\n\t}\r\n\r\n\r\n/* zoom and fade animations */\r\n\r\n.leaflet-fade-anim .leaflet-popup {\r\n\topacity: 0;\r\n\t-webkit-transition: opacity 0.2s linear;\r\n\t   -moz-transition: opacity 0.2s linear;\r\n\t        transition: opacity 0.2s linear;\r\n\t}\r\n.leaflet-fade-anim .leaflet-map-pane .leaflet-popup {\r\n\topacity: 1;\r\n\t}\r\n.leaflet-zoom-animated {\r\n\t-webkit-transform-origin: 0 0;\r\n\t    -ms-transform-origin: 0 0;\r\n\t        transform-origin: 0 0;\r\n\t}\r\nsvg.leaflet-zoom-animated {\r\n\twill-change: transform;\r\n}\r\n\r\n.leaflet-zoom-anim .leaflet-zoom-animated {\r\n\t-webkit-transition: -webkit-transform 0.25s cubic-bezier(0,0,0.25,1);\r\n\t   -moz-transition:    -moz-transform 0.25s cubic-bezier(0,0,0.25,1);\r\n\t        transition:         transform 0.25s cubic-bezier(0,0,0.25,1);\r\n\t}\r\n.leaflet-zoom-anim .leaflet-tile,\r\n.leaflet-pan-anim .leaflet-tile {\r\n\t-webkit-transition: none;\r\n\t   -moz-transition: none;\r\n\t        transition: none;\r\n\t}\r\n\r\n.leaflet-zoom-anim .leaflet-zoom-hide {\r\n\tvisibility: hidden;\r\n\t}\r\n\r\n\r\n/* cursors */\r\n\r\n.leaflet-interactive {\r\n\tcursor: pointer;\r\n\t}\r\n.leaflet-grab {\r\n\tcursor: -webkit-grab;\r\n\tcursor:    -moz-grab;\r\n\tcursor:         grab;\r\n\t}\r\n.leaflet-crosshair,\r\n.leaflet-crosshair .leaflet-interactive {\r\n\tcursor: crosshair;\r\n\t}\r\n.leaflet-popup-pane,\r\n.leaflet-control {\r\n\tcursor: auto;\r\n\t}\r\n.leaflet-dragging .leaflet-grab,\r\n.leaflet-dragging .leaflet-grab .leaflet-interactive,\r\n.leaflet-dragging .leaflet-marker-draggable {\r\n\tcursor: move;\r\n\tcursor: -webkit-grabbing;\r\n\tcursor:    -moz-grabbing;\r\n\tcursor:         grabbing;\r\n\t}\r\n\r\n/* marker & overlays interactivity */\r\n.leaflet-marker-icon,\r\n.leaflet-marker-shadow,\r\n.leaflet-image-layer,\r\n.leaflet-pane > svg path,\r\n.leaflet-tile-container {\r\n\tpointer-events: none;\r\n\t}\r\n\r\n.leaflet-marker-icon.leaflet-interactive,\r\n.leaflet-image-layer.leaflet-interactive,\r\n.leaflet-pane > svg path.leaflet-interactive,\r\nsvg.leaflet-image-layer.leaflet-interactive path {\r\n\tpointer-events: visiblePainted; /* IE 9-10 doesn't have auto */\r\n\tpointer-events: auto;\r\n\t}\r\n\r\n/* visual tweaks */\r\n\r\n.leaflet-container {\r\n\tbackground: #ddd;\r\n\toutline-offset: 1px;\r\n\t}\r\n.leaflet-container a {\r\n\tcolor: #0078A8;\r\n\t}\r\n.leaflet-zoom-box {\r\n\tborder: 2px dotted #38f;\r\n\tbackground: rgba(255,255,255,0.5);\r\n\t}\r\n\r\n\r\n/* general typography */\r\n.leaflet-container {\r\n\tfont-family: \"Helvetica Neue\", Arial, Helvetica, sans-serif;\r\n\tfont-size: 12px;\r\n\tfont-size: 0.75rem;\r\n\tline-height: 1.5;\r\n\t}\r\n\r\n\r\n/* general toolbar styles */\r\n\r\n.leaflet-bar {\r\n\tbox-shadow: 0 1px 5px rgba(0,0,0,0.65);\r\n\tborder-radius: 4px;\r\n\t}\r\n.leaflet-bar a {\r\n\tbackground-color: #fff;\r\n\tborder-bottom: 1px solid #ccc;\r\n\twidth: 26px;\r\n\theight: 26px;\r\n\tline-height: 26px;\r\n\tdisplay: block;\r\n\ttext-align: center;\r\n\ttext-decoration: none;\r\n\tcolor: black;\r\n\t}\r\n.leaflet-bar a,\r\n.leaflet-control-layers-toggle {\r\n\tbackground-position: 50% 50%;\r\n\tbackground-repeat: no-repeat;\r\n\tdisplay: block;\r\n\t}\r\n.leaflet-bar a:hover,\r\n.leaflet-bar a:focus {\r\n\tbackground-color: #f4f4f4;\r\n\t}\r\n.leaflet-bar a:first-child {\r\n\tborder-top-left-radius: 4px;\r\n\tborder-top-right-radius: 4px;\r\n\t}\r\n.leaflet-bar a:last-child {\r\n\tborder-bottom-left-radius: 4px;\r\n\tborder-bottom-right-radius: 4px;\r\n\tborder-bottom: none;\r\n\t}\r\n.leaflet-bar a.leaflet-disabled {\r\n\tcursor: default;\r\n\tbackground-color: #f4f4f4;\r\n\tcolor: #bbb;\r\n\t}\r\n\r\n.leaflet-touch .leaflet-bar a {\r\n\twidth: 30px;\r\n\theight: 30px;\r\n\tline-height: 30px;\r\n\t}\r\n.leaflet-touch .leaflet-bar a:first-child {\r\n\tborder-top-left-radius: 2px;\r\n\tborder-top-right-radius: 2px;\r\n\t}\r\n.leaflet-touch .leaflet-bar a:last-child {\r\n\tborder-bottom-left-radius: 2px;\r\n\tborder-bottom-right-radius: 2px;\r\n\t}\r\n\r\n/* zoom control */\r\n\r\n.leaflet-control-zoom-in,\r\n.leaflet-control-zoom-out {\r\n\tfont: bold 18px 'Lucida Console', Monaco, monospace;\r\n\ttext-indent: 1px;\r\n\t}\r\n\r\n.leaflet-touch .leaflet-control-zoom-in, .leaflet-touch .leaflet-control-zoom-out  {\r\n\tfont-size: 22px;\r\n\t}\r\n\r\n\r\n/* layers control */\r\n\r\n.leaflet-control-layers {\r\n\tbox-shadow: 0 1px 5px rgba(0,0,0,0.4);\r\n\tbackground: #fff;\r\n\tborder-radius: 5px;\r\n\t}\r\n.leaflet-control-layers-toggle {\r\n\tbackground-image: url(images/layers.png);\r\n\twidth: 36px;\r\n\theight: 36px;\r\n\t}\r\n.leaflet-retina .leaflet-control-layers-toggle {\r\n\tbackground-image: url(images/layers-2x.png);\r\n\tbackground-size: 26px 26px;\r\n\t}\r\n.leaflet-touch .leaflet-control-layers-toggle {\r\n\twidth: 44px;\r\n\theight: 44px;\r\n\t}\r\n.leaflet-control-layers .leaflet-control-layers-list,\r\n.leaflet-control-layers-expanded .leaflet-control-layers-toggle {\r\n\tdisplay: none;\r\n\t}\r\n.leaflet-control-layers-expanded .leaflet-control-layers-list {\r\n\tdisplay: block;\r\n\tposition: relative;\r\n\t}\r\n.leaflet-control-layers-expanded {\r\n\tpadding: 6px 10px 6px 6px;\r\n\tcolor: #333;\r\n\tbackground: #fff;\r\n\t}\r\n.leaflet-control-layers-scrollbar {\r\n\toverflow-y: scroll;\r\n\toverflow-x: hidden;\r\n\tpadding-right: 5px;\r\n\t}\r\n.leaflet-control-layers-selector {\r\n\tmargin-top: 2px;\r\n\tposition: relative;\r\n\ttop: 1px;\r\n\t}\r\n.leaflet-control-layers label {\r\n\tdisplay: block;\r\n\tfont-size: 13px;\r\n\tfont-size: 1.08333em;\r\n\t}\r\n.leaflet-control-layers-separator {\r\n\theight: 0;\r\n\tborder-top: 1px solid #ddd;\r\n\tmargin: 5px -10px 5px -6px;\r\n\t}\r\n\r\n/* Default icon URLs */\r\n.leaflet-default-icon-path { /* used only in path-guessing heuristic, see L.Icon.Default */\r\n\tbackground-image: url(images/marker-icon.png);\r\n\t}\r\n\r\n\r\n/* attribution and scale controls */\r\n\r\n.leaflet-container .leaflet-control-attribution {\r\n\tbackground: #fff;\r\n\tbackground: rgba(255, 255, 255, 0.8);\r\n\tmargin: 0;\r\n\t}\r\n.leaflet-control-attribution,\r\n.leaflet-control-scale-line {\r\n\tpadding: 0 5px;\r\n\tcolor: #333;\r\n\tline-height: 1.4;\r\n\t}\r\n.leaflet-control-attribution a {\r\n\ttext-decoration: none;\r\n\t}\r\n.leaflet-control-attribution a:hover,\r\n.leaflet-control-attribution a:focus {\r\n\ttext-decoration: underline;\r\n\t}\r\n.leaflet-attribution-flag {\r\n\tdisplay: inline !important;\r\n\tvertical-align: baseline !important;\r\n\twidth: 1em;\r\n\theight: 0.6669em;\r\n\t}\r\n.leaflet-left .leaflet-control-scale {\r\n\tmargin-left: 5px;\r\n\t}\r\n.leaflet-bottom .leaflet-control-scale {\r\n\tmargin-bottom: 5px;\r\n\t}\r\n.leaflet-control-scale-line {\r\n\tborder: 2px solid #777;\r\n\tborder-top: none;\r\n\tline-height: 1.1;\r\n\tpadding: 2px 5px 1px;\r\n\twhite-space: nowrap;\r\n\t-moz-box-sizing: border-box;\r\n\t     box-sizing: border-box;\r\n\tbackground: rgba(255, 255, 255, 0.8);\r\n\ttext-shadow: 1px 1px #fff;\r\n\t}\r\n.leaflet-control-scale-line:not(:first-child) {\r\n\tborder-top: 2px solid #777;\r\n\tborder-bottom: none;\r\n\tmargin-top: -2px;\r\n\t}\r\n.leaflet-control-scale-line:not(:first-child):not(:last-child) {\r\n\tborder-bottom: 2px solid #777;\r\n\t}\r\n\r\n.leaflet-touch .leaflet-control-attribution,\r\n.leaflet-touch .leaflet-control-layers,\r\n.leaflet-touch .leaflet-bar {\r\n\tbox-shadow: none;\r\n\t}\r\n.leaflet-touch .leaflet-control-layers,\r\n.leaflet-touch .leaflet-bar {\r\n\tborder: 2px solid rgba(0,0,0,0.2);\r\n\tbackground-clip: padding-box;\r\n\t}\r\n\r\n\r\n/* popup */\r\n\r\n.leaflet-popup {\r\n\tposition: absolute;\r\n\ttext-align: center;\r\n\tmargin-bottom: 20px;\r\n\t}\r\n.leaflet-popup-content-wrapper {\r\n\tpadding: 1px;\r\n\ttext-align: left;\r\n\tborder-radius: 12px;\r\n\t}\r\n.leaflet-popup-content {\r\n\tmargin: 13px 24px 13px 20px;\r\n\tline-height: 1.3;\r\n\tfont-size: 13px;\r\n\tfont-size: 1.08333em;\r\n\tmin-height: 1px;\r\n\t}\r\n.leaflet-popup-content p {\r\n\tmargin: 17px 0;\r\n\tmargin: 1.3em 0;\r\n\t}\r\n.leaflet-popup-tip-container {\r\n\twidth: 40px;\r\n\theight: 20px;\r\n\tposition: absolute;\r\n\tleft: 50%;\r\n\tmargin-top: -1px;\r\n\tmargin-left: -20px;\r\n\toverflow: hidden;\r\n\tpointer-events: none;\r\n\t}\r\n.leaflet-popup-tip {\r\n\twidth: 17px;\r\n\theight: 17px;\r\n\tpadding: 1px;\r\n\r\n\tmargin: -10px auto 0;\r\n\tpointer-events: auto;\r\n\r\n\t-webkit-transform: rotate(45deg);\r\n\t   -moz-transform: rotate(45deg);\r\n\t    -ms-transform: rotate(45deg);\r\n\t        transform: rotate(45deg);\r\n\t}\r\n.leaflet-popup-content-wrapper,\r\n.leaflet-popup-tip {\r\n\tbackground: white;\r\n\tcolor: #333;\r\n\tbox-shadow: 0 3px 14px rgba(0,0,0,0.4);\r\n\t}\r\n.leaflet-container a.leaflet-popup-close-button {\r\n\tposition: absolute;\r\n\ttop: 0;\r\n\tright: 0;\r\n\tborder: none;\r\n\ttext-align: center;\r\n\twidth: 24px;\r\n\theight: 24px;\r\n\tfont: 16px/24px Tahoma, Verdana, sans-serif;\r\n\tcolor: #757575;\r\n\ttext-decoration: none;\r\n\tbackground: transparent;\r\n\t}\r\n.leaflet-container a.leaflet-popup-close-button:hover,\r\n.leaflet-container a.leaflet-popup-close-button:focus {\r\n\tcolor: #585858;\r\n\t}\r\n.leaflet-popup-scrolled {\r\n\toverflow: auto;\r\n\t}\r\n\r\n.leaflet-oldie .leaflet-popup-content-wrapper {\r\n\t-ms-zoom: 1;\r\n\t}\r\n.leaflet-oldie .leaflet-popup-tip {\r\n\twidth: 24px;\r\n\tmargin: 0 auto;\r\n\r\n\t-ms-filter: \"progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678)\";\r\n\tfilter: progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678);\r\n\t}\r\n\r\n.leaflet-oldie .leaflet-control-zoom,\r\n.leaflet-oldie .leaflet-control-layers,\r\n.leaflet-oldie .leaflet-popup-content-wrapper,\r\n.leaflet-oldie .leaflet-popup-tip {\r\n\tborder: 1px solid #999;\r\n\t}\r\n\r\n\r\n/* div icon */\r\n\r\n.leaflet-div-icon {\r\n\tbackground: #fff;\r\n\tborder: 1px solid #666;\r\n\t}\r\n\r\n\r\n/* Tooltip */\r\n/* Base styles for the element that has a tooltip */\r\n.leaflet-tooltip {\r\n\tposition: absolute;\r\n\tpadding: 6px;\r\n\tbackground-color: #fff;\r\n\tborder: 1px solid #fff;\r\n\tborder-radius: 3px;\r\n\tcolor: #222;\r\n\twhite-space: nowrap;\r\n\t-webkit-user-select: none;\r\n\t-moz-user-select: none;\r\n\t-ms-user-select: none;\r\n\tuser-select: none;\r\n\tpointer-events: none;\r\n\tbox-shadow: 0 1px 3px rgba(0,0,0,0.4);\r\n\t}\r\n.leaflet-tooltip.leaflet-interactive {\r\n\tcursor: pointer;\r\n\tpointer-events: auto;\r\n\t}\r\n.leaflet-tooltip-top:before,\r\n.leaflet-tooltip-bottom:before,\r\n.leaflet-tooltip-left:before,\r\n.leaflet-tooltip-right:before {\r\n\tposition: absolute;\r\n\tpointer-events: none;\r\n\tborder: 6px solid transparent;\r\n\tbackground: transparent;\r\n\tcontent: \"\";\r\n\t}\r\n\r\n/* Directions */\r\n\r\n.leaflet-tooltip-bottom {\r\n\tmargin-top: 6px;\r\n}\r\n.leaflet-tooltip-top {\r\n\tmargin-top: -6px;\r\n}\r\n.leaflet-tooltip-bottom:before,\r\n.leaflet-tooltip-top:before {\r\n\tleft: 50%;\r\n\tmargin-left: -6px;\r\n\t}\r\n.leaflet-tooltip-top:before {\r\n\tbottom: 0;\r\n\tmargin-bottom: -12px;\r\n\tborder-top-color: #fff;\r\n\t}\r\n.leaflet-tooltip-bottom:before {\r\n\ttop: 0;\r\n\tmargin-top: -12px;\r\n\tmargin-left: -6px;\r\n\tborder-bottom-color: #fff;\r\n\t}\r\n.leaflet-tooltip-left {\r\n\tmargin-left: -6px;\r\n}\r\n.leaflet-tooltip-right {\r\n\tmargin-left: 6px;\r\n}\r\n.leaflet-tooltip-left:before,\r\n.leaflet-tooltip-right:before {\r\n\ttop: 50%;\r\n\tmargin-top: -6px;\r\n\t}\r\n.leaflet-tooltip-left:before {\r\n\tright: 0;\r\n\tmargin-right: -12px;\r\n\tborder-left-color: #fff;\r\n\t}\r\n.leaflet-tooltip-right:before {\r\n\tleft: 0;\r\n\tmargin-left: -12px;\r\n\tborder-right-color: #fff;\r\n\t}\r\n\r\n/* Printing */\r\n\r\n@media print {\r\n\t/* Prevent printers from removing background-images of controls. */\r\n\t.leaflet-control {\r\n\t\t-webkit-print-color-adjust: exact;\r\n\t\tprint-color-adjust: exact;\r\n\t\t}\r\n\t}\r\n";
let leafletPromise;
async function loadLeaflet() {
  if (!leafletPromise)
    leafletPromise = import(new URL("./leaflet.js", import.meta.url))
      .then(() => window.L.noConflict())
      .catch((error) => {
        leafletPromise = undefined;
        throw error;
      });
  return leafletPromise;
}
const EON_URL =
  "https://www.eon.hu/hu/lakossagi/aram/aramszunet-informaciok.html";
const TEXT = {
  en: {
    title: "Power outages",
    location: "Monitored location",
    choose: "Select a Hungarian Power Outages device in the card editor.",
    loading: "Loading outage entities…",
    discovery:
      "Could not load the entity registry. Try reloading the dashboard.",
    missing:
      "The selected device has no planned outage sensor. Check the integration and device selection.",
    next: "Next planned outage",
    now: "Planned outage interval now",
    empty: "No matching planned outages",
    unavailable: "Planned outage data unavailable",
    provider:
      "Provider reports do not measure whether your property has power.",
    upcoming: "Upcoming planned outages",
    nearby: "Nearby reports",
    geographic:
      "Geographic candidates; your property’s involvement is not confirmed.",
    faults: "Reported faults in town / district",
    nearbyPlanned: "Nearby planned outages",
    nearbyFaults: "Nearby fault reports",
    radius: "Search radius",
    start: "Reported since",
    customers: "Affected customers",
    distance: "Distance",
    overlap: "Provider area overlaps your circle",
    marker: "Marker within your circle",
    planned: "Planned feed",
    faultFeed: "Fault feed",
    checked: "Last successful check",
    never: "Not checked",
    refresh: "Refresh",
    refreshing: "Requesting…",
    requested:
      "Refresh requested. Provider requests share a one-minute cooldown.",
    failed: "Refresh failed",
    source: "E.ON outage map",
    count: "Scheduled intervals",
    details: "Details",
    truncated: "Only the first 25 published matches are listed.",
    ok: "Current",
    degraded: "Data loaded",
    coverageDetails: "About provider coverage",
    coverageNote:
      "The download succeeded. Some records in E.ON’s full feed lack an address or a usable time interval. Usable reports are shown, but coverage may be incomplete. This note alone does not indicate a problem with your property’s match.",
    withoutAddress: "Records without addresses",
    skippedIntervals: "Records with unusable time intervals",
    stale: "Stale data",
    cannot_connect: "Connection failed",
    invalid_feed: "Unsupported feed",
    unknown: "Unavailable",
    address: "Address match",
    parcel: "Exact parcel match",
    street: "Street match",
    area: "Town / district match",
    uncertain: "Uncertain address match",
    device: "Monitored device",
    language: "Language",
    automatic: "Automatic",
    nearbyToggle: "Show nearby reports",
    expanded: "Expand details by default",
    customTitle: "Title (optional)",
    retry: "Retry discovery",
    noNearby:
      "Nearby entities are unavailable. Enable nearby reports in the integration’s Reconfigure screen.",
    noReports: "No published matching reports",
    countdown: "Starts",
    moreInfo: "Open entity details",
    health: "Feed status",
    failedSetup: "Set up the integration before selecting its device.",
    report: "Report",
    permissions: "Read-only card: this user cannot refresh.",
    map: "Outage map",
    mapToggle: "Show map",
    mapHide: "Hide map",
    mapOption: "Show expandable map",
    mapPlanned: "Planned",
    mapFaults: "Reported faults",
    mapApprox:
      "Approximate provider markers, not parcel boundaries. Reports without coordinates and truncated lists may be missing. Map covers this device’s matches and nearby reports, not all Hungary.",
    mapLoading: "Loading map…",
    mapError: "Map could not be loaded. Close it and reopen to retry.",
    mapEmpty: "No usable provider coordinates are available for these reports.",
    mapTiles: "Map tiles load from OpenStreetMap when opened.",
    searchPoint: "Your selected search circle",
    mapDays: "Planned dates",
    allDates: "All upcoming",
    sevenDays: "Next 7 days",
    thirtyDays: "Next 30 days",
  },
  hu: {
    title: "Áramszünetek",
    location: "Figyelt hely",
    choose: "Válasszon Hungarian Power Outages eszközt a kártyaszerkesztőben.",
    loading: "Áramszünet-érzékelők betöltése…",
    discovery:
      "Nem sikerült betölteni az entitásjegyzéket. Frissítse az irányítópultot.",
    missing:
      "A kiválasztott eszköz tervezett áramszünet-érzékelője nem található. Ellenőrizze az integrációt és az eszközt.",
    next: "Következő tervezett áramszünet",
    now: "Tervezett áramszünet időszaka most",
    empty: "Nincs egyező tervezett áramszünet",
    unavailable: "A tervezett áramszünet adatai nem érhetők el",
    provider: "A szolgáltatói jelentések nem mérik az ingatlan áramellátását.",
    upcoming: "Közelgő tervezett áramszünetek",
    nearby: "Közeli jelentések",
    geographic:
      "Földrajzi közelség alapján; az ingatlan érintettsége nem igazolt.",
    faults: "Jelzett üzemzavarok a településen / kerületben",
    nearbyPlanned: "Közeli tervezett áramszünetek",
    nearbyFaults: "Közeli üzemzavar-jelentések",
    radius: "Keresési sugár",
    start: "Jelzés kezdete",
    customers: "Érintett fogyasztók",
    distance: "Távolság",
    overlap: "A szolgáltatói terület átfedi a kijelölt kört",
    marker: "A térképi pont a kijelölt körön belül van",
    planned: "Tervezett adatforrás",
    faultFeed: "Üzemzavar-adatforrás",
    checked: "Utolsó sikeres lekérdezés",
    never: "Még nem volt lekérdezés",
    refresh: "Frissítés",
    refreshing: "Lekérdezés…",
    requested:
      "Frissítés kérve. A szolgáltatói lekérdezések között legalább egy perc telik el.",
    failed: "A frissítés sikertelen",
    source: "E.ON áramszünettérkép",
    count: "Tervezett időszakok",
    details: "Részletek",
    truncated: "Csak az első 25 közzétett egyezés látható.",
    ok: "Aktuális",
    degraded: "Adatok betöltve",
    coverageDetails: "A szolgáltatói adatok lefedettségéről",
    coverageNote:
      "A lekérdezés sikeres volt. Az E.ON teljes listájában egyes bejegyzéseknél hiányzik a cím vagy nem használható az időpont. A feldolgozható jelentések megjelennek, de a lefedettség nem feltétlenül teljes. Ez a megjegyzés önmagában nem jelez hibát az ingatlan egyezésében.",
    withoutAddress: "Cím nélküli bejegyzések",
    skippedIntervals: "Nem használható időpontú bejegyzések",
    stale: "Elavult adatok",
    cannot_connect: "Kapcsolódási hiba",
    invalid_feed: "Nem támogatott adatforrás",
    unknown: "Nem érhető el",
    address: "Címegyezés",
    parcel: "Pontos HRSZ-egyezés",
    street: "Utcaegyezés",
    area: "Település / kerület egyezés",
    uncertain: "Bizonytalan címegyezés",
    device: "Figyelt eszköz",
    language: "Nyelv",
    automatic: "Automatikus",
    nearbyToggle: "Közeli jelentések megjelenítése",
    expanded: "Részletek alapértelmezett kibontása",
    customTitle: "Cím (nem kötelező)",
    retry: "Eszközök újrakeresése",
    noNearby:
      "A közeli entitások nem érhetők el. Kapcsolja be őket az integráció Újrakonfigurálás képernyőjén.",
    noReports: "Nincs közzétett egyező jelentés",
    countdown: "Kezdés",
    moreInfo: "Entitás részleteinek megnyitása",
    health: "Adatforrás állapota",
    failedSetup:
      "Először állítsa be az integrációt, majd válassza ki az eszközét.",
    report: "Jelentés",
    permissions: "Csak olvasható kártya: ez a felhasználó nem frissíthet.",
    map: "Áramszünettérkép",
    mapToggle: "Térkép megnyitása",
    mapHide: "Térkép elrejtése",
    mapOption: "Kibontható térkép megjelenítése",
    mapPlanned: "Tervezett",
    mapFaults: "Jelzett üzemzavarok",
    mapApprox:
      "Közelítő szolgáltatói pontok, nem telekhatárok. Koordináta nélküli jelentések és a levágott listák további elemei hiányozhatnak. A térkép az eszköz egyezéseit és közeli jelentéseit mutatja, nem egész Magyarországot.",
    mapLoading: "Térkép betöltése…",
    mapError:
      "Nem sikerült betölteni a térképet. Újrapróbálkozáshoz zárja be és nyissa meg újra.",
    mapEmpty:
      "Ezekhez a jelentésekhez nincs használható szolgáltatói koordináta.",
    mapTiles: "Megnyitáskor a térképcsempék az OpenStreetMapről töltődnek be.",
    searchPoint: "A kijelölt keresési kör",
    mapDays: "Tervezett dátumok",
    allDates: "Minden közelgő",
    sevenDays: "Következő 7 nap",
    thirtyDays: "Következő 30 nap",
  },
};
export function language(config, hass) {
  return config.language === "auto" || !config.language
    ? hass?.language?.startsWith("hu")
      ? "hu"
      : "en"
    : config.language;
}
export function escapeHtml(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}
export function entityMap(registry, device) {
  const result = {};
  for (const entry of registry) {
    if (
      entry.platform !== DOMAIN ||
      entry.device_id !== device ||
      entry.disabled_by
    )
      continue;
    const key = KEYS.includes(entry.translation_key)
      ? entry.translation_key
      : [...KEYS]
          .sort((a, b) => b.length - a.length)
          .find((k) => entry.unique_id?.endsWith("_" + k));
    if (key) result[key] = entry.entity_id;
  }
  return result;
}
export function available(state) {
  return (
    !!state &&
    !state.attributes?.restored &&
    !["unknown", "unavailable"].includes(state.state)
  );
}
export function refreshAvailable(state) {
  return (
    !!state && state.state !== "unavailable" && !state.attributes?.restored
  );
}
export function summary(states, entities) {
  const count = states[entities.planned_count],
    health = states[entities.planned_health];
  if (
    !available(count) ||
    !available(health) ||
    !["ok", "degraded"].includes(health.state) ||
    !/^\d+$/.test(count.state)
  )
    return "unavailable";
  if (
    available(states[entities.planned_now]) &&
    states[entities.planned_now].state === "on"
  )
    return "now";
  if (Number(count.state) === 0) return "empty";
  return available(states[entities.next_planned_start]) &&
    Number.isFinite(Date.parse(states[entities.next_planned_start].state))
    ? "next"
    : "unavailable";
}
export function relativeTime(value, lang, now = Date.now()) {
  const delta = Date.parse(value) - now;
  if (!Number.isFinite(delta)) return "—";
  const unit =
    Math.abs(delta) >= 86400000
      ? "day"
      : Math.abs(delta) >= 3600000
        ? "hour"
        : "minute";
  const divisor = { day: 86400000, hour: 3600000, minute: 60000 }[unit];
  return new Intl.RelativeTimeFormat(lang, { numeric: "auto" }).format(
    Math.round(delta / divisor),
    unit,
  );
}
export function mapReports(
  states,
  entities,
  includeNearby = true,
  now = Date.now(),
) {
  const result = new Map();
  for (const [key, type] of [
    ["planned_count", "planned"],
    ["fault_reports", "fault"],
    ...(includeNearby
      ? [
          ["nearby_planned_count", "planned"],
          ["nearby_fault_reports", "fault"],
        ]
      : []),
  ]) {
    const state = states[entities[key]];
    if (!available(state)) continue;
    for (const report of state.attributes.outages ||
      state.attributes.reports ||
      []) {
      const { latitude, longitude } = report;
      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude) ||
        Math.abs(latitude) > 90 ||
        Math.abs(longitude) > 180 ||
        (latitude === 0 && longitude === 0)
      )
        continue;
      if (
        type === "planned" &&
        (!Number.isFinite(Date.parse(report.end)) ||
          Date.parse(report.end) <= now)
      )
        continue;
      const id =
        type + ":" + report.id + ":" + (report.start || report.started_at);
      // Address/parcel matches take precedence over duplicate nearby candidates.
      if (!result.has(id)) result.set(id, { ...report, type, key });
    }
  }
  return [...result.values()];
}

function formatDate(value, lang, zone, timeOnly = false) {
  if (!Number.isFinite(Date.parse(value))) return "—";
  const opts = timeOnly
    ? { hour: "2-digit", minute: "2-digit" }
    : {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
  try {
    return new Intl.DateTimeFormat(lang, { ...opts, timeZone: zone }).format(
      new Date(value),
    );
  } catch {
    return new Intl.DateTimeFormat(lang, {
      ...opts,
      timeZone: "Europe/Budapest",
    }).format(new Date(value));
  }
}
function range(start, end, lang, zone) {
  let sameDay = false;
  try {
    const f = new Intl.DateTimeFormat("en-CA", { timeZone: zone });
    sameDay = f.format(new Date(start)) === f.format(new Date(end));
  } catch {
    /* invalid dates remain visibly unknown */
  }
  return `${formatDate(start, lang, zone)} – ${formatDate(end, lang, zone, sameDay)}`;
}
export function validateConfig(config) {
  if (!config || typeof config !== "object")
    throw new Error("Card configuration is required");
  if (config.device_id !== undefined && typeof config.device_id !== "string")
    throw new Error("device_id must be a string");
  if (config.title !== undefined && typeof config.title !== "string")
    throw new Error("title must be a string");
  if (config.language && !["auto", "hu", "en"].includes(config.language))
    throw new Error("language must be auto, hu or en");
  for (const key of ["show_nearby", "show_map", "expanded"])
    if (config[key] !== undefined && typeof config[key] !== "boolean")
      throw new Error(`${key} must be a boolean`);
  return {
    language: "auto",
    show_nearby: true,
    show_map: true,
    expanded: false,
    ...config,
  };
}
const CSS = `.map-toggle{margin-top:12px;width:100%;min-height:40px;border:1px solid var(--divider-color,#ddd);background:var(--secondary-background-color,#f5f5f5);color:inherit;border-radius:10px;cursor:pointer;font:inherit;font-size:13px}.map-controls{display:flex;gap:12px;flex-wrap:wrap;margin:12px 0;font-size:12px}.map-controls select{max-width:160px;background:var(--card-background-color,#fff);color:inherit;border:1px solid var(--divider-color,#ddd);border-radius:5px;padding:4px}.map-controls input{accent-color:var(--primary-color,#03a9f4)}.map-host{height:300px;border-radius:10px;overflow:hidden;position:relative;background:#e7ecef;color:#333}.map-host .leaflet-container{height:100%;width:100%;font-family:Arial,sans-serif}.map-host .leaflet-popup-content{font-size:12px;line-height:1.5;max-height:250px;overflow:auto}.map-pin{border:2px solid #fff;border-radius:50%;box-shadow:0 1px 5px #0006;width:28px;height:28px;color:white;font:bold 13px/24px Arial;text-align:center}.legend{display:flex;flex-wrap:wrap;gap:12px;margin:8px 0;font-size:11px}.legend i{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:4px}.map-host .map-placeholder{padding:18px}.popup-report+.popup-report{margin-top:8px;padding-top:8px;border-top:1px solid #ddd}:host{display:block}*{box-sizing:border-box}ha-card{display:block;background:var(--ha-card-background,var(--card-background-color,#fff));color:var(--primary-text-color,#202124);border-radius:var(--ha-card-border-radius,16px);border:1px solid var(--ha-card-border-color,var(--divider-color,#ddd));overflow:hidden;font-family:var(--primary-font-family,Roboto,Arial,sans-serif)}.body{padding:20px}.top{display:flex;align-items:center;gap:12px}.bolt{width:40px;height:40px;border-radius:12px;background:var(--primary-color,#03a9f4);color:var(--text-primary-color,#fff);display:grid;place-items:center;flex:none}.bolt svg{width:24px;height:24px}.heading{min-width:0}h2{font-size:18px;margin:0 0 4px;font-weight:600}.location,.muted{font-size:12px;color:var(--secondary-text-color,#666);line-height:1.5;overflow-wrap:anywhere}.hero{padding:18px 0 16px;border-bottom:1px solid var(--divider-color,#ddd)}.status{font-size:14px;font-weight:600;line-height:1.45}.status.now{color:var(--error-color,#db4437)}.date{font-size:22px;line-height:1.35;font-weight:600;margin-top:9px;overflow-wrap:anywhere}.meta{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:10px}.badge{font-size:11px;border-radius:6px;padding:4px 7px;background:var(--secondary-background-color,#f1f3f5)}.caution{color:var(--warning-color,#9c6500)}.hero .muted{margin-top:10px}.stats{display:flex;flex-wrap:wrap;gap:16px;padding:15px 0}.stat{flex:1;min-width:110px}.stat strong{display:block;font-size:22px;margin-top:4px}.feed{margin-top:8px;display:flex;align-items:baseline;justify-content:space-between;gap:10px;font-size:12px}.feed .ok{color:var(--secondary-text-color,#666)}.feed .bad{color:var(--warning-color,#9c6500)}.feed span:last-child{text-align:right}.feed small{display:block;color:var(--secondary-text-color,#666);font-size:11px;margin-top:3px}details{border-top:1px solid var(--divider-color,#ddd);padding-top:12px;margin-top:12px}summary{cursor:pointer;font-weight:500;font-size:14px;min-height:32px;line-height:32px}.report{padding:12px 0;border-bottom:1px solid var(--divider-color,#ddd)}.report:last-child{border-bottom:0}.report button,.stat button{border:0;background:none;color:inherit;text-align:left;padding:0;cursor:pointer;font:inherit}.report .meta{margin-top:6px}.section-title{font-size:13px;font-weight:600;margin:14px 0 6px}.notice{font-size:12px;line-height:1.5;padding-top:8px;overflow-wrap:anywhere}.error{color:var(--error-color,#db4437)}.actions{padding:12px 20px;background:var(--secondary-background-color,#f5f5f5);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.actions button,.retry{font:inherit;font-size:13px;min-height:40px;border:1px solid var(--divider-color,#ddd);border-radius:10px;padding:8px 12px;background:var(--card-background-color,#fff);color:var(--primary-text-color,#202124);cursor:pointer}.actions button:disabled{opacity:.55;cursor:default}.actions a{font-size:12px;color:var(--primary-color,#03a9f4);text-decoration:none;min-height:40px;display:flex;align-items:center}button:focus-visible,a:focus-visible,summary:focus-visible{outline:2px solid var(--primary-color,#03a9f4);outline-offset:4px}.placeholder{padding:24px;font-size:14px;line-height:1.5}.empty{padding:12px 0}.countdown{font-size:12px;color:var(--secondary-text-color,#666)}@media(max-width:360px){.body{padding:16px}.actions{padding:10px 16px}.date{font-size:19px}.top{gap:10px}.feed{align-items:flex-start}}`;
const Base = globalThis.HTMLElement || class {};
const DETAILS_CSS =
  ".source-note{border:0;padding:0;margin:5px 0 12px}.source-note summary{font-size:11px;font-weight:400;color:var(--secondary-text-color,#666);min-height:26px;line-height:26px}.coverage-explanation{border:1px solid var(--divider-color,#ddd);border-radius:10px;padding:10px 12px;color:var(--secondary-text-color,#666);font-size:12px;line-height:1.6}.coverage-explanation p{margin:0}.coverage-explanation ul{margin:8px 0 0;padding-left:18px}.detail-section{margin-top:20px;--report-accent:#1976d2}.detail-section.fault{--report-accent:#b66a00}.detail-heading,.nearby-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px}.detail-heading h3,.nearby-heading h3{font-size:14px;line-height:1.5;margin:0;font-weight:600}.detail-heading{border-left:3px solid var(--report-accent);padding-left:10px}.section-count{flex:none;min-width:24px;padding:3px 7px;text-align:center;border-radius:7px;background:var(--secondary-background-color,#f1f3f5);font-size:12px;font-weight:600}.report-list{display:grid;gap:10px}.report{margin:0;padding:14px;border:1px solid var(--divider-color,#ddd);border-radius:12px;background:var(--secondary-background-color,#f5f5f5);overflow-wrap:anywhere}.report:last-child{border-bottom:1px solid var(--divider-color,#ddd)}.report-top{display:flex;justify-content:space-between;gap:10px;align-items:baseline;margin-bottom:10px;flex-wrap:wrap}.report-type{font-size:11px;font-weight:600;color:var(--report-accent);border:1px solid var(--report-accent);padding:3px 7px;border-radius:6px}.report-id{font-size:10px;color:var(--secondary-text-color,#666)}.report button.report-date{display:block;font-size:15px;font-weight:600;line-height:1.6;min-height:32px;color:var(--primary-text-color,#202124)}.report .badge{background:var(--card-background-color,#fff)}.report-facts{display:flex;flex-wrap:wrap;gap:10px 20px;margin-top:12px;padding-top:10px;border-top:1px solid var(--divider-color,#ddd)}.report-fact{font-size:12px;line-height:1.7}.report-fact span{color:var(--secondary-text-color,#666)}.report-fact strong{font-size:13px;font-weight:600;margin-left:4px}.report-basis{font-size:11px;line-height:1.6;color:var(--secondary-text-color,#666);margin-top:9px}.nearby-group{margin-top:24px;padding-top:18px;border-top:1px solid var(--divider-color,#ddd)}.nearby-heading{margin-bottom:6px}.nearby-heading .badge{font-size:10px;flex:none}.nearby-note{margin:0;padding:10px 12px;border-left:3px solid #008577;background:var(--secondary-background-color,#f5f5f5);border-radius:0 8px 8px 0}.detail-section .empty{padding:14px;border:1px dashed var(--divider-color,#ddd);border-radius:10px;font-size:12px}.nearby-group .detail-section{margin-top:16px}@media(max-width:360px){.report{padding:12px}.nearby-heading{align-items:flex-start;flex-wrap:wrap}.report button.report-date{font-size:14px}}";

export class HungarianPowerOutagesCard extends Base {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._entities = {};
    this._registry = [];
    this._devices = [];
    this._unsubs = [];
    this._mapFilters = { planned: true, fault: true, days: 0 };
  }
  setConfig(config) {
    this._config = validateConfig(config);
    this._expanded = this._config.expanded;
    this._mapEntities();
    this.render();
  }
  set hass(hass) {
    this._hass = hass;
    if (this._connection !== hass.connection) {
      this._connection = hass.connection;
      this._discover();
    }
    this.render();
  }
  connectedCallback() {
    this._clock = setInterval(() => this.render(), 1000);
    this._subscribe();
    this.render();
  }
  disconnectedCallback() {
    this._destroyMap();
    clearInterval(this._clock);
    for (const unsub of this._unsubs.splice(0)) unsub();
    this._subscribed = false;
  }
  getCardSize() {
    return this._expanded ? 8 : 5;
  }
  getGridOptions() {
    return { columns: 12, min_columns: 6, min_rows: 4 };
  }
  static getConfigElement() {
    return document.createElement("hungarian-power-outages-card-editor");
  }
  static getStubConfig(hass) {
    const entity = Object.values(hass?.entities || {}).find(
      (e) => e.platform === DOMAIN && e.device_id,
    );
    return entity ? { device_id: entity.device_id } : {};
  }
  async _subscribe() {
    if (!this.isConnected || !this._hass?.connection || this._subscribed)
      return;
    this._subscribed = true;
    for (const event of [
      "entity_registry_updated",
      "device_registry_updated",
    ]) {
      try {
        const unsubscribe = await this._hass.connection.subscribeEvents(
          () => this._discover(),
          event,
        );
        if (this.isConnected) this._unsubs.push(unsubscribe);
        else unsubscribe();
      } catch {
        /* registry discovery remains available on reconnect and retry */
      }
    }
  }
  async _discover() {
    if (!this._hass || this._loading) return;
    this._loading = true;
    this._error = "";
    this.render();
    try {
      const [registry, devices] = await Promise.all([
        this._hass.callWS({ type: "config/entity_registry/list" }),
        this._hass.callWS({ type: "config/device_registry/list" }),
      ]);
      this._registry = registry;
      this._devices = devices;
      this._mapEntities();
    } catch {
      this._error = "discovery";
    } finally {
      this._loading = false;
      this._subscribe();
      this.render();
    }
  }
  _mapEntities() {
    this._entities = entityMap(this._registry, this._config?.device_id);
  }
  _state(key) {
    return this._hass?.states[this._entities[key]];
  }
  _info(key) {
    const entityId = this._entities[key];
    if (entityId)
      this.dispatchEvent(
        new CustomEvent("hass-more-info", {
          detail: { entityId },
          bubbles: true,
          composed: true,
        }),
      );
  }
  async _refresh() {
    if (
      this._busy ||
      this._cooldownUntil > Date.now() ||
      !refreshAvailable(this._state("refresh")) ||
      this._hass?.user?.is_read_only
    )
      return;
    this._busy = true;
    this._message = "";
    this._refreshError = false;
    this.render();
    try {
      await this._hass.callService("button", "press", {
        entity_id: this._entities.refresh,
      });
      this._cooldownUntil = Date.now() + 60000;
      this._message = "requested";
    } catch (error) {
      this._refreshError = true;
      this._message = "failed";
      this._serviceError = String(error.message || error);
    } finally {
      this._busy = false;
      this.render();
    }
  }

  _destroyMap() {
    this._map?.remove();
    this._map = undefined;
    this._layers = undefined;
    this._mapSignature = undefined;
  }
  async _mountMap() {
    if (
      !this._mapOpen ||
      !this._config.show_map ||
      this._mapError ||
      this._mounting
    )
      return;
    const host = this.shadowRoot.querySelector(".map-host");
    if (!host) return;
    if (this._map) {
      this._updateMap();
      return;
    }
    this._mounting = true;
    try {
      this._L = await loadLeaflet();
      if (!host.isConnected || !this._mapOpen) return;
      host.innerHTML = "";
      const container = document.createElement("div");
      host.append(container);
      this._map = this._L
        .map(container, {
          scrollWheelZoom: false,
          zoomAnimation: false,
          fadeAnimation: false,
        })
        .setView([47.5, 19.1], 11);
      this._L
        .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          referrerPolicy: "strict-origin-when-cross-origin",
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
        })
        .addTo(this._map);
      this._layers = this._L.featureGroup().addTo(this._map);
      this._updateMap();
    } catch {
      this._mapError = true;
      this._renderKey = null;
      this.render();
    } finally {
      this._mounting = false;
      if (!this._map && !this._mapError && this._mapOpen && this.isConnected)
        this._mountMap();
    }
  }
  _updateMap() {
    if (!this._map) return;
    const lang = language(this._config, this._hass),
      t = TEXT[lang],
      e = escapeHtml,
      zone = this._hass.config?.time_zone || "Europe/Budapest",
      L = this._L;
    const records = mapReports(
      this._hass.states,
      this._entities,
      this._config.show_nearby,
    ).filter(
      (r) =>
        this._mapFilters[r.type] &&
        (r.type !== "planned" ||
          !this._mapFilters.days ||
          Date.parse(r.start) <= Date.now() + this._mapFilters.days * 86400000),
    );
    const nearby =
        this._state("nearby_planned_count") ||
        this._state("nearby_fault_reports"),
      center = nearby?.attributes.search_center,
      radius = nearby?.attributes.radius_m;
    const signature = JSON.stringify([records, center, radius, lang]);
    if (this._mapSignature === signature) {
      this._map.invalidateSize();
      return;
    }
    this._mapSignature = signature;
    this._map.stop();
    this._layers.clearLayers();
    if (
      center &&
      Number.isFinite(center.latitude) &&
      Number.isFinite(center.longitude) &&
      Number.isFinite(radius) &&
      radius > 0
    ) {
      L.circle([center.latitude, center.longitude], {
        radius,
        color: "#008577",
        weight: 2,
        dashArray: "5 5",
        fillOpacity: 0.04,
      })
        .bindPopup(e(t.searchPoint))
        .addTo(this._layers);
      L.circleMarker([center.latitude, center.longitude], {
        radius: 4,
        color: "#008577",
        fillOpacity: 1,
      }).addTo(this._layers);
    }
    const groups = new Map();
    for (const r of records) {
      const key = r.latitude + ":" + r.longitude;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(r);
      if (
        r.type === "fault" &&
        Number.isFinite(r.provider_radius_m) &&
        r.provider_radius_m > 0
      )
        L.circle([r.latitude, r.longitude], {
          radius: r.provider_radius_m,
          color: "#b66a00",
          weight: 1,
          dashArray: "3 4",
          fillOpacity: 0.08,
        }).addTo(this._layers);
    }
    for (const group of groups.values()) {
      const first = group[0],
        types = new Set(group.map((r) => r.type)),
        color =
          types.size > 1
            ? "#7456aa"
            : first.type === "planned"
              ? "#1976d2"
              : "#b66a00";
      const popup = group
        .map(
          (r) =>
            `<div class="popup-report"><strong>${e(t[r.type === "planned" ? "mapPlanned" : "mapFaults"])}</strong><br>${e(r.type === "planned" ? range(r.start, r.end, lang, zone) : `${t.start}: ${formatDate(r.started_at, lang, zone)}`)}<br>${e(t[r.match] || (r.key.startsWith("nearby") ? t.geographic : t.area))}${r.affected_customers !== undefined && r.affected_customers !== null ? `<br>${e(t.customers)}: ${e(r.affected_customers)}` : ""}${r.distance_m !== undefined ? `<br>${e(t.distance)}: ${e(r.distance_m)} m` : ""}<br><small>${e(t.report)}: ${e(r.id)}</small></div>`,
        )
        .join("");
      L.marker([first.latitude, first.longitude], {
        icon: L.divIcon({
          className: "outage-marker",
          html: `<div class="map-pin" style="background:${color}">${group.length > 1 ? group.length : first.type === "planned" ? "P" : "!"}</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        }),
        title: t[first.type === "planned" ? "mapPlanned" : "mapFaults"],
      })
        .bindPopup(popup)
        .addTo(this._layers);
    }
    if (this._layers.getLayers().length)
      this._map.fitBounds(this._layers.getBounds(), {
        padding: [20, 20],
        maxZoom: 15,
        animate: false,
      });
    this._map.invalidateSize();
  }
  render() {
    if (!this._config || !this._hass) return;
    const lang = language(this._config, this._hass),
      t = TEXT[lang],
      e = escapeHtml,
      zone = this._hass.config?.time_zone || "Europe/Budapest";
    const device = this._devices.find((d) => d.id === this._config.device_id);
    const name = device?.name_by_user || device?.name || t.location;
    const shell = (content) =>
      `<style>${LEAFLET_CSS}\n${CSS}\n${DETAILS_CSS}</style><ha-card>${content}</ha-card>`;
    if (
      !this._config.device_id ||
      this._error ||
      (this._loading && !this._entities.planned_count) ||
      !this._entities.planned_count
    ) {
      const reason = !this._config.device_id
        ? "choose"
        : this._error || (this._loading ? "loading" : "missing");
      this._renderKey = null;
      this.shadowRoot.innerHTML = shell(
        `<div class="placeholder">${e(t[reason])}${this._error ? `<p><button class="retry">${e(t.retry)}</button></p>` : ""}</div>`,
      );
      this.shadowRoot
        .querySelector(".retry")
        ?.addEventListener("click", () => this._discover());
      return;
    }
    const status = summary(this._hass.states, this._entities),
      count = this._state("planned_count"),
      rows = available(count) ? count.attributes.outages || [] : [];
    const next = rows[0],
      nextStart = this._state("next_planned_start")?.state,
      nextEnd = this._state("next_planned_end")?.state;
    const title = this._config.title || t.title;
    const metric = (key, label) =>
      `<div class="stat"><button data-info="${key}" title="${e(t.moreInfo)}"><span class="muted">${e(label)}</span><strong>${available(this._state(key)) ? e(this._state(key).state) : "—"}</strong></button></div>`;
    const badge = (level) =>
      `<span class="badge ${level === "uncertain" ? "caution" : ""}">${e(t[level] || level || t.report)}</span>`;
    const section = (label, total, content, kind = "planned") =>
      `<section class="detail-section ${kind}"><div class="detail-heading"><h3>${e(label)}</h3><span class="section-count">${e(total)}</span></div><div class="report-list">${content}</div></section>`;
    const report = (r, key, isFault = false, geographic = false) => {
      const facts = [];
      if (geographic) facts.push([t.distance, `${r.distance_m ?? "—"} m`]);
      if (
        isFault &&
        r.affected_customers !== null &&
        r.affected_customers !== undefined
      )
        facts.push([t.customers, r.affected_customers]);
      return `<article class="report ${isFault ? "fault" : "planned"}"><div class="report-top"><span class="report-type">${e(t[isFault ? "mapFaults" : "mapPlanned"])}</span>${r.id != null ? `<span class="report-id">${e(t.report)} #${e(r.id)}</span>` : ""}</div><button class="report-date" data-info="${key}" title="${e(t.moreInfo)}">${e(isFault ? `${t.start}: ${formatDate(r.started_at, lang, zone)}` : range(r.start, r.end, lang, zone))}</button>${!geographic ? `<div class="meta">${badge(isFault ? "area" : r.match)}</div>` : ""}${facts.length ? `<div class="report-facts">${facts.map(([label, value]) => `<div class="report-fact"><span>${e(label)}:</span> <strong>${e(value)}</strong></div>`).join("")}</div>` : ""}${geographic && r.basis ? `<div class="report-basis">${e(t[r.basis === "provider_area_overlap" ? "overlap" : "marker"])}</div>` : ""}</article>`;
    };
    const reportList = (key, label, isFault = false, geographic = false) => {
      const state = this._state(key);
      if (!state) return "";
      const list = available(state) ? state.attributes.reports || [] : [];
      const content = `${list.length ? list.map((r) => report(r, key, isFault, geographic)).join("") : `<div class="muted empty">${e(available(state) ? t.noReports : t.unknown)}</div>`}${state.attributes.truncated ? `<div class="muted notice">${e(t.truncated)}</div>` : ""}`;
      return section(
        label,
        available(state) ? state.state : "—",
        content,
        isFault ? "fault" : "planned",
      );
    };
    const feed = (kind) => {
      const health = this._state(kind + "_health"),
        checked = this._state(kind + "_last_success"),
        value = available(health) ? health.state : "unknown";
      const coverageCounts =
        kind === "planned"
          ? [
              [t.withoutAddress, count?.attributes.source_addressless_records],
              [t.skippedIntervals, count?.attributes.source_skipped_records],
            ].filter(([, number]) => Number.isFinite(number) && number > 0)
          : [];
      return `<div class="feed"><span>${e(t[kind === "planned" ? "planned" : "faultFeed"])}</span><span class="${["ok", "degraded"].includes(value) ? "ok" : "bad"}">${e(t[value] || t.unknown)}<small title="${e(t.checked)}">${available(checked) ? e(relativeTime(checked.state, lang)) : e(t.never)}</small></span></div>${value === "degraded" ? `<details class="source-note" data-coverage="${kind}" ${this._coverageOpen?.[kind] ? "open" : ""}><summary>${e(t.coverageDetails)}</summary><div class="coverage-explanation"><p>${e(t.coverageNote)}</p>${coverageCounts.length ? `<ul>${coverageCounts.map(([label, number]) => `<li>${e(label)}: ${e(number)}</li>`).join("")}</ul>` : ""}</div></details>` : ""}`;
    };
    const radius = this._state("nearby_planned_count")?.attributes.radius_m;
    const nearby =
      this._config.show_nearby &&
      (this._entities.nearby_planned_count ||
        this._entities.nearby_fault_reports)
        ? `<div class="nearby-group"><div class="nearby-heading"><h3>${e(t.nearby)}</h3>${radius ? `<span class="badge">${e(t.radius)} ${e(radius / 1000)} km</span>` : ""}</div><p class="muted nearby-note">${e(t.geographic)}</p>${reportList("nearby_planned_count", t.nearbyPlanned, false, true)}${reportList("nearby_fault_reports", t.nearbyFaults, true, true)}</div>`
        : "";
    const cooldown = Math.max(
      0,
      Math.ceil(((this._cooldownUntil || 0) - Date.now()) / 1000),
    );
    const refreshDisabled =
      this._busy ||
      cooldown > 0 ||
      !refreshAvailable(this._state("refresh")) ||
      this._hass.user?.is_read_only;
    const renderKey = JSON.stringify([
      this._config.show_map,
      this._mapOpen,
      this._mapError,
      this._mapFilters,
      lang,
      title,
      name,
      status,
      this._hass.config?.time_zone,
      ...KEYS.map((k) => this._state(k)),
      nearby,
      this._expanded,
      this._busy,
      cooldown,
      this._message,
      this._serviceError,
      this._hass.user?.is_read_only,
      Math.floor(Date.now() / 60000),
    ]);
    if (renderKey === this._renderKey) return;
    this._renderKey = renderKey;
    const previousMapHost =
      this._map && this._mapOpen && this._config.show_map
        ? this.shadowRoot.querySelector(".map-host")
        : undefined;
    if (!previousMapHost) this._destroyMap();
    const mapHtml = this._config.show_map
      ? `<button class="map-toggle" aria-expanded="${!!this._mapOpen}">${e(t[this._mapOpen ? "mapHide" : "mapToggle"])}</button>${
          this._mapOpen
            ? `<div class="map-controls"><label><input type="checkbox" data-map="planned" ${this._mapFilters.planned ? "checked" : ""}>${e(t.mapPlanned)}</label><label><input type="checkbox" data-map="fault" ${this._mapFilters.fault ? "checked" : ""}>${e(t.mapFaults)}</label><label>${e(t.mapDays)} <select data-map="days">${[
                [0, "allDates"],
                [7, "sevenDays"],
                [30, "thirtyDays"],
              ]
                .map(
                  ([v, k]) =>
                    `<option value="${v}" ${Number(this._mapFilters.days) === v ? "selected" : ""}>${e(t[k])}</option>`,
                )
                .join(
                  "",
                )}</select></label></div><div class="map-host"><div class="map-placeholder">${e(t[this._mapError ? "mapError" : "mapLoading"])}</div></div><div class="legend"><span><i style="background:#1976d2"></i>${e(t.mapPlanned)}</span><span><i style="background:#b66a00"></i>${e(t.mapFaults)}</span><span><i style="background:#008577"></i>${e(t.searchPoint)}</span></div><div class="muted notice">${e(t.mapApprox)} ${e(t.mapTiles)}${mapReports(this._hass.states, this._entities, this._config.show_nearby).length === 0 ? ` ${e(t.mapEmpty)}` : ""}</div>`
            : ""
        }`
      : "";
    const markup = shell(
      `<div class="body"><div class="top"><div class="bolt" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h7l-1 8 10-12h-7z"/></svg></div><div class="heading"><h2>${e(title)}</h2><div class="location">${e(name)}</div></div></div><div class="hero"><div class="status ${status}" role="status">${e(t[status])}</div>${["next", "now"].includes(status) ? `<div class="date">${e(range(nextStart, nextEnd, lang, zone))}</div><div class="meta">${badge(next?.match)}${status === "next" ? `<span class="countdown">${e(relativeTime(nextStart, lang))}</span>` : ""}</div>` : ""}<div class="muted">${e(t.provider)}</div></div><div class="stats">${metric("planned_count", t.count)}${metric("fault_reports", t.faults)}</div>${feed("planned")}${feed("faults")}${mapHtml}<details class="report-details" ${this._expanded ? "open" : ""}><summary>${e(t.details)}</summary>${section(t.upcoming, available(count) ? count.state : "—", `${status === "unavailable" ? `<div class="muted empty">${e(t.unknown)}</div>` : rows.length ? rows.map((r) => report(r, "planned_count")).join("") : `<div class="muted empty">${e(t.noReports)}</div>`}${count?.attributes.truncated ? `<div class="muted notice">${e(t.truncated)}</div>` : ""}`)}${reportList("fault_reports", t.faults, true)}${nearby}</details>${this._message ? `<div class="notice ${this._refreshError ? "error" : ""}" role="status">${e(t[this._message])}${this._refreshError ? `: ${e(this._serviceError)}` : ""}</div>` : ""}</div><div class="actions"><button id="refresh" ${refreshDisabled ? "disabled" : ""} title="${e(this._hass.user?.is_read_only ? t.permissions : t.refresh)}">${e(this._busy ? t.refreshing : cooldown ? `${t.refresh} (${cooldown}s)` : t.refresh)}</button><a href="${EON_URL}" target="_blank" rel="noopener noreferrer">${e(t.source)} ↗</a></div>`,
    );
    if (previousMapHost) {
      // Keep the map and its stylesheet connected: Leaflet measures the live
      // container during updates, and detaching it interrupts zoom/click state.
      const template = document.createElement("template");
      template.innerHTML = markup;
      const body = previousMapHost.parentElement;
      for (const child of [...body.childNodes])
        if (child !== previousMapHost) child.remove();
      let afterMap = false;
      for (const child of [
        ...template.content.querySelector(".body").childNodes,
      ]) {
        if (child.nodeType === 1 && child.matches(".map-host")) {
          afterMap = true;
          continue;
        }
        if (afterMap) body.append(child);
        else body.insertBefore(child, previousMapHost);
      }
      this.shadowRoot
        .querySelector(".actions")
        .replaceWith(template.content.querySelector(".actions"));
    } else this.shadowRoot.innerHTML = markup;
    this.shadowRoot
      .querySelector(".map-toggle")
      ?.addEventListener("click", () => {
        this._mapOpen = !this._mapOpen;
        this._mapError = false;
        this.render();
      });
    this.shadowRoot.querySelectorAll("[data-map]").forEach((el) =>
      el.addEventListener("change", () => {
        this._mapFilters[el.dataset.map] =
          el.type === "checkbox" ? el.checked : Number(el.value);
        // Filtering changes layers only; preserve focus, scrolling and map DOM.
        this._updateMap();
      }),
    );
    this._mountMap();
    this.shadowRoot
      .querySelector("#refresh")
      ?.addEventListener("click", () => this._refresh());
    this.shadowRoot
      .querySelectorAll("[data-info]")
      .forEach((b) =>
        b.addEventListener("click", () => this._info(b.dataset.info)),
      );
    this.shadowRoot.querySelectorAll("[data-coverage]").forEach((note) =>
      note.addEventListener("toggle", () => {
        this._coverageOpen ||= {};
        this._coverageOpen[note.dataset.coverage] = note.open;
      }),
    );
    this.shadowRoot
      .querySelector(".report-details")
      ?.addEventListener("toggle", (ev) => {
        this._expanded = ev.target.open;
      });
  }
}
export class HungarianPowerOutagesCardEditor extends Base {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  setConfig(config) {
    this._config = validateConfig(config);
    this.render();
  }
  set hass(hass) {
    this._hass = hass;
    if (this._connection !== hass.connection) {
      this._connection = hass.connection;
      this._load();
    } else this.render();
  }
  async _load() {
    try {
      const [registry, devices] = await Promise.all([
        this._hass.callWS({ type: "config/entity_registry/list" }),
        this._hass.callWS({ type: "config/device_registry/list" }),
      ]);
      const ids = new Set(
        registry
          .filter((e) => e.platform === DOMAIN && !e.disabled_by)
          .map((e) => e.device_id),
      );
      this._devices = devices.filter((d) => ids.has(d.id));
      this._error = false;
    } catch {
      this._error = true;
    }
    this.render();
  }
  render() {
    if (!this._config || !this._hass) return;
    const t = TEXT[language(this._config, this._hass)],
      e = escapeHtml;
    if (this.shadowRoot.activeElement?.tagName === "INPUT") return;
    this.shadowRoot.innerHTML = `<style>:host{display:block;color:var(--primary-text-color);font-family:var(--primary-font-family,Arial)}label{display:block;margin:14px 0;font-size:14px}input:not([type=checkbox]),select{box-sizing:border-box;display:block;width:100%;min-height:44px;margin-top:6px;padding:8px;border:1px solid var(--divider-color,#ccc);border-radius:8px;background:var(--card-background-color,#fff);color:inherit;font:inherit}input[type=checkbox]{margin-right:8px;accent-color:var(--primary-color)}p{font-size:13px;line-height:1.5}</style><label>${e(t.device)}<select data-key="device_id"><option value="">${e(t.choose)}</option>${(this._devices || []).map((d) => `<option value="${e(d.id)}" ${d.id === this._config.device_id ? "selected" : ""}>${e(d.name_by_user || d.name || d.id)}</option>`).join("")}</select></label>${this._error ? `<p>${e(t.discovery)}</p>` : this._devices?.length === 0 ? `<p>${e(t.failedSetup)}</p>` : ""}<label>${e(t.customTitle)}<input data-key="title" value="${e(this._config.title || "")}"></label><label>${e(t.language)}<select data-key="language">${[
      ["auto", t.automatic],
      ["hu", "Magyar"],
      ["en", "English"],
    ]
      .map(
        ([v, n]) =>
          `<option value="${v}" ${v === this._config.language ? "selected" : ""}>${e(n)}</option>`,
      )
      .join(
        "",
      )}</select></label><label><input type="checkbox" data-key="show_nearby" ${this._config.show_nearby ? "checked" : ""}>${e(t.nearbyToggle)}</label><label><input type="checkbox" data-key="show_map" ${this._config.show_map ? "checked" : ""}>${e(t.mapOption)}</label><label><input type="checkbox" data-key="expanded" ${this._config.expanded ? "checked" : ""}>${e(t.expanded)}</label>`;
    this.shadowRoot.querySelectorAll("[data-key]").forEach((el) =>
      el.addEventListener(
        el.tagName === "INPUT" && el.type !== "checkbox" ? "input" : "change",
        () => {
          this._config = {
            ...this._config,
            [el.dataset.key]: el.type === "checkbox" ? el.checked : el.value,
          };
          this.dispatchEvent(
            new CustomEvent("config-changed", {
              detail: { config: this._config },
              bubbles: true,
              composed: true,
            }),
          );
          if (el.dataset.key === "language") this.render();
        },
      ),
    );
  }
}
if (globalThis.customElements) {
  if (!customElements.get("hungarian-power-outages-card"))
    customElements.define(
      "hungarian-power-outages-card",
      HungarianPowerOutagesCard,
    );
  if (!customElements.get("hungarian-power-outages-card-editor"))
    customElements.define(
      "hungarian-power-outages-card-editor",
      HungarianPowerOutagesCardEditor,
    );
  window.customCards = window.customCards || [];
  if (
    !window.customCards.some((c) => c.type === "hungarian-power-outages-card")
  )
    window.customCards.push({
      type: "hungarian-power-outages-card",
      name: "Hungarian Power Outages",
      preview: true,
      description:
        "Planned outages, parcel matches, nearby reports and manual refresh.",
      getEntitySuggestion: (hass, id) => {
        const entry = hass.entities?.[id];
        return entry?.platform === DOMAIN && entry.device_id
          ? {
              config: {
                type: "custom:hungarian-power-outages-card",
                device_id: entry.device_id,
              },
            }
          : null;
      },
    });
}
