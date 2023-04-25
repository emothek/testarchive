import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
//import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from "@mui/material/DialogTitle";
import DataTablePagination from "./TablePagination";
import AppBar from "@mui/material/AppBar";

import Toolbar from "@mui/material/Toolbar";

import Paper from "@mui/material/Paper";
import SearchIcon from "@mui/icons-material/Search";
import Axios from "axios";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useTranslation } from "react-i18next";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";
import dayjs from "dayjs";
import { MenuItem } from "@mui/material";

const data = {
  nbv: 0,
  date_versement: null,
  //authorId:0,
  direction: "",
  sous_direction: "",
  service: "",
  intitule: "",
  dateExtreme: null,
  nbr_articles: 0,
  localisation: "",
  metrageLineaire: 0,
  etatPhysique: "",
  nomRSVersante: "",
  nomRSvPreArchivage: "",
};
const headCells = [
  {
    id: "nbv",
    numeric: true,
    disablePadding: true,
    label: "N Slip",
  },
  {
    id: "date_versement",
    numeric: true,
    disablePadding: false,
    label: "Date",
  },
  {
    id: "sv",
    numeric: false,
    disablePadding: false,
    label: "service",
  },
  {
    id: "intitule",
    numeric: false,
    disablePadding: false,
    label: "entitled",
  },
  {
    id: "dateExtreme",
    numeric: true,
    disablePadding: false,
    label: "extreme date",
  },
];

