import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import './App.css'

const steps = [
  { id: 'cabinet', label: 'Skříň' },
  { id: 'interior', label: 'Interiér' },
  { id: 'doors', label: 'Dveře' },
  { id: 'summary', label: 'Rekapitulace' },
]

const positionOptions = [
  {
    id: 'free',
    label: 'Volně stojící',
    icon: (
      <svg viewBox="0 0 48 32" aria-hidden="true">
        <rect x="8" y="6" width="32" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="18" y="10" width="12" height="12" rx="2" fill="currentColor" opacity="0.25" />
      </svg>
    ),
  },
  {
    id: 'left',
    label: 'Vlevo',
    icon: (
      <svg viewBox="0 0 48 32" aria-hidden="true">
        <rect x="8" y="6" width="32" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="9.5" y="8" width="18" height="16" rx="2" fill="currentColor" opacity="0.25" />
      </svg>
    ),
  },
  {
    id: 'right',
    label: 'Vpravo',
    icon: (
      <svg viewBox="0 0 48 32" aria-hidden="true">
        <rect x="8" y="6" width="32" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="20.5" y="8" width="18" height="16" rx="2" fill="currentColor" opacity="0.25" />
      </svg>
    ),
  },
  {
    id: 'wall',
    label: 'Přes celou místnost',
    icon: (
      <svg viewBox="0 0 48 32" aria-hidden="true">
        <rect x="8" y="6" width="32" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="10" y="8" width="28" height="16" rx="3" fill="currentColor" opacity="0.25" />
      </svg>
    ),
  },
]

const addOnOptions = [
  { id: 'includeBackPanel', label: 'Zadní stěna' },
  { id: 'includeTopBottom', label: 'Strop a sokl' },
  { id: 'includeTopShelf', label: 'Stropní police' },
  { id: 'includeBase', label: 'Dno a sokl' },
]

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

const swatchLibrary = [
  { id: 'white-satin', label: 'Bílá satén', color: '#f4f4f4', categories: ['lamino', 'vysoky-lesk', 'barva', 'vse'] },
  { id: 'arctic-grey', label: 'Arctic šedá', color: '#c5c8ce', categories: ['lamino', 'barva', 'kov', 'vse'] },
  { id: 'ivory-matte', label: 'Slonová kost', color: '#f1e7d8', categories: ['lamino', 'barva', 'vysoky-lesk', 'vse'] },
  { id: 'oak-natural', label: 'Dub přírodní', color: '#d6b894', categories: ['lamino', 'dyha', 'drevo', 'vse'] },
  { id: 'walnut-deep', label: 'Ořech tmavý', color: '#8b6a4d', categories: ['dyha', 'drevo', 'lamino', 'vse'] },
  { id: 'sandstone', label: 'Pískovec', color: '#ccb499', categories: ['mramor', 'kamen', 'lamino', 'vse'] },
  { id: 'graphite-metal', label: 'Grafit', color: '#4f535c', categories: ['kov', 'barva', 'lamino', 'vse'] },
  { id: 'birch-light', label: 'Bříza arktická', color: '#e8d6ba', categories: ['lamino', 'dyha', 'drevo', 'vse'] },
  { id: 'ebony', label: 'Ebén', color: '#2a1d16', categories: ['dyha', 'drevo', 'vse'] },
  { id: 'cream-stone', label: 'Krémový kámen', color: '#e4d8c7', categories: ['mramor', 'kamen', 'lamino', 'vse'] },
  { id: 'slate', label: 'Břidlice', color: '#585d63', categories: ['kamen', 'lamino', 'vse'] },
  { id: 'ash-bright', label: 'Jasan světlý', color: '#ddd0ba', categories: ['dyha', 'lamino', 'drevo', 'vse'] },
]

const swatchLookup = swatchLibrary.reduce((acc, swatch) => {
  acc[swatch.id] = swatch
  return acc
}, {})

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
  {
    id: 'module-double-rail',
    label: 'Dvojitá tyč',
    summary: 'Dva věšáky pro košile',
    shelfLevels: [0.96],
    railLevels: [0.7, 0.4],
    drawerSections: [],
    shoeShelves: 0,
    cubbies: null,
    accent: false,
  },
  {
    id: 'module-shelves',
    label: 'Otevřené police',
    summary: 'Pět pevných polic',
    shelfLevels: [0.18, 0.36, 0.54, 0.72, 0.9],
    railLevels: [],
    drawerSections: [],
    shoeShelves: 0,
    cubbies: null,
    accent: false,
  },
  {
    id: 'module-shoe',
    label: 'Botník',
    summary: 'Šikmé police na obuv',
    shelfLevels: [0.35, 0.5, 0.65, 0.8, 0.92],
    railLevels: [],
    drawerSections: [],
    shoeShelves: 5,
    cubbies: null,
    accent: false,
  },
  {
    id: 'module-drawers',
    label: 'Zásuvky',
    summary: 'Zásuvky a horní tyč',
    shelfLevels: [0.9],
    railLevels: [0.64],
    drawerSections: [
      { height: 0.15, offset: 0.04 },
      { height: 0.15, offset: 0.22 },
    ],
    shoeShelves: 0,
    cubbies: null,
    accent: false,
  },
  {
    id: 'module-drawers-tall',
    label: 'Komoda',
    summary: 'Tři hluboké zásuvky',
    shelfLevels: [0.88],
    railLevels: [],
    drawerSections: [
      { height: 0.16, offset: 0.04 },
      { height: 0.16, offset: 0.22 },
      { height: 0.16, offset: 0.4 },
    ],
    shoeShelves: 0,
    cubbies: null,
    accent: false,
  },
  {
    id: 'module-display',
    label: 'Vitrína',
    summary: 'Asymetrické police s LED lištou',
    shelfLevels: [0.28, 0.58, 0.9],
    railLevels: [],
    drawerSections: [],
    shoeShelves: 0,
    cubbies: null,
    accent: true,
  },
  {
    id: 'module-cubbies',
    label: 'Boxy',
    summary: 'Síť přihrádek na doplňky',
    shelfLevels: [0.94],
    railLevels: [],
    drawerSections: [],
    shoeShelves: 0,
    cubbies: { rows: 4, columns: 3 },
    accent: false,
  },
  {
    id: 'module-linen',
    label: 'Ložní prádlo',
    summary: 'Široké police na prádlo',
    shelfLevels: [0.2, 0.45, 0.7, 0.92],
    railLevels: [],
    drawerSections: [],
    shoeShelves: 0,
    cubbies: null,
    accent: false,
  },
]

const moduleMap = moduleLibrary.reduce((acc, module) => {
  acc[module.id] = module
  return acc
}, {})

const toolbarActions = [
  { id: 'measure', label: 'Změřit', icon: '📏' },
  { id: 'doors', label: 'Dveře', icon: '🚪' },
  { id: 'look', label: 'Pohled', icon: '🧭' },
  { id: 'home', label: 'Reset', icon: '🏠' },
  { id: 'undo', label: 'Zpět', icon: '↩' },
  { id: 'redo', label: 'Vpřed', icon: '↪' },
  { id: 'share', label: 'Sdílet', icon: '🔗' },
]

const positionLabelMap = positionOptions.reduce((acc, option) => {
  acc[option.id] = option.label
  return acc
}, {})

const formatCurrency = (value) =>
  new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0,
  }).format(value)

const filterSwatches = (category) => {
  if (category === 'vse') {
    return swatchLibrary
  }

  return swatchLibrary.filter((swatch) => swatch.categories.includes(category))
}

function useHistoryState(initialState) {
  const [history, setHistory] = useState({
    past: [],
    present: initialState,
    future: [],
  })

  const set = useCallback((value) => {
    setHistory((current) => {
      const previous = current.present
      const next = typeof value === 'function' ? value(previous) : value
      if (Object.is(previous, next)) return current
      return {
        past: [...current.past, previous],
        present: next,
        future: [],
      }
    })
  }, [])

  const undo = useCallback(() => {
    setHistory((current) => {
      if (!current.past.length) return current
      const previous = current.past[current.past.length - 1]
      const past = current.past.slice(0, -1)
      return {
        past,
        present: previous,
        future: [current.present, ...current.future],
      }
    })
  }, [])

  const redo = useCallback(() => {
    setHistory((current) => {
      if (!current.future.length) return current
      const next = current.future[0]
      const future = current.future.slice(1)
      return {
        past: [...current.past, current.present],
        present: next,
        future,
      }
    })
  }, [])

  return [history.present, set, undo, redo, history.past.length > 0, history.future.length > 0]
}

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

const accentColor = '#d9212a'

