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
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Confetti from "./Confetti";
import Dialog from "@mui/material/Dialog";
import CircularProgress from "@mui/material/CircularProgress";

const dateFnsAdapter = new DateFnsAdapter({ locale: "uk" });

const MOVIE_GENRES = [
  { fieldName: "action", displayName: "Бойовики" },
  { fieldName: "adventure", displayName: "Пригодницькі" },
  { fieldName: "animation", displayName: "Анімація" },
  // { fieldName: "biography", displayName: "Біографічні" },
  { fieldName: "comedy", displayName: "Комедії" },
  { fieldName: "crime", displayName: "Кримінальні" },
  // { fieldName: "documentary", displayName: "Документальні" },
  { fieldName: "drama", displayName: "Драми" },
  { fieldName: "family", displayName: "Сімейні" },
  { fieldName: "fantasy", displayName: "Фантастика" },
  // { fieldName: "noir", displayName: "Нуар" },
  // { fieldName: "show", displayName: "Ток-Шоу" },
  { fieldName: "history", displayName: "Трилери" },
  { fieldName: "horror", displayName: "Жахи" },
  // { fieldName: "music", displayName: "Музикальні" },
  // { fieldName: "musical", displayName: "Мюзикли" },
  { fieldName: "mystery", displayName: "Містика" },
  // { fieldName: "news", displayName: "Новини" },
  // { fieldName: "tv", displayName: "Реаліті-телебачення" },
  { fieldName: "romance", displayName: "Романтичні" },
  { fieldName: "fi", displayName: "Наукова-фантастика" },
  { fieldName: "sport", displayName: "Спорт" },
  { fieldName: "war", displayName: "Війна" },
  // { fieldName: "western", displayName: "Вестерни" },
];

const WATCH_TIMES = [
  "10:00 - 12:00",
  "13:00 - 15:00",
  "15:30 - 17:30",
  "18:30 - 20:30",
  "21:00 - 23:00",
  "23:30 - 01:30",
];

const MOVIE_COUNTRIES = [
  { code: "ua", name: "Україна" },
  { code: "us", name: "США" },
  { code: "gb", name: "Великобританія" },
  { code: "fr", name: "Франція" },
  { code: "es", name: "Іспанія" },
  { code: "it", name: "Італія" },
  { code: "de", name: "Німеччина" },
  { code: "se", name: "Швеція" },
  { code: "no", name: "Норвегія" },
  { code: "dk", name: "Данія" },
  { code: "jp", name: "Японія" },
  { code: "kr", name: "Південна Корея" },
];
function formatDate(date) {
  return format(date, "dd.MM.yyyy");
}

function parseDate(formattedDate) {
  return parse(formattedDate, "dd.MM.yyyy", new Date());
}

const preferencesFormSchema = Yup.object({
  genres: Yup.array()
    .min(1, "Необхідно обрати мінімум один жанр")
    .max(5, "Виберіть не більше 5 жанрів"),
  minimumRating: Yup.number(),
  minimumReleaseYear: Yup.number()
    .typeError("Введіть рік")
    .min(1960, "Мінімальний рік не може бути менше ніж 1960")
    .max(new Date().getFullYear(), "Майбутні роки не дійсні"),
  sortBy: Yup.string(),
  country: Yup.string(),
  watchDates: Yup.array().min(1, "Оберіть хоча б одну дату"),
  preferredWathTimes: Yup.array()
    .min(1, "Оберіть хоча б одну опцію")
    .max(3, "Не більше 3"),
});

