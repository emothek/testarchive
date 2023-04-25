import * as React from "react";
import PropTypes from "prop-types";
//import { alpha } from '@mui/material/styles';
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
//import Checkbox from '@mui/material/Checkbox';
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { visuallyHidden } from "@mui/utils";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import * as dayjs from "dayjs";
import Axios from "axios";
import { List, ListItem, ListItemText } from "@mui/material";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort, headCells } = props;
  const { t } = useTranslation();
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow sx={{ fontSize: "bold" }}>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            //align={headCell.numeric ? 'right' : 'left' }
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            align="right"
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {t(headCell.label)}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell align="right">Action</TableCell>
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  // numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  //onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  //rowCount: PropTypes.number.isRequired,
  headCells: PropTypes.array.isRequired,
};

function EnhancedTableToolbar(props) {
  const { content, handleOpenRange } = props;
  const { t } = useTranslation();

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        {content === "bv"
          ? t("Slips")
          : content === "boites"
          ? t("Boxes")
          : t("Users")}
      </Typography>
      {content === "bv" && (
        <Tooltip title={t("Search By Date")} onClick={handleOpenRange}>
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  content: PropTypes.string.isRequired,
  handleOpenRange: PropTypes.func.isRequired,
};

export default function DataTablePagination(props) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  //const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { user, token, rows, headCells, content, handleOpenRange } = props;
  const [open, setOpen] = React.useState(false);
  const [openV, setOpenV] = React.useState(false);
  const { t } = useTranslation();

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickOpenV = () => {
    setOpenV(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseV = () => {
    setOpenV(false);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  /*const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };*/

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /**/

  return (
    <Paper sx={{ width: "100%", mb: 2 }}>
      <EnhancedTableToolbar
        content={content}
        handleOpenRange={handleOpenRange}
      />
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
            headCells={headCells}
          />
          {content === "bv" ? (
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  //const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow hover tabIndex={0}>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        align="right"
                      >
                        {row.nbv}
                      </TableCell>

                      <TableCell align="right">
                        {dayjs(row.date_versement || new Date()).format(
                          "DD-MMM-YYYY, h:mm A"
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {row.direction} {row.sous_direction} {row.service}
                      </TableCell>
                      <TableCell align="right">{row.intitule}</TableCell>
                      <TableCell align="right">
                        {dayjs(row.dateExtreme || new Date()).format(
                          "DD-MMM-YYYY, h:mm A"
                        )}
                      </TableCell>

                      <TableCell align="right">
                        <IconButton onClick={handleClickOpen}>
                          <DeleteIcon
                            sx={{ color: "red" }}
                            titleAccess={t("Delete")}
                          />
                        </IconButton>
                        <Dialog
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                        >
                          <DialogTitle id="alert-dialog-title">
                            Confirmer suppression
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                              Etes-vous sûr (e) de vouloir supprimer cet element
                              !
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={handleClose}>Annuler</Button>
                            <Button
                              onClick={async () => {
                                await Axios.delete(
                                  process.env.REACT_APP_HOSTNAME +
                                    `/bordereau/${row.id}`,
                                  {
                                    withCredentials: true,
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  }
                                ).then(() => {
                                  alert("bordereau supprimé!");
                                });
                                handleClose();
                              }}
                              autoFocus
                            >
                              Confirmer
                            </Button>
                          </DialogActions>
                        </Dialog>
                        <IconButton onClick={handleClickOpenV}>
                          <FileOpenIcon titleAccess={t("Afficher")} />
                        </IconButton>
                        <Dialog
                          open={openV}
                          onClose={handleCloseV}
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                        >
                          <DialogTitle id="alert-dialog-title">
                            Détails Bordereau
                          </DialogTitle>
                          <DialogContent>
                            <Box>
                              <List>
                                <ListItem>
                                  <ListItemText
                                    primary={"N Bordereau Versement"}
                                    secondary={row.nbv}
                                  />
                                </ListItem>
                                <ListItem>
                                  <ListItemText
                                    primary={"Service Versant"}
                                    secondary={
                                      row.direction +
                                      " " +
                                      row.sous_direction +
                                      " " +
                                      row.service
                                    }
                                  />
                                </ListItem>
                                <ListItem>
                                  <ListItemText
                                    primary={"Intitulé"}
                                    secondary={row.intitule}
                                  />
                                </ListItem>
                                <ListItem>
                                  <ListItemText
                                    primary={"Nombre d'articles"}
                                    secondary={row.nbr_articles}
                                  />
                                </ListItem>
                                <ListItem>
                                  <ListItemText
                                    primary={"Date de versement"}
                                    secondary={dayjs(
                                      row.date_versement || new Date()
                                    ).format("DD-MMM-YYYY, h:mm A")}
                                  />
                                </ListItem>
                                <ListItem>
                                  <ListItemText
                                    primary={"Date extrême"}
                                    secondary={dayjs(
                                      row.dateExtreme || new Date()
                                    ).format("DD-MMM-YYYY, h:mm A")}
                                  />
                                </ListItem>
                                <ListItem>
                                  <ListItemText
                                    primary={"Localisation"}
                                    secondary={row.localisation}
                                  />
                                </ListItem>
                                <ListItem>
                                  <ListItemText
                                    primary={"Metrage Lineaire"}
                                    secondary={row.metrageLineaire}
                                  />
                                </ListItem>
                                <ListItem>
                                  <ListItemText
                                    primary={"Etat Physique"}
                                    secondary={row.etatPhysique}
                                  />
                                </ListItem>
                                <ListItem>
                                  <ListItemText
                                    primary={
                                      "Nom Responsable Structure Versante"
                                    }
                                    secondary={row.nomRSVersante}
                                  />
                                </ListItem>
                                <ListItem>
                                  <ListItemText
                                    primary={
                                      "Nom responsable service pré-archivage"
                                    }
                                    secondary={row.nomRSvPreArchivage}
                                  />
                                </ListItem>
                              </List>
                            </Box>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={handleCloseV}>Annuler</Button>
                          </DialogActions>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          ) : content === "boites" ? (
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  //const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow hover tabIndex={0} key={row.id}>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        align="right"
                      >
                        {row.nbBoite}
                      </TableCell>
                      <TableCell align="right">{row.nbSalle}</TableCell>
                      <TableCell align="right">{row.nbRayonnage}</TableCell>
                      <TableCell align="right">{row.nbEtage}</TableCell>
                      <TableCell align="right">
                        {row.bordereauVersement
                          ? row.bordereauVersement.nbv
                          : "Aucun"}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={handleClickOpen}>
                          <DeleteIcon
                            sx={{ color: "red" }}
                            titleAccess={t("Delete")}
                          />
                        </IconButton>
                        <Dialog
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                        >
                          <DialogTitle id="alert-dialog-title">
                            Confirmer suppression
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                              Etes-vous sûr (e) de vouloir supprimer cet element
                              !
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={handleClose}>Annuler</Button>
                            <Button
                              onClick={async () => {
                                await Axios.delete(
                                  process.env.REACT_APP_HOSTNAME +
                                    `/boite/${row.id}`,
                                  {
                                    withCredentials: true,
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  }
                                ).then(() => {
                                  alert("boite supprimée!");
                                });
                                handleClose();
                              }}
                              autoFocus
                            >
                              Confirmer
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          ) : (
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  //const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow hover tabIndex={0} key={row.id}>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        align="right"
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.email}</TableCell>
                      <TableCell align="right">{row.role}</TableCell>
                      <TableCell align="right">
                        {row.organisation.name}{" "}
                      </TableCell>
                      <TableCell align="right">
                        {row.valid === false ? (
                          <IconButton
                            onClick={async () => {
                              if (user.role === "SUPERADMIN") {
                                await Axios.post(
                                  process.env.REACT_APP_HOSTNAME +
                                    `/sa/validate/${row.id}`,
                                  {},
                                  {
                                    withCredentials: true,
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  }
                                ).then((res) => {
                                  alert("user validated");
                                });
                              } else {
                                await Axios.post(
                                  process.env.REACT_APP_HOSTNAME +
                                    `/admin/validate/${row.id}`,
                                  {},
                                  {
                                    withCredentials: true,
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  }
                                ).then((res) => {
                                  alert("user validated");
                                });
                              }
                            }}
                          >
                            <VerifiedUserIcon
                              color="success"
                              titleAccess={t("Validate")}
                            />
                          </IconButton>
                        ) : (
                          t("Validated")
                        )}

                        <IconButton onClick={handleClickOpen}>
                          <DeleteIcon
                            sx={{ color: "red" }}
                            titleAccess={t("Delete")}
                          />
                        </IconButton>
                        <Dialog
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                        >
                          <DialogTitle id="alert-dialog-title">
                            Confirmer suppression
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                              Etes-vous sûr (e) de vouloir supprimer cet element
                              !
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={handleClose}>Annuler</Button>
                            <Button
                              onClick={async () => {
                                await Axios.delete(
                                  process.env.REACT_APP_HOSTNAME +
                                    `/user/${row.id}`,
                                  {
                                    withCredentials: true,
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  }
                                ).then(() => {
                                  alert("utilisateur supprimé!");
                                });
                                handleClose();
                              }}
                              autoFocus
                            >
                              Confirmer
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
