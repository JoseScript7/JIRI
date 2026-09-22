import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

// Responsive scaling for massive typography based on research guidelines
const scale = width / 375;
const normalize = (size) => Math.round(scale * size);

export const Colors = {
  // Base
  background: "#FFFFFF", // Clean white background
  cardBackground: "#FFFFFF",

  // Brand & Accents
  primary: "#0A58CA", // Primary JIRI Blue
  success: "#2E7D32", // Success Green
  attention: "#E65100", // Attention Orange
  secondary: "#00838F", // Secondary Light Blue
  danger: "#D32F2F", // Danger Red
  neutral: "#F3F4F6", // Neutral Grey for cards/backgrounds

  // Text
  text: "#1F2937", // Dark Grey/Black for high legibility
  secondaryText: "#4B5563",
  lightText: "#FFFFFF", // White text on dark buttons

  // Specific Block Accents (from Blueprint Screen 7)
  blockYellow: "#FFF8E1",
  blockLightBlue: "#E1F5FE",
  blockBlue: "#1565C0",
  blockGreen: "#4CAF50",
  blockOrange: "#FF9800",
  blockPurple: "#9C27B0",
};

export const Typography = {
  pageTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.text,
    letterSpacing: -0.5,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
  },
  body: {
    fontSize: 18,
    color: Colors.text,
    lineHeight: 26,
    fontWeight: "400", // No thin weights
  },
  secondaryText: {
    fontSize: 16,
    color: Colors.secondaryText,
    fontWeight: "400",
  },
  buttonLabel: {
    fontSize: 20,
    fontWeight: "700", // High contrast/bold
    color: Colors.lightText,
  },
};

export const Spacing = {
  xs: 8,
  s: 12,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const Layout = {
  borderRadius: 16,
  buttonHeight: 64, // Large touch targets
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
};
