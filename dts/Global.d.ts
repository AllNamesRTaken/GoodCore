namespace NodeJS {
    export interface Global {}
}
export const Global: {
    window: Window | null;
    hasNativeWindow: boolean;
    global: NodeJS.Global | Window;
};