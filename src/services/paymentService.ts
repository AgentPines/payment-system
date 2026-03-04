import { Invoice, Payment } from "../models/types"
import { InvoiceStatus, PaymentMethod, PaymentStatus } from "../models/enums"
import { dollarsToCents, centsToDollars } from "../utils/money"

function newId(prefix: string): string {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1_000_000)

  return `${prefix}-${timestamp}-${random}`
}

/**
 * Applies a payment to an invoice and updates its outstanding balance.
 *
 * Monetary values are provided in dollars, but calculations are performed
 * internally in cents to avoid floating point precision issues.
 *
 * @param invoice The invoice to which the payment will be applied.
 * @param paymentAmount The payment amount in dollars.
 * @param paymentMethod The method used for the payment (e.g., card, cash, bank transfer).
 *
 * @returns A Payment object representing the processed payment.
 *
 * @throws Error if the payment amount is invalid or the invoice data is inconsistent.
 */
export function processPayment(
  invoice: Invoice,
  paymentAmount: number,
  paymentMethod: PaymentMethod
): Payment {

  if (!invoice) {
    throw new Error("Invoice is required")
  }

  if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
    throw new Error("Payment amount must be a positive number")
  }

  const outstandingCents = dollarsToCents(invoice.outstandingAmount)
  const paymentCents = dollarsToCents(paymentAmount)

  const newOutstandingCents = outstandingCents - paymentCents

  // Update invoice outstanding balance
  invoice.outstandingAmount = centsToDollars(newOutstandingCents)

  // Update invoice status
  if (newOutstandingCents === 0) {
    invoice.status = InvoiceStatus.PAID
  } else if (newOutstandingCents < 0) {
    invoice.status = InvoiceStatus.OVERPAID
  } else {
    invoice.status = InvoiceStatus.OPEN
  }

  const payment: Payment = {
    id: newId("pay"),
    invoiceId: invoice.id,
    paymentMethod,
    amount: paymentAmount,
    paymentDate: new Date(),
    referenceNumber: newId("ref"),
    status: PaymentStatus.COMPLETED
  }

  return payment
}