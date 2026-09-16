import { StyleSheet } from "react-native-unistyles";

import {
  colors,
  fontFamilies,
  fonts,
  radius,
  shadows,
  sizes,
  spacing,
} from "@hanjang/tokens";

import paneContract from "@/shared/pane-contract.json";

import type { FontVariant } from "react-native";

const tabularNums: FontVariant[] = ["tabular-nums"];

export const typography = {
  display: {
    fontFamily: fontFamilies.serifBold,
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 36.4,
  },
  h1: {
    fontFamily: fontFamilies.serifBold,
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 31.2,
  },
  h2: {
    fontFamily: fontFamilies.sansSemiBold,
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 26,
  },
  h3: {
    fontFamily: fontFamilies.sansSemiBold,
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 22.1,
  },
  body: {
    fontFamily: fontFamilies.sansRegular,
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 22.5,
  },
  bodySm: {
    fontFamily: fontFamilies.sansRegular,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 21,
  },
  caption: {
    fontFamily: fontFamilies.sansRegular,
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 18,
  },
  label: {
    fontFamily: fontFamilies.sansMedium,
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 19.5,
  },
  button: {
    fontFamily: fontFamilies.sansMedium,
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 18,
  },
  buttonLg: {
    fontFamily: fontFamilies.sansMedium,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 20,
  },
  buttonSm: {
    fontFamily: fontFamilies.sansMedium,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 17,
  },
  timer: {
    fontFamily: fontFamilies.serifBold,
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 31.2,
    fontVariant: tabularNums,
  },
  passage: {
    fontFamily: fontFamilies.serifSemiBold,
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 27,
  },
  ox: {
    fontFamily: fontFamilies.serifSemiBold,
    fontSize: 28,
    fontWeight: "600",
    lineHeight: 36.4,
  },
} as const;

const breakpoints = {
  phone: 0,
  tablet: paneContract.tabletBreakpoint,
  desktop: 1024,
} as const;

const lightTheme = {
  colors,
  spacing,
  radius,
  sizes,
  shadows,
  fonts,
  fontFamilies,
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
