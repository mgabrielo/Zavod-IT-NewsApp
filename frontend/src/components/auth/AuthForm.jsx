import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";

const AuthForm = ({
  title,
  onSubmit,
  isSubmitting,
  register,
  errors,
  control,
  password,
}) => {
  return (
    <form
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
      onSubmit={onSubmit}
    >
      {title === "Register" && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <InputLabel aria-label="username"></InputLabel>
          <TextField
            variant="outlined"
            type="text"
            aria-label="username"
            label="Username"
            size="small"
            placeholder="Enter Username"
            helperText={
              Boolean(errors.username)
                ? "Username must be up to 2 characters"
                : ""
            }
            error={Boolean(errors.username)}
            {...register("username", { required: true })}
          />
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <InputLabel aria-label="email"></InputLabel>
        <TextField
          variant="outlined"
          type="email"
          fullWidth
          aria-label="email"
          size="small"
          label="Email"
          placeholder="Enter Email"
          helperText={Boolean(errors.email) ? "Email Field is Required" : ""}
          error={Boolean(errors.email)}
          {...register("email", {
            required: "true",
            validate: (val) =>
              /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val),
          })}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <InputLabel aria-label="pasword"></InputLabel>
        <TextField
          variant="outlined"
          type="password"
          aria-label="password"
          label="Password"
          placeholder="Enter Password"
          size="small"
          fullWidth
          helperText={
            Boolean(errors.password)
              ? "Password Field is Required and Must be Up to Six Characters"
              : ""
          }
          error={Boolean(errors.password)}
          {...register("password", { required: true, minLength: 6 })}
        />
      </Box>
      {title === "Register" && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <InputLabel aria-label="Confirm Password"></InputLabel>
          <Controller
            name="confirmPassword"
            control={control}
            defaultValue=""
            rules={{
              required: "Confirm Password is required",
              validate: (value) =>
                value === password || "Passwords do not match",
            }}
            render={({ field }) => (
              <TextField
                variant="outlined"
                type="password"
                aria-label="Confirm Password"
                label="Confirm Password"
                placeholder="Confirm Your Password"
                size="small"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                {...field}
              />
            )}
          />
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          py: 1,
        }}
      >
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          sx={{ textTransform: "capitalize", width: "90%" }}
        >
          {title}
        </Button>
      </Box>
    </form>
  );
};

export default AuthForm;