function PreferencesForm({
  setAppFields,
  authFields,
  appFields,
  redirectTo,
  setMovies,
  setIsFetching,
  isFetching,
}) {
  const [isWatchDatesPickerOpen, setIsWatchDatesPickerOpen] =
    React.useState(false);
  const { register, handleSubmit, formState, setValue, getValues, watch } =
    useForm({
      defaultValues: appFields,
      resolver: yupResolver(preferencesFormSchema),
    });
  const [showConfetti, setShowConfetti] = React.useState(false);
  const [showDialog, setShowDialog] = React.useState(false);

  const fields = watch();
  register("watchDates");

  function submitHandler(finalFields) {
    setShowConfetti(true);
    setShowDialog(true);
    setAppFields(finalFields);
  }

  function moveToSchedule() {
    setIsFetching(true);
    const { watchDates, genres } = appFields;
    const filmsPerGenre = watchDates.length / genres.length;
    const areGenresMoreThanWatchDates = filmsPerGenre < 1;
    let result;
    if (areGenresMoreThanWatchDates) {
      result = Promise.all(watchDates.map((_, i) => fetchFilms(genres[i], 1)));
    } else {
      result = Promise.all(
        genres.map((genre, i) =>
          fetchFilms(
            genre,
            i === 0
              ? Math.floor(filmsPerGenre) +
                  watchDates.length -
                  Math.floor(filmsPerGenre) * genres.length
              : Math.floor(filmsPerGenre)
          )
        )
      );
    }
    result
      .then((results) => Promise.all(results.map((res) => res.json())))
      .then((parsedResults) => {
        setMovies(
          parsedResults.reduce(
            (allFilms, nextFilm) => [...allFilms, ...nextFilm.results],
            []
          )
        );
        setIsFetching(false);
        redirectTo("schedule");
      });

    function fetchFilms(genre, count) {
      return fetch(
        `${API.url}/AdvancedSearch/${
          API.key
        }?title_type=feature&genres=${genre}&user_rating=${
          appFields.minimumRating
        },&count=${count}&sort=${appFields.sortBy},${
          appFields.sortBy == "moviemeter" ? "asc" : "desc"
        }&num_votes=${
          appFields.country == "ua" ? "300" : "1000"
        },&release_date=${appFields.minimumReleaseYear},${
          appFields.country != "none" ? "&countries=" + appFields.country : ""
        }`
      );
    }
  }

  const openWatchDatesPickerButtonRef = React.useRef(null);
  const dialogRootRef = React.useRef(null);

  return (
    <Stack
      spacing={1}
      alignItems="start"
      sx={{
        alignItems: "start",
        ".MuiDivider-root": { alignSelf: "stretch" },
        paddingBottom: "8px",
        ".MuiFormHelperText-root": {
          margin: 0,
        },
        ".MuiFormControl-root": {
          gap: "8px",
        },
      }}
      component="form"
      onSubmit={handleSubmit(submitHandler)}
    >
      {showConfetti && <Confetti containerRef={dialogRootRef} />}
      <Dialog open={showDialog} ref={dialogRootRef}>
        <Stack sx={{ padding: "24px" }} spacing={2}>
          <Typography variant="h5">
            Це все &#129395; Дякуємо за ваш час!{" "}
          </Typography>
          <Typography variant="body1">
            Далі вам буде показано приклад згенерованого розкладу фільмів
          </Typography>
          <Box sx={{ display: "flex", gap: "16px" }}>
            <Button
              variant="contained"
              sx={{ alignSelf: "start" }}
              onClick={moveToSchedule}
            >
              Зрозуміло
            </Button>
            {isFetching && <CircularProgress size={36.5} />}
          </Box>
        </Stack>
      </Dialog>
      <Typography variant="h5" sx={{ fontWeight: 500, marginTop: "8px" }}>
        {authFields.name}, заповніть цю форму для того, щоб ми могли підібрати
        для вас оптимальний список фільмів
      </Typography>
      <Divider />
      <FormControl error={"genres" in formState.errors} sx={{ gap: "8px" }}>
        <FormLabel component="legend">Оберіть улюблені жанри</FormLabel>
        <FormGroup row component="fieldset">
          {MOVIE_GENRES.map((genre) => (
            <FormControlLabel
              key={genre.fieldName}
              label={genre.displayName}
              control={
                <Checkbox
                  {...register("genres")}
                  value={genre.fieldName}
                  checked={fields.genres.includes(genre.fieldName)}
                />
              }
            />
          ))}
        </FormGroup>
        {"genres" in formState.errors && (
          <FormHelperText>{formState.errors.genres?.message}</FormHelperText>
        )}
      </FormControl>
      <Divider />
      <FormControl sx={{ gap: "8px" }}>
        <FormLabel>Мінімальний рейтинг</FormLabel>
        <Rating
          max={9}
          size="large"
          sx={{ marginLeft: "-4px !important" }}
          value={fields.minimumRating}
          onChange={(_, newValue) =>
            setValue("minimumRating", newValue === null ? 0 : newValue)
          }
        />
      </FormControl>
      <span>{fields.minimumRating}/10</span>
      <Divider />
      <FormControl
        error={"minimumReleaseYear" in formState.errors}
        sx={{ gap: "8px" }}
      >
        <FormLabel>Мінімальний рік випуску</FormLabel>
        <TextField
          type="number"
          size="small"
          {...register("minimumReleaseYear")}
        />
        {"minimumReleaseYear" in formState.errors && (
          <FormHelperText>
            {formState.errors.minimumReleaseYear?.message}
          </FormHelperText>
        )}
      </FormControl>
      <Divider />
      <FormControl sx={{ gap: "8px" }}>
        <FormLabel>Країна походження</FormLabel>
        <Select
          size="small"
          value={fields.country}
          onChange={(event) => setValue("country", event.target.value)}
          sx={{ maxHeight: "50px" }}
        >
          <MenuItem value="none">Немає значення</MenuItem>
          {MOVIE_COUNTRIES.map((country) => (
            <MenuItem key={country.code} value={country.code}>
              {country.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Divider />
      <FormControl error={"watchDates" in formState.errors} sx={{ gap: "8px" }}>
        <FormLabel>Бажані дати перегляду</FormLabel>
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
          onChange={(newDate) => {
            const formattedDate = formatDate(newDate || new Date());
            const { watchDates: prevDates } = fields;
            if (prevDates.includes(formattedDate)) {
              setValue(
                "watchDates",
                prevDates.filter((date) => date != formattedDate),
                { shouldValidate: true }
              );
            } else {
              setValue("watchDates", [...prevDates, formattedDate], {
                shouldValidate: true,
              });
            }
          }}
          disablePast
        />
        {"watchDates" in formState.errors && (
          <FormHelperText>
            {formState.errors.watchDates?.message}
          </FormHelperText>
        )}
        {fields.watchDates.length > 0 && (
          <List sx={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {fields.watchDates
              .sort((date1, date2) =>
                compareAsc(parseDate(date1), parseDate(date2))
              )
              .map((date) => (
                <ListItem key={date} sx={{ padding: 0, width: "auto" }}>
                  <Chip
                    label={date}
                    onDelete={() =>
                      setValue(
                        "watchDates",
                        fields.watchDates.filter(
                          (fieldDate) => date != fieldDate
                        ),
                        { shouldValidate: true }
                      )
                    }
                  />
                </ListItem>
              ))}
          </List>
        )}
      </FormControl>
      <Divider />
      <FormControl
        error={"preferredWathTimes" in formState.errors}
        sx={{ gap: "8px" }}
      >
        <FormLabel component="legend">Оберіть бажані часи перегляду</FormLabel>
        <FormGroup row component="fieldset">
          {WATCH_TIMES.map((time) => (
            <FormControlLabel
              key={time}
              label={time}
              control={
                <Checkbox
                  {...register("preferredWathTimes")}
                  value={time}
                  checked={fields.preferredWathTimes.includes(time)}
                />
              }
            />
          ))}
        </FormGroup>
        {"preferredWathTimes" in formState.errors && (
          <FormHelperText>
            {formState.errors.preferredWathTimes?.message}
          </FormHelperText>
        )}
      </FormControl>
      <Divider />
      <FormControl sx={{ gap: "8px" }}>
        <FormLabel>Пріоритезувати фільми за</FormLabel>
        <RadioGroup
          onChange={(event) => setValue("sortBy", event.target.value)}
          value={fields.sortBy}
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
      </FormControl>
      <Divider />
      <Button
        variant="contained"
        endIcon={<ArrowForwardIcon />}
        disabled={showDialog}
        type="submit"
      >
        Продовжити
      </Button>
    </Stack>
  );
}

export default PreferencesForm;
