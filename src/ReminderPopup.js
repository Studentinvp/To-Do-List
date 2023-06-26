// ReminderPopup.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ReminderPopup.css';

const ReminderPopup = ({ reminderText, snoozeReminder, closeReminder, reminderDateTime }) => {
  const [snoozeTime, setSnoozeTime] = useState(5);

  useEffect(() => {
    const storedSnoozeTime = localStorage.getItem('snoozeTime');
    if (storedSnoozeTime) {
      setSnoozeTime(parseInt(storedSnoozeTime));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('snoozeTime', snoozeTime.toString());
  }, [snoozeTime]);

  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes} mins`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours} hour${hours > 1 ? 's' : ''} ${mins} mins`;
    }
  };

  const formatDateTime = (dateTimeString) => {
    const dateTimeObject = new Date(dateTimeString);
    const options = {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return dateTimeObject.toLocaleString('en-US', options);
  };

  const handleSnoozeReminder = () => {
    snoozeReminder(snoozeTime);
  };

  const handleIncrementTime = () => {
    setSnoozeTime((prevTime) => prevTime + 5);
  };

  const handleDecrementTime = () => {
    if (snoozeTime > 5) {
      setSnoozeTime((prevTime) => prevTime - 5);
    }
  };

  return (
    <div className="reminder-popup">
      <h2 className="reminder-popup-heading">Reminder!</h2>
      <p className="reminder-popup-text">{reminderText}</p>
      <p className="reminder-popup-date-time">{formatDateTime(reminderDateTime)}</p>
      <p className="snooze-input">
        <div id="snooze-container">
          <button className="snooze-button" onClick={handleDecrementTime}>
            -
          </button>
          <span className="snooze-time">{formatTime(snoozeTime)}</span>
          <button className="snooze-button" onClick={handleIncrementTime}>
            +
          </button>
          <button className="snooze-button" onClick={handleSnoozeReminder}>
            Snooze
          </button>
        </div>
        <button className="ok-button" onClick={closeReminder}>
          OK
        </button>
      </p>
    </div>
  );
};

ReminderPopup.propTypes = {
  reminderText: PropTypes.string.isRequired,
  snoozeReminder: PropTypes.func.isRequired,
  closeReminder: PropTypes.func.isRequired,
  reminderDateTime: PropTypes.string.isRequired,
};

export default ReminderPopup;