function App() {
  const [config, setConfig, undo, redo, canUndo, canRedo] = useHistoryState(initialConfig)
  const [activeStep, setActiveStep] = useState(0)
  const [activeInteriorColumn, setActiveInteriorColumn] = useState(0)
  const [cabinetCategory, setCabinetCategory] = useState('lamino')
  const [interiorCategory, setInteriorCategory] = useState('lamino')
  const [doorCategory, setDoorCategory] = useState('lamino')
  const [showMeasurements, setShowMeasurements] = useState(false)
  const [isFrontView, setIsFrontView] = useState(false)
  const [doorsVisible, setDoorsVisible] = useState(true)
  const [cameraResetKey, setCameraResetKey] = useState(0)
  const [toast, setToast] = useState('')
  const [quoteData, setQuoteData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    zip: '',
    note: '',
    attachment: '',
    consent: false,
  })

  const controlsRef = useRef(null)
  const previousDoorStyle = useRef(config.doorStyle)

  useEffect(() => {
    if (activeInteriorColumn > config.columnCount - 1) {
      setActiveInteriorColumn(Math.max(0, config.columnCount - 1))
    }
  }, [activeInteriorColumn, config.columnCount])

  useEffect(() => {
    if (config.doorStyle === 'none') {
      setDoorsVisible(false)
    } else if (previousDoorStyle.current === 'none') {
      setDoorsVisible(true)
    }
    previousDoorStyle.current = config.doorStyle
  }, [config.doorStyle])

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(''), 3600)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const cabinetColor = swatchLookup[config.cabinetMaterial]?.color ?? '#d0cec6'
  const interiorColor = swatchLookup[config.interiorMaterial]?.color ?? '#f1ede4'
  const doorColor = swatchLookup[config.doorMaterial]?.color ?? cabinetColor

  const updateConfig = useCallback(
    (updater) => {
      setConfig((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater
        return { ...next }
      })
    },
    [setConfig],
  )

  const handleDimensionChange = useCallback(
    (key, rawValue) => {
      const value = Number.parseFloat(rawValue)
      if (Number.isNaN(value)) return
      const limits = {
        width: { min: 60, max: 320 },
        height: { min: 180, max: 280 },
        depth: { min: 40, max: 100 },
      }
      const { min, max } = limits[key]
      const clamped = Math.min(Math.max(value, min), max)
      updateConfig((prev) => ({ ...prev, [key]: clamped, ...(key === 'height' ? { fullHeight: false } : {}) }))
      setToast(`Aktualizován rozměr ${key === 'width' ? 'šířka' : key === 'height' ? 'výška' : 'hloubka'}.`)
    },
    [updateConfig],
  )

  const handlePositionChange = useCallback(
    (value) => {
      updateConfig((prev) => ({ ...prev, position: value }))
      setToast('Pozice skříně upravena.')
    },
    [updateConfig],
  )

  const handleToggleAddon = useCallback(
    (id) => {
      updateConfig((prev) => ({ ...prev, [id]: !prev[id] }))
    },
    [updateConfig],
  )

  const handleFullHeightToggle = useCallback(
    (checked) => {
      updateConfig((prev) => {
        if (checked) {
          return { ...prev, fullHeight: true, height: 260 }
        }
        return { ...prev, fullHeight: false, height: Math.min(prev.height, 240) }
      })
    },
    [updateConfig],
  )

  const handleColumnCountChange = useCallback(
    (count) => {
      const nextCount = Math.min(Math.max(count, 1), 5)
      updateConfig((prev) => {
        if (prev.columnCount === nextCount) return prev
        const nextModules = prev.modules.slice(0, nextCount)
        while (nextModules.length < nextCount) {
          nextModules.push(moduleLibrary[0].id)
        }
        return {
          ...prev,
          columnCount: nextCount,
          modules: nextModules,
        }
      })
      setActiveInteriorColumn((prev) => Math.min(prev, nextCount - 1))
    },
    [updateConfig],
  )

  const handleModuleAssign = useCallback(
    (columnIndex, moduleId) => {
      updateConfig((prev) => {
        const modules = [...prev.modules]
        if (modules[columnIndex] === moduleId) return prev
        modules[columnIndex] = moduleId
        return { ...prev, modules }
      })
    },
    [updateConfig],
  )

  const handleDoorStyleChange = useCallback(
    (doorStyle) => {
      updateConfig((prev) => ({ ...prev, doorStyle }))
    },
    [updateConfig],
  )

  const handleMaterialSelect = useCallback(
    (scope, swatchId) => {
      updateConfig((prev) => ({ ...prev, [`${scope}Material`]: swatchId }))
    },
    [updateConfig],
  )

  const handleQuoteChange = useCallback((field, value) => {
    setQuoteData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleQuoteSubmit = useCallback(() => {
    if (!quoteData.consent) {
      setToast('Pro odeslání je potřeba souhlas se zpracováním údajů.')
      return
    }
    setToast('Poptávka byla úspěšně odeslána.')
  }, [quoteData.consent])

  const handleToolbarAction = useCallback(
    async (action) => {
      switch (action) {
        case 'measure':
          setShowMeasurements((prev) => !prev)
          break
        case 'doors': {
          if (config.doorStyle === 'none') {
            setActiveStep(2)
            setToast('Skříň je otevřená – aktivujte typ dveří ve 3. kroku.')
            break
          }
          setDoorsVisible((prev) => {
            const next = !prev
            setToast(next ? 'Dveře zobrazeny.' : 'Dveře skryty, interiér je viditelný.')
            return next
          })
          break
        }
        case 'look':
          setIsFrontView((prev) => !prev)
          setToast('Změněn pohled kamery.')
          break
        case 'home':
          setIsFrontView(false)
          setCameraResetKey((prev) => prev + 1)
          setToast('Kamera resetována.')
          break
        case 'undo':
          if (canUndo) {
            undo()
            setToast('Vráceno zpět.')
          }
          break
        case 'redo':
          if (canRedo) {
            redo()
            setToast('Opakováno.')
          }
          break
        case 'share': {
          const payload = JSON.stringify(config, null, 2)
          try {
            if (navigator.share) {
              const shareData = {
                title: '3D skříň – návrh',
                text: 'Podívej se na můj návrh vestavěné skříně.',
                url: window.location.href,
              }

              const blob = new Blob([payload], { type: 'application/json' })
              let file
              if (typeof window !== 'undefined' && typeof window.File === 'function') {
                file = new File([blob], 'skrin-konfigurace.json', { type: 'application/json' })
              }

              if (file && navigator.canShare?.({ files: [file] })) {
                shareData.files = [file]
              } else {
                shareData.text = `${shareData.text}\n\n${payload}`
              }

              await navigator.share(shareData)
              setToast('Sdílení dokončeno.')
            } else if (navigator.clipboard?.writeText) {
              await navigator.clipboard.writeText(payload)
              setToast('Konfigurace zkopírována do schránky.')
            } else {
              const element = document.createElement('a')
              element.href = URL.createObjectURL(new Blob([payload], { type: 'application/json' }))
              element.download = 'skrin-konfigurace.json'
              document.body.appendChild(element)
              element.click()
              document.body.removeChild(element)
              URL.revokeObjectURL(element.href)
              setToast('Stažen soubor s konfigurací.')
            }
          } catch (error) {
            setToast('Sdílení se nezdařilo.')
            console.error(error)
          }
          break
        }
        default:
          break
      }
    },
    [canRedo, canUndo, config, redo, undo],
  )

  const doorVariant = config.doorStyle === 'hinged' ? 'hinged' : config.doorStyle === 'sliding' ? 'sliding' : 'none'

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__left">
          <button type="button" className="icon-button" aria-label="Menu">
            <span />
          </button>
          <div className="brand">
            <span className="brand__mark" />
            <span>3D skříň</span>
          </div>
          <button type="button" className="chip chip--outline">
            Inspirace
            <span className="chip__dot" />
          </button>
        </div>
        <div className="app-header__right">
          <button type="button" className="chip chip--primary">
            <span className="chip__icon">+</span>
            Vytvořen nový návrh
          </button>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar__content">
            <StepProgress steps={steps} activeStep={activeStep} onStepClick={setActiveStep} />

            {activeStep === 0 && (
              <StepOne
                config={config}
                onDimensionChange={handleDimensionChange}
                onPositionChange={handlePositionChange}
                onToggleFullHeight={handleFullHeightToggle}
                onToggleAddOn={handleToggleAddon}
                cabinetCategory={cabinetCategory}
                onCabinetCategoryChange={setCabinetCategory}
                cabinetSwatches={filterSwatches(cabinetCategory)}
                onCabinetMaterialSelect={(swatchId) => handleMaterialSelect('cabinet', swatchId)}
              />
            )}

            {activeStep === 1 && (
              <StepTwo
                config={config}
                modules={moduleLibrary}
                activeColumn={activeInteriorColumn}
                onActiveColumnChange={setActiveInteriorColumn}
                onColumnCountChange={handleColumnCountChange}
                onAssignModule={handleModuleAssign}
                interiorCategory={interiorCategory}
                onInteriorCategoryChange={setInteriorCategory}
                interiorSwatches={filterSwatches(interiorCategory)}
                onInteriorMaterialSelect={(swatchId) => handleMaterialSelect('interior', swatchId)}
              />
            )}

            {activeStep === 2 && (
              <StepThree
                config={config}
                doorOptions={doorOptionVariants}
                onDoorStyleChange={handleDoorStyleChange}
                doorCategory={doorCategory}
                onDoorCategoryChange={setDoorCategory}
                doorSwatches={filterSwatches(doorCategory)}
                onDoorMaterialSelect={(swatchId) => handleMaterialSelect('door', swatchId)}
              />
            )}

            {activeStep === 3 && (
              <StepFour
                config={config}
                modules={config.modules.map((moduleId) => moduleMap[moduleId]?.label ?? 'Neznámý modul')}
                quoteData={quoteData}
                onQuoteChange={handleQuoteChange}
                onQuoteSubmit={handleQuoteSubmit}
              />
            )}
          </div>

          <div className="sidebar__footer">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
              disabled={activeStep === 0}
            >
              Zpět
            </button>
            {activeStep < steps.length - 1 ? (
              <button type="button" className="btn btn--primary" onClick={() => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1))}>
                Další krok
              </button>
            ) : (
              <button type="button" className="btn btn--primary" onClick={handleQuoteSubmit}>
                Odeslat
              </button>
            )}
          </div>
        </aside>

        <main className="workspace">
          <div className="workspace__status">
            <div className="status-pill">
              <span>Cena:</span>
              <strong>{formatCurrency(config.price)}</strong>
            </div>
            <div className="status-pill">
              <span>Dodání:</span>
              <strong>od {config.delivery}</strong>
            </div>
          </div>

          <div className="viewer">
            <Canvas
              shadows
              camera={{ position: [3.3, 2.3, 6.3], fov: 36, near: 0.1, far: 120 }}
              dpr={[1, 1.6]}
            >
              <Suspense fallback={<SceneLoader />}>
                <color attach="background" args={['#d6dae3']} />
                <Environment preset="apartment" background={false} />
                <SceneLighting />
                <group position={[0, 0, 0]}>
                  <Cabinet
                    width={config.width}
                    height={config.height}
                    depth={config.depth}
                    columnCount={config.columnCount}
                    modules={config.modules}
                    cabinetFinish={cabinetColor}
                    interiorFinish={interiorColor}
                    doorFinish={doorColor}
                    doorStyle={doorVariant}
                    doorsVisible={doorsVisible}
                    activeColumn={activeInteriorColumn}
                    includeBackPanel={config.includeBackPanel}
                    includeTopBottom={config.includeTopBottom}
                    includeTopShelf={config.includeTopShelf}
                    includeBase={config.includeBase}
                    moduleMap={moduleMap}
                  />
                </group>
                {showMeasurements && (
                  <MeasurementGuide width={config.width} height={config.height} depth={config.depth} />
                )}
                <Showroom />
                <ContactShadows position={[0, 0.01, 0]} scale={8} blur={2.5} opacity={0.32} far={6} />
                <OrbitControls
                  ref={controlsRef}
                  makeDefault
                  enablePan
                  enableDamping
                  dampingFactor={0.14}
                  maxPolarAngle={Math.PI / 2.05}
                  minDistance={3}
                  maxDistance={8}
                />
                <CameraRig
                  controlsRef={controlsRef}
                  isFrontView={isFrontView}
                  resetKey={cameraResetKey}
                />
              </Suspense>
            </Canvas>

            <ViewerToolbar
              actions={toolbarActions}
              onAction={handleToolbarAction}
              activeFlags={{
                measure: showMeasurements,
                look: isFrontView,
                doors: !doorsVisible && config.doorStyle !== 'none',
              }}
              disabledFlags={{
                undo: !canUndo,
                redo: !canRedo,
              }}
            />

            {toast && <Toast message={toast} />}
          </div>
        </main>
      </div>
    </div>
  )
}

