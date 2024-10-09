import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Typography, 
  Box, 
  Slider, 
  Paper, 
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton
} from '@mui/material';
import { PlayArrow, Pause, Stop, Delete } from '@mui/icons-material';

const MeditationApp = () => {
  const [time, setTime] = useState(5);
  const [isActive, setIsActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(time * 60);
  const [sessions, setSessions] = useState([]);
  const [note, setNote] = useState('');

  useEffect(() => {
    let interval = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(secondsLeft => secondsLeft - 1);
      }, 1000);
    } else if (isActive && secondsLeft === 0) {
      setIsActive(false);
      addSession();
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(time * 60);
  };

  const addSession = () => {
    const newSession = {
      date: new Date().toLocaleString(),
      duration: time,
      note: note
    };
    setSessions([newSession, ...sessions]);
    setNote('');
  };

  const deleteSession = (index) => {
    const newSessions = sessions.filter((_, i) => i !== index);
    setSessions(newSessions);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Meditation Timer
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 3, width: '100%' }}>
        <Typography variant="h2" align="center" gutterBottom>
          {formatTime(secondsLeft)}
        </Typography>
        <Slider
          value={time}
          onChange={(_, newValue) => {
            setTime(newValue);
            setSecondsLeft(newValue * 60);
          }}
          min={1}
          max={60}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value} min`}
          disabled={isActive}
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant="contained"
            color={isActive ? "secondary" : "primary"}
            onClick={toggleTimer}
            startIcon={isActive ? <Pause /> : <PlayArrow />}
            sx={{ mr: 1 }}
          >
            {isActive ? 'Pause' : 'Start'}
          </Button>
          <Button
            variant="outlined"
            onClick={resetTimer}
            startIcon={<Stop />}
          >
            Reset
          </Button>
        </Box>
        <TextField
          fullWidth
          variant="outlined"
          label="Session Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          margin="normal"
        />
      </Paper>
      <Typography variant="h5" gutterBottom>
        Past Sessions
      </Typography>
      <List sx={{ width: '100%' }}>
        {sessions.map((session, index) => (
          <ListItem key={index} secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={() => deleteSession(index)}>
              <Delete />
            </IconButton>
          }>
            <ListItemText 
              primary={`${session.duration} minutes on ${session.date}`}
              secondary={session.note}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default MeditationApp;

