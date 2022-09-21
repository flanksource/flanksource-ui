// eslint-disable-next-line global-require
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  purge: false,
  media: false, // or 'media' or 'class'
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
        "warm-gray": colors.stone,
        teal: colors.teal,
        "warm-blue": "#CCDAF8",
        "dark-blue": "#326CE5",
        "gray-color": "#C4C4C4",
        "lighter-gray": "#F3F4F6",
        "dark-gray": "#242423",
        "light-black": "#1F2937",
        "border-color": "#E5E7EB",
        "light-blue": "#F6F7FFC9",
        "column-background": "#F9FAFB",
        "lightest-gray": "#F9FAFB",
        "light-orange": "#FBBE67",
        "light-red": "#EF978A",
        "light-gray": "#D2D2D2",
        "light-green": "#98C373",
        "bright-green": "#459E45",
        "warm-green": "#AAA526",
        "warmer-gray": "#808080",
        "bright-orange": "#F59337",
        "bright-red": "#DD4F4F",
        "half-black": "rgba(0, 0, 0, 0.5)"
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
        "8px": "8px",
        "10px": "10px"
      },
      padding: {
        0.75: "0.1875rem"
      },
      boxShadow: {
        card: "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05), 0px 0px 0px 1px rgba(0, 0, 0, 0.05)"
      },
      maxHeight: {
        large: "250px",
        medium: "200px",
        small: "125px",
        "50vh": "50vh",
        "modal-body-md": "500px"
      },
      minHeight: {
        12: "3rem",
        "50vh": "50vh",
        "modal-body-md": "500px"
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
        "9/10": "90%",
        32: "8rem"
      },
      width: {
        "med-card": "550px",
        "med-card-left": "63%",
        "med-card-right": "37%",
        "large-card-left": "36%",
        "large-card-right": "64%",
        "btn-round-2xs": "1.5rem",
        "btn-round-xs": "1.875rem",
        "btn-round-sm": "2.125rem",
        "btn-round-md": "2.375rem",
        "btn-round-lg": "2.625rem",
        "btn-round-xl": "3.125rem",
        "dialog-md": "850px"
      },
      height: {
        "topology-card": "200px",
        "btn-round-2xs": "1.5rem",
        "btn-round-xs": "1.875rem",
        "btn-round-sm": "2.125rem",
        "btn-round-md": "2.375rem",
        "btn-round-lg": "2.625rem",
        "btn-round-xl": "3.125rem",
        "modal-body-md": "500px"
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
      backgroundColor: ["disabled", "checked"],
      textColor: ["disabled"],
      margin: ["first", "last"],
      padding: ["first", "last"],
      borderWidth: ["first", "hover", "last"],
      borderRadius: ["first", "last"],
      borderColor: ["hover", "checked"]
    }
  }, // eslint-disable-next-line global-require
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")]
};