const doorOptionVariants = [
  {
    id: 'sliding',
    label: 'Posuvné',
    description: 'Nezasahují do prostoru místnosti.',
    icon: (
      <svg viewBox="0 0 64 48" aria-hidden="true">
        <rect x="6" y="6" width="52" height="36" rx="6" fill="none" stroke="currentColor" strokeWidth="3" />
        <rect x="14" y="10" width="16" height="28" rx="3" fill="currentColor" opacity="0.25" />
        <rect x="34" y="10" width="16" height="28" rx="3" fill="currentColor" opacity="0.2" />
        <line x1="32" y1="10" x2="32" y2="38" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'hinged',
    label: 'Pantové',
    description: 'Klasické otevírání směrem ven.',
    icon: (
      <svg viewBox="0 0 64 48" aria-hidden="true">
        <rect x="6" y="6" width="52" height="36" rx="6" fill="none" stroke="currentColor" strokeWidth="3" />
        <rect x="14" y="10" width="18" height="28" rx="3" fill="currentColor" opacity="0.25" />
        <rect x="32" y="10" width="18" height="28" rx="3" fill="currentColor" opacity="0.25" />
        <line x1="32" y1="10" x2="32" y2="38" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
      </svg>
    ),
  },
  {
    id: 'none',
    label: 'Bez dveří',
    description: 'Otevřený přístup pro šatní stěnu.',
    icon: (
      <svg viewBox="0 0 64 48" aria-hidden="true">
        <rect x="6" y="6" width="52" height="36" rx="6" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="4 4" />
        <rect x="16" y="10" width="32" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      </svg>
    ),
  },
]

function StepProgress({ steps: stepItems, activeStep, onStepClick }) {
  return (
    <div className="step-progress">
      {stepItems.map((step, index) => {
        const state = index === activeStep ? 'active' : index < activeStep ? 'complete' : 'upcoming'
        return (
          <button
            key={step.id}
            type="button"
            className={`step-progress__item step-progress__item--${state}`}
            onClick={() => onStepClick(index)}
          >
            <span className="step-progress__bullet">{index + 1}</span>
            <span className="step-progress__label">{step.label}</span>
          </button>
        )
      })}
    </div>
  )
}

StepProgress.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  activeStep: PropTypes.number.isRequired,
  onStepClick: PropTypes.func.isRequired,
}

function StepOne({
  config,
  onDimensionChange,
  onPositionChange,
  onToggleFullHeight,
  onToggleAddOn,
  cabinetCategory,
  onCabinetCategoryChange,
  cabinetSwatches,
  onCabinetMaterialSelect,
}) {
  return (
    <section className="panel-card">
      <header className="panel-card__header">
        <span className="panel-card__step">1</span>
        <div>
          <h2 className="panel-card__title">Skříň</h2>
          <p className="panel-card__subtitle">Zadejte základní parametry skříně.</p>
        </div>
      </header>

      <div className="panel-section">
        <h3 className="panel-section__title">Pozice v místnosti</h3>
        <div className="option-grid">
          {positionOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`option-tile ${config.position === option.id ? 'is-active' : ''}`}
              onClick={() => onPositionChange(option.id)}
            >
              <span className="option-tile__icon">{option.icon}</span>
              <span className="option-tile__label">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="panel-section">
        <h3 className="panel-section__title">Rozměry skříně</h3>
        <div className="dimension-grid">
          <DimensionInput
            label="Šířka"
            value={config.width}
            unit="cm"
            min={60}
            max={320}
            onChange={(value) => onDimensionChange('width', value)}
          />
          <DimensionInput
            label="Výška"
            value={config.height}
            unit="cm"
            min={180}
            max={280}
            disabled={config.fullHeight}
            onChange={(value) => onDimensionChange('height', value)}
          />
          <DimensionInput
            label="Hloubka"
            value={config.depth}
            unit="cm"
            min={40}
            max={100}
            onChange={(value) => onDimensionChange('depth', value)}
          />
        </div>
        <SwitchControl
          label="Výška až do stropu"
          checked={config.fullHeight}
          onChange={onToggleFullHeight}
        />
      </div>

      <div className="panel-section">
        <h3 className="panel-section__title">Doplňky</h3>
        <div className="addon-grid">
          {addOnOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`toggle-chip ${config[option.id] ? 'is-active' : ''}`}
              onClick={() => onToggleAddOn(option.id)}
            >
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="panel-section">
        <MaterialSelector
          title="Dekor skříně"
          primaryFilters={materialPrimaryFilters}
          secondaryFilters={materialSecondaryFilters}
          activeFilter={cabinetCategory}
          onFilterChange={onCabinetCategoryChange}
          swatches={cabinetSwatches}
          selected={config.cabinetMaterial}
          onSelect={onCabinetMaterialSelect}
        />
      </div>
    </section>
  )
}

