const fs = require("fs");

const sharp = require("sharp");

const IMAGE_DIR = "../public/assets/images_/races";
const IMAGE_OUTDIR = "../public/assets/images/races";

const listFiles = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((dirent) =>
      dirent.isFile()
        ? [`${dir}/${dirent.name}`]
        : listFiles(`${dir}/${dirent.name}`),
    );

// delete old files
listFiles(IMAGE_OUTDIR).forEach((filePath) => {
  fs.unlink(filePath, function (err) {
    if (err) {
      throw err;
    }
    console.log(`deleted ${filePath}`);
  });
});

// profile 400 400
listFiles(IMAGE_DIR).forEach((filePath) => {
  const outPath = filePath.replace("images_", "images");

  const outFile = outPath.slice(0, -3) + "avif";
  // const globalRegex = new RegExp("profiles", "g");
  let size = 225;
  // if (globalRegex.test(outFile)) {
  //   size = 144;
  // }
  sharp(filePath)
    .resize({ fit: "cover", height: size })
    .avif({
      quality: 80,
    })
    .toFile(outFile, (err, info) => {
      if (err) {
        throw err;
      }
      console.log(outFile);
      console.log(`width: ${info.width}, height: ${info.height}`);
    });
});
