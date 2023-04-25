import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {
  Avatar,
  Grid,
  IconButton,
  Paper,
  Button,
  Card,
  CardHeader,
  CardContent,
  ListItem,
  ListItemText,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  Chip,
  Divider,
  ListItemAvatar,
  Alert,
} from "@mui/material";

import Axios from "axios";

import { Tree, TreeNode } from "react-organizational-chart";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { styled } from "@mui/material/styles";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const Node = ({
  item,
  chooseParent,
  expanded,
  handleExpandClick,
  handleOpen,
  setOpen,
  user,
}) => {
  let role = user.role;
  const handleOpenf = () => {
    setOpen(true);
  };

  const countFiles = (item) => {
    let count = 0;
    item.users.map((i) => {
      count = count + i.files.length;
    });
    return count;
  };

  return (
    <Card
      variant="outlined"
      sx={{
        display: "inline-block",
        background: "white",
        border: "1px solid red",
      }}
    >
      <CardHeader
        avatar={
          <Avatar
            alt="Logo"
            src={
              process.env.REACT_APP_HOSTNAME + `/organisation/logo/${item.logo}`
            }
          />
        }
        title={item.name}
        subheader={
          <Chip label={countFiles(item)} color="success" size="small" />
        }
        action={
          <IconButton
            aria-label="settings"
            onClick={() => {
              chooseParent(item);
              handleOpen(handleOpenf);
            }}
          >
            {role === "SUPERADMIN" && <MoreVertIcon />}
          </IconButton>
        }
      />

      {item.users.length > 0 && (
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon titleAccess="Afficher les utilisateurs de cette organisation" />
        </ExpandMore>
      )}
      <CardContent>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <List
            sx={{
              width: "100%",

              bgcolor: "background.paper",
              position: "relative",
              overflow: "auto",
              maxHeight: 100,
              "& ul": { padding: 0 },
            }}
            subheader={<li />}
          >
            {item.users.map((i) => (
              <>
                <ListItem
                  key={i.id}
                  secondaryAction={
                    <Chip label={i.files.length} color="primary" size="small" />
                  }
                >
                  <ListItemAvatar>
                    <Avatar alt={i.email} src="/static/images/avatar/1.jpg" />
                  </ListItemAvatar>
                  <ListItemText primary={i.name} secondary={i.email} />
                </ListItem>

                <Divider sx={{ mt: 2 }} />
              </>
            ))}
          </List>
        </Collapse>
      </CardContent>
    </Card>
  );
};
const constructTree = (
  nodes,
  expanded,
  handleExpandClick,
  handleOpen,
  setOpen,
  chooseParent,
  user
) => {
  return nodes.map((item) => {
    if (item.parent === null) {
      return (
        <Tree
          lineWidth={"2px"}
          lineColor={"green"}
          lineBorderRadius={"10px"}
          label={
            <Node
              item={item}
              expanded={expanded}
              handleExpandClick={handleExpandClick}
              chooseParent={chooseParent}
              setOpen={setOpen}
              handleOpen={handleOpen}
              user={user}
            />
          }
        >
          {constructTree(
            item.suborganisations,
            expanded,
            handleExpandClick,
            handleOpen,
            setOpen,
            chooseParent,
            user
          )}
        </Tree>
      );
    }
    return (
      <TreeNode
        label={
          <Node
            item={item}
            expanded={expanded}
            handleExpandClick={handleExpandClick}
            chooseParent={chooseParent}
            setOpen={setOpen}
            handleOpen={handleOpen}
            user={user}
          />
        }
      >
        {constructTree(
          item.suborganisations,
          expanded,
          handleExpandClick,
          handleOpen,
          setOpen,
          chooseParent,
          user
        )}
      </TreeNode>
    );
  });
};

export default function Organisation(props) {
  const { user } = props;
  const [logo, setLogo] = React.useState(null);
  const [organisations, setOrganisations] = React.useState(null);
  const [parent, setParent] = React.useState(null);
  const [expanded, setExpanded] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [errors, setErrors] = React.useState("");

  const handleOpen = (callback) => {
    callback();
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const chooseParent = (p) => {
    setParent(p);
  };
  const [data, setData] = React.useState({
    name: "",
    description: "",
    logo: null,
    parent: "",
  });

  React.useEffect(() => {
    Axios.get(process.env.REACT_APP_HOSTNAME + `/organisations`)
      .then((res) => {
        setOrganisations(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleChange = (e) => {
    setLogo(e.target.files[0]);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("file", logo);
    console.log(parent);
    if (parent !== null) formData.append("parent", parent._id);
    await Axios.post(
      process.env.REACT_APP_HOSTNAME + "/organisation",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
      .then((res) => {
        setErrors("");
        alert("organisation créee!");
      })
      .catch((err) => {
        setErrors(err.message);
      });
  };

  return (
    <Paper>
      <br />
      <Box sx={{ maxWidth: 936, margin: "auto", overflow: "hidden" }}>
        {organisations &&
          constructTree(
            organisations,
            expanded,
            handleExpandClick,
            handleOpen,
            setOpen,
            chooseParent,
            user
          )}
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Ajouter une Organisation</DialogTitle>
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
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="outlined-basic_n"
                    label="Nom"
                    variant="outlined"
                    name="name"
                    value={data.name}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    multiline
                    id="outlined-basic_d"
                    label="Description"
                    variant="outlined"
                    name="description"
                    value={data.description}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    helperText="Sélectionner un Logo"
                    type="file"
                    onChange={handleChange}
                  />
                </Grid>

                <Button variant="contained" color="primary" type="submit">
                  Ajouter
                </Button>
                {errors && <Alert color="warning">{errors}</Alert>}
              </Grid>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </Paper>
  );
}
