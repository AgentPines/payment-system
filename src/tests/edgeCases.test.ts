import { calculateInvoiceTotal } from "../services/invoiceService";
import { processPayment } from "../services/paymentService";
import { Invoice } from "../models/types";
import { InvoiceStatus, PaymentMethod } from "../models/enums";

function makeInvoice(total: number, outstanding: number): Invoice {
  return {
    id: "inv-edge",
    invoiceNumber: "INV-EDGE",
    invoiceDate: new Date(),
    items: [],
    totalAmount: total,
    totalTax: 0,
    outstandingAmount: outstanding,
    status: InvoiceStatus.OPEN,
  };
}

describe("Scenario 3: Edge Cases", () => {
  test("zero-amount invoice should return all zeros", () => {
    const items = [{ quantity: 0, unitPrice: 0 }];
    const result = calculateInvoiceTotal(items, 0.07);

    expect(result.subtotal.toFixed(2)).toBe("0.00");
    expect(result.tax.toFixed(2)).toBe("0.00");
    expect(result.total.toFixed(2)).toBe("0.00");
  });

  test("negative amounts should throw (invoice)", () => {
    expect(() =>
      calculateInvoiceTotal([{ quantity: 1, unitPrice: -1 }], 0.07)
    ).toThrow("Item unit price must be a non-negative number");

    expect(() =>
      calculateInvoiceTotal([{ quantity: -1, unitPrice: 1 }], 0.07)
    ).toThrow("Item quantity must be a non-negative number");
  });

  test("very large amounts should still compute correctly (sanity)", () => {
    const items = [{ quantity: 1_000_000, unitPrice: 9999.99 }];
    const result = calculateInvoiceTotal(items, 0.07);

    // Totals should be finite numbers
    expect(Number.isFinite(result.subtotal)).toBe(true);
    expect(Number.isFinite(result.tax)).toBe(true);
    expect(Number.isFinite(result.total)).toBe(true);
  });

  test("multiple payments for same invoice should keep updating outstanding", () => {
    const invoice = makeInvoice(100.0, 100.0);

    processPayment(invoice, 30.0, PaymentMethod.CARD);
    expect(invoice.outstandingAmount.toFixed(2)).toBe("70.00");

    processPayment(invoice, 30.0, PaymentMethod.CARD);
    expect(invoice.outstandingAmount.toFixed(2)).toBe("40.00");

    processPayment(invoice, 40.0, PaymentMethod.CARD);
    expect(invoice.outstandingAmount.toFixed(2)).toBe("0.00");
    expect(invoice.status).toBe(InvoiceStatus.PAID);
  });

  test("negative/zero payment should throw", () => {
    const invoice = makeInvoice(100.0, 100.0);

    expect(() => processPayment(invoice, 0, PaymentMethod.CASH)).toThrow(
      "Payment amount must be a positive number"
    );

    expect(() => processPayment(invoice, -10, PaymentMethod.CASH)).toThrow(
      "Payment amount must be a positive number"
    );
  });
});