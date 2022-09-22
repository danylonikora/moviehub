import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

function MovieSchedule({ movies, formFields }) {
  return (
    <Stack spacing={2} sx={{ paddingTop: "8px" }}>
      <Typography variant="h5" sx={{ alignSelf: "center" }}>
        Ваш графік перегляду (могут попадаться дубликаты если выбирать больше 1
        жанра &#129335;)
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {movies.length == 0 &&
          "Фільми за вашими запитами не знайдені, спробуйте змінити фільтри"}
        {movies.map((movie, i) => (
          <Box
            key={movie.title}
            sx={{
              width: "200px",
              gap: "8px",
            }}
          >
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
          </Box>
        ))}
      </Box>
    </Stack>
  );
}

export default MovieSchedule;
