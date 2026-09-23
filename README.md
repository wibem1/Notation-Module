# Notation Module

Gemeinsames, app-unabhängiges Notationsmodul für Minimal Composer, MusicChat und spätere Anwendungen.

## Stabiler Stand: v0.1.23
Der aktuelle Prototyp unterstützt:
- ABC editieren und live mit abcjs setzen
- Mehrstimmige Partituren und Instrumentzuordnung
- Wiedergabe
- ABC-Import und -Export
- MIDI-Export als echte Binärdatei über Blob/Object URL
- bidirektionale Auswahl ABC ↔ Notenbild
- skalierbare Darstellung
- Drucken / PDF über den System-Druckdialog
- installierbare WebApp-Grundlage mit versionsgebundenem Service Worker und zuverlässiger Update-Strategie

Die Test-WebApp und der eigentliche Modulcode sind getrennt. `src/notation-module.js` enthält keine Minimal-Composer-, MusicChat-, PWA- oder Persistenzlogik.

## Noch offen
MusicXML-Import/-Export, MIDI-Import, dedizierter PDF-Export und die spätere definierte Score-Schnittstelle. Die Tune-Suche bleibt ein eigenes Modul.

## Entwicklungsprinzip
Erst kleine, eigenständig testbare Funktionen stabilisieren. Vor Neuentwicklungen werden die eigenen stabilen Apps auf bereits bewährte Mechanismen geprüft. Programmcode, Deployment und Browser/PWA-Cache werden als getrennte Fehlerklassen behandelt. ABC Tools dient nur dort als Funktionsreferenz, wo kein einfacherer bewährter eigener Mechanismus existiert.

Details und Fehlerhistorie stehen in `DEVELOPMENT.md`; Architektur und verbindliche Entwicklungsregeln in `ARCHITECTURE.md`.
