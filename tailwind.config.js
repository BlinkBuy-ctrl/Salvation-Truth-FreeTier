module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        navy: "#0F172A",
        gold: "#D97706",
        cream: "#F8FAFC",
        alabaster: "#F1F5F9",
      },
    },
  },
  plugins: [],
};
