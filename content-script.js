let timer;
window.addEventListener('scroll', function() {
    clearTimeout(timer);
    timer = setTimeout(main, 200);
});

function main() {
    function queryNodes(pattern) {
        let elems = document.querySelectorAll('img')
        return Array.from(elems).filter((elem) => {
            return pattern.test(elem.src);
        })
    }

    function extractParam(elems, pattern) {
        for (const elem of elems) {
            let param = pattern.exec(elem.src)
            if (param != null) return param[1]
        }
        return null;
    }

    function hideOverlay() {
        let stickyElem = document.querySelector("main aside.sticky")
        if (stickyElem != null) stickyElem.style.display = 'none'
    }

    function replaceParam(elem, param) {
        let startIndex = elem.src.indexOf("&image=") + "&image=".length;
        let altered = (elem.src.substring(0, startIndex) + param).replace(/(?<=f=webp&w=)\d+(?=&q)/, 1920) + "&gravity=bottom"
        elem.src = altered
        elem.closest('div')?.removeAttribute('class')
    }

    function execInjection(elems, param) {
        Array.from(elems).forEach(elem => {
            replaceParam(elem, param)
        });
    }

    function queryAndPro(pattern) {
        hideOverlay();

        let elems = queryNodes(pattern)
        if (elems.length === 0) return;
        
        let param = extractParam(elems, pattern)
        execInjection(elems, param)
    }

    let pattern = /^https:\/\/bytescale\.mobbin\.com\/\w+\/image\/content\/app_screens\/\S{8}-\S{4}-\S{4}-\S{4}-\S{12}\.\S{3,4}\?f=\S{3,4}\&w=\d{1,4}\&q=\d{2,3}&fit=shrink-cover&extend-bottom=120&image=([^&]+).*$/
    queryAndPro(pattern);
}