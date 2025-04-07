/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Configure the email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.password
  }
});

exports.sendInactivityEmail = functions.https.onCall(async (data, context) => {
  // Make sure the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated', 
      'User must be authenticated to send emails.'
    );
  }

  const { email, displayName } = data;
  
  try {
    const mailOptions = {
      from: '"FunLearn" <noreply@kidsinteractive.com>',
      to: email,
      subject: 'We miss you at FunLearn!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #3674B5; text-align: center;">Hey ${displayName}!</h2>
          <p>We noticed you've been away for a little while. There are exciting learning adventures waiting for you at FunLearn!</p>
          <p>Jump back in and continue your educational journey!</p>
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://kidsinteractive.com" style="background-color: #3674B5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Return to FunLearn</a>
          </div>
          <p style="margin-top: 30px; font-size: 0.9em; color: #666;">This is an automated message. Please do not reply to this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new functions.https.HttpsError(
      'internal',
      'There was an error sending the email.'
    );
  }
});

