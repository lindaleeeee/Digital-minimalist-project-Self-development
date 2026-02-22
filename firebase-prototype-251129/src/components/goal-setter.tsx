'use client';

/**
 * @file goal-setter.tsx
 * @description 목표 설정 폼 — 우선순위/Studymate/타이머 + Verify 프로세스
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { useCoin } from '@/lib/coin-context';
import { useToast } from '@/hooks/use-toast';
import {
    type GoalPriority,
    type Studymate,
    type Goal,
    PRIORITY_LABELS,
    PRIORITY_COLORS,
    STUDYMATE_LABELS,
    MAX_URGENT_GOALS_PER_DAY,
} from '@/lib/types';
import {
    Plus,
    Timer,
    AlertTriangle,
    CheckCircle2,
    Camera,
    MessageSquare,
    Bell,
    Target,
    Trash2,
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export function GoalSetter() {
    const { selectedDate, selectedDateGoals, todayGoals, addGoal, removeGoal, verifyGoal } = useCoin();
    const { toast } = useToast();

    // 폼 상태
    const [name, setName] = useState('');
    const [priority, setPriority] = useState<GoalPriority>('medium');
    const [studymate, setStudymate] = useState<Studymate>('mom');
    const [timerMinutes, setTimerMinutes] = useState(30);
    const [isAdding, setIsAdding] = useState(false);

    // Verify 다이얼로그
    const [verifyGoalTarget, setVerifyGoalTarget] = useState<Goal | null>(null);
    const [verifyPercent, setVerifyPercent] = useState(100);
    const [verifyNote, setVerifyNote] = useState('');

    // 타이머
    const [activeTimer, setActiveTimer] = useState<{ goalId: string; endTime: number } | null>(null);
    const [timerRemaining, setTimerRemaining] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // 긴급 목표 개수 체크
    const urgentCount = selectedDateGoals.filter(g => g.priority === 'urgent').length;
    const canAddUrgent = urgentCount < MAX_URGENT_GOALS_PER_DAY;

    // 현재 날짜의 목표 리스트
    const goals = selectedDateGoals;

    // 타이머 업데이트
    useEffect(() => {
        if (activeTimer) {
            timerRef.current = setInterval(() => {
                const remaining = Math.max(0, activeTimer.endTime - Date.now());
                setTimerRemaining(remaining);
                if (remaining <= 0) {
                    clearInterval(timerRef.current!);
                    // Studymate에게 알림 표시
                    const goal = goals.find(g => g.id === activeTimer.goalId);
                    if (goal) {
                        toast({
                            title: `⏰ 타이머 완료!`,
                            description: `"${goal.name}" 시간이 됐습니다! ${STUDYMATE_LABELS[goal.studymate]}에게 Verify를 요청하세요.`,
                        });
                        setVerifyGoalTarget(goal);
                    }
                    setActiveTimer(null);
                }
            }, 1000);
            return () => clearInterval(timerRef.current!);
        }
    }, [activeTimer, goals, toast]);

    // 목표 추가
    const handleAddGoal = async () => {
        if (!name.trim()) {
            toast({ variant: 'destructive', title: '목표 이름을 입력해주세요.' });
            return;
        }
        if (priority === 'urgent' && !canAddUrgent) {
            toast({ variant: 'destructive', title: `긴급 목표는 하루 최대 ${MAX_URGENT_GOALS_PER_DAY}개까지만 설정 가능합니다.` });
            return;
        }

        setIsAdding(true);
        try {
            await addGoal({
                name: name.trim(),
                priority,
                studymate,
                timerMinutes,
                date: selectedDate,
            });
            toast({ title: '목표가 추가되었습니다!' });
            setName('');
        } catch {
            toast({ variant: 'destructive', title: '목표 추가 실패' });
        } finally {
            setIsAdding(false);
        }
    };

    // 타이머 시작
    const startTimer = (goal: Goal) => {
        const endTime = Date.now() + goal.timerMinutes * 60 * 1000;
        setActiveTimer({ goalId: goal.id, endTime });
        toast({ title: `⏱️ "${goal.name}" 타이머 시작 (${goal.timerMinutes}분)` });
    };

    // Verify 완료
    const handleVerify = async () => {
        if (!verifyGoalTarget) return;
        await verifyGoal(verifyGoalTarget.id, verifyPercent, verifyNote);
        toast({ title: `✅ "${verifyGoalTarget.name}" 검증 완료 (${verifyPercent}%)` });
        setVerifyGoalTarget(null);
        setVerifyPercent(100);
        setVerifyNote('');
    };

    // 타이머 포맷
    const formatTimer = (ms: number): string => {
        const totalSecs = Math.floor(ms / 1000);
        const mins = Math.floor(totalSecs / 60);
        const secs = totalSecs % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="space-y-6">
            {/* 활성 타이머 */}
            {activeTimer && (
                <Card className="border-primary/50 bg-primary/5">
                    <CardContent className="pt-6 text-center">
                        <div className="text-4xl font-mono font-bold text-primary mb-2">
                            {formatTimer(timerRemaining)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {goals.find(g => g.id === activeTimer.goalId)?.name} 진행 중...
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3"
                            onClick={() => {
                                const goal = goals.find(g => g.id === activeTimer.goalId);
                                if (goal) setVerifyGoalTarget(goal);
                                setActiveTimer(null);
                            }}
                        >
                            타이머 종료 & Verify
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* 목표 추가 폼 */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        새 목표 추가
                    </CardTitle>
                    <CardDescription>
                        {format(new Date(selectedDate + 'T00:00:00'), 'M월 d일', { locale: ko })} 목표 설정
                        {priority === 'urgent' && (
                            <span className="ml-2 text-yellow-500">
                                (긴급 {urgentCount}/{MAX_URGENT_GOALS_PER_DAY})
                            </span>
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* 목표 이름 */}
                    <div className="space-y-2">
                        <Label>목표 이름</Label>
                        <Input
                            placeholder="예: 수학 문제 풀기"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* 우선순위 */}
                        <div className="space-y-2">
                            <Label>우선순위</Label>
                            <Select value={priority} onValueChange={(v) => setPriority(v as GoalPriority)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="urgent">
                                        <span className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PRIORITY_COLORS.urgent }} />
                                            긴급
                                        </span>
                                    </SelectItem>
                                    <SelectItem value="medium">
                                        <span className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PRIORITY_COLORS.medium }} />
                                            중급
                                        </span>
                                    </SelectItem>
                                    <SelectItem value="habit">
                                        <span className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PRIORITY_COLORS.habit }} />
                                            습관만들기
                                        </span>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Studymate */}
                        <div className="space-y-2">
                            <Label>Studymate</Label>
                            <Select value={studymate} onValueChange={(v) => setStudymate(v as Studymate)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="mom">👩 엄마</SelectItem>
                                    <SelectItem value="dad">👨 아빠</SelectItem>
                                    <SelectItem value="sibling">👦 동생</SelectItem>
                                    <SelectItem value="friend">🧑‍🤝‍🧑 친구</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* 타이머 시간 */}
                    <div className="space-y-2">
                        <Label>목표 시간: {timerMinutes}분</Label>
                        <Slider
                            value={[timerMinutes]}
                            onValueChange={([v]) => setTimerMinutes(v)}
                            min={5}
                            max={180}
                            step={5}
                        />
                    </div>

                    <Button onClick={handleAddGoal} disabled={isAdding} className="w-full">
                        {isAdding ? '추가 중...' : '목표 추가'}
                    </Button>
                </CardContent>
            </Card>

            {/* 오늘의 목표 목록 */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        설정된 목표 ({goals.length}개)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {goals.length === 0 ? (
                        <p className="text-center text-muted-foreground py-6 text-sm">
                            목표를 추가해주세요.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {goals.map(goal => (
                                <div
                                    key={goal.id}
                                    className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-3 h-3 rounded-full shrink-0 mt-0.5"
                                                style={{ backgroundColor: PRIORITY_COLORS[goal.priority] }}
                                            />
                                            <div>
                                                <div className="font-medium">{goal.name}</div>
                                                <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                                                    <Badge variant="outline" className="text-xs px-1.5 py-0">
                                                        {PRIORITY_LABELS[goal.priority]}
                                                    </Badge>
                                                    <span>·</span>
                                                    <span>{STUDYMATE_LABELS[goal.studymate]}</span>
                                                    <span>·</span>
                                                    <span>{goal.timerMinutes}분</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-muted-foreground hover:text-red-400"
                                            onClick={() => removeGoal(goal.id)}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>

                                    {/* 액션 버튼 */}
                                    <div className="flex items-center gap-2">
                                        {goal.verified ? (
                                            <div className="flex items-center gap-2 text-sm">
                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                <span className="text-green-500 font-medium">달성률: {goal.achievementPercent}%</span>
                                            </div>
                                        ) : (
                                            <>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-1 text-xs"
                                                    onClick={() => startTimer(goal)}
                                                    disabled={!!activeTimer}
                                                >
                                                    <Timer className="w-3.5 h-3.5" />
                                                    타이머 시작
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-1 text-xs"
                                                    onClick={() => setVerifyGoalTarget(goal)}
                                                >
                                                    <Bell className="w-3.5 h-3.5" />
                                                    Verify 요청
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Verify 다이얼로그 */}
            <Dialog open={!!verifyGoalTarget} onOpenChange={() => setVerifyGoalTarget(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                            Verify 요청
                        </DialogTitle>
                        <DialogDescription>
                            {verifyGoalTarget && (
                                <>
                                    <strong>{STUDYMATE_LABELS[verifyGoalTarget.studymate]}</strong>에게
                                    "{verifyGoalTarget.name}" 목표 달성을 검증해주세요.
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* 알림 UI */}
                        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
                            <Bell className="w-8 h-8 text-primary mx-auto mb-2" />
                            <p className="text-sm font-medium">
                                {verifyGoalTarget && STUDYMATE_LABELS[verifyGoalTarget.studymate]}에게 알림을 보냈습니다!
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                사진 찍기 또는 메모로 확인해주세요
                            </p>
                        </div>

                        {/* 사진/메모 버튼 */}
                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" className="gap-2 h-12">
                                <Camera className="w-4 h-4" />
                                사진 찍기
                            </Button>
                            <Button variant="outline" className="gap-2 h-12">
                                <MessageSquare className="w-4 h-4" />
                                메모 작성
                            </Button>
                        </div>

                        {/* 메모 입력 */}
                        <div className="space-y-2">
                            <Label>메모 (선택)</Label>
                            <Textarea
                                placeholder="달성 내용을 간단히 적어주세요..."
                                value={verifyNote}
                                onChange={(e) => setVerifyNote(e.target.value)}
                                rows={2}
                            />
                        </div>

                        {/* 달성률 슬라이더 */}
                        <div className="space-y-3">
                            <Label className="flex items-center justify-between">
                                <span>달성률</span>
                                <span className="text-2xl font-bold text-primary">{verifyPercent}%</span>
                            </Label>
                            <Slider
                                value={[verifyPercent]}
                                onValueChange={([v]) => setVerifyPercent(v)}
                                min={0}
                                max={100}
                                step={5}
                            />
                            <Progress value={verifyPercent} className="h-3" />
                        </div>

                        {/* Verify 버튼 */}
                        <Button onClick={handleVerify} className="w-full h-12 text-lg font-bold">
                            ✅ Verify 완료
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
