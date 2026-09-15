import { describe, it, expect } from "vitest"

// Critical path: promo calculation
function calcDiscount(subtotal: number, percent: number) {
  return Math.round(subtotal * percent / 100)
}
describe("Critical orders", () => {
  it("SALMI10 10% sur 5000 => 500", () => expect(calcDiscount(5000, 10)).toBe(500))
  it("RESIDANAT20 20% sur 9500 => 1900", () => expect(calcDiscount(9500, 20)).toBe(1900))
  it("phone DZ valide", () => expect(/^(0)(5|6|7)\d{8}$/.test("0555123456")).toBe(true))
  it("phone invalide rejeté", () => expect(/^(0)(5|6|7)\d{8}$/.test("0123456789")).toBe(false))
})
