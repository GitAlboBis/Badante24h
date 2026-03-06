# Badante24h — Schema del Database

> **Versione:** 2.0  
> **Data:** 2026-03-06  
> **Motore:** PostgreSQL 15 + PostGIS 3.x (via Supabase)  
> **SRID:** 4326 (WGS 84)  
> **Lingua dello schema:** Italiano

---

## 1. Diagramma ER

```mermaid
erDiagram
    AUTH_USERS ||--|| PROFILI : "1:1"
    PROFILI ||--o| DETTAGLI_BADANTE : "1:0..1"
    PROFILI ||--o| DETTAGLI_FAMIGLIA : "1:0..1"

    PROFILI {
        uuid id PK
        uuid utente_id FK
        ruolo_utente ruolo
        text tipo_profilo
        text nome
        text provincia
        timestamptz data_iscrizione
        timestamptz ultimo_accesso
        integer numero_visite
        text avatar_url
        geography location
    }

    DETTAGLI_BADANTE {
        uuid profilo_id PK_FK
        varchar sesso
        date data_di_nascita
        text paese_residenza
        text citta
        text nazionalita
        text_array lingue_parlate
        text_array lingue_base
        text disponibilita_ore
        boolean esperienze_precedenti
        boolean fuma
        boolean patente_guida
        boolean automunita
        boolean aiuto_persone_disabili
        boolean aiuto_lavori_domestici
        text lettera_presentazione_famiglie
        text esperienze_lavorative
        text compenso_orientativo
    }

    DETTAGLI_FAMIGLIA {
        uuid profilo_id PK_FK
        integer numero_persone_casa
        boolean disponibilita_stanza_privata
        integer persone_da_accudire
        boolean richiede_esperienze_precedenti
        boolean fumatori_in_casa
        boolean persone_disabili_in_casa
        boolean richiede_aiuto_lavori_domestici
        text lettera_presentazione_badanti
        text richieste_presentate
        text condizioni_economiche_proposte
    }
```

---

## 2. Estensioni

