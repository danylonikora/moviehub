import React from "react";
import Layout from "./components/Layout";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ukLocale from "date-fns/locale/uk";
import Auth from "./components/Auth";
import PreferencesForm from "./components/PreferencesForm";
import MovieSchedule from "./components/MovieSchedule";

const routeHistory = [];

function App() {
  const [currentPage, setCurrentPage] = React.useState("auth");
  const [authFields, setAuthFields] = React.useState({
    name: undefined,
    room: undefined,
    stayDuration: undefined,
  });
  const [formFields, setFormFields] = React.useState({
    genres: [],
    minimumRating: 6,
    minimumReleaseYear: 2010,
    watchDates: [],
    preferredWathTimes: [],
    sortBy: "moviemeter",
    country: "none",
  });
  const [movies, setMovies] = React.useState(null);
  const [isFetching, setIsFetching] = React.useState(false);

  function redirectTo(page) {
    routeHistory.push(page);
    window.scrollTo(0, 0);
    setCurrentPage(page);
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ukLocale}>
      <Layout
        currentPage={currentPage}
        redirectTo={redirectTo}
        routeHistory={routeHistory}
      >
        {currentPage == "auth" && (
          <Auth
            setAppFields={setAuthFields}
            appFields={authFields}
            redirectTo={redirectTo}
          />
        )}
        {currentPage == "form" && (
          <PreferencesForm
            setAppFields={setFormFields}
            appFields={formFields}
            authFields={authFields}
            redirectTo={redirectTo}
            setMovies={setMovies}
            setIsFetching={setIsFetching}
            isFetching={isFetching}
          />
        )}
        {currentPage == "schedule" && (
          <MovieSchedule movies={movies} formFields={formFields} />
        )}
      </Layout>
    </LocalizationProvider>
  );
}

export default App;
