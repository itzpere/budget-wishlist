'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { deleteWishlist } from '@/app/actions';
import { AlertTriangle } from 'lucide-react';

type DeleteWishlistDialogProps = {
  children: React.ReactNode;
  wishlist: {
    id: number;
    name: string;
  };
};

export function DeleteWishlistDialog({ children, wishlist }: DeleteWishlistDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmationName, setConfirmationName] = useState('');

  const isConfirmationValid = confirmationName.trim().toLowerCase() === wishlist.name.trim().toLowerCase();

  async function handleDelete() {
    if (!isConfirmationValid) return;
    
    setLoading(true);
    try {
      await deleteWishlist(wishlist.id);
      setOpen(false);
      setConfirmationName('');
    } catch (error) {
      console.error('Failed to delete wishlist:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) {
        setConfirmationName('');
      }
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-6 w-6" />
            Delete Wishlist
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the wishlist and all its items.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Warning Box */}
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h4 className="font-bold text-red-900 text-lg mb-2">Warning: This is permanent!</h4>
                <ul className="space-y-1 text-sm text-red-800">
                  <li>• The wishlist "{wishlist.name}" will be permanently deleted</li>
                  <li>• All items in this wishlist will be removed</li>
                  <li>• All history related to this wishlist will remain</li>
                  <li>• This action cannot be undone</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Confirmation Input */}
          <div className="space-y-3">
            <Label htmlFor="confirmName" className="text-slate-700 font-medium italic">
              Please type <span className="font-bold text-rose-600">"{wishlist.name}"</span> to confirm:
            </Label>
            <Input
              id="confirmName"
              value={confirmationName}
              onChange={(e) => setConfirmationName(e.target.value)}
              placeholder={`Type "${wishlist.name}" here`}
              className="font-mono border-slate-300 focus:border-rose-400 focus:ring-rose-400 placeholder:text-gray-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="border-slate-300"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={loading || !isConfirmationValid}
              className="bg-rose-600 hover:bg-rose-700"
            >
              {loading ? 'Deleting...' : 'Permanently Delete'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
