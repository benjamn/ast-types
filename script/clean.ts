import fs from "fs";
import glob from "glob";

const ext = "{js,d.ts}";

glob.sync("{def,lib,script,gen}/**/*." + ext)
  .concat(glob.sync("test{*,/!(data)/**}/*." + ext))
  .concat(glob.sync("{fork,main,types}." + ext))
  .forEach(filename => {
    if (fs.existsSync(filename)) {
      fs.unlinkSync(filename);
    }
  });
