const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;

const bufChunkSizeMax = (Math.pow(2, 30)); // 1 gb

const writeBuf = (writeStream, size, fin) => {
	let writeSize = size;
	let writeCb = fin;
	if (size > bufChunkSizeMax) {
		writeSize = bufChunkSizeMax;
		size -= bufChunkSizeMax;
		writeCb = writeBuf.bind(null, writeStream, size, fin);
	}
	writeStream.write(new Buffer(writeSize), writeCb);
}

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

app.get("/dl", (req, res) => {
	let sizeStr = req.query["size"] || "0";
	let size = parseInt(sizeStr);
	writeBuf(res, size, () => res.end());
});

app.listen(PORT, () => console.log(`Server listening in on port ${PORT}`));
