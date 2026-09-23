# Notation Module – Architektur

## Zweck
App-unabhängiges gemeinsames Notationsmodul für Minimal Composer, MusicChat und spätere Anwendungen.

## Grundprinzip
Das Modul kennt die aufrufende App nicht. Es erhält musikalische Daten über eine definierte Schnittstelle und liefert Darstellung, Bearbeitung und Exporte zurück. App-spezifische Run-, Chat- oder Speicherlogik gehört ausdrücklich nicht in dieses Repository.

## Formate und Rollen
- **Interner Score der aufrufenden App:** strukturierte musikalische Daten.
- **ABC:** kompakte, menschen- und KI-lesbare Notationssprache; direkt editierbare Ansicht.
- **MusicXML:** vollständiger Austausch mit Notationsprogrammen und für komplexere Partiturinformation.
- **MIDI:** Wiedergabe-/Performance- und DAW-Austauschformat.

Keines dieser Formate soll unnötig zum alleinigen Masterformat erklärt werden. Konvertierungen werden an klaren Modulgrenzen vorgenommen.

## V0.1 – Zielumfang
1. ABC-Text anzeigen und bearbeiten.
2. Änderungen unmittelbar als Notenbild rendern.
3. Notenbild mit **abcjs** als schlanker Rendering-Basis untersuchen/implementieren.
4. Play/Stop und Vorhören der dargestellten Partitur.
5. Druckoptimierte Partituransicht.
6. PDF-Ausgabe derselben Partitur mit sinnvollen Seitenumbrüchen.
7. ABC Import/Export.
8. MusicXML Import/Export.
9. MIDI Import/Export.
10. Definierte API, damit Minimal Composer und MusicChat dasselbe Modul verwenden können.

## Nicht Ziel von V0.1
- Kein Nachbau von ABC Tools.
- Keine Tune-Suche; sie ist ein eigenes Modul.
- Keine Datenbank, Website-Erzeugung, Guided Tour, QR-Funktionen oder Tabulatur-Sammlungen aus ABC Tools.
- Kein app-spezifisches Speichern von Runs oder Chats.
- Kein grafischer Voll-Noteneditor als Voraussetzung für die erste Version.

## ABC Tools
ABC Tools dient als Referenz für bewährte Funktionen, nicht als Architekturvorlage. Der bestehende Fork wird zunächst nur analysiert. Benötigte Bibliotheken/Funktionen werden isoliert bewertet; der gewachsene ABC-Tools-Überbau wird nicht übernommen.

## Schnittstellenidee
```js
NotationModule.loadScore(score)
NotationModule.loadABC(abc)
NotationModule.loadMusicXML(xml)
NotationModule.loadMIDI(data)
NotationModule.getScore()
NotationModule.getABC()
NotationModule.exportMusicXML()
NotationModule.exportMIDI()
NotationModule.print()
NotationModule.exportPDF()
```

Die konkrete API wird erst nach einem kleinen abcjs-Prototyp verbindlich festgelegt.

## Technischer Referenzstand v0.1.23
- MIDI-Export: binäre Daten aus abcjs, anschließend Blob/Object-URL-Download. Kein Data-URI-Export.
- WebApp: versionsgebundener Service-Worker-Cache mit network-first Strategie und Offline-Fallback.
- Versionswechsel müssen gleichzeitig in HTML-Modulreferenzen, Modulversion und Service-Worker-Cache nachvollziehbar sein.
- Die PWA-Schicht gehört zur Test-/Host-App; der app-unabhängige Notationskern bleibt davon getrennt.

## Entwicklungsregeln
- Modul unabhängig entwickeln und testen.
- Eigene Versionsnummer.
- Kleine testbare Schritte.
- Keine App-Abhängigkeiten.
- Erst hör-/sichtbaren Nutzen nachweisen, dann Komplexität ergänzen.
- Bestehende Apps erst integrieren, wenn das Modul eigenständig stabil funktioniert.
- Vor einer neuen technischen Lösung zuerst prüfen, ob Minimal Composer, MusicChat oder ein anderes eigenes stabiles Projekt den benötigten Mechanismus bereits zuverlässig implementiert.
- Programmfehler, Deployment-Fehler und Cache-/PWA-Fehler getrennt diagnostizieren.
- Keine unbestätigte technische Ursache als Tatsache behandeln.
- Testfreigabe erst nach abgeschlossenem letzten GitHub-Pages-Deployment.
- Bestätigt funktionierenden Code bei angrenzenden Reparaturen nicht unnötig verändern.