```sql
-- Abilita PostGIS per le query geospaziali
CREATE EXTENSION IF NOT EXISTS postgis;

-- Abilita pg_trgm per la ricerca fuzzy su testo (opzionale)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Abilita la generazione di UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

---

## 3. Tipi Enum

```sql
-- Ruolo dell'utente
CREATE TYPE public.ruolo_utente AS ENUM ('famiglia', 'badante', 'admin');
```

---

## 4. Tabelle

### 4.1 `profili`

Tabella principale dei profili utente. Estende `auth.users` con i dati specifici dell'applicazione. Ogni utente registrato ha un record in questa tabella.

| Colonna           | Tipo            | Vincoli / Default                          | Descrizione                                  |
|-------------------|-----------------|--------------------------------------------|----------------------------------------------|
| `id`              | `UUID`          | `PK`, `DEFAULT gen_random_uuid()`          | Identificativo univoco del profilo           |
| `utente_id`       | `UUID`          | `FK → auth.users(id) ON DELETE CASCADE`    | Riferimento all'utente autenticato           |
| `ruolo`           | `ruolo_utente`  | `NOT NULL`                                 | Ruolo: `famiglia`, `badante` o `admin`       |
| `tipo_profilo`    | `TEXT`           |                                            | Tipo di profilo (uso generico)               |
| `nome`            | `TEXT`           |                                            | Nome visualizzato                            |
| `provincia`       | `TEXT`           |                                            | Provincia di residenza                       |
| `data_iscrizione` | `TIMESTAMPTZ`   | `DEFAULT now()`                            | Data di registrazione                        |
| `ultimo_accesso`  | `TIMESTAMPTZ`   |                                            | Ultimo accesso alla piattaforma              |
| `numero_visite`   | `INTEGER`       | `DEFAULT 0`                                | Contatore delle visite al profilo            |
| `avatar_url`      | `TEXT`           |                                            | URL dell'immagine del profilo                |
| `location`        | `geography(POINT)` |                                         | Posizione geospaziale (PostGIS, SRID 4326)   |

```sql
CREATE TABLE public.profili (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    utente_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ruolo public.ruolo_utente NOT NULL,
    tipo_profilo TEXT,
    nome TEXT,
    provincia TEXT,
    data_iscrizione TIMESTAMPTZ DEFAULT now(),
    ultimo_accesso TIMESTAMPTZ,
    numero_visite INTEGER DEFAULT 0,
    avatar_url TEXT,
    location geography(POINT)
);
```

---

### 4.2 `dettagli_badante`

Dati estesi per gli utenti con ruolo `badante`. Relazione **1:1** con `profili` tramite `profilo_id` (chiave primaria e chiave esterna).

| Colonna                          | Tipo         | Vincoli / Default                                     | Descrizione                                     |
|----------------------------------|--------------|-------------------------------------------------------|-------------------------------------------------|
| `profilo_id`                     | `UUID`       | `PK`, `FK → profili(id) ON DELETE CASCADE`            | Riferimento al profilo genitore                 |
| `sesso`                          | `VARCHAR(1)` | `CHECK (sesso IN ('M', 'F'))`                         | Sesso (`M` o `F`)                               |
| `data_di_nascita`                | `DATE`       |                                                       | Data di nascita                                 |
| `paese_residenza`                | `TEXT`       |                                                       | Paese di residenza                              |
| `citta`                          | `TEXT`       |                                                       | Città di residenza                              |
| `nazionalita`                    | `TEXT`       |                                                       | Nazionalità                                     |
| `lingue_parlate`                 | `TEXT[]`     |                                                       | Lingue parlate correntemente                    |
| `lingue_base`                    | `TEXT[]`     |                                                       | Lingue con conoscenza di base                   |
| `disponibilita_ore`              | `TEXT`       |                                                       | Disponibilità oraria (es. "Full-time")          |
| `esperienze_precedenti`          | `BOOLEAN`    |                                                       | Ha esperienze precedenti nel settore            |
| `fuma`                           | `BOOLEAN`    |                                                       | Indica se la badante fuma                       |
| `patente_guida`                  | `BOOLEAN`    |                                                       | Possiede la patente di guida                    |
| `automunita`                     | `BOOLEAN`    |                                                       | Possiede un'automobile                          |
| `aiuto_persone_disabili`         | `BOOLEAN`    |                                                       | Disponibile ad assistere persone disabili        |
| `aiuto_lavori_domestici`         | `BOOLEAN`    |                                                       | Disponibile per lavori domestici                |
| `lettera_presentazione_famiglie` | `TEXT`       |                                                       | Lettera di presentazione rivolta alle famiglie  |
| `esperienze_lavorative`          | `TEXT`       |                                                       | Descrizione delle esperienze lavorative         |
| `compenso_orientativo`           | `TEXT`       |                                                       | Compenso richiesto indicativo                   |

```sql
CREATE TABLE public.dettagli_badante (
    profilo_id UUID PRIMARY KEY REFERENCES public.profili(id) ON DELETE CASCADE,
    sesso VARCHAR(1) CHECK (sesso IN ('M', 'F')),
    data_di_nascita DATE,
    paese_residenza TEXT,
    citta TEXT,
    nazionalita TEXT,
    lingue_parlate TEXT[],
    lingue_base TEXT[],
    disponibilita_ore TEXT,
    esperienze_precedenti BOOLEAN,
    fuma BOOLEAN,
    patente_guida BOOLEAN,
    automunita BOOLEAN,
    aiuto_persone_disabili BOOLEAN,
    aiuto_lavori_domestici BOOLEAN,
    lettera_presentazione_famiglie TEXT,
    esperienze_lavorative TEXT,
    compenso_orientativo TEXT
);
```

---

### 4.3 `dettagli_famiglia`

Dati estesi per gli utenti con ruolo `famiglia`. Relazione **1:1** con `profili` tramite `profilo_id`.

| Colonna                           | Tipo       | Vincoli / Default                         | Descrizione                                             |
|-----------------------------------|------------|-------------------------------------------|---------------------------------------------------------|
| `profilo_id`                      | `UUID`     | `PK`, `FK → profili(id) ON DELETE CASCADE`| Riferimento al profilo genitore                         |
| `numero_persone_casa`             | `INTEGER`  |                                           | Numero di persone in casa                               |
| `disponibilita_stanza_privata`    | `BOOLEAN`  |                                           | Disponibilità di una stanza privata per la badante      |
| `persone_da_accudire`             | `INTEGER`  |                                           | Numero di persone da accudire                           |
| `richiede_esperienze_precedenti`  | `BOOLEAN`  |                                           | Richiede che la badante abbia esperienza                |
| `fumatori_in_casa`                | `BOOLEAN`  |                                           | Presenza di fumatori in casa                            |
| `persone_disabili_in_casa`        | `BOOLEAN`  |                                           | Presenza di persone disabili in casa                    |
| `richiede_aiuto_lavori_domestici` | `BOOLEAN`  |                                           | Richiede aiuto con i lavori domestici                   |
| `lettera_presentazione_badanti`   | `TEXT`     |                                           | Lettera di presentazione rivolta alle badanti           |
| `richieste_presentate`            | `TEXT`     |                                           | Richieste specifiche della famiglia                     |
| `condizioni_economiche_proposte`  | `TEXT`     |                                           | Condizioni economiche proposte dalla famiglia           |

```sql
CREATE TABLE public.dettagli_famiglia (
    profilo_id UUID PRIMARY KEY REFERENCES public.profili(id) ON DELETE CASCADE,
    numero_persone_casa INTEGER,
    disponibilita_stanza_privata BOOLEAN,
    persone_da_accudire INTEGER,
    richiede_esperienze_precedenti BOOLEAN,
    fumatori_in_casa BOOLEAN,
    persone_disabili_in_casa BOOLEAN,
    richiede_aiuto_lavori_domestici BOOLEAN,
    lettera_presentazione_badanti TEXT,
    richieste_presentate TEXT,
    condizioni_economiche_proposte TEXT
);
```

---

## 5. Row Level Security (RLS)

Tutte le tabelle hanno RLS abilitato. Le policy garantiscono che:

- **Lettura**: tutti gli utenti autenticati possono leggere tutti i profili e i dettagli.
- **Scrittura/Aggiornamento**: ogni utente può modificare solo i propri dati.

```sql
-- Abilita RLS su tutte le tabelle
ALTER TABLE public.profili ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dettagli_badante ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dettagli_famiglia ENABLE ROW LEVEL SECURITY;

