/**
 * @jest-environment node
 */
import { allColorPairs, contrastRatio, interactionStates } from "./interactionStates";

const MIN = { text: 4.5, nonText: 3 } as const;

describe("contraste de todos os estados interativos (WCAG 2.1 AA)", () => {
  it("calcula o contraste corretamente (valores de referência)", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 1);
    expect(contrastRatio("#018762", "#FFFFFF")).toBeCloseTo(4.52, 2);
    // Par do Figma que motivou o ajuste: texto emerald-70 sobre emerald-20
    expect(contrastRatio("#007756", "#B2DFD0")).toBeCloseTo(3.81, 2);
  });

  it.each(allColorPairs().map((pair) => [pair.id, pair] as const))(
    "%s atinge o mínimo",
    (_id, pair) => {
      expect(contrastRatio(pair.fg, pair.bg)).toBeGreaterThanOrEqual(MIN[pair.kind]);
    },
  );

  it("o hover das variantes secundária, ghost e da navegação não usa mais #007756 sobre #B2DFD0", () => {
    const hovers = [
      interactionStates.buttonSecondary.hover,
      interactionStates.buttonGhost.hover,
      interactionStates.navLink.hover,
    ];
    hovers.forEach((pair) => {
      expect(pair.bg).toBe("#B2DFD0");
      expect(pair.fg).not.toBe("#007756");
      expect(contrastRatio(pair.fg, pair.bg)).toBeGreaterThanOrEqual(4.5);
    });
  });
});
