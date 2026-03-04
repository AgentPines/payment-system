import { generateReceipt } from "../services/receiptService";
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

describe("generateReceipt", () => {

  test("should generate receipt with correct payment info", () => {
    const invoice = makeInvoice(1000.0, 1000.0);

    const payment = processPayment(invoice, 300.0, PaymentMethod.CARD);

    const receipt = generateReceipt(payment, invoice);

    expect(receipt.paymentId).toBe(payment.id);
    expect(receipt.totalPaid.toFixed(2)).toBe("300.00");
    expect(receipt.remainingBalance.toFixed(2)).toBe("700.00");
  });

  test("should generate receipt with negative remaining balance for overpayment", () => {
    const invoice = makeInvoice(100.0, 100.0);

    const payment = processPayment(invoice, 150.0, PaymentMethod.CASH);

    const receipt = generateReceipt(payment, invoice);

    expect(receipt.totalPaid.toFixed(2)).toBe("150.00");
    expect(receipt.remainingBalance.toFixed(2)).toBe("-50.00");
  });

  test("receipt should contain generated ids and dates", () => {
    const invoice = makeInvoice(200.0, 200.0);

    const payment = processPayment(invoice, 50.0, PaymentMethod.BANK_TRANSFER);

    const receipt = generateReceipt(payment, invoice);

    expect(receipt.id).toBeDefined();
    expect(receipt.receiptNumber).toBeDefined();
    expect(receipt.receiptDate).toBeInstanceOf(Date);
  });

});