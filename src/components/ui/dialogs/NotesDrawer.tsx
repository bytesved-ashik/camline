import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { DialogContent, DialogTitle, IconButton, Skeleton, Typography } from "@mui/material";
import { Icon } from "@iconify/react";
import { getNotesForUser } from "@/services/notes.service";
import { IUserNoteResponse } from "@/types/interfaces/notes.interface";
import moment from "moment";

type Anchor = "right";
type IProps = {
  userId: string;
};

const UserNotes = ({ userId }: IProps) => {
  const [loading] = useState<boolean>(false);
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const [notes, setNotes] = useState<IUserNoteResponse[]>([]);

  useEffect(() => {
    getNotesForUser({ userId })
      .then((data) => {
        setNotes(data);
      })
      .catch((err) => console.log("error in getting notes => ", err));
  }, [userId]);

  const toggleDrawer = (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor: Anchor) => (
    <Box
      sx={{
        minWidth: 420,
        maxWidth: 432,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",

        "@media screen and (max-width: 767px)": {
          width: "100vw",
          minWidth: "100vw",
        },
      }}
      role="presentation"
    >
      <DialogTitle id="customized-dialog-title" sx={{ p: 4 }}>
        <Typography variant="h6" component="span">
          Notes
        </Typography>
        <IconButton
          aria-label="close"
          onClick={toggleDrawer(anchor, false)}
          sx={{ top: 10, right: 10, position: "absolute", color: "grey.500" }}
        >
          <Icon icon="clarity:close-line" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 4 }}>
        <Box sx={{ height: "100%", overflowY: "auto" }}>
          {loading ? (
            <>
              <Skeleton variant="text" width={"90%"} height={"4rem"} sx={{ margin: "0 auto" }} />
              <Skeleton variant="text" width={"90%"} height={"4rem"} sx={{ margin: "0 auto" }} />
              <Skeleton variant="text" width={"90%"} height={"4rem"} sx={{ margin: "0 auto" }} />
              <Skeleton variant="text" width={"90%"} height={"4rem"} sx={{ margin: "0 auto" }} />
              <Skeleton variant="text" width={"90%"} height={"4rem"} sx={{ margin: "0 auto" }} />
              <Skeleton variant="text" width={"90%"} height={"4rem"} sx={{ margin: "0 auto" }} />
            </>
          ) : (
            <>
              {notes.map((note) => (
                <Box
                  key={note.sessionId}
                  sx={{
                    borderRadius: 2,
                    border: 0.5,
                    borderColor: "black",
                    padding: 2,
                  }}
                >
                  <Typography sx={{ fontWeight: 900 }}>
                    {note?.session ? moment(note?.session.createdAt).format("MMMM Do YYYY, h:mm:ss a") : ""}
                  </Typography>
                  <Box key={note.sessionId} sx={{ mb: 2 }}>
                    {note.notes.map((data) => (
                      <Box key={data._id}> {data.notes} </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </>
          )}
        </Box>
      </DialogContent>
    </Box>
  );

  return (
    <>
      {(["right"] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)} variant="outlined">
            Notes
          </Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            SlideProps={{ unmountOnExit: true }}
            onClose={toggleDrawer(anchor, false)}
            sx={{ "& .MuiBackdrop-root": { backgroundColor: "transparent" } }}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </>
  );
};

export default UserNotes;
