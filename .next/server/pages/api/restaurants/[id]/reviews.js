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
exports.id = "pages/api/restaurants/[id]/reviews";
exports.ids = ["pages/api/restaurants/[id]/reviews"];
exports.modules = {

/***/ "./lib/db.js":
/*!*******************!*\
  !*** ./lib/db.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"connectToDatabase\": () => (/* binding */ connectToDatabase)\n/* harmony export */ });\n/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongodb */ \"mongodb\");\n/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongodb__WEBPACK_IMPORTED_MODULE_0__);\n\nasync function connectToDatabase() {\n  const client = await mongodb__WEBPACK_IMPORTED_MODULE_0__.MongoClient.connect(process.env.MONGO_URI, {\n    useNewUrlParser: true,\n    useUnifiedTopology: true\n  });\n  return client;\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9saWIvZGIuanMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFFTyxlQUFlQyxpQkFBZixHQUFtQztBQUN6QyxRQUFNQyxNQUFNLEdBQUcsTUFBTUYsd0RBQUEsQ0FBb0JJLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxTQUFoQyxFQUEyQztBQUMvREMsSUFBQUEsZUFBZSxFQUFFLElBRDhDO0FBRS9EQyxJQUFBQSxrQkFBa0IsRUFBRTtBQUYyQyxHQUEzQyxDQUFyQjtBQUtBLFNBQU9OLE1BQVA7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL25leHQtYXV0aC1jcmVkZW50aWFscy8uL2xpYi9kYi5qcz9iYjUxIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1vbmdvQ2xpZW50IH0gZnJvbSAnbW9uZ29kYic7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb25uZWN0VG9EYXRhYmFzZSgpIHtcblx0Y29uc3QgY2xpZW50ID0gYXdhaXQgTW9uZ29DbGllbnQuY29ubmVjdChwcm9jZXNzLmVudi5NT05HT19VUkksIHtcblx0XHR1c2VOZXdVcmxQYXJzZXI6IHRydWUsXG5cdFx0dXNlVW5pZmllZFRvcG9sb2d5OiB0cnVlLFxuXHR9KTtcblxuXHRyZXR1cm4gY2xpZW50O1xufVxuIl0sIm5hbWVzIjpbIk1vbmdvQ2xpZW50IiwiY29ubmVjdFRvRGF0YWJhc2UiLCJjbGllbnQiLCJjb25uZWN0IiwicHJvY2VzcyIsImVudiIsIk1PTkdPX1VSSSIsInVzZU5ld1VybFBhcnNlciIsInVzZVVuaWZpZWRUb3BvbG9neSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./lib/db.js\n");

/***/ }),

