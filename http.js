const { createServer } = require("http");
const { stat, createReadStream } = require("fs");
const { promisify } = require("util");
const filename = "../../De cero a multibagger Clase 4 pt3.mp4";
const fileInfo = promisify(stat);

createServer(async (req, res) => {
  const { size } = await fileInfo(filename);
  const range = req.headers.range;

  if (range) {
    let [start, end] = range.replace(/bytes=/, "").split("-");
    start = parseInt(start, 10);
    end = end ? parseInt(end, 10) : size - 1;
    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": start - end + 1,
      "Content-type": "video/mp4",
    })
    createReadStream(filename,{start,end}).pipe(res);
  } else {
    res.writeHead(200, {
      "Content-Length": size,
      "Content-Type": "video/mp4",
    });
    createReadStream(filename).pipe(res);
  }

  console.log("range:", range);

  
}).listen(5050, () => console.log("Server listening on port 5050"));
