# Microsoft Exam Trainer

Benvenuto nel progetto **Microsoft Exam Trainer**, una webapp che simula un test per gli esami di certificazione Microsoft con un’interfaccia gamificata ispirata a Duolingo. L’applicazione visualizza le domande direttamente dagli screenshot forniti e non genera mai contenuti aggiuntivi: tutto il testo e le opzioni di risposta provengono esclusivamente dai tuoi file.

## Caratteristiche principali

- **Fedeltà agli screenshot**: ogni domanda viene mostrata come immagine. Se sono presenti file JSON di metadati associati (stesso nome file con estensione `.json`), l’app abilita le opzioni di risposta (single choice, multiple choice, drag & drop, ordering, matching) in base a quei dati. In assenza di metadati, la domanda rimane “solo immagine” e serve solo per la revisione.
- **Gamification stile Duolingo**: cuori, punti XP, streak giornaliero, barra di progresso e statistiche. I punti vengono assegnati in base al tipo di domanda e le vite diminuiscono con ogni risposta errata.
- **Modalità pratica ed esame**: in pratica puoi vedere subito se la risposta è corretta; in modalità esame viene mostrato un timer e il punteggio viene calcolato al termine. L’esame si considera superato con almeno il 70 % di risposte corrette.
- **Import guidato**: una pagina dedicata permette di caricare un archivio ZIP contenente gli screenshot e i relativi metadati. Le domande vengono lette direttamente dal file senza inviare dati a server esterni.
- **Revisione e statistiche**: rivedi rapidamente tutte le domande, filtra per capitolo e consulta XP, cuori, streak e accuratezza.

## Struttura del progetto

```
├── public/
│   └── questions/       # colloca qui le tue cartelle di domande (una cartella per capitolo)
├── scripts/
│   └── generateImportReport.js    # script Node per creare import_report.json e summary.csv
├── src/
│   ├── app/             # pagine Next.js (home, practice, exam, import, review, stats)
│   ├── components/      # componenti riutilizzabili (ChapterBar, QuestionViewer, AnswerPanel, HUD)
│   ├── lib/             # store Zustand, tipi TypeScript
│   └── app/globals.css  # stili globali con Tailwind
├── next.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

## Requisiti

- Node.js ≥ 18
- pnpm / npm / yarn a tua scelta

## Installazione

1. **Clona** il repository e posizionati nella cartella del progetto:

   ```bash
   git clone <repository-url>
   cd microsoft-exam-trainer
   ```

2. **Installa** le dipendenze:

   ```bash
   npm install
   # oppure
   # pnpm install
   # yarn install
   ```

3. **Aggiungi le domande**:

   - Crea una cartella per ogni capitolo sotto `public/questions`, ad esempio `public/questions/Chapter_01`, `public/questions/Chapter_02`, ecc.
   - All’interno di ogni cartella inserisci gli screenshot (`.png`, `.jpg`) e, se disponibili, i file di metadati con lo stesso nome (ad esempio `Q001.png` e `Q001.json`).
   - Puoi anche importare un archivio ZIP tramite l’interfaccia web (`/import`); l’app estrarrà le domande e aggiornerà lo stato.
   - Se desideri generare un file `import_report.json` e un `summary.csv` per l’import automatico, esegui lo script:

     ```bash
     node scripts/generateImportReport.js public/questions/AI-102
     ```

     Questo creerà i due file nella cartella specificata. Assicurati di aggiornare il percorso in base alle tue cartelle.

4. **Avvia** il server di sviluppo:

   ```bash
   npm run dev
   ```

   L’app sarà disponibile su `http://localhost:3000`.

5. **Costruisci** per la produzione (opzionale):

   ```bash
   npm run build
   npm start
   ```

## Utilizzo dell’interfaccia

1. **Homepage**: visualizza la HUD gamificata e tre pulsanti principali (Pratica, Simula esame, Importa domande).
2. **Pratica**: carica le domande e affrontale una alla volta. Dopo ogni risposta viene mostrato subito se è corretta; ricevi XP e perdi cuori in caso di errore. Passa alla domanda successiva con il pulsante “Prossima domanda”.
3. **Esame**: simula un esame completo con timer (impostato di default a 60 minuti). Non ricevi feedback immediato; il punteggio finale viene calcolato al termine. Superi l’esame con il 70 % di risposte corrette.
4. **Import**: carica un archivio `.zip` con le domande e i metadati. L’import verrà eseguito in locale e aggiornerà la lista delle domande disponibili nell’app.
5. **Review**: consulta l’elenco delle domande per ripassare. In questa versione di base tutte le domande vengono mostrate qui; in una versione futura potrai filtrare solo quelle sbagliate.
6. **Stats**: rivedi rapidamente XP, cuori rimasti, streak e accuratezza complessiva.

## Script di importazione

Lo script `scripts/generateImportReport.js` è pensato per generare un report dei tuoi screenshot e metadati. Puoi usarlo per preparare i file `import_report.json` e `summary.csv` da includere in `public/questions`. Il report segue la struttura attesa dallo store dell’applicazione.

Esegui lo script passando la cartella che contiene le sottocartelle per capitolo:

```bash
node scripts/generateImportReport.js public/questions/AI-102
```

Questo creerà:

- `public/questions/AI-102/import_report.json` – elenco JSON di capitoli e domande
- `public/questions/AI-102/summary.csv` – riepilogo tabellare (utile per verifica)

## Limitazioni

- L’app non contiene alcuna domanda predefinita. Tutti i contenuti provengono dagli screenshot e dai metadati che carichi.
- Il supporto per domande drag & drop, ordering e matching è in bozza. Attualmente queste tipologie verranno indicate come “solo immagine” finché non saranno implementati gli editor dedicati.
- Il timer dell’esame non interrompe automaticamente la sessione; al termine del tempo riceverai comunque le domande restanti, ma il tempo indicato sarà 0. Puoi estendere questa logica nello store.

## Contribuire

Sono benvenute migliorie e nuove funzionalità! Alcune idee:

- Aggiungere l’editor di hotspot/metadati per domande senza JSON.
- Implementare completamente la logica di drag & drop, ordinamento e matching.
- Migliorare la dashboard delle statistiche con grafici e cronologia.
- Integrare un backend per sincronizzare il progresso su più dispositivi.

## Licenza

Questo progetto è fornito “as is” per scopi educativi e non affiliato a Microsoft. Le domande e gli screenshot caricati rimangono di tua proprietà e non vengono inviati a servizi esterni.