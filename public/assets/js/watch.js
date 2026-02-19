// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    var frame = document.getElementById("frame");
    if (!frame) {
        console.error("Iframe with id 'frame' not found");
        return;
    }

    var targetUrl = "https://sentinel.home.kg";
    var fallbackUrl = targetUrl;

    if (typeof __uv$config !== "undefined" && __uv$config?.encodeUrl) {
        fallbackUrl = __uv$config.prefix + __uv$config.encodeUrl(targetUrl);
    }

    Promise.resolve(
        window.proxyEncoder && typeof window.proxyEncoder.encode === "function"
            ? window.proxyEncoder.encode(targetUrl, "sj")
            : fallbackUrl
    )
        .catch(function() {
            return fallbackUrl;
        })
        .then(function(encodedUrl) {
            var url = encodedUrl || fallbackUrl;
            localStorage.setItem("url", url);
            frame.setAttribute("src", url);
        });
});
