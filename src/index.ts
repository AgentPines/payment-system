import { processPayment } from "./services/paymentService"
import { generateReceipt } from "./services/receiptService"
import { Invoice } from "./models/types"
import { InvoiceStatus, PaymentMethod } from "./models/enums"

// Create a sample invoice
const invoice: Invoice = {
  id: "inv-001",
  invoiceNumber: "INV-001",
  invoiceDate: new Date(),
  items: [],
  totalAmount: 1000.00,
  totalTax: 0,
  outstandingAmount: 1000.00,
  status: InvoiceStatus.OPEN
}

console.log("Initial Invoice:")
console.log(invoice)

// First payment
const paymentResult1 = processPayment(invoice, 300.00, PaymentMethod.CARD)

const receipt1 = generateReceipt(paymentResult1, invoice)

console.log("\nPaymentResult 1:")
console.log(paymentResult1)

console.log("\nReceipt 1:")
console.log(receipt1)

// Second payment (overpayment)
const paymentResult2 = processPayment(invoice, 750.00, PaymentMethod.BANK_TRANSFER)

const receipt2 = generateReceipt(paymentResult2, invoice)

console.log("\nPaymentResult 2:")
console.log(paymentResult2)

console.log("\nReceipt 2:")
console.log(receipt2)

console.log("\nFinal Invoice State:")
console.log(invoice)