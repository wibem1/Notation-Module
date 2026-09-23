# Entwicklungsprotokoll

## 2026-09-23 — v0.1.23 — stabiler Referenzstand
- v0.1.22-MIDI-Export unverändert übernommen und im Hauptmodul bestätigt: gerenderte abcjs-Partitur → `getMidiFile(..., {midiOutputType:'binary'})` → `Uint8Array` → `Blob(type:'audio/midi')` → temporärer Object-URL-Download. Dieser Weg entspricht dem bereits bewährten Downloadmechanismus aus Minimal Composer.
- PWA-Grundlage ergänzt: `manifest.webmanifest` und `sw.js`.
- Service Worker verwendet einen versionsgebundenen Cache (`notation-module-v0.1.23`), löscht alte Caches bei Aktivierung und arbeitet online network-first. Dadurch werden neue Releases in der Home-Bildschirm-WebApp zuverlässig aktualisiert; der Cache dient als Offline-Fallback.
- Praxistest auf dem iPad: direkter Link und WebApp funktionieren nach v0.1.23.

### Fehleranalyse / verbindliche Lehren aus v0.1.22–v0.1.23
- Beim MIDI-Export wurde unnötig lange ABC Tools untersucht, obwohl Minimal Composer bereits einen funktionierenden Binärdaten-/Blob-Download enthielt. Künftig vor einer Neuentwicklung zuerst die eigenen stabilen Apps nach einem bewährten Mechanismus durchsuchen.
- Fehlerquellen strikt trennen: **Programmcode**, **GitHub-Pages-Deployment** und **Browser/PWA-Cache** werden unabhängig geprüft.
- Keine Fehlerursache behaupten, bevor der betreffende Mechanismus im Repository geprüft wurde. Insbesondere wurde zunächst irrtümlich ein Service Worker als Ursache genannt, obwohl noch keiner existierte.
- Bei mehreren unmittelbar aufeinanderfolgenden GitHub-Commits können Pages-Deployments zeitweise unterschiedliche Datei-Stände ausliefern. Einen Testlink erst nach abgeschlossenem letzten Deployment freigeben.
- Einen vom Nutzer bestätigten funktionierenden Kern nicht während einer angrenzenden Fehlerbehebung erneut umbauen. Der bestätigte MIDI-Code wurde deshalb beim PWA-Schritt nicht verändert.


## 2026-09-23 — v0.1.22
- Erste Dateiaustausch-Stufe eingebaut.
- ABC-Import über Dateiauswahl (.abc/.txt): Datei wird in den Editor geladen, lokal gespeichert und sofort neu gerendert.
- ABC-Export als `partitur.abc`.
- MIDI-Export als `partitur.mid` über die aktuelle abcjs-API `ABCJS.synth.getMidiFile(..., {midiOutputType:'binary'})`; automatische Akkordbegleitung bleibt dabei deaktiviert.
- Redundanten Button „Aktualisieren“ entfernt; Live-Rendering bleibt aktiv.
- „Zurücksetzen“ verständlicher in „Teststück laden“ umbenannt.
- Bewusst noch nicht enthalten: MIDI-Import und MusicXML-Import/-Export. Dafür braucht das Modul eine echte Konvertierungsschicht; diese wird nicht durch einen Dateibutton vorgetäuscht.
- Zieltest: ABC exportieren und wieder importieren; Mehrstimmen-Test als MIDI exportieren und in DAW/Player öffnen.

## 2026-09-23 — v0.1.21
- Mehrstimmigkeitstest: fehlende Instrumentennamen und falsches Nur-Klavier-Playback korrigiert.
- Die bisherige Nachbearbeitung entfernte alle `.abcjs-voice-name` außer dem ersten. Bei mehreren Stimmen werden jetzt im ersten System so viele Namen erhalten, wie `V:`-Stimmen deklariert sind; nur durch `wrap` kopierte Wiederholungen werden entfernt.
- MIDI-Programme werden nicht mehr als Inline-`[V:...] %%MIDI` geschrieben. Stattdessen wird jede Stimme mit einer normalen `V:`-Zeile aktiviert und danach `%%MIDI program` gesetzt: Violine 40, Violoncello 42, Klavier 0.
- abcjs erzeugt bei mehreren Stimmen getrennte Tracks; ohne wirksame Instrumentzuweisung fällt der Synth auf Programm 0 (Klavier) zurück.
- Zieltest nach „Zurücksetzen“: Im ersten System stehen Violine, Violoncello und Klavier; Folgesysteme wiederholen die Namen nicht. Playback muss drei unterscheidbare Klangfarben gleichzeitig liefern.

