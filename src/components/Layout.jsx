import React from "react";
import Container from "@mui/material/Container";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <Container
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Roboto",
      }}
    >
      <Outlet />
    </Container>
  );
}

export default Layout;
