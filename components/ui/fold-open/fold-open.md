### Fold-Open

Fold-Open component reveals its inner content when clicked on. A second click will hide its inner content. If hovered over, it opens slightly allowing to pick at what's inside.

This component uses CSS3 animations and some JavaScript to switch between opened and closed states. In open state, a `.open` class is assigned at the top-level component's HTML element.

Please note that currently content of both front end and back end parts of the component has been provided twice. This is because the same content should be shown on both sides at the left and at the right from the fold.

Here is how the minimal HTML of the component looks:

```
@example
<div class="blaze-fold-open blaze-fold-open--default" data-blaze-fold-open>
    <div class="blaze-fold-open__item-wrapper-front">
        <div class="blaze-fold-open__item-mask-left-front">
            <div class="blaze-fold-open__item-inner-left-front">
                <p>Front end content goes here</p>
            </div>
        </div>
        <div class="blaze-fold-open__item-mask-right-front">
            <div class="blaze-fold-open__item-inner-right-front">
                <p>Front end content goes here</p>
                <span class="blaze-fold-open__item-inner-shadow"></span>
            </div>
        </div>
    </div>
    <div class="blaze-fold-open__item-wrapper-back">
        <div class="blaze-fold-open__item-mask-left-back">
            <div class="blaze-fold-open__item-inner-left-back">
                <p>Back end content goes here</p>
            </div>
        </div>
        <div class="blaze-fold-open__item-mask-right-back">
            <div class="blaze-fold-open__item-inner-right-back">
               <p>Back end content goes here</p>
            </div>
        </div>
    </div>
</div>
```

CSS styles: [fold-open.scss](../components/ui/fold-open/fold-open.scss)

JavaScript: [fold-open.js](../components/ui/fold-open/fold-open.js)