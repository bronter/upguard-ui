import {camelCase, isPlainObject} from "lodash";

function snake2Camel(obj) {
  if (Array.isArray(obj)) {
    return obj.map(x => snake2Camel(x));
  } else if (isPlainObject(obj)) {
    return Object.keys(obj).reduce((prev, curr) => {
      prev[camelCase(curr)] = snake2Camel(obj[curr]);

      return prev;
    }, {});
  } else {
    return obj;
  }
}

export {
  snake2Camel,
};
