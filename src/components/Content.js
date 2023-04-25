import React, { useCallback, useState } from "react";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import SearchIcon from "@mui/icons-material/Search";

import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box } from "@mui/system";

import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";

// Custom-components & utils
import ProgressBar from "./ProgressBar";
import FilesList from "./FilesList";
import formatBytes from "../utils/formatBytes";
import { Alert, MenuItem } from "@mui/material";
import { useEffect } from "react";
import dayjs from "dayjs";

export const uploadPhotos = async (
  file,
  data,
  setProgress,
  setError,
  setSuccess,
  token
) => {
  console.log(data);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("description", data.description);
  formData.append("nArticle", data.nArticle);
  formData.append("title", data.title);
  formData.append("observation", data.observation);
  formData.append("dateExtreme", data.dateExtreme);
  formData.append("dateElimination", data.dateElimination);
  formData.append("boiteId", data.boiteId);

  // for (let i = 0; i < files.length; i += 1) {
  //   formData.append("file", files[i]);
  // }
  const config = {
    withCredentials: true,
    headers: {
      "Content-Type": `multipart/form-data`,
      Authorization: `Bearer ${token}`,
    },
    onUploadProgress: (data) => {
      //Set the progress value to show the progress bar
      setProgress(Math.round((100 * data.loaded) / data.total));
    },
  };

  try {
    await axios
      .post(process.env.REACT_APP_HOSTNAME + "/upload", formData, config)
      .then((res) => {
        console.log(res.data);
        setSuccess(true);
        alert("fichier crée !");
      })
      .catch((error) => {
        if (error.response.data.length === 1) setError(error.response.data);
        else setError("Erreur");
      });
  } catch (error) {
    console.log(error);

    const { code } = error;
    switch (code) {
      case "FILE_MISSING":
        setError("Please select a file before uploading!");
        break;
      case "LIMIT_FILE_SIZE":
        setError("File size is too large. Please upload files below 1MB!");
        break;
      case "INVALID_TYPE":
        setError(
          "This file type is not supported! Only .png, .jpg and .jpeg files are allowed"
        );
        break;

      default:
        setError(error?.message);
        console.log(error?.message);
        break;
    }
  } finally {
    console.log("done");
  }
};

export default function Content(props) {
  const { t } = useTranslation();
  const { token } = props;
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [boites, setBoites] = useState(null);
  const [file, setFile] = useState(null);
  const [data, setData] = useState({
    title: file ? file.name : "",
    nArticle: "",
    description: "",
    dateExtreme: null,
    dateElimination: null,
    observation: "",
    boiteId: 0,
  });
  const [formValues, setFormValues] = useState(data);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_HOSTNAME + "/boitesByOrganisation", {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        //console.log(res.data)
        setBoites(res.data);
      });
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formValues);
    uploadPhotos(file, formValues, setProgress, setError, setSuccess, token);
  };

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        console.log(binaryStr);
      };
      reader.readAsArrayBuffer(file);
      setFile(file);
      //uploadPhotos(file, setProgress, setError,setSuccess);
    });
  }, []);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  const files = acceptedFiles.map((file) => {
    const size = formatBytes(file.size);
    return (
      <>
        {file.path} - {size}
      </>
    );
  });

  return (
    <Paper sx={{ margin: "auto", overflow: "hidden" }}>
      {success && <Alert severity="success">File created!</Alert>}
      {error && !success && <Alert severity="warning">{error}</Alert>}
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
      >
        <Toolbar>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <SearchIcon color="inherit" sx={{ display: "block" }} />
            </Grid>
            <Grid item xs>
              <TextField
                fullWidth
                placeholder={t("Search placeholder")}
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: "default" },
                }}
                variant="standard"
              />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      <Box>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <Paper
            variant="outlined"
            sx={{ m: 2, border: "3px dashed rgba(0, 0, 0, 0.12)", p: 2 }}
          >
            <Box sx={{ my: 5, mx: 2 }}>
              <DriveFolderUploadIcon
                color="primary"
                sx={{
                  display: "block",
                  margin: "auto",
                  transform: "scale(4.8)",
                }}
              />
              <Typography
                color="text.secondary"
                align="center"
                sx={{ marginTop: 5 }}
              >
                {t("Drag and drop zone")}
              </Typography>
            </Box>
          </Paper>
        </div>
        <Box sx={{ p: 2 }}>
          {progress > 0 && <ProgressBar progress={progress} />}
          {files.length > 0 && <Typography>{t("Files")}</Typography>}
          {files.map((el, i) => {
            return (
              <div>
                <FilesList file={el} key={i} />
                <Box
                  component="form"
                  sx={{
                    "& .MuiTextField-root": { m: 1, width: "25ch" },
                  }}
                  noValidate
                  autoComplete="off"
                  onSubmit={handleSubmit}
                >
                  <Grid
                    container
                    alignItems="center"
                    justify="center"
                    direction="column"
                  >
                    <Grid item>
                      <TextField
                        required
                        id="narticle-input"
                        name="nArticle"
                        label="N Article"
                        type="text"
                        value={formValues.nArticle}
                        onChange={handleInputChange}
                      />
                      <TextField
                        id="title-input"
                        name="title"
                        label="Titre"
                        type="text"
                        placeholder={el.name}
                        value={formValues.title}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DatePicker"]}>
                          <DatePicker
                            required
                            label="Date Extrême"
                            name="dateExtreme"
                            selected={formValues.dateExtreme}
                            onChange={(e) => {
                              setFormValues({
                                ...formValues,
                                dateExtreme: new Date(e),
                              });
                            }}
                            dateFormat="dd/MM/YYYY"
                            minDate={dayjs()}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                      <TextField
                        required
                        multiline
                        id="desc-input"
                        name="description"
                        label="Description"
                        type="text"
                        value={formValues.description}
                        onChange={handleInputChange}
                      />

                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DatePicker"]}>
                          <DatePicker
                            required
                            label="Date Elimination"
                            name="dateElimination"
                            selected={formValues.dateElimination}
                            onChange={(e) => {
                              setFormValues({
                                ...formValues,
                                dateElimination: new Date(e),
                              });
                            }}
                            dateFormat="dd/MM/YYYY"
                            minDate={dayjs(formValues.dateExtreme)}
                          />
                        </DemoContainer>
                      </LocalizationProvider>

                      <TextField
                        required
                        multiline
                        id="obs-input"
                        name="observation"
                        label="Observation"
                        type="text"
                        value={formValues.observation}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item>
                      {boites && (
                        <TextField
                          required
                          select
                          id="demo-simple-select"
                          name="boiteId"
                          value={formValues.boiteId}
                          label="N Boite"
                          onChange={handleInputChange}
                        >
                          {boites.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                              Boite N {option.nbBoite} Salle {option.nbSalle}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    </Grid>
                    <Button variant="contained" color="primary" type="submit">
                      Enregistrer
                    </Button>
                  </Grid>
                </Box>{" "}
              </div>
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
}
