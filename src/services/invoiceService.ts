import { InvoiceItem } from "../models/types"
import { dollarsToCents, centsToDollars } from "../utils/money"

export type InvoiceTotals = {
  subtotal: number
  tax: number
  total: number
}

/**
 * Calculates invoice subtotal, tax and total.
 *
 * @param items List of invoice items containing quantity and unit price in dollars.
 * @param taxRate Tax rate expressed as a decimal (e.g. 0.07 for 7%).
 *
 * @returns InvoiceTotals containing subtotal, tax and total in dollars.
 *
 * Monetary calculations are performed using cents internally
 * to avoid floating point precision issues.
 */
export function calculateInvoiceTotal(
  items: Array<Pick<InvoiceItem, "quantity" | "unitPrice">>,
  taxRate: number
): InvoiceTotals {

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Invoice must contain at least one item")
  }

  if (!Number.isFinite(taxRate) || taxRate < 0) {
    throw new Error("Tax rate must be a non-negative number")
  }

  let subtotalCents = 0

  for (const item of items) {

    if (!Number.isFinite(item.quantity) || item.quantity < 0) {
      throw new Error("Item quantity must be a non-negative number")
    }

    if (!Number.isFinite(item.unitPrice) || item.unitPrice < 0) {
      throw new Error("Item unit price must be a non-negative number")
    }

    // Convert to cents to avoid floating point precision issues
    const unitPriceCents = dollarsToCents(item.unitPrice)

    const lineTotalCents = unitPriceCents * item.quantity

    subtotalCents += lineTotalCents
  }

  const taxCents = Math.round(subtotalCents * taxRate)

  const totalCents = subtotalCents + taxCents

  return {
    subtotal: centsToDollars(subtotalCents),
    tax: centsToDollars(taxCents),
    total: centsToDollars(totalCents)
  }
}