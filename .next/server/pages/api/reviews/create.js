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
exports.id = "pages/api/reviews/create";
exports.ids = ["pages/api/reviews/create"];
exports.modules = {

/***/ "./lib/db.js":
/*!*******************!*\
  !*** ./lib/db.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"connectToDatabase\": () => (/* binding */ connectToDatabase)\n/* harmony export */ });\n/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongodb */ \"mongodb\");\n/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongodb__WEBPACK_IMPORTED_MODULE_0__);\n\nasync function connectToDatabase() {\n  const client = await mongodb__WEBPACK_IMPORTED_MODULE_0__.MongoClient.connect(process.env.MONGO_URI, {\n    useNewUrlParser: true,\n    useUnifiedTopology: true\n  });\n  return client;\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9saWIvZGIuanMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFFTyxlQUFlQyxpQkFBZixHQUFtQztBQUN6QyxRQUFNQyxNQUFNLEdBQUcsTUFBTUYsd0RBQUEsQ0FBb0JJLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxTQUFoQyxFQUEyQztBQUMvREMsSUFBQUEsZUFBZSxFQUFFLElBRDhDO0FBRS9EQyxJQUFBQSxrQkFBa0IsRUFBRTtBQUYyQyxHQUEzQyxDQUFyQjtBQUtBLFNBQU9OLE1BQVA7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL25leHQtYXV0aC1jcmVkZW50aWFscy8uL2xpYi9kYi5qcz9iYjUxIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1vbmdvQ2xpZW50IH0gZnJvbSAnbW9uZ29kYic7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb25uZWN0VG9EYXRhYmFzZSgpIHtcblx0Y29uc3QgY2xpZW50ID0gYXdhaXQgTW9uZ29DbGllbnQuY29ubmVjdChwcm9jZXNzLmVudi5NT05HT19VUkksIHtcblx0XHR1c2VOZXdVcmxQYXJzZXI6IHRydWUsXG5cdFx0dXNlVW5pZmllZFRvcG9sb2d5OiB0cnVlLFxuXHR9KTtcblxuXHRyZXR1cm4gY2xpZW50O1xufVxuIl0sIm5hbWVzIjpbIk1vbmdvQ2xpZW50IiwiY29ubmVjdFRvRGF0YWJhc2UiLCJjbGllbnQiLCJjb25uZWN0IiwicHJvY2VzcyIsImVudiIsIk1PTkdPX1VSSSIsInVzZU5ld1VybFBhcnNlciIsInVzZVVuaWZpZWRUb3BvbG9neSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./lib/db.js\n");

/***/ }),

