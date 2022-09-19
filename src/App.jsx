import React from "react";
import Layout from "./components/Layout";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ukLocale from "date-fns/locale/uk";

const authContextDefaultValue = { name: "", room: -1, stayDuration: -1 };
export const AuthContext = React.createContext(authContextDefaultValue);

function AuthContextProvider({ children }) {
  const [fields, setFields] = React.useState(authContextDefaultValue);

  return (
    <AuthContext.Provider value={{ fields, setFields }}>
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        adapterLocale={ukLocale}
      >
        {children}
      </LocalizationProvider>
    </AuthContext.Provider>
  );
}

const preferencesFormDefaultValue = {
  minimumRating: 6,
  genres: [],
  watchDates: [],
};
export const PreferencesFormContext = React.createContext(
  preferencesFormDefaultValue
);

function PreferencesFormContextProvider({ children }) {
  const [fields, setFields] = React.useState(preferencesFormDefaultValue);

  return (
    <PreferencesFormContext.Provider value={{ fields, setFields }}>
      {children}
    </PreferencesFormContext.Provider>
  );
}

function App() {
  return (
    <AuthContextProvider>
      <PreferencesFormContextProvider>
        <Layout />
      </PreferencesFormContextProvider>
    </AuthContextProvider>
  );
}

export default App;
