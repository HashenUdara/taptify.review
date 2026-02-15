import { ContactSource } from "@/schemas/enums/contact-source";

export enum TimelineEventType {
  ReviewCompleted = "review_completed",
  SmsDelivered = "sms_delivered",
  SmsOpened = "sms_opened",
  LinkClicked = "link_clicked",
  SmsSent = "sms_sent",
  ReminderSent = "reminder_sent",
  SmsFailed = "sms_failed",
  Unsubscribed = "unsubscribed",
  ReviewStarted = "review_started",
  QrViewed = "qr_viewed",
  Added = "added",
  Queued = "queued",
  Bounced = "bounced",
  Cancelled = "cancelled",
}

export enum ViewSource {
  QR = "qr",
  Link = "link",
  MMS = "mms",
  SMS = "sms",
  SHARED = "shared",
}

export type ActivityEventData = {
  reason?: string;
  timestamp?: string;
  rating?: number;
} & Record<string, string | number | boolean | undefined>;

export interface TimelineEvent {
  id?: string;
  type: TimelineEventType;
  title?: string;
  description: string;
  timestamp: Date;
  metadata?: ActivityEventData;
}

export interface Contact {
  userId: string;
  email?: string | null | undefined;
  id?: string | undefined;
  locationId?: string | null | undefined;
  source?: ContactSource | null | undefined;
  firstName?: string | null | undefined;
  lastName?: string | null | undefined;
  telephone?: string | null | undefined;
  notes?: string | null | undefined;
  externalId?: string | null | undefined;
  createdAt?: Date | undefined;
}
