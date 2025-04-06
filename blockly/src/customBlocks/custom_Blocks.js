import Blockly from 'blockly';

// Say block (similar to Scratch)
Blockly.Blocks['say'] = {
  init: function() {
    this.appendValueInput('MESSAGE')
        .setCheck('String')
        .appendField('say');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip('Display a message');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript['say'] = function(block) {
  const message = Blockly.JavaScript.valueToCode(block, 'MESSAGE', 
    Blockly.JavaScript.ORDER_ATOMIC) || "''";
  return `console.log(${message});\n`;
};

// Wait block (similar to Scratch)
Blockly.Blocks['wait'] = {
  init: function() {
    this.appendValueInput('SECONDS')
        .setCheck('Number')
        .appendField('wait');
    this.appendDummyInput()
        .appendField('seconds');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip('Wait for specified seconds');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript['wait'] = function(block) {
  const seconds = Blockly.JavaScript.valueToCode(block, 'SECONDS', 
    Blockly.JavaScript.ORDER_ATOMIC) || '1';
  return `await new Promise(resolve => setTimeout(resolve, ${seconds} * 1000));\n`;
};

// Repeat loop (counted loop like Scratch)
Blockly.Blocks['repeat'] = {
  init: function() {
    this.appendValueInput('TIMES')
        .setCheck('Number')
        .appendField('repeat');
    this.appendDummyInput()
        .appendField('times');
    this.appendStatementInput('DO')
        .appendField('do');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip('Repeat the enclosed blocks a specified number of times');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript['repeat'] = function(block) {
  const times = Blockly.JavaScript.valueToCode(block, 'TIMES', 
    Blockly.JavaScript.ORDER_ATOMIC) || '10';
  const branch = Blockly.JavaScript.statementToCode(block, 'DO') || '';
  return `for (let i = 0; i < ${times}; i++) {\n${branch}}\n`;
};

// Forever loop (like Scratch)
Blockly.Blocks['forever'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('forever');
    this.appendStatementInput('DO')
        .appendField('do');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip('Repeat the enclosed blocks forever');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript['forever'] = function(block) {
  const branch = Blockly.JavaScript.statementToCode(block, 'DO') || '';
  return `while (true) {\n${branch}}\n`;
};

// If-then block (like Scratch)
Blockly.Blocks['if'] = {
  init: function() {
    this.appendValueInput('CONDITION')
        .setCheck('Boolean')
        .appendField('if');
    this.appendStatementInput('DO')
        .appendField('then');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
    this.setTooltip('If a condition is true, then do some statements');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript['if'] = function(block) {
  const condition = Blockly.JavaScript.valueToCode(block, 'CONDITION', 
    Blockly.JavaScript.ORDER_NONE) || 'false';
  const branch = Blockly.JavaScript.statementToCode(block, 'DO') || '';
  return `if (${condition}) {\n${branch}}\n`;
};

// If-else block (like Scratch)
Blockly.Blocks['if_else'] = {
  init: function() {
    this.appendValueInput('CONDITION')
        .setCheck('Boolean')
        .appendField('if');
    this.appendStatementInput('DO')
        .appendField('then');
    this.appendStatementInput('ELSE')
        .appendField('else');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
    this.setTooltip('If a condition is true, then do some statements, otherwise do other statements');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript['if_else'] = function(block) {
  const condition = Blockly.JavaScript.valueToCode(block, 'CONDITION', 
    Blockly.JavaScript.ORDER_NONE) || 'false';
  const branch = Blockly.JavaScript.statementToCode(block, 'DO') || '';
  const elseBranch = Blockly.JavaScript.statementToCode(block, 'ELSE') || '';
  return `if (${condition}) {\n${branch}} else {\n${elseBranch}}\n`;
};

// Wait until block (like Scratch)
Blockly.Blocks['wait_until'] = {
  init: function() {
    this.appendValueInput('CONDITION')
        .setCheck('Boolean')
        .appendField('wait until');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip('Wait until a condition becomes true');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript['wait_until'] = function(block) {
  const condition = Blockly.JavaScript.valueToCode(block, 'CONDITION', 
    Blockly.JavaScript.ORDER_NONE) || 'false';
  return `while (!(${condition})) {\n  await new Promise(resolve => setTimeout(resolve, 100));\n}\n`;
};

// Repeat until block (like Scratch)
Blockly.Blocks['repeat_until'] = {
  init: function() {
    this.appendValueInput('CONDITION')
        .setCheck('Boolean')
        .appendField('repeat until');
    this.appendStatementInput('DO')
        .appendField('do');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip('Repeat the enclosed blocks until a condition becomes true');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript['repeat_until'] = function(block) {
  const condition = Blockly.JavaScript.valueToCode(block, 'CONDITION', 
    Blockly.JavaScript.ORDER_NONE) || 'false';
  const branch = Blockly.JavaScript.statementToCode(block, 'DO') || '';
  return `while (!(${condition})) {\n${branch}}\n`;
};