StepOne.propTypes = {
  config: PropTypes.shape({
    position: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    depth: PropTypes.number.isRequired,
    fullHeight: PropTypes.bool.isRequired,
    includeBackPanel: PropTypes.bool.isRequired,
    includeTopBottom: PropTypes.bool.isRequired,
    includeTopShelf: PropTypes.bool.isRequired,
    includeBase: PropTypes.bool.isRequired,
    cabinetMaterial: PropTypes.string.isRequired,
  }).isRequired,
  onDimensionChange: PropTypes.func.isRequired,
  onPositionChange: PropTypes.func.isRequired,
  onToggleFullHeight: PropTypes.func.isRequired,
  onToggleAddOn: PropTypes.func.isRequired,
  cabinetCategory: PropTypes.string.isRequired,
  onCabinetCategoryChange: PropTypes.func.isRequired,
  cabinetSwatches: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onCabinetMaterialSelect: PropTypes.func.isRequired,
}

function StepTwo({
  config,
  modules,
  activeColumn,
  onActiveColumnChange,
  onColumnCountChange,
  onAssignModule,
  interiorCategory,
  onInteriorCategoryChange,
  interiorSwatches,
  onInteriorMaterialSelect,
}) {
  return (
    <section className="panel-card">
      <header className="panel-card__header">
        <span className="panel-card__step">2</span>
        <div>
          <h2 className="panel-card__title">Interiér</h2>
          <p className="panel-card__subtitle">Rozdělte skříň na moduly a nastavte doplňky.</p>
        </div>
      </header>

      <div className="panel-section">
        <h3 className="panel-section__title">Počet modulů</h3>
        <div className="module-count">
          <button
            type="button"
            onClick={() => onColumnCountChange(config.columnCount - 1)}
            aria-label="Odebrat modul"
            disabled={config.columnCount <= 1}
          >
            –
          </button>
          <span>{config.columnCount}</span>
          <button
            type="button"
            onClick={() => onColumnCountChange(config.columnCount + 1)}
            aria-label="Přidat modul"
            disabled={config.columnCount >= 5}
          >
            +
          </button>
        </div>
        <div className="column-preview">
          {Array.from({ length: config.columnCount }).map((_, index) => {
            const moduleId = config.modules[index]
            const moduleDef = moduleMap[moduleId] ?? modules[0]
            return (
              <button
                key={`column-${index}`}
                type="button"
                className={`column-preview__item ${index === activeColumn ? 'is-active' : ''}`}
                onClick={() => onActiveColumnChange(index)}
              >
                <span className="column-preview__index">{index + 1}</span>
                <span className="column-preview__label">{moduleDef.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="panel-section">
        <h3 className="panel-section__title">Moduly</h3>
        <p className="panel-section__hint">Klikněte na modul pro přiřazení k vybranému sloupci.</p>
        <div className="module-grid">
          {modules.map((module) => (
            <button
              key={module.id}
              type="button"
              className={`module-card ${config.modules[activeColumn] === module.id ? 'is-active' : ''}`}
              onClick={() => onAssignModule(activeColumn, module.id)}
            >
              <span className="module-card__icon">
                <ModuleIcon module={module} />
              </span>
              <span className="module-card__title">{module.label}</span>
              <span className="module-card__subtitle">{module.summary}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="panel-section">
        <MaterialSelector
          title="Dekor interiéru"
          primaryFilters={materialPrimaryFilters}
          secondaryFilters={materialSecondaryFilters}
          activeFilter={interiorCategory}
          onFilterChange={onInteriorCategoryChange}
          swatches={interiorSwatches}
          selected={config.interiorMaterial}
          onSelect={onInteriorMaterialSelect}
        />
      </div>
    </section>
  )
}

StepTwo.propTypes = {
  config: PropTypes.shape({
    columnCount: PropTypes.number.isRequired,
    modules: PropTypes.arrayOf(PropTypes.string).isRequired,
    interiorMaterial: PropTypes.string.isRequired,
  }).isRequired,
  modules: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      summary: PropTypes.string.isRequired,
    }),
  ).isRequired,
  activeColumn: PropTypes.number.isRequired,
  onActiveColumnChange: PropTypes.func.isRequired,
  onColumnCountChange: PropTypes.func.isRequired,
  onAssignModule: PropTypes.func.isRequired,
  interiorCategory: PropTypes.string.isRequired,
  onInteriorCategoryChange: PropTypes.func.isRequired,
  interiorSwatches: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onInteriorMaterialSelect: PropTypes.func.isRequired,
}

function StepThree({
  config,
  doorOptions,
  onDoorStyleChange,
  doorCategory,
  onDoorCategoryChange,
  doorSwatches,
  onDoorMaterialSelect,
}) {
  return (
    <section className="panel-card">
      <header className="panel-card__header">
        <span className="panel-card__step">3</span>
        <div>
          <h2 className="panel-card__title">Dveře</h2>
          <p className="panel-card__subtitle">Vyberte typ dveří a jejich dekor.</p>
        </div>
      </header>

      <div className="panel-section">
        <h3 className="panel-section__title">Typ dveří</h3>
        <div className="door-grid">
          {doorOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`door-card ${config.doorStyle === option.id ? 'is-active' : ''}`}
              onClick={() => onDoorStyleChange(option.id)}
            >
              <span className="door-card__icon">{option.icon}</span>
              <span className="door-card__title">{option.label}</span>
              <span className="door-card__subtitle">{option.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="panel-section">
        <MaterialSelector
          title="Dekor dveří"
          primaryFilters={materialPrimaryFilters}
          secondaryFilters={materialSecondaryFilters}
          activeFilter={doorCategory}
          onFilterChange={onDoorCategoryChange}
          swatches={doorSwatches}
          selected={config.doorMaterial}
          onSelect={onDoorMaterialSelect}
          disabled={config.doorStyle === 'none'}
        />
        {config.doorStyle === 'none' && (
          <p className="panel-section__hint panel-section__hint--muted">
            Dekor je dostupný, pouze pokud jsou dveře aktivní.
          </p>
        )}
      </div>
    </section>
  )
}

StepThree.propTypes = {
  config: PropTypes.shape({
    doorStyle: PropTypes.string.isRequired,
    doorMaterial: PropTypes.string.isRequired,
  }).isRequired,
  doorOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
    }),
  ).isRequired,
  onDoorStyleChange: PropTypes.func.isRequired,
  doorCategory: PropTypes.string.isRequired,
  onDoorCategoryChange: PropTypes.func.isRequired,
  doorSwatches: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onDoorMaterialSelect: PropTypes.func.isRequired,
}

function StepFour({ config, modules, quoteData, onQuoteChange, onQuoteSubmit }) {
  const selectedAddOns = addOnOptions.filter((option) => config[option.id]).map((option) => option.label)
  const cabinetMaterialLabel = swatchLookup[config.cabinetMaterial]?.label ?? 'Neuvedeno'
  const interiorMaterialLabel = swatchLookup[config.interiorMaterial]?.label ?? 'Neuvedeno'
  const doorMaterialLabel =
    config.doorStyle === 'none' ? 'Bez dveří' : swatchLookup[config.doorMaterial]?.label ?? 'Neuvedeno'

  return (
    <section className="panel-card">
      <header className="panel-card__header">
        <span className="panel-card__step">4</span>
        <div>
          <h2 className="panel-card__title">Rekapitulace</h2>
          <p className="panel-card__subtitle">Shrnutí konfigurace a odeslání poptávky.</p>
        </div>
      </header>

      <div className="panel-section">
        <h3 className="panel-section__title">Souhrn konfigurace</h3>
        <dl className="summary-list">
          <div>
            <dt>Pozice</dt>
            <dd>{positionLabelMap[config.position]}</dd>
          </div>
          <div>
            <dt>Rozměry</dt>
            <dd>
              {config.width} × {config.height} × {config.depth} cm
            </dd>
          </div>
          <div>
            <dt>Dekor skříně</dt>
            <dd>{cabinetMaterialLabel}</dd>
          </div>
          <div>
            <dt>Dekor interiéru</dt>
            <dd>{interiorMaterialLabel}</dd>
          </div>
          <div>
            <dt>Dekor dveří</dt>
            <dd>{doorMaterialLabel}</dd>
          </div>
          <div>
            <dt>Moduly</dt>
            <dd>{modules.join(', ')}</dd>
          </div>
          <div>
            <dt>Doplňky</dt>
            <dd>{selectedAddOns.length ? selectedAddOns.join(', ') : 'Bez doplňků'}</dd>
          </div>
        </dl>
      </div>

      <div className="panel-section">
        <h3 className="panel-section__title">Odeslat poptávku</h3>
        <form
          className="quote-form"
          onSubmit={(event) => {
            event.preventDefault()
            onQuoteSubmit()
          }}
        >
          <div className="form-grid">
            <LabeledInput
              label="Jméno a příjmení"
              value={quoteData.name}
              onChange={(value) => onQuoteChange('name', value)}
              placeholder="Jana Nováková"
            />
            <LabeledInput
              label="E-mail"
              value={quoteData.email}
              onChange={(value) => onQuoteChange('email', value)}
              type="email"
              placeholder="jana@example.com"
            />
            <LabeledInput
              label="Telefon"
              value={quoteData.phone}
              onChange={(value) => onQuoteChange('phone', value)}
              type="tel"
              placeholder="+420 777 000 000"
            />
            <LabeledInput
              label="Adresa realizace"
              value={quoteData.address}
              onChange={(value) => onQuoteChange('address', value)}
              placeholder="Ulice 123, Město"
            />
            <LabeledInput
              label="PSČ"
              value={quoteData.zip}
              onChange={(value) => onQuoteChange('zip', value)}
              placeholder="100 00"
            />
          </div>
          <label className="form-field">
            <span>Poznámka</span>
            <textarea
              value={quoteData.note}
              onChange={(event) => onQuoteChange('note', event.target.value)}
              rows={4}
              placeholder="Sem můžete napsat doplňující informace."
            />
          </label>
          <label className="form-field form-field--file">
            <span>Příloha</span>
            <div className="file-input">
              <input
                type="file"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  onQuoteChange('attachment', file ? file.name : '')
                }}
              />
              <span>{quoteData.attachment || 'Žádný soubor není vybrán'}</span>
            </div>
          </label>
          <label className="consent">
            <input
              type="checkbox"
              checked={quoteData.consent}
              onChange={(event) => onQuoteChange('consent', event.target.checked)}
            />
            <span>Souhlasím se zpracováním osobních informací*</span>
          </label>
          <button type="submit" className="btn btn--primary btn--block">
            Odeslat
          </button>
        </form>
      </div>
    </section>
  )
}

StepFour.propTypes = {
  config: PropTypes.shape({
    position: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    depth: PropTypes.number.isRequired,
    cabinetMaterial: PropTypes.string.isRequired,
    interiorMaterial: PropTypes.string.isRequired,
    doorMaterial: PropTypes.string.isRequired,
    doorStyle: PropTypes.string.isRequired,
    includeBackPanel: PropTypes.bool.isRequired,
    includeTopBottom: PropTypes.bool.isRequired,
    includeTopShelf: PropTypes.bool.isRequired,
    includeBase: PropTypes.bool.isRequired,
  }).isRequired,
  modules: PropTypes.arrayOf(PropTypes.string).isRequired,
  quoteData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    zip: PropTypes.string.isRequired,
    note: PropTypes.string.isRequired,
    attachment: PropTypes.string.isRequired,
    consent: PropTypes.bool.isRequired,
  }).isRequired,
  onQuoteChange: PropTypes.func.isRequired,
  onQuoteSubmit: PropTypes.func.isRequired,
}

