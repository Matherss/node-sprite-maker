const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const config = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'config.json'), 'utf8'));
const WIDTH = config.width || 32;
const HEIGHT = config.height || 32;

async function start() {
  let files = fs.readdirSync(path.resolve('images')).map((item, i) => ({ input: './images/' + item, top: i * HEIGHT, left: 0, width: WIDTH, height: HEIGHT, className: 'at_' + path.parse(item).name, classStyle: `{background-position: 0px ${i * -HEIGHT}px;}`}))

  await sharp({
    create: {
      width: WIDTH,
      height: HEIGHT * files.length,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
  .composite(files)
  .toFile('sprite.png')

  let makeCss = `
  .at_sprite{
    overflow:hidden;
    background-repeat:no-repeat;
    background-image:url('./sprite.png');
    height:${HEIGHT}px; 
    width:${WIDTH}px;
    margin:0px; 
    padding: 0px;
    display:-moz-inline-box;
    display:inline-block; 
    vertical-align:middle;
  }

  ${files.map((el,i) => '.' + el.className + el.classStyle).join('\n')}
  `


  let html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <link rel="stylesheet" href="sprite.css">
  <body>
    ${files.map(el => `<span class="at_sprite ${el.className}"></span><input type="text" style="width: 600px" value=\'<span class="at_sprite ${el.className}"></span>'>`).join('<br>')}
  </body>
  </html>`
  fs.writeFileSync('sprite.css', makeCss)
  fs.writeFileSync('demo.html', html)

}
module.exports = start