// utils.js
// Small helper functions that are not Svelte components:
// ICS export, CSV export, sharing and notifications.

import { format } from 'date-fns';

// ---------------------------------------------------------------------------
// download(): saves text as a file on the user's computer.
// Trick: we create a temporary <a download> link and "click" it in code.
// ---------------------------------------------------------------------------
function download(filename, text, type) {
  const blob = new Blob([text], { type });   // a Blob is "a file in memory"
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);         // temporary URL that points to the Blob
  a.download = filename;                      // file name for the download
  a.click();                                  // starts the download
  URL.revokeObjectURL(a.href);                // free the memory again
}

// ---------------------------------------------------------------------------
// exportIcs(): exports ONE issue as a calendar entry (.ics file).
// ICS is a plain text format that every calendar app (Outlook, Google, Apple) can import.
// ---------------------------------------------------------------------------
export function exportIcs(issue) {
  // "2026-11-20" → "20261120" (the ICS date format has no dashes)
  const day = issue.due.replaceAll('-', '');

  // Each line is one field. ICS requires \r\n as line breaks.
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Kanban PWA//DE',
    'BEGIN:VEVENT',
    `UID:${issue.id}`,                                        // unique ID of the event
    `DTSTAMP:${format(new Date(), "yyyyMMdd'T'HHmmss")}`,     // when the file was created
    `DTSTART;VALUE=DATE:${day}`,                              // all-day event on the due date
    `SUMMARY:${issue.title}`,                                 // title in the calendar
    `DESCRIPTION:${issue.description.replaceAll('\n', '\\n')}`, // line breaks must be escaped
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  download(`${issue.title}.ics`, ics, 'text/calendar');
}

// ---------------------------------------------------------------------------
// exportCsv(): exports ALL issues as a table (.csv), e.g. for Excel.
// ---------------------------------------------------------------------------
export function exportCsv(issues) {
  // Every value goes in quotes; quotes inside a value are doubled ("" = ")
  const cell = (value) => `"${String(value).replaceAll('"', '""')}"`;

  const header = ['Title', 'Description', 'Lane', 'Created', 'Due', 'Story Points', 'Priority'];

  // One line per issue, columns separated by ";" (Excel in German uses ";")
  const rows = issues.map((i) =>
    [i.title, i.description, i.lane, i.created, i.due, i.points, i.priority].map(cell).join(';')
  );

  // '﻿' (BOM) tells Excel that the file is UTF-8 → umlauts display correctly
  const csv = '﻿' + [header.map(cell).join(';'), ...rows].join('\n');
  download('kanban.csv', csv, 'text/csv');
}

// ---------------------------------------------------------------------------
// shareIssue(): shares ONE issue with the Web Share API
// (opens the native share menu: WhatsApp, mail, ...).
// ---------------------------------------------------------------------------
export function shareIssue(issue) {
  // Not every browser supports it (e.g. Firefox on desktop)
  if (!navigator.share) {
    alert('Teilen wird von diesem Browser nicht unterstützt.');
    return;
  }
  navigator
    .share({
      title: issue.title,
      text: `${issue.title}\n${issue.description}\nFällig: ${issue.due} · ${issue.points} SP`
    })
    .catch(() => {}); // the user closed the menu → not an error
}

// ---------------------------------------------------------------------------
// notify(): shows a system notification.
// ---------------------------------------------------------------------------
export async function notify(title, body) {
  // Only if the user has allowed notifications
  if (Notification.permission !== 'granted') return;

  // In an installed PWA (especially Android) notifications must go through
  // the service worker. If there is none (e.g. dev mode), use the normal API.
  const registration = await navigator.serviceWorker?.getRegistration();
  if (registration) registration.showNotification(title, { body });
  else new Notification(title, { body });
}
