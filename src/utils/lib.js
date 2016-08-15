const browserWindow = __CLIENT__ ? window : {};
const browserDocument = browserWindow.document;
export {
  browserWindow as window,
  browserDocument as document
};