function DimensionInput({ label, value, unit, min, max, onChange, disabled }) {
  return (
    <label className={`dimension-field ${disabled ? 'dimension-field--disabled' : ''}`}>
      <span>{label}</span>
      <div className="dimension-field__control">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
        />
        <span className="dimension-field__unit">{unit}</span>
      </div>
    </label>
  )
}

DimensionInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
}

DimensionInput.defaultProps = {
  disabled: false,
}

function SwitchControl({ label, checked, onChange }) {
  return (
    <label className="switch-control">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className="switch-control__track">
        <span className="switch-control__thumb" />
      </span>
      <span className="switch-control__label">{label}</span>
    </label>
  )
}

SwitchControl.propTypes = {
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
}

function MaterialSelector({
  title,
  primaryFilters,
  secondaryFilters,
  activeFilter,
  onFilterChange,
  swatches,
  selected,
  onSelect,
  disabled,
}) {
  return (
    <div className={`material-selector ${disabled ? 'material-selector--disabled' : ''}`}>
      <h3 className="panel-section__title">{title}</h3>
      <div className="material-tabs">
        {primaryFilters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className={`material-tab ${activeFilter === filter.id ? 'is-active' : ''}`}
            onClick={() => onFilterChange(filter.id)}
            disabled={disabled}
          >
            {filter.label}
          </button>
        ))}
      </div>
      <div className="material-tabs material-tabs--secondary">
        {secondaryFilters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className={`material-tab material-tab--ghost ${activeFilter === filter.id ? 'is-active' : ''}`}
            onClick={() => onFilterChange(filter.id)}
            disabled={disabled}
          >
            {filter.label}
          </button>
        ))}
      </div>
      <div className="swatch-grid">
        {swatches.map((swatch) => (
          <button
            key={swatch.id}
            type="button"
            className={`swatch ${selected === swatch.id ? 'is-active' : ''}`}
            onClick={() => onSelect(swatch.id)}
            disabled={disabled}
          >
            <span className="swatch__color" style={{ backgroundColor: swatch.color }} />
            <span className="swatch__label">{swatch.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

MaterialSelector.propTypes = {
  title: PropTypes.string.isRequired,
  primaryFilters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  secondaryFilters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  activeFilter: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  swatches: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    }),
  ).isRequired,
  selected: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
}

MaterialSelector.defaultProps = {
  disabled: false,
}

function LabeledInput({ label, value, onChange, type, placeholder }) {
  return (
    <label className="form-field">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

LabeledInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
}

LabeledInput.defaultProps = {
  type: 'text',
  placeholder: '',
}

function ViewerToolbar({ actions, onAction, activeFlags, disabledFlags }) {
  return (
    <div className="viewer-toolbar">
      {actions.map((action) => {
        const isActive = activeFlags[action.id]
        const isDisabled = disabledFlags[action.id]
        return (
          <button
            key={action.id}
            type="button"
            className={`viewer-toolbar__button ${isActive ? 'is-active' : ''}`}
            onClick={() => onAction(action.id)}
            disabled={isDisabled}
          >
            <span aria-hidden="true">{action.icon}</span>
            <span className="viewer-toolbar__label">{action.label}</span>
          </button>
        )
      })}
    </div>
  )
}

ViewerToolbar.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onAction: PropTypes.func.isRequired,
  activeFlags: PropTypes.objectOf(PropTypes.bool).isRequired,
  disabledFlags: PropTypes.objectOf(PropTypes.bool).isRequired,
}

function Toast({ message }) {
  return (
    <div className="toast">
      <span>{message}</span>
    </div>
  )
}

Toast.propTypes = {
  message: PropTypes.string.isRequired,
}

function ModuleIcon({ module }) {
  if (module.drawerSections.length > 0) {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <rect x="12" y="10" width="40" height="44" rx="6" fill="none" stroke="currentColor" strokeWidth="3" />
        {module.drawerSections.map((drawer, index) => (
          <rect
            key={index}
            x="16"
            y={30 + index * 8}
            width="32"
            height="8"
            rx="3"
            fill="currentColor"
            opacity="0.2"
          />
        ))}
        {module.railLevels.length > 0 && (
          <line x1="16" y1="22" x2="48" y2="22" stroke="currentColor" strokeWidth="3" />
        )}
      </svg>
    )
  }

  if (module.cubbies) {
    const cells = []
    for (let row = 0; row < module.cubbies.rows; row += 1) {
      for (let col = 0; col < module.cubbies.columns; col += 1) {
        cells.push(
          <rect
            key={`${row}-${col}`}
            x={16 + col * 10}
            y={20 + row * 6}
            width="8"
            height="5"
            rx="1"
            fill="currentColor"
            opacity="0.2"
          />,
        )
      }
    }
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <rect x="12" y="10" width="40" height="44" rx="6" fill="none" stroke="currentColor" strokeWidth="3" />
        {cells}
      </svg>
    )
  }

  if (module.shoeShelves > 0) {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <rect x="12" y="10" width="40" height="44" rx="6" fill="none" stroke="currentColor" strokeWidth="3" />
        {[0, 1, 2, 3, 4].map((index) => (
          <line
            key={index}
            x1="16"
            y1={22 + index * 7}
            x2="48"
            y2={20 + index * 7}
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        ))}
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <rect x="12" y="10" width="40" height="44" rx="6" fill="none" stroke="currentColor" strokeWidth="3" />
      {module.shelfLevels.map((level, index) => (
        <line
          key={index}
          x1="16"
          y1={24 + index * 6}
          x2="48"
          y2={24 + index * 6}
          stroke="currentColor"
          strokeWidth="3"
        />
      ))}
    </svg>
  )
}

