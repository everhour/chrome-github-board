document.body.classList.add('ghcb-on');

chrome.storage.sync.get(function(settings) {
    settings = Object.assign({
        compact: ['labels', 'milestone', 'everhour'],
        highlight: [
            {color: '#f9e6e6', filter: 'label:SUPPORT'},
            {color: '#e6f3f9', filter: 'label:FTR'},
        ]
    }, settings);

    observeChanges('.issue-card, .js-issue-number, .js-project-card-issue-link', () => {
        document.querySelectorAll('.issue-card:not(.ghcb-contains-number)').forEach(card => {
            const number = card.querySelector('.js-issue-number');

            if (!number) {
                return;
            }

            const flex = card.children[1];

            const numberSpan = document.createElement('SPAN');
            numberSpan.classList.add('ghcb-number');
            numberSpan.innerText = number.innerText;

            settings.highlight.forEach(item => {
                if (card.querySelector('[data-card-filter="' + item.filter + '"]')) {
                    numberSpan.style.backgroundColor = item.color;
                }
            });

            flex.insertBefore(numberSpan, flex.firstChild);

            card.classList.add('ghcb-contains-number');
        });
    });

    document.body.classList.add('ghcb-on');

    settings.compact.forEach(option => {
        document.body.classList.add('ghcb-hide-' + option);
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
        document.body.classList.toggle('ghcb-on', enabled);
        document.body.classList.toggle('ghcb-off', !enabled);
    };

    controls.insertBefore(switcher, controls.firstChild);
});