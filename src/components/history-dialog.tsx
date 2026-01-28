'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type HistoryEntry = {
  id: number;
  timestamp: Date;
  type: 'budget_change' | 'item_add' | 'purchase';
  amount: number | null;
  description: string;
};

export function HistoryDialog({ children, wishlistId, currency }: { children: React.ReactNode; wishlistId?: number; currency: string }) {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadHistory();
    }
  }, [open]);

  async function loadHistory() {
    setLoading(true);
    try {
      const url = wishlistId ? `/api/history?wishlistId=${wishlistId}` : '/api/history';
      const response = await fetch(url);
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(date: Date) {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function getActionLabel(type: string) {
    switch (type) {
      case 'budget_change':
        return 'Budget Updated';
      case 'item_add':
        return 'Item Added';
      case 'purchase':
        return 'Item Purchased';
      default:
        return type;
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90vw] max-w-[95vw] h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Activity History</DialogTitle>
          <DialogDescription>
            View all budget changes, item additions, and purchases.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-auto border rounded-xl bg-slate-50/50">
          {loading ? (
            <div className="flex justify-center py-8">
              <p className="text-slate-500">Loading history...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500">No activity yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                <TableRow>
                  <TableHead className="w-[180px]">Date</TableHead>
                  <TableHead className="w-[150px]">Action</TableHead>
                  <TableHead className="w-[120px]">Amount</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(entry.timestamp)}
                    </TableCell>
                    <TableCell>
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {getActionLabel(entry.type)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {entry.amount !== null ? (
                        <span className="font-medium">
                          {currency}{entry.amount.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </TableCell>
                    <TableCell>{entry.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