ModuleIcon.propTypes = {
  module: PropTypes.shape({
    drawerSections: PropTypes.array.isRequired,
    railLevels: PropTypes.array.isRequired,
    cubbies: PropTypes.shape({
      rows: PropTypes.number.isRequired,
      columns: PropTypes.number.isRequired,
    }),
    shoeShelves: PropTypes.number.isRequired,
    shelfLevels: PropTypes.array.isRequired,
  }).isRequired,
}

function Cabinet({
  width,
  height,
  depth,
  columnCount,
  modules,
  cabinetFinish,
  interiorFinish,
  doorFinish,
  doorStyle,
  doorsVisible,
  activeColumn,
  includeBackPanel,
  includeTopBottom,
  includeTopShelf,
  includeBase,
  moduleMap: moduleLookup,
}) {
  const thickness = 0.032
  const widthMeters = width / 100
  const heightMeters = height / 100
  const depthMeters = depth / 100

  const halfHeight = heightMeters / 2
  const halfDepth = depthMeters / 2

  const interiorWidth = widthMeters - thickness * 2
  const interiorDepth = depthMeters - thickness * 1.2
  const interiorHeight = heightMeters - thickness * 2
  const interiorBottom = -halfHeight + thickness * 1.1

  const columnWidth = interiorWidth / columnCount

  const columnModules = modules.slice(0, columnCount).map((moduleId) => moduleLookup[moduleId] ?? moduleLibrary[0])

  return (
    <group position={[0, halfHeight, 0]}>
      <mesh position={[0, halfHeight - halfHeight, 0]} castShadow receiveShadow>
        <boxGeometry args={[widthMeters, heightMeters, depthMeters]} />
        <meshStandardMaterial color={cabinetFinish} roughness={0.52} metalness={0.08} />
      </mesh>

      {includeBackPanel && (
        <mesh position={[0, 0, -halfDepth + thickness / 2]} receiveShadow>
          <boxGeometry args={[widthMeters - thickness * 1.5, heightMeters - thickness * 1.8, thickness]} />
          <meshStandardMaterial color={interiorFinish} roughness={0.32} metalness={0.08} />
        </mesh>
      )}

      {includeTopBottom && (
        <>
          <mesh position={[0, halfHeight - thickness / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[widthMeters, thickness, depthMeters]} />
            <meshStandardMaterial color={cabinetFinish} roughness={0.48} metalness={0.08} />
          </mesh>
          <mesh position={[0, -halfHeight + thickness / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[widthMeters, thickness, depthMeters]} />
            <meshStandardMaterial color={cabinetFinish} roughness={0.6} metalness={0.08} />
          </mesh>
        </>
      )}

      {includeBase && (
        <mesh position={[0, -halfHeight + thickness * 1.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[widthMeters * 0.96, thickness * 1.8, depthMeters * 0.96]} />
          <meshStandardMaterial color={cabinetFinish} roughness={0.5} metalness={0.15} />
        </mesh>
      )}

      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[interiorWidth, interiorHeight, interiorDepth]} />
        <meshStandardMaterial
          color={interiorFinish}
          roughness={0.36}
          metalness={0.12}
          side={THREE.BackSide}
          transparent
          opacity={0.98}
        />
      </mesh>

      {includeTopShelf && (
        <mesh position={[0, halfHeight - thickness * 2.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[interiorWidth, thickness, Math.max(interiorDepth - 0.02, 0.08)]} />
          <meshStandardMaterial color={cabinetFinish} roughness={0.48} metalness={0.12} />
        </mesh>
      )}

      {Array.from({ length: Math.max(columnCount - 1, 0) }).map((_, index) => {
        const dividerX = -interiorWidth / 2 + columnWidth * (index + 1)
        return (
          <mesh key={`divider-${index}`} position={[dividerX, 0, 0]} receiveShadow>
            <boxGeometry args={[thickness * 0.85, interiorHeight, Math.max(interiorDepth - 0.02, 0.08)]} />
            <meshStandardMaterial color={interiorFinish} roughness={0.38} metalness={0.12} />
          </mesh>
        )
      })}

      {columnModules.map((moduleDef, index) => (
        <ModuleColumn
          key={`${moduleDef.id}-${index}`}
          module={moduleDef}
          columnIndex={index}
          columnCount={columnCount}
          columnWidth={columnWidth}
          interiorWidth={interiorWidth}
          thickness={thickness}
          depth={Math.max(interiorDepth - 0.02, 0.08)}
          interiorHeight={interiorHeight}
          interiorBottom={interiorBottom}
          finish={interiorFinish}
          interiorFinish={interiorFinish}
          isActive={index === activeColumn}
        />
      ))}

      {doorStyle !== 'none' && doorsVisible && (
        <CabinetDoors
          width={widthMeters}
          height={heightMeters}
          depth={depthMeters}
          doorStyle={doorStyle}
          finish={doorFinish}
        />
      )}
    </group>
  )
}

Cabinet.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  depth: PropTypes.number.isRequired,
  columnCount: PropTypes.number.isRequired,
  modules: PropTypes.arrayOf(PropTypes.string).isRequired,
  cabinetFinish: PropTypes.string.isRequired,
  interiorFinish: PropTypes.string.isRequired,
  doorFinish: PropTypes.string.isRequired,
  doorStyle: PropTypes.oneOf(['hinged', 'sliding', 'none']).isRequired,
  doorsVisible: PropTypes.bool.isRequired,
  activeColumn: PropTypes.number.isRequired,
  includeBackPanel: PropTypes.bool.isRequired,
  includeTopBottom: PropTypes.bool.isRequired,
  includeTopShelf: PropTypes.bool.isRequired,
  includeBase: PropTypes.bool.isRequired,
  moduleMap: PropTypes.object.isRequired,
}

function ModuleColumn({
  module,
  columnIndex,
  columnCount,
  columnWidth,
  interiorWidth,
  thickness,
  depth,
  interiorHeight,
  interiorBottom,
  finish,
  interiorFinish,
  isActive,
}) {
  const groupRef = useRef(null)
  const scaleRef = useRef(1)
  const scaleGoal = useRef(1)

  useEffect(() => {
    scaleRef.current = 0.82
  }, [module.id, columnCount])

  useEffect(() => {
    scaleGoal.current = isActive ? 1.05 : 1
  }, [isActive])

  useFrame(() => {
    if (!groupRef.current) return
    const target = scaleGoal.current
    const next = scaleRef.current + (target - scaleRef.current) * 0.18
    scaleRef.current = next
    groupRef.current.scale.set(next, 1, next)
  })

  const xOffset = -interiorWidth / 2 + columnWidth / 2 + columnIndex * columnWidth
  const usableWidth = Math.max(columnWidth - thickness * 1.2, 0.08)
  const usableDepth = depth

  const bottomY = interiorBottom + thickness
  const effectiveHeight = interiorHeight - thickness * 1.5

  const shelves = (module.shelfLevels || []).map((ratio) => ({
    y: bottomY + ratio * effectiveHeight,
  }))

  const drawers = module.drawerSections.map((drawer) => {
    const heightMeters = drawer.height * effectiveHeight
    const offset = bottomY + drawer.offset * effectiveHeight + heightMeters / 2
    return { y: offset, height: heightMeters }
  })

  const rails = (module.railLevels || []).map((ratio) => ({
    y: bottomY + ratio * effectiveHeight,
  }))

  const shoeShelves = module.shoeShelves
    ? Array.from({ length: module.shoeShelves }).map((_, index) => ({
        y: bottomY + 0.12 + index * (effectiveHeight * 0.12),
      }))
    : []

  const cubbies = []
  if (module.cubbies) {
    const { rows, columns } = module.cubbies
    const cellHeight = (effectiveHeight * 0.8) / rows
    const startY = bottomY + effectiveHeight * 0.1
    for (let row = 0; row <= rows; row += 1) {
      const y = startY + row * cellHeight
      cubbies.push({ type: 'horizontal', y })
    }
    for (let col = 0; col <= columns; col += 1) {
      const x = -usableWidth / 2 + col * (usableWidth / columns)
      cubbies.push({ type: 'vertical', x })
    }
  }

  return (
    <group ref={groupRef} position={[xOffset, 0, 0]}>
      {isActive && (
        <mesh
          position={[0, bottomY + effectiveHeight / 2, -usableDepth / 2 - 0.005]}
          receiveShadow
        >
          <planeGeometry args={[usableWidth * 0.98, effectiveHeight * 1.02]} />
          <meshStandardMaterial color={accentColor} transparent opacity={0.1} />
        </mesh>
      )}
      {module.accent && (
        <mesh position={[0, bottomY + effectiveHeight / 2, usableDepth / 2 + 0.01]}>
          <planeGeometry args={[usableWidth * 0.92, effectiveHeight * 0.95]} />
          <meshStandardMaterial color={accentColor} roughness={0.35} metalness={0.25} opacity={0.12} transparent />
        </mesh>
      )}

      {shelves.map((shelf, index) => (
        <mesh
          key={`shelf-${module.id}-${index}`}
          position={[0, shelf.y, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[usableWidth, thickness, usableDepth * 0.98]} />
          <meshStandardMaterial color={finish} roughness={0.48} metalness={0.1} />
        </mesh>
      ))}

      {rails.map((rail, index) => (
        <mesh
          key={`rail-${module.id}-${index}`}
          position={[0, rail.y, usableDepth / 2 - 0.05]}
          castShadow
        >
          <cylinderGeometry args={[0.01, 0.01, usableWidth * 0.94, 24]} />
          <meshStandardMaterial color="#c5c6ce" metalness={0.9} roughness={0.25} />
        </mesh>
      ))}

      {drawers.map((drawer, index) => (
        <group
          key={`drawer-${module.id}-${index}`}
          position={[0, drawer.y - effectiveHeight / 2, usableDepth / 2 - thickness * 1.2]}
        >
          <mesh castShadow receiveShadow position={[0, effectiveHeight / 2, 0]}>
            <boxGeometry args={[usableWidth * 0.92, drawer.height, thickness * 2]} />
            <meshStandardMaterial color={finish} roughness={0.45} metalness={0.06} />
          </mesh>
          <mesh position={[0, effectiveHeight / 2, thickness * 0.9]} castShadow>
            <boxGeometry args={[0.08, drawer.height * 0.2, 0.04]} />
            <meshStandardMaterial color={accentColor} metalness={0.55} roughness={0.18} />
          </mesh>
        </group>
      ))}

      {shoeShelves.map((item, index) => (
        <mesh
          key={`shoe-${module.id}-${index}`}
          position={[0, item.y, usableDepth / 2 - 0.03]}
          rotation={[0.4, 0, 0]}
          castShadow
        >
          <boxGeometry args={[usableWidth * 0.96, thickness, usableDepth * 0.7]} />
          <meshStandardMaterial color={finish} roughness={0.48} metalness={0.1} />
        </mesh>
      ))}

      {cubbies.map((divider, index) =>
        divider.type === 'horizontal' ? (
          <mesh
            key={`cubby-h-${index}`}
            position={[0, divider.y, 0]}
            receiveShadow
          >
            <boxGeometry args={[usableWidth * 0.96, thickness * 0.6, usableDepth * 0.96]} />
            <meshStandardMaterial color={interiorFinish} roughness={0.4} metalness={0.1} />
          </mesh>
        ) : (
          <mesh
            key={`cubby-v-${index}`}
            position={[divider.x - usableWidth / 2, bottomY + effectiveHeight * 0.5, 0]}
            receiveShadow
          >
            <boxGeometry args={[thickness * 0.6, effectiveHeight * 0.8, usableDepth * 0.96]} />
            <meshStandardMaterial color={interiorFinish} roughness={0.4} metalness={0.1} />
          </mesh>
        ),
      )}
    </group>
  )
}

ModuleColumn.propTypes = {
  module: PropTypes.shape({
    id: PropTypes.string.isRequired,
    shelfLevels: PropTypes.array.isRequired,
    railLevels: PropTypes.array.isRequired,
    drawerSections: PropTypes.array.isRequired,
    shoeShelves: PropTypes.number.isRequired,
    cubbies: PropTypes.oneOfType([
      PropTypes.shape({
        rows: PropTypes.number.isRequired,
        columns: PropTypes.number.isRequired,
      }),
      PropTypes.oneOf([null]),
    ]),
    accent: PropTypes.bool.isRequired,
  }).isRequired,
  columnIndex: PropTypes.number.isRequired,
  columnCount: PropTypes.number.isRequired,
  columnWidth: PropTypes.number.isRequired,
  interiorWidth: PropTypes.number.isRequired,
  thickness: PropTypes.number.isRequired,
  depth: PropTypes.number.isRequired,
  interiorHeight: PropTypes.number.isRequired,
  interiorBottom: PropTypes.number.isRequired,
  finish: PropTypes.string.isRequired,
  interiorFinish: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
}

function CabinetDoors({ width, height, depth, doorStyle, finish }) {
  const doorGap = 0.01
  const doorThickness = 0.02
  const doorZ = depth / 2 + doorThickness / 2 - 0.005
  const handleOffset = height * 0.15
  const handleLength = Math.max(0.08, height * 0.1)

  if (doorStyle === 'sliding') {
    const overlap = 0.03
    const trackThickness = doorThickness / 2
    const frameColor = '#c7c9d4'
    return (
      <group>
        <mesh position={[0, height / 2 + trackThickness, doorZ + 0.01]} castShadow receiveShadow>
          <boxGeometry args={[width + doorThickness * 1.6, trackThickness, doorThickness * 1.1]} />
          <meshStandardMaterial color={frameColor} metalness={0.65} roughness={0.25} />
        </mesh>
        <mesh position={[0, height / -2 - trackThickness / 1.5, doorZ + 0.01]} receiveShadow>
          <boxGeometry args={[width + doorThickness * 1.6, trackThickness, doorThickness * 1.1]} />
          <meshStandardMaterial color={frameColor} metalness={0.5} roughness={0.35} />
        </mesh>
        <mesh position={[-width / 2 - doorThickness / 3, 0, doorZ + 0.01]} receiveShadow>
          <boxGeometry args={[doorThickness / 1.2, height + trackThickness * 1.2, doorThickness * 0.9]} />
          <meshStandardMaterial color={frameColor} metalness={0.55} roughness={0.4} />
        </mesh>
        <mesh position={[width / 2 + doorThickness / 3, 0, doorZ + 0.01]} receiveShadow>
          <boxGeometry args={[doorThickness / 1.2, height + trackThickness * 1.2, doorThickness * 0.9]} />
          <meshStandardMaterial color={frameColor} metalness={0.55} roughness={0.4} />
        </mesh>
        <Door
          width={width / 2 + overlap}
          height={height}
          doorThickness={doorThickness}
          position={[-overlap / 2, 0, doorZ + doorThickness * 0.35]}
          hingeSide="left"
          finish={finish}
          handleOffset={handleOffset}
          handleLength={handleLength}
          variant="sliding-left"
        />
        <Door
          width={width / 2 + overlap}
          height={height}
          doorThickness={doorThickness}
          position={[overlap / 2, 0, doorZ - doorThickness * 0.35]}
          hingeSide="right"
          finish={finish}
          handleOffset={handleOffset}
          handleLength={handleLength}
          variant="sliding-right"
        />
      </group>
    )
  }

  const singleWidth = width / 2 - doorGap / 2
  return (
    <group>
      <Door
        width={singleWidth}
        height={height}
        doorThickness={doorThickness}
        position={[-singleWidth / 2 - doorGap / 2, 0, doorZ]}
        hingeSide="left"
        finish={finish}
        handleOffset={handleOffset}
        handleLength={handleLength}
        variant="hinged"
      />
      <Door
        width={singleWidth}
        height={height}
        doorThickness={doorThickness}
        position={[singleWidth / 2 + doorGap / 2, 0, doorZ]}
        hingeSide="right"
        finish={finish}
        handleOffset={handleOffset}
        handleLength={handleLength}
        variant="hinged"
      />
    </group>
  )
}

CabinetDoors.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  depth: PropTypes.number.isRequired,
  doorStyle: PropTypes.oneOf(['hinged', 'sliding', 'none']).isRequired,
  finish: PropTypes.string.isRequired,
}

function Door({ width, height, doorThickness, position, hingeSide, finish, handleOffset, handleLength, variant }) {
  const isSliding = variant?.startsWith('sliding')
  const frameColor = '#c8cbd4'
  const handleX = isSliding
    ? hingeSide === 'left'
      ? width / 2 - 0.12
      : -width / 2 + 0.12
    : hingeSide === 'left'
    ? width / 2 - 0.08
    : -width / 2 + 0.08
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, doorThickness]} />
        <meshStandardMaterial
          color={isSliding ? frameColor : finish}
          roughness={isSliding ? 0.3 : 0.42}
          metalness={isSliding ? 0.35 : 0.1}
        />
      </mesh>
      {isSliding && (
        <>
          <mesh position={[0, 0, doorThickness / 2 - doorThickness * 0.25]} receiveShadow>
            <boxGeometry args={[width * 0.92, height * 0.88, Math.max(doorThickness * 0.18, 0.005)]} />
            <meshStandardMaterial color={finish} roughness={0.4} metalness={0.12} />
          </mesh>
          <mesh position={[0, height / 2 - 0.04, doorThickness / 2 + 0.004]}>
            <boxGeometry args={[width * 0.94, 0.02, doorThickness * 0.6]} />
            <meshStandardMaterial color={frameColor} metalness={0.4} roughness={0.3} />
          </mesh>
          <mesh position={[0, -height / 2 + 0.04, doorThickness / 2 + 0.004]}>
            <boxGeometry args={[width * 0.94, 0.02, doorThickness * 0.6]} />
            <meshStandardMaterial color={frameColor} metalness={0.4} roughness={0.3} />
          </mesh>
          <mesh position={[width / 2 - 0.02, 0, doorThickness / 2 + 0.004]}>
            <boxGeometry args={[0.02, height * 0.94, doorThickness * 0.6]} />
            <meshStandardMaterial color={frameColor} metalness={0.4} roughness={0.3} />
          </mesh>
          <mesh position={[-width / 2 + 0.02, 0, doorThickness / 2 + 0.004]}>
            <boxGeometry args={[0.02, height * 0.94, doorThickness * 0.6]} />
            <meshStandardMaterial color={frameColor} metalness={0.4} roughness={0.3} />
          </mesh>
        </>
      )}
      <mesh position={[handleX, 0, doorThickness / 2 + 0.01]} castShadow>
        <boxGeometry args={[isSliding ? 0.045 : 0.015, handleLength, isSliding ? 0.015 : 0.02]} />
        <meshStandardMaterial color={accentColor} metalness={0.6} roughness={isSliding ? 0.3 : 0.2} />
      </mesh>
      {!isSliding && (
        <mesh position={[handleX, handleOffset, doorThickness / 2 + 0.015]}>
          <cylinderGeometry args={[0.0095, 0.0095, 0.04, 18]} />
          <meshStandardMaterial color="#1f1f1f" metalness={0.65} roughness={0.25} />
        </mesh>
      )}
      {variant?.startsWith('sliding') && (
        <mesh position={[hingeSide === 'left' ? width / 2 - 0.02 : -width / 2 + 0.02, 0, 0]}>
          <boxGeometry args={[0.01, height * 0.9, doorThickness * 1.1]} />
          <meshStandardMaterial color="#d8d8dd" metalness={0.2} roughness={0.4} />
        </mesh>
      )}
    </group>
  )
}

