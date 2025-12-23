-- Таблица для отслеживания платежей
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id TEXT NOT NULL UNIQUE, -- ID платежа от ЮKassa
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('course', 'subscription')),
  item_id TEXT, -- course_id или plan name
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'cancelled')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Индексы для быстрого поиска
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_payment_id ON public.payments(payment_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_created_at ON public.payments(created_at DESC);

-- RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Пользователи видят только свои платежи
CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

-- Админы видят все платежи
CREATE POLICY "Admins can view all payments"
  ON public.payments FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Вставка только через service role (webhook)
CREATE POLICY "Service can insert payments"
  ON public.payments FOR INSERT
  WITH CHECK (true);

-- Обновление только через service role (webhook)
CREATE POLICY "Service can update payments"
  ON public.payments FOR UPDATE
  USING (true);

-- Триггер обновления updated_at
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Уникальный индекс для course_purchases
CREATE UNIQUE INDEX IF NOT EXISTS idx_course_purchases_unique 
  ON public.course_purchases(user_id, course_id);