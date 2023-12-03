// Set a flag to check if onActivated event is triggered.
let updatedEventTriggered = false;      
function onActivatedListener() {
    updatedEventTriggered = true;
}
browser.tabs.onActivated.addListener(onActivatedListener);


// Listener to close or create tabs.
browser.runtime.onMessage.addListener((message, sender) => {
    if (message.action === 'closeTab') {
        browser.tabs.remove(sender.tab.id);
        setTimeout(function() {
            if (!updatedEventTriggered) {
                // Run if onActivated event was not triggered.
                browser.tabs.create({ url: message.url });
            };
        }, 500);
        updatedEventTriggered = false;
    } else if (message.action === 'updateTab') {
        browser.tabs.update(sender.tab.id, { url: message.url });
    } else if (message.action === 'createTab') {
        browser.tabs.create({ url: message.url });
    } else if (message.action === 'duplicateTab') {
        browser.tabs.create({ url: message.url, active: false });
    };
});


// Define the default values.
const defaultVariables = {
    homepageURL: 'https://web.tabliss.io',
    newTabURL: 'https://web.tabliss.io',
    toolbarHeight: '42',
    defaultPosition: 'bottom',
    iconTheme: 'featherIcons',
    hideMethod: 'scroll',
    buttonOrder: ['homeButton', 'duplicateTabButton', 'hideButton', 'moveToolbarButton', 'closeTabButton', 'newTabButton'],
    checkboxStates: {
        'homeButton': true,
        'duplicateTabButton': true,
        //'menuButton': true,
        'closeTabButton': true,
        'newTabButton': true,
        'hideButton': true,
        'moveToolbarButton': true,
    },
};

browser.storage.sync.get(['homepageURL', 'newTabURL', 'toolbarHeight', 'defaultPosition', 'iconTheme', 'hideMethod', 'buttonOrder', 'checkboxStates']).then((result) => {
    if (!result.homepageURL) {
        browser.storage.sync.set({ homepageURL: defaultVariables.homepageURL });
    }
    if (!result.newTabURL) {
        browser.storage.sync.set({ newTabURL: defaultVariables.newTabURL });
    }
    if (!result.toolbarHeight) {
        browser.storage.sync.set({ toolbarHeight: defaultVariables.toolbarHeight });
    }
    if (!result.defaultPosition) {
        browser.storage.sync.set({ defaultPosition: defaultVariables.defaultPosition });
    }
    if (!result.iconTheme) {
        browser.storage.sync.set({ iconTheme: defaultVariables.iconTheme });
    }
    if (!result.hideMethod) {
        browser.storage.sync.set({ hideMethod: defaultVariables.hideMethod });
    }
    // Check if button order is not set or is empty, then set the default
    if (!result.buttonOrder || result.buttonOrder.length === 0) {
        browser.storage.sync.set({ buttonOrder: defaultVariables.buttonOrder });
    }
    // Check if checkbox states are not set or are empty, then set the default
    if (!result.checkboxStates || Object.keys(result.checkboxStates).length === 0) {
        browser.storage.sync.set({ checkboxStates: defaultVariables.checkboxStates });
    }
});


