var site = {
    loadJs: function(src) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = src;
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
    }
};
