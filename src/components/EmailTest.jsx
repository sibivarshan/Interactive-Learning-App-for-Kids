import React from 'react';
import emailjs from '@emailjs/browser';

const EmailTest = () => {
  const testEmailService = async () => {
    try {
      const templateParams = {
        to_name: "sibii",
        to_email: "sibivarshan2611@gmail.com", // Use your actual email for testing
        subject: "Test Email",
        message: "This is a test email from EmailJS"
      };
      
      console.log("Sending test with params:", templateParams);
      
      const response = await emailjs.send(
        'service_ro39u3a',
        'template_ecwm0b8', 
        templateParams,
        '5XM2UmUfmxKuh3Zl5'
      );
      
      console.log("SUCCESS!", response.status, response.text);
      alert("Test email sent successfully!");
    } catch (error) {
      console.log("FAILED...", error);
      alert("Error sending test email: " + (error.text || error.message));
    }
  };

  return (
    <div style={{padding: '20px', textAlign: 'center'}}>
      <h2>EmailJS Test</h2>
      <button 
        onClick={testEmailService}
        style={{
          padding: '10px 20px',
          background: '#4285F4',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Send Test Email
      </button>
      <p>Check console for detailed logs</p>
    </div>
  );
};

export default EmailTest;