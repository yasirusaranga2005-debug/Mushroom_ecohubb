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
