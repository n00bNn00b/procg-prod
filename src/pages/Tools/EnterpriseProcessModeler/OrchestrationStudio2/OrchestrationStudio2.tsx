import { ReactFlowProvider } from "@xyflow/react";
import { ExampleProps } from "./Flow/Flow";
import { Leva, useControls } from "leva";
import ShapesProExampleApp from "./Flow/Flow";
import { useEffect } from "react";

const OrchestrationStudio2 = () => {
  // 👇 this renders a leva control panel to interactively configure the example
  const props = useControls({
    theme: {
      options: ["dark", "light"],
      value: "light",
    },
    snapToGrid: true,
    panOnScroll: true,
    zoomOnDoubleClick: false,
  });

  useEffect(() => {
    const styleElement = document.createElement("style");
    document.head.appendChild(styleElement);

    const themeStyles = `
      /* Apply background color to all Leva-related elements */
      #leva__root,
      .leva-c-kWgxhW,
      .leva-c-dmsJDs,
      .leva-c-grzFYX,
      .leva-c-bDGmTT,
      .leva-c-iSkYoW {
        background-color: ${
          props.theme === "dark" ? "#181c20" : "#f0f0f0"
        } !important;
        color: ${props.theme === "dark" ? "#d7d7d7" : "#000"} !important;
      }

      /* Apply color changes to :root and .leva-t-kqjEjX */
      :root {
        --leva-colors-elevation2: ${
          props.theme === "dark" ? "#292d39" : "#d7d7d7"
        } !important;
        --leva-colors-elevation3: ${
          props.theme === "dark" ? "#292d39" : "#d7d7d7"
        } !important;
        --leva-colors-background: ${
          props.theme === "dark" ? "#333" : "#fff"
        } !important;
        --leva-colors-text: ${
          props.theme === "dark" ? "#fff" : "#000"
        } !important;
      }

      .leva-t-kqjEjX {
        --leva-colors-elevation3: ${
          props.theme === "dark" ? "#444" : "#f2f2f2"
        } !important;
      }
      .leva-c-hwBXYF {
        height: 25px;
        background-color: ${
          props.theme === "dark" ? "#292d39" : "#d7d7d7"
        } !important;
        border-radius: 10px
      }
    `;

    styleElement.innerHTML = themeStyles;

    return () => {
      document.head.removeChild(styleElement);
    };
  }, [props.theme]);

  return (
    <div className="relative">
      <ReactFlowProvider>
        <div
          className="absolute transform right-0
          //top-[-2.63rem]
          "
          style={{ zIndex: 10 }}
        >
          <Leva
            collapsed
            // titleBar={{ title: "Control panel" }}
          />
        </div>
        <ShapesProExampleApp {...(props as ExampleProps)} />
      </ReactFlowProvider>
    </div>
  );
};

export default OrchestrationStudio2;
