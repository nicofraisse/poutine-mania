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
exports.id = "pages/api/auth/signup";
exports.ids = ["pages/api/auth/signup"];
exports.modules = {

/***/ "./lib/auth.js":
/*!*********************!*\
  !*** ./lib/auth.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"hashPassword\": () => (/* binding */ hashPassword),\n/* harmony export */   \"verifyPassword\": () => (/* binding */ verifyPassword)\n/* harmony export */ });\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bcryptjs */ \"bcryptjs\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_0__);\n\nasync function hashPassword(password) {\n  const hashedPassword = await (0,bcryptjs__WEBPACK_IMPORTED_MODULE_0__.hash)(password, 12);\n  return hashedPassword;\n}\nasync function verifyPassword(password, hashedPassword) {\n  const isValid = await (0,bcryptjs__WEBPACK_IMPORTED_MODULE_0__.compare)(password, hashedPassword);\n  return isValid;\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9saWIvYXV0aC5qcy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7QUFFTyxlQUFlRSxZQUFmLENBQTRCQyxRQUE1QixFQUFzQztBQUMzQyxRQUFNQyxjQUFjLEdBQUcsTUFBTUosOENBQUksQ0FBQ0csUUFBRCxFQUFXLEVBQVgsQ0FBakM7QUFDQSxTQUFPQyxjQUFQO0FBQ0Q7QUFFTSxlQUFlQyxjQUFmLENBQThCRixRQUE5QixFQUF3Q0MsY0FBeEMsRUFBd0Q7QUFDN0QsUUFBTUUsT0FBTyxHQUFHLE1BQU1MLGlEQUFPLENBQUNFLFFBQUQsRUFBV0MsY0FBWCxDQUE3QjtBQUNBLFNBQU9FLE9BQVA7QUFDRCIsInNvdXJjZXMiOlsid2VicGFjazovL25leHQtYXV0aC1jcmVkZW50aWFscy8uL2xpYi9hdXRoLmpzPzMyNGYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaGFzaCwgY29tcGFyZSB9IGZyb20gJ2JjcnlwdGpzJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhc2hQYXNzd29yZChwYXNzd29yZCkge1xuICBjb25zdCBoYXNoZWRQYXNzd29yZCA9IGF3YWl0IGhhc2gocGFzc3dvcmQsIDEyKTtcbiAgcmV0dXJuIGhhc2hlZFBhc3N3b3JkO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdmVyaWZ5UGFzc3dvcmQocGFzc3dvcmQsIGhhc2hlZFBhc3N3b3JkKSB7XG4gIGNvbnN0IGlzVmFsaWQgPSBhd2FpdCBjb21wYXJlKHBhc3N3b3JkLCBoYXNoZWRQYXNzd29yZCk7XG4gIHJldHVybiBpc1ZhbGlkO1xufSJdLCJuYW1lcyI6WyJoYXNoIiwiY29tcGFyZSIsImhhc2hQYXNzd29yZCIsInBhc3N3b3JkIiwiaGFzaGVkUGFzc3dvcmQiLCJ2ZXJpZnlQYXNzd29yZCIsImlzVmFsaWQiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./lib/auth.js\n");

/***/ }),

/***/ "./lib/db.js":
/*!*******************!*\
  !*** ./lib/db.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"connectToDatabase\": () => (/* binding */ connectToDatabase)\n/* harmony export */ });\n/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongodb */ \"mongodb\");\n/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongodb__WEBPACK_IMPORTED_MODULE_0__);\n\nasync function connectToDatabase() {\n  const client = await mongodb__WEBPACK_IMPORTED_MODULE_0__.MongoClient.connect(process.env.MONGO_URI, {\n    useNewUrlParser: true,\n    useUnifiedTopology: true\n  });\n  return client;\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9saWIvZGIuanMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFFTyxlQUFlQyxpQkFBZixHQUFtQztBQUN6QyxRQUFNQyxNQUFNLEdBQUcsTUFBTUYsd0RBQUEsQ0FBb0JJLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxTQUFoQyxFQUEyQztBQUMvREMsSUFBQUEsZUFBZSxFQUFFLElBRDhDO0FBRS9EQyxJQUFBQSxrQkFBa0IsRUFBRTtBQUYyQyxHQUEzQyxDQUFyQjtBQUtBLFNBQU9OLE1BQVA7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL25leHQtYXV0aC1jcmVkZW50aWFscy8uL2xpYi9kYi5qcz9iYjUxIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1vbmdvQ2xpZW50IH0gZnJvbSAnbW9uZ29kYic7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb25uZWN0VG9EYXRhYmFzZSgpIHtcblx0Y29uc3QgY2xpZW50ID0gYXdhaXQgTW9uZ29DbGllbnQuY29ubmVjdChwcm9jZXNzLmVudi5NT05HT19VUkksIHtcblx0XHR1c2VOZXdVcmxQYXJzZXI6IHRydWUsXG5cdFx0dXNlVW5pZmllZFRvcG9sb2d5OiB0cnVlLFxuXHR9KTtcblxuXHRyZXR1cm4gY2xpZW50O1xufVxuIl0sIm5hbWVzIjpbIk1vbmdvQ2xpZW50IiwiY29ubmVjdFRvRGF0YWJhc2UiLCJjbGllbnQiLCJjb25uZWN0IiwicHJvY2VzcyIsImVudiIsIk1PTkdPX1VSSSIsInVzZU5ld1VybFBhcnNlciIsInVzZVVuaWZpZWRUb3BvbG9neSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./lib/db.js\n");

