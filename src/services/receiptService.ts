import { Invoice, Payment, Receipt } from "../models/types"

function newId(prefix: string): string {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1_000_000)

  return `${prefix}-${timestamp}-${random}`
}

/**
 * Generates a receipt for a completed payment.
 *
 * The receipt records the payment amount and the remaining invoice balance
 * after the payment has been applied.
 *
 * @param payment The payment that was processed.
 * @param invoice The invoice associated with the payment.
 *
 * @returns A Receipt object containing payment and balance information.
 *
 * @throws Error if the payment or invoice is invalid.
 */
export function generateReceipt(
  payment: Payment,
  invoice: Invoice
): Receipt {

  if (!payment) {
    throw new Error("Payment is required")
  }

  if (!invoice) {
    throw new Error("Invoice is required")
  }

  const receipt: Receipt = {
    id: newId("rcpt"),
    paymentId: payment.id,
    receiptNumber: newId("RCPT"),
    receiptDate: new Date(),
    totalPaid: payment.amount,
    remainingBalance: invoice.outstandingAmount
  }

  return receipt
}