'use client';

/**
 * @file coin-context.tsx
 * @description Habit Coin 시스템 Context
 * 
 * 코인 계산 규칙:
 * - 하루 최대 200코인 (출석 100 + 달성 100)
 * - 출석: 하루 첫 로그인 시 100코인 선지급
 * - 긴급 목표: 미달성 시 차감 (100/긴급수) × (100%-달성률%)
 * - 중급/습관: 달성 시 지급 (100/(중급+습관)수) × 달성률% (최대 100)
 */

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useAuth } from './auth-context';
import {
    getGoalsByDate,
    getAllGoals,
    addGoal as addGoalDB,
    updateGoal as updateGoalDB,
    deleteGoal as deleteGoalDB,
    getDailyRecord,
    saveDailyRecord,
    getTotalCoins,
    updateTotalCoins,
    addTransaction,
    getTransactions,
} from './firestore-service';
import type { Goal, DailyRecord, CoinTransaction, GoalPriority, Studymate } from './types';
import { ATTENDANCE_COINS, ACHIEVEMENT_MAX_COINS, MAX_URGENT_GOALS_PER_DAY } from './types';
import { format } from 'date-fns';

// ============================================================
// Types
// ============================================================

interface CoinContextType {
    /** 현재 총 코인 잔액 */
    totalCoins: number;
    /** 오늘의 목표 리스트 */
    todayGoals: Goal[];
    /** 선택한 날짜의 목표 리스트 */
    selectedDateGoals: Goal[];
    /** 모든 목표 */
    allGoals: Goal[];
    /** 오늘의 일일 기록 */
    todayRecord: DailyRecord | null;
    /** 거래 내역 */
    transactions: CoinTransaction[];
    /** 로딩 상태 */
    loading: boolean;
    /** 선택 날짜 */
    selectedDate: string;
    /** 날짜 선택 */
    setSelectedDate: (date: string) => void;
    /** 목표 추가 */
    addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'verified'>) => Promise<Goal | null>;
    /** 목표 삭제 */
    removeGoal: (goalId: string) => Promise<void>;
    /** 달성률 입력 + 코인 계산 */
    verifyGoal: (goalId: string, percent: number, note?: string) => Promise<void>;
    /** 상점 구매 */
    purchaseItem: (itemName: string, price: number) => Promise<boolean>;
    /** 데이터 새로고침 */
    refresh: () => Promise<void>;
}

// ============================================================
// Context
// ============================================================

const CoinContext = createContext<CoinContextType | undefined>(undefined);

// ============================================================
// 코인 계산 함수
// ============================================================

function calculateDailyCoins(goals: Goal[]): { attendanceCoins: number; urgentDeduction: number; bonusCoins: number; totalCoins: number } {
    const attendanceCoins = ATTENDANCE_COINS;

    const urgentGoals = goals.filter(g => g.priority === 'urgent');
    const nonUrgentGoals = goals.filter(g => g.priority === 'medium' || g.priority === 'habit');

    // 긴급 목표 차감 계산
    let urgentDeduction = 0;
    if (urgentGoals.length > 0) {
        const coinPerUrgent = ATTENDANCE_COINS / urgentGoals.length;
        for (const goal of urgentGoals) {
            const percent = goal.achievementPercent ?? 0;
            const deduction = coinPerUrgent * ((100 - percent) / 100);
            urgentDeduction += deduction;
        }
    }

    // 중급/습관 보상 계산
    let bonusCoins = 0;
    if (nonUrgentGoals.length > 0) {
        const coinPerNonUrgent = ACHIEVEMENT_MAX_COINS / nonUrgentGoals.length;
        for (const goal of nonUrgentGoals) {
            const percent = goal.achievementPercent ?? 0;
            bonusCoins += coinPerNonUrgent * (percent / 100);
        }
        bonusCoins = Math.min(bonusCoins, ACHIEVEMENT_MAX_COINS);
    }

    const totalCoins = Math.round(attendanceCoins - urgentDeduction + bonusCoins);

    return {
        attendanceCoins,
        urgentDeduction: Math.round(urgentDeduction),
        bonusCoins: Math.round(bonusCoins),
        totalCoins: Math.max(0, totalCoins),
    };
}

// ============================================================
// Provider
// ============================================================

