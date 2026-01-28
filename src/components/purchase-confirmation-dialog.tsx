'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, DollarSign, AlertTriangle } from 'lucide-react';

type PurchaseConfirmationDialogProps = {
  item: {
    name: string;
    price: number;
  };
  availableBudget: number;
  currency: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (deductFromBudget: boolean) => void;
  loading: boolean;
};

export function PurchaseConfirmationDialog({
  item,
  availableBudget,
  currency,
  open,
  onOpenChange,
  onConfirm,
  loading,
}: PurchaseConfirmationDialogProps) {
  const hasEnoughBudget = availableBudget >= item.price;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            Purchase Item
          </DialogTitle>
          <DialogDescription>
            Mark this item as purchased and optionally deduct from budget.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-slate-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Item:</span>
              <span className="font-semibold text-slate-900">{item.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Price:</span>
              <span className="font-bold text-lg text-slate-900">{currency}{item.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Available Budget:</span>
              <span className={`font-bold ${hasEnoughBudget ? 'text-green-600' : 'text-red-600'}`}>
                {currency}{availableBudget.toFixed(2)}
              </span>
            </div>
          </div>
          
          {!hasEnoughBudget && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-900 mb-1">Insufficient Budget</p>
                <p className="text-sm text-red-700">
                  You don't have enough budget for this item. You're short by {currency}{(item.price - availableBudget).toFixed(2)}.
                </p>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <p className="text-sm text-slate-600">
              Would you like to deduct this amount from your budget?
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={() => onConfirm(true)}
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2"
            >
              <DollarSign className="h-4 w-4" />
              {loading ? 'Processing...' : 'Purchase & Deduct from Budget'}
            </Button>
            <Button
              onClick={() => onConfirm(false)}
              disabled={loading}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <Check className="h-4 w-4" />
              {loading ? 'Processing...' : 'Purchase Only (Keep Budget)'}
            </Button>
            <Button
              onClick={() => onOpenChange(false)}
              disabled={loading}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
