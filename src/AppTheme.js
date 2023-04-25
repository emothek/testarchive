import React, { useEffect, useMemo, createContext, useState } from "react";
import { useTranslation } from "react-i18next";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import { Box } from "@mui/system";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export const AppThemeContext = createContext({});

function AppTheme({ children }) {
  //document.body.dir = i18n.dir();

  const [colorMode, setColorMode] = useState("light");

  const { i18n } = useTranslation();
  const [dir, setDir] = useState(i18n.language === "ar" ? "rtl" : "ltr");
  const [language, setLanguage] = useState(i18n.language);

  const toggleLanguage = async (language) => {
    setLanguage(language);
    switch (language) {
      case "ar":
        document.body.setAttribute("dir", "rtl");
        setDir("rtl");
        await i18n.changeLanguage("ar");
        break;
      case "fr":
        document.body.setAttribute("dir", "ltr");
        setDir("ltr");
        await i18n.changeLanguage("fr");
        break;
      default:
        document.body.setAttribute("dir", "ltr");
        setDir("ltr");
        await i18n.changeLanguage("fr");
        break;
    }
  };

  const theme = useMemo(() => {
    const arabicFont = '""serif", "Arial", "sans-serif"';
    const englishFont = '"Roboto","Helvetica","Arial",sans-serif';

    const typography = {
      button: {
        textTransform: "capitalize",
      },
      fontSize: dir === "rtl" ? 15 : 14,
      fontFamily: dir === "rtl" ? arabicFont : englishFont,
    };

    return createTheme({
      direction: dir,
      typography,
    });
  }, [dir, colorMode]);

  const direction = useMemo(() => {
    return dir === "ltr" ? "left" : "right";
  }, [dir]);

  // this is the most important part
  const cacheRtl = useMemo(() => {
    if (dir === "rtl") {
      return createCache({
        key: "muirtl",
        stylisPlugins: [prefixer, rtlPlugin],
      });
    } else {
      return createCache({ key: "css" });
    }
  }, [dir]);

  useEffect(() => {
    async function fetchLang() {
      await toggleLanguage({ value: language });
    }
    fetchLang();
  }, []);

  const toggleColorMode = () =>
    setColorMode((prevMode) => (prevMode === "light" ? "dark" : "light"));

  return (
    <AppThemeContext.Provider
      value={{
        language,
        toggleLanguage,
        direction,
        colorMode,
        toggleColorMode,
      }}
    >
      <Box component="main">
        <CacheProvider value={cacheRtl}>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </CacheProvider>
      </Box>
    </AppThemeContext.Provider>
  );
}

export default AppTheme;
