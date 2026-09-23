# Notation Module

Gemeinsames, app-unabhängiges Notationsmodul für Minimal Composer, MusicChat und spätere Anwendungen.

## Test-WebApp v0.1.0
Der erste funktionsfähige Prototyp konzentriert sich bewusst auf den Kern:
- ABC editieren
- Live-Notensatz mit abcjs
- Wiedergabe
- ABC speichern
- Drucken / als PDF über den System-Druckdialog sichern

Die Test-WebApp und der eigentliche Modulcode sind getrennt: `src/notation-module.js` enthält keine Minimal-Composer- oder MusicChat-Logik.

## Entwicklungsprinzip
Erst einen kleinen, eigenständig testbaren Kern stabilisieren. Danach MusicXML/MIDI und weitere Exportfunktionen ergänzen. ABC Tools dient nur als Funktionsreferenz; sein gewachsener App-Überbau wird nicht übernommen.
