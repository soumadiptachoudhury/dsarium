import React, { useMemo, useState } from "react";

import { ISLANDS, findIslandLevel, getNextLevelRef, islandStatusLabel } from "./data.js";
import { ArrayVisualizer } from "./visualizers.jsx";

function Brand() {
  return <div className="brand">DSARIUM ▸ Retro Pirate DSA</div>;
}

function Intro({ onStart, username }) {
  return (
    <div className="intro">
      <Brand />
      <div className="intro-hero">
        <h1>Welcome to DSARIUM</h1>
        <p>Gamify your journey through Data Structures & Algorithms.</p>
      </div>
      <div className="intro-body">
        <div className="intro-panel card">
          <div className="jack-avatar" />
          <div className="dialog">
            <p>
              Ahoy, {username || "Sailor"}! I be Jack, your trusty pirate guide. The seas be cursed by the demon king
              Anosiliyo, and each island—home to a data structure—be seized by his generals. Clear the islands by
              solving coding challenges, slay the lackeys, and defeat each general. When all waters be freed, we sail to
              the dark castle and face the demon king himself!
            </p>
          </div>
        </div>
      </div>
      <div className="intro-actions">
        <button className="btn accent" onClick={onStart}>Sail to the Map</button>
      </div>
    </div>
  );
}

function MapIsland({ island, cleared, unlocked, onEnter }) {
  const cls = cleared ? "island cleared" : unlocked ? "island unlocked" : "island locked";
  return (
    <div className={`${cls} card`} onClick={() => unlocked && onEnter(island.id)} style={{ cursor: unlocked ? "pointer" : "not-allowed" }}>
      <div className="name">{island.name}</div>
      <div className="status">{islandStatusLabel(island)}</div>
      {island.boss && <div className="boss-badge">General {island.boss.name}</div>}
    </div>
  );
}

