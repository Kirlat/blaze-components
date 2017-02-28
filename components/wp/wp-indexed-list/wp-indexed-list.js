var blaze = blaze || {};

blaze.components.WpIndexedList = function (element) {
    this.element = element;
    this.template = this.element.dataset.template;
    this.categories = this.element.dataset.categoryName;
    if (this.categories) {
        this.categories = this.categories.split(',');
        this.categories = this.categories.map(function (str) {
            return str.trim();
        });
    }
    this.data = { index: [], list: [] };

    this.load();
};

blaze.components.WpIndexedList.prototype.getDataURL = function () {
    var i;
    var requestUrl = '/wp-json/blaze/v1/list/';

    if (this.categories) {
        for (i = 0; i < this.categories.length; i++) {
            if (requestUrl.charAt(requestUrl.length - 1) === '/') {
                requestUrl += '?'
            }
            else {
                requestUrl += '&'
            }
            requestUrl += 'category_name[]=' + this.categories[i];
        }
    }
    return requestUrl;
};

blaze.components.WpIndexedList.prototype.populateData = function (data) {
    var i,
        group,
        index,
        refId,
        indexArr = [],
        grouped = {},
        classes;

    if (!data) {
        // Do nothing if no data provided
        return;
    }
    for (i = 0; i < data.length; i++) {
        index =data[i].title.charAt(0);
        if (indexArr.indexOf(index) < 0) {
            // This index value has not been added to the index array yet
            indexArr.push(index);
            grouped[index] = { list: [] };
        }

        grouped[index].list.push({
            title: data[i].title,
            url: data[i].url
        });
    }

    // Sort indexes
    indexArr.sort();
    // Sort list itmes
    for (group in grouped) {
        if (grouped.hasOwnProperty(group)) {
            grouped[group].list.sort(blaze.components.WpIndexedList.sortListItems);
        }
    }

    for (i = 0; i < indexArr.length; i++) {
        classes = (i == 0)? 'active': '';
        refId = 'id-c' + indexArr[i].charCodeAt(0);
        this.data.index.push({
            value: indexArr[i],
            refId: refId,
            classes: classes
        });

        this.data.list.push({
            index: indexArr[i],
            refId: refId,
            classes: classes,
            items: grouped[indexArr[i]].list
        });
    }
};

blaze.components.WpIndexedList.sortListItems = function (a, b) {
    if (a.title < b.title) {
        return -1;
    }
    if (a.title > b.title) {
        return 1;
    }
    return 0;
};

blaze.components.WpIndexedList.prototype.render = function () {
    this.element.innerHTML = this.template(this.data);
};

blaze.components.WpIndexedList.prototype.load = function () {
    var self = this,
        dataRqst = blaze.components.getWpApiData(this.getDataURL()),
        templateRqst = blaze.components.loadTemplate(this.template);

    Promise.all([templateRqst, dataRqst]).then(
        function(values) {
            self.template = Handlebars.compile(values[0]);
            self.populateData(values[1]);
            self.render();
        },
        function(rejection) {
            console.error('Failed:', rejection)
        }
    );
};