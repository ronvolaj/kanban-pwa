import { format } from 'date-fns';                // Datums-Formatierung holen

function download(filename, text, type) {         // Text als Datei herunterladen
  const blob = new Blob([text], { type });        // Datei im Speicher erstellen
  const a = document.createElement('a');          // unsichtbaren Link erstellen
  a.href = URL.createObjectURL(blob);             // Link zeigt auf die Datei
  a.download = filename;                          // Dateiname festlegen
  a.click();                                      // Link "klicken" → Download startet
  URL.revokeObjectURL(a.href);                    // Speicher wieder freigeben
}

export function exportIcs(issue) {                // ein Issue als Kalendereintrag exportieren
  const day = issue.due.replaceAll('-', '');      // "2026-11-20" → "20261120"
  const ics = [                                   // Zeilen der ICS-Datei
    'BEGIN:VCALENDAR',                            // Kalender beginnt
    'VERSION:2.0',                                // ICS-Version
    'PRODID:-//Kanban PWA//DE',                   // wer die Datei erstellt hat
    'BEGIN:VEVENT',                               // Termin beginnt
    `UID:${issue.id}`,                            // eindeutige ID
    `DTSTAMP:${format(new Date(), "yyyyMMdd'T'HHmmss")}`, // Erstellzeit der Datei
    `DTSTART;VALUE=DATE:${day}`,                  // ganztägig am Fälligkeitstag
    `SUMMARY:${issue.title}`,                     // Titel im Kalender
    `DESCRIPTION:${issue.description.replaceAll('\n', '\\n')}`, // Beschreibung (Umbrüche als \n)
    'END:VEVENT',                                 // Termin endet
    'END:VCALENDAR'                               // Kalender endet
  ].join('\r\n');                                 // Zeilen zu einem Text verbinden
  download(`${issue.title}.ics`, ics, 'text/calendar'); // herunterladen
}

export function exportCsv(issues) {               // alle Issues als CSV exportieren
  const cell = (value) => `"${String(value).replaceAll('"', '""')}"`; // Wert in Anführungszeichen
  const header = ['Title', 'Description', 'Lane', 'Created', 'Due', 'Story Points', 'Priority']; // Spaltennamen
  const rows = issues.map((i) =>                  // für jedes Issue eine Zeile
    [i.title, i.description, i.lane, i.created, i.due, i.points, i.priority].map(cell).join(';')
  );
  const csv = '\uFEFF' + [header.map(cell).join(';'), ...rows].join('\n'); // BOM für Umlaute in Excel + alles verbinden
  download('kanban.csv', csv, 'text/csv');        // herunterladen
}

export function shareIssue(issue) {               // ein Issue teilen (Web Share API)
  if (!navigator.share) {                         // Browser kann nicht teilen?
    alert('Teilen wird von diesem Browser nicht unterstützt.'); // Hinweis zeigen
    return;                                       // abbrechen
  }
  navigator
    .share({                                      // Teilen-Menü öffnen mit:
      title: issue.title,                         // Titel
      text: `${issue.title}\n${issue.description}\nFällig: ${issue.due} · ${issue.points} SP` // Text
    })
    .catch(() => {});                             // Menü geschlossen → kein Fehler
}

export async function notify(title, body) {       // Benachrichtigung zeigen
  if (Notification.permission !== 'granted') return; // nicht erlaubt → nichts tun
  const registration = await navigator.serviceWorker?.getRegistration(); // Service Worker holen (falls vorhanden)
  if (registration) registration.showNotification(title, { body }); // über Service Worker (PWA)
  else new Notification(title, { body });         // sonst normal
}