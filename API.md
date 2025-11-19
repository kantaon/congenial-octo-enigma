# API Reference

Tato dokumentace poskytuje detailní přehled všech komponent, funkcí a API v projektu 3D konfigurátor skříní.

## Obsah

1. [Hlavní Komponenty](#hlavní-komponenty)
2. [Utility Komponenty](#utility-komponenty)
3. [3D Komponenty](#3d-komponenty)
4. [Custom Hooks](#custom-hooks)
5. [Utility Funkce](#utility-funkce)
6. [Konstanty](#konstanty)

---

## Hlavní Komponenty

### `App`

Hlavní root komponenta aplikace.

**Props**: Žádné

**State Variables**:
```javascript
config: Config              // Konfigurace skříně
activeStep: number         // Aktuální krok (0-3)
activeInteriorColumn: number
cabinetCategory: string
interiorCategory: string
doorCategory: string
showMeasurements: boolean
isFrontView: boolean
doorsVisible: boolean
cameraResetKey: number
toast: string
quoteData: QuoteData
```

**Hlavní Metody**:
- `updateConfig(updater)` - Aktualizace konfigurace
- `handleDimensionChange(key, value)` - Změna rozměru
- `handlePositionChange(position)` - Změna pozice
- `handleColumnCountChange(count)` - Změna počtu sloupců
- `handleModuleAssign(columnIndex, moduleId)` - Přiřazení modulu
- `handleDoorStyleChange(doorStyle)` - Změna stylu dveří
- `handleToolbarAction(action)` - Akce z toolbaru

---

### `StepOne`

Komponenta pro krok 1 - konfigurace základních parametrů skříně.

**Props**:
```typescript
interface StepOneProps {
  config: Config;
  onDimensionChange: (key: 'width' | 'height' | 'depth', value: number) => void;
  onPositionChange: (position: Position) => void;
  onToggleFullHeight: (checked: boolean) => void;
  onToggleAddOn: (addonId: string) => void;
  cabinetCategory: string;
  onCabinetCategoryChange: (category: string) => void;
  cabinetSwatches: Swatch[];
  onCabinetMaterialSelect: (swatchId: string) => void;
}
```

**Vykresluje**:
- Volbu pozice v místnosti
- Číselná pole pro rozměry
- Přepínač pro plnou výšku
- Grid doplňků
- Selektor materiálů

---

### `StepTwo`

Komponenta pro krok 2 - konfigurace interiéru.

**Props**:
```typescript
interface StepTwoProps {
  config: Config;
  modules: Module[];
  activeColumn: number;
  onActiveColumnChange: (index: number) => void;
  onColumnCountChange: (count: number) => void;
  onAssignModule: (columnIndex: number, moduleId: string) => void;
  interiorCategory: string;
  onInteriorCategoryChange: (category: string) => void;
  interiorSwatches: Swatch[];
  onInteriorMaterialSelect: (swatchId: string) => void;
}
```

**Vykresluje**:
- Ovladač počtu modulů (+/-)
- Náhled sloupců
- Grid modulů s ikonami
- Selektor materiálů pro interiér

---

### `StepThree`

Komponenta pro krok 3 - konfigurace dveří.

**Props**:
```typescript
interface StepThreeProps {
  config: Config;
  doorOptions: DoorOption[];
  onDoorStyleChange: (style: DoorStyle) => void;
  doorCategory: string;
  onDoorCategoryChange: (category: string) => void;
  doorSwatches: Swatch[];
  onDoorMaterialSelect: (swatchId: string) => void;
}
```

**Vykresluje**:
- Grid typů dveří s ikonami
- Selektor materiálů pro dveře (pokud nejsou bez dveří)

---

### `StepFour`

Komponenta pro krok 4 - rekapitulace a formulář poptávky.

**Props**:
```typescript
interface StepFourProps {
  config: Config;
  modules: string[];  // Array názvů modulů
  quoteData: QuoteData;
  onQuoteChange: (field: string, value: any) => void;
  onQuoteSubmit: () => void;
}
```

**Vykresluje**:
- Souhrn konfigurace (definition list)
- Formulář poptávky
- Checkbox souhlasu
- Submit button

---

## Utility Komponenty

### `DimensionInput`

Číselné pole s jednotkami pro zadávání rozměrů.

**Props**:
```typescript
interface DimensionInputProps {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  onChange: (value: string) => void;
  disabled?: boolean;
}
```

**Použití**:
```jsx
<DimensionInput
  label="Šířka"
  value={140}
  unit="cm"
  min={60}
  max={320}
  onChange={(value) => handleChange('width', value)}
/>
```

---

### `SwitchControl`

Toggle switch pro booleovské hodnoty.

**Props**:
```typescript
interface SwitchControlProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}
```

---

### `MaterialSelector`

Komplexní komponenta pro výběr materiálů s filtrováním.

**Props**:
```typescript
interface MaterialSelectorProps {
  title: string;
  primaryFilters: Filter[];
  secondaryFilters: Filter[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
  swatches: Swatch[];
  selected: string;
  onSelect: (swatchId: string) => void;
  disabled?: boolean;
}
```

**Vykresluje**:
- Primární filtry (Lamino, Dýha, Vysoký lesk...)
- Sekundární filtry (Vše, Dřevo, Barva...)
- Grid vzorků s náhledy barev

---

### `ViewerToolbar`

Panel nástrojů pro ovládání 3D prohlížeče.

**Props**:
```typescript
interface ViewerToolbarProps {
  actions: ToolbarAction[];
  onAction: (actionId: string) => void;
  activeFlags: Record<string, boolean>;
  disabledFlags: Record<string, boolean>;
}
```

**Toolbar Actions**:
- `measure` - Zobrazení rozměrů
- `doors` - Toggle dveří
- `look` - Změna pohledu
- `home` - Reset kamery
- `undo` - Vrátit zpět
- `redo` - Opakovat
- `share` - Sdílení

---

### `Toast`

Komponenta pro zobrazení notifikací.

**Props**:
```typescript
interface ToastProps {
  message: string;
}
```

**Automatické skrytí**: 3.6 sekundy

---

### `ModuleIcon`

Generuje SVG ikonu podle typu modulu.

**Props**:
```typescript
interface ModuleIconProps {
  module: Module;
}
```

**Logika**:
- Pokud má zásuvky → ikona s obdélníky
- Pokud má cubbies → grid malých čtverců
- Pokud má botové police → šikmé čáry
- Jinak → horizontální čáry (police)

---

## 3D Komponenty

### `Cabinet`

Hlavní 3D komponenta renderující celou skříň.

**Props**:
```typescript
interface CabinetProps {
  width: number;              // cm
  height: number;             // cm
  depth: number;              // cm
  columnCount: number;        // 1-5
  modules: string[];          // Array module IDs
  cabinetFinish: string;      // Hex color
  interiorFinish: string;     // Hex color
  doorFinish: string;         // Hex color
  doorStyle: 'hinged' | 'sliding' | 'none';
  doorsVisible: boolean;
  activeColumn: number;
  includeBackPanel: boolean;
  includeTopBottom: boolean;
  includeTopShelf: boolean;
  includeBase: boolean;
  moduleMap: Record<string, Module>;
}
```

**3D Hierarchie**:
```
<group> (root, positioned at half-height)
  ├── Side panels (2x mesh)
  ├── Back panel (if enabled)
  ├── Top/bottom panels (if enabled)
  ├── Base (if enabled)
  ├── Interior faces (planes)
  ├── Top shelf (if enabled)
  ├── Column dividers (n-1 meshes)
  ├── ModuleColumn (per column)
  └── CabinetDoors (if visible)
```

**Materiály**:
- `meshStandardMaterial` s nastavenou roughness a metalness
- Stíny: `castShadow` a `receiveShadow`

---

### `PlacementEnvironment`

Wrapper pro umístění skříně v místnosti podle pozice.

**Props**:
```typescript
interface PlacementEnvironmentProps {
  width: number;
  depth: number;
  height: number;
  position: 'free' | 'left' | 'right' | 'wall';
  fullHeight: boolean;
  cabinetFinish: string;
  children: React.ReactNode;
}
```

**Logika pozicování**:
- `free` → střed místnosti
- `left` → vlevo u stěny
- `right` → vpravo u stěny
- `wall` → přes celou šířku

**Přidává**:
- Top cap pro full-height skříně

---

### `ModuleColumn`

Renderuje jeden sloupec interiéru s policemi, tyčemi, zásuvkami atd.

**Props**:
```typescript
interface ModuleColumnProps {
  module: Module;
  columnIndex: number;
  columnWidth: number;
  interiorWidth: number;
  thickness: number;
  depth: number;
  interiorHeight: number;
  interiorBottom: number;
  finish: string;
  interiorFinish: string;
  isActive: boolean;
}
```

**Vykresluje podle typu**:
- **Shelves** - `boxGeometry` pro každou polici
- **Rails** - `cylinderGeometry` pro šatní tyče
- **Drawers** - `boxGeometry` pro tělo zásuvky + `boxGeometry` pro přední panel + `cylinderGeometry` pro madlo
- **Shoe shelves** - Šikmé police
- **Cubbies** - Grid malých boxů
- **Accent** - LED páska (emissive material)

---

### `CabinetDoors`

Komponenta pro renderování dveří.

**Props**:
```typescript
interface CabinetDoorsProps {
  width: number;
  height: number;
  depth: number;
  doorStyle: 'hinged' | 'sliding';
  finish: string;
}
```

**Typy**:
- **Hinged** (pantové) - Dvoje dveře vedle sebe
- **Sliding** (posuvné) - Dvoje dveře s překrytím

---

### `Showroom`

Komponenta pro renderování místnosti (podlaha, stěny).

**Props**: Žádné (používá konstanty)

**Vykresluje**:
- Podlahu s texturou
- Zadní stěnu
- Levou a pravou stěnu (částečné)

---

### `SceneLighting`

Nastavení osvětlení scény.

**Světla**:
- `ambientLight` - Ambient osvětlení (0.45 intensity)
- `directionalLight` - Hlavní světlo s stíny
- `spotLight` - Dva spotlighty

---

### `CameraRig`

Komponenta pro animaci kamery mezi pohledy.

**Props**:
```typescript
interface CameraRigProps {
  controlsRef: React.RefObject;
  isFrontView: boolean;
  resetKey: number;
}
```

**Používá**:
- `useFrame` hook pro plynulé animace
- `lerp` pro interpolaci pozice a cíle

---

### `MeasurementGuide`

Komponenta pro zobrazení kót rozměrů.

**Props**:
```typescript
interface MeasurementGuideProps {
  width: number;
  height: number;
  depth: number;
}
```

**Používá**:
- `Html` z drei pro renderování HTML v 3D prostoru
- Zobrazuje šířku, výšku a hloubku

---

## Custom Hooks

### `useHistoryState`

Custom hook pro správu stavu s historií (Undo/Redo).

**Signatura**:
```typescript
function useHistoryState<T>(
  initialState: T
): [
  current: T,
  set: (value: T | ((prev: T) => T)) => void,
  undo: () => void,
  redo: () => void,
  canUndo: boolean,
  canRedo: boolean
]
```

**Použití**:
```javascript
const [config, setConfig, undo, redo, canUndo, canRedo] = useHistoryState(initialConfig);

// Set nové hodnoty
setConfig({ ...config, width: 200 });

// Vrátit zpět
if (canUndo) undo();

// Opakovat
if (canRedo) redo();
```

**Interní struktura**:
```javascript
{
  past: T[],      // Stack minulých stavů
  present: T,     // Aktuální stav
  future: T[]     // Stack budoucích stavů (pro redo)
}
```

---

## Utility Funkce

### `formatCurrency`

Formátuje číslo jako českou měnu.

**Signatura**:
```typescript
function formatCurrency(value: number): string
```

**Příklad**:
```javascript
formatCurrency(12500) // "12 500 Kč"
```

---

### `filterSwatches`

Filtruje vzorky podle kategorie.

**Signatura**:
```typescript
function filterSwatches(category: string): Swatch[]
```

**Logika**:
- Pokud `category === 'vse'` → vrátí všechny
- Jinak vrátí jen vzorky obsahující kategorii

---

## Konstanty

### Kroky Průvodce

```javascript
const steps = [
  { id: 'cabinet', label: 'Skříň' },
  { id: 'interior', label: 'Interiér' },
  { id: 'doors', label: 'Dveře' },
  { id: 'summary', label: 'Rekapitulace' },
]
```

---

### Pozice v Místnosti

```javascript
const positionOptions = [
  { id: 'free', label: 'Volně stojící', icon: <svg>...</svg> },
  { id: 'left', label: 'Vlevo', icon: <svg>...</svg> },
  { id: 'right', label: 'Vpravo', icon: <svg>...</svg> },
  { id: 'wall', label: 'Přes celou místnost', icon: <svg>...</svg> },
]
```

---

### Doplňky

```javascript
const addOnOptions = [
  { id: 'includeBackPanel', label: 'Zadní stěna' },
  { id: 'includeTopBottom', label: 'Strop a sokl' },
  { id: 'includeTopShelf', label: 'Stropní police' },
  { id: 'includeBase', label: 'Dno a sokl' },
]
```

---

### Kategorie Materiálů

```javascript
const materialPrimaryFilters = [
  { id: 'lamino', label: 'Lamino' },
  { id: 'dyha', label: 'Dýha' },
  { id: 'vysoky-lesk', label: 'Vysoký lesk' },
  { id: 'lacobel', label: 'Lacobel' },
  { id: 'mramor', label: 'Mramor' },
]

const materialSecondaryFilters = [
  { id: 'vse', label: 'Vše' },
  { id: 'drevo', label: 'Dřevo' },
  { id: 'barva', label: 'Barva' },
  { id: 'kamen', label: 'Kámen' },
  { id: 'kov', label: 'Kov' },
]
```

---

### Paleta Vzorků

```javascript
const swatchLibrary = [
  { 
    id: 'white-satin', 
    label: 'Bílá satén', 
    color: '#f4f4f4', 
    categories: ['lamino', 'vysoky-lesk', 'barva', 'vse'] 
  },
  // ... 11 dalších vzorků
]
```

**Přístup k vzorku**:
```javascript
const swatch = swatchLookup['oak-natural'];
// { id: 'oak-natural', label: 'Dub přírodní', color: '#d6b894', ... }
```

---

### Knihovna Modulů

```javascript
const moduleLibrary = [
  {
    id: 'module-hanging',
    label: 'Ramínko',
    summary: 'Horní police a šatní tyč',
    shelfLevels: [0.92],
    railLevels: [0.63],
    drawerSections: [],
    shoeShelves: 0,
    cubbies: null,
    accent: false,
  },
  // ... 8 dalších modulů
]
```

**Přístup k modulu**:
```javascript
const module = moduleMap['module-drawers'];
```

---

### Typy Dveří

```javascript
const doorOptionVariants = [
  {
    id: 'sliding',
    label: 'Posuvné',
    description: 'Nezasahují do prostoru místnosti.',
    icon: <svg>...</svg>
  },
  {
    id: 'hinged',
    label: 'Pantové',
    description: 'Klasické otevírání směrem ven.',
    icon: <svg>...</svg>
  },
  {
    id: 'none',
    label: 'Bez dveří',
    description: 'Otevřený přístup pro šatní stěnu.',
    icon: <svg>...</svg>
  },
]
```

---

### 3D Konstanty

```javascript
const accentColor = '#d9212a'           // Accent barva (červená)
const ROOM_WIDTH_METERS = 3.2           // Šířka místnosti
const ROOM_DEPTH_METERS = 2.8           // Hloubka místnosti
const ROOM_BACK_Z = -ROOM_DEPTH_METERS / 2  // Z pozice zadní stěny
const WALL_GAP = 0.001                  // Mezera od stěny
const BACK_GAP = 0.012                  // Mezera od zadní stěny
```

---

### Výchozí Konfigurace

```javascript
const initialConfig = {
  position: 'free',
  width: 140,
  height: 220,
  depth: 65,
  fullHeight: false,
  includeBackPanel: true,
  includeTopBottom: true,
  includeTopShelf: true,
  includeBase: true,
  cabinetMaterial: 'oak-natural',
  interiorMaterial: 'birch-light',
  doorMaterial: 'white-satin',
  doorStyle: 'hinged',
  columnCount: 3,
  modules: ['module-hanging', 'module-drawers', 'module-shelves'],
  price: 1000,
  delivery: '24.11.2025',
}
```

---

## TypeScript Type Definitions

I když aplikace používá PropTypes, zde jsou TypeScript definice pro reference:

```typescript
// Hlavní typy
type Position = 'free' | 'left' | 'right' | 'wall';
type DoorStyle = 'hinged' | 'sliding' | 'none';
type MaterialCategory = 'lamino' | 'dyha' | 'vysoky-lesk' | 'lacobel' | 'mramor' | 'vse' | 'drevo' | 'barva' | 'kamen' | 'kov';

interface Config {
  position: Position;
  width: number;
  height: number;
  depth: number;
  fullHeight: boolean;
  includeBackPanel: boolean;
  includeTopBottom: boolean;
  includeTopShelf: boolean;
  includeBase: boolean;
  cabinetMaterial: string;
  interiorMaterial: string;
  doorMaterial: string;
  doorStyle: DoorStyle;
  columnCount: number;
  modules: string[];
  price: number;
  delivery: string;
}

interface Swatch {
  id: string;
  label: string;
  color: string;
  categories: MaterialCategory[];
}

interface DrawerSection {
  height: number;
  offset: number;
}

interface Cubbies {
  rows: number;
  columns: number;
}

interface Module {
  id: string;
  label: string;
  summary: string;
  shelfLevels: number[];
  railLevels: number[];
  drawerSections: DrawerSection[];
  shoeShelves: number;
  cubbies: Cubbies | null;
  accent: boolean;
}

interface QuoteData {
  name: string;
  email: string;
  phone: string;
  address: string;
  zip: string;
  note: string;
  attachment: string;
  consent: boolean;
}

interface ToolbarAction {
  id: string;
  label: string;
  icon: string;
}

interface Filter {
  id: string;
  label: string;
}

interface PositionOption {
  id: Position;
  label: string;
  icon: React.ReactNode;
}

interface DoorOption {
  id: DoorStyle;
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface AddOnOption {
  id: string;
  label: string;
}
```

---

## Event Handlers Reference

### Config Updates

```typescript
// Rozměry
onDimensionChange(key: 'width' | 'height' | 'depth', value: number): void

// Pozice
onPositionChange(position: Position): void

// Full height toggle
onToggleFullHeight(checked: boolean): void

// Doplňky
onToggleAddOn(addonId: string): void

// Materiály
onCabinetMaterialSelect(swatchId: string): void
onInteriorMaterialSelect(swatchId: string): void
onDoorMaterialSelect(swatchId: string): void

// Kategorie materiálů
onCabinetCategoryChange(category: string): void
onInteriorCategoryChange(category: string): void
onDoorCategoryChange(category: string): void

// Interiér
onColumnCountChange(count: number): void
onActiveColumnChange(index: number): void
onAssignModule(columnIndex: number, moduleId: string): void

// Dveře
onDoorStyleChange(doorStyle: DoorStyle): void

// Poptávka
onQuoteChange(field: string, value: any): void
onQuoteSubmit(): void
```

### Toolbar Actions

```typescript
onAction(actionId: 'measure' | 'doors' | 'look' | 'home' | 'undo' | 'redo' | 'share'): void
```

---

## Příklady Použití

### Vytvoření Vlastního Modulu

```javascript
// 1. Přidejte definici do moduleLibrary
const customModule = {
  id: 'module-custom-office',
  label: 'Kancelář',
  summary: 'Police s prostorem na PC',
  shelfLevels: [0.3, 0.6, 0.9],  // 3 police
  railLevels: [],                 // Žádné tyče
  drawerSections: [
    { height: 0.15, offset: 0.05 }  // 1 zásuvka
  ],
  shoeShelves: 0,
  cubbies: null,
  accent: false
};

// 2. Přidejte do moduleLibrary array
const moduleLibrary = [
  // ... existující moduly
  customModule
];

// 3. Přidejte ikonu v ModuleIcon komponentě
function ModuleIcon({ module }) {
  if (module.id === 'module-custom-office') {
    return (
      <svg viewBox="0 0 64 64">
        {/* Vaše custom SVG */}
      </svg>
    );
  }
  // ... zbytek logiky
}
```

### Použití useHistoryState Hook

```javascript
import { useHistoryState } from './hooks';

function MyComponent() {
  const [data, setData, undo, redo, canUndo, canRedo] = useHistoryState({
    count: 0
  });

  return (
    <div>
      <p>Count: {data.count}</p>
      <button onClick={() => setData(prev => ({ count: prev.count + 1 }))}>
        Increment
      </button>
      <button onClick={undo} disabled={!canUndo}>
        Undo
      </button>
      <button onClick={redo} disabled={!canRedo}>
        Redo
      </button>
    </div>
  );
}
```

### Programatická Změna Konfigurace

```javascript
// V App komponentě nebo child komponentě

// Změna jedné hodnoty
updateConfig(prev => ({ ...prev, width: 200 }));

// Změna více hodnot
updateConfig(prev => ({
  ...prev,
  width: 250,
  height: 240,
  position: 'wall'
}));

// Conditionally změna
updateConfig(prev => {
  const next = { ...prev, position: 'wall' };
  if (next.position === 'wall') {
    next.width = Math.min(ROOM_WIDTH_METERS * 100, 320);
  }
  return next;
});
```

---

Toto je kompletní API reference pro 3D konfigurátor skříní. Pro užší integraci kontaktujte vývojářský tým.
