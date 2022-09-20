import React from "react";
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
import { API } from "../constants/api";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import spinnerSvg from "../assets/spinner.svg";

const dateFnsAdapter = new DateFnsAdapter({ locale: "uk" });

const MOVIE_GENRES = [
  { fieldName: "action", displayName: "Бойовики" },
  { fieldName: "adventure", displayName: "Пригодницькі" },
  { fieldName: "animation", displayName: "Анімація" },
  // { fieldName: "biography", displayName: "Біографічні" },
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
  { fieldName: "western", displayName: "Вестертни" },
];
function formatDate(date) {
  return format(date, "dd.MM.yyyy");
}

function parseDate(formattedDate) {
  return parse(formattedDate, "dd.MM.yyyy", new Date());
}

function PreferencesForm({
  setAppFields,
  authFields,
  appFields,
  redirectTo,
  setMovies,
  setIsFetching,
  isFetching,
}) {
  const [fields, setFields] = React.useState(appFields);
  const [isWatchDatesPickerOpen, setIsWatchDatesPickerOpen] =
    React.useState(false);
  const openWatchDatesPickerButtonRef = React.useRef(null);

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
        {authFields.name}, заповніть цю форму для того, щоб ми могли підібрати
        для вас оптимальний список фільмів
      </Typography>
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
        maxDate={addDays(new Date(), authFields.stayDuration - 1)}
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
        renderInput={() => {
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
            const formattedDate = formatDate(newDate || new Date());
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
      <Typography variant="subtitle1">Пріоритезувати фільми за</Typography>
      <RadioGroup
        value={fields.sortBy}
        onChange={(event) =>
          setFields((prev) => ({ ...prev, sortBy: event.target.value }))
        }
      >
        <FormControlLabel
          value="moviemeter"
          control={<Radio />}
          label="популярністю"
        />
        <FormControlLabel
          value="user_rating"
          control={<Radio />}
          label="рейтингом"
        />
        <FormControlLabel
          value="release_date"
          control={<Radio />}
          label="датою випуску"
        />
      </RadioGroup>
      <Divider />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          disabled={isFetching}
          onClick={() => {
            setAppFields(fields);
            setIsFetching(true);
            fetch(
              `${API.url}/AdvancedSearch/${
                API.key
              }?title_type=feature&genres=${fields.genres.join(
                ","
              )}&user_rating=${fields.minimumRating},&count=${
                fields.watchDates.length
              }&sort=${fields.sortBy},${
                fields.sortBy == "moviemeter" ? "asc" : "desc"
              }&num_votes=1000,&languages=uk`
            )
              .then((res) => {
                if (res.status != 200) {
                  throw new Error(
                    "Fetch error. Got " + result.status + " status code"
                  );
                }
                return res.json();
              })
              .then((parsedRes) => {
                console.log(parsedRes);
                setMovies(parsedRes.results);
                setIsFetching(false);
                redirectTo("schedule");
              });
          }}
        >
          Продовжити
        </Button>
        {isFetching && (
          <img
            src={spinnerSvg}
            style={{
              height: "30px",
              width: "30px",
            }}
          />
        )}
      </Box>
      <Typography variant="h6" sx={{ color: "red" }}>
        Вот эту кнопку не насилуйте, у нас ограничение на количество запросов к
        базе данных с фильмами, так шо не больше 100 "продовжити" в день на всех
      </Typography>
    </Stack>
  );
}

export default PreferencesForm;
