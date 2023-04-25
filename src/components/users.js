import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

import Box from "@mui/material/Box";
import DataTablePagination from "./TablePagination";
//import Select from '@mui/material/Select';
import AppBar from "@mui/material/AppBar";
//import NotificationsIcon from '@mui/icons-material/Notifications';

import Toolbar from "@mui/material/Toolbar";

import Axios from "axios";
//import { Alert, MenuItem } from "@mui/material";
import Paper from "@mui/material/Paper";
import SearchIcon from "@mui/icons-material/Search";

import { useTranslation } from "react-i18next";

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: true,
    label: "Email",
  },
  {
    id: "role",
    numeric: false,
    disablePadding: false,
    label: "Role",
  },
  {
    id: "organisation",
    numeric: false,
    disablePadding: false,
    label: "Organization",
  },
];

const Users = (props) => {
  const [users, setUsers] = useState(null);
  const [content, setContent] = useState("");
  const [filterU, setFilterU] = useState({
    u: (users) => {
      return users;
    },
  });

  const { token, user } = props;

  const { t } = useTranslation();

  useEffect(() => {
    setContent("users");
    if (user.role === "SUPERADMIN") {
      Axios.get(process.env.REACT_APP_HOSTNAME + "/sa/users", {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        //console.log(res.data)
        setUsers(res.data);
      });
    } else if (user.role === "ADMIN") {
      Axios.get(process.env.REACT_APP_HOSTNAME + "/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        //console.log(res.data)
        setUsers(res.data);
      });
    }
  }, [user.role, token]);

  const handleSearch = (e) => {
    let target = e.target;
    setFilterU({
      u: (users) => {
        if (target.value === "") return users;
        else
          return users.filter((x) =>
            x.name.toLowerCase().includes(target.value)
          );
      },
    });
  };

  return (
    <div>
      <Box component="main" sx={{ flex: 1, py: 4, px: 4, bgcolor: "#eaeff1" }}>
        {users && users.length > 0 ? (
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
                    />
                  </Grid>
                </Grid>
              </Toolbar>
            </AppBar>
            <DataTablePagination
              rows={filterU.u(users)}
              headCells={headCells}
              content={content}
              user={user}
              token={token}
            />
          </Paper>
        ) : (
          <p style={{ textAlign: "center" }}>Aucun Utilisateur !</p>
        )}
      </Box>
    </div>
  );
};

export default Users;
