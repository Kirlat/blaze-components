window.addEventListener('load', function() {
    var selector = '[data-blaze-fold-open]',
        className = 'open',
        elements = document.querySelectorAll(selector),
        target;

    for (var i = 0; i < elements.length; i++) {
        target = elements[i];
        target.addEventListener('click', openToggler.bind(null, target));
    }

    function openToggler(target) {
        console.log(target);
        target.classList.toggle(className);
    }
});