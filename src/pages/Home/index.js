import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import socket from "../../socket";
import ACTIONS from "../../socket/actions";
import { v4 } from 'uuid';
import { Button, Grid, TextField } from "@mui/material";

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

function SimpleDialog(props) {
  const { onClose, selectedValue, open, content } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };
  console.log(content);

  return (
    <Dialog onClose={handleClose} open={open}>
      { (content.length > 0) ? <DialogTitle>Select room to join</DialogTitle> : <DialogTitle>No Avaible rooms</DialogTitle> }

      <List sx={{ pt: 0 }}>
        {content.map((roomID) => (
          <ListItem button onClick={() => handleListItemClick(roomID)} key={roomID}>
            <ListItemText primary={roomID} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

export default function Home () {
  const history = useNavigate();
  const [rooms, updateRooms] = useState([]);
  const rootNode = useRef();
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);

  const [key, setKey] = useState('');
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    socket.on(ACTIONS.SHARE_ROOMS, ({ rooms = [] } = {}) => {
      if (rootNode.current){
        updateRooms(rooms);
      }
    })
  }, []);

  const handleClose = (value) => {
    setOpen(false);
    if (value) history(`/room/${value}`);
    setSelectedValue(value);
  };

  return (
    <Grid 
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Button variant="text" onClick={handleClickOpen}>Avaible Rooms</Button>
      <TextField id="filled-basic" label="Code to connect" variant="filled" onChange={(e) => setKey(e.target.value)}/>
      <Button variant="text" onClick={() => {
        history(`/room/${key}`);
      }}>connect</Button>
      <Button variant="text" disabled>-OR-</Button>
      <Button variant="text" onClick={() => {
        history(`/room/${v4()}`);
      }}>Create new Room</Button>
      <SimpleDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
        content={rooms}
      />
    </Grid>
  );
}
