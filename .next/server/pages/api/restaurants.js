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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lib/db */ \"./lib/db.js\");\n\n\nconst handler = async (req, res) => {\n  const client = await (0,_lib_db__WEBPACK_IMPORTED_MODULE_0__.connectToDatabase)();\n  const db = await client.db();\n  let result;\n\n  if (req.query.search) {\n    result = await db.collection('restaurants').aggregate([{\n      $search: {\n        autocomplete: {\n          query: req.query.search,\n          path: 'name',\n          fuzzy: {\n            maxEdits: 1\n          }\n        }\n      }\n    }]).toArray();\n  } else {\n    result = await db.collection('restaurants').aggregate([{\n      $lookup: {\n        from: 'reviews',\n        localField: '_id',\n        foreignField: 'restaurantId',\n        as: 'reviews'\n      }\n    }, {\n      $addFields: {\n        reviewCount: {\n          $size: '$reviews'\n        },\n        avgRating: {\n          $avg: '$reviews.rating'\n        }\n      }\n    }]).toArray();\n  }\n\n  res.status(200).json(result);\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (handler);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9hcGkvcmVzdGF1cmFudHMvaW5kZXguanMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTs7QUFFQSxNQUFNQyxPQUFPLEdBQUcsT0FBT0MsR0FBUCxFQUFZQyxHQUFaLEtBQW9CO0FBQ2xDLFFBQU1DLE1BQU0sR0FBRyxNQUFNSiwwREFBaUIsRUFBdEM7QUFDQSxRQUFNSyxFQUFFLEdBQUcsTUFBTUQsTUFBTSxDQUFDQyxFQUFQLEVBQWpCO0FBQ0EsTUFBSUMsTUFBSjs7QUFFQSxNQUFJSixHQUFHLENBQUNLLEtBQUosQ0FBVUMsTUFBZCxFQUFzQjtBQUNwQkYsSUFBQUEsTUFBTSxHQUFHLE1BQU1ELEVBQUUsQ0FDZEksVUFEWSxDQUNELGFBREMsRUFFWkMsU0FGWSxDQUVGLENBQ1Q7QUFDRUMsTUFBQUEsT0FBTyxFQUFFO0FBQ1BDLFFBQUFBLFlBQVksRUFBRTtBQUNaTCxVQUFBQSxLQUFLLEVBQUVMLEdBQUcsQ0FBQ0ssS0FBSixDQUFVQyxNQURMO0FBRVpLLFVBQUFBLElBQUksRUFBRSxNQUZNO0FBR1pDLFVBQUFBLEtBQUssRUFBRTtBQUNMQyxZQUFBQSxRQUFRLEVBQUU7QUFETDtBQUhLO0FBRFA7QUFEWCxLQURTLENBRkUsRUFlWkMsT0FmWSxFQUFmO0FBZ0JELEdBakJELE1BaUJPO0FBQ0xWLElBQUFBLE1BQU0sR0FBRyxNQUFNRCxFQUFFLENBQ2RJLFVBRFksQ0FDRCxhQURDLEVBRVpDLFNBRlksQ0FFRixDQUNUO0FBQ0VPLE1BQUFBLE9BQU8sRUFBRTtBQUNQQyxRQUFBQSxJQUFJLEVBQUUsU0FEQztBQUVQQyxRQUFBQSxVQUFVLEVBQUUsS0FGTDtBQUdQQyxRQUFBQSxZQUFZLEVBQUUsY0FIUDtBQUlQQyxRQUFBQSxFQUFFLEVBQUU7QUFKRztBQURYLEtBRFMsRUFTVDtBQUNFQyxNQUFBQSxVQUFVLEVBQUU7QUFDVkMsUUFBQUEsV0FBVyxFQUFFO0FBQUVDLFVBQUFBLEtBQUssRUFBRTtBQUFULFNBREg7QUFFVkMsUUFBQUEsU0FBUyxFQUFFO0FBQUVDLFVBQUFBLElBQUksRUFBRTtBQUFSO0FBRkQ7QUFEZCxLQVRTLENBRkUsRUFrQlpWLE9BbEJZLEVBQWY7QUFtQkQ7O0FBQ0RiLEVBQUFBLEdBQUcsQ0FBQ3dCLE1BQUosQ0FBVyxHQUFYLEVBQWdCQyxJQUFoQixDQUFxQnRCLE1BQXJCO0FBQ0QsQ0E1Q0Q7O0FBOENBLGlFQUFlTCxPQUFmIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbmV4dC1hdXRoLWNyZWRlbnRpYWxzLy4vcGFnZXMvYXBpL3Jlc3RhdXJhbnRzL2luZGV4LmpzP2I0MzciXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY29ubmVjdFRvRGF0YWJhc2UgfSBmcm9tICcuLi8uLi8uLi9saWIvZGInXG5cbmNvbnN0IGhhbmRsZXIgPSBhc3luYyAocmVxLCByZXMpID0+IHtcbiAgY29uc3QgY2xpZW50ID0gYXdhaXQgY29ubmVjdFRvRGF0YWJhc2UoKVxuICBjb25zdCBkYiA9IGF3YWl0IGNsaWVudC5kYigpXG4gIGxldCByZXN1bHRcblxuICBpZiAocmVxLnF1ZXJ5LnNlYXJjaCkge1xuICAgIHJlc3VsdCA9IGF3YWl0IGRiXG4gICAgICAuY29sbGVjdGlvbigncmVzdGF1cmFudHMnKVxuICAgICAgLmFnZ3JlZ2F0ZShbXG4gICAgICAgIHtcbiAgICAgICAgICAkc2VhcmNoOiB7XG4gICAgICAgICAgICBhdXRvY29tcGxldGU6IHtcbiAgICAgICAgICAgICAgcXVlcnk6IHJlcS5xdWVyeS5zZWFyY2gsXG4gICAgICAgICAgICAgIHBhdGg6ICduYW1lJyxcbiAgICAgICAgICAgICAgZnV6enk6IHtcbiAgICAgICAgICAgICAgICBtYXhFZGl0czogMSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0pXG4gICAgICAudG9BcnJheSgpXG4gIH0gZWxzZSB7XG4gICAgcmVzdWx0ID0gYXdhaXQgZGJcbiAgICAgIC5jb2xsZWN0aW9uKCdyZXN0YXVyYW50cycpXG4gICAgICAuYWdncmVnYXRlKFtcbiAgICAgICAge1xuICAgICAgICAgICRsb29rdXA6IHtcbiAgICAgICAgICAgIGZyb206ICdyZXZpZXdzJyxcbiAgICAgICAgICAgIGxvY2FsRmllbGQ6ICdfaWQnLFxuICAgICAgICAgICAgZm9yZWlnbkZpZWxkOiAncmVzdGF1cmFudElkJyxcbiAgICAgICAgICAgIGFzOiAncmV2aWV3cycsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICRhZGRGaWVsZHM6IHtcbiAgICAgICAgICAgIHJldmlld0NvdW50OiB7ICRzaXplOiAnJHJldmlld3MnIH0sXG4gICAgICAgICAgICBhdmdSYXRpbmc6IHsgJGF2ZzogJyRyZXZpZXdzLnJhdGluZycgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSlcbiAgICAgIC50b0FycmF5KClcbiAgfVxuICByZXMuc3RhdHVzKDIwMCkuanNvbihyZXN1bHQpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGhhbmRsZXJcbiJdLCJuYW1lcyI6WyJjb25uZWN0VG9EYXRhYmFzZSIsImhhbmRsZXIiLCJyZXEiLCJyZXMiLCJjbGllbnQiLCJkYiIsInJlc3VsdCIsInF1ZXJ5Iiwic2VhcmNoIiwiY29sbGVjdGlvbiIsImFnZ3JlZ2F0ZSIsIiRzZWFyY2giLCJhdXRvY29tcGxldGUiLCJwYXRoIiwiZnV6enkiLCJtYXhFZGl0cyIsInRvQXJyYXkiLCIkbG9va3VwIiwiZnJvbSIsImxvY2FsRmllbGQiLCJmb3JlaWduRmllbGQiLCJhcyIsIiRhZGRGaWVsZHMiLCJyZXZpZXdDb3VudCIsIiRzaXplIiwiYXZnUmF0aW5nIiwiJGF2ZyIsInN0YXR1cyIsImpzb24iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/api/restaurants/index.js\n");

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