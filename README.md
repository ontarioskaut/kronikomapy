# kronikomapy
prostě interaktivní mapa jako doplněk k oddílové kronice

## co už funguje
- na `/` je mapa, co si stáhne GeoJSON ze serveru a tobrazí jej
- na `/admin` je adminovátko, kde lze prvky na mapě upravovat a přidávat popisky. JSON se odtud ukládá POST požadavkem na `/save`.
- na `/login` je přihlašovací obrazovka do adminu. Sem se přesměrovává, pokud není aktivní relace
- `/mapfeatures.json` (GeoJSON) a `/static/*` (statické blbinky) mají CORS hlavičky umožňující, aby byl obsah `index.html` embedován přímo do nějaké stránky
## co je potřeba dodělat
- obrázky markerů dle typu akce (schůzky, výpravy, tábory...) - selectbox v popupu v adminu
- jak bude graficky vypadat popup? Vymyslet nějaký mega cool styl?
- zonerama náhledový obrázek v popupu?
- další pole? (rok...)
- vytvořit favicon
- provázání se zbytkem kroniky
- podpora více map od více uživatelů (aby to případně mohly využít ostatní, když už to běži)
## poznámky
- backend je v pythonu3 s bottlepy
  - tzn. v základu se musí zvlášť spouštět (udělat service v systemd - viz `kronikomapy.service`) a nastavit reverzní proxy
  - vyžaduje `bottlepy` a `beaker`
  - teď to je deployed na https://kronikomapy.pernicka.cz
- zatím jen základ + jednoduché přihlašování
- jde pak měnit i obrázky markerů, takže bych jich udělal několik pro různé věci, které budeme označovat
- body se zadávají prostě skrz souřadnice, které později bude možné vybrat v adminu
- tiles:
  - celkem hezký seznam je na https://leaflet-extras.github.io/leaflet-providers/preview/
- pár užitečných odkazů
  - https://www.youtube.com/watch?v=wnsEYm9hF0o
  - https://cloud.maptiler.com/maps/
  - https://leafletjs.com/
- `index.html` bude dělán tak, aby se dal kdykoliv vložit do nějké stránky jako vlastní kód
  - což znamená, že body a příp. trasy budou definované v JSONu na serveru
  - nesmíme potom zapomenout na CORS hlavičky! aby to šlo načítat odjinud
- otázkou je, zda kronikové zápisy nedávat přímo sem, protože na wixu nejdou dát fotky ze zoneramy a ve free verzi je málo místa. A nebo čas od času automaticky stahovat z wixu a přidávat sem, aby člověk nemusel editovat jinde...
- default přihlašovací údaje:
  - user: tester
  - password: smrdis