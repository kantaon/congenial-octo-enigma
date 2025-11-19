# 📐 3D Konfigurátor Vestavěných Skříní

Interaktivní webová aplikace pro navrhování a konfiguraci vestavěných skříní v reálném čase s **3D vizualizací**.

![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat&logo=react)
![Three.js](https://img.shields.io/badge/Three.js-0.180.0-000000?style=flat&logo=three.js)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=flat&logo=vite)

## ✨ Hlavní Funkce

- 🎨 **Interaktivní 3D vizualizace** - Real-time náhled v Three.js
- 📐 **Plně konfigurovatelné rozměry** - Šířka, výška, hloubka
- 🏗️ **Modulární systém** - 9 typů interiérových modulů
- 🚪 **Různé typy dveří** - Posuvné, pantové nebo bez dveří
- 🎨 **Bohatá paleta materiálů** - 12 dekorů (lamino, dýha, vysoký lesk...)
- 🔄 **Undo/Redo** - Historie změn
- 📱 **Responzivní design** - Optimalizováno pro moderní prohlížeče

## 🚀 Rychlý Start

### Instalace

```bash
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

### Preview Produkčního Buildu

```bash
npm run preview
```

## 📚 Dokumentace

Kompletní dokumentaci najdete v souboru **[DOKUMENTACE.md](./DOKUMENTACE.md)**, která obsahuje:

- 📖 Přehled projektu a funkcí
- 🏗️ Architektura aplikace
- 👤 Uživatelská příručka
- 💻 Vývojářská dokumentace
- 📊 Datové modely
- 🔧 API reference

## 🛠️ Technologie

- **React 19.1.1** - UI framework
- **Vite 7.1.7** - Build nástroj
- **Three.js 0.180.0** - 3D grafika
- **React Three Fiber 9.4.0** - React renderer pro Three.js
- **React Three Drei 10.7.6** - Užitečné R3F komponenty

## 📁 Struktura Projektu

```
3D-skrin/
├── src/
│   ├── App.jsx         # Hlavní komponenta
│   ├── App.css         # Styly
│   ├── index.css       # Globální styly
│   └── main.jsx        # Entry point
├── public/             # Statické soubory
├── DOKUMENTACE.md      # Kompletní dokumentace (CZ)
└── README.md           # Tento soubor
```

## 🎯 4 Kroky Konfigurace

1. **Skříň** - Pozice, rozměry, doplňky, dekor
2. **Interiér** - Počet modulů, typy modulů, dekor interiéru
3. **Dveře** - Typ dveří, dekor dveří
4. **Rekapitulace** - Souhrn a odeslání poptávky

## 🎨 Typy Modulů

- 🎽 Ramínko
- 👔 Dvojitá tyč
- 📚 Otevřené police
- 👟 Botník
- 🗄️ Zásuvky
- 🗃️ Komoda
- 💎 Vitrína
- 📦 Boxy
- 🛏️ Ložní prádlo

## 📝 Licence

*Zde doplňte informace o licenci*

## 👨‍💻 Vývoj

Projekt využívá:
- ESLint pro code quality
- PropTypes pro type checking
- Vite HMR pro rychlý development

---

**Pro detailní informace navštivte [DOKUMENTACE.md](./DOKUMENTACE.md)**
