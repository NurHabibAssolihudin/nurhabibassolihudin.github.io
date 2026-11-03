/// <reference types="astro/client" />
type PortfolioWorld = 'builder' | 'creator';
interface WorldTransitOptions {
  root: HTMLElement;
  rift: HTMLElement;
  worlds: Record<PortfolioWorld, HTMLElement>;
  name: PortfolioWorld;
  origin: HTMLButtonElement;
  swap(name: PortfolioWorld, focus: boolean): void;
  closeMenu(): void;
}
interface Window {
  NurPlanet?: { prepare(world: PortfolioWorld): void; snapshot(): void; hold(value: boolean): void; charge(value: boolean): void; emblem?(context: CanvasRenderingContext2D, world: PortfolioWorld): boolean };
  NurField?: { sync(): void; snapshot(): void; hold(value: boolean): void; charge(value: boolean): void };
  NurTransit?: { run(options: WorldTransitOptions): Promise<void>; finish(): void };
}
