/**
 * SSR localStorage Polyfill
 * This file is injected via webpack into the server bundle
 * to provide localStorage before Firebase Auth SDK loads.
 */
if (typeof globalThis.localStorage === 'undefined') {
    const store = new Map();
    Object.defineProperty(globalThis, 'localStorage', {
        value: {
            getItem: (key) => store.get(key) ?? null,
            setItem: (key, value) => store.set(key, String(value)),
            removeItem: (key) => store.delete(key),
            clear: () => store.clear(),
            get length() { return store.size; },
            key: (index) => Array.from(store.keys())[index] ?? null,
        },
        writable: true,
        configurable: true,
    });
}
