import { processPayment } from "../services/paymentService";
import { Invoice } from "../models/types";
import { InvoiceStatus, PaymentMethod } from "../models/enums";

function makeInvoice(total: number, outstanding: number): Invoice {
  return {
    id: "inv-001",
    invoiceNumber: "INV-001",
    invoiceDate: new Date(),
    items: [],
    totalAmount: total,
    totalTax: 0,
    outstandingAmount: outstanding,
    status: InvoiceStatus.OPEN,
  };
}

describe("Scenario 2: Payment Processing", () => {
  test("should handle multiple payments and overpayment", () => {
    const invoice = makeInvoice(1000.00, 1000.0);

    processPayment(invoice, 300.00, PaymentMethod.CASH);
    expect(invoice.outstandingAmount.toFixed(2)).toBe("700.00");
    expect(invoice.status).toBe(InvoiceStatus.OPEN);

    processPayment(invoice, 750.00, PaymentMethod.BANK_TRANSFER);
    expect(invoice.outstandingAmount.toFixed(2)).toBe("-50.00");
    expect(invoice.status).toBe(InvoiceStatus.OVERPAID);
  });
});