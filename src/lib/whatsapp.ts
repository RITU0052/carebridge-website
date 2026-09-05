import { normalizePhoneNumber } from './db';

interface SendWhatsAppParams {
  to: string;
  body: string;
}

interface WhatsAppResponse {
  success: boolean;
  provider?: 'META' | 'TWILIO';
  messageId?: string;
  error?: string;
}

/**
 * Sends a real WhatsApp message using Meta WhatsApp Business Cloud API
 * or Twilio WhatsApp API based on available environment variables.
 * If credentials are not configured, returns success: false with 'WhatsApp provider is not configured.'
 */
export async function sendWhatsAppTextMessage({ to, body }: SendWhatsAppParams): Promise<WhatsAppResponse> {
  const normalizedPhone = normalizePhoneNumber(to);
  if (!normalizedPhone) {
    return { success: false, error: 'Invalid or missing recipient phone number.' };
  }

  // 1. Check Meta WhatsApp Cloud API
  const metaPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const metaAccessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (metaPhoneNumberId && metaAccessToken) {
    try {
      const recipientNumber = normalizedPhone.replace('+', '');
      const url = `https://graph.facebook.com/v18.0/${metaPhoneNumberId}/messages`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${metaAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: recipientNumber,
          type: 'text',
          text: { preview_url: false, body },
        }),
      });

      const data = await res.json();
      if (res.ok && data.messages && data.messages[0]) {
        console.log(`[WhatsApp Meta API] Delivered to ${normalizedPhone}, id: ${data.messages[0].id}`);
        return { success: true, provider: 'META', messageId: data.messages[0].id };
      } else {
        const errorMsg = data?.error?.message || res.statusText;
        console.error(`[WhatsApp Meta API Error] ${errorMsg}`);
        return { success: false, provider: 'META', error: errorMsg };
      }
    } catch (err: any) {
      console.error('[WhatsApp Meta API Exception]', err);
      return { success: false, provider: 'META', error: err?.message || 'Meta API network request failed.' };
    }
  }

  // 2. Check Twilio WhatsApp API
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFromNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

  if (twilioSid && twilioAuthToken) {
    try {
      const recipientWhatsapp = `whatsapp:${normalizedPhone}`;
      const url = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
      const authHeader = 'Basic ' + Buffer.from(`${twilioSid}:${twilioAuthToken}`).toString('base64');

      const params = new URLSearchParams();
      params.append('From', twilioFromNumber.startsWith('whatsapp:') ? twilioFromNumber : `whatsapp:${twilioFromNumber}`);
      params.append('To', recipientWhatsapp);
      params.append('Body', body);

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const data = await res.json();
      if (res.ok && data.sid) {
        console.log(`[WhatsApp Twilio API] Delivered to ${normalizedPhone}, sid: ${data.sid}`);
        return { success: true, provider: 'TWILIO', messageId: data.sid };
      } else {
        const errorMsg = data?.message || res.statusText;
        console.error(`[WhatsApp Twilio API Error] ${errorMsg}`);
        return { success: false, provider: 'TWILIO', error: errorMsg };
      }
    } catch (err: any) {
      console.error('[WhatsApp Twilio API Exception]', err);
      return { success: false, provider: 'TWILIO', error: err?.message || 'Twilio API network request failed.' };
    }
  }

  // 3. Provider not configured
  console.log('[WhatsApp Notification] WhatsApp provider is not configured. Credentials missing.');
  return {
    success: false,
    error: 'WhatsApp provider is not configured.',
  };
}

/**
 * Format and dispatch Caregiver WhatsApp alert when parent marks medicine TAKEN or SKIPPED
 */
export async function sendCaregiverMedicineStatusAlert({
  caregiverPhone,
  patientName,
  scheduledTime,
  action,
  medicineName,
  includeMedicineName = true,
}: {
  caregiverPhone: string;
  patientName: string;
  scheduledTime: string;
  action: 'TAKEN' | 'SKIPPED' | 'MISSED';
  medicineName?: string;
  includeMedicineName?: boolean;
}): Promise<WhatsAppResponse> {
  let message = '';
  const nameLabel = patientName || 'Your parent';

  if (action === 'TAKEN') {
    if (includeMedicineName && medicineName) {
      message = `CareBridge Update:\n${nameLabel} has taken their medicine (${medicineName}) scheduled for ${scheduledTime}.`;
    } else {
      message = `CareBridge Update:\n${nameLabel} has marked their medicine scheduled for ${scheduledTime} as taken.`;
    }
  } else {
    if (includeMedicineName && medicineName) {
      message = `CareBridge Alert:\n${nameLabel} has marked their medicine (${medicineName}) scheduled for ${scheduledTime} as skipped.`;
    } else {
      message = `CareBridge Alert:\n${nameLabel} has marked their medicine scheduled for ${scheduledTime} as skipped.`;
    }
  }

  return await sendWhatsAppTextMessage({ to: caregiverPhone, body: message });
}
