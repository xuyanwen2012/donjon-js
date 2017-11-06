function ScriptLoader() {
  throw new Error('This is a static class');
}

ScriptLoader.loadedScripts = new Map();
ScriptLoader.scripts = [];
ScriptLoader.errorUrls = [];

ScriptLoader.path = 'data/scripts/';

/**
 * @param plugins {Array.<Object>}
 */
ScriptLoader.setup = function (plugins) {
  plugins.forEach(function (plugin) {
    console.log(this.scripts);
    if (!this.scripts.contains(plugin.name)) {
      this.loadScript(plugin.name + '.js');
      this.scripts.push(plugin.name);
    }
  }, this);
};

ScriptLoader.loadScript = function (name) {
  var url = this.path + name;
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  script.async = false;
  script.onerror = this.onError.bind(this);
  script._url = url;
  document.body.appendChild(script);
};

/**
 * @param e {Error}
 */
ScriptLoader.onError = function (e) {
  this.errorUrls.push(e.target._url);
};

ScriptLoader.checkErrors = function () {
  var url = this.errorUrls.shift();
  if (url) {
    throw new Error('Failed to load: ' + url);
  }
};

ScriptLoader.onLoad = function (loaded) {
  console.log(loaded);
}