import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { UserContext } from "./context/UserContext";
import { Alert } from "@mui/material";

const theme = createTheme();

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({
    passwordError: "",
    emailError: "",
  });
  const [userContext, setUserContext] = useContext(UserContext);

  const navigate = useNavigate();

  const checkError = (event) => {
    const { type, value } = event.target;

    if (type === "password") {
      if (value.length < 8) {
        setFormErrors({ ...formErrors, passwordError: "too short" });
      } else if (value === "") {
        setFormErrors({
          ...formErrors,
          passwordError: "champ requis",
        });
      } else {
        setFormErrors({ ...formErrors, passwordError: "" });
        console.log(type);
        console.log(value);
        setPassword(value);
      }
    }

    if (type === "email") {
      const emailRegex = new RegExp(
        // /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
        /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
      );

      if (!value.match(emailRegex)) {
        setFormErrors({
          ...formErrors,
          emailError: "invalid email format",
        });
      } else if (value === "") {
        setFormErrors({
          ...formErrors,
          emailError: "champ requis",
        });
      } else {
        setFormErrors({ ...formErrors, emailError: "" });
        console.log(type);
        console.log(value);
        setEmail(value);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });

    await Axios.post(
      process.env.REACT_APP_HOSTNAME + "/login",
      { email, password },
      { withCredentials: true }
    )
      .then(async (res) => {
        if (res) {
          const data = await res.data.data;
          setUserContext((oldValues) => {
            return { ...oldValues, token: data.token };
          });

          navigate("/");
        } else {
          setError(
            "Erreur! vérifier vos informations ou la validation de votre compte."
          );
        }
      })
      .catch((error) => {
        setError("Erreur! veuillez réessayer.");
      });
  };

  return (
    <ThemeProvider theme={theme}>
      {error && <Alert severity="warning">{error}</Alert>}

      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Authentification
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              type="email"
              onChange={checkError}
              helperText={formErrors.emailError}
              error={formErrors.emailError}
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={checkError}
              helperText={formErrors.passwordError}
              error={formErrors.passwordError}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={formErrors.emailError || formErrors.passwordError}
            >
              Connecter
            </Button>
            <Grid container>
              {/*<Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
                </Grid>*/}
              <Grid item>
                <Link to="/signup" variant="body2">
                  {"Vous n'avez pas un compte? Créer un compte"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
