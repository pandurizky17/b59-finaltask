require("dotenv").config();
const express = require("express");
var session = require("express-session");
var flash = require("express-flash");
var methodOverride = require("method-override");
const path = require("path");
const hbs = require("hbs");
const { tech } = require("./utils/tech");
const upload = require("./middlewares/upload-file");

const {
  renderLogin,
  authLogin,
  renderRegister,
  authRegister,
  authLogout,
  renderBlog,
  renderBlogDetail,
  addBlog,
  renderBlogEdit,
  updateBlog,
  deleteBlog,
  renderHome,
  renderBlogAdd,
  renderContact,
  renderTestimonials,
  render404,
} = require("./controllers/controllers-v2");

const { formatDateToWIB, getRelativeTime } = require("./utils/time");
const { truncateText } = require("./utils/text");
const { sendAlert } = require("./utils/alert");

const app = express();
const PORT = process.env.SERVER_PORT || 5550;

app.use(express.json());
app.use(flash());

const env = process.env.NODE_ENV

// const cookieSetting = env === 'production' ? { 
//   secure: true, // required for cookies to work on HTTPS
//   httpOnly: false,
//   sameSite: 'none'
// } : {}

app.use(
  session({
    name: "my-session",
    secret: "personalweb", //  secret: process.env.SESSION_KEY,
    resave: true,
    saveUninitialized: false
  })
);

app.use(express.urlencoded({ extended: true }));
app.use("/assets", express.static(path.join(__dirname, "./assets")));
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));
app.use("/utils", express.static(path.join(__dirname, "./utils")));
app.use(methodOverride("_method"));

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./views"));

hbs.registerPartials(__dirname + "/views/partials", function (err) {});
hbs.registerHelper("formatDateToWIB", formatDateToWIB);
hbs.registerHelper("truncateText", truncateText);
hbs.registerHelper("getRelativeTime", getRelativeTime);
hbs.registerHelper("equal", function (a, b) {
  return a === b;
});
hbs.registerHelper("consolelog", function (log) {
  console.log(log);
});

hbs.registerHelper("ifEqualAndUserExist", function (user, userId, options) {
  if (user.id && user.id === userId) {
    return options.fn(this);
  } else {
    options.inverse(this);
  }
});

hbs.registerHelper("sendAlert", sendAlert);
hbs.registerHelper("getStack", tech);

app.get("/login", renderLogin);
app.get("/register", renderRegister);

app.post("/login", authLogin);
app.post("/register", authRegister);

app.get("/logout", authLogout);

app.get("/", renderHome);

app.get("/blog", renderBlog);
app.get("/blog-detail/:id", renderBlogDetail);
app.post("/blog", upload.single("image"), addBlog);
app.get("/blog-add", renderBlogAdd);
app.get("/blog-edit/:id", renderBlogEdit);
app.patch("/blog-update/:id", upload.single("image"), updateBlog);
app.delete("/blog-delete/:id", deleteBlog);

app.get("/contact", renderContact);
app.get("/testimonials", renderTestimonials);
app.get("*", render404);

app.listen(PORT, () => {
  console.log(`Server berjalan di port : ${PORT}`);
});
