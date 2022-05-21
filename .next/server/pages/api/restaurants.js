"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/restaurants";
exports.ids = ["pages/api/restaurants"];
exports.modules = {

/***/ "./lib/db.js":
/*!*******************!*\
  !*** ./lib/db.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"connectToDatabase\": () => (/* binding */ connectToDatabase)\n/* harmony export */ });\n/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongodb */ \"mongodb\");\n/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongodb__WEBPACK_IMPORTED_MODULE_0__);\n\nasync function connectToDatabase() {\n  const client = await mongodb__WEBPACK_IMPORTED_MODULE_0__.MongoClient.connect(process.env.MONGO_URI, {\n    useNewUrlParser: true,\n    useUnifiedTopology: true\n  });\n  return client;\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9saWIvZGIuanMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFFTyxlQUFlQyxpQkFBZixHQUFtQztBQUN6QyxRQUFNQyxNQUFNLEdBQUcsTUFBTUYsd0RBQUEsQ0FBb0JJLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxTQUFoQyxFQUEyQztBQUMvREMsSUFBQUEsZUFBZSxFQUFFLElBRDhDO0FBRS9EQyxJQUFBQSxrQkFBa0IsRUFBRTtBQUYyQyxHQUEzQyxDQUFyQjtBQUtBLFNBQU9OLE1BQVA7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL25leHQtYXV0aC1jcmVkZW50aWFscy8uL2xpYi9kYi5qcz9iYjUxIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1vbmdvQ2xpZW50IH0gZnJvbSAnbW9uZ29kYic7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb25uZWN0VG9EYXRhYmFzZSgpIHtcblx0Y29uc3QgY2xpZW50ID0gYXdhaXQgTW9uZ29DbGllbnQuY29ubmVjdChwcm9jZXNzLmVudi5NT05HT19VUkksIHtcblx0XHR1c2VOZXdVcmxQYXJzZXI6IHRydWUsXG5cdFx0dXNlVW5pZmllZFRvcG9sb2d5OiB0cnVlLFxuXHR9KTtcblxuXHRyZXR1cm4gY2xpZW50O1xufVxuIl0sIm5hbWVzIjpbIk1vbmdvQ2xpZW50IiwiY29ubmVjdFRvRGF0YWJhc2UiLCJjbGllbnQiLCJjb25uZWN0IiwicHJvY2VzcyIsImVudiIsIk1PTkdPX1VSSSIsInVzZU5ld1VybFBhcnNlciIsInVzZVVuaWZpZWRUb3BvbG9neSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./lib/db.js\n");

/***/ }),

