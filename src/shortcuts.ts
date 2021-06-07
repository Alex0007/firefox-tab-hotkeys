import * as Mousetrap from "mousetrap";

Mousetrap.prototype.stopCallback = () => {
  return false;
};

browser.runtime.sendMessage("getCommands");

browser.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.setCommands) {
    initCommands(message.setCommands);
  }
});

const initCommands = (commands: any[]) => {
  // console.log('init', commands);

  commands.forEach((command: { name: string; shortcut: string }) => {
    // console.log(command)

    Mousetrap.bind([command.shortcut], () => {
      // console.log('combination triggered!', command.shortcut);
      browser.runtime.sendMessage(command.name);
    });
  });

  // Mousetrap.bind(['mod+shift+up'], () => {
  //     console.log('combination triggered!', 'CUSTOM');
  //     browser.runtime.sendMessage('left-tab');
  // });
};
