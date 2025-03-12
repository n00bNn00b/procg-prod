import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from "@xyflow/react";

const AnimatedSVGEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
  animated,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd="url(#arrow)" />

      {animated && (
        <circle r="2" fill="#fb343a">
          <animateMotion dur="4s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}

      {/* Define the marker (Arrow) in the <defs> section */}
      <svg>
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="4"
            markerHeight="4"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#b1b1b7" />
          </marker>
        </defs>

        {/* Add the label with a background */}
        {label && (
          <EdgeLabelRenderer>
            <div
              style={{
                position: "absolute",
                transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                background: "#ffffff",
                padding: "2px 4px",
                borderRadius: 5,
                fontSize: 10,
                color: "#505050",
              }}
              className="nodrag nopan"
            >
              {label}
            </div>
          </EdgeLabelRenderer>
        )}
      </svg>
    </>
  );
};

export default AnimatedSVGEdge;
