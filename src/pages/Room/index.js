import { useNavigate, useParams } from "react-router";

import socket from "../../socket";
import useWebRTC, { LOCAL_VIDEO } from "../../hooks/useWebRTC";
import ACTIONS from "../../socket/actions";
import { useEffect } from "react";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { IconButton } from "@mui/material";
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Room () {
  const { id: roomID } = useParams();
  const { clients, provideMediaRef, stream } = useWebRTC(roomID);
  
  console.log('roomID = ', roomID);
  console.log('clietnts ', clients);

  const navigate = useNavigate();

  useEffect(() => {
    socket.on(ACTIONS.USER_REMOVED, () => {
      alert("You`re removed from this room");
      navigate('/');
    })
    return () => {
      socket.off(ACTIONS.USER_REMOVED);
    }
  }, []);

  const videoIcon = () => (stream.getVideoTracks()[0].enabled === false) ? <VideocamIcon /> : <VideocamOffIcon />;

  const audioIcon = () => (stream.getAudioTracks()[0].enabled === false) ? <MicIcon /> : <MicOffIcon />;

  return (
    <Grid container spacing={2}>
      {clients.map((clientID, index) => {
        return (
          <Grid container item xs={4} key={clientID} id={clientID}>
            <Grid item>
              <Item>
                <video
                  width='100%'
                  height='100%'
                  ref={instance => {
                    provideMediaRef(clientID, instance);
                  }}
                  autoPlay
                  playsInline
                  muted={clientID === LOCAL_VIDEO}
                />
              </Item>
            </Grid>
            {
              (clientID === LOCAL_VIDEO) ?
              <Grid container item xl direction="row"
                justifyContent="center"
                alignItems="center">
                <Grid item>
                  <IconButton color="primary" aria-label="upload picture" component="span" onClick={() => {
                    stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled
                  }
                    }>
                    { videoIcon() }
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton color="primary" aria-label="upload picture" component="span" onClick={() => {
                    stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled
                  }
                    }>
                    { audioIcon() }
                  </IconButton>
                </Grid>
              </Grid>
              :
              <Grid container item xl direction="row"
                justifyContent="center"
                alignItems="center">
                <Grid item>
                  <IconButton color="primary" aria-label="upload picture" component="span">
                    <VolumeOffIcon />
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton color="primary" aria-label="upload picture" component="span" onClick={() => {
                    socket.emit(ACTIONS.REMOVE_USER, { clientID })
                  }}>
                    <PersonRemoveIcon />
                  </IconButton>
                </Grid>
              </Grid>
            }
          </Grid>
        );
      })}
    </Grid>
  );
}
