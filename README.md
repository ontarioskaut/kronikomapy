# kronikomapy
prostě interaktivní mapa jako doplněk k oddílové kronice

- backend je v pythonu3 s bottlepy
  - tzn. v základu se musí zvlášť spouštět (udělat service v systemd) a nastavit reverzní proxy
  - vyžaduje `bottlepy` a `beaker`
- zatím jen základ + jednoduché přihlašování
- jde pak měnit i obrázky markerů, takže bych jich udělal několik pro různé věci, které budeme označovat
- body se zadávají prostě skrz souřadnice, které později bude možné vybrat v adminu
- pár užitečných odkazů
  - https://www.youtube.com/watch?v=wnsEYm9hF0o
  - https://cloud.maptiler.com/maps/
  - https://leafletjs.com/
- `index.html` bude dělán tak, aby se dal kdykoliv vložit do nějké stránky jako vlastní kód
  - což znamená, že body a příp. trasy budou definované v JSONu na serveru
  - nesmíme potom zapomenout na CORS hlavičky! aby to šlo načítat odjinud
- otázkou je, zda kronikové zápisy nedávat přímo sem, protože na wixu nejdou dát fotky ze zoneramy a ve free verzi je málo místa. A nebo čas od času automaticky stahovat z wixu a přidávat sem, aby člověk nemusel editovat jinde...
