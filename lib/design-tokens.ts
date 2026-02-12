export const tokens = {
  colors: {
    blanqBlack: "#0a0a0a",
    blanqWhite: "#faf9f6",
    cream: "#ede8e0",

    grey: {
      100: "#f5f4f1",
      200: "#e8e6e1",
      300: "#d1cfc9",
      400: "#a09e98",
      500: "#6b6966",
      600: "#3d3c3a",
    },

    accent: "#6366f1",
    accentLight: "#818cf8",
    accentDark: "#4f46e5",

    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
  },

  typography: {
    fontFamily: {
      display: "Outfit",
      body: "DM Sans",
      mono: "JetBrains Mono",
    },

    fontSize: {
      xs: "0.625rem", // 10px
      sm: "0.8125rem", // 13px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.5rem", // 24px
      "2xl": "1.75rem", // 28px
      "3xl": "2.5rem", // 40px
      "4xl": "3.25rem", // 52px
    },

    fontWeight: {
      light: "300",
      regular: "400",
      medium: "500",
      semibold: "600",
    },

    lineHeight: {
      none: "1",
      tight: "1.2",
      normal: "1.5",
      relaxed: "1.7",
    },

    letterSpacing: {
      tighter: "-0.05em",
      tight: "-0.025em",
      normal: "0",
      wide: "0.05em",
      wider: "0.1em",
    },
  },

  spacing: {
    0: "0",
    1: "0.25rem", // 4px
    2: "0.5rem", // 8px
    3: "0.75rem", // 12px
    4: "1rem", // 16px
    5: "1.25rem", // 20px
    6: "1.5rem", // 24px
    8: "2rem", // 32px
    10: "2.5rem", // 40px
    12: "3rem", // 48px
    16: "4rem", // 64px
    20: "5rem", // 80px
    24: "6rem", // 96px
  },

  borderRadius: {
    none: "0",
    sm: "0.125rem", // 2px
    md: "0.375rem", // 6px
    lg: "0.5rem", // 8px
    xl: "0.75rem", // 12px
    "2xl": "1rem", // 16px
    full: "9999px",
  },

  shadows: {
    xs: "0 1px 2px rgba(0,0,0,0.04)",
    sm: "0 2px 8px rgba(0,0,0,0.06)",
    md: "0 4px 16px rgba(0,0,0,0.08)",
    lg: "0 8px 32px rgba(0,0,0,0.1)",
    xl: "0 16px 48px rgba(0,0,0,0.14)",
    focus: "0 0 0 3px rgba(99,102,241,0.3)",
  },

  opacity: {
    disabled: "0.4",
    placeholder: "0.5",
    muted: "0.6",
    hover: "0.08",
  },

  zIndex: {
    base: "0",
    dropdown: "100",
    sticky: "200",
    overlay: "300",
    modal: "400",
    toast: "500",
    tooltip: "600",
  },

  transitions: {
    duration: {
      fast: "100ms",
      normal: "200ms",
      slow: "300ms",
      slower: "500ms",
    },

    easing: {
      default: "cubic-bezier(0.23, 1, 0.32, 1)",
      in: "cubic-bezier(0.55, 0, 1, 0.45)",
      out: "cubic-bezier(0, 0.55, 0.45, 1)",
      spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    },
  },

  borders: {
    width: {
      thin: "1px",
      medium: "1.5px",
      thick: "2px",
    },
  },

  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
} as const;

export type DesignTokens = typeof tokens;
