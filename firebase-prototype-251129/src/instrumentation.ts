/**
 * @file instrumentation.ts
 * @description Next.js Instrumentation — localStorage polyfill for SSR
 * 
 * Firebase Auth SDK calls localStorage.getItem during getAuth().
 * This polyfill creates an in-memory localStorage at module scope
 * so it's available before any other module evaluation.
 */

// 모듈 스코프에서 바로 실행 — 가장 일찍 실행됨
const needsPolyfill = typeof globalThis.localStorage === 'undefined' ||
    typeof globalThis.localStorage.getItem !== 'function';

if (needsPolyfill) {
    const store = new Map<string, string>();
    const polyfill = {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => store.set(key, value),
        removeItem: (key: string) => store.delete(key),
        clear: () => store.clear(),
        get length() { return store.size; },
        key: (index: number) => Array.from(store.keys())[index] ?? null,
    };

    try {
        Object.defineProperty(globalThis, 'localStorage', {
            value: polyfill,
            writable: true,
            configurable: true,
        });
    } catch (e) {
        // 일부 환경에서는 defineProperty가 실패할 수 있으므로 직접 할당 시도
        (globalThis as any).localStorage = polyfill;
    }
}

export async function register() {
    // Polyfill already applied at module scope above
}
