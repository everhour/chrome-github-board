const save = function() {
    const settings = {
        compact: [],
        highlight: [],
    };

    ['labels', 'milestone', 'assignees', 'everhour'].forEach(name => {
        if (document.querySelector('input[name="hide-' + name + '"]').checked) {
            settings.compact.push(name);
        }
    });

    document.querySelectorAll('.highlight-item').forEach(item => {
        settings.highlight.push({
            color: item.querySelector('input[name="color"]').value,
            filter: item.querySelector('input[name="filter"]').value
        });
    });

    chrome.storage.sync.set(settings);

    return false;
};

const addHighlightItem = (color, filter) => {
    color = color || '#f9e6e6';
    filter = filter || 'label:BUG';

    const child = document.createElement('DIV');
    child.classList.add('highlight-item');

    child.innerHTML = `
        <span class="color-preview"></span>
        <input name="color" value="${color}" placeholder="Color...">
        <input name="filter" value="${filter}" placeholder="Filter...">
        <button class="hl-remove-item" type="button">Remove</button>
    `;

    child.querySelector('button').addEventListener('click', () => child.remove());

    child.querySelectorAll('input').forEach(input => input.addEventListener('change', () => save()));
    child.querySelectorAll('input').forEach(input => input.addEventListener('input', () => save()));

    child.querySelector('.color-preview').style.backgroundColor = color;
    child.querySelector('input[name="color"]').addEventListener('input', () => {
        child.querySelector('.color-preview').style.backgroundColor = child.querySelector('input[name="color"]').value;
    });

    document.querySelector('.highlight').appendChild(child);

    return false;
};

chrome.storage.sync.get(function(settings) {
    settings = Object.assign({
        compact: ['labels', 'milestone', 'everhour'],
        highlight: [
            {color: '#f9e6e6', filter: 'label:SUPPORT'},
            {color: '#e6f3f9', filter: 'label:FTR'},
        ]
    }, settings);

    settings.compact.forEach(name => {
        document.querySelector('input[name="hide-' + name + '"]').checked = true;
    });

    document.querySelectorAll('input').forEach(input => input.addEventListener('change', () => save()));

    document.querySelector('.hl-add-item').addEventListener('click', () => addHighlightItem());

    (settings.highlight || []).forEach(item => addHighlightItem(item.color, item.filter));
});