// Narrow repairs for archived exports. Keep engine code and asset keys intact.
export function repairGameExport(text, url) {
  const pathname = url?.pathname || '';
  let output = text;
  if (pathname === '/cdn/basketball-stars/assets/main.min.js') {
    // This archived Base64 decoder has Windows-1252 mojibake in its byte
    // ranges. Express the original UTF-8 byte ranges as ASCII escapes.
    output = output.replace(/re_btou=new RegExp\(\[[\s\S]*?\]\.join\("\|"\),"g"\)/,
      () => 're_btou=new RegExp(["[\\xC0-\\xDF][\\x80-\\xBF]","[\\xE0-\\xEF][\\x80-\\xBF]{2}","[\\xF0-\\xF7][\\x80-\\xBF]{3}"].join("|"),"g")');
  }
  if (pathname === '/cdn/bouncemasters/game.js') {
    output = output.replace('(n = M.Z.getSupportedLocales(et.j)).indexOf(r)',
      '(r = typeof r === "string" ? r : (navigator.language || "en"), n = M.Z.getSupportedLocales(et.j)).indexOf(r)');
  }
  if (pathname === '/cdn/bolly-beat/index.html' && !output.includes('/__nebulo/platform.js')) {
    output = output.replace('</head>', '<script src="/games/platinum/__nebulo/platform.js"></script></head>');
  }
  if (/\.loader\.js$/i.test(pathname)) {
    // These loaders include Brotli themselves, but the browser may already have
    // decoded Content-Encoding: br. Recognize both Unity data and WASM headers.
    output = output.replace(/decompress\(Buffer\.from\((\w+)\)\)/g,
      '((b)=>((b[0]===85&&b[1]===110&&b[2]===105&&b[3]===116)||(b[0]===0&&b[1]===97&&b[2]===115&&b[3]===109))?b:decompress(b))(Buffer.from($1))');
  }
  if (/\/(?:bolly-beat|color-burst-3d)\/__loading__\.js$/.test(pathname)) {
    output = output.replace(/(splash|logo)\.parentElement\.removeChild\(\1\)/g,
      '$1?.remove()');
  }
  if (/\/crossy-?road\/index\.html$/.test(pathname) && output.includes('bootstrap.min.js')) {
    output = output.replace(/<script\b[^>]*src=["']scripts\/game\.min\.js["'][^>]*>\s*<\/script>/gi, '');
  }
  if (/\/motox3m-(?:pool|spooky|winter)\/index\.html$/.test(pathname)
      && !/id\s*=\s*["']content["']/.test(output)) {
    output = output.replace(/<body\b/, '<body id="content"');
  }
  if (/\/index\.html$/.test(pathname)) {
    output = output.replace(/onload=["']check\(\);?["']/gi,
      'onload="if(typeof check===\'function\')check();"');
  }
  if (pathname === '/cdn/undertale/index.html') {
    // The optional background multiplayer worker was not included in this
    // export. Do not let its missing template throw during single-player boot.
    output = output.replace(/(<script\b[^>]*>)(\s*const blob = new Blob\(\[document\.querySelector\('#tick-worker'\)\.textContent\]\);[\s\S]*?)(<\/script>)/,
      "$1if(document.querySelector('#tick-worker')){$2}$3");
  }
  return output;
}