-- Policy per PROFILI
CREATE POLICY "Profili visibili a tutti i profili autenticati"
    ON public.profili FOR SELECT TO authenticated USING (true);
CREATE POLICY "Utenti possono aggiornare il proprio profilo"
    ON public.profili FOR UPDATE TO authenticated USING (utente_id = auth.uid());
CREATE POLICY "Utenti possono inserire il proprio profilo"
    ON public.profili FOR INSERT TO authenticated WITH CHECK (utente_id = auth.uid());

-- Policy per DETTAGLI BADANTE
CREATE POLICY "Dettagli badante visibili a tutti i profili autenticati"
    ON public.dettagli_badante FOR SELECT TO authenticated USING (true);
CREATE POLICY "Utenti possono aggiornare i propri dettagli badante"
    ON public.dettagli_badante FOR UPDATE TO authenticated
    USING (profilo_id IN (SELECT id FROM public.profili WHERE utente_id = auth.uid()));
CREATE POLICY "Utenti possono inserire i propri dettagli badante"
    ON public.dettagli_badante FOR INSERT TO authenticated
    WITH CHECK (profilo_id IN (SELECT id FROM public.profili WHERE utente_id = auth.uid()));

-- Policy per DETTAGLI FAMIGLIA
CREATE POLICY "Dettagli famiglia visibili a tutti i profili autenticati"
    ON public.dettagli_famiglia FOR SELECT TO authenticated USING (true);
CREATE POLICY "Utenti possono aggiornare i propri dettagli famiglia"
    ON public.dettagli_famiglia FOR UPDATE TO authenticated
    USING (profilo_id IN (SELECT id FROM public.profili WHERE utente_id = auth.uid()));
CREATE POLICY "Utenti possono inserire i propri dettagli famiglia"
    ON public.dettagli_famiglia FOR INSERT TO authenticated
    WITH CHECK (profilo_id IN (SELECT id FROM public.profili WHERE utente_id = auth.uid()));
```

---

## 6. Query PostGIS Principali

### 6.1 Trovare badanti nel raggio

```sql
-- Trova tutte le badanti entro 10 km da un punto dato
SELECT
    p.id,
    p.nome,
    p.provincia,
    p.avatar_url,
    db.citta,
    db.nazionalita,
    db.compenso_orientativo,
    (ST_Distance(
        p.location,
        ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography
    ) / 1000)::double precision AS distanza_km
FROM public.profili p
JOIN public.dettagli_badante db ON db.profilo_id = p.id
WHERE
    p.ruolo = 'badante'
    AND p.location IS NOT NULL
    AND ST_DWithin(
        p.location,
        ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
        :raggio_metri  -- es. 10000 per 10 km
    )
