"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface CustomizationState {
  theme: string;
  font: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
  pageWidth: string;
  baseFontSize: string;
  logoWidth: string;
  logoHeight: string;
  logoRadius: string;
  coverHeight: string;
  inputWidth: string;
  inputHeight: string;
  inputBg: string;
  inputPlaceholder: string;
  inputBorder: string;
  inputBorderWidth: string;
  inputBorderRadius: string;
  inputMarginBottom: string;
  inputHPadding: string;
  btnWidth: string;
  btnHeight: string;
  btnAlignment: string;
  btnFontSize: string;
  btnCornerRadius: string;
  btnBg: string;
  btnText: string;
  btnVMargin: string;
  btnHPadding: string;
}

export const customizationDefaults: CustomizationState = {
  theme: "custom",
  font: "google-sans",
  bgColor: "#faf9f6",
  textColor: "#0a0a0a",
  accentColor: "#6366f1",
  pageWidth: "700",
  baseFontSize: "16",
  logoWidth: "100",
  logoHeight: "100",
  logoRadius: "50",
  coverHeight: "25",
  inputWidth: "320",
  inputHeight: "36",
  inputBg: "#faf9f6",
  inputPlaceholder: "#a09e98",
  inputBorder: "#e8e6e1",
  inputBorderWidth: "1",
  inputBorderRadius: "8",
  inputMarginBottom: "10",
  inputHPadding: "10",
  btnWidth: "auto",
  btnHeight: "36",
  btnAlignment: "left",
  btnFontSize: "16",
  btnCornerRadius: "8",
  btnBg: "#0a0a0a",
  btnText: "#faf9f6",
  btnVMargin: "10",
  btnHPadding: "14",
};

export const FONT_MAP: Record<string, string> = {
  "google-sans": "'Google Sans', sans-serif",
  inter: "'Inter', sans-serif",
  system: "system-ui, sans-serif",
  "dm-sans": "'DM Sans', sans-serif",
  outfit: "'Outfit', sans-serif",
};

interface CustomizationStoreState {
  state: CustomizationState;
  initialize: (partial?: Partial<CustomizationState>) => void;
  set: <K extends keyof CustomizationState>(key: K, value: CustomizationState[K]) => void;
  reset: () => void;
}

export const useCustomizationStore = create<CustomizationStoreState>()(
  devtools(
    (set) => ({
      state: { ...customizationDefaults },

      initialize: (partial) =>
        set({ state: { ...customizationDefaults, ...partial } }),

      set: (key, value) =>
        set((prev) => ({
          state: { ...prev.state, [key]: value },
        })),

      reset: () => set({ state: { ...customizationDefaults } }),
    }),
    { name: "customization-store" }
  )
);
