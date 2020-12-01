import React, { useState, useCallback, useRef, useEffect } from "react";
import produce from "immer";
import {
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css'
import SeedList from "./components/SeedList";

const numRows = 50;
const numCols = 50;

const neighborsMap = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }
  return rows;
}


const App = () => {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(
        Array.from(Array(numCols), () => (Math.random() > 0.8 ? 1 : 0))
      );
    }

    return rows;
  });
  const [generation, setGeneration] = useState(0)
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(50)
  const [savedSeeds,setSavedSeeds] = useState([])


  const runningRef = useRef();
  runningRef.current = running;

  const saveSeed = useCallback((currentGrid) => {
    let saves = window.localStorage.getItem('saves')
    if (saves) {
      saves = JSON.parse(saves)
      saves = [...saves,currentGrid]
    } else {
      saves = [currentGrid]
    }
    window.localStorage.setItem('saves',JSON.stringify(saves))
    setSavedSeeds(saves)
  },[])
 

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid(grid => {
      return produce(grid, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {

            let neighbors = 0;

            neighborsMap.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;

              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += grid[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (grid[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      })
    
    });

    setGeneration((prev) => prev + 1)
    setTimeout(runSimulation, speed);
  }, [speed]);

  useEffect(() => {
    const seeds = window.localStorage.getItem('saves')
    if (seeds) {
      setSavedSeeds(JSON.parse(seeds))
    }
    
  }, [])

  return (
    <>
      <div className='buttons'>
        <button
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}
        >
          {running ? "stop" : "start"}
        </button>
        <button
          onClick={() => {
            const rows = [];
            for (let i = 0; i < numRows; i++) {
              rows.push(
                Array.from(Array(numCols), () => (Math.random() > 0.8 ? 1 : 0))
              );
            }
            setGeneration(0)
            setGrid(rows);
          }}
        >
          random
      </button>
        <button
          onClick={() => {
            setSpeed((prev) => {
              setRunning(false)
              if (prev < 100) {
                return 950
              }
              return prev - 100
            });
          }}
        >
          Speed
      </button>
      <button
          onClick={() => {
            saveSeed(grid)
          }}
        >
          save seed
      </button>
      <button
          onClick={() => {
           window.localStorage.clear()
           setSavedSeeds([])
          }}
        >
          clear seeds
      </button>
        <button
          onClick={() => {
            setRunning(false)
            setGeneration(0)
            setGrid(generateEmptyGrid())
          }}
        >
          clear
      </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            margin: 'auto',
            display: "grid",
            gridTemplateColumns: `repeat(${numCols}, 7px)`
          }}
        >
          {grid.map((rows, i) =>
            rows.map((col, k) => (
              <div
                key={`${i}-${k}`}
                onClick={() => {
                  const newGrid = produce(grid, gridCopy => {
                    gridCopy[i][k] = grid[i][k] ? 0 : 1;
                  });
                  setGrid(newGrid);
                }}
                style={{
                  cursor : 'pointer',
                  width: 6,
                  height: 6,
                  backgroundColor: grid[i][k] ? "black" : undefined,
                  border: "solid 1px black"
                }}
              />
            ))
          )}
        </div>
        <p style={{ textAlign: 'center' }}>Speed: {1000 - speed}</p>
        <p style={{ textAlign: 'center' }}>Generation: {generation}</p>
      </div>
      <Route path={'/'}>
        <SeedList savedSeeds={savedSeeds} />
      </Route>
    </>
  );
};

export default App