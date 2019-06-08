var updateDownloadButton = function() {
    var patterns = {
        'OS X': /^.+[.]dmg$/,
        'Windows': /^.+[.]exe$/,
        'Linux': /^.+[.]AppImage$/
    }
    var linkElem = document.getElementById('download-link');
    var textElem = document.getElementById('download-text');

    var pattern = patterns[platform.os.family];
    if (!pattern) {
        if (linkElem) {
            linkElem.style.background = '#777';
        }
        if (textElem) {
            textElem.innerText = location.pathname === '/ja' ? 
                'Windows、Mac、Linuxから\nダウンロードしてください。'  : 'Please download from Windows, Mac or Linux';
        }
        return; 
    }

    var update = function(release) {
        var assets = release.assets.filter(function(asset) {
            return asset.name.match(pattern) !== null;
        });
        if (assets.length === 1) {
            var asset = assets[0];
            if (linkElem) {
                linkElem.setAttribute('href', asset.browser_download_url);
            }
            if (textElem) {
                var version = release.tag_name;
                var ext = asset.name.substring(asset.name.lastIndexOf('.') + 1);
                var text = textElem.innerText;
                var newText = text
                    .replace('Biscuit', 'Biscuit for ' + platform.os.family)
                    .replace('v1.0.0', version)
                    .replace('dmg', ext);
                textElem.innerText = newText;
            }
        } else {
            console.log('Can not detect an asset.'); 
        }
    };

    axios.get('https://api.github.com/repos/agata/dl.biscuit/releases/latest').then(function(res) {
        var release = res.data;
        update(release);
    });
};

updateDownloadButton();