Door.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  doorThickness: PropTypes.number.isRequired,
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  hingeSide: PropTypes.oneOf(['left', 'right']).isRequired,
  finish: PropTypes.string.isRequired,
  handleOffset: PropTypes.number.isRequired,
  handleLength: PropTypes.number.isRequired,
  variant: PropTypes.string,
}

Door.defaultProps = {
  variant: 'hinged',
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 6, 5]} castShadow intensity={1.2} shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <spotLight position={[-4, 7, 2]} angle={Math.PI / 5} penumbra={0.35} intensity={1.1} castShadow />
      <pointLight position={[0, 3, 6]} intensity={0.45} color="#ffd9b0" />
    </>
  )
}

function createFloorTexture() {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#e7d1a7'
  ctx.fillRect(0, 0, size, size)

  const colors = ['#eedaaf', '#f2dfb9']
  const tile = size / 6
  for (let y = -2; y < 8; y += 1) {
    for (let x = -2; x < 8; x += 1) {
      ctx.save()
      ctx.translate(x * tile + (y % 2 ? tile / 2 : 0), y * (tile / 2))
      ctx.rotate((45 * Math.PI) / 180)
      ctx.fillStyle = colors[(x + y) % colors.length]
      ctx.fillRect(0, 0, tile * 1.2, tile / 1.6)
      ctx.restore()
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 2)
  texture.anisotropy = 8
  return texture
}

function Showroom() {
  const floorTexture = useMemo(() => createFloorTexture(), [])

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial map={floorTexture} roughness={0.8} metalness={0.1} />
      </mesh>
      <mesh position={[0, 2.2, -3]} receiveShadow>
        <planeGeometry args={[12, 5]} />
        <meshStandardMaterial color="#d9dde4" roughness={0.9} metalness={0.05} />
      </mesh>
      <mesh position={[0, 2.6, -6]} receiveShadow>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color="#bfc4cf" roughness={0.92} metalness={0.04} />
      </mesh>
    </group>
  )
}

