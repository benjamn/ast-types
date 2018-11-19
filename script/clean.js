const fs = require("fs");
const glob = require("glob");

const ext = "{js,js.map,d.ts,d.ts.map}";

glob.sync("{def,lib}/**/*." + ext)
  .concat(glob.sync("test{*,/!(data)/**}/*." + ext))
  .concat(glob.sync("{fork,main,types}." + ext))
  .forEach(filename => {
    if (fs.existsSync(filename)) {
      fs.unlinkSync(filename);
    }
  });
