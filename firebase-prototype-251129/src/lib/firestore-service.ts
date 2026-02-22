/**
 * @file firestore-service.ts
 * @description Firestore CRUD 서비스 — 유저별 목표/코인/기록 관리
 * 
 * 컬렉션 구조:
 * users/{uid}/goals/{goalId}
 * users/{uid}/dailyRecords/{date}
 * users/{uid}/transactions/{txId}
 * users/{uid}/profile (doc)
 */

import {
    collection,
    doc,
    getDocs,
    getDoc,
    setDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Goal, DailyRecord, CoinTransaction } from './types';

// ============================================================
// Goals (목표)
// ============================================================

const goalsCollection = (uid: string) => {
    if (!db) throw new Error('Firestore not configured');
    return collection(db, 'users', uid, 'goals');
};

/** 특정 날짜의 목표 조회 */
export async function getGoalsByDate(uid: string, date: string): Promise<Goal[]> {
    try {
        const q = query(goalsCollection(uid), where('date', '==', date));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Goal));
    } catch (error) {
        console.warn('[Firestore] 목표 조회 실패, localStorage 폴백:', error);
        return getGoalsFromLocal(uid, date);
    }
}

/** 모든 목표 조회 */
export async function getAllGoals(uid: string): Promise<Goal[]> {
    try {
        const q = query(goalsCollection(uid), orderBy('date', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Goal));
    } catch (error) {
        console.warn('[Firestore] 전체 목표 조회 실패:', error);
        return getAllGoalsFromLocal(uid);
    }
}

/** 목표 추가 */
export async function addGoal(uid: string, goal: Omit<Goal, 'id'>): Promise<Goal> {
    try {
        const ref = await addDoc(goalsCollection(uid), goal);
        const newGoal = { id: ref.id, ...goal };
        saveGoalToLocal(uid, newGoal);
        return newGoal;
    } catch (error) {
        console.warn('[Firestore] 목표 추가 실패, localStorage 사용:', error);
        const id = crypto.randomUUID();
        const newGoal = { id, ...goal };
        saveGoalToLocal(uid, newGoal);
        return newGoal;
    }
}

/** 목표 업데이트 (달성률, 검증 등) */
export async function updateGoal(uid: string, goalId: string, data: Partial<Goal>): Promise<void> {
    if (db) {
        try {
            await updateDoc(doc(db, 'users', uid, 'goals', goalId), data);
        } catch (error) {
            console.warn('[Firestore] 목표 업데이트 실패:', error);
        }
    }
    updateGoalInLocal(uid, goalId, data);
}

/** 목표 삭제 */
export async function deleteGoal(uid: string, goalId: string): Promise<void> {
    if (db) {
        try {
            await deleteDoc(doc(db, 'users', uid, 'goals', goalId));
        } catch (error) {
            console.warn('[Firestore] 목표 삭제 실패:', error);
        }
    }
    deleteGoalFromLocal(uid, goalId);
}

// ============================================================
// DailyRecord (일일 코인 기록)
// ============================================================

/** 일일 기록 조회 */
export async function getDailyRecord(uid: string, date: string): Promise<DailyRecord | null> {
    if (db) {
        try {
            const ref = doc(db, 'users', uid, 'dailyRecords', date);
            const snapshot = await getDoc(ref);
            return snapshot.exists() ? (snapshot.data() as DailyRecord) : null;
        } catch (error) {
            console.warn('[Firestore] 일일 기록 조회 실패:', error);
        }
    }
    return getDailyRecordFromLocal(uid, date);
}

/** 일일 기록 저장/업데이트 */
export async function saveDailyRecord(uid: string, record: DailyRecord): Promise<void> {
    if (db) {
        try {
            await setDoc(doc(db, 'users', uid, 'dailyRecords', record.date), record);
        } catch (error) {
            console.warn('[Firestore] 일일 기록 저장 실패:', error);
        }
    }
    saveDailyRecordToLocal(uid, record);
}

// ============================================================
// 코인 잔액 (Profile)
// ============================================================

/** 총 코인 잔액 조회 */
export async function getTotalCoins(uid: string): Promise<number> {
    if (db) {
        try {
            const ref = doc(db, 'users', uid, 'profile', 'coinBalance');
            const snapshot = await getDoc(ref);
            return snapshot.exists() ? (snapshot.data().totalCoins || 0) : 0;
        } catch (error) {
            console.warn('[Firestore] 코인 잔액 조회 실패:', error);
        }
    }
    return getTotalCoinsFromLocal(uid);
}

