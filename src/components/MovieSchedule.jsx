import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

function MovieSchedule({ movies, formFields }) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: "16px",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {movies.length == 0 &&
        "Фільми за вашими запитами не знайдені, спробуйте змінити фільтри"}
      {movies.map((movie, i) => (
        <Stack spacing={1} sx={{ alignItems: "center" }}>
          <Typography variant="h6">{formFields.watchDates[i]}</Typography>
          <Box
            sx={{
              backgroundImage: `url(${movie.image})`,
              backgroundPosition: "50%",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              height: "300px",
              width: "200px",
              position: "relative",
            }}
          />
          <Typography variant="h6">{`${movie.title} ${movie.description}`}</Typography>
        </Stack>
      ))}
    </Box>
  );
}

export default MovieSchedule;
