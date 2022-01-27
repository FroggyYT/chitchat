const cookieParser = require("cookie-parser");

const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static(`${__dirname}/dist`));

app.use(cookieParser());
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server started on http://localhost${PORT != 80 ? ":"+PORT : ""}/`);
});