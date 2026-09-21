# Pubblicare l'anteprima su Vercel

Serve solo questa cartella. Niente terminale, niente GitHub.

## Passi

1. Vai su **vercel.com/drop** (se non hai un account, registrati: è gratis)
2. **Trascina questa cartella** (`anteprima sito`) dentro la pagina
3. Scegli il nome del progetto — es. `omni-studio-anteprima`
4. Premi **Deploy**

Dopo pochi secondi hai un indirizzo tipo `omni-studio-anteprima.vercel.app`:
lo copi e lo mandi a chi vuoi. Si apre da qualsiasi telefono o computer,
senza account e senza login.

## Per aggiornare l'anteprima

Ritorna su vercel.com/drop e trascina di nuovo la cartella aggiornata,
oppure, dalla dashboard del progetto, usa **Redeploy**.

## Cosa c'è dentro

| File | A cosa serve |
|---|---|
| `index.html` | la pagina |
| `assets/` | stili, script, logo |
| `vercel.json` | URL puliti + cache lunga sui file statici |
| `robots.txt` | **blocca Google**: è un'anteprima, non deve essere indicizzata |

## Quando diventa il sito vero

Due modifiche, tre minuti:

1. In `index.html`, riga 13: rimetti
   `<meta name="robots" content="index, follow, max-image-preview:large">`
2. Sostituisci `robots.txt` con la versione che trovi commentata dentro il file
   stesso e ricopia `sitemap.xml` dalla cartella principale

Poi, nelle impostazioni del progetto su Vercel, colleghi il dominio
`omnidigitalstudio.it` (sezione **Domains**).

## Prima di mandarla a un cliente

I numeri e i nomi dei clienti nel sito sono **segnaposto**: vedi la tabella in
`LEGGIMI.md` nella cartella principale del progetto.
