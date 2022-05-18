import { scales, variants } from "./types";

export const scaleVariants = {
  [scales.MD]: {
    height: "42px",
    padding: "0 20px",
  },
  [scales.SM]: {
    height: "32px",
    padding: "0 16px",
  },
  [scales.XS]: {
    height: "20px",
    fontSize: "12px",
    padding: "0 8px",
  },
};

export const styleVariants = {
  [variants.PRIMARY]: {
    backgroundColor: "#c52723",
    color: "white",
  },
  [variants.SECONDARY]: {
    backgroundColor: "transparent",
    border: "1px solid",
    borderColor: "white",
    boxShadow: "none",
    color: "white",
    ":disabled": {
      backgroundColor: "transparent",
    },
  },
  [variants.TERTIARY]: {
    backgroundColor: "white",
    boxShadow: "none",
    color: "#c52723",
  },


  [variants.SUBTLE]: {
    backgroundColor: "textSubtle",
    color: "white",
  },
  [variants.DANGER]: {
    backgroundColor: "failure",
    color: "white",
  },
  [variants.SUCCESS]: {
    backgroundColor: "success",
    color: "white",
  },
  [variants.TEXT]: {
    backgroundColor: "transparent",
    color: "primary",
    boxShadow: "none",
  },
};
