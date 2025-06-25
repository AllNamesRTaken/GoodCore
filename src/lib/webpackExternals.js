const rootPatterns = [
  {
    // rxjs/operators/map
    regex: /^goodcore\/struct\//,
    root: ["goodcore"],
  },
  {
    // rxjs/operator/map
    regex: /^goodcore\/standard\//,
    root: ["goodcore"],
  },
  {
    // rxjs/observable/interval
    regex: /^goodcore\/standard\/mixins\//,
    root: ["goodcore"],
  },
  {
    // rxjs/observable/MulticastObservable
    regex: /^goodcore\/([A-Z].*)/,
    root: ["goodcore", ""],
  },
];

function rootForRequest(path) {
  const match = rootPatterns.find(
    (pattern, index, obj) => !!path.match(pattern.regex),
  );

  if (match) {
    let m = path.match(match.regex);
    if (m.length > 1) {
      match.root[match.root.length - 1] = m[m.length - 1];
    }
    return [...match.root];
  }

  return "goodcore";
}

function libraryExternalsFactory() {
  return function libraryExternals(context, request, callback) {
    if (request.startsWith("goodcore")) {
      return callback(null, {
        root: rootForRequest(request),
        commonjs: request,
        commonjs2: request,
        amd: request,
      });
    }

    callback();
  };
}
module.exports = libraryExternalsFactory;
