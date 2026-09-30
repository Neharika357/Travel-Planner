import React, { createContext, useState, useContext } from 'react';

const GraphContext = createContext();

export const GraphProvider = ({ children }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const addNode = (label) => {
    const newId = `C${nodes.length + 1}`;
    setNodes((prevNodes) => [...prevNodes, { id: newId, label }]);
  };

  const addEdge = (source, target, distance, cost) => {
    setEdges((prevEdges) => [...prevEdges, { source, target, distance, cost }]);
  };

  return (
    <GraphContext.Provider value={{ nodes, edges, addNode, addEdge }}>
      {children}
    </GraphContext.Provider>
  );
};

export const useGraph = () => useContext(GraphContext);