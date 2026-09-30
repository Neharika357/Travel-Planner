import React from 'react';

const Graph = ({ nodes, edges, edgeType, path, mstEdges, visualizationStep, algorithmType }) => {
  const width = 800;
  const height = 550;
  const radius = 220;
  const centerX = width / 2;
  const centerY = height / 2;

  const getPos = (index, totalNodes) => {
    const angle = (index / totalNodes) * 2 * Math.PI - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { x, y };
  };

  const nodePositions = nodes.reduce((acc, node, index) => {
    acc[node.id] = getPos(index, nodes.length);
    return acc;
  }, {});

  const vizStep = visualizationStep || {};
  const isFinalStep = vizStep.final;

  return (
    <svg width={width} height={height} className="graph-svg">
      {edges.map((edge, index) => {
        const sourcePos = nodePositions[edge.source];
        const targetPos = nodePositions[edge.target];
        if (!sourcePos || !targetPos) return null;

        // Check if the edge is part of the final path or MST (red highlight)
        const isFinalHighlightedEdge = 
          isFinalStep && (
            (path.includes(edge.source) && path.includes(edge.target) && Math.abs(path.indexOf(edge.source) - path.indexOf(edge.target)) === 1) ||
            (mstEdges.some(e => 
              (e.source === edge.source && e.target === edge.target) || 
              (e.source === edge.target && e.target === edge.source)
            ))
          );

        // Visualization for Prim's during animation
        const isHighlightedForPrim =
          algorithmType === 'prims' &&
          !isFinalStep &&
          vizStep.highlightedEdge &&
          ((vizStep.highlightedEdge.source === edge.source && vizStep.highlightedEdge.target === edge.target) ||
            (vizStep.highlightedEdge.source === edge.target && vizStep.highlightedEdge.target === edge.source));
        
        // Visualization for MST edges that have been added during Prim's (before final step)
        const isAddedToMSTDuringPrim = 
          algorithmType === 'prims' && 
          !isFinalStep && 
          vizStep.addedEdges &&
          vizStep.addedEdges.some(e => (e.source === edge.source && e.target === edge.target) || (e.source === edge.target && e.target === e.source));

        // Visualization for current edge being considered in Kruskal's
        const isHighlightedForKruskal =
          algorithmType === 'kruskals' &&
          !isFinalStep &&
          vizStep.highlightedEdge &&
          ((vizStep.highlightedEdge.source === edge.source && vizStep.highlightedEdge.target === edge.target) ||
            (vizStep.highlightedEdge.source === edge.target && vizStep.highlightedEdge.target === edge.source));
        
        // Visualization for MST edges already added by Kruskal's (before final step)
        const isAddedToMSTDuringKruskal = 
          algorithmType === 'kruskals' && 
          !isFinalStep && 
          vizStep.mstEdges?.some(e => 
            (e.source === edge.source && e.target === edge.target) || 
            (e.source === edge.target && e.target === edge.source)
          );

        return (
          <g key={index}>
            <line
              x1={sourcePos.x}
              y1={sourcePos.y}
              x2={targetPos.x}
              y2={targetPos.y}
              className={`edge 
                ${isFinalHighlightedEdge ? 'final-path-edge' : ''} 
                ${isHighlightedForPrim ? 'prims-highlight' : ''} 
                ${isAddedToMSTDuringPrim ? 'prims-added' : ''}
                ${isHighlightedForKruskal ? 'kruskals-highlight' : ''}
                ${isAddedToMSTDuringKruskal ? 'kruskals-added' : ''}
              `}
            />
            <text
              x={(sourcePos.x + targetPos.x) / 2}
              y={(sourcePos.y + targetPos.y) / 2}
              className="edge-weight"
            >
              {edge[edgeType]}
            </text>
          </g>
        );
      })}

      {nodes.map((node, index) => {
        const pos = nodePositions[node.id];
        
        // Check if the node is part of the final path or MST (red highlight)
        const isFinalHighlightedNode = isFinalStep && (
          path.includes(node.id) || 
          mstEdges.some(e => e.source === node.id || e.target === node.id)
        );

        // Dijkstra's animation: visited nodes
        const isDijkstraVisited = !isFinalStep && vizStep.type === 'dijkstra' && vizStep.visitedNodes?.includes(node.id);
        // Prim's animation: visited nodes
        const isPrimVisited = !isFinalStep && vizStep.type === 'prims' && vizStep.visited?.has(node.id);
        // Kruskal's animation: nodes in the MST (part of a component)
        const isKruskalComponentNode = !isFinalStep && vizStep.type === 'kruskals' && vizStep.mstNodes?.includes(node.id);
        
        return (
          <g key={node.id}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r="20"
              className={`node 
                ${isFinalHighlightedNode ? 'final-path-node' : ''} 
                ${isDijkstraVisited || isPrimVisited || isKruskalComponentNode ? 'visited-node' : ''} 
              `}
            />
            <text x={pos.x} y={pos.y} dy=".3em" className="node-label">
              {node.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default Graph;