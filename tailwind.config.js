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
        "gray-color": "#C4C4C4",
        "dark-gray": "#242423",
        "column-background": "#F9FAFB",
        "card-top-border-orange": "#FBBE67",
        "card-top-border-red": "#EF978A",
        "card-top-border-white": "#FFFFFF",
        "card-top-border-gray": "#D2D2D2",
        "card-top-border-green": "#98C373"
      },
      fontFamily: {
        inter: ["Inter"]
      },
      fontSize: {
        "2xsi": ["0.6875rem", "1.1875rem"],
        "2xs": ["0.625rem", "1.125rem"],
        "15pxinrem": ["0.9375rem", "1.125rem"]
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
        card: "0px 0px 0px 1px #0000000D, 0px 4px 6px -2px #0000000D, 0px 10px 15px -3px #0000001A"
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
      minWidth: {
        8: "2rem"
      },
      gridTemplateColumns: {
        "4minmax": "repeat(4, minmax(min-content, max-content))"
      },
      flex: {
        "0-0-a": "0 0 auto"
      }
    }
  },
  variants: {
    extend: {
      backgroundColor: ["disabled"],
      textColor: ["disabled"]
    }
  }, // eslint-disable-next-line global-require
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")]
};
