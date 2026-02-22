'use client';

/**
 * @file coin-shop.tsx
 * @description Habit Coin 상점 — 코인으로 보상 구매
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useCoin } from '@/lib/coin-context';
import { useToast } from '@/hooks/use-toast';
import { SHOP_ITEMS, type CoinTransaction } from '@/lib/types';
import { ShoppingBag, Coins, TrendingDown, TrendingUp, History } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

export function CoinShop() {
    const { totalCoins, transactions, purchaseItem } = useCoin();
    const { toast } = useToast();
    const [confirmItem, setConfirmItem] = useState<{ name: string; price: number } | null>(null);
    const [isPurchasing, setIsPurchasing] = useState(false);

    const handlePurchase = async () => {
        if (!confirmItem) return;
        setIsPurchasing(true);

        const success = await purchaseItem(confirmItem.name, confirmItem.price);
        if (success) {
            toast({
                title: '🎉 구매 완료!',
                description: `${confirmItem.name}을(를) ${confirmItem.price.toLocaleString()} 코인에 구매했습니다.`,
            });
        } else {
            toast({
                variant: 'destructive',
                title: '코인이 부족합니다',
                description: `${confirmItem.name} 구매에 ${confirmItem.price.toLocaleString()} 코인이 필요합니다.`,
            });
        }

        setConfirmItem(null);
        setIsPurchasing(false);
    };

    return (
        <div className="space-y-6">
            {/* 코인 잔액 카드 */}
            <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">내 코인 잔액</p>
                            <div className="flex items-center gap-2 mt-1">
                                <Coins className="w-8 h-8 text-yellow-500" />
                                <span className="text-4xl font-bold text-yellow-500">
                                    {totalCoins.toLocaleString()}
                                </span>
                            </div>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                            <p>하루 최대 200코인</p>
                            <p>출석 100 + 달성 100</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 상품 그리드 */}
            <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    상점
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {SHOP_ITEMS.map(item => {
                        const canAfford = totalCoins >= item.price;
                        return (
                            <Card
                                key={item.id}
                                className={`transition-all hover:-translate-y-1 ${canAfford
                                        ? 'border-white/10 hover:border-primary/50'
                                        : 'opacity-60 border-white/5'
                                    }`}
                            >
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <div className="text-5xl mb-3">{item.icon}</div>
                                        <h4 className="font-bold text-base">{item.name}</h4>
                                        <p className="text-xs text-muted-foreground mt-1 mb-4">
                                            {item.description}
                                        </p>
                                        <div className="flex items-center justify-center gap-1 mb-4">
                                            <Coins className="w-4 h-4 text-yellow-500" />
                                            <span className="text-xl font-bold text-yellow-500">
                                                {item.price.toLocaleString()}
                                            </span>
                                        </div>
                                        <Button
                                            className="w-full"
                                            disabled={!canAfford}
                                            onClick={() => setConfirmItem({ name: item.name, price: item.price })}
                                        >
                                            {canAfford ? '구매하기' : '코인 부족'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* 거래 내역 */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <History className="w-4 h-4" />
                        거래 내역
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {transactions.length === 0 ? (
                        <p className="text-center text-muted-foreground py-6 text-sm">
                            아직 거래 내역이 없습니다.
                        </p>
                    ) : (
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                            {transactions.slice(0, 20).map((tx, idx) => (
                                <div
                                    key={tx.id || idx}
                                    className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                                >
                                    <div className="flex items-center gap-3">
                                        {tx.type === 'earn' ? (
                                            <TrendingUp className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <TrendingDown className="w-4 h-4 text-red-500" />
                                        )}
                                        <div>
                                            <div className="text-sm font-medium">{tx.description}</div>
                                            <div className="text-xs text-muted-foreground">{tx.date}</div>
                                        </div>
                                    </div>
                                    <Badge
                                        variant={tx.type === 'earn' ? 'secondary' : 'destructive'}
                                        className="font-mono"
                                    >
                                        {tx.type === 'earn' ? '+' : '-'}{tx.amount.toLocaleString()}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 구매 확인 다이얼로그 */}
            <Dialog open={!!confirmItem} onOpenChange={() => setConfirmItem(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>구매 확인</DialogTitle>
                        <DialogDescription>
                            {confirmItem && (
                                <>
                                    <strong>{confirmItem.name}</strong>을(를){' '}
                                    <strong className="text-yellow-500">{confirmItem.price.toLocaleString()} 코인</strong>에
                                    구매하시겠습니까?
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-3 pt-4">
                        <Button variant="outline" className="flex-1" onClick={() => setConfirmItem(null)}>
                            취소
                        </Button>
                        <Button className="flex-1" onClick={handlePurchase} disabled={isPurchasing}>
                            {isPurchasing ? '구매 중...' : '구매하기'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
