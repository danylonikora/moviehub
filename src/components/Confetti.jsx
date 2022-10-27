import React from "react";
import ReactDOM from "react-dom";
import ConfettiPackage from "react-confetti";
import { useWindowSize } from "react-use";
import { useTheme } from "@mui/material";

function Confetti({ containerRef }) {
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const theme = useTheme();
  const confettiRef = React.useRef(null);

  React.useEffect(() => {
    if (!confettiRef.current) {
      return;
    }

    confettiRef.current.style.zIndex = theme.zIndex.modal + 1;
  });

  return containerRef.current
    ? ReactDOM.createPortal(
        <ConfettiPackage
          width={windowWidth}
          height={windowHeight}
          ref={confettiRef}
        />,
        containerRef.current
      )
    : null;
}

export default Confetti;
