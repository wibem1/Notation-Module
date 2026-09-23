# Entwicklungsprotokoll

## 2026-09-23 — v0.1.5
- Skalierung als reguläre Funktion des Notation Modules ergänzt: `getScale()` und `setScale()`.
- Bereich 50–200 %, Schritte von 10 %.
- Test-WebApp erhält „Darstellung − 100 % +“ direkt über der Partitur.
- Gewählte Darstellungsgröße wird lokal gespeichert und beim nächsten Aufruf wiederhergestellt.
- Die Skalierung nutzt den abcjs-Renderparameter `scale`; es handelt sich nicht um Browser-Zoom.
- Playback bleibt an die jeweils neu gerenderte Fassung gekoppelt.
- Bildschirm-Skalierung und spätere Druck-Skalierung bleiben konzeptionell getrennt.

## 2026-09-23 — v0.1.4
- iPad-Drucktest: System-Druckdialog funktioniert, das Notenbild nutzte die A4-Seite jedoch viel zu klein.
- Druck-CSS auf A4-Hochformat mit 15-mm-Rändern umgestellt.
- Im Druck werden Überschrift der Testoberfläche, Editor, Bedienelemente und Status ausgeblendet; die Partitur nutzt die verfügbare Seitenbreite.
- Einzelne SVG-Partituren werden nicht innerhalb eines Systems umgebrochen.
- Nächster Test: Druckvorschau auf dem iPad; danach längere Partitur und saubere Mehrseiten-Paginierung.
- abcjs bietet dafür `print` und `oneSvgPerLine`; letzteres ermöglicht saubere Seitenumbrüche und wird für den Mehrseitentest separat geprüft.

## 2026-09-23 — v0.1.3
- Test-WebApp erhält lokales Gedächtnis für den ABC-Text über `localStorage`.
- ABC-Änderungen werden automatisch lokal gespeichert und beim nächsten Aufruf wiederhergestellt.
- Neuer Button „Zurücksetzen“ stellt das mitgelieferte Beispiel wieder her und löscht den lokalen Testzustand.
- Speicherung bleibt bewusst in der Test-WebApp; das app-unabhängige Notation Module selbst bleibt frei von Persistenzlogik.
- Zieltest: ABC ändern → App schließen/neu öffnen → Änderung vorhanden → Play spielt die wiederhergestellte Fassung.

## 2026-09-23 — v0.1.2
- Weiterer iPad-Praxistest: Nach einem vollständigen Neuaufruf der WebApp konnte das Playback ausfallen.
- AudioContext wird jetzt direkt im Play-Handler erzeugt bzw. reaktiviert und explizit an abcjs übergeben.
- Damit folgt die Initialisierung der abcjs-Vorgabe, AudioContext im Handler einer Benutzeraktion zu erzeugen.
- Zieltests: frischer Seitenaufruf → Play sowie ABC ändern → Play.

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
