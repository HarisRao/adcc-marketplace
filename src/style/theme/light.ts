import { DefaultTheme } from "styled-components";
import { light as lightAlert } from "../../components/Alert/theme";
import { light as lightCard } from "../../components/Card/theme";
import { light as lightModal } from "../../components/Modal/theme";
import base from "./base";
import { lightColors } from "./colors";

const lightTheme: DefaultTheme = {
  ...base,
  isDark: false,
  colors: lightColors,
  alert: lightAlert,
  card: lightCard,
  modal: lightModal,
};

export default lightTheme;
