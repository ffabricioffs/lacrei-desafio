import "@testing-library/jest-dom";
import { toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

// O jsdom não implementa IntersectionObserver; sem ele o next/link usa um
// fallback com timer que atualiza estado fora do act() e polui a saída.
class IntersectionObserverMock {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  takeRecords = jest.fn(() => []);
  root = null;
  rootMargin = "";
  thresholds = [];
}
if (typeof window !== "undefined") {
  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    value: IntersectionObserverMock,
  });
}

// next/navigation não tem roteador real no ambiente de testes
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/"),
  useRouter: jest.fn(() => ({ push: jest.fn(), prefetch: jest.fn() })),
  useServerInsertedHTML: jest.fn(),
}));
