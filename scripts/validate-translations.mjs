import { readFileSync } from "node:fs";

const elements = JSON.parse(readFileSync("src/data/elements.json", "utf8"));

const de = JSON.parse(readFileSync("src/i18n/de.json", "utf8"));

const en = JSON.parse(readFileSync("src/i18n/en.json", "utf8"));

const errors = [];

if (elements.length !== 118) {
  errors.push(`Expected 118 elements, found ${elements.length}.`);
}

for (const element of elements) {
  if (!de.elements[element.symbol]) {
    errors.push(`Missing German translation: ${element.symbol}`);
  }
}

for (const section of ["properties", "categories", "ui"]) {
  for (const key of Object.keys(en[section])) {
    if (!de[section]?.[key]) {
      errors.push(`Missing German translation: ${section}.${key}`);
    }
  }
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`[PSE] ${error}`);
  }

  process.exitCode = 1;
} else {
  console.log(
    `[PSE] Translation validation passed (${elements.length} elements).`,
  );
}
