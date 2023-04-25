import * as React from "react";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import { styled, useTheme } from "@mui/material/styles";
import PeopleIcon from "@mui/icons-material/People";
import DnsRoundedIcon from "@mui/icons-material/DnsRounded";
import PermMediaOutlinedIcon from "@mui/icons-material/PhotoSizeSelectActual";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
/*import PublicIcon from "@mui/icons-material/Public";
import SettingsEthernetIcon from "@mui/icons-material/SettingsEthernet";
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";
import TimerIcon from "@mui/icons-material/Timer";
import SettingsIcon from "@mui/icons-material/Settings";
import PhonelinkSetupIcon from "@mui/icons-material/PhonelinkSetup";*/
import algeria from "../static/algeria.png";
// the hook
import { useTranslation } from "react-i18next";
import { Avatar, Chip, Collapse, IconButton, Typography } from "@mui/material";
import Axios from "axios";
import TagIcon from "@mui/icons-material/Tag";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
//import { Stack } from "@mui/system";

const item = {
  py: "2px",
  px: 3,
  color: "rgba(255, 255, 255, 0.7)",
  "&:hover, &:focus": {
    bgcolor: "rgba(255, 255, 255, 0.08)",
  },
};

const itemCategory = {
  boxShadow: "0 -1px 0 rgb(255,255,255,0.1) inset",
  py: 1.5,
  px: 3,
};

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const drawerWidth = 256;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Navigator(props) {
  const theme = useTheme();
  const { user, token, chooseContent, chooseTag, logout, ...other } = props;
  const [tags, setTags] = React.useState(null);
  const [index, setIndex] = React.useState(0);
  const { t } = useTranslation();
  const role = user.role;
  let categories = [];
  const [open, setOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleDrawerClick = () => {
    setDrawerOpen(!drawerOpen);
  };

  React.useEffect(() => {
    Axios.get(process.env.REACT_APP_HOSTNAME + "/tags", {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      setTags(res.data);
    });
  }, [token]);

  if (role === "USER") {
    categories = [
      {
        id: t("Tools"),

        children: [
          {
            id: t("Archiving"),
            icon: <PermMediaOutlinedIcon />,
            active: true,
            content: "Archivage",
          },
          {
            id: t("Organization"),
            icon: <DnsRoundedIcon />,
            content: "organisation",
          },

          { id: t("Slips"), icon: <DnsRoundedIcon />, content: "BvList" },
          { id: t("Boxes"), icon: <DnsRoundedIcon />, content: "Boites" },
          { id: t("Articles"), icon: <DnsRoundedIcon />, content: "Articles" },
        ],
        tags,
      },
    ];
  } else {
    categories = [
      {
        id: t("Tools"),

        children: [
          {
            id: t("Archiving"),
            icon: <PermMediaOutlinedIcon />,
            active: true,
            content: "Archivage",
          },
          {
            id: t("Organization"),
            icon: <DnsRoundedIcon />,
            content: "organisation",
          },
          { id: t("Users"), icon: <PeopleIcon />, content: "users" },
          { id: t("Slips"), icon: <DnsRoundedIcon />, content: "BvList" },
          { id: t("Boxes"), icon: <DnsRoundedIcon />, content: "Boites" },
          { id: t("Articles"), icon: <DnsRoundedIcon />, content: "Articles" },
        ],
        tags,
      },
    ];
  }

  return (
    <Drawer variant="permanent" {...other} open={drawerOpen}>
      <DrawerHeader>
        <ListItem
          sx={{ ...item, ...itemCategory, fontSize: 22, color: "#fff" }}
        >
          <Avatar alt="DZ" src={algeria} />
          {drawerOpen && <Typography>DZ-Archive</Typography>}
        </ListItem>
        <IconButton onClick={handleDrawerClick}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon sx={{ color: "red" }} />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List disablePadding>
        <ListItem sx={{ ...item, ...itemCategory }}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText>{t("Project Overview")}</ListItemText>
        </ListItem>
        {categories.map(({ id, children }) => (
          <Box key={id} sx={{ bgcolor: "#101F33" }}>
            <ListItem sx={{ py: 2, px: 3 }}>
              <ListItemText sx={{ color: "#fff" }}>{id}</ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon, active, content }) => (
              <ListItem disablePadding key={childId}>
                <ListItemButton
                  selected={active}
                  sx={item}
                  onClick={() => props.chooseContent({ content })}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText>{childId}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}

            <ListItem sx={{ ...item }}>
              <ListItemButton onClick={handleClick}>
                <ListItemIcon>
                  <TagIcon />
                </ListItemIcon>
                <ListItemText sx={{ color: "#fff" }}>{t("Tags")}</ListItemText>
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
              {tags &&
                tags.map((tag) => (
                  <List component="div" key={tag.id} sx={{ ...item }}>
                    <ListItemButton
                      sx={{ pl: 4 }}
                      selected={index === tag.id}
                      onClick={async () => {
                        setIndex(tag.id);
                        let c = "Tag";
                        props.chooseContent({ content: "Tag" });
                        props.chooseTag(tag.id);
                      }}
                    >
                      <ListItemText primary={tag.tag_name} color={tag.color} />
                      <Chip
                        label={tag.files.length}
                        sx={{ bgcolor: tag.color }}
                        size="small"
                      />
                    </ListItemButton>
                  </List>
                ))}
            </Collapse>

            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}

        <ListItem sx={{ ...item, ...itemCategory }}>
          <ListItemButton onClick={() => logout()}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText>{t("Logout")}</ListItemText>
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}
