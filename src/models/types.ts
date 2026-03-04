import { InvoiceStatus, PaymentMethod, PaymentStatus } from "./enum.js";

export type Cents = number;

export interface InvoiceItem {
  id: string;
  description: string;

  quantity: number;   // >= 0
  unitPrice: Cents;   // cents, >= 0

  lineTotal: Cents;   // quantity * unitPrice
  taxRate: number;    // e.g. 0.07
  taxAmount: Cents;   // lineTotal * taxRate
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: Date;
  items: InvoiceItem[];

  totalAmount: Cents;       // subtotal + totalTax
  totalTax: Cents;          // sum item.taxAmount
  outstandingAmount: Cents; // remaining balance (can be negative if overpaid)

  status: InvoiceStatus;
}

export interface Payment {
  id: string;
  invoiceId: string;
  paymentMethod: PaymentMethod;
  amount: Cents; // cents
  paymentDate: Date;
  referenceNumber: string;
  status: PaymentStatus;
}

export interface Receipt {
  id: string;
  paymentId: string;
  receiptNumber: string;
  receiptDate: Date;
  totalPaid: Cents;
  remainingBalance: Cents;
}