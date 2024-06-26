Blockly.Blocks['slash_main'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("create global slash commands");
        this.appendStatementInput("CMDS")
            .setCheck(null);
        this.setColour(240);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

javascript.javascriptGenerator.forBlock['slash_main'] = function (block, generator) {
    var statements_cmds = generator.statementToCode(block, 'CMDS');

    var code = `client.on(Events.ClientReady, async () => {
  const { REST, Routes } = require('discord.js');
      
  const commands = [${statements_cmds}];
      
  const rest = new REST().setToken(client.token);
      
  await rest.put(
    Routes.applicationCommands(client.user.id),
    { body: commands },
  );
});\n`;

    return code;
};

Blockly.Blocks['slash_create'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("slash command");
        this.appendValueInput("NAME")
            .setCheck("String")
            .appendField("name");
        this.appendValueInput("DESCRIPTION")
            .setCheck("String")
            .appendField("description");
        this.appendValueInput("DMS")
            .setCheck("Boolean")
            .appendField("available in DMs?");
        this.appendStatementInput("INPUTS")
            .setCheck(null)
            .appendField("(?) inputs");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");

        this.setOnChange(function () {
            var parent = this.getParent();

            if (parent?.type != 'slash_main') {
                this.setWarningText('This block should be used inside a "create global slash commands" block');
            } else {
                this.setWarningText(null);
            }
        });
    }
};

javascript.javascriptGenerator.forBlock['slash_create'] = function (block, generator) {
    var value_name = generator.valueToCode(block, 'NAME', javascript.Order.ATOMIC);
    var value_description = generator.valueToCode(block, 'DESCRIPTION', javascript.Order.ATOMIC);
    var value_dms = generator.valueToCode(block, 'DMS', javascript.Order.ATOMIC) || false;
    var statements_inputs = generator.statementToCode(block, 'INPUTS');

    var code = `new SlashCommandBuilder().setName(${value_name}).setDescription(${value_description}).setDMPermission(${value_dms})${statements_inputs},`;

    return code;
};

Blockly.Blocks['slash_input'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("create")
            .appendField(new Blockly.FieldDropdown([["text", "String"], ["integer", "Integer"], ["number", "Number"], ["boolean", "Boolean"], ["user", "User"], ["channel", "Channel"], ["role", "Role"], ["attachment", "Attachment"]]), "TYPE")
            .appendField("input");
        this.appendValueInput("NAME")
            .setCheck("String")
            .appendField("name");
        this.appendValueInput("DESCRIPTION")
            .setCheck("String")
            .appendField("description");
        this.appendValueInput("REQUIRED")
            .setCheck("Boolean")
            .appendField("is required?");
        this.appendStatementInput("CHOICES")
            .setCheck(null)
            .appendField("(?) choices");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(220);
        this.setTooltip("");
        this.setHelpUrl("");

        this.setOnChange(function () {
            var parent = this.getParent();

            if (parent?.type != ('slash_create')) {
                this.setWarningText('This block should be used inside a "slash command" block');
            } else {
                this.setWarningText(null);
            }
        });
    }
};

javascript.javascriptGenerator.forBlock['slash_input'] = function (block, generator) {
    var type = block.getFieldValue('TYPE');
    var name = generator.valueToCode(block, 'NAME', javascript.Order.ATOMIC) || 'name';
    var description = generator.valueToCode(block, 'DESCRIPTION', javascript.Order.ATOMIC) || 'description';
    var required = generator.valueToCode(block, 'REQUIRED', javascript.Order.ATOMIC) || false;
    var statements_choices = generator.statementToCode(block, 'CHOICES');

    var code = `.add${type}Option(option => option.setName(${name}).setDescription(${description}).setRequired(${required}))`;

    if (statements_choices != '') {
        code += `.addChoices(${statements_choices})`;
    }

    return code;
};

Blockly.Blocks['slash_getinput'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("value of")
            .appendField(new Blockly.FieldDropdown([["text", "String"], ["integer", "Integer"], ["number", "Number"], ["boolean", "Boolean"], ["user", "User"], ["channel", "Channel"], ["role", "Role"], ["attachment", "Attachment"]]), "TYPE");
        this.appendValueInput("NAME")
            .setCheck("String")
            .appendField("input named");
        this.setInputsInline(true);
        this.setOutput(true, ["String", "Number", "Boolean", "User", "Channel", "Role", "Attachment"]);
        this.setOutputShape(2);
        this.setColour(220);
        this.setTooltip("");
        this.setHelpUrl("");

        this.setOnChange(function () {
            var parent = this.getRootBlock();

            if (parent.type != ('slash_received')) {
                this.setWarningText('This block should be used in a "when a slash command runs" event');
            } else {
                this.setWarningText(null);
            }
        });
    }
};