export function CoinProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [totalCoins, setTotalCoins] = useState(0);
    const [todayGoals, setTodayGoals] = useState<Goal[]>([]);
    const [selectedDateGoals, setSelectedDateGoals] = useState<Goal[]>([]);
    const [allGoals, setAllGoals] = useState<Goal[]>([]);
    const [todayRecord, setTodayRecord] = useState<DailyRecord | null>(null);
    const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDateState] = useState(format(new Date(), 'yyyy-MM-dd'));

    const today = format(new Date(), 'yyyy-MM-dd');

    // 데이터 로드
    const loadData = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const [coins, tGoals, record, txs, aGoals] = await Promise.all([
                getTotalCoins(user.uid),
                getGoalsByDate(user.uid, today),
                getDailyRecord(user.uid, today),
                getTransactions(user.uid),
                getAllGoals(user.uid),
            ]);

            setTotalCoins(coins);
            setTodayGoals(tGoals);
            setTodayRecord(record);
            setTransactions(txs);
            setAllGoals(aGoals);

            // 출석 보상 처리
            if (!record || !record.loginRecorded) {
                const newRecord: DailyRecord = {
                    date: today,
                    attendanceCoins: ATTENDANCE_COINS,
                    urgentDeduction: 0,
                    bonusCoins: 0,
                    totalCoins: ATTENDANCE_COINS,
                    loginRecorded: true,
                };
                await saveDailyRecord(user.uid, newRecord);
                const newTotal = coins + ATTENDANCE_COINS;
                await updateTotalCoins(user.uid, newTotal);
                await addTransaction(user.uid, {
                    type: 'earn',
                    amount: ATTENDANCE_COINS,
                    description: '출석 보상 (하루 로그인)',
                    date: today,
                    createdAt: new Date().toISOString(),
                });
                setTotalCoins(newTotal);
                setTodayRecord(newRecord);
            }
        } catch (error) {
            console.error('[CoinContext] 데이터 로드 실패:', error);
        } finally {
            setLoading(false);
        }
    }, [user, today]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // 선택 날짜 변경 시 해당 날짜 목표 로드
    const setSelectedDate = useCallback(async (date: string) => {
        setSelectedDateState(date);
        if (!user) return;
        try {
            const goals = await getGoalsByDate(user.uid, date);
            setSelectedDateGoals(goals);
        } catch (error) {
            console.error('[CoinContext] 날짜별 목표 로드 실패:', error);
        }
    }, [user]);

    // 선택 날짜 초기 로드
    useEffect(() => {
        if (user) {
            setSelectedDate(selectedDate);
        }
    }, [user]);

    // 목표 추가
    const handleAddGoal = useCallback(async (goalData: Omit<Goal, 'id' | 'createdAt' | 'verified'>): Promise<Goal | null> => {
        if (!user) return null;

        const newGoal = await addGoalDB(user.uid, {
            ...goalData,
            verified: false,
            createdAt: new Date().toISOString(),
        });

        // 상태 업데이트
        if (goalData.date === today) {
            setTodayGoals(prev => [...prev, newGoal]);
        }
        if (goalData.date === selectedDate) {
            setSelectedDateGoals(prev => [...prev, newGoal]);
        }
        setAllGoals(prev => [...prev, newGoal]);

        return newGoal;
    }, [user, today, selectedDate]);

    // 목표 삭제
    const handleRemoveGoal = useCallback(async (goalId: string) => {
        if (!user) return;
        await deleteGoalDB(user.uid, goalId);
        setTodayGoals(prev => prev.filter(g => g.id !== goalId));
        setSelectedDateGoals(prev => prev.filter(g => g.id !== goalId));
        setAllGoals(prev => prev.filter(g => g.id !== goalId));
    }, [user]);

    // 달성률 입력 + 코인 계산
    const handleVerifyGoal = useCallback(async (goalId: string, percent: number, note?: string) => {
        if (!user) return;

        // 목표 업데이트
        await updateGoalDB(user.uid, goalId, {
            achievementPercent: percent,
            verified: true,
            verifyNote: note || '',
        });

        // 로컬 상태 업데이트
        const updateGoalState = (goals: Goal[]) =>
            goals.map(g => g.id === goalId ? { ...g, achievementPercent: percent, verified: true, verifyNote: note || '' } : g);

        const updatedTodayGoals = updateGoalState(todayGoals);
        setTodayGoals(updatedTodayGoals);
        setSelectedDateGoals(prev => updateGoalState(prev));
        setAllGoals(prev => updateGoalState(prev));

        // 코인 재계산 (오늘 목표만)
        if (todayGoals.some(g => g.id === goalId)) {
            const coinResult = calculateDailyCoins(updatedTodayGoals);
            const newRecord: DailyRecord = {
                date: today,
                ...coinResult,
                loginRecorded: true,
            };
            await saveDailyRecord(user.uid, newRecord);
            setTodayRecord(newRecord);

            // 코인 잔액 업데이트 (이전 기록과의 차이만큼)
            const prevTotal = todayRecord?.totalCoins || ATTENDANCE_COINS;
            const diff = coinResult.totalCoins - prevTotal;
            if (diff !== 0) {
                const newTotalCoins = totalCoins + diff;
                await updateTotalCoins(user.uid, newTotalCoins);
                setTotalCoins(newTotalCoins);

                if (diff > 0) {
                    await addTransaction(user.uid, {
                        type: 'earn',
                        amount: diff,
                        description: `목표 달성 보상`,
                        date: today,
                        createdAt: new Date().toISOString(),
                    });
                }
            }
        }
    }, [user, todayGoals, todayRecord, totalCoins, today]);

    // 상점 구매
    const handlePurchase = useCallback(async (itemName: string, price: number): Promise<boolean> => {
        if (!user || totalCoins < price) return false;

        const newTotal = totalCoins - price;
        await updateTotalCoins(user.uid, newTotal);
        await addTransaction(user.uid, {
            type: 'spend',
            amount: price,
            description: `상점 구매: ${itemName}`,
            date: today,
            createdAt: new Date().toISOString(),
        });

        setTotalCoins(newTotal);
        setTransactions(prev => [{
            id: crypto.randomUUID(),
            type: 'spend',
            amount: price,
            description: `상점 구매: ${itemName}`,
            date: today,
            createdAt: new Date().toISOString(),
        }, ...prev]);

        return true;
    }, [user, totalCoins, today]);

    return (
        <CoinContext.Provider
            value={{
                totalCoins,
                todayGoals,
                selectedDateGoals,
                allGoals,
                todayRecord,
                transactions,
                loading,
                selectedDate,
                setSelectedDate,
                addGoal: handleAddGoal,
                removeGoal: handleRemoveGoal,
                verifyGoal: handleVerifyGoal,
                purchaseItem: handlePurchase,
                refresh: loadData,
            }}
        >
            {children}
        </CoinContext.Provider>
    );
}

// ============================================================
// Hook
// ============================================================

export function useCoin(): CoinContextType {
    const context = useContext(CoinContext);
    if (context === undefined) {
        throw new Error('useCoin must be used within a CoinProvider');
    }
    return context;
}
