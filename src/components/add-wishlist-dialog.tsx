'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addWishlist } from '@/app/actions';

export function AddWishlistDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    await addWishlist(formData);
    
    setLoading(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">Add New Wishlist</DialogTitle>
          <DialogDescription className="text-slate-500">
            Create a new wishlist with a budget limit.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-700 font-medium">Wishlist Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., Tech Gadgets"
              className="border-slate-300 focus:border-purple-400 focus:ring-purple-400 placeholder:text-gray-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-700 font-medium">Description (optional)</Label>
            <Input
              id="description"
              name="description"
              placeholder="e.g., Electronics and gadgets I want"
              className="border-slate-300 focus:border-purple-400 focus:ring-purple-400 placeholder:text-gray-500"
            />
          </div>
            <div className="space-y-2">
            <Label htmlFor="budgetLimit" className="text-slate-700 font-medium">Budget Limit</Label>
            <Input
              id="budgetLimit"
              name="budgetLimit"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              defaultValue="0.00"
              className="border-slate-300 focus:border-purple-400 focus:ring-purple-400 placeholder:text-gray-500"
            />
            </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-slate-300">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-purple-400 hover:bg-purple-500 text-white transition-colors">
              {loading ? 'Adding...' : 'Add Wishlist'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
