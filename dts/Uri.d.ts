export class Uri {
    hash: string;
    page: string;
    pathName: string;
    directory: string;
    port: string;
    hostName: string;
    protocol: string;
    origin: string;
    full: string;
    args: Indexable<string>;
    constructor(url?: string);
    init(): void;
}
