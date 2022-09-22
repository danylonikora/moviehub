import React from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

const authFieldsSchema = Yup.object({
  name: Yup.string().required("Введіть своє ім'я"),
  room: Yup.number()
    .typeError("Вкажіть число")
    .min(1, "Не дійсна кімната")
    .max(80, "Готель має тільки 80 кімнат")
    .required("Введіть номер вашої кімнати"),
  stayDuration: Yup.number()
    .typeError("Вкажіть число")
    .min(1, "Не дійсна тривалість перебування")
    .max(30, "Максимум 30 днів")
    .required("Введіть тривалість вашого перебування"),
});

function Auth({ setAppFields, appFields, redirectTo }) {
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(authFieldsSchema),
    defaultValues: appFields,
  });

  return (
    <Stack
      spacing={2}
      sx={{ alignItems: "center", margin: "auto", marginTop: "60px" }}
      component="form"
      onSubmit={handleSubmit((data) => {
        setAppFields(data);
        redirectTo("form");
      })}
    >
      <Typography variant="h5">Авторизація</Typography>
      <TextField
        {...register("name")}
        label="Ім'я"
        error={"name" in formState.errors}
        helperText={formState.errors?.name?.message}
      />
      <TextField
        {...register("room")}
        error={"room" in formState.errors}
        helperText={formState.errors?.room?.message}
        label="Номер кімнати"
        type="number"
      />
      <TextField
        {...register("stayDuration")}
        error={"stayDuration" in formState.errors}
        helperText={formState.errors?.stayDuration?.message}
        label="Тривалість перебування"
        type="number"
      />
      <Button variant="contained" type="submit">
        Увійти
      </Button>
    </Stack>
  );
}

export default Auth;
