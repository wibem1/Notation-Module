# Entwicklungsprotokoll

## 2026-09-23 — v0.1.10
- Zentrale Instrumentenverwaltung im Notation Module begonnen.
- Instrumentenauswahl setzt automatisch sichtbaren Stimmnamen und passendes General-MIDI-Programm; MIDI-Nummern müssen nicht manuell eingegeben werden.
- Erste Zuordnungen: Klavier, Violine, Viola, Violoncello, Kontrabass, Flöte, Oboe, Klarinette, Fagott, Trompete, Horn.
- Test-WebApp erhält eine Instrumentenauswahl.
- Das 16-taktige Teststück startet als Violine; beim Wechsel des Instruments werden ABC-Stimmname und Playback-Programm gemeinsam geändert.
- abcjs verwendet standardmäßig Programm 0, wenn im ABC kein Instrument angegeben ist; die neue Modulschicht verhindert dieses Auseinanderfallen von Bezeichnung und Klang.
- Zieltest: Teststück abspielen, dann z.B. Violoncello, Flöte und Klavier wählen; sichtbarer Instrumentenname und Klang müssen gemeinsam wechseln.

## 2026-09-23 — v0.1.9
- Praxistest v0.1.8: Skalierung funktioniert.
- Instrumentenbezeichnung korrigiert: ABC `name="Violine"` ist für die Bezeichnung des ersten Systems gedacht; `subname=""` verhindert eine wiederholte Bezeichnung in Folgesystemen.
- Playback-Instrument explizit auf General-MIDI-Programm 40 (Violine, nullbasiert) gesetzt; abcjs verwendet sonst standardmäßig Programm 0 (Acoustic Grand Piano).
- Zieltest: „Violine“ nur am ersten System; Playback mit Violinenklang.

## 2026-09-23 — v0.1.8
- ABC Tools gezielt als Referenz untersucht, nicht als Architekturvorlage.
- Erkenntnis aus ABC Tools: Notensatzgröße und Seitenfluss werden getrennt behandelt; `%%staffwidth` steuert die verfügbare Satzbreite, und ABC Tools unterstützt `%%scale` über neu berechnete Seitenränder. Für PDF werden Layoutwerte nur temporär injiziert.
- abcjs-Dokumentation gegengeprüft: `scale` ist eine echte Engraving-Skalierung; `responsive: "resize"` dagegen skaliert nur das fertige SVG. `wrap` benötigt `staffwidth`.
- v0.1.8 verwendet deshalb keine CSS-/Browser-Zoomfunktion und kein `responsive: "resize"`.
- Die sichtbare Seitenbreite bleibt fest. Bei größerer Notensatzgröße wird die interne `staffwidth` entsprechend kleiner berechnet; abcjs setzt die Takte mit `wrap` neu.
- CSS-Zwang `max-width:100%` am SVG entfernt, der zuvor zu abgeschnittenem Inhalt beitragen konnte.
- Standard-Teststück auf 16 Takte erweitert, damit echter Systemumbruch beurteilt werden kann.
- Testbereich bewusst zunächst 60–160 %.
- Zieltest: Zurücksetzen → 80/100/130/160 % vergleichen. Symbole müssen tatsächlich größer/kleiner werden; die rechte Kante darf nicht verschwinden; größere Darstellung muss bei Bedarf mehr Systeme erzeugen.

## 2026-09-23 — v0.1.7
- Skalierung aus v0.1.5/v0.1.6 grundlegend korrigiert: keine bloße Verbreiterung mit horizontalem Abschneiden/Scrollen.
- Verfügbare Breite des Notenbereichs wird beim Rendern ermittelt.
- `scale` wird mit passendem `staffwidth` und abcjs-`wrap` kombiniert.
- Bei größeren Noten werden Takte auf zusätzliche Systeme verteilt; bei kleineren Noten passen entsprechend mehr Takte in ein System.
- Partitur bleibt innerhalb des Notenbereichs.
- Zieltest: 80 %, 100 %, 130 % und 160 % vergleichen; Notengröße muss sich ändern, ohne dass der rechte Rand verloren geht.

## 2026-09-23 — v0.1.6
- Fehler aus v0.1.5 korrigiert: abcjs-`scale` wurde gleichzeitig mit `responsive: "resize"` verwendet.
- `responsive: "resize"` skaliert das erzeugte SVG wieder auf die verfügbare Containerbreite; dadurch war die gewählte Notengröße praktisch nicht sichtbar.
- Bildschirmdarstellung rendert jetzt ohne responsive Zwangsskalierung; größere Partituren dürfen im Notenbereich horizontal scrollen.
- Skalierung 50–200 % bleibt als Modul-Funktion erhalten.
- Zieltest: −/+ muss Noten, Notenlinien und Text sichtbar verkleinern/vergrößern.

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