javascript.javascriptGenerator.forBlock['slash_getinput'] = function (block, generator) {
    var dropdown_type = block.getFieldValue('TYPE');
    var value_name = generator.valueToCode(block, 'NAME', javascript.Order.ATOMIC);

    var code = `interaction.options.get${dropdown_type}(${value_name})`;

    return [code, javascript.Order.NONE];
};

Blockly.Blocks['slash_received'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("when a slash command runs");
        this.appendStatementInput("CODE")
            .setCheck(null);
        this.setColour(240);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

javascript.javascriptGenerator.forBlock['slash_received'] = function (block, generator) {
    var statements_code = generator.statementToCode(block, 'CODE');
    var code = `client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
${statements_code}});\n`;
    return code;
};

Blockly.Blocks['slash_commandname'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("slash command name");
        this.setOutput(true, "String");
        this.setColour(240);
        this.setTooltip("");
        this.setHelpUrl("");

        this.setOnChange(function () {
            var parent = this.getRootBlock();

            if (parent.type != ('slash_received')) {
                this.setWarningText('This block should be used in a "when a slash command runs" event');
            } else {
                this.setWarningText(null);
            }
        });
    }
};

javascript.javascriptGenerator.forBlock['slash_commandname'] = function (block, generator) {
    return ['interaction.commandName', javascript.Order.NONE];
};

Blockly.Blocks['slash_reply'] = {
    init: function () {
        this.appendValueInput("TEXT")
            .setCheck("String")
            .appendField("reply to slash command with");
        this.appendValueInput("EPHEMERAL")
            .setCheck("Boolean")
            .appendField("hidden reply?");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(240);
        this.setTooltip("");
        this.setHelpUrl("");

        this.setOnChange(function () {
            var parent = this.getRootBlock();

            if (parent.type != ('slash_received')) {
                this.setWarningText('This block should be used in a "when a slash command runs" event');
            } else {
                this.setWarningText(null);
            }
        });
    }
};

javascript.javascriptGenerator.forBlock['slash_reply'] = function (block, generator) {
    var value_text = generator.valueToCode(block, 'TEXT', javascript.Order.ATOMIC);
    var value_ephemeral = generator.valueToCode(block, 'EPHEMERAL', javascript.Order.ATOMIC);

    var code = `interaction.reply({ content:${value_text},ephemeral:${value_ephemeral} });\n`;
    return code;
};

Blockly.Blocks['slash_user'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("slash command author");
        this.setInputsInline(true);
        this.setOutput(true, "String");
        this.setColour(210);
        this.setTooltip("");
        this.setHelpUrl("");

        this.setOnChange(function () {
            var parent = this.getRootBlock();

            if (parent.type != ('slash_received')) {
                this.setWarningText('This block should be used in a "when a slash command runs" event');
            } else {
                this.setWarningText(null);
            }
        });
    }
};

javascript.javascriptGenerator.forBlock['slash_user'] = function (block, generator) {
    return ['interaction.user', javascript.Order.NONE];
};

Blockly.Blocks['slash_member'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("slash command member");
        this.setInputsInline(true);
        this.setOutput(true, "Member");
        this.setColour(45);
        this.setTooltip("");
        this.setHelpUrl("");

        this.setOnChange(function () {
            var parent = this.getRootBlock();

            if (parent.type != ('slash_received')) {
                this.setWarningText('This block should be used in a "when a slash command runs" event');
            } else {
                this.setWarningText(null);
            }
        });
    }
};

javascript.javascriptGenerator.forBlock['slash_member'] = function (block, generator) {
    return ['interaction.member', javascript.Order.NONE];
};

Blockly.Blocks['slash_channel'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("slash command channel");
        this.setInputsInline(true);
        this.setOutput(true, "Channel");
        this.setColour(15);
        this.setTooltip("");
        this.setHelpUrl("");

        this.setOnChange(function () {
            var parent = this.getRootBlock();

            if (parent.type != ('slash_received')) {
                this.setWarningText('This block should be used in a "when a slash command runs" event');
            } else {
                this.setWarningText(null);
            }
        });
    }
};

