/**
 * @file firebase.ts
 * @description Firebase 앱 초기화 및 Auth/Firestore 인스턴스
 * 
 * ⚠ 중요: Firebase Auth SDK는 모듈 스코프에서 import하지 않습니다.
 *   'firebase/auth' 모듈이 import 시점에 내부적으로 localStorage에 접근하여
 *   Next.js SSR에서 에러가 발생하기 때문입니다.
 *   대신 getFirebaseAuth()를 통해 lazy initialization을 사용합니다.
 */

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** Firebase 설정이 유효한지 확인 */
export const isFirebaseConfigured = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

/** 브라우저 환경인지 확인 */
const isBrowser = typeof window !== 'undefined';

// ============================================================
// Firebase App
// ============================================================
let app: FirebaseApp | null = null;
if (isFirebaseConfigured) {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

// ============================================================
// Firestore (서버에서도 안전)
// ============================================================
let db: any = null;

async function initFirestore() {
  if (!app || !isFirebaseConfigured) return null;
  try {
    const { getFirestore } = await import('firebase/firestore');
    return getFirestore(app);
  } catch {
    return null;
  }
}

// 미리 초기화 시도 (dynamic import는 비동기이지만 결과를 캐시)
let _dbPromise: Promise<any> | null = null;
export function getDb() {
  if (db) return Promise.resolve(db);
  if (!_dbPromise) {
    _dbPromise = initFirestore().then(result => {
      db = result;
      return db;
    });
  }
  return _dbPromise;
}

// ============================================================
// Auth (브라우저 전용 — lazy dynamic import)
// ============================================================
let _authModule: any = null;
let _auth: any = null;
let _googleProvider: any = null;

/** Auth 모듈을 동적으로 로드하고 Auth 인스턴스 반환 */
export async function getFirebaseAuth() {
  if (!isBrowser || !app || !isFirebaseConfigured) return null;
  if (_auth) return _auth;

  if (!_authModule) {
    _authModule = await import('firebase/auth');
  }
  _auth = _authModule.getAuth(app);
  return _auth;
}

/** GoogleAuthProvider를 동적으로 생성 */
export async function getGoogleProvider() {
  if (!isBrowser) return null;
  if (_googleProvider) return _googleProvider;

  if (!_authModule) {
    _authModule = await import('firebase/auth');
  }
  _googleProvider = new _authModule.GoogleAuthProvider();
  return _googleProvider;
}

/** Auth 관련 함수들을 제공 (동적 import 기반) */
export async function getAuthFunctions() {
  if (!_authModule) {
    _authModule = await import('firebase/auth');
  }
  return _authModule;
}

// 하위 호환을 위한 동기 값 (null이면 아직 초기화 안됨)
export { app };
export { db };
export const auth = null; // 동기 접근 비권장 — getFirebaseAuth() 사용
export const googleProvider = null;
export default app;
