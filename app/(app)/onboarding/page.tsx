'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
    User,
    Home,
    Heart,
    MapPin,
    ArrowRight,
    ArrowLeft,
    Loader2,
    Stethoscope,
    Users,
} from 'lucide-react'
import { StepIndicator } from '@/components/ui/step-indicator'
import { createProfilo, createDettagliBadante, createDettagliFamiglia } from './actions'

/* ══════════════════════════════════════════════
   Constants
   ══════════════════════════════════════════════ */

const PROVINCE_ITALIANE = [
    'Agrigento', 'Alessandria', 'Ancona', 'Aosta', 'Arezzo', 'Ascoli Piceno',
    'Asti', 'Avellino', 'Bari', 'Barletta-Andria-Trani', 'Belluno', 'Benevento',
    'Bergamo', 'Biella', 'Bologna', 'Bolzano', 'Brescia', 'Brindisi', 'Cagliari',
    'Caltanissetta', 'Campobasso', 'Caserta', 'Catania', 'Catanzaro', 'Chieti',
    'Como', 'Cosenza', 'Cremona', 'Crotone', 'Cuneo', 'Enna', 'Fermo', 'Ferrara',
    'Firenze', 'Foggia', 'Forlì-Cesena', 'Frosinone', 'Genova', 'Gorizia',
    'Grosseto', 'Imperia', 'Isernia', 'La Spezia', 'L\'Aquila', 'Latina', 'Lecce',
    'Lecco', 'Livorno', 'Lodi', 'Lucca', 'Macerata', 'Mantova', 'Massa-Carrara',
    'Matera', 'Messina', 'Milano', 'Modena', 'Monza e Brianza', 'Napoli', 'Novara',
    'Nuoro', 'Oristano', 'Padova', 'Palermo', 'Parma', 'Pavia', 'Perugia',
    'Pesaro e Urbino', 'Pescara', 'Piacenza', 'Pisa', 'Pistoia', 'Pordenone',
    'Potenza', 'Prato', 'Ragusa', 'Ravenna', 'Reggio Calabria', 'Reggio Emilia',
    'Rieti', 'Rimini', 'Roma', 'Rovigo', 'Salerno', 'Sassari', 'Savona', 'Siena',
    'Siracusa', 'Sondrio', 'Sud Sardegna', 'Taranto', 'Teramo', 'Terni', 'Torino',
    'Trapani', 'Trento', 'Treviso', 'Trieste', 'Udine', 'Varese', 'Venezia',
    'Verbano-Cusio-Ossola', 'Vercelli', 'Verona', 'Vibo Valentia', 'Vicenza', 'Viterbo',
]

const LINGUE = [
    'Italiano', 'Inglese', 'Francese', 'Spagnolo', 'Tedesco',
    'Romeno', 'Ucraino', 'Russo', 'Polacco', 'Albanese',
    'Arabo', 'Cinese', 'Portoghese', 'Filippino', 'Hindi',
]

const DISPONIBILITA_OPTIONS = [
    'Part-time (mattina)',
    'Part-time (pomeriggio)',
    'Full-time giornaliero',
    'Convivente 24h',
    'Solo weekend',
    'Su richiesta',
]

