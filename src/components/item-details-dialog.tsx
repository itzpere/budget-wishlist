'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, X, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { EditItemDialog } from './edit-item-dialog';
import { PurchaseConfirmationDialog } from './purchase-confirmation-dialog';
import { UnpurchaseConfirmationDialog } from './unpurchase-confirmation-dialog';
import { DeleteItemDialog } from './delete-item-dialog';

type ItemDetailsDialogProps = {
  item: {
    id: number;
    name: string;
    description?: string | null;
    price: number;
    status: 'pending' | 'purchased';
    priority: number;
    link?: string | null;
    imageUrl?: string | null;
    localIconPath?: string | null;
  };
  wishlistSavings: number;
  currency: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ItemDetailsDialog({ 
  item, 
  wishlistSavings, 
  currency,
  open, 
  onOpenChange 
}: ItemDetailsDialogProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [unpurchaseDialogOpen, setUnpurchaseDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [localImageError, setLocalImageError] = useState(false);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleted = () => {
    onOpenChange(false);
  };

  const handlePurchaseClick = () => {
    setPurchaseDialogOpen(true);
  };

  const handleUnpurchaseClick = () => {
    setUnpurchaseDialogOpen(true);
  };

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{item.name}</DialogTitle>
            <DialogDescription>
              {item.status === 'purchased' ? (
                <span className="inline-flex items-center gap-1.5 text-green-600 font-medium">
                  <Check className="h-4 w-4" />
                  Purchased
                </span>
              ) : (
                <span className="text-slate-500">Pending purchase</span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Item Image */}
            {((item.imageUrl && !imageError) || (item.localIconPath && !localImageError)) && (
              <div className="flex justify-center">
                <img
                  src={
                    (item.imageUrl && !imageError) 
                      ? item.imageUrl 
                      : item.localIconPath || ''
                  }
                  alt={item.name}
                  className="max-h-80 w-auto rounded-lg object-contain"
                  onError={() => {
                    if (item.imageUrl && !imageError) {
                      setImageError(true);
                    } else if (item.localIconPath && !localImageError) {
                      setLocalImageError(true);
                    }
                  }}
                />
              </div>
            )}

            {/* Description */}
            {item.description && (
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-slate-700">{item.description}</p>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <span className="text-slate-600 font-medium">Price</span>
              <span className="text-2xl font-bold text-purple-400">
                {currency}{item.price.toFixed(2)}
              </span>
            </div>

            {/* Link */}
            {item.link && (
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <span className="text-slate-600 font-medium">Link</span>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-500 flex items-center gap-1 font-medium"
                >
                  Open
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}

            {/* Priority */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <span className="text-slate-600 font-medium">Priority</span>
              <span className="text-slate-700 font-semibold">{item.priority}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-4">
              {item.status !== 'purchased' ? (
                <Button
                  onClick={handlePurchaseClick}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Purchase
                </Button>
              ) : (
                <Button
                  onClick={handleUnpurchaseClick}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                >
                  <X className="h-4 w-4 mr-2" />
                  Unpurchase
                </Button>
              )}
              <Button
                onClick={handleEditClick}
                variant="outline"
                className="flex-1 border-purple-400 text-purple-400 hover:bg-purple-50"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                onClick={handleDeleteClick}
                variant="outline"
                className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Nested Dialogs */}
      <EditItemDialog
        item={item}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <PurchaseConfirmationDialog
        item={{
          name: item.name,
          price: item.price,
        }}
        availableBudget={wishlistSavings}
        currency={currency}
        open={purchaseDialogOpen}
        onOpenChange={setPurchaseDialogOpen}
        onConfirm={async (deductFromBudget) => {
          const { purchaseItem } = await import('@/app/actions');
          await purchaseItem(item.id, deductFromBudget);
          setPurchaseDialogOpen(false);
          onOpenChange(false);
        }}
        loading={false}
      />

      <UnpurchaseConfirmationDialog
        item={{
          name: item.name,
          price: item.price,
        }}
        currency={currency}
        open={unpurchaseDialogOpen}
        onOpenChange={setUnpurchaseDialogOpen}
        onConfirm={async (addBackToBudget) => {
          const { unpurchaseItem } = await import('@/app/actions');
          await unpurchaseItem(item.id, addBackToBudget);
          setUnpurchaseDialogOpen(false);
          onOpenChange(false);
        }}
        loading={false}
      />

      <DeleteItemDialog
        item={{
          id: item.id,
          name: item.name,
        }}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDeleted={handleDeleted}
      />
    </>
  );
}