function Map({ progress, onEnterIsland }) {
  return (
    <div className="map">
      <Brand />
      <div className="sea">
        <div className="island-row">
          {ISLANDS.map((isl, idx) => {
            const cleared = progress.clearedIslands.has(isl.id);
            const unlocked = idx === 0 || progress.clearedIslands.has(ISLANDS[idx - 1].id);
            return (
              <MapIsland key={isl.id} island={isl} cleared={cleared} unlocked={unlocked} onEnter={onEnterIsland} />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Lives({ lives }) {
  return (
    <div className="lives">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className={`life ${i < lives ? "active" : ""}`} />
      ))}
    </div>
  );
}

function JackBox({ title, text }) {
  return (
    <div className="jack-box">
      <div className="jack-mini" />
      <div className="dialog">
        {title && <div style={{ color: "var(--accent)", marginBottom: 6 }}>{title}</div>}
        <div>{text}</div>
      </div>
    </div>
  );
}

function Visualizer({ islandId, levelId, config }) {
  if (islandId === "contigua" && config?.viz) {
    return <ArrayVisualizer mode={config.viz.mode} initial={config.viz.initial} target={config.viz.target} />;
  }
  return <div className="sub">No visualizer for this level.</div>;
}

function Level({ user, island, level, onResult, onLoseLife, lives }) {
  const [code, setCode] = useState(level.starterCode || "/* Write C code only */\n#include <stdio.h>\nint main(){\n  // Your code here\n  return 0;\n}\n");
  const [userInput, setUserInput] = useState(level.test.input);
  const [userOutput, setUserOutput] = useState("");
  const [runMsg, setRunMsg] = useState("");

  const run = () => {
    // Stub runner: compare userOutput to expected output exactly (trimmed)
    const expected = (level.test.expected || "").trim();
    const actual = (userOutput || "").trim();
    if (actual === expected) {
      setRunMsg("Correct! Lackey defeated.");
      onResult(true);
    } else {
      setRunMsg("Wrong output. You lost a life.");
      onLoseLife();
    }
  };

  return (
    <div className="level">
      <div className="level-top row">
        <Brand />
        <div style={{ flex: 1 }} />
        <Lives lives={lives} />
      </div>
      <div className="level-grid">
        <div className="pane card">
          <h3>Jack's Brief</h3>
          <div className="sub">Island: {island.name} • Level: {level.title}</div>
          <JackBox title={`About ${island.topic}`} text={level.jackExplain} />
          <div style={{ height: 8 }} />
          {level.viz && (
            <>
              <h3>Visualizer</h3>
              <Visualizer islandId={island.id} levelId={level.id} config={level} />
            </>
          )}
          <div style={{ height: 8 }} />
          <h3>Samples</h3>
          <div className="io-grid">
            <div>
              <div className="sub">Test Input</div>
              <textarea value={userInput} onChange={(e) => setUserInput(e.target.value)} rows={6} />
            </div>
            <div>
              <div className="sub">Expected Output</div>
              <pre className="output">{level.test.expected}</pre>
            </div>
          </div>
        </div>
        <div className="pane card">
          <h3>Code in C only</h3>
          <div className="sub">Write your solution below, then paste your program output (for the provided test input) and click Run.</div>
          <textarea className="code-editor" value={code} onChange={(e) => setCode(e.target.value)} />
          <div className="row">
            <button className="btn primary" onClick={run}>Run</button>
            <div className="sub">Runner is simulated. We'll add a real C runner later.</div>
          </div>
          <div className="io-grid" style={{ marginTop: 8 }}>
            <div>
              <div className="sub">Program Output (paste here)</div>
              <textarea rows={6} value={userOutput} onChange={(e) => setUserOutput(e.target.value)} />
            </div>
            <div>
              <div className="sub">Run Result</div>
              <pre className="output">{runMsg}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("intro"); // intro | map | level
  const [username] = useState("Captain"); // stubbed test user
  const [progress, setProgress] = useState({
    clearedIslands: new Set(),
    islandLevels: {}, // { [islandId]: { levelIdx: number, lives: number } }
  });
  const [currentRef, setCurrentRef] = useState(null); // { islandId, levelId }

  const enterMap = () => setScreen("map");

  const enterIsland = (islandId) => {
    const island = ISLANDS.find((i) => i.id === islandId);
    const first = island.levels[0];
    setProgress((p) => ({
      ...p,
      islandLevels: {
        ...p.islandLevels,
        [islandId]: p.islandLevels[islandId] || { levelIdx: 0, lives: 5 },
      },
    }));
    setCurrentRef({ islandId, levelId: first.id });
    setScreen("level");
  };

  const stateFor = (islandId) => progress.islandLevels[islandId] || { levelIdx: 0, lives: 5 };

  const current = useMemo(() => {
    if (!currentRef) return null;
    return findIslandLevel(currentRef.islandId, currentRef.levelId);
  }, [currentRef]);

  const onLoseLife = () => {
    if (!current) return;
    const { island } = current;
    setProgress((p) => {
      const s = stateFor(island.id);
      const lives = Math.max(0, (s.lives ?? 5) - 1);
      let next = { ...p.islandLevels, [island.id]: { ...s, lives } };
      // If lives exhausted, reset to first level
      if (lives === 0) {
        next[island.id] = { levelIdx: 0, lives: 5 };
        setCurrentRef({ islandId: island.id, levelId: island.levels[0].id });
      }
      return { ...p, islandLevels: next };
    });
  };

  const onResult = (ok) => {
    if (!current) return;
    const { island, levelIndex } = current;
    if (!ok) return;
    // advance level
    const nextRef = getNextLevelRef(island.id, levelIndex);
    setProgress((p) => {
      const s = stateFor(island.id);
      if (nextRef) {
        return { ...p, islandLevels: { ...p.islandLevels, [island.id]: { levelIdx: levelIndex + 1, lives: 5 } } };
      }
      // island cleared
      const newSet = new Set(p.clearedIslands);
      newSet.add(island.id);
      return { ...p, clearedIslands: newSet };
    });

    if (nextRef) {
      setCurrentRef(nextRef);
    } else {
      // show map and congrats
      alert(`Well done! ${island.name} is liberated.`);
      setScreen("map");
    }
  };

  if (screen === "intro") {
    return <Intro username={username} onStart={enterMap} />;
  }

  if (screen === "map") {
    return <Map progress={progress} onEnterIsland={enterIsland} />;
  }

  if (screen === "level" && current) {
    const { island, level, levelIndex } = current;
    const lives = stateFor(island.id).lives ?? 5;
    const boss = levelIndex === island.levels.length - 1;
    return (
      <Level
        user={username}
        island={island}
        level={level}
        boss={boss}
        lives={lives}
        onLoseLife={onLoseLife}
        onResult={onResult}
      />
    );
  }

  return <div className="center">Loading...</div>;
}

