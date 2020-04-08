import { r as registerInstance, d as createEvent, h, c as getIonMode, H as Host, e as getElement } from './core-0a8d4d2e.js';
import './config-3c7f3790.js';

const Img = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.onLoad = () => {
            this.ionImgDidLoad.emit();
        };
        this.onError = () => {
            this.ionError.emit();
        };
        this.ionImgWillLoad = createEvent(this, "ionImgWillLoad", 7);
        this.ionImgDidLoad = createEvent(this, "ionImgDidLoad", 7);
        this.ionError = createEvent(this, "ionError", 7);
    }
    srcChanged() {
        this.addIO();
    }
    componentDidLoad() {
        this.addIO();
    }
    addIO() {
        if (this.src === undefined) {
            return;
        }
        if ('IntersectionObserver' in window) {
            this.removeIO();
            this.io = new IntersectionObserver(data => {
                // because there will only ever be one instance
                // of the element we are observing
                // we can just use data[0]
                if (data[0].isIntersecting) {
                    this.load();
                    this.removeIO();
                }
            });
            this.io.observe(this.el);
        }
        else {
            // fall back to setTimeout for Safari and IE
            setTimeout(() => this.load(), 200);
        }
    }
    load() {
        this.loadError = this.onError;
        this.loadSrc = this.src;
        this.ionImgWillLoad.emit();
    }
    removeIO() {
        if (this.io) {
            this.io.disconnect();
            this.io = undefined;
        }
    }
    render() {
        return (h(Host, { class: getIonMode(this) }, h("img", { decoding: "async", src: this.loadSrc, alt: this.alt, onLoad: this.onLoad, onError: this.loadError })));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "src": ["srcChanged"]
    }; }
    static get style() { return ":host{-o-object-fit:contain;object-fit:contain}:host,img{display:block}img{width:100%;height:100%;-o-object-fit:inherit;object-fit:inherit;-o-object-position:inherit;object-position:inherit}"; }
};

export { Img as ion_img };