/** 코인 잔액 업데이트 */
export async function updateTotalCoins(uid: string, totalCoins: number): Promise<void> {
    if (db) {
        try {
            await setDoc(doc(db, 'users', uid, 'profile', 'coinBalance'), { totalCoins });
        } catch (error) {
            console.warn('[Firestore] 코인 잔액 업데이트 실패:', error);
        }
    }
    saveTotalCoinsToLocal(uid, totalCoins);
}

// ============================================================
// CoinTransaction (거래 내역)
// ============================================================

/** 거래 내역 추가 */
export async function addTransaction(uid: string, tx: Omit<CoinTransaction, 'id'>): Promise<void> {
    if (db) {
        try {
            await addDoc(collection(db, 'users', uid, 'transactions'), tx);
        } catch (error) {
            console.warn('[Firestore] 거래 내역 추가 실패:', error);
        }
    }
    addTransactionToLocal(uid, { id: crypto.randomUUID(), ...tx });
}

/** 거래 내역 조회 */
export async function getTransactions(uid: string): Promise<CoinTransaction[]> {
    if (db) {
        try {
            const q = query(collection(db, 'users', uid, 'transactions'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as CoinTransaction));
        } catch (error) {
            console.warn('[Firestore] 거래 내역 조회 실패:', error);
        }
    }
    return getTransactionsFromLocal(uid);
}

// ============================================================
// localStorage Fallback 헬퍼
// ============================================================

const isClient = typeof window !== 'undefined';

function getLocalKey(uid: string, type: string): string {
    return `habitcoin-${uid}-${type}`;
}

function getGoalsFromLocal(uid: string, date: string): Goal[] {
    try {
        const all = getAllGoalsFromLocal(uid);
        return all.filter(g => g.date === date);
    } catch { return []; }
}

function getAllGoalsFromLocal(uid: string): Goal[] {
    if (!isClient) return [];
    try {
        const data = localStorage.getItem(getLocalKey(uid, 'goals'));
        return data ? JSON.parse(data) : [];
    } catch { return []; }
}

function saveGoalToLocal(uid: string, goal: Goal): void {
    if (!isClient) return;
    try {
        const goals = getAllGoalsFromLocal(uid);
        const existing = goals.findIndex(g => g.id === goal.id);
        if (existing >= 0) goals[existing] = goal;
        else goals.push(goal);
        localStorage.setItem(getLocalKey(uid, 'goals'), JSON.stringify(goals));
    } catch { }
}

function updateGoalInLocal(uid: string, goalId: string, data: Partial<Goal>): void {
    if (!isClient) return;
    try {
        const goals = getAllGoalsFromLocal(uid);
        const idx = goals.findIndex(g => g.id === goalId);
        if (idx >= 0) {
            goals[idx] = { ...goals[idx], ...data };
            localStorage.setItem(getLocalKey(uid, 'goals'), JSON.stringify(goals));
        }
    } catch { }
}

function deleteGoalFromLocal(uid: string, goalId: string): void {
    if (!isClient) return;
    try {
        const goals = getAllGoalsFromLocal(uid).filter(g => g.id !== goalId);
        localStorage.setItem(getLocalKey(uid, 'goals'), JSON.stringify(goals));
    } catch { }
}

function getDailyRecordFromLocal(uid: string, date: string): DailyRecord | null {
    if (!isClient) return null;
    try {
        const data = localStorage.getItem(getLocalKey(uid, `daily-${date}`));
        return data ? JSON.parse(data) : null;
    } catch { return null; }
}

function saveDailyRecordToLocal(uid: string, record: DailyRecord): void {
    if (!isClient) return;
    try {
        localStorage.setItem(getLocalKey(uid, `daily-${record.date}`), JSON.stringify(record));
    } catch { }
}

function getTotalCoinsFromLocal(uid: string): number {
    if (!isClient) return 0;
    try {
        const data = localStorage.getItem(getLocalKey(uid, 'totalCoins'));
        return data ? parseInt(data, 10) : 0;
    } catch { return 0; }
}

function saveTotalCoinsToLocal(uid: string, coins: number): void {
    if (!isClient) return;
    try {
        localStorage.setItem(getLocalKey(uid, 'totalCoins'), coins.toString());
    } catch { }
}

function addTransactionToLocal(uid: string, tx: CoinTransaction): void {
    if (!isClient) return;
    try {
        const txs = getTransactionsFromLocal(uid);
        txs.unshift(tx);
        localStorage.setItem(getLocalKey(uid, 'transactions'), JSON.stringify(txs.slice(0, 100)));
    } catch { }
}

function getTransactionsFromLocal(uid: string): CoinTransaction[] {
    if (!isClient) return [];
    try {
        const data = localStorage.getItem(getLocalKey(uid, 'transactions'));
        return data ? JSON.parse(data) : [];
    } catch { return []; }
}
