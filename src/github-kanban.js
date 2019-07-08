document.body.classList.add('evh-compact');

observeChanges('.issue-card, .js-issue-number, .js-project-card-issue-link', () => {
    document.querySelectorAll('.issue-card:not(.evh-contains-number)').forEach(card => {
        const number = card.querySelector('.js-issue-number');

        if (!number) {
            return;
        }

        const flex = card.children[1];

        const numberSpan = document.createElement('SPAN');
        numberSpan.classList.add('evh-number');
        numberSpan.innerText = number.innerText;

        flex.insertBefore(numberSpan, flex.firstChild);

        card.classList.add('evh-contains-number');

        if (card.querySelector('.issue-card-label[data-card-filter="label:SUPPORT"]')) {
            card.classList.add('evh-important-issue');
        }
    });
});