export interface LetterSubmission {
  id: string;
  name: string;
  email: string;
  personIBecame: string;
  lifeICreated: string;
  differenceIMade: string;
  courageToPursue: string;
  milestones: string[];
  otherMilestone?: string;
  firstStepBeginsWith: string;
  submittedAt: string;
  futureLetter: string;
  emailSentAt?: string;
  deliveryStatus?: 'delivered' | 'pending';
}

export interface EmailNotification {
  to: string;
  from: string;
  subject: string;
  sentAt: string;
  deliveredNow: boolean;
}
