import React, { useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react';
import Board from './components/Board';
import StatsPanel from './components/StatsPanel';
import MenuScreen from './components/MenuScreen';
import LevelSelect from './components/LevelSelect';
import StoryScreen from './components/StoryScreen';
import TutorialScreen from './components/TutorialScreen';
import CreditsScreen from './components/CreditsScreen';
import ResultModal from './components/ResultModal';
import { gameReducer, initialState } from './game/gameReducer';
import { ACTIONS, TEAMS, GAME_STATUS, MAX_LEVEL } from './game/constants';
import { getLevel } from './game/levels';
import { planUnitAction, getAIOrder } from './game/aiLogic';
import { getUnitAtPosition, getValidMoves, getValidTargets, isUnitExhausted } from './game/gameLogic';
import {
  saveGame,
  loadGame,
  hasSavedGame,
  deleteSave,
  saveProgress,
  loadProgress,
  resetProgress,
} from './utils/saveGame';
import { sfx } from './utils/soundEffects';
import './App.css';

const SCREENS = {
  MENU: 'MENU',
  TUTORIAL: 'TUTORIAL',
  CREDITS: 'CREDITS',
  LEVEL_SELECT: 'LEVEL_SELECT',
  STORY: 'STORY',
  GAME: 'GAME',
};

const STAGE_W = 960;
const STAGE_H = 600;

const rolls = () => [Math.random(), Math.random()];

// Khung "sân khấu" kích thước cố định, tự co giãn vừa cửa sổ/iframe
const Stage = ({ children }) => {
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  return (
    <div className="stage-outer">
      <div className="stage" style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
};

function App() {
  const [screen, setScreen] = useState(SCREENS.MENU);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [progress, setProgress] = useState(loadProgress);
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [soundEnabled, setSoundEnabled] = useState(sfx.enabled);
  const [hoverCell, setHoverCell] = useState(null);
  const [effects, setEffects] = useState([]);
  const [banner, setBanner] = useState(null);
  const [result, setResult] = useState(null);

  const stateRef = useRef(state);
  stateRef.current = state;

  const inGame = screen === SCREENS.GAME;
  const isPlaying = state.gameStatus === GAME_STATUS.PLAYING;
  const canAct = inGame && isPlaying && state.currentTurn === TEAMS.PLAYER && !result;

  // ----------------------------------------
  // Tự lưu đầu mỗi lượt của người chơi
  // ----------------------------------------
  useEffect(() => {
    if (inGame && isPlaying && state.currentTurn === TEAMS.PLAYER) saveGame(state);
  }, [inGame, isPlaying, state]);

  // ----------------------------------------
  // Banner chuyển lượt + âm thanh
  // ----------------------------------------
  useEffect(() => {
    if (!inGame || !isPlaying) return undefined;
    const isPlayer = state.currentTurn === TEAMS.PLAYER;
    setBanner({ text: isPlayer ? `LƯỢT ${state.turnNumber} · PHE TA` : 'LƯỢT CỦA ĐỊCH', team: state.currentTurn, key: Date.now() });
    if (isPlayer) sfx.turnStart();
    else sfx.enemyTurn();
    const t = setTimeout(() => setBanner(null), 1100);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inGame, state.currentTurn, state.battleId]);

  // ----------------------------------------
  // Hiệu ứng nổ / số sát thương
  // ----------------------------------------
  useEffect(() => {
    const ev = state.lastEvent;
    if (!ev || ev.kind !== 'attack') return undefined;
    setEffects((list) => [...list, ev]);
    if (ev.dodged) sfx.dodge();
    else if (ev.knockedOut) {
      sfx.hit();
      setTimeout(() => sfx.knockout(), 150);
    } else sfx.hit();
    const t = setTimeout(() => setEffects((list) => list.filter((e) => e.seq !== ev.seq)), 950);
    return () => clearTimeout(t);
  }, [state.lastEvent]);

  // Xoá hiệu ứng khi đổi trận
  useEffect(() => {
    setEffects([]);
    setResult(null);
    setHoverCell(null);
  }, [state.battleId]);

  // ----------------------------------------
  // AI — chạy tuần tự từng quái, đọc trạng thái MỚI NHẤT, huỷ được
  // ----------------------------------------
  useEffect(() => {
    if (!inGame || state.currentTurn !== TEAMS.ENEMY || state.gameStatus !== GAME_STATUS.PLAYING) return undefined;

    let cancelled = false;
    const timers = [];
    const wait = (ms) => new Promise((resolve) => timers.push(setTimeout(resolve, ms)));

    (async () => {
      await wait(1150);
      for (const id of getAIOrder(stateRef.current.units)) {
        if (cancelled) return;
        const s = stateRef.current;
        if (s.gameStatus !== GAME_STATUS.PLAYING) return;
        const unit = s.units.find((u) => u.id === id);
        if (!unit || unit.hp <= 0) continue;

        const plan = planUnitAction(unit, s.units, s.map);
        if (!plan) continue;

        dispatch({ type: ACTIONS.SELECT_UNIT, unitId: id, force: true });
        await wait(220);
        if (cancelled) return;

        if (plan.move) {
          sfx.move();
          dispatch({ type: ACTIONS.MOVE_UNIT, unitId: id, position: plan.move });
          await wait(420);
          if (cancelled) return;
        }
        if (plan.targetId) {
          sfx.attack();
          dispatch({ type: ACTIONS.ATTACK_UNIT, unitId: id, targetId: plan.targetId, rolls: rolls() });
          await wait(750);
        } else {
          dispatch({ type: ACTIONS.WAIT_UNIT, unitId: id });
          await wait(120);
        }
      }
      if (!cancelled) dispatch({ type: ACTIONS.END_TURN, expectedTurn: TEAMS.ENEMY });
    })();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [inGame, state.currentTurn, state.gameStatus, state.battleId]);

  // ----------------------------------------
  // Kết thúc trận
  // ----------------------------------------
  useEffect(() => {
    if (!inGame || state.gameStatus === GAME_STATUS.PLAYING) return undefined;
    const win = state.gameStatus === GAME_STATUS.PLAYER_WIN;
    deleteSave();

    const players = state.units.filter((u) => u.team === TEAMS.PLAYER);
    const survivors = players.filter((u) => u.hp > 0).length;
    const enemiesDown = state.units.filter((u) => u.team === TEAMS.ENEMY && u.hp <= 0).length;
    const par = getLevel(state.level).par;
    const stars = win ? 1 + (state.turnNumber <= par ? 1 : 0) + (survivors === players.length ? 1 : 0) : 0;

    if (win) {
      setProgress((prev) => {
        const next = {
          completed: prev.completed.includes(state.level) ? prev.completed : [...prev.completed, state.level],
          stars: { ...prev.stars, [state.level]: Math.max(prev.stars[state.level] || 0, stars) },
        };
        saveProgress(next);
        return next;
      });
    }

    const t = setTimeout(() => {
      if (win) sfx.victory();
      else sfx.defeat();
      setResult({ win, stars, turns: state.turnNumber, survivors, total: players.length, enemiesDown, par });
    }, 1300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inGame, state.gameStatus, state.battleId]);

  // ----------------------------------------
  // HANDLERS
  // ----------------------------------------
  const go = (s) => {
    sfx.click();
    setScreen(s);
  };

  const startLevel = (level) => {
    setCurrentLevel(level);
    dispatch({ type: ACTIONS.RESET_GAME, level });
    setScreen(SCREENS.GAME);
  };

  const handleSelectLevel = (level) => {
    sfx.click();
    setCurrentLevel(level);
    setScreen(SCREENS.STORY);
  };

  const handleContinue = () => {
    const saved = loadGame();
    if (!saved) return;
    sfx.click();
    setCurrentLevel(saved.level || 1);
    dispatch({ type: ACTIONS.RESTORE_GAME, gameState: saved });
    setScreen(SCREENS.GAME);
  };

  const handleCellClick = useCallback(
    (x, y) => {
      const s = stateRef.current;
      if (!canAct) return;
      const selected = s.units.find((u) => u.id === s.selectedId);
      const unit = getUnitAtPosition(x, y, s.units);

      if (unit) {
        if (selected && unit.team !== selected.team) {
          if (getValidTargets(selected, s.units, s.map).some((t) => t.id === unit.id)) {
            sfx.attack();
            dispatch({ type: ACTIONS.ATTACK_UNIT, unitId: selected.id, targetId: unit.id, rolls: rolls() });
          }
          return;
        }
        if (unit.team === TEAMS.PLAYER && !unit.done) {
          sfx.select();
          dispatch({ type: ACTIONS.SELECT_UNIT, unitId: unit.id });
          return;
        }
        dispatch({ type: ACTIONS.DESELECT });
        return;
      }

      if (selected && getValidMoves(selected, s.units, s.map).some((m) => m.x === x && m.y === y)) {
        sfx.move();
        dispatch({ type: ACTIONS.MOVE_UNIT, unitId: selected.id, position: { x, y } });
        return;
      }
      dispatch({ type: ACTIONS.DESELECT });
    },
    [canAct],
  );

  const handleEndTurn = useCallback(() => {
    if (!canAct) return;
    sfx.click();
    dispatch({ type: ACTIONS.END_TURN, expectedTurn: TEAMS.PLAYER });
  }, [canAct]);

  const handleWait = () => {
    if (!canAct) return;
    sfx.click();
    dispatch({ type: ACTIONS.WAIT_UNIT });
  };

  const handleRetry = () => {
    sfx.click();
    dispatch({ type: ACTIONS.RESET_GAME, level: currentLevel });
  };

  const handleNext = () => {
    sfx.click();
    setResult(null);
    if (currentLevel < MAX_LEVEL) {
      setCurrentLevel(currentLevel + 1);
      setScreen(SCREENS.STORY);
    } else setScreen(SCREENS.CREDITS);
  };

  const handleToMap = () => {
    setResult(null);
    go(SCREENS.LEVEL_SELECT);
  };

  const toggleSound = () => setSoundEnabled(sfx.toggle());

  // Phím tắt
  useEffect(() => {
    if (!inGame) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') dispatch({ type: ACTIONS.DESELECT });
      if (e.code === 'Space') {
        e.preventDefault();
        handleEndTurn();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [inGame, handleEndTurn]);

  // ----------------------------------------
  // RENDER
  // ----------------------------------------
  let content;
  if (screen === SCREENS.MENU) {
    content = (
      <MenuScreen
        onStartGame={() => go(SCREENS.LEVEL_SELECT)}
        onContinue={hasSavedGame() ? handleContinue : null}
        onTutorial={() => go(SCREENS.TUTORIAL)}
        onCredits={() => go(SCREENS.CREDITS)}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />
    );
  } else if (screen === SCREENS.TUTORIAL) {
    content = <TutorialScreen onClose={() => go(SCREENS.MENU)} />;
  } else if (screen === SCREENS.CREDITS) {
    content = (
      <CreditsScreen
        onClose={() => go(SCREENS.MENU)}
        onResetProgress={() => {
          if (window.confirm('Xoá toàn bộ tiến trình chiến dịch?')) {
            resetProgress();
            setProgress(loadProgress());
          }
        }}
      />
    );
  } else if (screen === SCREENS.LEVEL_SELECT) {
    content = <LevelSelect onSelectLevel={handleSelectLevel} onBack={() => go(SCREENS.MENU)} progress={progress} />;
  } else if (screen === SCREENS.STORY) {
    content = (
      <StoryScreen
        levelId={currentLevel}
        onComplete={() => {
          sfx.click();
          startLevel(currentLevel);
        }}
        onBack={() => go(SCREENS.LEVEL_SELECT)}
      />
    );
  } else {
    const level = getLevel(state.level);
    const allSpent =
      canAct &&
      state.units
        .filter((u) => u.team === TEAMS.PLAYER && u.hp > 0)
        .every((u) => isUnitExhausted(u, state.units, state.map));

    content = (
      <div className="screen game-screen" onContextMenu={(e) => { e.preventDefault(); dispatch({ type: ACTIONS.DESELECT }); }}>
        <div className="topbar">
          <button className="btn btn-small" onClick={() => go(SCREENS.LEVEL_SELECT)}>◂ Bản đồ</button>
          <div className="topbar-title">
            NHIỆM VỤ {state.level}: {level.name.toUpperCase()}
          </div>
          <div className="topbar-right">
            <span className="turn-chip">LƯỢT {state.turnNumber}</span>
            <button className="btn btn-small" onClick={handleRetry}>Chơi lại</button>
            <button className="btn btn-small btn-icon" onClick={toggleSound} title="Âm thanh">
              {soundEnabled ? '♪' : '×'}
            </button>
          </div>
        </div>

        <div className="game-body">
          <div className="board-wrap">
            <Board
              state={state}
              hoverCell={hoverCell}
              onHover={setHoverCell}
              onCellClick={handleCellClick}
              interactive={canAct}
              effects={effects}
            />
            {banner && (
              <div key={banner.key} className={`turn-banner ${banner.team === TEAMS.PLAYER ? 'p' : 'e'}`}>
                <span>{banner.text}</span>
              </div>
            )}
          </div>

          <StatsPanel
            state={state}
            hoverCell={hoverCell}
            onWait={handleWait}
            onEndTurn={handleEndTurn}
            canAct={canAct}
            aiThinking={inGame && isPlaying && state.currentTurn === TEAMS.ENEMY}
            allSpent={allSpent}
          />
        </div>

        {result && (
          <ResultModal
            result={result}
            level={state.level}
            onNext={handleNext}
            onRetry={handleRetry}
            onMap={handleToMap}
            onCredits={handleNext}
          />
        )}
      </div>
    );
  }

  return <Stage>{content}</Stage>;
}

export default App;
