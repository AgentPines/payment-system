# Payment System (TypeScript)

A simple payment and invoicing module implemented in **TypeScript**.

The system supports:

- Invoice total calculation
- Payment processing (partial payment, full payment, overpayment)
- Receipt generation
- Unit testing for all scenarios
- Edge case validation

---

# Tech Stack

- Node.js
- TypeScript
- Jest (Unit Testing)

# Installation

Install dependencies:

```bash
npm install
```

# Run the Example

Run the demo script:

```bash
npm run dev
```

This will execute src/index.ts, which demonstrates:

- Invoice total calculation
- Payment processing
- Receipt generation
- Edge case handling

# Build the Project

Compile TypeScript into JavaScript:
```bash
npm run build
```

# Run the compiled project:
```bash
npm start
```

# Run Unit Tests

Execute all unit tests using Jest:
```bash
npm test
```


---

## Design Decisions & Trade-offs

### Money Representation

All public interfaces use `number` values representing **dollars** for readability and to match the problem examples.

However, during calculations the values are converted to **integer cents**.

Example:
$25.50 → 2550 cents


This approach avoids floating-point precision issues commonly found in financial calculations.

Trade-off:

- Requires conversion between dollars and cents
- Adds a small amount of overhead but ensures reliable calculations

---

### Tax Calculation Strategy

Tax is calculated using the **invoice subtotal**:
tax = round(subtotal * taxRate)

This ensures that the final result matches the expected scenario output.

Trade-off:

- Item-level tax allocation is not implemented since the assignment focuses only on invoice totals.

---

### Service Separation

The system separates responsibilities across different services:

| Service | Responsibility |
|------|------|
invoiceService | Invoice total calculation |
paymentService | Payment processing |
receiptService | Receipt generation |

This improves modularity, maintainability, and testability.

---

## Known Limitations & Assumptions

- The system assumes a **single currency**.
- Monetary values are assumed to be **within JavaScript safe integer limits**.
- The system does **not persist data** (invoices, payments, receipts exist only in memory).
- Tax rate must be provided as a **decimal value** (e.g. `0.07` for 7%).
- Item-level tax breakdown is not implemented.
- Payment and receipt IDs are **randomly generated for demonstration purposes**.
- No concurrency or multi-user scenarios are handled.
