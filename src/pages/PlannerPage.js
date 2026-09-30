import React, { useState, useEffect } from 'react';
import Graph from '../components/Graph';
import { useGraph } from '../context/GraphContext';
// Updated imports
import { runDijkstra } from '../utils/algorithms/dijkstra';
import { runPrims } from '../utils/algorithms/prims';
import { runKruskals } from '../utils/algorithms/kruskals';

const PlannerPage = () => {
  const { nodes, edges } = useGraph();
  const [algoType, setAlgoType] = useState('shortestPath');
  const [mstAlgo, setMstAlgo] = useState('prims');
  const [startNodeId, setStartNodeId] = useState('');
  const [endNodeId, setEndNodeId] = useState('');
  const [shortestPathMetric, setShortestPathMetric] = useState('distance');
  const [cheapestNetworkMetric, setCheapestNetworkMetric] = useState('cost');

  const [results, setResults] = useState(null);
  const [visualizationSteps, setVisualizationSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (visualizationSteps.length > 0 && currentStep < visualizationSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [currentStep, visualizationSteps]);

  const handleRunAlgorithm = () => {
    setResults(null);
    setCurrentStep(0);
    let algoResult;
    let finalPath = [];
    let finalMst = [];

    if (algoType === 'shortestPath') {
      if (!startNodeId || !endNodeId) return;
      algoResult = runDijkstra(nodes, edges, startNodeId, endNodeId, shortestPathMetric);
      finalPath = algoResult.path;
      setResults({ type: 'shortestPath', algo: 'dijkstra', data: algoResult, finalPath });
    } else if (algoType === 'cheapestNetwork') {
      if (nodes.length === 0) return;
      if (mstAlgo === 'prims') {
        algoResult = runPrims(nodes, edges, cheapestNetworkMetric);
      } else if (mstAlgo === 'kruskals') {
        algoResult = runKruskals(nodes, edges, cheapestNetworkMetric);
      }
      finalMst = algoResult.tree;
      setResults({ type: 'mst', algo: mstAlgo, data: algoResult, finalMst });
    }
    setVisualizationSteps(algoResult.steps || []);
  };

  const currentVizState = visualizationSteps[currentStep] || {};

  const graphPath = results?.type === 'shortestPath' && currentVizState.final ? results.finalPath : [];
  const graphMstEdges = results?.type === 'mst' && currentVizState.final ? results.finalMst : [];

  return (
    <div className="page planner-page">
      <h1 className="page-title">Travel Planner</h1>
      <div className="content-container">
        <aside className="forms-panel">
          <section className="form-section">
            <h2>Select Goal</h2>
            <select
              className="select-goal"
              value={algoType}
              onChange={(e) => {
                setAlgoType(e.target.value);
                setResults(null);
                setVisualizationSteps([]);
              }}
            >
              <option value="shortestPath">Shortest Path</option>
              <option value="cheapestNetwork">Cheapest Network</option>
            </select>
          </section>

          {algoType === 'shortestPath' && (
            <section className="form-section">
              <h2>Shortest Path Options</h2>
              <p className="note">Algorithm: **Dijkstra's** (weighted)</p>
              <select value={startNodeId} onChange={(e) => setStartNodeId(e.target.value)}>
                <option value="">Start City</option>
                {nodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.label}
                  </option>
                ))}
              </select>
              <select value={endNodeId} onChange={(e) => setEndNodeId(e.target.value)}>
                <option value="">End City</option>
                {nodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.label}
                  </option>
                ))}
              </select>
              <select value={shortestPathMetric} onChange={(e) => setShortestPathMetric(e.target.value)}>
                <option value="distance">By Distance</option>
                <option value="cost">By Cost</option>
              </select>
              <button onClick={handleRunAlgorithm} className="button primary-button">
                Find Path
              </button>
            </section>
          )}

          {algoType === 'cheapestNetwork' && (
            <section className="form-section">
              <h2>Cheapest Network Options</h2>
              <select value={mstAlgo} onChange={(e) => setMstAlgo(e.target.value)}>
                <option value="prims">Prim's</option>
                <option value="kruskals">Kruskal's</option>
              </select>
              <select value={cheapestNetworkMetric} onChange={(e) => setCheapestNetworkMetric(e.target.value)}>
                <option value="distance">By Distance</option>
                <option value="cost">By Cost</option>
              </select>
              <button onClick={handleRunAlgorithm} className="button primary-button">
                Find Network
              </button>
            </section>
          )}
          <section className="output-section">
            <h2>Results</h2>
            {results && (
              <>
                {results.type === 'shortestPath' && results.data.path ? (
                  <>
                    <h3 className="result-title">Dijkstra's Path</h3>
                    <p>
                      Path: **{results.data.path.map((id) => nodes.find((n) => n.id === id)?.label).join(' → ')}**
                    </p>
                    <p>
                      Total {shortestPathMetric}: **{results.data.distance} {shortestPathMetric === 'distance' ? 'km' : '₹'}**
                    </p>
                  </>
                ) : (
                  <p>No path found.</p>
                )}
                {results.type === 'mst' && (
                  <>
                    <h3 className="result-title">Cheapest Network ({mstAlgo.toUpperCase()})</h3>
                    <p>
                      Minimum cost: **{results.data.cost} {cheapestNetworkMetric === 'distance' ? 'km' : '₹'}**
                    </p>
                    <p>Total Edges: {results.data.tree.length}</p>
                  </>
                )}
              </>
            )}
          </section>
        </aside>

        <main className="graph-and-output-panel">
          <section className="graph-container">
            <Graph
              nodes={nodes}
              edges={edges}
              edgeType={algoType === 'cheapestNetwork' ? cheapestNetworkMetric : shortestPathMetric}
              path={graphPath}
              mstEdges={graphMstEdges}
              visualizationStep={currentVizState}
              algorithmType={results?.algo}
            />
          </section>
        </main>
      </div>
    </div>
  );
};

export default PlannerPage;