// eslint-disable-next-line global-require
const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      keyframes: {
        blueBgPulse: {
          "0%, 100%": { backgroundColor: `#283948` },

          "50%": { backgroundColor: `#3a5061` }
        },
        slightSpin: {
          "0%, 100%": { transform: `rotate(-5deg)` },

          "50%": { transform: `rotate(5deg)` }
        },
        rotateTwo: {
          "0%": { transform: `rotate(0deg)` },
          "100%": { transform: `rotate(720deg)` }
        },
        rotateThree: {
          "0%": { transform: `rotate(0deg)` },
          "100%": { transform: `rotate(1080deg)` }
        },
        fadeIn: {
          "0%": { transform: `translateY(14px)`, opacity: `0` },
          "70%": { opacity: `1` },
          "100%": { transform: `translateY(0px)` }
        },

        floatY: {
          "0%, 100%": { transform: `translateY(-7px)` },
          "50%": { transform: `translateY(7px)` }
        }
      },
      animation: {
        blueBgPulse: "blueBgPulse ease-in-out infinite",
        slightSpin: "slightSpin ease-in-out infinite",
        floatY: "floatY ease-in-out infinite",
        rotateTwo: "rotateTwo ease-in normal",
        rotateThree: "rotateThree ease-in normal",
        fadeIn: "fadeIn ease-in normal"
      },
      colors: {
        "warm-gray": colors.warmGray,
        teal: colors.teal,
        "warm-blue": "#CCDAF8",
        "dark-blue": "#326CE5",
        "gray-color": "#C4C4C4",
        "dark-gray": "#242423",
        "column-background": "#F9FAFB",
        "lightest-gray": "#F9FAFB",
        "light-orange": "#FBBE67",
        "light-red": "#EF978A",
        "light-gray": "#D2D2D2",
        "light-green": "#98C373"
      },
      fontFamily: {
        inter: ["Inter"]
      },
      fontSize: {
        "2xsi": ["0.6875rem", "1.1875rem"],
        "2xs": ["0.625rem", "1.125rem"],
        "15pxinrem": "0.9375rem"
      },
      borderWidth: {
        6: "6px"
      },
      borderRadius: {
        "4px": "4px",
        "6px": "6px",
        "8px": "8px"
      },
      padding: {
        0.75: "0.1875rem"
      },
      boxShadow: {
        card: "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05), 0px 0px 0px 1px rgba(0, 0, 0, 0.05)"
      },
      maxWidth: {
        full: "100%",
        "1/4": "25%",
        "1/2": "50%",
        "3/4": "75%",
        "1/10": "10%",
        "2/10": "20%",
        "3/10": "30%",
        "4/10": "40%",
        "5/10": "50%",
        "6/10": "60%",
        "7/10": "70%",
        "8/10": "80%",
        "9/10": "90%"
      },
      width: {
        "med-card-left": "48%",
        "med-card-right": "52%",
        "large-card-left": "36%",
        "large-card-right": "64%"
      },
      minWidth: {
        8: "2rem",
        7: "1.75rem"
      },
      gridTemplateColumns: {
        "4minmax": "repeat(4, minmax(min-content, max-content))",
        "node-stats": "repeat(auto-fill, minmax(2rem, max-content))",
        "1-to-2": "minmax(0, 1fr) minmax(0, 2fr)",
        "small-card-metrics":
          "minmax(25%, 30%) minmax(25%, 32%) minmax(25%, 38%)",
        "medium-card-metrics":
          "minmax(25%, 30%) minmax(25%, 32%) minmax(25%, 38%)"
      },
      flex: {
        "0-0-a": "0 0 auto"
      },
      lineHeight: {
        "1.21rel": "1.21"
      }
    }
  },
  variants: {
    extend: {
      backgroundColor: ["disabled"],
      textColor: ["disabled"],
      margin: ["first", "last"],
      borderWidth: ["first", "hover", "last"],
      borderRadius: ["first", "last"],
      borderColor: ["hover"]
    }
  }, // eslint-disable-next-line global-require
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")]
};