## 2026-09-23 — v0.1.20
- Mehrstimmigkeitstest: Schlussstrich korrigiert.
- Violine, Violoncello und Klavier enden nun jeweils explizit mit dem ABC-Schlusszeichen `|]`.
- Dadurch soll der dünn-dicke Schlussstrich in allen drei Systemen erscheinen, nicht nur im Klaviersystem.
- Sonstige Notensatz- und Wrap-Logik aus v0.1.19 bleibt unverändert.
- Instrumentennamen im ersten System werden separat korrigiert.

## 2026-09-23 — v0.1.19
- Praxistest des dreistimmigen Stücks: Playback und Mehrstimmigkeit funktionieren; grafischer Restfehler war ein einzelner Takt als sehr kurzes letztes System.
- abcjs-Dokumentation bestätigt: `lastLineLimit` versucht Einzeltakte am Schluss zu vermeiden, `preferredMeasuresPerLine` ist jedoch nur ein Zielwert; `lineBreaks` wäre die Alternative für vollständig eigene Umbruchlogik.
- Noch keine eigene `lineBreaks`-Engine eingeführt. Stattdessen zunächst kleinste robuste Korrektur innerhalb des abcjs-Wrappings: Mehrsystem-Partituren verwenden konservativ 3 statt 4 bevorzugte Takte pro System.
- Einstimmige Partituren behalten den bisherigen Zielwert 4.
- Zieltest mit dem unveränderten Mehrstimmigkeitstest: ausgewogenere Verteilung (statt 4+1 möglichst 3+2), kein isolierter kurzer Schlussblock; Skalierung weiterhin bei mehreren Größen prüfen.
- Falls dies bei komplexeren Partituren nicht robust ist, folgt als eigener Entwicklungsschritt eine berechnete `lineBreaks`-Strategie statt weiterer Wrap-Patches.

## 2026-09-23 — v0.1.18
- Eigenes Mehrstimmigkeitsteststück als neuer Standardtest eingebaut.
- Drei gleichzeitig laufende Stimmen/Systeme: Violine (GM 40), Violoncello (GM 42) und Klavier (GM 0).
- Verwendung von `%%score` und expliziten `V:`-Stimmen; abcjs erzeugt bei mehreren Stimmen getrennte Audio-Tracks.
- Violine enthält zusätzlich Triole und Vorschlagsnote; Klavier enthält notierte Akkorde. Automatische Akkordsymbol-Begleitung bleibt weiterhin deaktiviert.
- Testziel: korrekte vertikale Systemausrichtung, gleichzeitige Wiedergabe aller drei Instrumente, unterschiedliche Klangfarben sowie Auswahl Notenbild ↔ ABC über mehrere Stimmen hinweg.
- Die bisherige einzelne Instrumentenauswahl ist für eine echte Mehrstimmenpartitur konzeptionell noch unzureichend; sie bleibt vorerst sichtbar, wird aber in einem Folgeschritt zu einer Stimmen-/Instrumentenverwaltung erweitert.
- Nach Update einmal „Zurücksetzen“, da der ABC-Testtext lokal gespeichert wird.

## 2026-09-23 — v0.1.17
- Automatische Akkordbegleitung im Standard-Playback deaktiviert.
- Sichtbare Akkordsymbole wie `"Am"` bleiben im Notenbild erhalten, erzeugen aber keine zusätzliche Begleitspur mehr.
- Umsetzung über abcjs-Syntheseoption `chordsOff: true`.
- Notierte Akkorde wie `[A2c2]` bleiben Bestandteil der eigentlichen Stimme und werden weiterhin mit deren Instrument wiedergegeben.
- Grundregel: Das Notation Module erfindet standardmäßig keine zusätzlichen Playback-Instrumente. Eine Akkordbegleitung kann später als bewusst zuschaltbare Funktion ergänzt werden.
- Zieltest: Artikulationstest abspielen; kein zusätzliches Klavier beim Akkordsymbol, Violinenstimme einschließlich notiertem Doppelgriff/Akkord bleibt hörbar.

## 2026-09-23 — v0.1.16
- Einfaches 16-Takt-Teststück durch ein gezieltes anspruchsvolleres Notensatz-Teststück ergänzt.
- Enthalten: Auftakt, Triolen, normale Vorschlagnote, kurze Vorschlagnote/Acciaccatura, Bindebögen, Haltebogen, Akkord, Akkordsymbol, punktierte Werte, Pausen und gebrochener Rhythmus.
- Teststück bleibt einstimmig Violine, damit Fehler im Notensatz eindeutig einzelnen Funktionen zugeordnet werden können.
- Zieltest: Darstellung, Skalierung, bidirektionale ABC-Auswahl und Playback mit diesen erweiterten ABC-Konstrukten prüfen.
- Nach Update einmal „Zurücksetzen“ nötig, da die Test-App den bisherigen ABC-Text lokal speichert.

