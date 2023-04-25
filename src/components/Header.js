import React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import { useTranslation } from "react-i18next";

import Content from "./Content";
import Files from "./Files";
import { Box } from "@mui/material";

function Header(props) {
  const { user, token, tag, content } = props;

  const { t } = useTranslation();

  const [index, setIndex] = React.useState(0);
  const [tagExist, setTagExist] = React.useState(false);

  React.useEffect(() => {
    if (content === "Archivage") {
      setIndex(0);
      setTagExist(false);
    } else if (content === "Articles") {
      setIndex(1);
      setTagExist(false);
    } else if (content === "Tag") {
      setTagExist(true);
      //setIndex(1)
    }
  }, [content]);
  const handleTabs = (e, i) => {
    setIndex(i);
  };

  return (
    <React.Fragment>
      <AppBar
        component="div"
        position="static"
        elevation={0}
        sx={{ zIndex: 0 }}
      >
        <Tabs value={index} textColor="inherit" onChange={handleTabs}>
          <Tab label={t("Digitize")} />
          <Tab label={t("Browse")} />
        </Tabs>
      </AppBar>
      {index === 0 && (
        <Box
          component="main"
          sx={{ flex: 1, py: 6, px: 4, bgcolor: "#eaeff1" }}
        >
          <Content user={user} token={token} />
        </Box>
      )}
      {index === 1 && (
        <Box
          component="main"
          sx={{ flex: 1, py: 6, px: 4, bgcolor: "#eaeff1" }}
        >
          <Files user={user} token={token} tagName={tag} tagExist={tagExist} />
        </Box>
      )}
    </React.Fragment>
  );
}

Header.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired,
};

export default Header;
