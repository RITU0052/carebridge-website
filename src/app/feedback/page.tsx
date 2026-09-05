import React from 'react';
import { constructMetadata } from '@/lib/seo';
import { FeedbackClientForm } from './FeedbackClientForm';

export const metadata = constructMetadata({
  title: 'CareBridge Feedback | Help Us Improve Healthcare Management',
  description: 'Share your feedback with CareBridge to help us improve medicine reminders, AI health summaries, and caregiver coordination tools.',
  path: '/feedback',
});

export default function FeedbackPage() {
  return <FeedbackClientForm />;
}
