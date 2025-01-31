"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/remark-parse";
exports.ids = ["vendor-chunks/remark-parse"];
exports.modules = {

/***/ "(ssr)/./node_modules/remark-parse/lib/index.js":
/*!************************************************!*\
  !*** ./node_modules/remark-parse/lib/index.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ remarkParse)\n/* harmony export */ });\n/* harmony import */ var mdast_util_from_markdown__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mdast-util-from-markdown */ \"(ssr)/./node_modules/mdast-util-from-markdown/dev/lib/index.js\");\n/**\n * @typedef {import('mdast').Root} Root\n * @typedef {import('mdast-util-from-markdown').Options} FromMarkdownOptions\n * @typedef {import('unified').Parser<Root>} Parser\n * @typedef {import('unified').Processor<Root>} Processor\n */\n\n/**\n * @typedef {Omit<FromMarkdownOptions, 'extensions' | 'mdastExtensions'>} Options\n */\n\n\n\n/**\n * Aadd support for parsing from markdown.\n *\n * @param {Readonly<Options> | null | undefined} [options]\n *   Configuration (optional).\n * @returns {undefined}\n *   Nothing.\n */\nfunction remarkParse(options) {\n  /** @type {Processor} */\n  // @ts-expect-error: TS in JSDoc generates wrong types if `this` is typed regularly.\n  const self = this\n\n  self.parser = parser\n\n  /**\n   * @type {Parser}\n   */\n  function parser(doc) {\n    return (0,mdast_util_from_markdown__WEBPACK_IMPORTED_MODULE_0__.fromMarkdown)(doc, {\n      ...self.data('settings'),\n      ...options,\n      // Note: these options are not in the readme.\n      // The goal is for them to be set by plugins on `data` instead of being\n      // passed by users.\n      extensions: self.data('micromarkExtensions') || [],\n      mdastExtensions: self.data('fromMarkdownExtensions') || []\n    })\n  }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvcmVtYXJrLXBhcnNlL2xpYi9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0EsYUFBYSxzQkFBc0I7QUFDbkMsYUFBYSw0Q0FBNEM7QUFDekQsYUFBYSxnQ0FBZ0M7QUFDN0MsYUFBYSxtQ0FBbUM7QUFDaEQ7O0FBRUE7QUFDQSxhQUFhLDZEQUE2RDtBQUMxRTs7QUFFcUQ7O0FBRXJEO0FBQ0E7QUFDQTtBQUNBLFdBQVcsc0NBQXNDO0FBQ2pEO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDZTtBQUNmLGFBQWEsV0FBVztBQUN4QjtBQUNBOztBQUVBOztBQUVBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQSxXQUFXLHNFQUFZO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9teS12MC1wcm9qZWN0Ly4vbm9kZV9tb2R1bGVzL3JlbWFyay1wYXJzZS9saWIvaW5kZXguanM/ODYwMCJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEB0eXBlZGVmIHtpbXBvcnQoJ21kYXN0JykuUm9vdH0gUm9vdFxuICogQHR5cGVkZWYge2ltcG9ydCgnbWRhc3QtdXRpbC1mcm9tLW1hcmtkb3duJykuT3B0aW9uc30gRnJvbU1hcmtkb3duT3B0aW9uc1xuICogQHR5cGVkZWYge2ltcG9ydCgndW5pZmllZCcpLlBhcnNlcjxSb290Pn0gUGFyc2VyXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCd1bmlmaWVkJykuUHJvY2Vzc29yPFJvb3Q+fSBQcm9jZXNzb3JcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPbWl0PEZyb21NYXJrZG93bk9wdGlvbnMsICdleHRlbnNpb25zJyB8ICdtZGFzdEV4dGVuc2lvbnMnPn0gT3B0aW9uc1xuICovXG5cbmltcG9ydCB7ZnJvbU1hcmtkb3dufSBmcm9tICdtZGFzdC11dGlsLWZyb20tbWFya2Rvd24nXG5cbi8qKlxuICogQWFkZCBzdXBwb3J0IGZvciBwYXJzaW5nIGZyb20gbWFya2Rvd24uXG4gKlxuICogQHBhcmFtIHtSZWFkb25seTxPcHRpb25zPiB8IG51bGwgfCB1bmRlZmluZWR9IFtvcHRpb25zXVxuICogICBDb25maWd1cmF0aW9uIChvcHRpb25hbCkuXG4gKiBAcmV0dXJucyB7dW5kZWZpbmVkfVxuICogICBOb3RoaW5nLlxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZW1hcmtQYXJzZShvcHRpb25zKSB7XG4gIC8qKiBAdHlwZSB7UHJvY2Vzc29yfSAqL1xuICAvLyBAdHMtZXhwZWN0LWVycm9yOiBUUyBpbiBKU0RvYyBnZW5lcmF0ZXMgd3JvbmcgdHlwZXMgaWYgYHRoaXNgIGlzIHR5cGVkIHJlZ3VsYXJseS5cbiAgY29uc3Qgc2VsZiA9IHRoaXNcblxuICBzZWxmLnBhcnNlciA9IHBhcnNlclxuXG4gIC8qKlxuICAgKiBAdHlwZSB7UGFyc2VyfVxuICAgKi9cbiAgZnVuY3Rpb24gcGFyc2VyKGRvYykge1xuICAgIHJldHVybiBmcm9tTWFya2Rvd24oZG9jLCB7XG4gICAgICAuLi5zZWxmLmRhdGEoJ3NldHRpbmdzJyksXG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgLy8gTm90ZTogdGhlc2Ugb3B0aW9ucyBhcmUgbm90IGluIHRoZSByZWFkbWUuXG4gICAgICAvLyBUaGUgZ29hbCBpcyBmb3IgdGhlbSB0byBiZSBzZXQgYnkgcGx1Z2lucyBvbiBgZGF0YWAgaW5zdGVhZCBvZiBiZWluZ1xuICAgICAgLy8gcGFzc2VkIGJ5IHVzZXJzLlxuICAgICAgZXh0ZW5zaW9uczogc2VsZi5kYXRhKCdtaWNyb21hcmtFeHRlbnNpb25zJykgfHwgW10sXG4gICAgICBtZGFzdEV4dGVuc2lvbnM6IHNlbGYuZGF0YSgnZnJvbU1hcmtkb3duRXh0ZW5zaW9ucycpIHx8IFtdXG4gICAgfSlcbiAgfVxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/remark-parse/lib/index.js\n");

/***/ })

};
;