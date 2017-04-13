import * as Good from "./index"

export default function Integrate(alias?: string, win: Window = window) {
    if (alias !== undefined) {
        (<any>win)[alias] = {};
    }
    for (let stuff in Good) {
        if ((<any>Good)[stuff]._) {
            if (alias !== undefined) {
                (<any>win)[alias][stuff] = (<any>Good)[stuff]._;
            } else {
                (<any>win)[stuff] = (<any>Good)[stuff]._;
            }
        } else {
            if (alias !== undefined) {
                (<any>win)[alias][stuff] = (<any>Good)[stuff];
            } else {
                (<any>win)[stuff] = (<any>Good)[stuff];
            }
        }
    }
}
