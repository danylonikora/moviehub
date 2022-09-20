import React from "react";
import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
// import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function Layout({ children, currentPage, redirectTo, routeHistory }) {
  return (
    <>
      <AppBar position="sticky" sx={{ width: "100%" }}>
        <Toolbar sx={{ gap: "8px" }}>
          <div>
            <IconButton
              disabled={currentPage == "auth"}
              onClick={() => {
                switch (currentPage) {
                  case "form":
                    redirectTo("auth");
                    break;
                  case "schedule":
                    redirectTo("form");
                }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <IconButton
              disabled={
                currentPage == "schedule" ||
                (currentPage == "auth" && !routeHistory.includes("form")) ||
                (currentPage == "form" && !routeHistory.includes("schedule"))
              }
              onClick={() => {
                switch (currentPage) {
                  case "auth":
                    redirectTo("form");
                    break;
                  case "form":
                    redirectTo("schedule");
                }
              }}
            >
              <ArrowForwardIcon />
            </IconButton>
          </div>
          <Typography variant="h6">Название?????</Typography>
        </Toolbar>
      </AppBar>
      <Container
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Roboto",
        }}
      >
        <main>{children}</main>
      </Container>
    </>
  );
}

export default Layout;
