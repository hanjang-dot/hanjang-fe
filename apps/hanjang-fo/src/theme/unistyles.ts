import { StyleSheet } from "react-native-unistyles";

import { colors, radius, spacing } from "@hanjang/tokens";

export const typography = {
  display: {
    fontFamily: "Noto Serif KR",
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 35,
  },
  heading: {
    fontFamily: "IBM Plex Sans KR",
    fontSize: 22,
    fontWeight: "600",
    lineHeight: 29,
  },
  title: {
    fontFamily: "IBM Plex Sans KR",
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24,
  },
  body: {
    fontFamily: "IBM Plex Sans KR",
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 25,
  },
  bodyBold: {
    fontFamily: "IBM Plex Sans KR",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 25,
  },
  caption: {
    fontFamily: "IBM Plex Sans KR",
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 18,
  },
  year: {
    fontFamily: "IBM Plex Sans KR",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 17,
    letterSpacing: 0.4,
  },
  timer: {
    fontFamily: "IBM Plex Sans KR",
    fontSize: 36,
    fontWeight: "600",
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  passage: {
    fontFamily: "Noto Serif KR",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 31,
  },
  button: {
    fontFamily: "IBM Plex Sans KR",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 18,
  },
} as const;

const breakpoints = {
  phone: 0,
  tablet: 768,
  desktop: 1024,
} as const;

const lightTheme = {
  colors,
  spacing,
  radius,
  typography,
} as const;

type AppThemes = {
  light: typeof lightTheme;
};

type AppBreakpoints = typeof breakpoints;

declare module "react-native-unistyles" {
  interface UnistylesThemes extends AppThemes {}
  interface UnistylesBreakpoints extends AppBreakpoints {}
}

StyleSheet.configure({
  themes: {
    light: lightTheme,
  },
  breakpoints,
  settings: {
    initialTheme: "light",
  },
});

export type AppTheme = typeof lightTheme;
