export class Uri {
    hash: string;
    page: string;
    pathName: string;
    port: string;
    hostName: string;
    protocol: string;
    origin: string;
    full: string;
    args: Indexable<string>;
    constructor();
    init(): void;
}
