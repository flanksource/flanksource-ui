import dayjs from "dayjs";

export type Unit = "ms" | "s" | "m" | "h" | "d" | "w" | "M" | "y";
export type UnitsMap = {
  [k in Unit]: {
    weight: number;
    type: "calendar" | "fixed" | "mixed";
    base: number;
  };
};

export const unitsMap: UnitsMap = {
  ms: { weight: 1, type: "fixed", base: 1 },
  s: { weight: 2, type: "fixed", base: 1000 },
  m: { weight: 3, type: "mixed", base: 1000 * 60 },
  h: { weight: 4, type: "mixed", base: 1000 * 60 * 60 },
  d: { weight: 5, type: "mixed", base: 1000 * 60 * 60 * 24 },
  w: { weight: 6, type: "calendar", base: NaN },
  M: { weight: 7, type: "calendar", base: NaN },
  // q: { weight: 8, type: 'calendar' }, // TODO: moment duration does not support quarter
  y: { weight: 9, type: "calendar", base: NaN }
};
export const units: Unit[] = Object.keys(unitsMap).sort(
  (a, b) => unitsMap[b as Unit].weight - unitsMap[a as Unit].weight
) as Unit[];
export const unitsDesc: Unit[] = [...units] as Unit[];
export const unitsAsc: Unit[] = [...units].reverse() as Unit[];

export function parseDateMath(mathString: string, roundUp: boolean) {
  let dateTime = dayjs();
  const len = mathString.length;
  let i = 0;

  while (i < len) {
    const c = mathString.charAt(i++);
    let type;
    let num;
    let unit: Unit;

    if (c === "/") {
      type = 0;
    } else if (c === "+") {
      type = 1;
    } else if (c === "-") {
      type = 2;
    } else {
      continue;
    }

    if (isNaN(mathString.charAt(i) as any)) {
      num = 1;
    } else if (mathString.length === 2) {
      num = mathString.charAt(i);
    } else {
      const numFrom = i;
      while (!isNaN(mathString.charAt(i) as any)) {
        i++;
        if (i >= len) continue;
      }
      num = parseInt(mathString.substring(numFrom, i), 10);
    }

    if (type === 0) {
      // rounding is only allowed on whole, single, units (eg M or 1M, not 0.5M or 2M)
      if (num !== 1) {
        continue;
      }
    }

    unit = mathString.charAt(i++) as Unit;

    // append additional characters in the unit
    for (let j = i; j < len; j++) {
      const unitChar = mathString.charAt(i);
      if (/[a-z]/i.test(unitChar)) {
        unit += unitChar;
        i++;
      } else {
        break;
      }
    }

    if (units.indexOf(unit) === -1) {
      continue;
    } else {
      if (type === 0) {
        if (roundUp) {
          dateTime = dateTime.endOf(unit as any);
        } else {
          dateTime = dateTime.startOf(unit as any);
        }
      } else if (type === 1) {
        dateTime = dateTime.add(num as any, unit);
      } else if (type === 2) {
        dateTime = dateTime.subtract(num as any, unit);
      }
    }
  }
  return dateTime.toISOString();
}
