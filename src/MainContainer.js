import React, { useCallback, useContext, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Navigator from "./components/Navigator";
import Header from "./components/Header";
import Head from "./components/Head";
import BvList from "./components/BvList";
import Boites from "./components/Boites";
import Users from "./components/users";
import Organisation from "./components/Organisation";
import { UserContext } from "./context/UserContext";

import Loader from "./Loader";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://strategisdata.com/">
        DZ-Archive
      </Link>{" "}
      {new Date().getFullYear()}.
    </Typography>
  );
}

let theme = createTheme({
  palette: {
    primary: {
      light: "#63ccff",
      main: "#009be5",
      dark: "#006db3",
    },
  },
  typography: {
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiTab: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
  mixins: {
    toolbar: {
      minHeight: 48,
    },
  },
});

theme = {
  ...theme,
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#081627",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
        contained: {
          boxShadow: "none",
          "&:active": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          marginLeft: theme.spacing(1),
        },
        indicator: {
          height: 3,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          backgroundColor: theme.palette.common.white,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          margin: "0 16px",
          minWidth: 0,
          padding: 0,
          [theme.breakpoints.up("md")]: {
            padding: 0,
            minWidth: 0,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: theme.spacing(1),
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 4,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: "rgb(255,255,255,0.15)",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            color: "#4fc3f7",
          },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: 14,
          fontWeight: theme.typography.fontWeightMedium,
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: "inherit",
          minWidth: "auto",
          marginRight: theme.spacing(2),
          "& svg": {
            fontSize: 20,
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: 32,
          height: 32,
        },
      },
    },
  },
};

export default function MainContainer() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
  const [content, setContent] = React.useState("");
  const [tag, setTag] = React.useState(0);
  const [userContext, setUserContext] = useContext(UserContext);

  const fetchUserDetails = useCallback(() => {
    fetch(process.env.REACT_APP_HOSTNAME + "/profile", {
      method: "GET",

      credentials: "include",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${userContext.token}`,
      },
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();

        setUserContext((oldValues) => {
          return { ...oldValues, details: data.user };
        });
      } else {
        if (response.status === 401) {
          window.location.reload();
        } else {
          setUserContext((oldValues) => {
            return { ...oldValues, details: null };
          });
        }
      }
    });
  }, [setUserContext, userContext.token]);
  const chooseContent = (cont) => {
    setContent(cont);
  };
  const chooseTag = (t) => {
    setTag(t);
  };
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  useEffect(() => {
    if (!userContext.details) {
      fetchUserDetails();
    }
  }, [userContext.details, fetchUserDetails]);

  const logoutHandler = () => {
    fetch(process.env.REACT_APP_HOSTNAME + "/logout", {
      method: "GET",
      credentials: "include",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${userContext.token}`,
      },
    }).then(async (response) => {
      setUserContext((oldValues) => {
        return { ...oldValues, details: undefined, token: null };
      });

      window.localStorage.setItem("logout", Date.now());
    });
  };

  return userContext.details === null ? (
    "Error Loading User details"
  ) : !userContext.details ? (
    <Loader />
  ) : (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <CssBaseline />
        <Box component="nav">
          {isSmUp ? null : (
            <Navigator
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              chooseContent={chooseContent}
              chooseTag={chooseTag}
              user={userContext.details}
              token={userContext.token}
            />
          )}

          <Navigator
            sx={{ display: { sm: "block", xs: "none" } }}
            chooseContent={chooseContent}
            chooseTag={chooseTag}
            user={userContext.details}
            logout={logoutHandler}
            token={userContext.token}
          />
        </Box>
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Head
            onDrawerToggle={handleDrawerToggle}
            user={userContext.details}
            token={userContext.token}
            logout={logoutHandler}
          />
          {content.content === "Boites" ? (
            <Boites
              user={userContext.details}
              token={userContext.token}
              logout={logoutHandler}
            />
          ) : content.content === "BvList" ? (
            <BvList
              user={userContext.details}
              token={userContext.token}
              logout={logoutHandler}
            />
          ) : content.content === "organisation" &&
            userContext.details.role !== "USER" ? (
            <Organisation
              user={userContext.details}
              logout={logoutHandler}
              token={userContext.token}
            />
          ) : content.content === "users" &&
            userContext.details.role !== "USER" ? (
            <Users
              user={userContext.details}
              token={userContext.token}
              logout={logoutHandler}
            />
          ) : (
            <Header
              onDrawerToggle={handleDrawerToggle}
              user={userContext.details}
              token={userContext.token}
              logout={logoutHandler}
              tag={tag}
              content={content.content}
            />
          )}

          {/*<Box component="main" sx={{ flex: 1, py: 6, px: 4, bgcolor: '#eaeff1' }}>
            <Content />
          </Box>*/}
          <Box component="footer" sx={{ p: 2, bgcolor: "#eaeff1" }}>
            <Copyright />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
