import React from "react";
import styled from "styled-components";
// import omniloader from '../../images/omniloader.gif'
import adccloader from '../../images/adcc-logo.png'


const Container = styled.div`
  position: relative;
`;

export interface SpinnerProps {
  size?: number;
}
// size=128
const Spinner: React.FC<SpinnerProps> = ({ size = 350 }) => {
  return (
    <Container>
      {/* https://psi.blob.core.windows.net/images/Spinner.gif */}
      <img src={adccloader} alt="adcc-loader" style={{maxWidth: `${size}px`, maxHeight: `${size}px`}} />
    </Container>
  );
};

export default Spinner;