/***/ "./pages/api/reviews/create.js":
/*!*************************************!*\
  !*** ./pages/api/reviews/create.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lib/db */ \"./lib/db.js\");\n/* harmony import */ var next_auth_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth/client */ \"next-auth/client\");\n/* harmony import */ var next_auth_client__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth_client__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mongodb */ \"mongodb\");\n/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(mongodb__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\n\nconst handler = async (req, res) => {\n  const client = await (0,_lib_db__WEBPACK_IMPORTED_MODULE_0__.connectToDatabase)();\n  const db = await client.db();\n  const session = await (0,next_auth_client__WEBPACK_IMPORTED_MODULE_1__.getSession)({\n    req\n  });\n\n  if (session) {\n    await db.collection('reviews').insertOne({\n      rating: req.body.rating,\n      restaurantId: new mongodb__WEBPACK_IMPORTED_MODULE_2__.ObjectId(req.body.restaurantId),\n      userId: new mongodb__WEBPACK_IMPORTED_MODULE_2__.ObjectId(session.user._id)\n    });\n    const data = await db.collection('reviews').find({}).toArray();\n    res.status(200).json({\n      data\n    });\n  } else {\n    res.status(402).json('unauthorized');\n  }\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (handler);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9hcGkvcmV2aWV3cy9jcmVhdGUuanMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBOztBQUVBLE1BQU1HLE9BQU8sR0FBRyxPQUFPQyxHQUFQLEVBQVlDLEdBQVosS0FBb0I7QUFDbEMsUUFBTUMsTUFBTSxHQUFHLE1BQU1OLDBEQUFpQixFQUF0QztBQUNBLFFBQU1PLEVBQUUsR0FBRyxNQUFNRCxNQUFNLENBQUNDLEVBQVAsRUFBakI7QUFDQSxRQUFNQyxPQUFPLEdBQUcsTUFBTVAsNERBQVUsQ0FBQztBQUFFRyxJQUFBQTtBQUFGLEdBQUQsQ0FBaEM7O0FBRUEsTUFBSUksT0FBSixFQUFhO0FBQ1gsVUFBTUQsRUFBRSxDQUFDRSxVQUFILENBQWMsU0FBZCxFQUF5QkMsU0FBekIsQ0FBbUM7QUFDdkNDLE1BQUFBLE1BQU0sRUFBRVAsR0FBRyxDQUFDUSxJQUFKLENBQVNELE1BRHNCO0FBRXZDRSxNQUFBQSxZQUFZLEVBQUUsSUFBSVgsNkNBQUosQ0FBYUUsR0FBRyxDQUFDUSxJQUFKLENBQVNDLFlBQXRCLENBRnlCO0FBR3ZDQyxNQUFBQSxNQUFNLEVBQUUsSUFBSVosNkNBQUosQ0FBYU0sT0FBTyxDQUFDTyxJQUFSLENBQWFDLEdBQTFCO0FBSCtCLEtBQW5DLENBQU47QUFNQSxVQUFNQyxJQUFJLEdBQUcsTUFBTVYsRUFBRSxDQUFDRSxVQUFILENBQWMsU0FBZCxFQUF5QlMsSUFBekIsQ0FBOEIsRUFBOUIsRUFBa0NDLE9BQWxDLEVBQW5CO0FBQ0FkLElBQUFBLEdBQUcsQ0FBQ2UsTUFBSixDQUFXLEdBQVgsRUFBZ0JDLElBQWhCLENBQXFCO0FBQUVKLE1BQUFBO0FBQUYsS0FBckI7QUFDRCxHQVRELE1BU087QUFDTFosSUFBQUEsR0FBRyxDQUFDZSxNQUFKLENBQVcsR0FBWCxFQUFnQkMsSUFBaEIsQ0FBcUIsY0FBckI7QUFDRDtBQUNGLENBakJEOztBQW1CQSxpRUFBZWxCLE9BQWYiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9uZXh0LWF1dGgtY3JlZGVudGlhbHMvLi9wYWdlcy9hcGkvcmV2aWV3cy9jcmVhdGUuanM/OWU0YSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjb25uZWN0VG9EYXRhYmFzZSB9IGZyb20gJy4uLy4uLy4uL2xpYi9kYidcbmltcG9ydCB7IGdldFNlc3Npb24gfSBmcm9tICduZXh0LWF1dGgvY2xpZW50J1xuaW1wb3J0IHsgT2JqZWN0SWQgfSBmcm9tICdtb25nb2RiJ1xuXG5jb25zdCBoYW5kbGVyID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gIGNvbnN0IGNsaWVudCA9IGF3YWl0IGNvbm5lY3RUb0RhdGFiYXNlKClcbiAgY29uc3QgZGIgPSBhd2FpdCBjbGllbnQuZGIoKVxuICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2Vzc2lvbih7IHJlcSB9KVxuXG4gIGlmIChzZXNzaW9uKSB7XG4gICAgYXdhaXQgZGIuY29sbGVjdGlvbigncmV2aWV3cycpLmluc2VydE9uZSh7XG4gICAgICByYXRpbmc6IHJlcS5ib2R5LnJhdGluZyxcbiAgICAgIHJlc3RhdXJhbnRJZDogbmV3IE9iamVjdElkKHJlcS5ib2R5LnJlc3RhdXJhbnRJZCksXG4gICAgICB1c2VySWQ6IG5ldyBPYmplY3RJZChzZXNzaW9uLnVzZXIuX2lkKSxcbiAgICB9KVxuXG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Jldmlld3MnKS5maW5kKHt9KS50b0FycmF5KClcbiAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7IGRhdGEgfSlcbiAgfSBlbHNlIHtcbiAgICByZXMuc3RhdHVzKDQwMikuanNvbigndW5hdXRob3JpemVkJylcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBoYW5kbGVyXG4iXSwibmFtZXMiOlsiY29ubmVjdFRvRGF0YWJhc2UiLCJnZXRTZXNzaW9uIiwiT2JqZWN0SWQiLCJoYW5kbGVyIiwicmVxIiwicmVzIiwiY2xpZW50IiwiZGIiLCJzZXNzaW9uIiwiY29sbGVjdGlvbiIsImluc2VydE9uZSIsInJhdGluZyIsImJvZHkiLCJyZXN0YXVyYW50SWQiLCJ1c2VySWQiLCJ1c2VyIiwiX2lkIiwiZGF0YSIsImZpbmQiLCJ0b0FycmF5Iiwic3RhdHVzIiwianNvbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./pages/api/reviews/create.js\n");

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
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/api/reviews/create.js"));
module.exports = __webpack_exports__;

})();