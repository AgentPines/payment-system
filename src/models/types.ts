import { InvoiceStatus, PaymentMethod, PaymentStatus } from "./enums";

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;     // >= 0
  unitPrice: number;    // dollars
  lineTotal: number;    // dollars
  taxRate: number;      // e.g. 0.07
  taxAmount: number;    // dollars
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: Date;
  items: InvoiceItem[];
  totalAmount: number;        // dollars
  totalTax: number;           // dollars
  outstandingAmount: number;  // dollars (can be negative if overpaid)
  status: InvoiceStatus;
}

export interface Payment {
  id: string;
  invoiceId: string;
  paymentMethod: PaymentMethod;
  amount: number; // dollars
  paymentDate: Date;
  referenceNumber: string;
  status: PaymentStatus;
}

export interface Receipt {
  id: string;
  paymentId: string;
  receiptNumber: string;
  receiptDate: Date;
  totalPaid: number;        // dollars
  remainingBalance: number; // dollars
}