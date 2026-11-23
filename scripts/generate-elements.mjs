import { readFileSync, writeFileSync } from "node:fs";

const raw = JSON.parse(readFileSync("src/data/pubchem.json", "utf8"));

const columns = raw.Table.Columns.Column;
const rows = raw.Table.Row;

// Gruppenpositionen der Haupttabelle.
// null = ausgelagerte Lanthanoide/Actinoide.
const periods = [
  [1, 18],
  [1, 2, 13, 14, 15, 16, 17, 18],
  [1, 2, 13, 14, 15, 16, 17, 18],
  Array.from({ length: 18 }, (_, i) => i + 1),
  Array.from({ length: 18 }, (_, i) => i + 1),
  [1, 2, null, ...Array.from({ length: 15 }, (_, i) => i + 4)],
  [1, 2, null, ...Array.from({ length: 15 }, (_, i) => i + 4)],
];

function getPosition(number) {
  if (number >= 57 && number <= 71) {
    return { period: 6, group: null };
  }

  if (number >= 89 && number <= 103) {
    return { period: 7, group: null };
  }

  const positions = [
    [1, 18],
    [1, 2, 13, 14, 15, 16, 17, 18],
    [1, 2, 13, 14, 15, 16, 17, 18],
    Array.from({ length: 18 }, (_, i) => i + 1),
    Array.from({ length: 18 }, (_, i) => i + 1),
  ];

  if (number <= 54) {
    let index = 0;

    for (let period = 1; period <= 5; period++) {
      for (const group of positions[period - 1]) {
        index++;

        if (index === number) {
          return { period, group };
        }
      }
    }
  }

  // Period 6: Cs, Ba, then Hf through Rn
  if (number === 55) return { period: 6, group: 1 };
  if (number === 56) return { period: 6, group: 2 };

  if (number >= 72 && number <= 86) {
    return { period: 6, group: number - 68 };
  }

  // Period 7: Fr, Ra, then Rf through Og
  if (number === 87) return { period: 7, group: 1 };
  if (number === 88) return { period: 7, group: 2 };

  if (number >= 104 && number <= 118) {
    return { period: 7, group: number - 100 };
  }

  throw new Error(`Invalid atomic number: ${number}`);
}

const categoryMap = {
  "Alkali metal": "alkali",
  "Alkaline earth metal": "alkaline-earth",
  "Transition metal": "transition",
  "Post-transition metal": "post-transition",
  Metalloid: "metalloid",
  Nonmetal: "nonmetal",
  Halogen: "halogen",
  "Noble gas": "noble-gas",
  Lanthanide: "lanthanide",
  Actinide: "actinide",
};

function getCategory(number, groupBlock) {
  if (number >= 57 && number <= 71) {
    return "lanthanide";
  }

  if (number >= 89 && number <= 103) {
    return "actinide";
  }

  const category = categoryMap[groupBlock];

  if (!category) {
    throw new Error(`Unnamed group: ${groupBlock}`);
  }

  return category;
}

function optionalNumber(value) {
  if (value === null || value === undefined || String(value).trim() === "") {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

function optionalString(value) {
  const text = String(value ?? "").trim();
  return text || null;
}

function kelvinToCelsius(value) {
  const kelvin = optionalNumber(value);

  if (kelvin === null) return null;

  return Math.round((kelvin - 273.15) * 100) / 100;
}

const elements = rows.map((row) => {
  const source = Object.fromEntries(
    columns.map((column, index) => [column, row.Cell[index]]),
  );

  const number = Number(source.AtomicNumber);
  const position = getPosition(number);

  return {
    number,
    symbol: source.Symbol,
    name: source.Name,
    mass: optionalString(source.AtomicWeight),
    ...position,
    category: getCategory(number, source.GroupBlock),
    electronAffinity: optionalNumber(source.ElectronAffinity),
    electronegativity: optionalNumber(source.Electronegativity),
    meltingPoint: kelvinToCelsius(source.MeltingPoint),
    boilingPoint: kelvinToCelsius(source.BoilingPoint),
    electronConfiguration: optionalString(source.ElectronConfiguration),
    oxidationStates: optionalString(source.OxidationStates),
    atomicRadius: optionalNumber(source.AtomicRadius),
    ionizationEnergy: optionalNumber(source.IonizationEnergy),
  };
});

// Validierung
if (elements.length !== 118) {
  throw new Error(`Expected: 118 Elements, recieved: ${elements.length}`);
}

const numbers = new Set(elements.map((e) => e.number));

for (let number = 1; number <= 118; number++) {
  if (!numbers.has(number)) {
    throw new Error(`Element ${number} missing.`);
  }
}

for (const element of elements) {
  if (
    !element.name ||
    !element.symbol ||
    !element.category ||
    !Number.isInteger(element.period) ||
    element.period < 1 ||
    element.period > 7 ||
    (element.group !== null &&
      (!Number.isInteger(element.group) ||
        element.group < 1 ||
        element.group > 18))
  ) {
    throw new Error(`Invalid data for Element ${element.number}`);
  }
}

elements.sort((a, b) => a.number - b.number);

writeFileSync(
  "src/data/elements.json",
  JSON.stringify(elements, null, 2) + "\n",
  "utf8",
);

console.log(`Successful: ${elements.length} Elemente converted.`);
