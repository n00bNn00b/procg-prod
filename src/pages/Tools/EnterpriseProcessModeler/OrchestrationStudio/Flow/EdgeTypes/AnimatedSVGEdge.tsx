import { BaseEdge, getSmoothStepPath, type EdgeProps } from "@xyflow/react";

const AnimatedSVGEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
}: EdgeProps) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Get the middle point of the edge path to place the label
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;

  const fontSize = 10;
  const labelWidth = label ? label.toString().length * fontSize * 0.6 : 0;
  const labelHeight = fontSize + 6;
  const labelX = midX - labelWidth / 2;
  const labelY = midY - labelHeight / 2;

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd="url(#arrow)" />

      <circle r="4" fill="#fb343a">
        <animateMotion dur="3s" repeatCount="indefinite" path={edgePath} />
      </circle>

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
          <>
            <rect
              x={labelX}
              y={labelY}
              width={labelWidth}
              height={labelHeight}
              className="react-flow__edge-textbg"
              rx="2"
              ry="2"
              fill="white"
              stroke="none"
            />
            {/* Label text */}
            <text
              x={midX}
              y={midY}
              textAnchor="middle"
              alignmentBaseline="middle"
              fill="#505050"
              fontSize={fontSize}
            >
              {label}
            </text>
          </>
        )}
      </svg>
    </>
  );
};

export default AnimatedSVGEdge;