/***/ "./pages/api/restaurants/index.js":
/*!****************************************!*\
  !*** ./pages/api/restaurants/index.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lib/db */ \"./lib/db.js\");\n\n\nconst handler = async (req, res) => {\n  const client = await (0,_lib_db__WEBPACK_IMPORTED_MODULE_0__.connectToDatabase)();\n  const db = await client.db();\n  let result;\n\n  if (req.query.search) {\n    result = await db.collection('restaurants').aggregate([{\n      $search: {\n        autocomplete: {\n          query: req.query.search,\n          path: 'name',\n          fuzzy: {\n            maxEdits: 1\n          }\n        }\n      }\n    }]).toArray();\n  } else {\n    result = await db.collection('restaurants').find({}).toArray();\n  }\n\n  res.status(200).json(result);\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (handler);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9hcGkvcmVzdGF1cmFudHMvaW5kZXguanMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTs7QUFFQSxNQUFNQyxPQUFPLEdBQUcsT0FBT0MsR0FBUCxFQUFZQyxHQUFaLEtBQW9CO0FBQ2xDLFFBQU1DLE1BQU0sR0FBRyxNQUFNSiwwREFBaUIsRUFBdEM7QUFDQSxRQUFNSyxFQUFFLEdBQUcsTUFBTUQsTUFBTSxDQUFDQyxFQUFQLEVBQWpCO0FBQ0EsTUFBSUMsTUFBSjs7QUFFQSxNQUFJSixHQUFHLENBQUNLLEtBQUosQ0FBVUMsTUFBZCxFQUFzQjtBQUNwQkYsSUFBQUEsTUFBTSxHQUFHLE1BQU1ELEVBQUUsQ0FDZEksVUFEWSxDQUNELGFBREMsRUFFWkMsU0FGWSxDQUVGLENBQ1Q7QUFDRUMsTUFBQUEsT0FBTyxFQUFFO0FBQ1BDLFFBQUFBLFlBQVksRUFBRTtBQUNaTCxVQUFBQSxLQUFLLEVBQUVMLEdBQUcsQ0FBQ0ssS0FBSixDQUFVQyxNQURMO0FBRVpLLFVBQUFBLElBQUksRUFBRSxNQUZNO0FBR1pDLFVBQUFBLEtBQUssRUFBRTtBQUNMQyxZQUFBQSxRQUFRLEVBQUU7QUFETDtBQUhLO0FBRFA7QUFEWCxLQURTLENBRkUsRUFlWkMsT0FmWSxFQUFmO0FBZ0JELEdBakJELE1BaUJPO0FBQ0xWLElBQUFBLE1BQU0sR0FBRyxNQUFNRCxFQUFFLENBQUNJLFVBQUgsQ0FBYyxhQUFkLEVBQTZCUSxJQUE3QixDQUFrQyxFQUFsQyxFQUFzQ0QsT0FBdEMsRUFBZjtBQUNEOztBQUNEYixFQUFBQSxHQUFHLENBQUNlLE1BQUosQ0FBVyxHQUFYLEVBQWdCQyxJQUFoQixDQUFxQmIsTUFBckI7QUFDRCxDQTFCRDs7QUE0QkEsaUVBQWVMLE9BQWYiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9uZXh0LWF1dGgtY3JlZGVudGlhbHMvLi9wYWdlcy9hcGkvcmVzdGF1cmFudHMvaW5kZXguanM/YjQzNyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjb25uZWN0VG9EYXRhYmFzZSB9IGZyb20gJy4uLy4uLy4uL2xpYi9kYidcblxuY29uc3QgaGFuZGxlciA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xuICBjb25zdCBjbGllbnQgPSBhd2FpdCBjb25uZWN0VG9EYXRhYmFzZSgpXG4gIGNvbnN0IGRiID0gYXdhaXQgY2xpZW50LmRiKClcbiAgbGV0IHJlc3VsdFxuXG4gIGlmIChyZXEucXVlcnkuc2VhcmNoKSB7XG4gICAgcmVzdWx0ID0gYXdhaXQgZGJcbiAgICAgIC5jb2xsZWN0aW9uKCdyZXN0YXVyYW50cycpXG4gICAgICAuYWdncmVnYXRlKFtcbiAgICAgICAge1xuICAgICAgICAgICRzZWFyY2g6IHtcbiAgICAgICAgICAgIGF1dG9jb21wbGV0ZToge1xuICAgICAgICAgICAgICBxdWVyeTogcmVxLnF1ZXJ5LnNlYXJjaCxcbiAgICAgICAgICAgICAgcGF0aDogJ25hbWUnLFxuICAgICAgICAgICAgICBmdXp6eToge1xuICAgICAgICAgICAgICAgIG1heEVkaXRzOiAxLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSlcbiAgICAgIC50b0FycmF5KClcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdyZXN0YXVyYW50cycpLmZpbmQoe30pLnRvQXJyYXkoKVxuICB9XG4gIHJlcy5zdGF0dXMoMjAwKS5qc29uKHJlc3VsdClcbn1cblxuZXhwb3J0IGRlZmF1bHQgaGFuZGxlclxuIl0sIm5hbWVzIjpbImNvbm5lY3RUb0RhdGFiYXNlIiwiaGFuZGxlciIsInJlcSIsInJlcyIsImNsaWVudCIsImRiIiwicmVzdWx0IiwicXVlcnkiLCJzZWFyY2giLCJjb2xsZWN0aW9uIiwiYWdncmVnYXRlIiwiJHNlYXJjaCIsImF1dG9jb21wbGV0ZSIsInBhdGgiLCJmdXp6eSIsIm1heEVkaXRzIiwidG9BcnJheSIsImZpbmQiLCJzdGF0dXMiLCJqc29uIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/api/restaurants/index.js\n");

/***/ }),

/***/ "mongodb":
/*!**************************!*\
  !*** external "mongodb" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("mongodb");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/api/restaurants/index.js"));
module.exports = __webpack_exports__;

})();