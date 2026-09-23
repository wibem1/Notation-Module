# Entwicklungsprotokoll

## 2026-09-23 — v0.1.1
- Praxistest auf dem iPad: ABC-Livebearbeitung aktualisierte das Notenbild korrekt, danach konnte das Playback jedoch ausfallen.
- Playback-Zustand beim Laden/geänderten ABC jetzt sauber zurückgesetzt.
- Jede gerenderte Fassung erhält intern eine Revision; verspätet fertig werdende Audio-Initialisierungen einer älteren Fassung werden nicht mehr gestartet.
- iOS-Zustände `suspended`/`interrupted` des AudioContext werden nach dem Priming berücksichtigt.
- Zieltest: ABC ändern → neues Notenbild → Play muss die geänderte Fassung wiedergeben.

## 2026-09-23 — v0.1.0
- Eigenständige Test-WebApp angelegt.
- Modulcode und Testoberfläche getrennt.
- abcjs als schlanke Rendering-/Playback-Basis eingebunden.
- ABC-Livebearbeitung mit kurzem Debounce.
- Notenbild, Play/Stop und ABC-Download implementiert.
- Druckansicht implementiert; PDF kann über den System-Druckdialog erzeugt werden.
- Responsive Oberfläche für Desktop/iPad.
- Bewusst noch nicht enthalten: MusicXML, MIDI-Import, dedizierter PDF-Generator, Tune Search.

### Effizienzregel
Neue Funktionen werden in kleinen, hör-/sichtbar testbaren Schritten ergänzt. Keine Integration in Minimal Composer/MusicChat, bevor der jeweilige Modulstand eigenständig funktioniert.
