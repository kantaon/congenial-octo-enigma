# Příspěvky do Projektu

Děkujeme za váš zájem přispět do projektu 3D Konfigurátor Skříní! Tento dokument popisuje, jak můžete přispět.

## 📋 Obsah

1. [Jak Začít](#jak-začít)
2. [Workflow Vývoje](#workflow-vývoje)
3. [Coding Standards](#coding-standards)
4. [Git Workflow](#git-workflow)
5. [Pull Request Process](#pull-request-process)
6. [Reporting Bugs](#reporting-bugs)
7. [Feature Requests](#feature-requests)

---

## Jak Začít

### Prerequisites

- **Node.js** 18+ a npm
- **Git**
- Základní znalost React a Three.js

### Setup Projektu

1. **Fork repozitáře** na GitHubu

2. **Clone váš fork**:
   ```bash
   git clone https://github.com/your-username/3D-skrin.git
   cd 3D-skrin
   ```

3. **Nainstalujte závislosti**:
   ```bash
   npm install
   ```

4. **Spusťte dev server**:
   ```bash
   npm run dev
   ```

5. **Vytvořte novou branch**:
   ```bash
   git checkout -b feature/moje-nova-funkce
   ```

---

## Workflow Vývoje

### Běžný Development Cycle

1. Vytvořte novou branch pro každou feature/bugfix
2. Proveďte změny v kódu
3. Testujte lokálně
4. Commitněte změny s popisným commit message
5. Push do vašeho forku
6. Vytvořte Pull Request

### Testování

Před odesláním PR vždy:

```bash
# Zkontrolujte linting
npm run lint

# Build projekt pro ověření, že nejsou chyby
npm run build

# Preview buildu
npm run preview
```

---

## Coding Standards

### JavaScript/React

#### Konvence Pojmenování

- **Komponenty**: PascalCase (`MyComponent`)
- **Funkce**: camelCase (`handleClick`)
- **Konstanty**: UPPER_SNAKE_CASE (`MAX_WIDTH`)
- **CSS třídy**: kebab-case (`my-class-name`)

#### Component Structure

Strukturujte komponenty takto:

```javascript
import { useState } from 'react'
import PropTypes from 'prop-types'

function MyComponent({ prop1, prop2 }) {
  // 1. Hooks
  const [state, setState] = useState(null)

  // 2. Computed values
  const computedValue = useMemo(() => {
    return prop1 + prop2
  }, [prop1, prop2])

  // 3. Handlers
  const handleClick = useCallback(() => {
    // ...
  }, [])

  // 4. Effects
  useEffect(() => {
    // ...
  }, [])

  // 5. Render
  return (
    <div>
      {/* JSX */}
    </div>
  )
}

// PropTypes vždy na konci
MyComponent.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
}

MyComponent.defaultProps = {
  prop2: 0,
}

export default MyComponent
```

#### PropTypes

**Vždy** používejte PropTypes pro type checking:

```javascript
ComponentName.propTypes = {
  requiredProp: PropTypes.string.isRequired,
  optionalProp: PropTypes.number,
  arrayProp: PropTypes.arrayOf(PropTypes.string),
  objectProp: PropTypes.shape({
    key: PropTypes.string,
  }),
}
```

### CSS

#### Organizace

- Používejte **BEM-like** naming convention
- Každá komponenta může mít své CSS třídy
- Globální styly pouze v `index.css`

```css
/* Dobrý příklad */
.module-card { }
.module-card__icon { }
.module-card__title { }
.module-card--active { }

/* Špatný příklad */
.moduleCard { }
.card { }  /* Příliš generické */
```

#### CSS Guidelines

- Používejte **relativní jednotky** (`rem`, `em`) pro font sizes
- Používejte **CSS custom properties** pro barvy a opakované hodnoty
- **Mobile-first** přístup
- Používejte `flexbox` a `grid` pro layouty

### 3D Komponenty (Three.js)

#### Optimalizace

- **Reuse geometries**: Vytvořte geometry jednou, použijte vícekrát
- **Dispose resources**: Vždy dispose geometry a materials při unmount
- **Use instancing**: Pro opakované objekty používejte instancing
- **Limit draw calls**: Mergujte geometrie kde je to možné

```javascript
// Dobrý příklad - jedna geometry, reused
const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), [])

return (
  <>
    <mesh geometry={geometry} position={[0, 0, 0]}>
      <meshStandardMaterial color="red" />
    </mesh>
    <mesh geometry={geometry} position={[2, 0, 0]}>
      <meshStandardMaterial color="blue" />
    </mesh>
  </>
)

// Cleanup
useEffect(() => {
  return () => {
    geometry.dispose()
  }
}, [geometry])
```

---

## Git Workflow

### Branch Naming

```
feature/short-description    # Nové funkce
bugfix/issue-description     # Opravy bugů
hotfix/critical-fix          # Kritické opravy
refactor/component-name      # Refactoring
docs/what-changed            # Změny v dokumentaci
```

### Commit Messages

Používejte **conventional commits** formát:

```
type(scope): subject

body (optional)

footer (optional)
```

**Typy**:
- `feat`: Nová funkce
- `fix`: Oprava bugu
- `docs`: Změny v dokumentaci
- `style`: Formátování, white-space
- `refactor`: Refactoring kódu
- `perf`: Performance improvement
- `test`: Přidání testů
- `chore`: Maintenance tasks

**Příklady**:

```
feat(cabinet): add custom texture support

- Added texture upload functionality
- Implemented texture preview
- Updated MaterialSelector component

Closes #123
```

```
fix(doors): sliding doors overlap issue

Fixed z-index calculation for sliding doors
to prevent visual overlap when animating.

Fixes #456
```

---

## Pull Request Process

### Před Odesláním PR

- [ ] Kód je otestovaný a fungující
- [ ] Linting bez chyb (`npm run lint`)
- [ ] Build úspěšný (`npm run build`)
- [ ] Dokumentace aktualizována (pokud relevantní)
- [ ] PropTypes přidány/aktualizovány

### PR Template

Použijte tento template pro popis PR:

```markdown
## Popis

_Stručně popište, co tento PR dělá_

## Typ změny

- [ ] Oprava bugu
- [ ] Nová funkce
- [ ] Breaking change
- [ ] Dokumentace

## Motivace a Context

_Proč je tato změna potřebná? Jaký problém řeší?_

## Jak bylo testováno?

_Popište, jak jste změny testovali_

## Screenshots (pokud relevantní)

_Přidejte screenshoty pro vizuální změny_

## Checklist

- [ ] Kód následuje coding standards projektu
- [ ] PropTypes přidány/aktualizovány
- [ ] Linting prošel bez chyb
- [ ] Build je úspěšný
- [ ] Dokumentace aktualizována
```

### Review Process

1. Maintainer projde váš PR
2. Může požádat o změny
3. Po schválení bude PR mergenut
4. Branch bude smazána

---

## Reporting Bugs

### Před Reportem

- Zkontrolujte, že bug již není reportován v Issues
- Ujistěte se, že používáte nejnovější verzi

### Bug Report Template

```markdown
## Bug Report

### Popis
_Jasný a stručný popis bugu_

### Kroky k Reprodukci
1. Jděte na '...'
2. Klikněte na '...'
3. Scrollujte dolů na '...'
4. Vidíte chybu

### Očekávané Chování
_Co jste očekávali, že se stane_

### Aktuální Chování
_Co se skutečně stalo_

### Screenshots
_Pokud relevantní, přidejte screenshots_

### Prostředí
- OS: [např. Windows 10, macOS 13]
- Browser: [např. Chrome 120, Firefox 115]
- Verze Node: [např. 18.17.0]

### Další Context
_Jakékoliv další informace o problému_
```

---

## Feature Requests

### Feature Request Template

```markdown
## Feature Request

### Je vaše feature request spojený s problémem?
_Jasný popis problému. Např. "Jsem frustrovaný, když..."_

### Popište řešení, které byste chtěli
_Jasný a stručný popis toho, co chcete, aby se stalo_

### Popište alternativy, které jste zvažovali
_Jakékoliv alternativní řešení nebo funkce, které jste zvažovali_

### Další context
_Jakýkoliv další kontext nebo screenshots o feature requestu_
```

---

## Oblasti pro Příspěvky

### 🎨 Frontend/UI

- Vylepšení UI/UX
- Responzivní design
- Animace a transitions
- Accessibility (A11y)

### 🎮 3D Graphics

- Nové materiály a textury
- Performance optimalizace
- Lighting improvements
- Nové typy modulů

### 📚 Dokumentace

- Typo opravy
- Příklady použití
- Tutoriály
- Překlady

### 🧪 Testování

- Unit testy
- E2E testy
- Visual regression testy

### 🐛 Bug Fixes

- Reportujte a opravujte bugy
- Performance issues
- Cross-browser issues

---

## Code Review Guidelines

### Co Hledáme

- **Readability**: Je kód čitelný a well-organized?
- **Correctness**: Dělá kód to, co má?
- **Performance**: Je kód optimalizovaný?
- **Security**: Jsou tam bezpečnostní problémy?
- **Tests**: Jsou změny testovány?
- **Documentation**: Je dokumentace aktualizovaná?

### Feedback Style

- Buďte konstruktivní a respektující
- Vysvětlete "proč", ne jen "co"
- Navrhněte řešení
- Chvalte dobrou práci

---

## Style Guide

### JavaScript

```javascript
// ✅ Dobrý
const handleClick = useCallback((event) => {
  event.preventDefault()
  updateConfig((prev) => ({ ...prev, width: value }))
}, [updateConfig, value])

// ❌ Špatný
const handleClick = (event) => {
  event.preventDefault()
  updateConfig({ ...config, width: value })  // Může způsobit stale closure
}
```

### React Hooks

```javascript
// ✅ Dobrý - Dependencies správně specifikovány
useEffect(() => {
  fetchData(id)
}, [id, fetchData])

// ❌ Špatný - Missing dependencies
useEffect(() => {
  fetchData(id)
}, [])
```

### PropTypes

```javascript
// ✅ Dobrý - Kompletní PropTypes
Component.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  onUpdate: PropTypes.func.isRequired,
  config: PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string,
  }),
}

// ❌ Špatný - Chybějící PropTypes
Component.propTypes = {
  width: PropTypes.number,
}
```

---

## Získání Pomoci

- **Discord**: [odkaz na Discord server]
- **Email**: [kontaktní email]
- **GitHub Discussions**: Pro obecné otázky

---

## Licence

Přispíváním do tohoto projektu souhlasíte, že váš příspěvek bude licencován pod stejnou licencí jako projekt.

---

**Děkujeme za váš příspěvek! 🎉**