const BvList = (props) => {
  const [formValues, setFormValues] = useState(data);
  const [open, setOpen] = useState(false);
  const [openDr, setOpenDr] = useState(false);
  const [bordereaux, setBordereaux] = useState(null);
  const [content, setContent] = useState("");
  const [filterB, setFilterB] = useState(bordereaux);
  const [formErrors, setFormErrors] = useState({
    numError: "",
    //dateError: "",
  });
  const [searchItem, setSearchItem] = useState("");
  const { token } = props;
  const [dateType, setDateType] = useState("");
  const { t } = useTranslation();
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);

  useEffect(() => {
    setContent("bv");
    if (searchItem === "") {
      Axios.get(process.env.REACT_APP_HOSTNAME + "/bordereaux", {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          //console.log(res.data)
          setBordereaux(res.data);
          setFilterB(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [token, searchItem]);

  const checkError = (event) => {
    const { type, value } = event.target;
    //let d= new Date()
    if (type === "number") {
      if (value < 1)
        setFormErrors({ ...formErrors, numError: "valeur invalide" });
      else setFormErrors({ ...formErrors, numError: "" });
    }
  };

  const handleOpenRange = () => setOpenDr((openDr) => !openDr);

  const SearchDate = async () => {
    console.log(dateType, state);
    let filtered = null;
    if (dateType === "date_versement") {
      filtered = bordereaux.filter((bv) => {
        return (
          new Date(bv.date_versement).getTime() >=
            state[0].startDate.getTime() &&
          new Date(bv.date_versement).getTime() <= state[0].endDate.getTime()
        );
      });
    } else if (dateType === "dateExtreme") {
      filtered = bordereaux.filter((bv) => {
        return (
          new Date(bv.dateExtreme).getTime() >= state[0].startDate.getTime() &&
          new Date(bv.dateExtreme).getTime() <= state[0].endDate.getTime()
        );
      });
    }

    if (filtered.length > 0) setFilterB(filtered);
    else {
      alert("Aucun resultat");
      setFilterB(bordereaux);
    }

    handleCloseDr();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseDr = () => {
    setOpenDr(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
    checkError(e);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formValues);
    await Axios.post(
      process.env.REACT_APP_HOSTNAME + "/bordereau",
      formValues,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      }
    ).then((res) => {
      alert("ajout avec succés");
    });
  };
  /*const handleSearch = e => {
    let target = e.target;
    setFilterB({
        b: bvs => {
            if (target.value === "")
                return bvs;
            else
                return bvs.filter(x => x.nbv.toString().includes(target.value))
        }
    })
}*/
  const handleSearch = (e) => {
    let target = e.target;
    setSearchItem(target.value.replace(/ /g, "&"));
  };
  const Search = async (e) => {
    if (e.key === "Enter") {
      const res = await Axios.get(
        process.env.REACT_APP_HOSTNAME + "/bv/search?q=" + searchItem.trim(),
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.length > 0) setFilterB(res.data);
      else alert("Aucun Resultat");
    }
  };
  return (
    <div>
      <AppBar
        component="div"
        position="static"
        elevation={0}
        sx={{ zIndex: 0 }}
      >
        <div>
          <Box
            component="main"
            sx={{ flex: 1, py: 6, px: 4, bgcolor: "#eaeff1" }}
          >
            <Button variant="outlined" onClick={handleClickOpen}>
              Ajouter un Bordereau de versement
            </Button>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Ajout</DialogTitle>
              <DialogContent>
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
                        id="nv-input"
                        name="nbv"
                        label="N Bordereau de versement"
                        type="number"
                        value={formValues.nbv}
                        onChange={handleInputChange}
                        error={formErrors.numError}
                        helperText={formErrors.numError}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        required
                        id="direction-input"
                        name="direction"
                        label="Direction"
                        type="text"
                        value={formValues.direction}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        required
                        id="sdirection-input"
                        name="sous_direction"
                        label="Sous Direction"
                        type="text"
                        value={formValues.sous_direction}
                        onChange={handleInputChange}
                      />
                    </Grid>

                    <Grid item>
                      <TextField
                        required
                        id="service-input"
                        name="service"
                        label="Service"
                        type="text"
                        value={formValues.service}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DatePicker"]}>
                          <DatePicker
                            required
                            label="Date Versement"
                            name="date_versement"
                            selected={formValues.date_versement}
                            onChange={(e) => {
                              setFormValues({
                                ...formValues,
                                date_versement: new Date(e),
                              });
                            }}
                            dateFormat="dd/MM/YYYY"
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </Grid>

                    <Grid item>
                      <TextField
                        required
                        id="intitule-input"
                        name="intitule"
                        label="Intitule de versement"
                        type="text"
                        value={formValues.intitule}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DatePicker"]}>
                          <DatePicker
                            required
                            label="Date Extrême"
                            dateFormat="dd/MM/YYYY"
                            name="dateExtreme"
                            selected={formValues.dateExtreme}
                            onChange={(e) => {
                              setFormValues({
                                ...formValues,
                                dateExtreme: new Date(e),
                              });
                            }}
                            minDate={dayjs(formValues.date_versement)}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </Grid>
                    <Grid item>
                      <TextField
                        required
                        id="rsversante-input"
                        name="nomRSVersante"
                        label="Responsable Structure versante"
                        type="text"
                        value={formValues.nomRSVersante}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        required
                        id="nbArtc-input"
                        name="nbr_articles"
                        label="Nombre d'articles versés"
                        type="number"
                        value={formValues.nbr_articles}
                        onChange={handleInputChange}
                        error={formErrors.numError}
                        helperText={formErrors.numError}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        required
                        id="rsparchivage-input"
                        name="nomRSvPreArchivage"
                        label="Responsable Service pré_archivage"
                        type="text"
                        value={formValues.nomRSvPreArchivage}
                        onChange={handleInputChange}
                      />
                    </Grid>

                    <Grid item>
                      <TextField
                        required
                        id="location-input"
                        name="localisation"
                        label="Localisation"
                        type="text"
                        value={formValues.localisation}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        required
                        id="mt-input"
                        name="metrageLineaire"
                        label="Metrage Lineaire"
                        type="number"
                        value={formValues.metrageLineaire}
                        onChange={handleInputChange}
                        error={formErrors.numError}
                        helperText={formErrors.numError}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        required
                        id="etPhysic-input"
                        name="etatPhysique"
                        label="Etat Physique"
                        type="text"
                        value={formValues.etatPhysique}
                        onChange={handleInputChange}
                      />
                    </Grid>

                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={formErrors.numError}
                    >
                      Enregistrer
                    </Button>
                  </Grid>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Annuler</Button>
              </DialogActions>
            </Dialog>

            {bordereaux && filterB.length > 0 ? (
              <Paper sx={{ width: "100%", mb: 2 }}>
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
                          placeholder={t("Search")}
                          InputProps={{
                            disableUnderline: true,
                            sx: { fontSize: "default" },
                          }}
                          variant="standard"
                          onChange={handleSearch}
                          onKeyUp={Search.bind(this)}
                        />
                      </Grid>
                    </Grid>
                  </Toolbar>
                </AppBar>
                <Dialog open={openDr} onClose={handleCloseDr}>
                  <DialogTitle>Choisir Dates</DialogTitle>
                  <DialogContent>
                    <TextField
                      required
                      fullWidth
                      select
                      id="demo-simple-select"
                      name="dateType"
                      value={dateType}
                      label="Choisir type date"
                      onChange={(e) => {
                        setDateType(e.target.value);
                      }}
                    >
                      <MenuItem key={0} value="date_versement">
                        Date de Versement
                      </MenuItem>

                      <MenuItem key={2} value="dateExtreme">
                        Date Extrême
                      </MenuItem>
                    </TextField>
                    <DateRange
                      editableDateInputs={true}
                      onChange={(item) => setState([item.selection])}
                      moveRangeOnFirstSelection={false}
                      ranges={state}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      onClick={SearchDate}
                    >
                      Rechercher
                    </Button>
                  </DialogContent>
                </Dialog>
                <DataTablePagination
                  rows={filterB}
                  headCells={headCells}
                  handleOpenRange={handleOpenRange}
                  content={content}
                  token={token}
                />
              </Paper>
            ) : (
              <p style={{ textAlign: "center", color: "black" }}>
                Aucun Bordereau de versement !
              </p>
            )}
          </Box>
        </div>
      </AppBar>
    </div>
  );
};
export default BvList;
