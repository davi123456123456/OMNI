# OMNI Digital Studio — sito

Tutto il sito sta in questa cartella. Nessun programma da installare,
nessun passaggio di compilazione: sono file HTML, CSS e JavaScript.

---

## 1. Pubblicarlo (o aggiornarlo) su Vercel

1. Vai su **vercel.com/drop** — se non hai un account, registrati, è gratis
2. **Trascina questa cartella** (`anteprima sito`) dentro la pagina
3. Dai un nome al progetto, es. `omni-studio-anteprima`
4. **Deploy**

Dopo qualche secondo hai un indirizzo tipo `omni-studio-anteprima.vercel.app`
da mandare a chiunque: si apre da qualsiasi telefono o computer, senza login.

Per aggiornarlo: ritrascina la cartella su vercel.com/drop, oppure **Redeploy**
dalla dashboard del progetto.

---

## 2. Cosa c'è dentro

| File | A cosa serve |
|---|---|
| `index.html` | la home |
| `chi-siamo.html` | pagina nascosta, si raggiunge solo dal link nel footer |
| `altri-servizi.html` | idem, dal link "Altri servizi" nel footer |
| `assets/css/style.css` | tutto lo stile |
| `assets/js/main.js` | animazioni e interazioni |
| `assets/img/` | logo, favicon, foto del team |
| `vercel.json` | URL puliti + cache lunga sui file statici |
| `robots.txt` | **blocca Google**: finché è un'anteprima non va indicizzata |
| `sitemap.xml` | mappa del sito (solo la home: le due pagine restano nascoste) |

Le due pagine interne non compaiono nel menu né nella sitemap: ci si arriva
solo dai link sottolineati nel footer.

---

## 3. Quando diventa il sito vero

**Il passaggio da non dimenticare:** ora le tre pagine hanno

```html
<meta name="robots" content="noindex, nofollow">
```

che dice a Google di ignorarle. Va sostituito in **tutte e tre** con

```html
<meta name="robots" content="index, follow, max-image-preview:large">
```

altrimenti il sito non comparirà mai nelle ricerche. Sta subito sotto il
`<title>`, con un commento accanto che lo ricorda.

Poi:

- in `robots.txt` togli `Disallow: /` (la versione da usare è già scritta
  commentata dentro il file)
- sostituisci il dominio `www.omnidigitalstudio.it` in `<link rel="canonical">`,
  `og:url` e `sitemap.xml` se l'indirizzo finale sarà diverso
- su Vercel, sezione **Domains**, colleghi il dominio vero

---

## 4. Da sostituire prima di mandarlo a un cliente

| Dove | Cosa |
|---|---|
| tutte le pagine | telefono `320 119 1509`, mail `ciao@omnidigitalstudio.it`, P.IVA |
| hero, "Lavori", footer | **i numeri sono inventati**: +10 progetti, 100/100 PageSpeed, 18 giorni, 4.9/5, 212%, #1 su Google |
| sezione "Lavori" | **nomi clienti e risultati inventati**: Atelier Nord, Studio Ferri, Trattoria Bo |
| sezione "Prezzi" | le cifre 500 / 890 / 2.500 € e l'abbonamento da 50€/mese (ripetuto nella FAQ "Quanto costa") |
| footer | i link a Instagram e LinkedIn puntano a `#` |
| `assets/img/logo-mark.svg` | è una ricostruzione del logo: se hai l'originale vettoriale, sostituiscilo |

---

## 5. Animazioni

Preloader con il logo che si disegna, aurora su canvas nella hero, titoli che
entrano parola per parola, bottoni magnetici, card con inclinazione 3D, sezione
"Metodo" bloccata che scorre in orizzontale (su telefono diventa uno swipe),
iPhone 3D che ruota, contatori animati, ticker infinito, FAQ a fisarmonica,
footer nero con la scritta OMNI in dissolvenza.

Si disattivano da sole se il sistema ha attivo "riduci animazioni", e se il
JavaScript non parte il testo resta comunque visibile e leggibile.

---

## 6. Lavorarci sopra

I file si aprono e si modificano con qualsiasi editor di testo. Per vederli in
locale basta un server statico dentro questa cartella, ad esempio:

```
ruby -run -e httpd -- -p 4321 .
```

poi `http://localhost:4321`.

La cartella nascosta `.artifact/` (un livello sopra) serve solo a generare
l'anteprima dentro Claude: non riguarda il sito pubblicato.
