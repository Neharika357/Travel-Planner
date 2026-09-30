import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Graph from '../components/Graph';
import { useGraph } from '../context/GraphContext';

const GraphBuilder = () => {
  const { nodes, edges, addNode, addEdge } = useGraph();
  const [newNodeName, setNewNodeName] = useState('');
  const [sourceEdgeId, setSourceEdgeId] = useState('');
  const [targetEdgeId, setTargetEdgeId] = useState('');
  const [distance, setDistance] = useState('');
  const [cost, setCost] = useState('');

  const handleAddCity = (e) => {
    e.preventDefault();
    if (newNodeName.trim()) {
      addNode(newNodeName.trim());
      setNewNodeName('');
    }
  };

  const handleAddRoute = (e) => {
    e.preventDefault();
    if (sourceEdgeId && targetEdgeId && distance && cost) {
      addEdge(sourceEdgeId, targetEdgeId, parseFloat(distance), parseFloat(cost));
      setSourceEdgeId('');
      setTargetEdgeId('');
      setDistance('');
      setCost('');
    }
  };

  return (
    <div className="page graph-builder-page">
      <h1 className="page-title">Build Your Travel Network</h1>
      <div className="content-container">
        <aside className="forms-panel">
          <section className="form-section">
            <h2>Add Cities</h2>
            <form onSubmit={handleAddCity}>
              <input
                type="text"
                value={newNodeName}
                onChange={(e) => setNewNodeName(e.target.value)}
                placeholder="City Name (e.g., London)"
              />
              <button type="submit" className="button">
                Add City
              </button>
            </form>
            <div className="city-list">
              {nodes.map((node) => (
                <span key={node.id} className="item-tag">
                  {node.label}
                </span>
              ))}
            </div>
          </section>

          <section className="form-section">
            <h2>Add Routes</h2>
            <form onSubmit={handleAddRoute}>
              <select value={sourceEdgeId} onChange={(e) => setSourceEdgeId(e.target.value)}>
                <option value="">Source</option>
                {nodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.label}
                  </option>
                ))}
              </select>
              <select value={targetEdgeId} onChange={(e) => setTargetEdgeId(e.target.value)}>
                <option value="">Target</option>
                {nodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="Distance (km)"
              />
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="Cost (₹)"
              />
              <button type="submit" className="button">
                Add Route
              </button>
            </form>
          </section>
        </aside>

        <main className="graph-and-output-panel">
          <section className="graph-container">
            {/* The corrected line with empty array defaults */}
            <Graph nodes={nodes} edges={edges} edgeType="distance" path={[]} mstEdges={[]} />
          </section>
          <div className="button-footer">
            <Link to="/plan" className="button primary-button">
              Continue to Planner
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default GraphBuilder;