/***/ }),

/***/ "./pages/api/auth/signup.js":
/*!**********************************!*\
  !*** ./pages/api/auth/signup.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lib/auth */ \"./lib/auth.js\");\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../lib/db */ \"./lib/db.js\");\n\n\n\nasync function handler(req, res) {\n  if (req.method !== 'POST') {\n    return;\n  }\n\n  const data = req.body;\n  const {\n    email,\n    password\n  } = data;\n\n  if (!email || !email.includes('@') || !password || password.trim().length < 7) {\n    res.status(422).json({\n      message: 'Invalid input - password should also be at least 7 characters long.'\n    });\n    return;\n  }\n\n  const client = await (0,_lib_db__WEBPACK_IMPORTED_MODULE_1__.connectToDatabase)();\n  const db = client.db();\n  const existingUser = await db.collection('users').findOne({\n    email: email\n  });\n\n  if (existingUser) {\n    res.status(422).json({\n      message: 'User exists already!'\n    });\n    client.close();\n    return;\n  }\n\n  const hashedPassword = await (0,_lib_auth__WEBPACK_IMPORTED_MODULE_0__.hashPassword)(password);\n  const result = await db.collection('users').insertOne({\n    email: email,\n    password: hashedPassword\n  });\n  res.status(201).json({\n    message: 'Created user!'\n  });\n  client.close();\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (handler);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9hcGkvYXV0aC9zaWdudXAuanMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTs7QUFFQSxlQUFlRSxPQUFmLENBQXVCQyxHQUF2QixFQUE0QkMsR0FBNUIsRUFBaUM7QUFDL0IsTUFBSUQsR0FBRyxDQUFDRSxNQUFKLEtBQWUsTUFBbkIsRUFBMkI7QUFDekI7QUFDRDs7QUFFRCxRQUFNQyxJQUFJLEdBQUdILEdBQUcsQ0FBQ0ksSUFBakI7QUFFQSxRQUFNO0FBQUVDLElBQUFBLEtBQUY7QUFBU0MsSUFBQUE7QUFBVCxNQUFzQkgsSUFBNUI7O0FBRUEsTUFDRSxDQUFDRSxLQUFELElBQ0EsQ0FBQ0EsS0FBSyxDQUFDRSxRQUFOLENBQWUsR0FBZixDQURELElBRUEsQ0FBQ0QsUUFGRCxJQUdBQSxRQUFRLENBQUNFLElBQVQsR0FBZ0JDLE1BQWhCLEdBQXlCLENBSjNCLEVBS0U7QUFDQVIsSUFBQUEsR0FBRyxDQUFDUyxNQUFKLENBQVcsR0FBWCxFQUFnQkMsSUFBaEIsQ0FBcUI7QUFDbkJDLE1BQUFBLE9BQU8sRUFDTDtBQUZpQixLQUFyQjtBQUlBO0FBQ0Q7O0FBRUQsUUFBTUMsTUFBTSxHQUFHLE1BQU1mLDBEQUFpQixFQUF0QztBQUVBLFFBQU1nQixFQUFFLEdBQUdELE1BQU0sQ0FBQ0MsRUFBUCxFQUFYO0FBRUEsUUFBTUMsWUFBWSxHQUFHLE1BQU1ELEVBQUUsQ0FBQ0UsVUFBSCxDQUFjLE9BQWQsRUFBdUJDLE9BQXZCLENBQStCO0FBQUVaLElBQUFBLEtBQUssRUFBRUE7QUFBVCxHQUEvQixDQUEzQjs7QUFFQSxNQUFJVSxZQUFKLEVBQWtCO0FBQ2hCZCxJQUFBQSxHQUFHLENBQUNTLE1BQUosQ0FBVyxHQUFYLEVBQWdCQyxJQUFoQixDQUFxQjtBQUFFQyxNQUFBQSxPQUFPLEVBQUU7QUFBWCxLQUFyQjtBQUNBQyxJQUFBQSxNQUFNLENBQUNLLEtBQVA7QUFDQTtBQUNEOztBQUVELFFBQU1DLGNBQWMsR0FBRyxNQUFNdEIsdURBQVksQ0FBQ1MsUUFBRCxDQUF6QztBQUVBLFFBQU1jLE1BQU0sR0FBRyxNQUFNTixFQUFFLENBQUNFLFVBQUgsQ0FBYyxPQUFkLEVBQXVCSyxTQUF2QixDQUFpQztBQUNwRGhCLElBQUFBLEtBQUssRUFBRUEsS0FENkM7QUFFcERDLElBQUFBLFFBQVEsRUFBRWE7QUFGMEMsR0FBakMsQ0FBckI7QUFLQWxCLEVBQUFBLEdBQUcsQ0FBQ1MsTUFBSixDQUFXLEdBQVgsRUFBZ0JDLElBQWhCLENBQXFCO0FBQUVDLElBQUFBLE9BQU8sRUFBRTtBQUFYLEdBQXJCO0FBQ0FDLEVBQUFBLE1BQU0sQ0FBQ0ssS0FBUDtBQUNEOztBQUVELGlFQUFlbkIsT0FBZiIsInNvdXJjZXMiOlsid2VicGFjazovL25leHQtYXV0aC1jcmVkZW50aWFscy8uL3BhZ2VzL2FwaS9hdXRoL3NpZ251cC5qcz9jNTJmIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGhhc2hQYXNzd29yZCB9IGZyb20gJy4uLy4uLy4uL2xpYi9hdXRoJztcbmltcG9ydCB7IGNvbm5lY3RUb0RhdGFiYXNlIH0gZnJvbSAnLi4vLi4vLi4vbGliL2RiJztcblxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihyZXEsIHJlcykge1xuICBpZiAocmVxLm1ldGhvZCAhPT0gJ1BPU1QnKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgZGF0YSA9IHJlcS5ib2R5O1xuXG4gIGNvbnN0IHsgZW1haWwsIHBhc3N3b3JkIH0gPSBkYXRhO1xuXG4gIGlmIChcbiAgICAhZW1haWwgfHxcbiAgICAhZW1haWwuaW5jbHVkZXMoJ0AnKSB8fFxuICAgICFwYXNzd29yZCB8fFxuICAgIHBhc3N3b3JkLnRyaW0oKS5sZW5ndGggPCA3XG4gICkge1xuICAgIHJlcy5zdGF0dXMoNDIyKS5qc29uKHtcbiAgICAgIG1lc3NhZ2U6XG4gICAgICAgICdJbnZhbGlkIGlucHV0IC0gcGFzc3dvcmQgc2hvdWxkIGFsc28gYmUgYXQgbGVhc3QgNyBjaGFyYWN0ZXJzIGxvbmcuJyxcbiAgICB9KTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBjbGllbnQgPSBhd2FpdCBjb25uZWN0VG9EYXRhYmFzZSgpO1xuXG4gIGNvbnN0IGRiID0gY2xpZW50LmRiKCk7XG5cbiAgY29uc3QgZXhpc3RpbmdVc2VyID0gYXdhaXQgZGIuY29sbGVjdGlvbigndXNlcnMnKS5maW5kT25lKHsgZW1haWw6IGVtYWlsIH0pO1xuXG4gIGlmIChleGlzdGluZ1VzZXIpIHtcbiAgICByZXMuc3RhdHVzKDQyMikuanNvbih7IG1lc3NhZ2U6ICdVc2VyIGV4aXN0cyBhbHJlYWR5IScgfSk7XG4gICAgY2xpZW50LmNsb3NlKCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgaGFzaGVkUGFzc3dvcmQgPSBhd2FpdCBoYXNoUGFzc3dvcmQocGFzc3dvcmQpO1xuXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXJzJykuaW5zZXJ0T25lKHtcbiAgICBlbWFpbDogZW1haWwsXG4gICAgcGFzc3dvcmQ6IGhhc2hlZFBhc3N3b3JkLFxuICB9KTtcblxuICByZXMuc3RhdHVzKDIwMSkuanNvbih7IG1lc3NhZ2U6ICdDcmVhdGVkIHVzZXIhJyB9KTtcbiAgY2xpZW50LmNsb3NlKCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGhhbmRsZXI7XG4iXSwibmFtZXMiOlsiaGFzaFBhc3N3b3JkIiwiY29ubmVjdFRvRGF0YWJhc2UiLCJoYW5kbGVyIiwicmVxIiwicmVzIiwibWV0aG9kIiwiZGF0YSIsImJvZHkiLCJlbWFpbCIsInBhc3N3b3JkIiwiaW5jbHVkZXMiLCJ0cmltIiwibGVuZ3RoIiwic3RhdHVzIiwianNvbiIsIm1lc3NhZ2UiLCJjbGllbnQiLCJkYiIsImV4aXN0aW5nVXNlciIsImNvbGxlY3Rpb24iLCJmaW5kT25lIiwiY2xvc2UiLCJoYXNoZWRQYXNzd29yZCIsInJlc3VsdCIsImluc2VydE9uZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./pages/api/auth/signup.js\n");

/***/ }),

/***/ "bcryptjs":
/*!***************************!*\
  !*** external "bcryptjs" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("bcryptjs");

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
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/api/auth/signup.js"));
module.exports = __webpack_exports__;

})();