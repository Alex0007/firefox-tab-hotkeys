const commandsP = browser.commands.getAll().then((commands) => {
  return commands
    .filter((command) => typeof command.shortcut === "string")
    .map((command) => {
      command.shortcut = command.shortcut.toLowerCase().replace("ctrl", "mod");
      return command;
    });
});

const handleShortcut = async (commandName: string) => {
  // console.log({ strName: commandName }, new Date(), Math.random());
  const tabs = await browser.tabs
    .query({
      currentWindow: true,
      hidden: false,
    })
    .then((tabs) => tabs.sort((a, b) => a.index - b.index));

  const currentTab = tabs.find((_) => _.active);

  const nextTab =
    currentTab.index === tabs.length - 1 ? tabs[0] : tabs[currentTab.index + 1];

  const previousTab =
    currentTab.index === 0 ? tabs[tabs.length - 1] : tabs[currentTab.index - 1];

  if (commandName === "pin-tab") {
    return browser.tabs.update(currentTab.id, {
      pinned: !currentTab.pinned,
    });
  }

  if (commandName === "left-tab") {
    browser.tabs.update(previousTab.id, {
      active: true,
    });
  }

  if (commandName === "right-tab") {
    browser.tabs.update(nextTab.id, {
      active: true,
    });
  }

  return;
};

browser.commands.onCommand.addListener((command) => {
  handleShortcut(command);
});

browser.runtime.onMessage.addListener(async (message, sender) => {
  if (message === "getCommands") {
    const commands = await commandsP;
    return browser.tabs.sendMessage(sender.tab.id, { setCommands: commands });
  }

  handleShortcut(message);
});
