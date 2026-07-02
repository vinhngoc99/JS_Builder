// =============================================================================
// StorageService — the single owner of localStorage persistence.
//
// Centralizes every storage key, JSON (de)serialization, the bootstrap reads
// used by the provider's useState initializers, and the debounced writers that
// avoid disk churn during drags. Behavior matches the original inline logic.
//
// Migration (migrateElements/migrateConnections/migrateVariants) is intentionally
// NOT done here — it stays domain logic in the provider. This service only reads
// and writes raw data.
// =============================================================================

import { CanvasElement, Connection, BrushStroke, Variant } from '../types';
import { debounce } from './dom-utils';

export const STORAGE_KEYS = {
  variants: 'js-builder-variants',
  elements: 'js-builder-elements',
  connections: 'js-builder-connections',
  brush: 'js-builder-brush',
  guides: 'js-builder-guides',
  activeVariant: 'js-builder-active-variant',
  theme: 'js-builder-theme',
  snap: 'js-builder-snap',
  blur: 'js-builder-blur',
} as const;

class StorageService {
  readonly KEYS = STORAGE_KEYS;

  /** Safely parse JSON from localStorage, returning fallback on error. */
  read<T>(key: string, fallback: T): T {
    try {
      const saved = localStorage.getItem(key);
      return saved ? (JSON.parse(saved) as T) : fallback;
    } catch (e) {
      console.warn(`Failed to parse localStorage key "${key}", using fallback.`, e);
      return fallback;
    }
  }

  /** Serialize and persist a JSON value. */
  write(key: string, value: unknown): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getString(key: string): string | null {
    return localStorage.getItem(key);
  }

  writeString(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  // --- Bootstrap reads (used by useState initializers) --------------------

  /** The persisted active variant id, defaulting to 'default'. */
  activeVariantId(): string {
    return localStorage.getItem(this.KEYS.activeVariant) || 'default';
  }

  /**
   * Parsed variants array from storage, or null when absent/malformed.
   * Mirrors the original initializer's try/catch + warning.
   */
  parsedVariants(): any | null {
    const saved = localStorage.getItem(this.KEYS.variants);
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse variants, using fallback', e);
      return null;
    }
  }

  /**
   * Read a single field of the active variant (elements/connections/
   * brushStrokes/guides). Falls back to the legacy top-level key when the
   * variants blob is absent or malformed. Returns RAW data (no migration).
   */
  activeVariantField<T>(field: keyof Variant, legacyKey: string, fallback: T): T {
    const savedActiveId = this.activeVariantId();
    const savedVariants = localStorage.getItem(this.KEYS.variants);
    if (savedVariants) {
      try {
        const parsed = JSON.parse(savedVariants) as Variant[];
        const active = parsed.find(v => v.id === savedActiveId);
        if (active) return active[field] as unknown as T;
      } catch {
        // Ignore malformed saved variants and fall back to legacy keys.
      }
    }
    return this.read(legacyKey, fallback);
  }

  // --- Debounced writers (timers persist on this singleton) ---------------

  saveElements = debounce((data: CanvasElement[]) => {
    this.write(this.KEYS.elements, data);
  }, 500);

  saveConnections = debounce((data: Connection[]) => {
    this.write(this.KEYS.connections, data);
  }, 500);

  saveBrush = debounce((data: BrushStroke[]) => {
    this.write(this.KEYS.brush, data);
  }, 500);

  saveVariants = debounce((data: Variant[]) => {
    this.write(this.KEYS.variants, data);
  }, 500);

  // --- Immediate writers --------------------------------------------------

  saveGuides(guides: Variant['guides']): void {
    this.write(this.KEYS.guides, guides);
  }

  saveTheme(theme: 'light' | 'dark'): void {
    this.writeString(this.KEYS.theme, theme);
  }

  saveSnap(enabled: boolean): void {
    this.writeString(this.KEYS.snap, String(enabled));
  }

  saveBlur(enabled: boolean): void {
    this.writeString(this.KEYS.blur, String(enabled));
  }

  saveActiveVariantId(id: string): void {
    this.writeString(this.KEYS.activeVariant, id);
  }
}

/** Shared singleton — there is exactly one builder store in the app. */
export const storage = new StorageService();