/***/ "./pages/api/restaurants/[id]/reviews.js":
/*!***********************************************!*\
  !*** ./pages/api/restaurants/[id]/reviews.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../lib/db */ \"./lib/db.js\");\n/* harmony import */ var next_auth_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth/client */ \"next-auth/client\");\n/* harmony import */ var next_auth_client__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth_client__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mongodb */ \"mongodb\");\n/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(mongodb__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\n\nconst handler = async (req, res) => {\n  const client = await (0,_lib_db__WEBPACK_IMPORTED_MODULE_0__.connectToDatabase)();\n  const db = await client.db();\n  const session = await (0,next_auth_client__WEBPACK_IMPORTED_MODULE_1__.getSession)({\n    req\n  });\n  const data = await db.collection('reviews').aggregate([{\n    $match: {\n      restaurantId: new mongodb__WEBPACK_IMPORTED_MODULE_2__.ObjectId(req.query.id)\n    }\n  }, {\n    $lookup: {\n      from: 'users',\n      localField: 'userId',\n      foreignField: '_id',\n      as: 'user'\n    }\n  }, {\n    $unwind: '$user'\n  }]).toArray();\n  res.status(200).json(data);\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (handler);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9hcGkvcmVzdGF1cmFudHMvW2lkXS9yZXZpZXdzLmpzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTs7QUFFQSxNQUFNRyxPQUFPLEdBQUcsT0FBT0MsR0FBUCxFQUFZQyxHQUFaLEtBQW9CO0FBQ2xDLFFBQU1DLE1BQU0sR0FBRyxNQUFNTiwwREFBaUIsRUFBdEM7QUFDQSxRQUFNTyxFQUFFLEdBQUcsTUFBTUQsTUFBTSxDQUFDQyxFQUFQLEVBQWpCO0FBQ0EsUUFBTUMsT0FBTyxHQUFHLE1BQU1QLDREQUFVLENBQUM7QUFBRUcsSUFBQUE7QUFBRixHQUFELENBQWhDO0FBRUEsUUFBTUssSUFBSSxHQUFHLE1BQU1GLEVBQUUsQ0FDbEJHLFVBRGdCLENBQ0wsU0FESyxFQUVoQkMsU0FGZ0IsQ0FFTixDQUNUO0FBQ0VDLElBQUFBLE1BQU0sRUFBRTtBQUNOQyxNQUFBQSxZQUFZLEVBQUUsSUFBSVgsNkNBQUosQ0FBYUUsR0FBRyxDQUFDVSxLQUFKLENBQVVDLEVBQXZCO0FBRFI7QUFEVixHQURTLEVBTVQ7QUFDRUMsSUFBQUEsT0FBTyxFQUFFO0FBQ1BDLE1BQUFBLElBQUksRUFBRSxPQURDO0FBRVBDLE1BQUFBLFVBQVUsRUFBRSxRQUZMO0FBR1BDLE1BQUFBLFlBQVksRUFBRSxLQUhQO0FBSVBDLE1BQUFBLEVBQUUsRUFBRTtBQUpHO0FBRFgsR0FOUyxFQWNUO0FBQUVDLElBQUFBLE9BQU8sRUFBRTtBQUFYLEdBZFMsQ0FGTSxFQWtCaEJDLE9BbEJnQixFQUFuQjtBQW9CQWpCLEVBQUFBLEdBQUcsQ0FBQ2tCLE1BQUosQ0FBVyxHQUFYLEVBQWdCQyxJQUFoQixDQUFxQmYsSUFBckI7QUFDRCxDQTFCRDs7QUE0QkEsaUVBQWVOLE9BQWYiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9uZXh0LWF1dGgtY3JlZGVudGlhbHMvLi9wYWdlcy9hcGkvcmVzdGF1cmFudHMvW2lkXS9yZXZpZXdzLmpzP2YzN2IiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY29ubmVjdFRvRGF0YWJhc2UgfSBmcm9tICcuLi8uLi8uLi8uLi9saWIvZGInXG5pbXBvcnQgeyBnZXRTZXNzaW9uIH0gZnJvbSAnbmV4dC1hdXRoL2NsaWVudCdcbmltcG9ydCB7IE9iamVjdElkIH0gZnJvbSAnbW9uZ29kYidcblxuY29uc3QgaGFuZGxlciA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xuICBjb25zdCBjbGllbnQgPSBhd2FpdCBjb25uZWN0VG9EYXRhYmFzZSgpXG4gIGNvbnN0IGRiID0gYXdhaXQgY2xpZW50LmRiKClcbiAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlc3Npb24oeyByZXEgfSlcblxuICBjb25zdCBkYXRhID0gYXdhaXQgZGJcbiAgICAuY29sbGVjdGlvbigncmV2aWV3cycpXG4gICAgLmFnZ3JlZ2F0ZShbXG4gICAgICB7XG4gICAgICAgICRtYXRjaDoge1xuICAgICAgICAgIHJlc3RhdXJhbnRJZDogbmV3IE9iamVjdElkKHJlcS5xdWVyeS5pZCksXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAkbG9va3VwOiB7XG4gICAgICAgICAgZnJvbTogJ3VzZXJzJyxcbiAgICAgICAgICBsb2NhbEZpZWxkOiAndXNlcklkJyxcbiAgICAgICAgICBmb3JlaWduRmllbGQ6ICdfaWQnLFxuICAgICAgICAgIGFzOiAndXNlcicsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgeyAkdW53aW5kOiAnJHVzZXInIH0sXG4gICAgXSlcbiAgICAudG9BcnJheSgpXG5cbiAgcmVzLnN0YXR1cygyMDApLmpzb24oZGF0YSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgaGFuZGxlclxuIl0sIm5hbWVzIjpbImNvbm5lY3RUb0RhdGFiYXNlIiwiZ2V0U2Vzc2lvbiIsIk9iamVjdElkIiwiaGFuZGxlciIsInJlcSIsInJlcyIsImNsaWVudCIsImRiIiwic2Vzc2lvbiIsImRhdGEiLCJjb2xsZWN0aW9uIiwiYWdncmVnYXRlIiwiJG1hdGNoIiwicmVzdGF1cmFudElkIiwicXVlcnkiLCJpZCIsIiRsb29rdXAiLCJmcm9tIiwibG9jYWxGaWVsZCIsImZvcmVpZ25GaWVsZCIsImFzIiwiJHVud2luZCIsInRvQXJyYXkiLCJzdGF0dXMiLCJqc29uIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/api/restaurants/[id]/reviews.js\n");

/***/ }),

/***/ "mongodb":
/*!**************************!*\
  !*** external "mongodb" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("mongodb");

/***/ }),

/***/ "next-auth/client":
/*!***********************************!*\
  !*** external "next-auth/client" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("next-auth/client");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/api/restaurants/[id]/reviews.js"));
module.exports = __webpack_exports__;

})();