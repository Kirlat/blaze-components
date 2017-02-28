var blaze = blaze || {};

blaze.components.WpPostList = function (element) {
    var self;

    this.element = element;
    this.template = this.element.dataset.template;
    this.quantity = (parseInt(this.element.dataset.quantity, 10))? this.element.dataset.quantity: 10;
    this.currentPage = 1;
    this.categories = this.element.dataset.categoryName;
    if (this.categories) {
        this.categories = this.categories.split(',');
        this.categories = this.categories.map(function (str) {
            return str.trim();
        });
    }
    this.categoryIDs = [];
    this.data = { posts: [] };
    this.lastPage = false; // Whether this is the last page of data
    this.loadMoreSelector = '[data-load-more]';
    this.loadMoreHandler = blaze.components.WpPostList.prototype.loadMore.bind(this);

    if (this.categories) {
        self = this;
        // If filtered  by categories, get category IDs by their slug first. Without it, we won't be ably to filter by them
        // Since filter by category slug has been removed from WP API (WP 4.7), we have to make this additional request
        blaze.components.getWpApiData('/wp-json/wp/v2/categories').then( function (categoryData) {
            var i, j;
            for (i = 0; i < categoryData.length; i++) {
                for (j = 0; j < self.categories.length; j++) {
                    if (categoryData[i].slug === self.categories[j]) {
                        self.categoryIDs.push(categoryData[i].id);
                    }
                }
            }
            self.load();
        });
    }
    else {
        this.load();
    }
};

blaze.components.WpPostList.prototype.getDataURL = function () {
    var i,
        url = '/wp-json/wp/v2/posts?_embed&page=' + this.currentPage + '&per_page=' + this.quantity;

    if (this.categoryIDs.length) {
        for (i = 0; i < this.categoryIDs.length; i++) {
            url += '&categories[]=' + this.categoryIDs[i];
        }
    }
    return url;
};

blaze.components.WpPostList.prototype.populateData = function (data) {
    var i;
    for (i = 0; i < data.length; i++) {
        this.data.posts.push({
            title: data[i].title.rendered,
            content: data[i].content.rendered,
            excerpt: data[i].excerpt.rendered,
            link: data[i].link
        });
    }
};

blaze.components.WpPostList.prototype.render = function () {
    if (this.loadMore && this.loadMore.onclick) {
        // Remove previous onclick handler if exists
        this.loadMore.onclick = null;
    }
    this.element.innerHTML = this.template(this.data);
    this.loadMore = this.element.querySelector(this.loadMoreSelector);
    if (this.loadMore) {
        if (!this.lastPage) {
            this.loadMore.onclick = this.loadMoreHandler; // Attach onclick handler for new content
        }
        else {
            // Hide a load more element
            this.loadMore.style.display = "none";
        }

    }

    blaze.components.renderComplete();
};

blaze.components.WpPostList.prototype.load = function () {
    var self = this,
        dataRqst = blaze.components.getWpApiData(this.getDataURL()),
        templateRqst = blaze.components.loadTemplate(this.template);

    Promise.all([templateRqst, dataRqst]).then(
        function(values) {
            self.template = Handlebars.compile(values[0]);
            self.populateData(values[1]);
            if (values[1].length < self.quantity) {
                // This is the last page of data
                self.lastPage = true;
            }
            // TODO: Avoid re-rendering the whole component
            self.render();
        },
        function(rejection) {
            console.error('Failed:', rejection)
        }
    );
};

blaze.components.WpPostList.prototype.loadMore = function () {
    var self = this,
        dataRqst;

    this.currentPage++;
    dataRqst = blaze.components.getWpApiData(this.getDataURL());

    dataRqst.then(
        function(values) {
            self.populateData(values);
            self.render();
        },
        function(rejection) {
            console.error('Failed:', rejection)
        }
    );
};