import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreditCard, Smartphone, Check } from "lucide-react";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planName: string;
  price: string;
  period: string;
}

const PaymentModal = ({ open, onOpenChange, planName, price, period }: PaymentModalProps) => {
  const [selectedPayment, setSelectedPayment] = useState<"card" | "sbp">("card");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center font-display text-xl">
            Оплата тарифа "{planName}"
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center py-4">
          <div className="text-3xl font-display font-semibold text-foreground mb-1">
            {price} ₽
          </div>
          <p className="text-sm text-muted-foreground">{period}</p>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-sm font-medium text-foreground">Способ оплаты:</p>
          
          <button
            onClick={() => setSelectedPayment("card")}
            className={`w-full p-4 rounded-xl border transition-all flex items-center gap-3 ${
              selectedPayment === "card"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <CreditCard className={`w-5 h-5 ${selectedPayment === "card" ? "text-primary" : "text-muted-foreground"}`} />
            <div className="text-left">
              <p className="font-medium text-foreground">Банковская карта</p>
              <p className="text-xs text-muted-foreground">Visa, MasterCard, МИР</p>
            </div>
            {selectedPayment === "card" && (
              <Check className="w-5 h-5 text-primary ml-auto" />
            )}
          </button>
          
          <button
            onClick={() => setSelectedPayment("sbp")}
            className={`w-full p-4 rounded-xl border transition-all flex items-center gap-3 ${
              selectedPayment === "sbp"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <Smartphone className={`w-5 h-5 ${selectedPayment === "sbp" ? "text-primary" : "text-muted-foreground"}`} />
            <div className="text-left">
              <p className="font-medium text-foreground">СБП</p>
              <p className="text-xs text-muted-foreground">Система быстрых платежей</p>
            </div>
            {selectedPayment === "sbp" && (
              <Check className="w-5 h-5 text-primary ml-auto" />
            )}
          </button>
        </div>
        
        <Button variant="hero" size="lg" className="w-full mb-3">
          Оплатить через ЮKassa
        </Button>
        
        <p className="text-xs text-center text-muted-foreground">
          Безопасная оплата через ЮKassa
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
