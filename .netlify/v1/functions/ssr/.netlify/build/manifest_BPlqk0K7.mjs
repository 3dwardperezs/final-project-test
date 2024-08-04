import './chunks/astro/server_b09etzCd.mjs';

/**
 * Tokenize input string.
 */
function lexer(str) {
    var tokens = [];
    var i = 0;
    while (i < str.length) {
        var char = str[i];
        if (char === "*" || char === "+" || char === "?") {
            tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
            continue;
        }
        if (char === "\\") {
            tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
            continue;
        }
        if (char === "{") {
            tokens.push({ type: "OPEN", index: i, value: str[i++] });
            continue;
        }
        if (char === "}") {
            tokens.push({ type: "CLOSE", index: i, value: str[i++] });
            continue;
        }
        if (char === ":") {
            var name = "";
            var j = i + 1;
            while (j < str.length) {
                var code = str.charCodeAt(j);
                if (
                // `0-9`
                (code >= 48 && code <= 57) ||
                    // `A-Z`
                    (code >= 65 && code <= 90) ||
                    // `a-z`
                    (code >= 97 && code <= 122) ||
                    // `_`
                    code === 95) {
                    name += str[j++];
                    continue;
                }
                break;
            }
            if (!name)
                throw new TypeError("Missing parameter name at ".concat(i));
            tokens.push({ type: "NAME", index: i, value: name });
            i = j;
            continue;
        }
        if (char === "(") {
            var count = 1;
            var pattern = "";
            var j = i + 1;
            if (str[j] === "?") {
                throw new TypeError("Pattern cannot start with \"?\" at ".concat(j));
            }
            while (j < str.length) {
                if (str[j] === "\\") {
                    pattern += str[j++] + str[j++];
                    continue;
                }
                if (str[j] === ")") {
                    count--;
                    if (count === 0) {
                        j++;
                        break;
                    }
                }
                else if (str[j] === "(") {
                    count++;
                    if (str[j + 1] !== "?") {
                        throw new TypeError("Capturing groups are not allowed at ".concat(j));
                    }
                }
                pattern += str[j++];
            }
            if (count)
                throw new TypeError("Unbalanced pattern at ".concat(i));
            if (!pattern)
                throw new TypeError("Missing pattern at ".concat(i));
            tokens.push({ type: "PATTERN", index: i, value: pattern });
            i = j;
            continue;
        }
        tokens.push({ type: "CHAR", index: i, value: str[i++] });
    }
    tokens.push({ type: "END", index: i, value: "" });
    return tokens;
}
/**
 * Parse a string for the raw tokens.
 */
function parse(str, options) {
    if (options === void 0) { options = {}; }
    var tokens = lexer(str);
    var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a;
    var defaultPattern = "[^".concat(escapeString(options.delimiter || "/#?"), "]+?");
    var result = [];
    var key = 0;
    var i = 0;
    var path = "";
    var tryConsume = function (type) {
        if (i < tokens.length && tokens[i].type === type)
            return tokens[i++].value;
    };
    var mustConsume = function (type) {
        var value = tryConsume(type);
        if (value !== undefined)
            return value;
        var _a = tokens[i], nextType = _a.type, index = _a.index;
        throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
    };
    var consumeText = function () {
        var result = "";
        var value;
        while ((value = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR"))) {
            result += value;
        }
        return result;
    };
    while (i < tokens.length) {
        var char = tryConsume("CHAR");
        var name = tryConsume("NAME");
        var pattern = tryConsume("PATTERN");
        if (name || pattern) {
            var prefix = char || "";
            if (prefixes.indexOf(prefix) === -1) {
                path += prefix;
                prefix = "";
            }
            if (path) {
                result.push(path);
                path = "";
            }
            result.push({
                name: name || key++,
                prefix: prefix,
                suffix: "",
                pattern: pattern || defaultPattern,
                modifier: tryConsume("MODIFIER") || "",
            });
            continue;
        }
        var value = char || tryConsume("ESCAPED_CHAR");
        if (value) {
            path += value;
            continue;
        }
        if (path) {
            result.push(path);
            path = "";
        }
        var open = tryConsume("OPEN");
        if (open) {
            var prefix = consumeText();
            var name_1 = tryConsume("NAME") || "";
            var pattern_1 = tryConsume("PATTERN") || "";
            var suffix = consumeText();
            mustConsume("CLOSE");
            result.push({
                name: name_1 || (pattern_1 ? key++ : ""),
                pattern: name_1 && !pattern_1 ? defaultPattern : pattern_1,
                prefix: prefix,
                suffix: suffix,
                modifier: tryConsume("MODIFIER") || "",
            });
            continue;
        }
        mustConsume("END");
    }
    return result;
}
/**
 * Compile a string to a template function for the path.
 */
function compile(str, options) {
    return tokensToFunction(parse(str, options), options);
}
/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction(tokens, options) {
    if (options === void 0) { options = {}; }
    var reFlags = flags(options);
    var _a = options.encode, encode = _a === void 0 ? function (x) { return x; } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
    // Compile all the tokens into regexps.
    var matches = tokens.map(function (token) {
        if (typeof token === "object") {
            return new RegExp("^(?:".concat(token.pattern, ")$"), reFlags);
        }
    });
    return function (data) {
        var path = "";
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            if (typeof token === "string") {
                path += token;
                continue;
            }
            var value = data ? data[token.name] : undefined;
            var optional = token.modifier === "?" || token.modifier === "*";
            var repeat = token.modifier === "*" || token.modifier === "+";
            if (Array.isArray(value)) {
                if (!repeat) {
                    throw new TypeError("Expected \"".concat(token.name, "\" to not repeat, but got an array"));
                }
                if (value.length === 0) {
                    if (optional)
                        continue;
                    throw new TypeError("Expected \"".concat(token.name, "\" to not be empty"));
                }
                for (var j = 0; j < value.length; j++) {
                    var segment = encode(value[j], token);
                    if (validate && !matches[i].test(segment)) {
                        throw new TypeError("Expected all \"".concat(token.name, "\" to match \"").concat(token.pattern, "\", but got \"").concat(segment, "\""));
                    }
                    path += token.prefix + segment + token.suffix;
                }
                continue;
            }
            if (typeof value === "string" || typeof value === "number") {
                var segment = encode(String(value), token);
                if (validate && !matches[i].test(segment)) {
                    throw new TypeError("Expected \"".concat(token.name, "\" to match \"").concat(token.pattern, "\", but got \"").concat(segment, "\""));
                }
                path += token.prefix + segment + token.suffix;
                continue;
            }
            if (optional)
                continue;
            var typeOfMessage = repeat ? "an array" : "a string";
            throw new TypeError("Expected \"".concat(token.name, "\" to be ").concat(typeOfMessage));
        }
        return path;
    };
}
/**
 * Escape a regular expression string.
 */
