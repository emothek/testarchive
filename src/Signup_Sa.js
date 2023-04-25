import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { UserContext } from "./context/UserContext";
import Axios from "axios";

const theme = createTheme();

export default function SignUpSa() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [logo, setLogo] = useState(null);
  const [organisation, setOrganisation] = useState({
    name: "",
    description: "",
    logo: null,
  });
  const [formErrors, setFormErrors] = useState({
    passwordError: "",
    emailError: "",
    nameError: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  //const [organisations,setOrganisations]=useState(null)
  const [userContext, setUserContext] = useContext(UserContext);

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
  const handleChange = (e) => {
    setLogo(e.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const fd = new FormData();

    //console.log(data.get('logo'))
    setName(data.get("name"));
    setEmail(data.get("email"));
    setPassword(data.get("password"));
    setRole("SUPERADMIN");
    setOrganisation({
      name: data.get("organisation.name"),
      description: data.get("organisation.description"),
    });
    fd.append("file", logo);
    fd.append("name", organisation.name);
    fd.append("description", organisation.description);
    console.log(organisation);
    await Axios.post(process.env.REACT_APP_HOSTNAME + "/organisation", fd, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((res) => {
      console.log(res.data);
      let org = res.data;
      let organisation = org.id;
      Axios.post(
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
                  error={formErrors.nameError}
                  fullWidth
                  id="name"
                  label="Nom"
                  name="name"
                  type="text"
                  autoComplete="name"
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
                  type="email"
                  name="email"
                  autoComplete="email"
                  error={formErrors.emailError}
                  helperText={formErrors.emailError}
                  onChange={checkError}
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
                  helperText={formErrors.passwordError}
                  error={formErrors.passwordError}
                  onChange={checkError}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography color="primary">
                  Ajouter les coordonnées de votre organisation
                </Typography>
                <TextField
                  required
                  fullWidth
                  name="organisation.name"
                  label="Nom Organisation"
                  type="text"
                  error={formErrors.nameError}
                  helperText={formErrors.nameError}
                  onChange={checkError}
                  id="nom"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  name="organisation.description"
                  label="Description"
                  id="desc"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  type="file"
                  helperText="Sélectionner un Logo"
                  onChange={handleChange}
                />
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
                formErrors.passwordError
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
