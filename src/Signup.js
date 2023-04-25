import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { MenuItem } from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { UserContext } from "./context/UserContext";
import Axios from "axios";

const theme = createTheme();
const getOrganisations = (organisations, options = []) => {
  for (let o of organisations) {
    options.push({ value: o._id, nom: o.name });
    if (o.suborganisations.length > 0) {
      getOrganisations(o.suborganisations, options);
    }
  }
  console.log(options);
  return options;
};

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [organisation, setOrganisation] = useState(0);
  const [organisations, setOrganisations] = useState(null);
  const [formErrors, setFormErrors] = useState({
    passwordError: "",
    emailError: "",
    nameError: "",
    orgError: "",
    roleError: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userContext, setUserContext] = useContext(UserContext);
  const roles = [
    {
      value: "ADMIN",
      label: "ADMIN",
    },
    {
      value: "USER",
      label: "USER",
    },
  ];

  const checkError = (event) => {
    const { type, value } = event.target;

    if (type === "password") {
      if (value.length < 8)
        setFormErrors({ ...formErrors, passwordError: "too short" });
      else if (value === "") {
        setFormErrors({
          ...formErrors,
          passwordError: "champ requis",
        });
      } else setFormErrors({ ...formErrors, passwordError: "" });
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
      } else if (value === "")
        setFormErrors({
          ...formErrors,
          emailError: "champ requis",
        });
      else setFormErrors({ ...formErrors, emailError: "" });
    }
    if (type === "text") {
      const textRegex = new RegExp(/[\p{Letter}\s]+/gu);
      if (!value.match(textRegex)) {
        setFormErrors({
          ...formErrors,
          nameError: "invalid Name",
        });
      } else if (value === "")
        setFormErrors({
          ...formErrors,
          nameError: "champ requis",
        });
      else setFormErrors({ ...formErrors, nameError: "" });
    }
  };

  useEffect(() => {
    Axios.get(process.env.REACT_APP_HOSTNAME + "/organisations").then((res) => {
      //console.log(res.data)
      setOrganisations(res.data);
    });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setName(data.get("name"));
    setEmail(data.get("email"));
    setPassword(data.get("password"));
    setRole(data.get("role"));
    setOrganisation(data.get("organisationId"));

    await Axios.post(
      process.env.REACT_APP_HOSTNAME + "/signup",
      { name, email, password, role, organisation },
      { withCredentials: true }
    )
      .then(async (res) => {
        if (res) {
          setSuccess(true);
          const data = await res.data.data;
          alert("compte crée");
          setUserContext((oldValues) => {
            return { ...oldValues, token: data.token };
          });
        } else {
          setError("Erreur! veuillez réessayer.");
        }
      })
      .catch((error) => {
        setError("Erreur! veuillez réessayer.");
      });
  };

  return (
    <ThemeProvider theme={theme}>
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
            Créer un compte
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Nom"
                  name="name"
                  autoComplete="name"
                  type="text"
                  error={formErrors.nameError}
                  helperText={formErrors.nameError}
                  onChange={checkError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  type="email"
                  onChange={checkError}
                  error={formErrors.emailError}
                  helperText={formErrors.emailError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={checkError}
                  helperText={formErrors.passwordError}
                  error={formErrors.passwordError}
                />
              </Grid>
              {organisations && getOrganisations(organisations).length > 0 && (
                <Grid item xs={12}>
                  <TextField
                    required
                    id="organisation"
                    select
                    fullWidth
                    name="organisationId"
                    label="Organisation"
                    onChange={(event) => {
                      if (!event.target.value)
                        setFormErrors({
                          ...formErrors,
                          orgError: "champ requis",
                        });
                      else
                        setFormErrors({
                          ...formErrors,
                          orgError: "",
                        });
                    }}
                  >
                    {getOrganisations(organisations).map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.nom}
                      </MenuItem>
                    ))}
                    {/*<MenuItem key={option.value}  value={option.value}>
                      {option.nom}
                  </MenuItem>*/}
                  </TextField>
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  required
                  id="role"
                  select
                  label="Role"
                  name="role"
                  fullWidth
                  onChange={(event) => {
                    if (!event.target.value)
                      setFormErrors({
                        ...formErrors,
                        roleError: "champ requis",
                      });
                    else
                      setFormErrors({
                        ...formErrors,
                        roleError: "",
                      });
                  }}
                >
                  {roles.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={
                formErrors.emailError ||
                formErrors.nameError ||
                formErrors.passwordError ||
                formErrors.orgError ||
                formErrors.roleError
              }
            >
              Enregistrer
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/login" variant="body2">
                  Avez-vous déja un compte? Connectez-vous
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
