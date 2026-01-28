'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, DollarSign, Undo2 } from 'lucide-react';

type UnpurchaseConfirmationDialogProps = {
  item: {
    name: string;
    price: number;
  };
  currency: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (addBackToBudget: boolean) => void;
  loading: boolean;
};

export function UnpurchaseConfirmationDialog({
  item,
  currency,
  open,
  onOpenChange,
  onConfirm,
  loading,
}: UnpurchaseConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Undo2 className="h-5 w-5 text-orange-500" />
            Unpurchase Item
          </DialogTitle>
          <DialogDescription>
            Mark this item as unpurchased and optionally add the amount back to budget.
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
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-slate-600">
              Would you like to add this amount back to your budget?
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={() => onConfirm(true)}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center gap-2"
            >
              <DollarSign className="h-4 w-4" />
              {loading ? 'Processing...' : 'Unpurchase & Add Back to Budget'}
            </Button>
            <Button
              onClick={() => onConfirm(false)}
              disabled={loading}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <X className="h-4 w-4" />
              {loading ? 'Processing...' : 'Unpurchase Only (Keep Budget)'}
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
