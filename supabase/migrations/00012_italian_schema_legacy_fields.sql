-- Migration 00012_italian_schema_legacy_fields.sql

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.dettagli_famiglia CASCADE;
DROP TABLE IF EXISTS public.dettagli_badante CASCADE;
DROP TABLE IF EXISTS public.profili CASCADE;
DROP TABLE IF EXISTS public.caregiver_details CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TYPE IF EXISTS public.ruolo_utente CASCADE;

-- Create enum for roles
CREATE TYPE public.ruolo_utente AS ENUM ('famiglia', 'badante', 'admin');

-- Create Profili table
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

-- Create Dettagli Badante
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

-- Create Dettagli Famiglia
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

-- Enable RLS
ALTER TABLE public.profili ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dettagli_badante ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dettagli_famiglia ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies
CREATE POLICY "Profili visibili a tutti i profili autenticati" ON public.profili FOR SELECT TO authenticated USING (true);
CREATE POLICY "Utenti possono aggiornare il proprio profilo" ON public.profili FOR UPDATE TO authenticated USING (utente_id = auth.uid());
CREATE POLICY "Utenti possono inserire il proprio profilo" ON public.profili FOR INSERT TO authenticated WITH CHECK (utente_id = auth.uid());

CREATE POLICY "Dettagli badante visibili a tutti i profili autenticati" ON public.dettagli_badante FOR SELECT TO authenticated USING (true);
CREATE POLICY "Utenti possono aggiornare i propri dettagli badante" ON public.dettagli_badante FOR UPDATE TO authenticated USING (profilo_id IN (SELECT id FROM public.profili WHERE utente_id = auth.uid()));
CREATE POLICY "Utenti possono inserire i propri dettagli badante" ON public.dettagli_badante FOR INSERT TO authenticated WITH CHECK (profilo_id IN (SELECT id FROM public.profili WHERE utente_id = auth.uid()));

CREATE POLICY "Dettagli famiglia visibili a tutti i profili autenticati" ON public.dettagli_famiglia FOR SELECT TO authenticated USING (true);
CREATE POLICY "Utenti possono aggiornare i propri dettagli famiglia" ON public.dettagli_famiglia FOR UPDATE TO authenticated USING (profilo_id IN (SELECT id FROM public.profili WHERE utente_id = auth.uid()));
CREATE POLICY "Utenti possono inserire i propri dettagli famiglia" ON public.dettagli_famiglia FOR INSERT TO authenticated WITH CHECK (profilo_id IN (SELECT id FROM public.profili WHERE utente_id = auth.uid()));

-- Create an RPC to search nearby badanti based on location
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
        (ST_Distance(p.location, ST_SetSRID(ST_MakePoint(lon_target, lat_target), 4326)::geography) / 1000)::double precision AS distanza_km,
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
        AND ST_DWithin(p.location, ST_SetSRID(ST_MakePoint(lon_target, lat_target), 4326)::geography, raggio_km * 1000)
    ORDER BY 
        distanza_km ASC;
$$;
