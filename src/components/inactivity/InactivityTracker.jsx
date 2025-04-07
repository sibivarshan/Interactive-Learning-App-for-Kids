import { useState, useEffect } from 'react';
import { auth } from '../../firebaseConfig';
import emailjs from '@emailjs/browser';

const INACTIVITY_TIMEOUT = 2 * 60 * 1000; // 2 minutes in milliseconds

const InactivityTracker = () => {
  const [lastActivity, setLastActivity] = useState(new Date());
  const [timer, setTimer] = useState(null);
  const [notificationSent, setNotificationSent] = useState(false);
  const [debugMode, setDebugMode] = useState(true); // Enable for debugging

  // Function to handle user activity events
  const handleUserActivity = () => {
    setLastActivity(new Date());
    setNotificationSent(false);
  };

  // Setup activity tracking
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach((event) => {
      document.addEventListener(event, handleUserActivity);
    });

    const checkInactivity = () => {
      const now = new Date();
      const timeSinceLastActivity = now - lastActivity;
      
      console.log(`Time since activity: ${Math.round(timeSinceLastActivity/1000)}s / ${INACTIVITY_TIMEOUT/1000}s threshold`);
      
      if (timeSinceLastActivity >= INACTIVITY_TIMEOUT && !notificationSent) {
        sendInactivityNotification();
        setNotificationSent(true);
      }
    };

    const intervalTimer = setInterval(checkInactivity, 10000);
    setTimer(intervalTimer);

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleUserActivity);
      });
      clearInterval(intervalTimer);
    };
  }, [lastActivity, notificationSent]);

  // Send notification to user's email
  const sendInactivityNotification = async () => {
    try {
      const user = auth.currentUser;
      console.log('Current user state:', user ? 'Logged in' : 'Not logged in');
      
      if (user && user.email) {
        console.log('Attempting to send email to:', user.email);
        
        // EmailJS parameters - FIXED TEMPLATE STRUCTURE
        const templateParams = {
          to_email: user.email,
          to_name: user.displayName || 'Student',
          subject: 'We miss you at FunLearn!',
          message: 'We noticed you\'ve been away for a while. Come back to continue your learning journey!'
        };

        console.log('Email parameters:', templateParams);

        const response = await emailjs.send(
          'service_ro39u3a',  // Your service ID
          'template_ecwm0b8', // Your template ID
          templateParams,
          '5XM2UmUfmxKuh3Zl5'       // Your public key
        );
        
        console.log('EmailJS response:', response);
        console.log('Inactivity notification sent to:', user.email);
      } else {
        console.warn('Cannot send email - user not logged in or missing email');
      }
    } catch (error) {
      console.error('Error sending inactivity notification:', error.text || error.message || error);
    }
  };

  // Debug display for testing
  return debugMode ? (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      backgroundColor: 'rgba(0,0,0,0.7)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999
    }}>
      <div>Last activity: {new Date(lastActivity).toLocaleTimeString()}</div>
      <div>Inactivity time: {Math.round((new Date() - lastActivity)/1000)}s</div>
      <div>Threshold: {INACTIVITY_TIMEOUT/1000}s</div>
      <div>Status: {notificationSent ? 'Email sent' : 'Monitoring'}</div>
      <div>User logged in: {auth.currentUser ? 'Yes' : 'No'}</div>
      <button 
        onClick={sendInactivityNotification}
        style={{marginTop: '5px', padding: '3px', fontSize: '11px'}}
      >
        Send Test Email
      </button>
      <button 
        onClick={() => setDebugMode(false)}
        style={{marginLeft: '5px', padding: '3px', fontSize: '11px'}}
      >
        Hide
      </button>
    </div>
  ) : null;
};

export default InactivityTracker;