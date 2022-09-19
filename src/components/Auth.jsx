import React from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { AuthContext } from "../App";
import { Link } from "react-router-dom";

function Auth() {
  const authInfo = React.useContext(AuthContext);
  const [fields, setFields] = React.useState(authInfo.fields);

  return (
    <Stack spacing={2} sx={{ alignItems: "center", margin: "auto" }}>
      <Typography variant="h6" sx={{ fontWeight: 500, color: "red" }}>
        Шоб ничего не наебнулось заполняй все поля, а если наебнулось -
        перезагрузи страницу и побробуй заново
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 500 }}>
        Авторизація
      </Typography>
      <TextField
        label="Ім'я"
        onChange={(event) =>
          setFields((prev) => ({ ...prev, name: event.target.value }))
        }
      />
      <TextField
        label="Номер кімнати"
        type="number"
        onChange={(event) =>
          setFields((prev) => ({ ...prev, room: Number(event.target.value) }))
        }
      />
      <TextField
        label="Тривалість перебування"
        type="number"
        onChange={(event) =>
          setFields((prev) => ({
            ...prev,
            stayDuration: Number(event.target.value),
          }))
        }
      />
      <Button
        variant="contained"
        to="/form"
        component={Link}
        onClick={() => authInfo.setFields(fields)}
      >
        Увійти
      </Button>
    </Stack>
  );
}

export default Auth;
