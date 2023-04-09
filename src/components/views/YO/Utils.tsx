export function runningInWorker (){
    // eslint-disable-next-line no-restricted-globals
    return typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope
}

// Adapted from from https://stackoverflow.com/questions/32673518/how-to-check-if-an-object-can-be-cloned-by-the-structured-clone-algorithm
export class StructuredCloneChecker {
    iframe: HTMLIFrameElement
    window: Window

    constructor() {
        this.iframe = document.createElement('iframe');
        document.body.appendChild(this.iframe);
        this.window = this.iframe.contentWindow;
        document.body.removeChild(this.iframe);
    }

    public check(value): boolean {
        try {
            this.window.postMessage(value, '*');
        }
        catch(err) {
            return false;
        }
        return true;
    }
}