/* ══════════════════════════════════════════════
   Shared UI pieces
   ══════════════════════════════════════════════ */

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 ${className}`}>
            {children}
        </div>
    )
}

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
    return (
        <label htmlFor={htmlFor} className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
            {children}
        </label>
    )
}

function ToggleChip({
    label,
    active,
    onToggle,
}: {
    label: string
    active: boolean
    onToggle: () => void
}) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className={`
                px-3.5 py-2 rounded-full text-sm font-semibold transition-all
                ${active
                    ? 'bg-primary text-white shadow-md shadow-primary/25'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                }
            `}
        >
            {label}
        </button>
    )
}

function BooleanToggle({
    label,
    value,
    onChange,
}: {
    label: string
    value: boolean
    onChange: (v: boolean) => void
}) {
    return (
        <div className="flex items-center justify-between py-2">
            <span className="text-sm text-slate-600 dark:text-slate-300">{label}</span>
            <button
                type="button"
                onClick={() => onChange(!value)}
                className={`
                    relative w-11 h-6 rounded-full transition-colors
                    ${value ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}
                `}
            >
                <span
                    className={`
                        absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform
                        ${value ? 'translate-x-5' : ''}
                    `}
                />
            </button>
        </div>
    )
}

/* ══════════════════════════════════════════════
   Page component
   ══════════════════════════════════════════════ */

export default function OnboardingPage() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    /* ── Wizard state ── */
    const [step, setStep] = useState(1)
    const [error, setError] = useState<string | null>(null)

    /* ── Step 1: Role ── */
    const [ruolo, setRuolo] = useState<'badante' | 'famiglia' | null>(null)

    /* ── Step 2: Base profile ── */
    const [nome, setNome] = useState('')
    const [provincia, setProvincia] = useState('')

    /* ── Step 3a: Badante details ── */
    const [sesso, setSesso] = useState<'M' | 'F' | ''>('')
    const [dataDiNascita, setDataDiNascita] = useState('')
    const [nazionalita, setNazionalita] = useState('')
    const [citta, setCitta] = useState('')
    const [lingueParlate, setLingueParlate] = useState<string[]>([])
    const [disponibilitaOre, setDisponibilitaOre] = useState('')
    const [esperienzePrecedenti, setEsperienzePrecedenti] = useState(false)
    const [fuma, setFuma] = useState(false)
    const [patenteGuida, setPatenteGuida] = useState(false)
    const [automunita, setAutomunita] = useState(false)
    const [aiutoPersoneDisabili, setAiutoPersoneDisabili] = useState(false)
    const [aiutoLavoriDomestici, setAiutoLavoriDomestici] = useState(false)
    const [letteraPresentazione, setLetteraPresentazione] = useState('')
    const [compenso, setCompenso] = useState('')

    /* ── Step 3b: Famiglia details ── */
    const [numPersoneCasa, setNumPersoneCasa] = useState(1)
    const [stanzaPrivata, setStanzaPrivata] = useState(false)
    const [personeDaAccudire, setPersoneDaAccudire] = useState(1)
    const [richiedeEsperienze, setRichiedeEsperienze] = useState(false)
    const [fumatoriInCasa, setFumatoriInCasa] = useState(false)
    const [personeDisabili, setPersoneDisabili] = useState(false)
    const [richiedeAiutoLavori, setRichiedeAiutoLavori] = useState(false)
    const [letteraBadanti, setLetteraBadanti] = useState('')
    const [condizioniEconomiche, setCondizioniEconomiche] = useState('')

    /* ── Stored profilo ID (set after step 2) ── */
    const [profiloId, setProfiloId] = useState<string | null>(null)

    const stepLabels = ['Ruolo', 'Profilo', 'Dettagli']

    /* ── Validation ── */
    const canAdvanceStep1 = ruolo !== null
    const canAdvanceStep2 = nome.trim().length >= 2 && provincia.length > 0

    /* ── Handlers ── */

    async function handleStep2Submit() {
        if (!ruolo) return
        setError(null)

        startTransition(async () => {
            try {
                const result = await createProfilo({
                    ruolo,
                    nome: nome.trim(),
                    provincia,
                })
                setProfiloId(result.profiloId)
                setStep(3)
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Errore imprevisto')
            }
        })
    }

    async function handleBadanteSubmit() {
        if (!profiloId) return
        setError(null)

        startTransition(async () => {
            try {
                await createDettagliBadante(profiloId, {
                    sesso,
                    data_di_nascita: dataDiNascita,
                    nazionalita,
                    citta,
                    lingue_parlate: lingueParlate,
                    disponibilita_ore: disponibilitaOre,
                    esperienze_precedenti: esperienzePrecedenti,
                    fuma,
                    patente_guida: patenteGuida,
                    automunita,
                    aiuto_persone_disabili: aiutoPersoneDisabili,
                    aiuto_lavori_domestici: aiutoLavoriDomestici,
                    lettera_presentazione_famiglie: letteraPresentazione,
                    compenso_orientativo: compenso,
                })
                // redirect happens server-side
            } catch (e) {
                if ((e as Error)?.message === 'NEXT_REDIRECT') {
                    router.push('/discover')
                    return
                }
                setError(e instanceof Error ? e.message : 'Errore imprevisto')
            }
        })
    }

    async function handleFamigliaSubmit() {
        if (!profiloId) return
        setError(null)

        startTransition(async () => {
            try {
                await createDettagliFamiglia(profiloId, {
                    numero_persone_casa: numPersoneCasa,
                    disponibilita_stanza_privata: stanzaPrivata,
                    persone_da_accudire: personeDaAccudire,
                    richiede_esperienze_precedenti: richiedeEsperienze,
                    fumatori_in_casa: fumatoriInCasa,
                    persone_disabili_in_casa: personeDisabili,
                    richiede_aiuto_lavori_domestici: richiedeAiutoLavori,
                    lettera_presentazione_badanti: letteraBadanti,
                    condizioni_economiche_proposte: condizioniEconomiche,
                })
            } catch (e) {
                if ((e as Error)?.message === 'NEXT_REDIRECT') {
                    router.push('/discover')
                    return
                }
                setError(e instanceof Error ? e.message : 'Errore imprevisto')
            }
        })
    }

    /* ══════════════════════════════════════════════
       Render
       ══════════════════════════════════════════════ */

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary/5 dark:from-slate-950 dark:via-slate-900 dark:to-primary/10">
            <div className="max-w-xl mx-auto px-4 py-8 md:py-14">
                {/* ── Header ── */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-4">
                        <Heart className="size-7" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                        Completa il tuo profilo
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Bastano pochi minuti per iniziare
                    </p>
                </div>

                {/* ── Step indicator ── */}
                <div className="mb-8">
                    <StepIndicator steps={stepLabels} currentStep={step} />
                </div>

                {/* ── Error ── */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-sm text-red-700 dark:text-red-400">
                        {error}
                    </div>
                )}

                {/* ══════════════════════════
                   Step 1: Choose role
                   ══════════════════════════ */}
                {step === 1 && (
                    <Card>
                        <h2 className="text-lg font-bold mb-1">Chi sei?</h2>
                        <p className="text-sm text-slate-500 mb-6">
                            Seleziona il tuo ruolo sulla piattaforma
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Badante */}
                            <button
                                type="button"
                                onClick={() => setRuolo('badante')}
                                className={`
                                    group flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all
                                    ${ruolo === 'badante'
                                        ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                                        : 'border-slate-200 dark:border-slate-700 hover:border-primary/40'
                                    }
                                `}
                            >
                                <div className={`
                                    w-16 h-16 rounded-2xl flex items-center justify-center transition-colors
                                    ${ruolo === 'badante' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-primary'}
                                `}>
                                    <Stethoscope className="size-7" />
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-slate-900 dark:text-white">Badante</p>
                                    <p className="text-xs text-slate-400 mt-0.5">Offro assistenza</p>
                                </div>
                            </button>

                            {/* Famiglia */}
                            <button
                                type="button"
                                onClick={() => setRuolo('famiglia')}
                                className={`
                                    group flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all
                                    ${ruolo === 'famiglia'
                                        ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                                        : 'border-slate-200 dark:border-slate-700 hover:border-primary/40'
                                    }
                                `}
                            >
                                <div className={`
                                    w-16 h-16 rounded-2xl flex items-center justify-center transition-colors
                                    ${ruolo === 'famiglia' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-primary'}
                                `}>
                                    <Users className="size-7" />
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-slate-900 dark:text-white">Famiglia</p>
                                    <p className="text-xs text-slate-400 mt-0.5">Cerco assistenza</p>
                                </div>
                            </button>
                        </div>

                        <button
                            type="button"
                            disabled={!canAdvanceStep1}
                            onClick={() => setStep(2)}
                            className="mt-6 w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-primary text-white font-bold text-sm disabled:opacity-40 hover:bg-primary/90 transition-colors"
                        >
                            Continua
                            <ArrowRight className="size-4" />
                        </button>
                    </Card>
                )}

                {/* ══════════════════════════
                   Step 2: Base profile
                   ══════════════════════════ */}
                {step === 2 && (
                    <Card>
                        <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
                            <User className="size-5 text-primary" />
                            Informazioni base
                        </h2>
                        <p className="text-sm text-slate-500 mb-6">
                            Come ti chiami e dove ti trovi?
                        </p>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="nome">Nome completo</Label>
                                <input
                                    id="nome"
                                    type="text"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    placeholder="es. Maria Rossi"
                                    className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                                />
                            </div>

                            <div>
                                <Label htmlFor="provincia">
                                    <span className="flex items-center gap-1.5"><MapPin className="size-3.5" /> Provincia</span>
                                </Label>
                                <select
                                    id="provincia"
                                    value={provincia}
                                    onChange={(e) => setProvincia(e.target.value)}
                                    className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary appearance-none transition-colors"
                                >
                                    <option value="">Seleziona provincia…</option>
                                    {PROVINCE_ITALIANE.map((p) => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="flex items-center justify-center gap-1.5 h-12 px-5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                <ArrowLeft className="size-4" />
                                Indietro
                            </button>
                            <button
                                type="button"
                                disabled={!canAdvanceStep2 || isPending}
                                onClick={handleStep2Submit}
                                className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-primary text-white font-bold text-sm disabled:opacity-40 hover:bg-primary/90 transition-colors"
                            >
                                {isPending ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    <>
                                        Continua
                                        <ArrowRight className="size-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </Card>
                )}

                {/* ══════════════════════════
                   Step 3a: Badante details
                   ══════════════════════════ */}
                {step === 3 && ruolo === 'badante' && (
                    <Card className="space-y-5">
                        <div>
                            <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
                                <Stethoscope className="size-5 text-primary" />
                                Il tuo profilo badante
                            </h2>
                            <p className="text-sm text-slate-500">
                                Compila i dettagli per farti trovare dalle famiglie
                            </p>
                        </div>

                        {/* Sesso */}
                        <div>
                            <Label>Sesso</Label>
                            <div className="flex gap-3">
                                {(['F', 'M'] as const).map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setSesso(s)}
                                        className={`
                                            flex-1 h-11 rounded-xl border-2 text-sm font-semibold transition-all
                                            ${sesso === s
                                                ? 'border-primary bg-primary/5 text-primary'
                                                : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-primary/40'
                                            }
                                        `}
                                    >
                                        {s === 'F' ? 'Donna' : 'Uomo'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Date + Nazionalità + Città */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="dataNascita">Data di nascita</Label>
                                <input
                                    id="dataNascita"
                                    type="date"
                                    value={dataDiNascita}
                                    onChange={(e) => setDataDiNascita(e.target.value)}
                                    className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                                />
                            </div>
                            <div>
                                <Label htmlFor="nazionalita">Nazionalità</Label>
                                <input
                                    id="nazionalita"
                                    type="text"
                                    value={nazionalita}
                                    onChange={(e) => setNazionalita(e.target.value)}
                                    placeholder="es. Italiana"
                                    className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="citta">Città</Label>
                            <input
                                id="citta"
                                type="text"
                                value={citta}
                                onChange={(e) => setCitta(e.target.value)}
                                placeholder="es. Roma"
                                className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                            />
                        </div>

                        {/* Lingue */}
                        <div>
                            <Label>Lingue parlate</Label>
                            <div className="flex flex-wrap gap-2">
                                {LINGUE.map((lang) => (
                                    <ToggleChip
                                        key={lang}
                                        label={lang}
                                        active={lingueParlate.includes(lang)}
                                        onToggle={() =>
                                            setLingueParlate((prev) =>
                                                prev.includes(lang)
                                                    ? prev.filter((l) => l !== lang)
                                                    : [...prev, lang]
                                            )
                                        }
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Disponibilità */}
                        <div>
                            <Label>Disponibilità oraria</Label>
                            <div className="flex flex-wrap gap-2">
                                {DISPONIBILITA_OPTIONS.map((opt) => (
                                    <ToggleChip
                                        key={opt}
                                        label={opt}
                                        active={disponibilitaOre === opt}
                                        onToggle={() => setDisponibilitaOre(disponibilitaOre === opt ? '' : opt)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Boolean toggles */}
                        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-1">
                            <BooleanToggle label="Esperienze precedenti" value={esperienzePrecedenti} onChange={setEsperienzePrecedenti} />
                            <BooleanToggle label="Fumatore/fumatrice" value={fuma} onChange={setFuma} />
                            <BooleanToggle label="Patente di guida" value={patenteGuida} onChange={setPatenteGuida} />
                            <BooleanToggle label="Automunita" value={automunita} onChange={setAutomunita} />
                            <BooleanToggle label="Aiuto persone disabili" value={aiutoPersoneDisabili} onChange={setAiutoPersoneDisabili} />
                            <BooleanToggle label="Aiuto lavori domestici" value={aiutoLavoriDomestici} onChange={setAiutoLavoriDomestici} />
                        </div>

                        {/* Lettera + Compenso */}
                        <div>
                            <Label htmlFor="lettera">Presentazione per le famiglie</Label>
                            <textarea
                                id="lettera"
                                value={letteraPresentazione}
                                onChange={(e) => setLetteraPresentazione(e.target.value)}
                                rows={4}
                                placeholder="Descrivi la tua esperienza e cosa ti rende speciale…"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                            />
                        </div>

                        <div>
                            <Label htmlFor="compenso">Compenso orientativo</Label>
                            <input
                                id="compenso"
                                type="text"
                                value={compenso}
                                onChange={(e) => setCompenso(e.target.value)}
                                placeholder="es. €8-12/ora oppure €1200/mese convivente"
                                className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="button"
                            disabled={isPending}
                            onClick={handleBadanteSubmit}
                            className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-primary text-white font-bold text-sm disabled:opacity-40 hover:bg-primary/90 transition-colors"
                        >
                            {isPending ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <>
                                    Completa registrazione
                                    <ArrowRight className="size-4" />
                                </>
                            )}
                        </button>
                    </Card>
                )}

                {/* ══════════════════════════
                   Step 3b: Famiglia details
                   ══════════════════════════ */}
                {step === 3 && ruolo === 'famiglia' && (
                    <Card className="space-y-5">
                        <div>
                            <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
                                <Home className="size-5 text-primary" />
                                La tua famiglia
                            </h2>
                            <p className="text-sm text-slate-500">
                                Aiutaci a trovare la badante giusta per te
                            </p>
                        </div>

                        {/* Conteggi */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="numPersone">Persone in casa</Label>
                                <input
                                    id="numPersone"
                                    type="number"
                                    min={1}
                                    max={20}
                                    value={numPersoneCasa}
                                    onChange={(e) => setNumPersoneCasa(parseInt(e.target.value) || 1)}
                                    className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                                />
                            </div>
                            <div>
                                <Label htmlFor="persAccudire">Persone da accudire</Label>
                                <input
                                    id="persAccudire"
                                    type="number"
                                    min={1}
                                    max={10}
                                    value={personeDaAccudire}
                                    onChange={(e) => setPersoneDaAccudire(parseInt(e.target.value) || 1)}
                                    className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                                />
                            </div>
                        </div>

                        {/* Boolean toggles */}
                        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-1">
                            <BooleanToggle label="Stanza privata disponibile" value={stanzaPrivata} onChange={setStanzaPrivata} />
                            <BooleanToggle label="Richiede esperienze precedenti" value={richiedeEsperienze} onChange={setRichiedeEsperienze} />
                            <BooleanToggle label="Fumatori in casa" value={fumatoriInCasa} onChange={setFumatoriInCasa} />
                            <BooleanToggle label="Persone disabili in casa" value={personeDisabili} onChange={setPersoneDisabili} />
                            <BooleanToggle label="Richiede aiuto lavori domestici" value={richiedeAiutoLavori} onChange={setRichiedeAiutoLavori} />
                        </div>

                        {/* Testi liberi */}
                        <div>
                            <Label htmlFor="letteraBadanti">Messaggio per le badanti</Label>
                            <textarea
                                id="letteraBadanti"
                                value={letteraBadanti}
                                onChange={(e) => setLetteraBadanti(e.target.value)}
                                rows={4}
                                placeholder="Descrivi la tua situazione e cosa cerchi…"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                            />
                        </div>

                        <div>
                            <Label htmlFor="condizioni">Condizioni economiche proposte</Label>
                            <input
                                id="condizioni"
                                type="text"
                                value={condizioniEconomiche}
                                onChange={(e) => setCondizioniEconomiche(e.target.value)}
                                placeholder="es. €1000-1500/mese + vitto e alloggio"
                                className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="button"
                            disabled={isPending}
                            onClick={handleFamigliaSubmit}
                            className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-primary text-white font-bold text-sm disabled:opacity-40 hover:bg-primary/90 transition-colors"
                        >
                            {isPending ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <>
                                    Completa registrazione
                                    <ArrowRight className="size-4" />
                                </>
                            )}
                        </button>
                    </Card>
                )}
            </div>
        </div>
    )
}