ORDER BY distanza_km ASC;
```

### 6.2 Aggiornare la posizione di un utente

```sql
-- Imposta la posizione di un utente dalle coordinate GPS
UPDATE public.profili
SET location = ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography
WHERE utente_id = :uid;
```

---

## 7. Funzioni Database (RPC)

### 7.1 `cerca_badanti_vicine` — Ricerca badanti per prossimità

Funzione RPC PostGIS chiamabile dal client Supabase. Accetta latitudine, longitudine e un raggio in chilometri; restituisce le badanti entro il raggio ordinandole per distanza crescente.

**Parametri di input:**

| Parametro     | Tipo               | Default | Descrizione                              |
|---------------|--------------------|---------|------------------------------------------|
| `lat_target`  | `DOUBLE PRECISION` | —       | Latitudine del punto di ricerca          |
| `lon_target`  | `DOUBLE PRECISION` | —       | Longitudine del punto di ricerca         |
| `raggio_km`   | `DOUBLE PRECISION` | `50`    | Raggio di ricerca in chilometri          |

**Colonne restituite:**

| Colonna              | Tipo               | Descrizione                                    |
|----------------------|--------------------|------------------------------------------------|
| `id`                 | `UUID`             | ID del profilo della badante                   |
| `nome`               | `TEXT`             | Nome visualizzato                              |
| `provincia`          | `TEXT`             | Provincia di residenza                         |
| `avatar_url`         | `TEXT`             | URL dell'avatar                                |
| `distanza_km`        | `DOUBLE PRECISION` | Distanza calcolata dal punto di ricerca (km)   |
| `sesso`              | `VARCHAR(1)`       | Sesso (`M` / `F`)                              |
| `eta`                | `INTEGER`          | Età calcolata dalla data di nascita            |
| `citta`              | `TEXT`             | Città di residenza                             |
| `nazionalita`        | `TEXT`             | Nazionalità                                    |
| `compenso_orientativo` | `TEXT`           | Compenso richiesto indicativo                  |

```sql
CREATE OR REPLACE FUNCTION public.cerca_badanti_vicine(
    lat_target double precision,
    lon_target double precision,
    raggio_km double precision DEFAULT 50
)
RETURNS TABLE (
    id UUID,
    nome TEXT,
    provincia TEXT,
    avatar_url TEXT,
    distanza_km double precision,
    sesso VARCHAR(1),
    eta INTEGER,
    citta TEXT,
    nazionalita TEXT,
    compenso_orientativo TEXT
)
LANGUAGE sql
STABLE
AS $$
    SELECT
        p.id,
        p.nome,
        p.provincia,
        p.avatar_url,
        (ST_Distance(
            p.location,
            ST_SetSRID(ST_MakePoint(lon_target, lat_target), 4326)::geography
        ) / 1000)::double precision AS distanza_km,
        db.sesso,
        EXTRACT(YEAR FROM AGE(CURRENT_DATE, db.data_di_nascita))::integer AS eta,
        db.citta,
        db.nazionalita,
        db.compenso_orientativo
    FROM
        public.profili p
    JOIN
        public.dettagli_badante db ON p.id = db.profilo_id
    WHERE
        p.ruolo = 'badante'
        AND p.location IS NOT NULL
        AND ST_DWithin(
            p.location,
            ST_SetSRID(ST_MakePoint(lon_target, lat_target), 4326)::geography,
            raggio_km * 1000
        )
    ORDER BY
        distanza_km ASC;
$$;
```

### 7.2 Esempio di chiamata dal client Supabase

```typescript
const { data, error } = await supabase.rpc('cerca_badanti_vicine', {
  lat_target: 41.9028,
  lon_target: 12.4964,
  raggio_km: 25,
});
```

---

## 8. Storage Bucket

```sql
-- Crea i bucket di storage (eseguire via Supabase Dashboard o SQL)
INSERT INTO storage.buckets (id, name, public)
VALUES
    ('avatars', 'avatars', TRUE),
    ('documents', 'documents', FALSE);
```

### Policy di Storage

```sql
-- Avatars: chiunque può leggere, solo il proprietario può caricare/aggiornare/eliminare
CREATE POLICY "Lettura avatar" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Inserimento avatar proprio" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Aggiornamento avatar proprio" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'avatars'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Eliminazione avatar proprio" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'avatars'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Documenti: solo il proprietario e gli admin possono accedere
CREATE POLICY "Lettura documenti proprietario" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'documents'
        AND (
            auth.uid()::text = (storage.foldername(name))[1]
            OR EXISTS (
                SELECT 1 FROM public.profili
                WHERE utente_id = auth.uid() AND ruolo = 'admin'
            )
        )
    );

CREATE POLICY "Inserimento documenti proprietario" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'documents'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );
```

---

## 9. Migrazione di Riferimento

Lo schema italiano è stato introdotto con la migrazione:

- **File:** `supabase/migrations/00012_italian_schema_legacy_fields.sql`
- **Azione:** Drop delle tabelle inglesi legacy (`profiles`, `caregiver_details`) e creazione delle nuove tabelle italiane (`profili`, `dettagli_badante`, `dettagli_famiglia`).