javascript.javascriptGenerator.forBlock['slash_channel'] = function (block, generator) {
    return ['interaction.channel', javascript.Order.NONE];
};

Blockly.Blocks['slash_guild'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("slash command server");
        this.setInputsInline(true);
        this.setOutput(true, "Guild");
        this.setColour(0);
        this.setTooltip("");
        this.setHelpUrl("");

        this.setOnChange(function () {
            var parent = this.getRootBlock();

            if (parent.type != ('slash_received')) {
                this.setWarningText('This block should be used in a "when a slash command runs" event');
            } else {
                this.setWarningText(null);
            }
        });
    }
};

javascript.javascriptGenerator.forBlock['slash_guild'] = function (block, generator) {
    return ['interaction.guild', javascript.Order.NONE];
};

Blockly.Blocks['slash_editreply'] = {
    init: function () {
        this.appendValueInput("TEXT")
            .setCheck("String")
            .appendField("edit command reply to");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(240);
        this.setTooltip("");
        this.setHelpUrl("");

        this.setOnChange(function () {
            var parent = this.getRootBlock();

            if (parent.type != ('slash_received')) {
                this.setWarningText('This block should be used in a "when a slash command runs" event');
            } else {
                this.setWarningText(null);
            }
        });
    }
};

javascript.javascriptGenerator.forBlock['slash_editreply'] = function (block, generator) {
    var value_text = generator.valueToCode(block, 'TEXT', javascript.Order.ATOMIC);

    return `interaction.editReply(${value_text})`;
};

Blockly.Blocks['slash_deletereply'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("delete command reply");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(240);
        this.setTooltip("");
        this.setHelpUrl("");

        this.setOnChange(function () {
            var parent = this.getRootBlock();

            if (parent.type != ('slash_received')) {
                this.setWarningText('This block should be used in a "when a slash command runs" event');
            } else {
                this.setWarningText(null);
            }
        });
    }
};

javascript.javascriptGenerator.forBlock['slash_deletereply'] = function (block, generator) {
    return 'interaction.deleteReply()';
};

Blockly.Blocks['slash_inputchoice'] = {
    init: function () {
        this.appendValueInput("NAME")
            .setCheck("String")
            .appendField("choice display");
        this.appendValueInput("VALUE")
            .setCheck("String")
            .appendField("value");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210);
        this.setTooltip("");
        this.setHelpUrl("");

        this.setOnChange(function () {
            var parent = this.getParent();

            if (parent?.type != ('slash_input')) {
                this.setWarningText('This block should be used inside a "create [] input" block');
            } else {
                this.setWarningText(null);
            }
        });
    }
};

javascript.javascriptGenerator.forBlock['slash_inputchoice'] = function (block, generator) {
    var value_name = generator.valueToCode(block, 'NAME', javascript.Order.ATOMIC);
    var value_value = generator.valueToCode(block, 'VALUE', javascript.Order.ATOMIC);

    var code = `{ name:${value_name},value:${value_value} },`;

    return code;
};

Blockly.Blocks['slash_replywithembed'] = {
    init: function () {
        var validator = function (newValue) {
            return newValue.replace(/[^a-zA-Z0-9_$]/g, '');
        }

        this.appendValueInput("TEXT")
            .setCheck("String")
            .appendField("reply to command with");
        this.appendDummyInput()
            .appendField("and embed with name")
            .appendField(new Blockly.FieldTextInput("embed", validator), "NAME");
        this.appendValueInput("EPHEMERAL")
            .setCheck("Boolean")
            .appendField("hidden reply?");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(240);
        this.setTooltip("");
        this.setHelpUrl("");

        this.setOnChange(function () {
            var parent = this.getRootBlock();

            if (parent.type != ('slash_received')) {
                this.setWarningText('This block should be used in a "when a slash command runs" event');
            } else {
                this.setWarningText(null);
            }
        });
    }
};

javascript.javascriptGenerator.forBlock['slash_replywithembed'] = function (block, generator) {
    var value_text = generator.valueToCode(block, 'TEXT', javascript.Order.ATOMIC);
    var text_name = block.getFieldValue('NAME');
    var value_ephemeral = generator.valueToCode(block, 'EPHEMERAL', javascript.Order.ATOMIC);

    var code = `{ embeds:[embedCreator${text_name}],content:${value_text},ephemeral:${value_ephemeral} }`;
    return code;
};