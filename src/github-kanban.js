document.body.classList.add('ghcp-on');

const settings = {
    highlight: [
        {color: '#f9e6e6', filter: 'label:SUPPORT'},
        {color: '#e6f3f9', filter: 'label:FTR'},
    ]
};

observeChanges('.issue-card, .js-issue-number, .js-project-card-issue-link', () => {
    document.querySelectorAll('.issue-card:not(.ghcp-contains-number)').forEach(card => {
        const number = card.querySelector('.js-issue-number');

        if (!number) {
            return;
        }

        const flex = card.children[1];

        const numberSpan = document.createElement('SPAN');
        numberSpan.classList.add('ghcp-number');
        numberSpan.innerText = number.innerText;

        settings.highlight.forEach(item => {
            if (card.querySelector('.issue-card-label[data-card-filter="' + item.filter + '"]')) {
                numberSpan.style.backgroundColor = item.color;
            }
        });

        flex.insertBefore(numberSpan, flex.firstChild);

        card.classList.add('ghcp-contains-number');
    });
});

observeChanges('.project-header-controls:not(.ghcb-contains-switcher)', () => {
    const controls = document.querySelector('.project-header-controls');

    const switcher = document.createElement('DIV');
    switcher.classList.add('ghcb-switcher');

    switcher.innerHTML = `
        <select id="ghcb-switcher">
            <option value="on" selected>Compact: ON</option>
            <option value="off">Compact: OFF</option>
        </select>
    `;

    switcher.onchange = () => {
        const enabled = document.querySelector('#ghcb-switcher').selectedIndex === 0;
        document.body.classList.toggle('ghcp-on', enabled);
        document.body.classList.toggle('ghcp-off', !enabled);
    };

    controls.insertBefore(switcher, controls.firstChild);
});