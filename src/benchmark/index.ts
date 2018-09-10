import * as Benchmark from "benchmark";

import { suites as ArrBench } from "./ArrBench";

ArrBench.forEach((el) => el.run({ 'async': false }));
