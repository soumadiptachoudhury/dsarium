import React from "react";

function Pax({ children, highlight }) {
  return <div className={`pax ${highlight ? "highlight" : ""}`}>{children}</div>;
}

function Deck({ children }) {
  return (
    <div className="viz-ship">
      <div className="viz-sea" />
      <div className="passengers">{children}</div>
      <div className="viz-deck" />
    </div>
  );
}

function modeInsert(initial, target) {
  const arr = [...initial];
  const out = [...arr.slice(0, target.index), target.value, ...arr.slice(target.index)];
  return (
    <Deck>
      {out.map((v, i) => (
        <Pax key={i} highlight={i === target.index}>{v}</Pax>
      ))}
    </Deck>
  );
}

function modeDelete(initial, target) {
  const out = initial.filter((_, i) => i !== target.index);
  return (
    <Deck>
      {initial.map((v, i) => (
        <Pax key={i} highlight={i === target.index}>{v}</Pax>
      ))}
    </Deck>
  );
}

function modeSearch(initial, target) {
  const idx = initial.findIndex((x) => x === target.value);
  return (
    <Deck>
      {initial.map((v, i) => (
        <Pax key={i} highlight={i === idx}>{v}</Pax>
      ))}
    </Deck>
  );
}

function modeSort(initial) {
  const out = [...initial].sort((a, b) => a - b);
  return (
    <Deck>
      {out.map((v, i) => (
        <Pax key={i}>{v}</Pax>
      ))}
    </Deck>
  );
}

function modeTraverse(initial) {
  // Highlight the first element to imply traversal start
  return (
    <Deck>
      {initial.map((v, i) => (
        <Pax key={i} highlight={i === 0}>{v}</Pax>
      ))}
    </Deck>
  );
}

export function ArrayVisualizer({ mode, initial = [], target = {} }) {
  if (mode === "insert") return modeInsert(initial, target);
  if (mode === "delete") return modeDelete(initial, target);
  if (mode === "search") return modeSearch(initial, target);
  if (mode === "sort") return modeSort(initial, target);
  if (mode === "traverse") return modeTraverse(initial);
  return <div className="sub">Unknown visualizer.</div>;
}
