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
        teal: colors.teal
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")]
};
