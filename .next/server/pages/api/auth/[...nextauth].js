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
exports.id = "pages/api/auth/[...nextauth]";
exports.ids = ["pages/api/auth/[...nextauth]"];
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

/***/ "./pages/api/auth/[...nextauth].js":
/*!*****************************************!*\
  !*** ./pages/api/auth/[...nextauth].js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth */ \"next-auth\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_auth_providers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth/providers */ \"next-auth/providers\");\n/* harmony import */ var next_auth_providers__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth_providers__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react_hot_toast__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-hot-toast */ \"react-hot-toast\");\n/* harmony import */ var react_hot_toast__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_hot_toast__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../lib/auth */ \"./lib/auth.js\");\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../lib/db */ \"./lib/db.js\");\n\n\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (next_auth__WEBPACK_IMPORTED_MODULE_0___default()({\n  session: {\n    jwt: true\n  },\n  callbacks: {\n    session: async (session, user) => {\n      const client = await (0,_lib_db__WEBPACK_IMPORTED_MODULE_4__.connectToDatabase)();\n      const db = await client.db();\n      const foundUser = await db.collection('users').findOne({\n        email: user.email\n      });\n      session.user = {\n        _id: foundUser._id,\n        email: foundUser.email\n      };\n      return Promise.resolve(session);\n    }\n  },\n  providers: [next_auth_providers__WEBPACK_IMPORTED_MODULE_1___default().Credentials({\n    async authorize(credentials) {\n      const client = await (0,_lib_db__WEBPACK_IMPORTED_MODULE_4__.connectToDatabase)();\n      const usersCollection = client.db().collection('users');\n      const user = await usersCollection.findOne({\n        email: credentials.email\n      });\n\n      if (!user) {\n        client.close();\n        throw new Error('No user found!');\n      }\n\n      const isValid = await (0,_lib_auth__WEBPACK_IMPORTED_MODULE_3__.verifyPassword)(credentials.password, user.password);\n\n      if (!isValid) {\n        client.close();\n        throw new Error('Could not log you in!');\n      }\n\n      client.close();\n      return {\n        email: user.email,\n        id: user._id\n      };\n    }\n\n  })]\n}));//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdLmpzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQSxpRUFBZUEsZ0RBQVEsQ0FBQztBQUN0QkssRUFBQUEsT0FBTyxFQUFFO0FBQ1BDLElBQUFBLEdBQUcsRUFBRTtBQURFLEdBRGE7QUFJdEJDLEVBQUFBLFNBQVMsRUFBRTtBQUNURixJQUFBQSxPQUFPLEVBQUUsT0FBT0EsT0FBUCxFQUFnQkcsSUFBaEIsS0FBeUI7QUFDaEMsWUFBTUMsTUFBTSxHQUFHLE1BQU1MLDBEQUFpQixFQUF0QztBQUNBLFlBQU1NLEVBQUUsR0FBRyxNQUFNRCxNQUFNLENBQUNDLEVBQVAsRUFBakI7QUFDQSxZQUFNQyxTQUFTLEdBQUcsTUFBTUQsRUFBRSxDQUFDRSxVQUFILENBQWMsT0FBZCxFQUF1QkMsT0FBdkIsQ0FBK0I7QUFBRUMsUUFBQUEsS0FBSyxFQUFFTixJQUFJLENBQUNNO0FBQWQsT0FBL0IsQ0FBeEI7QUFDQVQsTUFBQUEsT0FBTyxDQUFDRyxJQUFSLEdBQWU7QUFBRU8sUUFBQUEsR0FBRyxFQUFFSixTQUFTLENBQUNJLEdBQWpCO0FBQXNCRCxRQUFBQSxLQUFLLEVBQUVILFNBQVMsQ0FBQ0c7QUFBdkMsT0FBZjtBQUNBLGFBQU9FLE9BQU8sQ0FBQ0MsT0FBUixDQUFnQlosT0FBaEIsQ0FBUDtBQUNEO0FBUFEsR0FKVztBQWF0QmEsRUFBQUEsU0FBUyxFQUFFLENBQ1RqQixzRUFBQSxDQUFzQjtBQUNwQixVQUFNbUIsU0FBTixDQUFnQkMsV0FBaEIsRUFBNkI7QUFDM0IsWUFBTVosTUFBTSxHQUFHLE1BQU1MLDBEQUFpQixFQUF0QztBQUNBLFlBQU1rQixlQUFlLEdBQUdiLE1BQU0sQ0FBQ0MsRUFBUCxHQUFZRSxVQUFaLENBQXVCLE9BQXZCLENBQXhCO0FBQ0EsWUFBTUosSUFBSSxHQUFHLE1BQU1jLGVBQWUsQ0FBQ1QsT0FBaEIsQ0FBd0I7QUFDekNDLFFBQUFBLEtBQUssRUFBRU8sV0FBVyxDQUFDUDtBQURzQixPQUF4QixDQUFuQjs7QUFHQSxVQUFJLENBQUNOLElBQUwsRUFBVztBQUNUQyxRQUFBQSxNQUFNLENBQUNjLEtBQVA7QUFDQSxjQUFNLElBQUlDLEtBQUosQ0FBVSxnQkFBVixDQUFOO0FBQ0Q7O0FBRUQsWUFBTUMsT0FBTyxHQUFHLE1BQU10Qix5REFBYyxDQUFDa0IsV0FBVyxDQUFDSyxRQUFiLEVBQXVCbEIsSUFBSSxDQUFDa0IsUUFBNUIsQ0FBcEM7O0FBQ0EsVUFBSSxDQUFDRCxPQUFMLEVBQWM7QUFDWmhCLFFBQUFBLE1BQU0sQ0FBQ2MsS0FBUDtBQUNBLGNBQU0sSUFBSUMsS0FBSixDQUFVLHVCQUFWLENBQU47QUFDRDs7QUFFRGYsTUFBQUEsTUFBTSxDQUFDYyxLQUFQO0FBQ0EsYUFBTztBQUFFVCxRQUFBQSxLQUFLLEVBQUVOLElBQUksQ0FBQ00sS0FBZDtBQUFxQmEsUUFBQUEsRUFBRSxFQUFFbkIsSUFBSSxDQUFDTztBQUE5QixPQUFQO0FBQ0Q7O0FBcEJtQixHQUF0QixDQURTO0FBYlcsQ0FBRCxDQUF2QiIsInNvdXJjZXMiOlsid2VicGFjazovL25leHQtYXV0aC1jcmVkZW50aWFscy8uL3BhZ2VzL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0uanM/OTkwOSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTmV4dEF1dGggZnJvbSAnbmV4dC1hdXRoJ1xuaW1wb3J0IFByb3ZpZGVycyBmcm9tICduZXh0LWF1dGgvcHJvdmlkZXJzJ1xuaW1wb3J0IHRvYXN0IGZyb20gJ3JlYWN0LWhvdC10b2FzdCdcblxuaW1wb3J0IHsgdmVyaWZ5UGFzc3dvcmQgfSBmcm9tICcuLi8uLi8uLi9saWIvYXV0aCdcbmltcG9ydCB7IGNvbm5lY3RUb0RhdGFiYXNlIH0gZnJvbSAnLi4vLi4vLi4vbGliL2RiJ1xuXG5leHBvcnQgZGVmYXVsdCBOZXh0QXV0aCh7XG4gIHNlc3Npb246IHtcbiAgICBqd3Q6IHRydWUsXG4gIH0sXG4gIGNhbGxiYWNrczoge1xuICAgIHNlc3Npb246IGFzeW5jIChzZXNzaW9uLCB1c2VyKSA9PiB7XG4gICAgICBjb25zdCBjbGllbnQgPSBhd2FpdCBjb25uZWN0VG9EYXRhYmFzZSgpXG4gICAgICBjb25zdCBkYiA9IGF3YWl0IGNsaWVudC5kYigpXG4gICAgICBjb25zdCBmb3VuZFVzZXIgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VycycpLmZpbmRPbmUoeyBlbWFpbDogdXNlci5lbWFpbCB9KVxuICAgICAgc2Vzc2lvbi51c2VyID0geyBfaWQ6IGZvdW5kVXNlci5faWQsIGVtYWlsOiBmb3VuZFVzZXIuZW1haWwgfVxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShzZXNzaW9uKVxuICAgIH0sXG4gIH0sXG4gIHByb3ZpZGVyczogW1xuICAgIFByb3ZpZGVycy5DcmVkZW50aWFscyh7XG4gICAgICBhc3luYyBhdXRob3JpemUoY3JlZGVudGlhbHMpIHtcbiAgICAgICAgY29uc3QgY2xpZW50ID0gYXdhaXQgY29ubmVjdFRvRGF0YWJhc2UoKVxuICAgICAgICBjb25zdCB1c2Vyc0NvbGxlY3Rpb24gPSBjbGllbnQuZGIoKS5jb2xsZWN0aW9uKCd1c2VycycpXG4gICAgICAgIGNvbnN0IHVzZXIgPSBhd2FpdCB1c2Vyc0NvbGxlY3Rpb24uZmluZE9uZSh7XG4gICAgICAgICAgZW1haWw6IGNyZWRlbnRpYWxzLmVtYWlsLFxuICAgICAgICB9KVxuICAgICAgICBpZiAoIXVzZXIpIHtcbiAgICAgICAgICBjbGllbnQuY2xvc2UoKVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gdXNlciBmb3VuZCEnKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaXNWYWxpZCA9IGF3YWl0IHZlcmlmeVBhc3N3b3JkKGNyZWRlbnRpYWxzLnBhc3N3b3JkLCB1c2VyLnBhc3N3b3JkKVxuICAgICAgICBpZiAoIWlzVmFsaWQpIHtcbiAgICAgICAgICBjbGllbnQuY2xvc2UoKVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IGxvZyB5b3UgaW4hJylcbiAgICAgICAgfVxuXG4gICAgICAgIGNsaWVudC5jbG9zZSgpXG4gICAgICAgIHJldHVybiB7IGVtYWlsOiB1c2VyLmVtYWlsLCBpZDogdXNlci5faWQgfVxuICAgICAgfSxcbiAgICB9KSxcbiAgXSxcbn0pXG4iXSwibmFtZXMiOlsiTmV4dEF1dGgiLCJQcm92aWRlcnMiLCJ0b2FzdCIsInZlcmlmeVBhc3N3b3JkIiwiY29ubmVjdFRvRGF0YWJhc2UiLCJzZXNzaW9uIiwiand0IiwiY2FsbGJhY2tzIiwidXNlciIsImNsaWVudCIsImRiIiwiZm91bmRVc2VyIiwiY29sbGVjdGlvbiIsImZpbmRPbmUiLCJlbWFpbCIsIl9pZCIsIlByb21pc2UiLCJyZXNvbHZlIiwicHJvdmlkZXJzIiwiQ3JlZGVudGlhbHMiLCJhdXRob3JpemUiLCJjcmVkZW50aWFscyIsInVzZXJzQ29sbGVjdGlvbiIsImNsb3NlIiwiRXJyb3IiLCJpc1ZhbGlkIiwicGFzc3dvcmQiLCJpZCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./pages/api/auth/[...nextauth].js\n");

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

/***/ }),

/***/ "next-auth":
/*!****************************!*\
  !*** external "next-auth" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("next-auth");

/***/ }),

/***/ "next-auth/providers":
/*!**************************************!*\
  !*** external "next-auth/providers" ***!
  \**************************************/
/***/ ((module) => {

module.exports = require("next-auth/providers");

/***/ }),

/***/ "react-hot-toast":
/*!**********************************!*\
  !*** external "react-hot-toast" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("react-hot-toast");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/api/auth/[...nextauth].js"));
module.exports = __webpack_exports__;

})();