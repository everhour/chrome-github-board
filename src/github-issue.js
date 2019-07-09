document.body.classList.add('ghci-hide-logs');
document.body.classList.add('ghci-show-pulls');

gcbStorage.get().then(settings => {
    document.body.classList.toggle('ghci-hide-logs', settings.issue.hideLog);
    document.body.classList.toggle('ghci-show-pulls', settings.issue.showPulls);

    if (settings.issue.showPulls || settings.issue.hideLog) {
        // load collapsed items
        setTimeout(() => {
            observeChanges('.ajax-pagination-btn', () => {
                document
                    .querySelectorAll('.ajax-pagination-btn')
                    .forEach(button => button.click());
            })
        });
    }

    if (settings.issue.showPulls) {
        observeChanges('h4 a[data-hovercard-type="pull_request"]', () => {
            const html = Array
                .from(document.querySelectorAll('h4 a[data-hovercard-type="pull_request"]'))
                .map(link => {
                    const url = link.getAttribute('href');
                    const matches = url.match(/\/([^\/]*?)\/pull\/(\d+)/);
                    const isOpen = !!link.parentElement.parentElement.querySelector('.State.State--green');

                    return {
                        url,
                        title: matches[1] + '#' + matches[2],
                        state: isOpen ? 'State--purple' : ''
                    };
                })
                .filter((link, index, links) => links.indexOf(link) === index)
                .map(pull => `
                    <a href="${pull.url}" target="_blank" class="State ${pull.state}">
                        ${pull.title}
                    </a>
                `)
                .join(' ');

            const header = document.querySelector('.gh-header-meta');
            if (header) {
                renderElement('ghci-pull-requests', html, element => header.appendChild(element));
            }

            const stickyHeader = document.querySelector('.sticky-content .meta');
            if (stickyHeader) {
                renderElement('ghci-pull-requests-sticky', html, element => stickyHeader.parentElement.insertBefore(element, stickyHeader));
            }
        });
    }
});

const renderElement = (className, html, create) => {
    let element = document.querySelector('.' + className);

    if (!element) {
        element = document.createElement('DIV');
        element.classList.add(className);
        create(element);
    }

    element.innerHTML = html;
};
