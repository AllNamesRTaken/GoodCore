import { suites as ArrBench } from "./ArrBench.js";

// tslint:disable-next-line:object-literal-key-quotes
ArrBench.forEach((el) => el.run({ "async": false }));
