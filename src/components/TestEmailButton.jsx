import React from 'react';
import { auth } from '../firebaseConfig';
import emailjs from '@emailjs/browser';

function TestEmailButton() {
  const handleTestEmail = async () => {
    try {
      const user = auth.currentUser;
      if (user && user.email) {
        // EmailJS parameters
        const templateParams = {
          to_email: user.email,
          to_name: user.displayName || 'there',
          message: 'This is a test notification from FunLearn!'
        };

        // Replace with your actual EmailJS service ID, template ID, and user ID
        await emailjs.send(
          'service_ro39u3a', // Your EmailJS service ID
          'template_ecwm0b8', // Your EmailJS template ID
          templateParams,
          '5XM2UmUfmxKuh3Zl5' // Your EmailJS user ID (optional if already initialized)
        );
        
        console.log('Test email sent successfully');
        alert('Test email sent to ' + user.email);
      } else {
        alert('You need to be logged in to test this feature');
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      alert('Error: ' + error.message);
    }
  };    

  return (
    // Update the button style to match the navbar
    <button 
      onClick={handleTestEmail}
      style={{
        background: 'transparent',
        color: '#ffffff',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '8px',
        padding: '8px 12px',
        fontSize: '0.9rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent';
      }}
    >
      <span style={{ fontSize: '1rem' }}>📧</span> 
      <span>Test Email</span>
    </button>
  );
}

export default TestEmailButton;