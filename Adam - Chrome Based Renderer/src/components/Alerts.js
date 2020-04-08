import React from "react";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

// Returing Mui Alert Component
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

// Generating Styles
const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2)
    }
  }
}));

export default function Alerts(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  return (
    <div className={classes.root}>
      <Alert
        onClose={() => {
          setOpen(false);
        }}
        severity={props.severity}
      >
        {props.flashMessage}
      </Alert>
    </div>
  );
}
