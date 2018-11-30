import { suites as ArrBench } from "./ArrBench";

// tslint:disable-next-line:object-literal-key-quotes
ArrBench.forEach((el) => el.run({ "async": false }));
