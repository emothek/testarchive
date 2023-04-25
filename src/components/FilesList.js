import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";

import * as dayjs from "dayjs";

export default function FilesList({ file, dateUploaded }) {
  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <ImageIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={file || "unkown file"}
          secondary={dayjs(dateUploaded || new Date()).format(
            "DD-MMM-YYYY, h:mm A"
          )}
        />
      </ListItem>
    </List>
  );
}
