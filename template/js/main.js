//=============================================================================
// main.js
//=============================================================================

ScriptLoader.setup($scripts);
ScriptLoader.checkErrors();

window.onload = function () {
  SceneManager.run(Scene_Boot);
}