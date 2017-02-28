var blaze = blaze || {};
blaze.utils = blaze.utils || {};

/**
 * Sets all columns with 'data-blaze-eqht-col' attribute to have equal height, if their group number is the same.
 * Usage:
 * add data-blaze-eqht="group_number" to elements that must have equal height.
 * group_number is an integer starting from 1 and up to the maximum group number on a page
 */
blaze.utils.equalHeightColumns = function () {
    var currentGroup,
        groupQty = 0,
        i,
        j,
        currentHeight,
        tallest,
        group;

    // Remove all values set previously
    group = document.querySelectorAll('[data-blaze-eqht]');
    for (i = 0; i < group.length; i++) {
        // Find number of columns present
        currentGroup = group[i].dataset.blazeEqht;
        if (currentGroup > groupQty) {
            groupQty = currentGroup;
        }
    }

    for (i = 1; i <= groupQty; i++) {
        currentHeight = 0;
        tallest = 0;
        group = document.querySelectorAll("[data-blaze-eqht='" + i + "']");
        for (j = 0; j < group.length; j++) {
            currentHeight = group[j].clientHeight;
            if (currentHeight > tallest) tallest = currentHeight;
        }
        for (j = 0; j < group.length; j++) {
            group[j].style.minHeight = tallest + 'px';
        }
    }
};