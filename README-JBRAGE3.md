[![Build Status](https://travis-ci.org/AllNamesRTaken/GoodCore.svg?branch=master)](https://travis-ci.org/AllNamesRTaken/GoodCore)
[![Coverage Status](https://coveralls.io/repos/github/AllNamesRTaken/GoodCore/badge.svg?branch=master)](https://coveralls.io/github/AllNamesRTaken/GoodCore?branch=master)

# GoodCore
Good Core typescript library with utility functions and effective data structures for use with both Node and browser.

It brings:
- type definitions
- fluent api where applicable
- high performance
- fully tested
- fully tree shakeable with rollup
- no external dependencies

It contains ...

the following JSON.stringify -able data structures:
- List<T> (indexable, with iterator)
- SortedList<T> (O(log(n)) lookup, and iterator)
- Dictionary<T>
- Stack<T>
- Tree<T>
- Vec2
- Range2
- Rect
- KeyValuePair<S, T>

general utility objects:
- Pool<T>

method combinator decorators:
- @before
- @after
- @around
- @provided
- @once (caches first result)
- @async
- @async.before 
- @async.after 
- @async.provided 

mixins:
- Initable
- Pooable

and lots of utility functions for:
- Array manipulation, optimized for speed
- Dom manipulation
- Moc data generation
- Object manipulation
- Timer
- Uri location handling
- Fast rotation calculation using pre calculationand and closest value
- Utility functions for
  - Asserts
  - Function proxies
  - Log pipe
  - Guid generation
  - looping

# Caveat
Iterator support in List and SortedList requires that the browser supports it too. So if you have to support a browser which do not such as IE11 then please use a polyfill like core.js. 

# Examples
Here is a small example that makes no sense other than show what the lib looks like in use.

```typescript
import { Initable, List, provided, Range2, Util, Vec2 } from "goodcore";

let world = new Range2(2, 2, 8, 8); //x,y,h,w
function inWorld(point: IVec2): boolean {
    return world.containsPoint(point);
}

class BaseLogger {
    private _list: List<Vec2> = new List<Vec2>();
    public id: string = "";

    @provided(inWorld)
    public log(point: IVec2) {
        this._list.add(new Vec2().set(point));
    }
    public search(point: IVec2): List<Vec2> {
        return this._list.select((p, i) => p.equals(point)).clone();
    }
    public get list(): List<Vec2> {
        return this._list.clone();
    }
}
class Logger extends Initable(BaseLogger) {}

// log in the order of distance from 0,0 
let logger: Logger = new Logger().init({id: Util.newUUID()}) as Logger;
logger.log({x: 1, y: 3});
logger.log({x: 4, y: 4});
logger.log({x: 5, y: 5});
logger.log({x: 7, y: 8});
logger.log({x: 9, y: 3});

console.log(logger.id);
logger.list
    .orderBy((a, b) => a.length() - b.length())
    .forEach((p) => console.log(p.x, p.y));

let contains = logger.search({x: 4, y: 4});
console.log(`does the log contain point 4,4? ${contains.count > 0}`);
```
# Contribute
Found a bug? GREAT! Raise an issue!

When developing, please:

- Write unit tests.
- Make sure your unit tests pass
