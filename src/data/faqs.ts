export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export const faqs: FAQItem[] = [
  {
    id: 'what-is-carebridge',
    category: 'General',
    question: 'What is CareBridge?',
    answer: 'CareBridge is a healthcare and caregiver support platform designed to help families, caregivers, patients, elderly individuals, and doctors manage everyday health activities including medication reminders, health monitoring, emergency contact circles, and health report summaries.',
  },
  {
    id: 'is-carebridge-medical-advice',
    category: 'Medical & Safety',
    question: 'Does CareBridge diagnose medical conditions or replace doctors?',
    answer: 'No. CareBridge is an organizational, educational, and communication support platform. It does not provide medical diagnosis, treatment advice, or replace consultation with qualified healthcare professionals.',
  },
  {
    id: 'how-do-medicine-reminders-work',
    category: 'Features',
    question: 'How do CareBridge medicine reminders work for elderly family members?',
    answer: 'CareBridge provides easy-to-read audio and visual reminders on smartphones or tablets. Elderly users can confirm their medication with a single large tap, automatically updating family members and caregivers in real time.',
  },
  {
    id: 'can-family-members-monitor-remotely',
    category: 'Caregiving',
    question: 'Can I monitor my elderly parents’ health from another city?',
    answer: 'Yes. CareBridge is built for distance caregiving. Family members receive gentle status updates when medications are confirmed, vitals are logged, or if an emergency alert is triggered.',
  },
  {
    id: 'is-my-health-data-secure',
    category: 'Security & Privacy',
    question: 'How does CareBridge protect my health and personal data?',
    answer: 'CareBridge uses industry-standard encryption, strict access controls, and a privacy-first architecture. Your health reports and personal information are accessible only to you and the family members or care team you explicitly authorize.',
  },
  {
    id: 'is-carebridge-free-to-join',
    category: 'Waitlist & Pricing',
    question: 'Is joining the CareBridge waitlist free?',
    answer: 'Yes. Joining the CareBridge waitlist is 100% free and gives you early access to new features, platform launch updates, and special caregiver guides.',
  },
  {
    id: 'can-doctors-use-carebridge',
    category: 'Clinical',
    question: 'How can doctors and healthcare providers interact with CareBridge?',
    answer: 'Doctors can view structured medication logs and patient wellness trends exported by caregivers, reducing appointment overhead and providing clearer clinical insight during consultations.',
  },
];