function escapeString(str) {
    return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
/**
 * Get the flags for a regexp from the options.
 */
function flags(options) {
    return options && options.sensitive ? "" : "i";
}

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    const path = toPath(sanitizedParams);
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware(_, next) {
      return next();
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/ED/Documents/final-project-test/","adapterName":"@astrojs/netlify","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/.pnpm/astro@4.13.1_typescript@5.5.4/node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/final-project-test/_astro/hoisted.BXkF3-Oh.js"}],"styles":[{"type":"external","src":"/final-project-test/_astro/ContactPage.D-6kZGJl.css"},{"type":"inline","content":".buttonHeader{display:flex;flex-direction:row;justify-content:center;color:#fff;cursor:pointer;background-color:transparent;border:none;outline:none;font-weight:500;border-radius:.375rem;padding:.625rem 1.25rem;text-align:center;align-items:center;transition:all .2s ease-in-out;opacity:.7;margin-right:.5rem;margin-bottom:.5rem;gap:.5rem}.buttonHeader:hover{background-color:#374151;box-shadow:0 4px 6px #0000001a;transform:scale(1.1);opacity:1}.buttonHeader.scale-90{transform:scale(.9)}.buttonHeader.text-white{color:#fff}@media (max-width: 768px){.buttonHeader{display:flex;width:100%}}html{font-family:system-ui,sans-serif;background:#13151a;background-size:224px;color-scheme:dark light}.toast{visibility:hidden;max-width:50%;margin:0 auto;background-color:#126f12;color:#fff;text-align:center;border-radius:.25rem;padding:1rem;position:fixed;z-index:1;left:50%;bottom:2rem;transform:translate(-50%)}.toast.show{visibility:visible;animation:fadein .5s,fadeout .5s 2.5s}@keyframes fadein{0%{bottom:0;opacity:0}to{bottom:2rem;opacity:1}}@keyframes fadeout{0%{bottom:2rem;opacity:1}to{bottom:0;opacity:0}}.icon-container{position:fixed;bottom:1rem;right:1rem;z-index:1000}.icon{font-size:2rem;transition:transform .3s ease,color .3s ease}.icon:hover{transform:scale(1.2);color:#ff6f61}#map{height:100%;width:100%}.map-container{position:relative;width:100%;height:500px}.control-buttons{position:absolute;bottom:10px;right:10px;display:flex;z-index:1000}.control-buttons input,.control-buttons button{padding:8px 12px;margin-bottom:7px;margin-left:5px;border-radius:4px;border:none;outline:none}.control-buttons input{border-radius:4px 0 0 4px}.control-buttons button{border-radius:0 4px 4px 0;background-color:#fff;color:#000;cursor:pointer}.control-buttons button:hover{background-color:#f0f0f0}.clear-markers-button{position:absolute;top:10px;right:10px;background-color:#1d4ed8;color:#fff;padding:8px 12px;border-radius:4px;border:none;cursor:pointer;z-index:1000}.clear-markers-button:hover{background-color:#2563eb}.description{margin-bottom:10px;font-size:16px;color:#fff}\n"}],"routeData":{"route":"/404","isIndex":false,"type":"page","pattern":"^\\/404\\/?$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/404.astro","pathname":"/404","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/final-project-test/_astro/hoisted.4ecotApa.js"}],"styles":[{"type":"external","src":"/final-project-test/_astro/ContactPage.D-6kZGJl.css"},{"type":"inline","content":".buttonHeader{display:flex;flex-direction:row;justify-content:center;color:#fff;cursor:pointer;background-color:transparent;border:none;outline:none;font-weight:500;border-radius:.375rem;padding:.625rem 1.25rem;text-align:center;align-items:center;transition:all .2s ease-in-out;opacity:.7;margin-right:.5rem;margin-bottom:.5rem;gap:.5rem}.buttonHeader:hover{background-color:#374151;box-shadow:0 4px 6px #0000001a;transform:scale(1.1);opacity:1}.buttonHeader.scale-90{transform:scale(.9)}.buttonHeader.text-white{color:#fff}@media (max-width: 768px){.buttonHeader{display:flex;width:100%}}html{font-family:system-ui,sans-serif;background:#13151a;background-size:224px;color-scheme:dark light}.toast{visibility:hidden;max-width:50%;margin:0 auto;background-color:#126f12;color:#fff;text-align:center;border-radius:.25rem;padding:1rem;position:fixed;z-index:1;left:50%;bottom:2rem;transform:translate(-50%)}.toast.show{visibility:visible;animation:fadein .5s,fadeout .5s 2.5s}@keyframes fadein{0%{bottom:0;opacity:0}to{bottom:2rem;opacity:1}}@keyframes fadeout{0%{bottom:2rem;opacity:1}to{bottom:0;opacity:0}}.icon-container{position:fixed;bottom:1rem;right:1rem;z-index:1000}.icon{font-size:2rem;transition:transform .3s ease,color .3s ease}.icon:hover{transform:scale(1.2);color:#ff6f61}#map{height:100%;width:100%}.map-container{position:relative;width:100%;height:500px}.control-buttons{position:absolute;bottom:10px;right:10px;display:flex;z-index:1000}.control-buttons input,.control-buttons button{padding:8px 12px;margin-bottom:7px;margin-left:5px;border-radius:4px;border:none;outline:none}.control-buttons input{border-radius:4px 0 0 4px}.control-buttons button{border-radius:0 4px 4px 0;background-color:#fff;color:#000;cursor:pointer}.control-buttons button:hover{background-color:#f0f0f0}.clear-markers-button{position:absolute;top:10px;right:10px;background-color:#1d4ed8;color:#fff;padding:8px 12px;border-radius:4px;border:none;cursor:pointer;z-index:1000}.clear-markers-button:hover{background-color:#2563eb}.description{margin-bottom:10px;font-size:16px;color:#fff}\n"}],"routeData":{"route":"/contactpage","isIndex":false,"type":"page","pattern":"^\\/ContactPage\\/?$","segments":[[{"content":"ContactPage","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/ContactPage.astro","pathname":"/ContactPage","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/final-project-test/_astro/hoisted.BXkF3-Oh.js"}],"styles":[{"type":"external","src":"/final-project-test/_astro/ContactPage.D-6kZGJl.css"},{"type":"inline","content":".buttonHeader{display:flex;flex-direction:row;justify-content:center;color:#fff;cursor:pointer;background-color:transparent;border:none;outline:none;font-weight:500;border-radius:.375rem;padding:.625rem 1.25rem;text-align:center;align-items:center;transition:all .2s ease-in-out;opacity:.7;margin-right:.5rem;margin-bottom:.5rem;gap:.5rem}.buttonHeader:hover{background-color:#374151;box-shadow:0 4px 6px #0000001a;transform:scale(1.1);opacity:1}.buttonHeader.scale-90{transform:scale(.9)}.buttonHeader.text-white{color:#fff}@media (max-width: 768px){.buttonHeader{display:flex;width:100%}}html{font-family:system-ui,sans-serif;background:#13151a;background-size:224px;color-scheme:dark light}.toast{visibility:hidden;max-width:50%;margin:0 auto;background-color:#126f12;color:#fff;text-align:center;border-radius:.25rem;padding:1rem;position:fixed;z-index:1;left:50%;bottom:2rem;transform:translate(-50%)}.toast.show{visibility:visible;animation:fadein .5s,fadeout .5s 2.5s}@keyframes fadein{0%{bottom:0;opacity:0}to{bottom:2rem;opacity:1}}@keyframes fadeout{0%{bottom:2rem;opacity:1}to{bottom:0;opacity:0}}.icon-container{position:fixed;bottom:1rem;right:1rem;z-index:1000}.icon{font-size:2rem;transition:transform .3s ease,color .3s ease}.icon:hover{transform:scale(1.2);color:#ff6f61}#map{height:100%;width:100%}.map-container{position:relative;width:100%;height:500px}.control-buttons{position:absolute;bottom:10px;right:10px;display:flex;z-index:1000}.control-buttons input,.control-buttons button{padding:8px 12px;margin-bottom:7px;margin-left:5px;border-radius:4px;border:none;outline:none}.control-buttons input{border-radius:4px 0 0 4px}.control-buttons button{border-radius:0 4px 4px 0;background-color:#fff;color:#000;cursor:pointer}.control-buttons button:hover{background-color:#f0f0f0}.clear-markers-button{position:absolute;top:10px;right:10px;background-color:#1d4ed8;color:#fff;padding:8px 12px;border-radius:4px;border:none;cursor:pointer;z-index:1000}.clear-markers-button:hover{background-color:#2563eb}.description{margin-bottom:10px;font-size:16px;color:#fff}\n"}],"routeData":{"route":"/detail/[id]","isIndex":false,"type":"page","pattern":"^\\/detail\\/([^/]+?)\\/?$","segments":[[{"content":"detail","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/detail/[id].astro","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/final-project-test/_astro/hoisted.BXkF3-Oh.js"}],"styles":[{"type":"external","src":"/final-project-test/_astro/ContactPage.D-6kZGJl.css"},{"type":"inline","content":".buttonHeader{display:flex;flex-direction:row;justify-content:center;color:#fff;cursor:pointer;background-color:transparent;border:none;outline:none;font-weight:500;border-radius:.375rem;padding:.625rem 1.25rem;text-align:center;align-items:center;transition:all .2s ease-in-out;opacity:.7;margin-right:.5rem;margin-bottom:.5rem;gap:.5rem}.buttonHeader:hover{background-color:#374151;box-shadow:0 4px 6px #0000001a;transform:scale(1.1);opacity:1}.buttonHeader.scale-90{transform:scale(.9)}.buttonHeader.text-white{color:#fff}@media (max-width: 768px){.buttonHeader{display:flex;width:100%}}html{font-family:system-ui,sans-serif;background:#13151a;background-size:224px;color-scheme:dark light}.toast{visibility:hidden;max-width:50%;margin:0 auto;background-color:#126f12;color:#fff;text-align:center;border-radius:.25rem;padding:1rem;position:fixed;z-index:1;left:50%;bottom:2rem;transform:translate(-50%)}.toast.show{visibility:visible;animation:fadein .5s,fadeout .5s 2.5s}@keyframes fadein{0%{bottom:0;opacity:0}to{bottom:2rem;opacity:1}}@keyframes fadeout{0%{bottom:2rem;opacity:1}to{bottom:0;opacity:0}}.icon-container{position:fixed;bottom:1rem;right:1rem;z-index:1000}.icon{font-size:2rem;transition:transform .3s ease,color .3s ease}.icon:hover{transform:scale(1.2);color:#ff6f61}#map{height:100%;width:100%}.map-container{position:relative;width:100%;height:500px}.control-buttons{position:absolute;bottom:10px;right:10px;display:flex;z-index:1000}.control-buttons input,.control-buttons button{padding:8px 12px;margin-bottom:7px;margin-left:5px;border-radius:4px;border:none;outline:none}.control-buttons input{border-radius:4px 0 0 4px}.control-buttons button{border-radius:0 4px 4px 0;background-color:#fff;color:#000;cursor:pointer}.control-buttons button:hover{background-color:#f0f0f0}.clear-markers-button{position:absolute;top:10px;right:10px;background-color:#1d4ed8;color:#fff;padding:8px 12px;border-radius:4px;border:none;cursor:pointer;z-index:1000}.clear-markers-button:hover{background-color:#2563eb}.description{margin-bottom:10px;font-size:16px;color:#fff}\n"}],"routeData":{"route":"/githubreposearchpage","isIndex":false,"type":"page","pattern":"^\\/GithubRepoSearchPage\\/?$","segments":[[{"content":"GithubRepoSearchPage","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/GithubRepoSearchPage.astro","pathname":"/GithubRepoSearchPage","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/final-project-test/_astro/hoisted.BXkF3-Oh.js"}],"styles":[{"type":"external","src":"/final-project-test/_astro/ContactPage.D-6kZGJl.css"},{"type":"inline","content":".buttonHeader{display:flex;flex-direction:row;justify-content:center;color:#fff;cursor:pointer;background-color:transparent;border:none;outline:none;font-weight:500;border-radius:.375rem;padding:.625rem 1.25rem;text-align:center;align-items:center;transition:all .2s ease-in-out;opacity:.7;margin-right:.5rem;margin-bottom:.5rem;gap:.5rem}.buttonHeader:hover{background-color:#374151;box-shadow:0 4px 6px #0000001a;transform:scale(1.1);opacity:1}.buttonHeader.scale-90{transform:scale(.9)}.buttonHeader.text-white{color:#fff}@media (max-width: 768px){.buttonHeader{display:flex;width:100%}}html{font-family:system-ui,sans-serif;background:#13151a;background-size:224px;color-scheme:dark light}.toast{visibility:hidden;max-width:50%;margin:0 auto;background-color:#126f12;color:#fff;text-align:center;border-radius:.25rem;padding:1rem;position:fixed;z-index:1;left:50%;bottom:2rem;transform:translate(-50%)}.toast.show{visibility:visible;animation:fadein .5s,fadeout .5s 2.5s}@keyframes fadein{0%{bottom:0;opacity:0}to{bottom:2rem;opacity:1}}@keyframes fadeout{0%{bottom:2rem;opacity:1}to{bottom:0;opacity:0}}.icon-container{position:fixed;bottom:1rem;right:1rem;z-index:1000}.icon{font-size:2rem;transition:transform .3s ease,color .3s ease}.icon:hover{transform:scale(1.2);color:#ff6f61}#map{height:100%;width:100%}.map-container{position:relative;width:100%;height:500px}.control-buttons{position:absolute;bottom:10px;right:10px;display:flex;z-index:1000}.control-buttons input,.control-buttons button{padding:8px 12px;margin-bottom:7px;margin-left:5px;border-radius:4px;border:none;outline:none}.control-buttons input{border-radius:4px 0 0 4px}.control-buttons button{border-radius:0 4px 4px 0;background-color:#fff;color:#000;cursor:pointer}.control-buttons button:hover{background-color:#f0f0f0}.clear-markers-button{position:absolute;top:10px;right:10px;background-color:#1d4ed8;color:#fff;padding:8px 12px;border-radius:4px;border:none;cursor:pointer;z-index:1000}.clear-markers-button:hover{background-color:#2563eb}.description{margin-bottom:10px;font-size:16px;color:#fff}\n"}],"routeData":{"route":"/interactivemappage","isIndex":false,"type":"page","pattern":"^\\/InteractiveMapPage\\/?$","segments":[[{"content":"InteractiveMapPage","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/InteractiveMapPage.astro","pathname":"/InteractiveMapPage","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/final-project-test/_astro/hoisted.BXkF3-Oh.js"}],"styles":[{"type":"external","src":"/final-project-test/_astro/ContactPage.D-6kZGJl.css"},{"type":"inline","content":".buttonHeader{display:flex;flex-direction:row;justify-content:center;color:#fff;cursor:pointer;background-color:transparent;border:none;outline:none;font-weight:500;border-radius:.375rem;padding:.625rem 1.25rem;text-align:center;align-items:center;transition:all .2s ease-in-out;opacity:.7;margin-right:.5rem;margin-bottom:.5rem;gap:.5rem}.buttonHeader:hover{background-color:#374151;box-shadow:0 4px 6px #0000001a;transform:scale(1.1);opacity:1}.buttonHeader.scale-90{transform:scale(.9)}.buttonHeader.text-white{color:#fff}@media (max-width: 768px){.buttonHeader{display:flex;width:100%}}html{font-family:system-ui,sans-serif;background:#13151a;background-size:224px;color-scheme:dark light}.toast{visibility:hidden;max-width:50%;margin:0 auto;background-color:#126f12;color:#fff;text-align:center;border-radius:.25rem;padding:1rem;position:fixed;z-index:1;left:50%;bottom:2rem;transform:translate(-50%)}.toast.show{visibility:visible;animation:fadein .5s,fadeout .5s 2.5s}@keyframes fadein{0%{bottom:0;opacity:0}to{bottom:2rem;opacity:1}}@keyframes fadeout{0%{bottom:2rem;opacity:1}to{bottom:0;opacity:0}}.icon-container{position:fixed;bottom:1rem;right:1rem;z-index:1000}.icon{font-size:2rem;transition:transform .3s ease,color .3s ease}.icon:hover{transform:scale(1.2);color:#ff6f61}#map{height:100%;width:100%}.map-container{position:relative;width:100%;height:500px}.control-buttons{position:absolute;bottom:10px;right:10px;display:flex;z-index:1000}.control-buttons input,.control-buttons button{padding:8px 12px;margin-bottom:7px;margin-left:5px;border-radius:4px;border:none;outline:none}.control-buttons input{border-radius:4px 0 0 4px}.control-buttons button{border-radius:0 4px 4px 0;background-color:#fff;color:#000;cursor:pointer}.control-buttons button:hover{background-color:#f0f0f0}.clear-markers-button{position:absolute;top:10px;right:10px;background-color:#1d4ed8;color:#fff;padding:8px 12px;border-radius:4px;border:none;cursor:pointer;z-index:1000}.clear-markers-button:hover{background-color:#2563eb}.description{margin-bottom:10px;font-size:16px;color:#fff}\n"}],"routeData":{"route":"/moviepage","isIndex":false,"type":"page","pattern":"^\\/MoviePage\\/?$","segments":[[{"content":"MoviePage","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/MoviePage.astro","pathname":"/MoviePage","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/final-project-test/_astro/hoisted.BXkF3-Oh.js"}],"styles":[{"type":"external","src":"/final-project-test/_astro/ContactPage.D-6kZGJl.css"},{"type":"inline","content":".buttonHeader{display:flex;flex-direction:row;justify-content:center;color:#fff;cursor:pointer;background-color:transparent;border:none;outline:none;font-weight:500;border-radius:.375rem;padding:.625rem 1.25rem;text-align:center;align-items:center;transition:all .2s ease-in-out;opacity:.7;margin-right:.5rem;margin-bottom:.5rem;gap:.5rem}.buttonHeader:hover{background-color:#374151;box-shadow:0 4px 6px #0000001a;transform:scale(1.1);opacity:1}.buttonHeader.scale-90{transform:scale(.9)}.buttonHeader.text-white{color:#fff}@media (max-width: 768px){.buttonHeader{display:flex;width:100%}}html{font-family:system-ui,sans-serif;background:#13151a;background-size:224px;color-scheme:dark light}.toast{visibility:hidden;max-width:50%;margin:0 auto;background-color:#126f12;color:#fff;text-align:center;border-radius:.25rem;padding:1rem;position:fixed;z-index:1;left:50%;bottom:2rem;transform:translate(-50%)}.toast.show{visibility:visible;animation:fadein .5s,fadeout .5s 2.5s}@keyframes fadein{0%{bottom:0;opacity:0}to{bottom:2rem;opacity:1}}@keyframes fadeout{0%{bottom:2rem;opacity:1}to{bottom:0;opacity:0}}.icon-container{position:fixed;bottom:1rem;right:1rem;z-index:1000}.icon{font-size:2rem;transition:transform .3s ease,color .3s ease}.icon:hover{transform:scale(1.2);color:#ff6f61}#map{height:100%;width:100%}.map-container{position:relative;width:100%;height:500px}.control-buttons{position:absolute;bottom:10px;right:10px;display:flex;z-index:1000}.control-buttons input,.control-buttons button{padding:8px 12px;margin-bottom:7px;margin-left:5px;border-radius:4px;border:none;outline:none}.control-buttons input{border-radius:4px 0 0 4px}.control-buttons button{border-radius:0 4px 4px 0;background-color:#fff;color:#000;cursor:pointer}.control-buttons button:hover{background-color:#f0f0f0}.clear-markers-button{position:absolute;top:10px;right:10px;background-color:#1d4ed8;color:#fff;padding:8px 12px;border-radius:4px;border:none;cursor:pointer;z-index:1000}.clear-markers-button:hover{background-color:#2563eb}.description{margin-bottom:10px;font-size:16px;color:#fff}\n"}],"routeData":{"route":"/privacypolicypage","isIndex":false,"type":"page","pattern":"^\\/PrivacyPolicyPage\\/?$","segments":[[{"content":"PrivacyPolicyPage","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/PrivacyPolicyPage.astro","pathname":"/PrivacyPolicyPage","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/final-project-test/_astro/hoisted.BXkF3-Oh.js"}],"styles":[{"type":"external","src":"/final-project-test/_astro/ContactPage.D-6kZGJl.css"},{"type":"inline","content":".buttonHeader{display:flex;flex-direction:row;justify-content:center;color:#fff;cursor:pointer;background-color:transparent;border:none;outline:none;font-weight:500;border-radius:.375rem;padding:.625rem 1.25rem;text-align:center;align-items:center;transition:all .2s ease-in-out;opacity:.7;margin-right:.5rem;margin-bottom:.5rem;gap:.5rem}.buttonHeader:hover{background-color:#374151;box-shadow:0 4px 6px #0000001a;transform:scale(1.1);opacity:1}.buttonHeader.scale-90{transform:scale(.9)}.buttonHeader.text-white{color:#fff}@media (max-width: 768px){.buttonHeader{display:flex;width:100%}}html{font-family:system-ui,sans-serif;background:#13151a;background-size:224px;color-scheme:dark light}.toast{visibility:hidden;max-width:50%;margin:0 auto;background-color:#126f12;color:#fff;text-align:center;border-radius:.25rem;padding:1rem;position:fixed;z-index:1;left:50%;bottom:2rem;transform:translate(-50%)}.toast.show{visibility:visible;animation:fadein .5s,fadeout .5s 2.5s}@keyframes fadein{0%{bottom:0;opacity:0}to{bottom:2rem;opacity:1}}@keyframes fadeout{0%{bottom:2rem;opacity:1}to{bottom:0;opacity:0}}.icon-container{position:fixed;bottom:1rem;right:1rem;z-index:1000}.icon{font-size:2rem;transition:transform .3s ease,color .3s ease}.icon:hover{transform:scale(1.2);color:#ff6f61}#map{height:100%;width:100%}.map-container{position:relative;width:100%;height:500px}.control-buttons{position:absolute;bottom:10px;right:10px;display:flex;z-index:1000}.control-buttons input,.control-buttons button{padding:8px 12px;margin-bottom:7px;margin-left:5px;border-radius:4px;border:none;outline:none}.control-buttons input{border-radius:4px 0 0 4px}.control-buttons button{border-radius:0 4px 4px 0;background-color:#fff;color:#000;cursor:pointer}.control-buttons button:hover{background-color:#f0f0f0}.clear-markers-button{position:absolute;top:10px;right:10px;background-color:#1d4ed8;color:#fff;padding:8px 12px;border-radius:4px;border:none;cursor:pointer;z-index:1000}.clear-markers-button:hover{background-color:#2563eb}.description{margin-bottom:10px;font-size:16px;color:#fff}\n"}],"routeData":{"route":"/results/[search]","isIndex":false,"type":"page","pattern":"^\\/results\\/([^/]+?)\\/?$","segments":[[{"content":"results","dynamic":false,"spread":false}],[{"content":"search","dynamic":true,"spread":false}]],"params":["search"],"component":"src/pages/results/[search].astro","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/final-project-test/_astro/hoisted.BXkF3-Oh.js"}],"styles":[{"type":"external","src":"/final-project-test/_astro/ContactPage.D-6kZGJl.css"},{"type":"inline","content":".buttonHeader{display:flex;flex-direction:row;justify-content:center;color:#fff;cursor:pointer;background-color:transparent;border:none;outline:none;font-weight:500;border-radius:.375rem;padding:.625rem 1.25rem;text-align:center;align-items:center;transition:all .2s ease-in-out;opacity:.7;margin-right:.5rem;margin-bottom:.5rem;gap:.5rem}.buttonHeader:hover{background-color:#374151;box-shadow:0 4px 6px #0000001a;transform:scale(1.1);opacity:1}.buttonHeader.scale-90{transform:scale(.9)}.buttonHeader.text-white{color:#fff}@media (max-width: 768px){.buttonHeader{display:flex;width:100%}}html{font-family:system-ui,sans-serif;background:#13151a;background-size:224px;color-scheme:dark light}.toast{visibility:hidden;max-width:50%;margin:0 auto;background-color:#126f12;color:#fff;text-align:center;border-radius:.25rem;padding:1rem;position:fixed;z-index:1;left:50%;bottom:2rem;transform:translate(-50%)}.toast.show{visibility:visible;animation:fadein .5s,fadeout .5s 2.5s}@keyframes fadein{0%{bottom:0;opacity:0}to{bottom:2rem;opacity:1}}@keyframes fadeout{0%{bottom:2rem;opacity:1}to{bottom:0;opacity:0}}.icon-container{position:fixed;bottom:1rem;right:1rem;z-index:1000}.icon{font-size:2rem;transition:transform .3s ease,color .3s ease}.icon:hover{transform:scale(1.2);color:#ff6f61}#map{height:100%;width:100%}.map-container{position:relative;width:100%;height:500px}.control-buttons{position:absolute;bottom:10px;right:10px;display:flex;z-index:1000}.control-buttons input,.control-buttons button{padding:8px 12px;margin-bottom:7px;margin-left:5px;border-radius:4px;border:none;outline:none}.control-buttons input{border-radius:4px 0 0 4px}.control-buttons button{border-radius:0 4px 4px 0;background-color:#fff;color:#000;cursor:pointer}.control-buttons button:hover{background-color:#f0f0f0}.clear-markers-button{position:absolute;top:10px;right:10px;background-color:#1d4ed8;color:#fff;padding:8px 12px;border-radius:4px;border:none;cursor:pointer;z-index:1000}.clear-markers-button:hover{background-color:#2563eb}.description{margin-bottom:10px;font-size:16px;color:#fff}\n"}],"routeData":{"route":"/taskmanagerpage","isIndex":false,"type":"page","pattern":"^\\/TaskManagerPage\\/?$","segments":[[{"content":"TaskManagerPage","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/TaskManagerPage.astro","pathname":"/TaskManagerPage","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/final-project-test/_astro/hoisted.BXkF3-Oh.js"}],"styles":[{"type":"external","src":"/final-project-test/_astro/ContactPage.D-6kZGJl.css"},{"type":"inline","content":".buttonHeader{display:flex;flex-direction:row;justify-content:center;color:#fff;cursor:pointer;background-color:transparent;border:none;outline:none;font-weight:500;border-radius:.375rem;padding:.625rem 1.25rem;text-align:center;align-items:center;transition:all .2s ease-in-out;opacity:.7;margin-right:.5rem;margin-bottom:.5rem;gap:.5rem}.buttonHeader:hover{background-color:#374151;box-shadow:0 4px 6px #0000001a;transform:scale(1.1);opacity:1}.buttonHeader.scale-90{transform:scale(.9)}.buttonHeader.text-white{color:#fff}@media (max-width: 768px){.buttonHeader{display:flex;width:100%}}html{font-family:system-ui,sans-serif;background:#13151a;background-size:224px;color-scheme:dark light}.toast{visibility:hidden;max-width:50%;margin:0 auto;background-color:#126f12;color:#fff;text-align:center;border-radius:.25rem;padding:1rem;position:fixed;z-index:1;left:50%;bottom:2rem;transform:translate(-50%)}.toast.show{visibility:visible;animation:fadein .5s,fadeout .5s 2.5s}@keyframes fadein{0%{bottom:0;opacity:0}to{bottom:2rem;opacity:1}}@keyframes fadeout{0%{bottom:2rem;opacity:1}to{bottom:0;opacity:0}}.icon-container{position:fixed;bottom:1rem;right:1rem;z-index:1000}.icon{font-size:2rem;transition:transform .3s ease,color .3s ease}.icon:hover{transform:scale(1.2);color:#ff6f61}#map{height:100%;width:100%}.map-container{position:relative;width:100%;height:500px}.control-buttons{position:absolute;bottom:10px;right:10px;display:flex;z-index:1000}.control-buttons input,.control-buttons button{padding:8px 12px;margin-bottom:7px;margin-left:5px;border-radius:4px;border:none;outline:none}.control-buttons input{border-radius:4px 0 0 4px}.control-buttons button{border-radius:0 4px 4px 0;background-color:#fff;color:#000;cursor:pointer}.control-buttons button:hover{background-color:#f0f0f0}.clear-markers-button{position:absolute;top:10px;right:10px;background-color:#1d4ed8;color:#fff;padding:8px 12px;border-radius:4px;border:none;cursor:pointer;z-index:1000}.clear-markers-button:hover{background-color:#2563eb}.description{margin-bottom:10px;font-size:16px;color:#fff}\n"}],"routeData":{"route":"/termsofservicepage","isIndex":false,"type":"page","pattern":"^\\/TermsOfServicePage\\/?$","segments":[[{"content":"TermsOfServicePage","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/TermsOfServicePage.astro","pathname":"/TermsOfServicePage","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/final-project-test/_astro/hoisted.BXkF3-Oh.js"}],"styles":[{"type":"external","src":"/final-project-test/_astro/ContactPage.D-6kZGJl.css"},{"type":"inline","content":".buttonHeader{display:flex;flex-direction:row;justify-content:center;color:#fff;cursor:pointer;background-color:transparent;border:none;outline:none;font-weight:500;border-radius:.375rem;padding:.625rem 1.25rem;text-align:center;align-items:center;transition:all .2s ease-in-out;opacity:.7;margin-right:.5rem;margin-bottom:.5rem;gap:.5rem}.buttonHeader:hover{background-color:#374151;box-shadow:0 4px 6px #0000001a;transform:scale(1.1);opacity:1}.buttonHeader.scale-90{transform:scale(.9)}.buttonHeader.text-white{color:#fff}@media (max-width: 768px){.buttonHeader{display:flex;width:100%}}html{font-family:system-ui,sans-serif;background:#13151a;background-size:224px;color-scheme:dark light}.toast{visibility:hidden;max-width:50%;margin:0 auto;background-color:#126f12;color:#fff;text-align:center;border-radius:.25rem;padding:1rem;position:fixed;z-index:1;left:50%;bottom:2rem;transform:translate(-50%)}.toast.show{visibility:visible;animation:fadein .5s,fadeout .5s 2.5s}@keyframes fadein{0%{bottom:0;opacity:0}to{bottom:2rem;opacity:1}}@keyframes fadeout{0%{bottom:2rem;opacity:1}to{bottom:0;opacity:0}}.icon-container{position:fixed;bottom:1rem;right:1rem;z-index:1000}.icon{font-size:2rem;transition:transform .3s ease,color .3s ease}.icon:hover{transform:scale(1.2);color:#ff6f61}#map{height:100%;width:100%}.map-container{position:relative;width:100%;height:500px}.control-buttons{position:absolute;bottom:10px;right:10px;display:flex;z-index:1000}.control-buttons input,.control-buttons button{padding:8px 12px;margin-bottom:7px;margin-left:5px;border-radius:4px;border:none;outline:none}.control-buttons input{border-radius:4px 0 0 4px}.control-buttons button{border-radius:0 4px 4px 0;background-color:#fff;color:#000;cursor:pointer}.control-buttons button:hover{background-color:#f0f0f0}.clear-markers-button{position:absolute;top:10px;right:10px;background-color:#1d4ed8;color:#fff;padding:8px 12px;border-radius:4px;border:none;cursor:pointer;z-index:1000}.clear-markers-button:hover{background-color:#2563eb}.description{margin-bottom:10px;font-size:16px;color:#fff}\n"}],"routeData":{"route":"/weatherdetailspage","isIndex":false,"type":"page","pattern":"^\\/WeatherDetailsPage\\/?$","segments":[[{"content":"WeatherDetailsPage","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/WeatherDetailsPage.astro","pathname":"/WeatherDetailsPage","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/final-project-test/_astro/hoisted.BXkF3-Oh.js"}],"styles":[{"type":"external","src":"/final-project-test/_astro/ContactPage.D-6kZGJl.css"},{"type":"inline","content":".buttonHeader{display:flex;flex-direction:row;justify-content:center;color:#fff;cursor:pointer;background-color:transparent;border:none;outline:none;font-weight:500;border-radius:.375rem;padding:.625rem 1.25rem;text-align:center;align-items:center;transition:all .2s ease-in-out;opacity:.7;margin-right:.5rem;margin-bottom:.5rem;gap:.5rem}.buttonHeader:hover{background-color:#374151;box-shadow:0 4px 6px #0000001a;transform:scale(1.1);opacity:1}.buttonHeader.scale-90{transform:scale(.9)}.buttonHeader.text-white{color:#fff}@media (max-width: 768px){.buttonHeader{display:flex;width:100%}}html{font-family:system-ui,sans-serif;background:#13151a;background-size:224px;color-scheme:dark light}.toast{visibility:hidden;max-width:50%;margin:0 auto;background-color:#126f12;color:#fff;text-align:center;border-radius:.25rem;padding:1rem;position:fixed;z-index:1;left:50%;bottom:2rem;transform:translate(-50%)}.toast.show{visibility:visible;animation:fadein .5s,fadeout .5s 2.5s}@keyframes fadein{0%{bottom:0;opacity:0}to{bottom:2rem;opacity:1}}@keyframes fadeout{0%{bottom:2rem;opacity:1}to{bottom:0;opacity:0}}.icon-container{position:fixed;bottom:1rem;right:1rem;z-index:1000}.icon{font-size:2rem;transition:transform .3s ease,color .3s ease}.icon:hover{transform:scale(1.2);color:#ff6f61}#map{height:100%;width:100%}.map-container{position:relative;width:100%;height:500px}.control-buttons{position:absolute;bottom:10px;right:10px;display:flex;z-index:1000}.control-buttons input,.control-buttons button{padding:8px 12px;margin-bottom:7px;margin-left:5px;border-radius:4px;border:none;outline:none}.control-buttons input{border-radius:4px 0 0 4px}.control-buttons button{border-radius:0 4px 4px 0;background-color:#fff;color:#000;cursor:pointer}.control-buttons button:hover{background-color:#f0f0f0}.clear-markers-button{position:absolute;top:10px;right:10px;background-color:#1d4ed8;color:#fff;padding:8px 12px;border-radius:4px;border:none;cursor:pointer;z-index:1000}.clear-markers-button:hover{background-color:#2563eb}.description{margin-bottom:10px;font-size:16px;color:#fff}\n"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"site":"https://3dwardperezs.github.io","base":"/final-project-test","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/ED/Documents/final-project-test/src/pages/ContactPage.astro",{"propagation":"none","containsHead":true}],["C:/Users/ED/Documents/final-project-test/src/pages/PrivacyPolicyPage.astro",{"propagation":"none","containsHead":true}],["C:/Users/ED/Documents/final-project-test/src/pages/TermsOfServicePage.astro",{"propagation":"none","containsHead":true}],["C:/Users/ED/Documents/final-project-test/src/pages/404.astro",{"propagation":"none","containsHead":true}],["C:/Users/ED/Documents/final-project-test/src/pages/GithubRepoSearchPage.astro",{"propagation":"none","containsHead":true}],["C:/Users/ED/Documents/final-project-test/src/pages/InteractiveMapPage.astro",{"propagation":"none","containsHead":true}],["C:/Users/ED/Documents/final-project-test/src/pages/MoviePage.astro",{"propagation":"none","containsHead":true}],["C:/Users/ED/Documents/final-project-test/src/pages/TaskManagerPage.astro",{"propagation":"none","containsHead":true}],["C:/Users/ED/Documents/final-project-test/src/pages/WeatherDetailsPage.astro",{"propagation":"none","containsHead":true}],["C:/Users/ED/Documents/final-project-test/src/pages/detail/[id].astro",{"propagation":"none","containsHead":true}],["C:/Users/ED/Documents/final-project-test/src/pages/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/ED/Documents/final-project-test/src/pages/results/[search].astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var i=t=>{let e=async()=>{await(await t())()};\"requestIdleCallback\"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astro-page:node_modules/.pnpm/astro@4.13.1_typescript@5.5.4/node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/404@_@astro":"pages/404.astro.mjs","\u0000@astro-page:src/pages/ContactPage@_@astro":"pages/contactpage.astro.mjs","\u0000@astro-page:src/pages/detail/[id]@_@astro":"pages/detail/_id_.astro.mjs","\u0000@astro-page:src/pages/GithubRepoSearchPage@_@astro":"pages/githubreposearchpage.astro.mjs","\u0000@astro-page:src/pages/InteractiveMapPage@_@astro":"pages/interactivemappage.astro.mjs","\u0000@astro-page:src/pages/MoviePage@_@astro":"pages/moviepage.astro.mjs","\u0000@astro-page:src/pages/PrivacyPolicyPage@_@astro":"pages/privacypolicypage.astro.mjs","\u0000@astro-page:src/pages/results/[search]@_@astro":"pages/results/_search_.astro.mjs","\u0000@astro-page:src/pages/TaskManagerPage@_@astro":"pages/taskmanagerpage.astro.mjs","\u0000@astro-page:src/pages/TermsOfServicePage@_@astro":"pages/termsofservicepage.astro.mjs","\u0000@astro-page:src/pages/WeatherDetailsPage@_@astro":"pages/weatherdetailspage.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-manifest":"manifest_BPlqk0K7.mjs","@components/GithubRepoSearch.svelte":"_astro/GithubRepoSearch.JPGr5GDU.js","@astrojs/svelte/client.js":"_astro/client.Cx1FBVJX.js","/astro/hoisted.js?q=0":"_astro/hoisted.4ecotApa.js","@components/SearchMovie.svelte":"_astro/SearchMovie.gAienkDd.js","/astro/hoisted.js?q=1":"_astro/hoisted.BXkF3-Oh.js","@components/TaskManager.svelte":"_astro/TaskManager.DUV-ZK4D.js","@components/WeatherDashboard.svelte":"_astro/WeatherDashboard.DJ2N6hhh.js","@components/InteractiveMap.svelte":"_astro/InteractiveMap.BRLzbzvR.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/final-project-test/_astro/ContactPage.D-6kZGJl.css","/final-project-test/favicon.svg","/final-project-test/logoGitHub.webp","/final-project-test/_astro/client.Cx1FBVJX.js","/final-project-test/_astro/each.-gASlQSi.js","/final-project-test/_astro/GithubRepoSearch.JPGr5GDU.js","/final-project-test/_astro/hoisted.4ecotApa.js","/final-project-test/_astro/hoisted.BXkF3-Oh.js","/final-project-test/_astro/index.D54iKUMM.js","/final-project-test/_astro/InteractiveMap.BRLzbzvR.js","/final-project-test/_astro/SearchMovie.gAienkDd.js","/final-project-test/_astro/TaskManager.DUV-ZK4D.js","/final-project-test/_astro/WeatherDashboard.DJ2N6hhh.js"],"buildFormat":"directory","checkOrigin":false,"serverIslandNameMap":[],"experimentalEnvGetSecretEnabled":false});

export { manifest };
