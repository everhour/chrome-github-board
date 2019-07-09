document.body.classList.add('ghci-on');

observeChanges('.ajax-pagination-btn', () => {
    document.querySelectorAll('.ajax-pagination-btn')
        .forEach(button => button.click());
});

const links = {};

observeChanges('h4 a[data-hovercard-type="pull_request"]', () => {
    document.querySelectorAll('h4 a[data-hovercard-type="pull_request"]')
        .forEach((link) => {
            const url = link.getAttribute('href');
            const issue = link.querySelector('.issue-num').innerHTML.trim();
            const title = link.textContent.replace(issue, '').trim();


            if (links.hasOwnProperty(url) === false) {
                links[url] = {
                    url,
                    title,
                    issue,
                }
            }
        });

    const header = document.querySelector('.gh-header-meta');
    let pullRequests = document.querySelector('.ghci-pull-requests');

    if (!pullRequests) {
        pullRequests = document.createElement('DIV');
        pullRequests.classList.add('ghci-pull-requests');

        header.parentNode.appendChild(pullRequests);
    }

    pullRequests.innerHTML = Object.keys(links).length > 0 ? '' : `-`;

    Object.keys(links).forEach((key) => {
        const link = links[key];

        pullRequests.innerHTML += `
            <div class="discussion-item-ref-title">
                <a href="${link.url}" target="_blank" class="title-link">
                    <span>${link.title}</span>
                    <span class="issue-num">${link.issue}</span>
                </a>
            </div>
        `;
    });

    pullRequests.innerHTML = '<div class="ghci-pull-requests-title">Pull requests:</div>' + pullRequests.innerHTML;
});

observeChanges('.gh-header-meta:not(.ghci-contains-switcher)', () => {
    const controls = document.querySelector('.gh-header-meta');

    const switcher = document.createElement('DIV');
    switcher.classList.add('ghci-switcher');

    switcher.innerHTML = `
        <select id="ghci-switcher">
            <option value="on" selected>Compact: ON</option>
            <option value="off">Compact: OFF</option>
        </select>
    `;

    switcher.onchange = () => {
        const enabled = document.querySelector('#ghci-switcher').selectedIndex === 0;
        document.body.classList.toggle('ghci-on', enabled);
        document.body.classList.toggle('ghci-off', !enabled);
    };

    controls.appendChild(switcher);
});