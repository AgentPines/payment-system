import { calculateInvoiceTotal } from "../services/invoiceService";

describe("calculateInvoiceTotal", () => {
  test("Scenario 1: Basic Invoice Calculation", () => {
    const items = [
      { quantity: 1, unitPrice: 500.0 },
      { quantity: 2, unitPrice: 25.5 },
    ];

    const result = calculateInvoiceTotal(items, 0.07);

    // numbers are dollars
    expect(result.subtotal).toBeCloseTo(551.0, 2);
    expect(result.tax).toBeCloseTo(38.57, 2);
    expect(result.total).toBeCloseTo(589.57, 2);

    expect(result.subtotal.toFixed(2)).toBe("551.00");
    expect(result.tax.toFixed(2)).toBe("38.57");
    expect(result.total.toFixed(2)).toBe("589.57");
  });

  test("Validation: empty items should throw", () => {
    expect(() => calculateInvoiceTotal([], 0.07)).toThrow(
      "Invoice must contain at least one item"
    );
  });

  test("Validation: negative unitPrice should throw", () => {
    const items = [{ quantity: 1, unitPrice: -1 }];
    expect(() => calculateInvoiceTotal(items, 0.07)).toThrow(
      "Item unit price must be a non-negative number"
    );
  });

  test("Validation: negative quantity should throw", () => {
    const items = [{ quantity: -2, unitPrice: 10 }];
    expect(() => calculateInvoiceTotal(items, 0.07)).toThrow(
      "Item quantity must be a non-negative number"
    );
  });

  test("Validation: negative taxRate should throw", () => {
    const items = [{ quantity: 1, unitPrice: 10 }];
    expect(() => calculateInvoiceTotal(items, -0.01)).toThrow(
      "Tax rate must be a non-negative number"
    );
  });
});