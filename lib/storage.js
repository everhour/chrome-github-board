const GitHubCompactBoardStorage = function (defaults) {
    this.set = function(settings) {
        chrome.storage.sync.set(settings);
    };

    this.get = function() {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(settings => resolve(Object.assign(defaults, settings)));
        });
    };
};

window.gcbStorage = new GitHubCompactBoardStorage({
    compact: ['labels', 'milestone', 'everhour'],
    highlight: [
        {color: '#f9e6e6', filter: 'label:SUPPORT'},
        {color: '#e6f3f9', filter: 'label:FTR'},
    ],
    issue: {
        showPulls: true,
        hideLog: false,
        parseZpl: true
    }
});
