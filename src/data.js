// DSARIUM data: islands, levels, demons, helpers

// Demon king
export const DEMON_KING = {
  id: "anosiliyo",
  name: "Anosiliyo",
};

// Unique General names per island
const GENERALS = {
  primus: { id: "varaxis", name: "Varaxis the Shaper" },
  contigua: { id: "indexar", name: "Indexar the Arranger" },
};

// Lackey name generator
const LACKEYS = [
  "Impli", "Castor", "Bitre", "Lexi", "Floatum", "Trunco", "Boolak", "Truthi", "Nully", "Zerra",
];
let LACKEY_IDX = 0;
const nextLackey = () => ({ id: `lackey-${LACKEY_IDX}`, name: LACKEYS[(LACKEY_IDX++) % LACKEYS.length] });

// Helper to build primitive level
function primitiveLevel(id, title, jackExplain, test) {
  return {
    id,
    title,
    jackExplain,
    test,
    starterCode: `#include <stdio.h>\nint main(){\n  // Read input and print per the problem\n  return 0;\n}\n`,
    lackey: nextLackey(),
  };
}

// Primus Isle (primitive types)
const PRIMUS_LEVELS = [
  primitiveLevel(
    "prim-int",
    "Integer Basics",
    "This level tests reading an integer and printing it doubled.",
    { input: "7\n", expected: "14\n" }
  ),
  primitiveLevel(
    "prim-string",
    "String Basics",
    "Read a word and print it with a pirate prefix 'Ahoy '.",
    { input: "Jack\n", expected: "Ahoy Jack\n" }
  ),
  primitiveLevel(
    "prim-float",
    "Float Basics",
    "Read a float and print it to two decimal places.",
    { input: "3.14159\n", expected: "3.14\n" }
  ),
  primitiveLevel(
    "prim-bool",
    "Boolean Basics",
    "Read 0/1 and print TRUE or FALSE.",
    { input: "1\n", expected: "TRUE\n" }
  ),
  // Boss: combines all
  {
    id: "prim-boss",
    title: "General Varaxis — Primitive Trials",
    jackExplain:
      "Boss fight! Read: an int n, a word s, a float f, and a bool b (0/1). Print: n+1, 'Ahoy ' + s, f rounded to 1 decimal, and 'TRUE'/'FALSE' on separate lines.",
    test: {
      input: "7\nJack\n2.5\n0\n",
      expected: "8\nAhoy Jack\n2.5\nFALSE\n",
    },
    starterCode: `#include <stdio.h>\nint main(){\n  // Read: n, s, f, b; then print per the statement\n  return 0;\n}\n`,
    boss: true,
  },
];

// Contigua Isle (arrays): insert, delete, search, sort, traverse
function arrayLevel(id, title, viz, jackExplain, test) {
  return {
    id,
    title,
    viz,
    jackExplain,
    test,
    starterCode: `#include <stdio.h>\nint main(){\n  // Use arrays in C to perform the operation\n  return 0;\n}\n`,
    lackey: nextLackey(),
  };
}

const CONTIGUA_LEVELS = [
  arrayLevel(
    "arr-insert",
    "Array Insert",
    { viz: { mode: "insert", initial: [2,4,6,8], target: { index: 2, value: 5 } } },
    "Insert value 5 at index 2 in the array [2,4,6,8] and print the new array.",
    { input: "", expected: "2 4 5 6 8\n" }
  ),
  arrayLevel(
    "arr-delete",
    "Array Delete",
    { viz: { mode: "delete", initial: [1,3,5,7,9], target: { index: 3 } } },
    "Delete the element at index 3 from [1,3,5,7,9] and print the new array.",
    { input: "", expected: "1 3 5 9\n" }
  ),
  arrayLevel(
    "arr-search",
    "Array Search",
    { viz: { mode: "search", initial: [4,8,15,16,23,42], target: { value: 23 } } },
    "Search for value 23 in the array and print its index, or -1 if not found.",
    { input: "", expected: "4\n" }
  ),
  arrayLevel(
    "arr-sort",
    "Array Sort",
    { viz: { mode: "sort", initial: [9,1,4,2,8], target: {} } },
    "Sort the array in non-decreasing order and print it.",
    { input: "", expected: "1 2 4 8 9\n" }
  ),
  arrayLevel(
    "arr-traverse",
    "Array Traverse",
    { viz: { mode: "traverse", initial: [10,20,30], target: {} } },
    "Traverse the array [10,20,30] and print all elements in order.",
    { input: "", expected: "10 20 30\n" }
  ),
  // Boss uses all array operations
  {
    id: "arr-boss",
    title: "General Indexar — Array Ordeal",
    jackExplain:
      "Boss fight! Given an array [3,1,4,1,5], insert 9 at end, delete index 1, search value 4 (print index), then sort and print final array.",
    test: { input: "", expected: "2\n1 3 4 5 9\n" },
    starterCode: `#include <stdio.h>\nint main(){\n  // Apply multiple array operations and match expected output format\n  return 0;\n}\n`,
    boss: true,
  },
];

export const ISLANDS = [
  {
    id: "primus",
    name: "Primus Isle",
    topic: "Primitive Types",
    general: GENERALS.primus,
    boss: GENERALS.primus,
    levels: PRIMUS_LEVELS,
  },
  {
    id: "contigua",
    name: "Contigua Isle",
    topic: "Arrays",
    general: GENERALS.contigua,
    boss: GENERALS.contigua,
    levels: CONTIGUA_LEVELS,
  },
];

// Helpers
export function findIslandLevel(islandId, levelId) {
  const island = ISLANDS.find((i) => i.id === islandId);
  if (!island) return null;
  const levelIndex = island.levels.findIndex((l) => l.id === levelId);
  const level = island.levels[levelIndex];
  return { island, level, levelIndex };
}

export function getNextLevelRef(islandId, levelIndex) {
  const island = ISLANDS.find((i) => i.id === islandId);
  if (!island) return null;
  const next = island.levels[levelIndex + 1];
  if (!next) return null;
  return { islandId, levelId: next.id };
}

export function islandStatusLabel(island) {
  const len = island.levels.length;
  return `${island.name} • ${island.topic} • ${len} level${len > 1 ? "s" : ""}`;
}
