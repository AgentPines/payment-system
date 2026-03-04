import { calculateInvoiceTotal } from "./services/invoiceService";
import { processPayment } from "./services/paymentService";
import { generateReceipt } from "./services/receiptService";
import { Invoice } from "./models/types";
import { InvoiceStatus, PaymentMethod } from "./models/enums";

function logTitle(title: string) {
  console.log("\n" + "=".repeat(60));
  console.log(title);
  console.log("=".repeat(60));
}

function logJson(label: string, obj: unknown) {
  console.log(`\n${label}:`);
  console.dir(obj, { depth: null });
}

function runScenario1_InvoiceCalculation() {
  logTitle("Scenario 1: Basic Invoice Calculation");

  const items = [
    { quantity: 1, unitPrice: 500.0 }, // Monthly Fee: 500.00
    { quantity: 2, unitPrice: 25.5 },  // Activity Fee: 25.50 * 2
  ];

  const totals = calculateInvoiceTotal(items, 0.07);

  console.log(`SubTotal: ${totals.subtotal.toFixed(2)}`);
  console.log(`Tax: ${totals.tax.toFixed(2)}`);
  console.log(`Total: ${totals.total.toFixed(2)}`);

  return totals;
}

function runScenario2_Payments(initialTotal: number, initialTax: number) {
  logTitle("Scenario 2: Multiple Payments + Overpayment");

  const invoice: Invoice = {
    id: "inv-001",
    invoiceNumber: "INV-001",
    invoiceDate: new Date(),
    items: [],
    totalAmount: initialTotal,
    totalTax: initialTax,
    outstandingAmount: initialTotal,
    status: InvoiceStatus.OPEN,
  };

  logJson("Initial Invoice", invoice);

  // Payment 1: 300.00
  const payment1 = processPayment(invoice, 300.0, PaymentMethod.CASH);
  const receipt1 = generateReceipt(payment1, invoice);

  logJson("PaymentResult 1", payment1);
  logJson("Receipt 1", receipt1);
  console.log(`Outstanding after payment1: ${invoice.outstandingAmount.toFixed(2)}`);
  console.log(`Invoice status: ${invoice.status}`);

  // Payment 2: 750.00 (overpayment)
  const payment2 = processPayment(invoice, 750.0, PaymentMethod.BANK_TRANSFER);
  const receipt2 = generateReceipt(payment2, invoice);

  logJson("PaymentResult 2", payment2);
  logJson("Receipt 2", receipt2);
  console.log(`Outstanding after payment2: ${invoice.outstandingAmount.toFixed(2)}`);
  console.log(`Invoice status: ${invoice.status}`);
}

function runScenario3_EdgeCases() {
  logTitle("Scenario 3: Edge Case Demonstrations");

  // 1) Zero-value invoice
  const zeroTotals = calculateInvoiceTotal([{ quantity: 0, unitPrice: 0 }], 0.07);
  console.log("Zero invoice totals:");
  console.log(`SubTotal: ${zeroTotals.subtotal.toFixed(2)}`);
  console.log(`Tax: ${zeroTotals.tax.toFixed(2)}`);
  console.log(`Total: ${zeroTotals.total.toFixed(2)}`);

  // 2) Negative unit price should throw
  try {
    calculateInvoiceTotal([{ quantity: 1, unitPrice: -5 }], 0.07);
  } catch (e) {
    console.log("\nNegative unitPrice error (expected):", (e as Error).message);
  }

  // 3) Negative tax rate should throw
  try {
    calculateInvoiceTotal([{ quantity: 1, unitPrice: 10 }], -0.01);
  } catch (e) {
    console.log("\nNegative taxRate error (expected):", (e as Error).message);
  }
}

function main() {
  const totals = runScenario1_InvoiceCalculation();
  runScenario2_Payments(totals.total, totals.tax);
  runScenario3_EdgeCases();

  logTitle("DONE");
}

main();