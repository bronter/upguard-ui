import {invert, uniq, values, isPlainObject} from "lodash";
import {observable} from "mobx";
import scansStore from "./scans";

function objDiff(sizeAccum, name, ids, data) {
  // Grab all data keys for this level
  const allKeys = Array.from(new Set(ids.reduce((prev, curr) => {
    prev = prev.concat(Object.keys(data[curr]));
    return prev;
  }, [])));

  return {
    name,
    children: allKeys.map((key) => {
      return diff(sizeAccum * 1.5, key, ids.reduce((prev, curr) => {
        prev[curr] = data[curr][key];
        return prev;
      }, {}));
    }),
  };

}

function arrayDiff(sizeAccum, name, ids, data) {
  // Get the length of the longest array, that's how far out we'll iterate
  // Can count on out-of-bounds array access returning undefined, which I can handle
  const maxLength = ids.reduce((prev, curr) => Math.max(prev, data[curr].length), 0);

  // All we do here is make an array of maxLength length, iterate over it,
  // and run a recursive diff call for each set of values
  return {
    name,
    children: Array(maxLength).fill().map((_, i) => {
      return diff(sizeAccum * 1.5, "", ids.reduce((prev, curr) => {
        prev[curr] = data[curr][i];
        return prev;
      }, {}));
    }),
  };
}

function diff(sizeAccum, name, data) {
  // Grab the ids of the nodes we'll be diffing
  const ids = Object.keys(data);

  // Primitives are values like ints, bools, and strings, that we can't iterate or recurse over
  let primitives = {};
  // Don't want to run Object.keys() just to see how many items there are
  let nPlainObjs = 0;
  // We want to get an object containing a mapping of node ids to values,
  // but containing only values that are plain objects (not arrays or strings or something weird like that)
  const plainObjs = ids.reduce((prev, curr) => {
    if (isPlainObject(data[curr])) {
      prev[curr] = data[curr];
      nPlainObjs++;
    } else {
      // If it isn't a plain object, we'll assume for now it's a primitive
      // This results in arrays getting in, but we'll take care of those
      // in the next step.
      primitives[curr] = data[curr];
    }
    return prev;
  }, {});
  let nArrays = 0;
  // We want on object containing a mapping of node ids to all array values
  const arrays = ids.reduce((prev, curr) => {
    if (Array.isArray(data[curr])) {
      prev[curr] = data[curr];
      nArrays++;
      // Running delete on an undefined element does nothing, so we can
      // just assume our array is found in primitives and remove it
      delete primitives[curr];
    }
    return prev;
  }, {});

  // Get to know our primitives
  const primitiveKeys = Object.keys(primitives);
  const uniquePrimitives = uniq(values(primitives));
  const nPrimitives = primitiveKeys.length;

  // We want to know for each type if all the values at this level are of that
  // type, and since we already know how many of each type we have we can simply
  // compare it to how many ids there are.
  if (ids.length === nPlainObjs) {
    return objDiff(sizeAccum, name, ids, data);
  } else if (ids.length === nArrays) {
    return arrayDiff(sizeAccum, name, ids, data);
  } else if (uniquePrimitives.length === 1) {
    return {name: uniquePrimitives[0], size: sizeAccum};
  } else { // We have heterogenous types at this level, so break things down
    let ret = {
      name,
      children: [],
    };
    const plainKeys = Object.keys(plainObjs);
    const arrayKeys = Object.keys(arrays);
    // Get the group of all plain objects
    if (nPlainObjs > 0) ret.children.push(objDiff(sizeAccum, plainKeys.join(" ,"), plainKeys, plainObjs));
    // if (nPlainObjs > 0) ret[new Set(plainKeys)] = objDiff(plainKeys, plainObjs);
    // Get the group of all arrays
    if (nArrays > 0) ret.children.push(arrayDiff(sizeAccum, arrayKeys.join(" ,"), arrayKeys, arrays));
    // if (nArrays > 0) ret[new Set(arrayKeys)] = arrayDiff(arrayKeys, arrays);
    if (nPrimitives > 0) {
      let inverts = {};
      // Primitives are a bit nasty here, they can be strings, ints, bools, or null
      // So what we do is construct an object with the primitives as the keys
      // (thus eliminating duplicates), and a set of all node ids for nodes whose
      // values match that primitive for the value.
      primitiveKeys.map((k) => {
        if (inverts[primitives[k]] != null) {
          inverts[primitives[k]] += `, ${k}`;
        } else {
          inverts[primitives[k]] = k;
        }
      });
      // We then invert our primitives object (swap the keys and values),
      // thus obtaning a mapping of sets of node ids to singular values,
      // and assign it to this ret object we've been building that already
      // contains our array and object groups.
      const invert2 = invert(inverts)
      ret.children = Object.keys(invert2).map((k) => {
        return {
          name: k,
          children: [{name: invert2[k], children: [], size: sizeAccum}],
        }
      });
    }

    return ret;
  }
}

class Diff {
  @observable diff:object;
  @observable isDiffing:bool;
  // We'll add things to this when we remove nodes from the diff in the UI
  @observable exclude:array;

  constructor() {
    this.isDiffing = false;
    this.diff = null;
  }

  populate() {
    if (scansStore.scans.length > 0) {
      this.isDiffing = true;
      // Try not to block up the UI while diffing
      window.requestAnimationFrame(() => {
        const data = scansStore.scans.reduce((prev, curr) => {
          prev[curr.nodeId] = curr.data;
          return prev;
        }, {});
        const start = Date.now();
        const diffObj = diff(1000, "diff", data);
        this.diff = diffObj;
        const end = Date.now();
        console.log(`Diffing execution time: ${end - start}`);
        console.log(this.diff);
        this.isDiffing = false;
      });
    }
  }
}

export default new Diff();
