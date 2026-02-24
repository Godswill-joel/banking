// lib/hooks/useWallets.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, collection, runTransaction } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export const useFundWallet = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      walletId, 
      userId, 
      amount, 
      description, 
      adminId 
    }: FundWalletParams) => {
      await runTransaction(db, async (transaction) => {
        const walletRef = doc(db, 'wallets', walletId);
        const walletDoc = await transaction.get(walletRef);
        
        if (!walletDoc.exists()) throw new Error('Wallet not found');
        
        const currentBalance = walletDoc.data().balance;
        const newBalance = currentBalance + amount;
        
        // Update wallet
        transaction.update(walletRef, {
          balance: newBalance,
          updatedAt: new Date(),
        });
        
        // Create transaction record
        const transactionRef = doc(collection(db, 'transactions'));
        transaction.set(transactionRef, {
          walletId,
          userId,
          type: 'credit',
          amount,
          balanceBefore: currentBalance,
          balanceAfter: newBalance,
          description,
          status: 'completed',
          performedBy: adminId,
          createdAt: new Date(),
        });
        
        // Log admin action
        const logRef = doc(collection(db, 'admin_logs'));
        transaction.set(logRef, {
          adminId,
          action: 'fund_wallet',
          targetType: 'wallet',
          targetId: walletId,
          changes: { amount, description },
          timestamp: new Date(),
        });
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};