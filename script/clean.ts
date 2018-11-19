import fs from "fs";
import glob from "glob";

const ext = "{js,js.map,d.ts,d.ts.map}";

glob.sync("{def,lib,script}/**/*." + ext)
  .concat(glob.sync("gen/**/*"))
  .concat(glob.sync("test{*,/!(data)/**}/*." + ext))
  .concat(glob.sync("{fork,main,types}." + ext))
  .forEach(filename => {
    if (fs.existsSync(filename)) {
      fs.unlinkSync(filename);
    }
  });
