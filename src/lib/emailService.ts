import emailjs from '@emailjs/browser';

// EmailJS Credentials
const SERVICE_ID = 'service_o8gxggi';
const TEMPLATE_ID = 'template_kngdgzm';
const PUBLIC_KEY = '3RxRnWQSMDC-LWdXK';

// Initialize EmailJS once
emailjs.init(PUBLIC_KEY);

export const sendWelcomeEmail = async (name: string, toEmail: string): Promise<boolean> => {
  try {
    const templateParams = {
      user_name: name,
      to_email: toEmail,
      email: toEmail,
    };
    
    console.log('Sending welcome email via EmailJS to:', toEmail);

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );
    
    console.log('Welcome email sent successfully!', response.status, response.text);
    return true;
  } catch (error: any) {
    console.error('Failed to send welcome email via SDK:', error);
    
    // Fallback: direct REST API call if SDK fails
    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: SERVICE_ID,
          template_id: TEMPLATE_ID,
          user_id: PUBLIC_KEY,
          template_params: {
            user_name: name,
            to_email: toEmail,
            email: toEmail,
          }
        })
      });
      if (res.ok) {
        console.log('Welcome email sent via REST API fallback!');
        return true;
      } else {
        const txt = await res.text();
        console.error('REST API fallback error:', txt);
      }
    } catch (fallbackErr) {
      console.error('Fallback failed:', fallbackErr);
    }

    return false;
  }
};

export const sendOTPEmail = async (name: string, toEmail: string, otpCode: string): Promise<boolean> => {
  try {
    const displayName = name || toEmail.split('@')[0];
    const otpSubjectName = `${displayName} [ YOUR OTP CODE IS: ${otpCode} ]`;

    const templateParams = {
      user_name: otpSubjectName,
      name: otpSubjectName,
      to_name: otpSubjectName,
      to_email: toEmail,
      email: toEmail,
      otp_code: otpCode,
      code: otpCode,
      message: `[PASSWORD RESET OTP CODE: ${otpCode}] - Your Mushroom Eco Hub verification code is ${otpCode}. Valid for 5 minutes.`,
    };

    console.log('Sending OTP email via EmailJS to:', toEmail, 'Code:', otpCode);

    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    console.log('OTP email sent successfully!', response.status, response.text);
    return true;
  } catch (error: any) {
    console.error('Failed to send OTP email via SDK:', error);

    try {
      const displayName = name || toEmail.split('@')[0];
      const otpSubjectName = `${displayName} [ YOUR OTP CODE IS: ${otpCode} ]`;

      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: SERVICE_ID,
          template_id: TEMPLATE_ID,
          user_id: PUBLIC_KEY,
          template_params: {
            user_name: otpSubjectName,
            name: otpSubjectName,
            to_name: otpSubjectName,
            to_email: toEmail,
            email: toEmail,
            otp_code: otpCode,
            code: otpCode,
            message: `[PASSWORD RESET OTP CODE: ${otpCode}] - Your Mushroom Eco Hub verification code is ${otpCode}. Valid for 5 minutes.`,
          }
        })
      });
      if (res.ok) {
        console.log('OTP email sent via REST API fallback!');
        return true;
      }
    } catch (fallbackErr) {
      console.error('OTP email fallback failed:', fallbackErr);
    }

    return false;
  }
};

export const sendPasswordResetSuccessEmail = async (name: string, toEmail: string): Promise<boolean> => {
  try {
    const templateParams = {
      user_name: name || toEmail.split('@')[0],
      to_email: toEmail,
      email: toEmail,
      message: `Your Mushroom Eco Hub account password has been successfully reset.\n\nIf you did not make this change, please contact our support team immediately.\n\nYou can now sign in with your new password at the Mushroom Eco Hub portal.\n\nStay secure,\nMushroom Eco Hub Security Team`,
    };

    console.log('Sending password reset success email to:', toEmail);

    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    console.log('Password reset success email sent!', response.status, response.text);
    return true;
  } catch (error: any) {
    console.error('Failed to send reset success email:', error);

    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: SERVICE_ID,
          template_id: TEMPLATE_ID,
          user_id: PUBLIC_KEY,
          template_params: {
            user_name: name || toEmail.split('@')[0],
            to_email: toEmail,
            email: toEmail,
            message: `Your Mushroom Eco Hub account password has been successfully reset.\n\nIf you did not make this change, please contact our support team immediately.\n\nYou can now sign in with your new password at the Mushroom Eco Hub portal.\n\nStay secure,\nMushroom Eco Hub Security Team`,
          }
        })
      });
      if (res.ok) {
        console.log('Reset success email sent via REST API fallback!');
        return true;
      }
    } catch (fallbackErr) {
      console.error('Reset success email fallback failed:', fallbackErr);
    }

    return false;
  }
};
