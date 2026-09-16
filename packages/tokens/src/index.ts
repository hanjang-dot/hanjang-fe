export const colors = {
  bg: "#F6F4FB",
  surface1: "#FFFFFF",
  surface2: "#EFEBFD",
  text: "#17142B",
  textMuted: "#8B87A3",
  border: "#ECE9F6",
  accent: "#6C5CE7",
  accentPressed: "#5F51CB",
  accentSoft: "rgba(108,92,231,0.1)",
  danger: "#F0506E",
  dangerSoft: "rgba(240,80,110,0.1)",
  correct: "#22C58B",
  correctSoft: "rgba(34,197,139,0.1)",
  overlay: "rgba(0,0,0,0.5)",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  screenPadding: 16,
  section: 24,
  cardPadding: 16,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  full: 9999,
} as const;

export const sizes = {
  buttonSm: 36,
  buttonMd: 44,
  buttonLg: 52,
  buttonPadLg: 20,
  iconSm: 16,
  iconMd: 20,
  iconLg: 24,
  tapMin: 44,
  tapGap: 8,
  appBar: 56,
  tabBar: 49,
  bottomCta: 56,
  snackbar: 48,
  emptyIcon: 48,
  oxButton: 120,
  progress: 4,
  scoreRing: 96,
  scoreRingLine: 8,
} as const;

export const shadows = {
  sm: "0 2px 8px rgba(80,70,160,0.08)",
  md: "0 8px 24px rgba(80,70,160,0.12)",
} as const;

export const fonts = {
  sans: "IBM Plex Sans KR",
  serif: "Noto Serif KR",
} as const;

export const fontFamilies = {
  sansRegular: "IBMPlexSansKR_400Regular",
  sansMedium: "IBMPlexSansKR_500Medium",
  sansSemiBold: "IBMPlexSansKR_600SemiBold",
  sansBold: "IBMPlexSansKR_700Bold",
  serifSemiBold: "NotoSerifKR_600SemiBold",
  serifBold: "NotoSerifKR_700Bold",
} as const;
