/// <reference types="astro/client" />
interface Window {
  NurPlanet?: { prepare(world: 'builder' | 'creator'): void; snapshot(): void; hold(value: boolean): void; charge(value: boolean): void };
  NurField?: { sync(): void; snapshot(): void; hold(value: boolean): void; charge(value: boolean): void };
  NurTransit?: { run(options: Record<string, unknown>): Promise<void> };
}