function CameraRig({ controlsRef, isFrontView, resetKey }) {
  const { camera } = useThree()
  const pressed = useRef(new Set())
  const forward = useRef(new THREE.Vector3())
  const right = useRef(new THREE.Vector3())
  const movement = useRef(new THREE.Vector3())
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), [])

  useEffect(() => {
    if (!controlsRef.current) return
    const target = new THREE.Vector3(0, 1.1, 0)
    const position = isFrontView ? new THREE.Vector3(0, 2.1, 6.2) : new THREE.Vector3(3.3, 2.3, 6.3)
    camera.position.copy(position)
    controlsRef.current.target.copy(target)
    controlsRef.current.update()
  }, [isFrontView, controlsRef, camera])

  useEffect(() => {
    if (!controlsRef.current) return
    camera.position.set(3.3, 2.3, 6.3)
    controlsRef.current.target.set(0, 1.1, 0)
    controlsRef.current.update()
  }, [resetKey, controlsRef, camera])

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase()
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        pressed.current.add(key)
      }
    }

    const handleKeyUp = (event) => {
      const key = event.key.toLowerCase()
      if (pressed.current.has(key)) {
        pressed.current.delete(key)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useFrame((_, delta) => {
    if (!controlsRef.current) return

    camera.getWorldDirection(forward.current)
    forward.current.y = 0
    forward.current.normalize()

    right.current.copy(forward.current).cross(up).normalize().multiplyScalar(-1)

    movement.current.set(0, 0, 0)
    if (pressed.current.has('w') || pressed.current.has('arrowup')) {
      movement.current.add(forward.current)
    }
    if (pressed.current.has('s') || pressed.current.has('arrowdown')) {
      movement.current.addScaledVector(forward.current, -1)
    }
    if (pressed.current.has('a') || pressed.current.has('arrowleft')) {
      movement.current.addScaledVector(right.current, -1)
    }
    if (pressed.current.has('d') || pressed.current.has('arrowright')) {
      movement.current.add(right.current)
    }

    if (movement.current.lengthSq() > 0) {
      movement.current.normalize().multiplyScalar(2.1 * delta)
      camera.position.add(movement.current)
      controlsRef.current.target.add(movement.current)
    }
    controlsRef.current.update()
  })

  return null
}

CameraRig.propTypes = {
  controlsRef: PropTypes.shape({ current: PropTypes.object }),
  isFrontView: PropTypes.bool.isRequired,
  resetKey: PropTypes.number.isRequired,
}

CameraRig.defaultProps = {
  controlsRef: undefined,
}

function SceneLoader() {
  return (
    <Html center>
      <div className="loader">
        <div className="loader__spinner" />
        <span>Načítání scény…</span>
      </div>
    </Html>
  )
}

function MeasurementGuide({ width, height, depth }) {
  const widthMeters = width / 100
  const heightMeters = height / 100
  const depthMeters = depth / 100

  return (
    <group>
      <Html position={[0, heightMeters + 0.1, depthMeters / 2]}>
        <div className="measurement-tag">Výška {height} cm</div>
      </Html>
      <Html position={[0, 0.15, depthMeters / 2 + 0.1]}>
        <div className="measurement-tag">Šířka {width} cm</div>
      </Html>
      <Html position={[widthMeters / 2 + 0.1, 0.4, 0]}>
        <div className="measurement-tag">Hloubka {depth} cm</div>
      </Html>
    </group>
  )
}

MeasurementGuide.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  depth: PropTypes.number.isRequired,
}

export default App
