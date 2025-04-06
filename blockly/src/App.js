

import "./App.css";
import "./customBlocks/custom_Blocks";
import React from "react";
import ReactBlockly from "react-blockly";
import Blockly from "blockly";

export default function App() {
  const randomTasks = [
    {
      id: "say_hello",
      description: "Print the word Hello",
      xml: `<xml xmlns="http://www.w3.org/1999/xhtml">
        <block type="text_print" x="70" y="30">
          <value name="TEXT">
            <shadow type="text">
              <field name="TEXT">Hello</field>
            </shadow>
          </value>
        </block>
      </xml>`,
      expectedOutput: "Hello "
    },
    {
      id: "count_to_3",
      description: "Print the numbers 1 to 3",
      xml: `<xml xmlns="http://www.w3.org/1999/xhtml">
        <block type="controls_repeat_ext" x="70" y="30">
          <value name="TIMES">
            <shadow type="math_number">
              <field name="NUM">3</field>
            </shadow>
          </value>
          <statement name="DO">
            <block type="text_print">
              <value name="TEXT">
                <shadow type="math_number">
                  <field name="NUM">1</field>
                </shadow>
              </value>
            </block>
          </statement>
        </block>
      </xml>`,
      expectedOutput: "1 1 1 "
    },
    {
      id: "add_numbers",
      description: "Print the sum of 5 + 2",
      xml: `<xml xmlns="http://www.w3.org/1999/xhtml">
        <block type="text_print" x="70" y="30">
          <value name="TEXT">
            <block type="math_arithmetic">
              <field name="OP">ADD</field>
              <value name="A">
                <shadow type="math_number">
                  <field name="NUM">5</field>
                </shadow>
              </value>
              <value name="B">
                <shadow type="math_number">
                  <field name="NUM">2</field>
                </shadow>
              </value>
            </block>
          </value>
        </block>
      </xml>`,
      expectedOutput: "7 "
    }
  ];

  const [currentTask, setCurrentTask] = React.useState(null);

  
  const initialXml =
    <xml xmlns="http://www.w3.org/1999/xhtml"><block type="text" x="70" y="30"><field name="TEXT"></field></block></xml>;
    const toolboxCategories = [
      {
        name: "Custom",
        colour: "#5CA699",
        blocks: [
          { type: "stringOf" },
          { type: "responceontext" },
          { type: "simplebot" },
          { type: "regexInput" },
        ],
      },
      {
        name: "Control",
        colour: "#FFAB19",
        blocks: [
          { type: "controls_if" },
          { type: "controls_repeat" },
          { type: "controls_whileUntil" },
          { type: "say" },
          { type: "wait" },
          { type: "repeat" },
          { type: "forever" },
          { type: "if" },
          { type: "if_else" },
          { type: "wait_until" },
          { type: "repeat_until" },
        ],
      },
      {
        name: "Logic",
        colour: "#5C81A6",
        blocks: [
          { type: "logic_compare" },
          { type: "logic_operation" },
          { type: "logic_boolean" },
        ],
      },
      {
        name: "Math",
        colour: "#5CA65C",
        blocks: [
          { type: "math_number" },
          { type: "math_arithmetic" },
          { type: "math_round" },
        ],
      },
      {
        name: "Text",
        colour: "#5CA699",
        blocks: [
          { type: "text" },
          { type: "text_print" },
        ],
      },
    ];


    Blockly.JavaScript['text_print'] = function(block) {
      var argument0 = Blockly.JavaScript.valueToCode(block, 'TEXT',
          Blockly.JavaScript.ORDER_NONE) || '""';
      return 'console.log(' + argument0 + ');\n';
    };
    

  function workspaceDidChange(workspace) {
    const newXml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
    document.getElementById("generated-xml").innerText = "";

    const code = Blockly.JavaScript.workspaceToCode(workspace);
    document.getElementById("code").value = code;
  }


  function runCode() {
  console.log("Executing Blockly Code...");
  document.getElementById("output").innerText = "";

  const code = document.getElementById("code").value;
  window.LoopTrap = 1000;

  let outputText = "";

  const originalLog = console.log;
  console.log = function (message) {
    outputText += message + " ";
    originalLog.apply(console, arguments);
  };

  try {
    eval(code);
  } catch (e) {
    outputText = "Error: " + e;
  }

  console.log = originalLog;
  document.getElementById("output").innerText = outputText;

  if (currentTask) {
    const expected = currentTask.expectedOutput.trim();
    const actual = outputText.trim();
    const resultText =
      expected === actual
        ? "✅ Correct Output!"
        : `❌ Try Again. Expected: "${expected}", but got "${actual}"`;
    document.getElementById("task-result").innerText = resultText;
  }
}

const [showSolution, setShowSolution] = React.useState(false);

return (
  <>
    <div id="task-desc" style={{ marginTop: "10px", fontWeight: "bold" }}></div>
    <div id="task-result" style={{ marginTop: "5px" }}></div>

    <ReactBlockly
      toolboxCategories={toolboxCategories}
      initialXml={initialXml}
      wrapperDivClassName="fill-height"
      workspaceConfiguration={{
        grid: {
          spacing: 20,
          length: 3,
          colour: "#ccc",
          snap: true,
        },
      }}
      workspaceDidChange={workspaceDidChange}
    />

    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        marginTop: "30px",
        flexWrap: "wrap",
      }}
    >
      <button
        onClick={runCode}
        style={buttonStyle("#4CAF50", "#45a049")}
      >
        ▶️ Run
      </button>

      <button
        onClick={() => {
          const task = randomTasks[Math.floor(Math.random() * randomTasks.length)];
          setCurrentTask(task);
          setShowSolution(false); // hide solution blocks initially
          const workspace = Blockly.getMainWorkspace();
          workspace.clear(); // clear old blocks
          document.getElementById("task-desc").innerText = "🧠 Task: " + task.description;
          document.getElementById("task-result").innerText = "";
        }}
        style={buttonStyle("#2196F3", "#1976D2")}
      >
        🎲 New Task
      </button>

      <button
        onClick={() => {
          if (currentTask && !showSolution) {
            const workspace = Blockly.getMainWorkspace();
            workspace.clear();
            Blockly.Xml.domToWorkspace(
              Blockly.Xml.textToDom(currentTask.xml),
              workspace
            );
            setShowSolution(true);
          }
        }}
        style={buttonStyle("#FF9800", "#F57C00")}
        disabled={!currentTask || showSolution}
      >
        💡 View Solution
      </button>
    </div>

    <pre id="generated-xml"></pre>

    <textarea
      id="code"
      style={{ height: "200px", width: "400px", display: "none" }}
      value=""
      readOnly
    ></textarea>

    <div
      id="output"
      style={{
        border: "1px solid black",
        padding: "10px",
        marginTop: "10px",
        minHeight: "50px",
        background: "#f5f5f5"
      }}
    >
      <b>Output:</b>
    </div>
  </>
);

function buttonStyle(baseColor, hoverColor) {
  return {
    backgroundColor: baseColor,
    color: "white",
    padding: "12px 24px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background-color 0.3s",
    ...(hoverColor && {
      onMouseOver: (e) => (e.target.style.backgroundColor = hoverColor),
      onMouseOut: (e) => (e.target.style.backgroundColor = baseColor),
    }),
  };
}


}