## 2026-09-23 — v0.1.15
- Praxistest v0.1.14 zeigte eine falsche Mehrfachmarkierung im Notenbild.
- Ursache: Die erste Eigenimplementierung versuchte DOM/SVG-Elemente aus `getElementFromChar()` selbst zu markieren. Das ist nicht der von abcjs für Editor-Auswahlen vorgesehene Weg.
- Korrektur nach abcjs-eigener Editor-Implementierung: Auswahl läuft jetzt über `visualObj.engraver.rangeHighlight(start,end)`.
- Bei einem bloßen Cursor ohne Textauswahl wird zuerst mit `getElementFromChar()` die konkrete Note ermittelt und anschließend exakt deren `startChar/endChar` an `rangeHighlight` übergeben.
- Dadurch verwaltet abcjs das Löschen der alten und das Setzen der neuen Auswahl selbst.
- Zusätzlich sichtbaren Inkonsistenz aus dem Screenshot korrigiert: Instrumentenauswahl wird beim Rendern aus `%%MIDI program` synchronisiert. Ein gespeichertes Trompetenstück zeigt daher nicht mehr fälschlich „Violine“ im Auswahlfeld.
- Zieltest: Cursor nacheinander in einzelne ABC-Noten setzen; immer genau eine passende Note soll markiert sein. Instrumentenfeld muss zum gespeicherten ABC passen.

## 2026-09-23 — v0.1.14
- Gegenrichtung der Auswahl ergänzt: ABC-Editor → Notenbild.
- Grundlage ist abcjs `getElementFromChar(start)`, dieselbe Zuordnung, die abcjs in seinem Editor-Beispiel für `selectionChangeCallback` verwendet.
- Notation Module erhält `selectFromABC(start,end)`; die Test-WebApp meldet Cursor-/Auswahländerungen im ABC-Feld an diese Funktion.
- Zugehörige grafische Note wird im Notenbild rot hervorgehoben; vorherige Editor-Markierung wird entfernt.
- Die bestehende Richtung Notenbild → ABC bleibt unverändert.
- Keine Umstellung auf `ABCJS.Editor`; unsere Modularchitektur, Skalierung, Instrumente und Playback bleiben erhalten.
- Zieltest: Cursor in verschiedene ABC-Noten setzen bzw. Note markieren; jeweils muss die entsprechende grafische Note hervorgehoben werden.

## 2026-09-23 — v0.1.13
- Erste Richtung der bidirektionalen Auswahl umgesetzt: Notenbild → ABC-Editor.
- abcjs-`clickListener` liefert das geklickte interne Element; dessen `startChar`/`endChar` werden als Zeichenbereich im ursprünglichen ABC verwendet.
- Notation Module gibt die Auswahl über `onSelect({start,end,element})` an die aufrufende Oberfläche weiter; das Modul kennt weiterhin keinen konkreten Editor.
- Test-WebApp fokussiert daraufhin das ABC-Feld, markiert exakt den zugehörigen Zeichenbereich und scrollt die Stelle ungefähr in die sichtbare Mitte.
- Skalierung, Instrumente, Playback und Persistenz bleiben unverändert.
- Zieltest: verschiedene einzelne Noten in unterschiedlichen Systemen anklicken; im ABC-Editor muss jeweils die passende Note markiert werden.
- Nächster isolierter Schritt nach erfolgreichem Test: ABC-Auswahl → entsprechende Note im Notenbild.

## 2026-09-23 — v0.1.12
- Ursache der wiederholten Instrumentenbezeichnung im abcjs-Quellcode nachvollzogen: Beim nachträglichen `wrap` werden Eigenschaften des ursprünglichen Systems auf neu erzeugte Systeme kopiert; dadurch bleibt der bereits aufgelöste Stimmtitel erhalten.
- ABC-Text bleibt unverändert und korrekt (`name` ohne `subname`).
- Nach dem Rendern werden ausschließlich zusätzliche `.abcjs-voice-name`-Elemente ab dem zweiten Vorkommen entfernt.
- Notensatzskalierung, `wrap`, Playback und Instrumentenzuordnung bleiben unverändert.
- Zieltest: „Violine“ genau einmal am ersten System; Wechsel z.B. zu Violoncello zeigt „Violoncello“ ebenfalls genau einmal.

## 2026-09-23 — v0.1.11
- Fehler aus v0.1.9/v0.1.10 korrigiert: `subname=""` wird nicht mehr erzeugt.
- Nach ABC-Standard bezeichnet `name` nur das erste System; `subname` ist ausdrücklich für alle Folgesysteme bestimmt. Für „nur einmal anzeigen“ muss `subname` daher fehlen.
- Instrumentenwechsel entfernt vorhandene `name/nm/subname/snm`-Angaben und setzt ausschließlich `name`.
- Zieltest nach „Zurücksetzen“: Instrumentenname nur am ersten System; Folgesysteme ohne Instrumentenbezeichnung.

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
