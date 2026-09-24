-- Issue 3: índices compuestos para balance/historial de a pares + CHECK de monto positivo.
CREATE INDEX "transactions_status_debtor_creditor_idx" ON "transactions"("status", "debtorId", "creditorId");
CREATE INDEX "transactions_status_creditor_debtor_idx" ON "transactions"("status", "creditorId", "debtorId");
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_amount_positive" CHECK ("amount" > 0);