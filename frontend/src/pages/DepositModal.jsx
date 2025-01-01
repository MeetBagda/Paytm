import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusIcon } from 'lucide-react'

export function DepositModal({ isOpen, onClose, onDeposit }) {
  async function handleSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    const amount = parseFloat(form.amount.value)
    if (amount > 0) {
      await onDeposit(amount)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deposit Money</DialogTitle>
          <DialogDescription>
            Enter the amount you want to deposit into your account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (in ₹)</Label>
            <div className="relative">
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="Enter amount"
                className="pl-8"
                min="1"
                step="0.01"
                required
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                ₹
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <PlusIcon className="mr-2 h-4 w-4" />
              Deposit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}