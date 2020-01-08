const save = function() {
    const settings = {
        compact: [],
        highlight: [],
        issue: {
            showPulls: document.querySelector('input[name="issue-show-pulls"]').checked,
            hideLog: document.querySelector('input[name="issue-hide-log"]').checked,
            parseZpl: document.querySelector('input[name="issue-parse-zpl"]').checked
        }
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

    gcbStorage.set(settings);

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

gcbStorage.get().then(settings => {
    settings.compact.forEach(name => {
        document.querySelector('input[name="hide-' + name + '"]').checked = true;
    });

    document.querySelector('input[name="issue-show-pulls"]').checked = settings.issue.showPulls;
    document.querySelector('input[name="issue-hide-log"]').checked = settings.issue.hideLog;
    document.querySelector('input[name="issue-parse-zpl"]').checked = settings.issue.parseZpl;

    document.querySelectorAll('input').forEach(input => input.addEventListener('change', () => save()));

    document.querySelector('.hl-add-item').addEventListener('click', () => addHighlightItem());

    (settings.highlight || []).forEach(item => addHighlightItem(item.color, item.filter));
});
