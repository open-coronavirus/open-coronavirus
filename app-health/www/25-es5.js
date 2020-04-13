function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[25], {
  /***/
  "./node_modules/@ionic/core/dist/esm/ion-img.entry.js":
  /*!************************************************************!*\
    !*** ./node_modules/@ionic/core/dist/esm/ion-img.entry.js ***!
    \************************************************************/

  /*! exports provided: ion_img */

  /***/
  function node_modulesIonicCoreDistEsmIonImgEntryJs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "ion_img", function () {
      return Img;
    });
    /* harmony import */


    var _core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! ./core-0a8d4d2e.js */
    "./node_modules/@ionic/core/dist/esm/core-0a8d4d2e.js");
    /* harmony import */


    var _config_3c7f3790_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! ./config-3c7f3790.js */
    "./node_modules/@ionic/core/dist/esm/config-3c7f3790.js");

    var Img = /*#__PURE__*/function () {
      function Img(hostRef) {
        var _this = this;

        _classCallCheck(this, Img);

        Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["r"])(this, hostRef);

        this.onLoad = function () {
          _this.ionImgDidLoad.emit();
        };

        this.onError = function () {
          _this.ionError.emit();
        };

        this.ionImgWillLoad = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["d"])(this, "ionImgWillLoad", 7);
        this.ionImgDidLoad = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["d"])(this, "ionImgDidLoad", 7);
        this.ionError = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["d"])(this, "ionError", 7);
      }

      _createClass(Img, [{
        key: "srcChanged",
        value: function srcChanged() {
          this.addIO();
        }
      }, {
        key: "componentDidLoad",
        value: function componentDidLoad() {
          this.addIO();
        }
      }, {
        key: "addIO",
        value: function addIO() {
          var _this2 = this;

          if (this.src === undefined) {
            return;
          }

          if ('IntersectionObserver' in window) {
            this.removeIO();
            this.io = new IntersectionObserver(function (data) {
              // because there will only ever be one instance
              // of the element we are observing
              // we can just use data[0]
              if (data[0].isIntersecting) {
                _this2.load();

                _this2.removeIO();
              }
            });
            this.io.observe(this.el);
          } else {
            // fall back to setTimeout for Safari and IE
            setTimeout(function () {
              return _this2.load();
            }, 200);
          }
        }
      }, {
        key: "load",
        value: function load() {
          this.loadError = this.onError;
          this.loadSrc = this.src;
          this.ionImgWillLoad.emit();
        }
      }, {
        key: "removeIO",
        value: function removeIO() {
          if (this.io) {
            this.io.disconnect();
            this.io = undefined;
          }
        }
      }, {
        key: "render",
        value: function render() {
          return Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["H"], {
            "class": Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["c"])(this)
          }, Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("img", {
            decoding: "async",
            src: this.loadSrc,
            alt: this.alt,
            onLoad: this.onLoad,
            onError: this.loadError
          }));
        }
      }, {
        key: "el",
        get: function get() {
          return Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["e"])(this);
        }
      }], [{
        key: "watchers",
        get: function get() {
          return {
            "src": ["srcChanged"]
          };
        }
      }, {
        key: "style",
        get: function get() {
          return ":host{-o-object-fit:contain;object-fit:contain}:host,img{display:block}img{width:100%;height:100%;-o-object-fit:inherit;object-fit:inherit;-o-object-position:inherit;object-position:inherit}";
        }
      }]);

      return Img;
    }();
    /***/

  }
}]);
//# sourceMappingURL=25-es5.js.map