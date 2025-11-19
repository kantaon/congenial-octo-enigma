# 📐 3D Konfigurátor Vestavěných Skříní - Dokumentace

## 📖 Obsah
1. [Přehled Projektu](#přehled-projektu)
2. [Funkce](#funkce)
3. [Technologický Stack](#technologický-stack)
4. [Instalace a Spuštění](#instalace-a-spuštění)
5. [Architektura Aplikace](#architektura-aplikace)
6. [Uživatelská Příručka](#uživatelská-příručka)
7. [Vývojářská Dokumentace](#vývojářská-dokumentace)
8. [Datové Modely](#datové-modely)

---

## Přehled Projektu

**3D Konfigurátor Vestavěných Skříní** je interaktivní webová aplikace pro navrhování a konfiguraci vestavěných skříní v reálném čase s 3D vizualizací.

### ✨ Klíčové Vlastnosti
- **Interaktivní 3D vizualizace** postavená na Three.js
- **Čtyřstupňový konfigurátor** s intuitivním uživatelským rozhraním
- **Real-time aktualizace** všech změn v 3D prostředí
- **Modulární systém** pro přizpůsobení interiéru
- **Responzivní design** optimalizovaný pro moderní prohlížeče
- **Historie změn** s možností vrátit zpět/opakovat akce (Undo/Redo)

---

## Funkce

### 🔨 Hlavní Funkce

#### 1. Konfigurace Skříně (Krok 1)
- **Pozice v místnosti**: Volně stojící, vlevo, vpravo, přes celou stěnu
- **Rozměry**: Nastavení šířky (60-320 cm), výšky (180-280 cm), hloubky (40-100 cm)
- **Výška až do stropu**: Možnost přizpůsobení plné výšky místnosti
- **Doplňky**: 
  - Zadní stěna
  - Strop a sokl
  - Stropní police
  - Dno a sokl
- **Materiály**: Výběr dekoru skříně z kategorií: Lamino, Dýha, Vysoký lesk, Lacobel, Mramor

#### 2. Konfigurace Interiéru (Krok 2)
- **Počet modulů**: 1-5 vertikálních sekcí
- **Typy modulů**:
  - 🎽 **Ramínko** - Horní police a šatní tyč
  - 👔 **Dvojitá tyč** - Dva věšáky pro košile
  - 📚 **Otevřené police** - Pět pevných polic
  - 👟 **Botník** - Šikmé police na obuv
  - 🗄️ **Zásuvky** - Zásuvky a horní tyč
  - 🗃️ **Komoda** - Tři hluboké zásuvky
  - 💎 **Vitrína** - Asymetrické police s LED lištou
  - 📦 **Boxy** - Síť přihrádek na doplňky
  - 🛏️ **Ložní prádlo** - Široké police na prádlo
- **Dekor interiéru**: Nezávislý výběr materiálů pro vnitřek skříně

#### 3. Konfigurace Dveří (Krok 3)
- **Typy dveří**:
  - **Posuvné** - Úspora prostoru, nezasahují do místnosti
  - **Pantové** - Klasické otevírání
  - **Bez dveří** - Otevřený přístup (šatní stěna)
- **Dekor dveří**: Nezávislý výběr materiálů pro dveře

#### 4. Rekapitulace a Poptávka (Krok 4)
- **Souhrn konfigurace**: Přehled všech vybraných parametrů
- **Formulář poptávky**:
  - Jméno a příjmení
  - E-mail
  - Telefon
  - Adresa realizace
  - PSČ
  - Poznámka
  - Příloha (upload souboru)
  - Souhlas se zpracováním osobních údajů

### 🛠️ Nástroje v 3D Prohlížeči
- **📏 Změřit** - Zobrazení rozměrů v 3D prostoru
- **🚪 Dveře** - Přepínání viditelnosti dveří
- **🧭 Pohled** - Přepínání mezi perspektivními pohledy
- **🏠 Reset** - Návrat kamery na výchozí pozici
- **↩ Zpět / ↪ Vpřed** - Historie změn (Undo/Redo)
- **🔗 Sdílet** - Sdílení konfigurace

### 🎨 Paleta Materiálů
Aplikace nabízí 12 přednastavených dekorů:
- Bílá satén
- Arctic šedá
- Slonová kost
- Dub přírodní
- Ořech tmavý
- Pískovec
- Grafit
- Bříza arktická
- Ebén
- Krémový kámen
- Břidlice
- Jasan světlý

---

## Technologický Stack

### Frontend Framework
- **React 19.1.1** - Moderní UI framework
- **Vite 7.1.7** - Rychlý build nástroj a dev server

### 3D Grafika
- **Three.js 0.180.0** - WebGL knihovna pro 3D grafiku
- **React Three Fiber 9.4.0** - React renderer pro Three.js
- **React Three Drei 10.7.6** - Užitečné komponenty pro R3F

### Styling
- **CSS3** - Vanilla CSS s moderním designem
- Glassmorphism efekty
- Smooth animace a transitions

### Development Tools
- **ESLint 9.36.0** - Linting
- **PropTypes 15.8.1** - Runtime type checking

---

## Instalace a Spuštění

### Prerekvizity
- Node.js (verze 18 nebo vyšší)
- npm nebo yarn

### Instalace

```bash
# Naklonování repozitáře (pokud používáte Git)
git clone <repository-url>
cd 3D-skrin

# Instalace závislostí
npm install
```

### Spuštění Vývojového Serveru

```bash
npm run dev
```

Aplikace bude dostupná na `http://localhost:5173`

### Build pro Produkci

```bash
npm run build
```

Build vytvoří optimalizované soubory v adresáři `dist/`

### Preview Produkčního Buildu

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

---

## Architektura Aplikace

### Struktura Projektu

```
3D-skrin/
├── public/              # Statické soubory
├── src/
│   ├── App.jsx         # Hlavní komponenta aplikace (2835 řádků)
│   ├── App.css         # Styly aplikace
│   ├── index.css       # Globální styly
│   ├── main.jsx        # Entry point
│   └── assets/         # Obrázky a další média
├── index.html          # HTML šablona
├── package.json        # NPM dependencies
├── vite.config.js      # Vite konfigurace
└── eslint.config.js    # ESLint konfigurace
```

### Architektura Komponent

Aplikace je postavena jako single-file React komponenta s následující strukturou:

```
App (Hlavní komponenta)
├── Header (Navigace)
├── Layout
│   ├── Sidebar
│   │   ├── StepProgress
│   │   ├── StepOne (Konfigurace skříně)
│   │   ├── StepTwo (Konfigurace interiéru)
│   │   ├── StepThree (Konfigurace dveří)
│   │   └── StepFour (Rekapitulace)
│   └── Workspace
│       ├── Status Bar (Cena, dodání)
│       └── Viewer (3D Canvas)
│           ├── Canvas (React Three Fiber)
│           │   ├── PlacementEnvironment
│           │   │   └── Cabinet
│           │   │       ├── Cabinet Structure
│           │   │       ├── ModuleColumn (pro každý sloupec)
│           │   │       └── CabinetDoors
│           │   ├── Showroom
│           │   ├── Lighting
│           │   ├── OrbitControls
│           │   └── CameraRig
│           ├── ViewerToolbar
│           └── Toast (Notifikace)
```

### State Management

Aplikace používá React hooks pro správu stavu:

```javascript
// Hlavní konfigurace s historií (Undo/Redo)
const [config, setConfig, undo, redo, canUndo, canRedo] = useHistoryState(initialConfig)

// Navigace mezi kroky
const [activeStep, setActiveStep] = useState(0)

// Filtry materiálů
const [cabinetCategory, setCabinetCategory] = useState('lamino')
const [interiorCategory, setInteriorCategory] = useState('lamino')
const [doorCategory, setDoorCategory] = useState('lamino')

// 3D viewer state
const [showMeasurements, setShowMeasurements] = useState(false)
const [isFrontView, setIsFrontView] = useState(false)
const [doorsVisible, setDoorsVisible] = useState(true)
```

### Custom Hooks

#### `useHistoryState`
Hook pro správu historie změn s podporou Undo/Redo:

```javascript
function useHistoryState(initialState) {
  // Vrací: [current, set, undo, redo, canUndo, canRedo]
}
```

---

## Uživatelská Příručka

### Základní Použití

#### 1. Výběr Základních Parametrů
1. V kroku **"Skříň"** vyberte pozici skříně v místnosti
2. Nastavte rozměry pomocí číselných polí
3. Zapněte "Výška až do stropu" pokud chcete skříň na míru místnosti
4. Vyberte doplňky (zadní stěna, strop, police, sokl)
5. Zvolte dekor skříně z nabízené palety

#### 2. Konfigurace Interiéru
1. V kroku **"Interiér"** nastavte počet modulů (1-5)
2. Klikněte na konkrétní sloupec pro jeho editaci
3. Vyberte typ modulu (ramínko, zásuvky, police, atd.)
4. Zvolte dekor interiéru

#### 3. Výběr Dveří
1. V kroku **"Dveře"** vyberte typ dveří:
   - Posuvné (úspora prostoru)
   - Pantové (klasické)
   - Bez dveří (otevřená šatní stěna)
2. Zvolte dekor dveří (pokud nejsou bez dveří)

#### 4. Odeslání Poptávky
1. V kroku **"Rekapitulace"** zkontrolujte souhrn konfigurace
2. Vyplňte kontaktní formulář
3. Přidejte poznámku nebo přílohu (volitelné)
4. Zaškrtněte souhlas se zpracováním údajů
5. Klikněte na **"Odeslat"**

### Ovládání 3D Prohlížeče

#### Kamera
- **Rotace**: Levé tlačítko myši + tažení
- **Posun**: Pravé tlačítko myši + tažení (nebo Ctrl + levé tlačítko)
- **Zoom**: Kolečko myši

#### Nástroje
- **📏 Změřit**: Zobrazí kóty rozměrů přímo v 3D prostoru
- **🚪 Dveře**: Skryje/zobrazí dveře pro pohled na interiér
- **🧭 Pohled**: Přepne na čelní pohled
- **🏠 Reset**: Vrátí kameru na výchozí pozici
- **↩ Zpět**: Vrátí poslední změnu
- **↪ Vpřed**: Zopakuje vrácenou změnu
- **🔗 Sdílet**: Sdílí konfiguraci

---

## Vývojářská Dokumentace

### Hlavní Komponenty

#### `App`
Hlavní komponenta aplikace, spravuje celkový stav a orchestraci.

**Props**: Žádné (root komponenta)

**State**:
- `config` - Aktuální konfigurace skříně
- `activeStep` - Aktivní krok průvodce (0-3)
- `activeInteriorColumn` - Aktivní sloupec pro editaci interiéru

#### `StepOne` - Konfigurace Skříně
**Props**:
```javascript
{
  config: ConfigShape,
  onDimensionChange: (key, value) => void,
  onPositionChange: (position) => void,
  onToggleFullHeight: (checked) => void,
  onToggleAddOn: (addonId) => void,
  cabinetCategory: string,
  onCabinetCategoryChange: (category) => void,
  cabinetSwatches: SwatchShape[],
  onCabinetMaterialSelect: (swatchId) => void
}
```

#### `StepTwo` - Konfigurace Interiéru
**Props**:
```javascript
{
  config: ConfigShape,
  modules: ModuleShape[],
  activeColumn: number,
  onActiveColumnChange: (index) => void,
  onColumnCountChange: (count) => void,
  onAssignModule: (columnIndex, moduleId) => void,
  interiorCategory: string,
  onInteriorCategoryChange: (category) => void,
  interiorSwatches: SwatchShape[],
  onInteriorMaterialSelect: (swatchId) => void
}
```

#### `Cabinet` - 3D Model Skříně
Hlavní 3D komponenta, která renderuje celou skříň v Three.js.

**Props**:
```javascript
{
  width: number,           // cm
  height: number,          // cm
  depth: number,           // cm
  columnCount: number,     // 1-5
  modules: string[],       // ID modulů
  cabinetFinish: string,   // Hex barva
  interiorFinish: string,  // Hex barva
  doorFinish: string,      // Hex barva
  doorStyle: 'hinged' | 'sliding' | 'none',
  doorsVisible: boolean,
  activeColumn: number,
  includeBackPanel: boolean,
  includeTopBottom: boolean,
  includeTopShelf: boolean,
  includeBase: boolean,
  moduleMap: Object
}
```

### Utility Komponenty

#### `MaterialSelector`
Komponenta pro výběr materiálů s filtrováním podle kategorie.

#### `DimensionInput`
Číselné pole s jednotkami (cm) pro zadávání rozměrů.

#### `ViewerToolbar`
Panel nástrojů pro ovládání 3D prohlížeče.

### Konstanty a Konfigurace

#### Limity Rozměrů
```javascript
const limits = {
  width: { min: 60, max: 320 },    // cm
  height: { min: 180, max: 280 },  // cm
  depth: { min: 40, max: 100 }     // cm
}
```

#### 3D Prostředí
```javascript
const ROOM_WIDTH_METERS = 3.2   // Šířka místnosti
const ROOM_DEPTH_METERS = 2.8   // Hloubka místnosti
const WALL_GAP = 0.001          // Mezera od stěny
const BACK_GAP = 0.012          // Mezera od zadní stěny
```

### Přidání Nového Modulu

1. Přidejte definici do `moduleLibrary`:

```javascript
{
  id: 'module-custom',
  label: 'Vlastní Modul',
  summary: 'Popis modulu',
  shelfLevels: [0.25, 0.5, 0.75],  // Polohy polic (0-1)
  railLevels: [0.8],                // Polohy tyčí (0-1)
  drawerSections: [],               // Sekce zásuvek
  shoeShelves: 0,                   // Počet botových polic
  cubbies: null,                    // Konfigurace boxů {rows, columns}
  accent: false                     // LED osvětlení
}
```

2. Přidejte ikonu v komponentě `ModuleIcon`.

### Přidání Nového Materiálu

Přidejte položku do `swatchLibrary`:

```javascript
{
  id: 'unique-id',
  label: 'Název Materiálu',
  color: '#hexcode',
  categories: ['lamino', 'drevo', 'vse']  // Kategorie pro filtrování
}
```

---

## Datové Modely

### Konfigurace Skříně (`config`)

```typescript
interface Config {
  // Základní parametry
  position: 'free' | 'left' | 'right' | 'wall';
  width: number;          // 60-320 cm
  height: number;         // 180-280 cm
  depth: number;          // 40-100 cm
  fullHeight: boolean;
  
  // Doplňky
  includeBackPanel: boolean;
  includeTopBottom: boolean;
  includeTopShelf: boolean;
  includeBase: boolean;
  
  // Materiály
  cabinetMaterial: string;   // ID swatche
  interiorMaterial: string;  // ID swatche
  doorMaterial: string;      // ID swatche
  
  // Dveře
  doorStyle: 'hinged' | 'sliding' | 'none';
  
  // Interiér
  columnCount: number;       // 1-5
  modules: string[];         // Array of module IDs
  
  // Ceník
  price: number;             // CZK
  delivery: string;          // Datum dodání
}
```

### Modul (`Module`)

```typescript
interface Module {
  id: string;
  label: string;
  summary: string;
  shelfLevels: number[];        // 0-1 (poměr výšky)
  railLevels: number[];         // 0-1 (poměr výšky)
  drawerSections: DrawerSection[];
  shoeShelves: number;
  cubbies: {
    rows: number;
    columns: number;
  } | null;
  accent: boolean;              // LED osvětlení
}

interface DrawerSection {
  height: number;               // Relativní výška (0-1)
  offset: number;               // Relativní offset od spodu (0-1)
}
```

### Materiál (`Swatch`)

```typescript
interface Swatch {
  id: string;
  label: string;
  color: string;                // Hex color
  categories: string[];         // ['lamino', 'dyha', etc.]
}
```

---

## 🎯 Další Vývoj

### Plánované Funkce
- [ ] Export konfigurace do PDF
- [ ] Uložení/načtení konfigurace z URL
- [ ] Více typů osvětlení (např. LED pásky)
- [ ] Další typy dveří (skládací, harmonika)
- [ ] Kalkulace ceny podle skutečných parametrů
- [ ] Integrace s e-commerce platformou
- [ ] AR náhled přes mobil

### Možná Vylepšení
- [ ] TypeScript migrace
- [ ] Unit testy
- [ ] E2E testy s Playwright/Cypress
- [ ] Optimalizace 3D výkonu
- [ ] Progressive Web App (PWA)
- [ ] Dark mode
- [ ] Více jazykových verzí

---

## 📝 Licence

*Zde doplňte informace o licenci projektu*

## 👥 Autoři

*Zde doplňte informace o autorech*

## 📧 Kontakt

*Zde doplňte kontaktní informace*
