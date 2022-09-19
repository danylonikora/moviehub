import React from "react";
import { AuthContext, PreferencesFormContext } from "../App";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import { DatePicker } from "@mui/x-date-pickers";
import { format, compareAsc, parse, addDays } from "date-fns";
import DateFnsAdapter from "@date-io/date-fns";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import Chip from "@mui/material/Chip";
import { PickersDay } from "@mui/x-date-pickers";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const dateFnsAdapter = new DateFnsAdapter({ locale: "uk" });

const MOVIE_GENRES = [
  { fieldName: "action", displayName: "Бойовики" },
  { fieldName: "adventure", displayName: "Пригодницькі" },
  { fieldName: "animation", displayName: "Анімаційні" },
  { fieldName: "biography", displayName: "Біографічні" },
  { fieldName: "comedy", displayName: "Комедії" },
  { fieldName: "crime", displayName: "Кримінальні" },
  { fieldName: "documentary", displayName: "Документальні" },
  { fieldName: "drama", displayName: "Драми" },
  { fieldName: "family", displayName: "Сімейні" },
  { fieldName: "fantasy", displayName: "Фантастика" },
  { fieldName: "noir", displayName: "Нуар" },
  // { fieldName: "show", displayName: "Ток-Шоу" },
  { fieldName: "history", displayName: "Трилери" },
  { fieldName: "horror", displayName: "Жахи" },
  // { fieldName: "music", displayName: "Музикальні" },
  { fieldName: "musical", displayName: "Мюзикли" },
  { fieldName: "mystery", displayName: "Містика" },
  // { fieldName: "news", displayName: "Новини" },
  // { fieldName: "tv", displayName: "Реаліті-телебачення" },
  { fieldName: "romance", displayName: "Романтичні" },
  { fieldName: "fi", displayName: "Наукова-фантастика" },
  { fieldName: "sport", displayName: "Спорт" },
  { fieldName: "thriller", displayName: "Трилери" },
  { fieldName: "war", displayName: "Війна" },
  { fieldName: "wester", displayName: "Вестертни" },
];
function formatDate(date) {
  return format(date, "dd.MM.yyyy");
}

function parseDate(formattedDate) {
  return parse(formattedDate, "dd.MM.yyyy", new Date());
}

// console.log(formatDate(new Date(2022, 5, 5)));
// console.log(parseDate(formatDate(new Date(2022, 5, 5))));

function PreferencesForm() {
  const authInfo = React.useContext(AuthContext);
  const formInfo = React.useContext(PreferencesFormContext);
  const [fields, setFields] = React.useState(formInfo.fields);
  const [isWatchDatesPickerOpen, setIsWatchDatesPickerOpen] =
    React.useState(false);
  const openWatchDatesPickerButtonRef = React.useRef(null);
  console.log(authInfo);
  console.log(fields);
  console.log(formInfo);

  return (
    <Stack
      spacing={1}
      alignItems="start"
      sx={{
        alignItems: "start",
        ".MuiDivider-root": { alignSelf: "stretch" },
        paddingBottom: "8px",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 500, marginTop: "8px" }}>
        {authInfo.fields.name}, заповніть цю форму для того, щоб ми могли
        підібрати для вас оптимальний список фільмів
      </Typography>
      <Typography variant="subtitle1">Оберіть бажані дати перегляду</Typography>
      {fields.watchDates.length > 0 && (
        <List sx={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {fields.watchDates
            .sort((date1, date2) =>
              compareAsc(parseDate(date1), parseDate(date2))
            )
            .map((date) => (
              <ListItem sx={{ padding: 0, width: "auto" }}>
                <Chip
                  label={date}
                  onDelete={() =>
                    setFields((prev) => ({
                      ...prev,
                      watchDates: prev.watchDates.filter(
                        (stateDate) => stateDate != date
                      ),
                    }))
                  }
                />
              </ListItem>
            ))}
        </List>
      )}
      <DatePicker
        open={isWatchDatesPickerOpen}
        value={null}
        minDate={dateFnsAdapter.date(new Date())}
        maxDate={addDays(new Date(), authInfo.fields.stayDuration - 1)}
        onClose={() => setIsWatchDatesPickerOpen(false)}
        closeOnSelect={false}
        showToolbar={false}
        PopperProps={{ anchorEl: openWatchDatesPickerButtonRef.current }}
        renderDay={(date, _, pickersDayProps) => (
          <PickersDay
            {...pickersDayProps}
            selected={fields.watchDates.includes(formatDate(date))}
          />
        )}
        renderInput={(params) => {
          return (
            <Button
              sx={{ alignSelf: "start" }}
              variant="outlined"
              onClick={() => setIsWatchDatesPickerOpen((prev) => !prev)}
              endIcon={<CalendarMonthIcon />}
              ref={openWatchDatesPickerButtonRef}
            >
              Вибрати дати
            </Button>
          );
        }}
        onChange={(newDate) =>
          setFields((prev) => {
            console.log("onchange date befor: ", newDate);
            const formattedDate = formatDate(newDate || new Date());
            console.log("onchange date: ", formattedDate);
            if (fields.watchDates.includes(formattedDate)) {
              return {
                ...prev,
                watchDates: prev.watchDates.filter(
                  (date) => date != formattedDate
                ),
              };
            } else {
              return {
                ...prev,
                watchDates: [...prev.watchDates, formattedDate],
              };
            }
          })
        }
        disablePast
      />
      <Divider />
      <Typography variant="subtitle1">
        Оберіть мінімальний рейтинг фільмів
      </Typography>
      <Rating
        max={9}
        size="large"
        sx={{ marginLeft: "-4px !important" }}
        value={fields.minimumRating}
        onChange={(_, newValue) =>
          setFields((prev) => ({
            ...prev,
            minimumRating: newValue === null ? 0 : newValue,
          }))
        }
      />
      <span>{fields.minimumRating}/10</span>
      <Divider />
      <Typography variant="subtitle1">Оберіть улюблені жанри</Typography>
      <Box sx={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
        {MOVIE_GENRES.map((genre) => (
          <FormControlLabel
            label={genre.displayName}
            control={
              <Checkbox
                checked={fields.genres.includes(genre.fieldName)}
                onChange={(event) => {
                  setFields((prev) => {
                    if (event.target.checked) {
                      return {
                        ...prev,
                        genres: [...prev.genres, genre.fieldName],
                      };
                    } else {
                      return {
                        ...prev,
                        genres: prev.genres.filter(
                          (fieldGenre) => fieldGenre !== genre.fieldName
                        ),
                      };
                    }
                  });
                }}
              />
            }
          />
        ))}
      </Box>
      <Divider />
      <Button
        variant="contained"
        endIcon={<ArrowForwardIcon />}
        // sx={{ alignSelf: "center" }}
      >
        Продовжити
      </Button>
    </Stack>
  );
}

export default PreferencesForm;
