const { Sequelize, QueryTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const config = require("../config/config.json");
const { Blog, User } = require("../models");

const saltRounds = 10;
const env = process.env.NODE_ENV || "production";
const sequelize = new Sequelize(config.production[env]);

async function authRegister(req, res) {
  const { username, email, password } = req.body;
  if (!username) {
    req.flash("error", "Username Tidak Boleh Kosong");
    return res.redirect("/register");
  }
  if (!email) {
    req.flash("error", "Email Tidak Boleh Kosong");
    return res.redirect("/register");
  }
  if (!password) {
    req.flash("error", "Password Tidak Boleh Kosong");
    return res.redirect("/register");
  }

  const isUsername = await User.findOne({ where: { username } });
  if (isUsername) {
    req.flash(
      "error",
      "Username Sudah Terdaftar Silahkan Masukkan Username yang lain"
    );
    return res.redirect("/register");
  }

  const isEmail = await User.findOne({ where: { email } });
  if (isEmail) {
    req.flash(
      "error",
      "Email Sudah Terdaftar Silahkan Masukkan Email Yang Lain"
    );
    return res.redirect("/register");
  }
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  req.flash("success", "Berhasil mendaftar akun. Silahkan login.");
  res.redirect("/login");
}

async function authLogin(req, res) {
  const { email, password } = req.body;

  // check if user exist
  const user = await User.findOne({
    where: {
      email: email,
    },
  });

  if (!user) {
    req.flash("error", "User tidak ditemukan.");
    return res.redirect("/login");
  }

  // check if password is correct
  const isValidated = await bcrypt.compare(password, user.password);

  if (!isValidated) {
    req.flash("error", "Password dismatch.");
    return res.redirect("/login");
  }

  let loggedInUser = user.toJSON();

  delete loggedInUser.password;

  req.session.user = loggedInUser;

  req.flash("success", "Berhasil login");
  res.redirect("/");
}

function authLogout(req, res) {
  req.session.user = null;

  res.redirect("/login");
}

function renderHome(req, res) {
  const user = req.session.user;
  res.render("index", { user });
}

function renderLogin(req, res) {
  const user = req.session.user;

  if (user) {
    res.redirect("/");
  } else {
    res.render("auth-login");
  }
}

function renderRegister(req, res) {
  const user = req.session.user || null;

  if (user) {
    res.redirect("/");
  } else {
    res.render("auth-register");
  }
}

async function renderBlog(req, res) {
  let { user } = req.session;

  console.log("user yg sedang login", user);

  const blogs = await Blog.findAll({
    include: {
      model: User,
      as: "user",
      attributes: { exclude: ["password"] },
    },
    order: [["createdAt", "DESC"]],
  });
  const node = blogs[0].technologies.includes("NodeJs"); //trueNodeJs
  const react = blogs[0].technologies.includes("ReactJs"); //true
  const next = blogs[0].technologies.includes("NextJs"); //true
  const typescript = blogs[0].technologies.includes("Typescript"); //false
  console.log(node, react, next, typescript);
  console.log(blogs);

  res.render("blog", { blogs, user, node, react, next, typescript });
}

async function renderBlogDetail(req, res) {
  let { user } = req.session;
  const { id } = req.params;

  const blogDetail = await Blog.findOne({
    include: {
      model: User,
      as: "user",
      attributes: { exclude: ["password"] },
    },
    where: {
      id: id,
    },
  });

  const node = blogDetail.technologies.includes("NodeJs"); //trueNodeJs
  const react = blogDetail.technologies.includes("ReactJs"); //true
  const next = blogDetail.technologies.includes("NextJs"); //true
  const typescript = blogDetail.technologies.includes("Typescript"); //false

  if (blogDetail === null) {
    res.render("page-404", { message: "Blog tidak ditemukan" });
  } else {
    res.render("blog-detail", {
      data: blogDetail,
      user,
      node,
      react,
      next,
      typescript,
    });
  }
}

function renderBlogAdd(req, res) {
  let { user } = req.session;

  if (!user) {
    req.flash("error", "Silahkan login.");
    return res.redirect("/login");
  }

  res.render("blog-add", { user });
}

async function addBlog(req, res) {
  let { user } = req.session;
  console.log("form submitted");
  const { title, content } = req.body;
  const { nodejs, reactjs, nextjs, typescript } = req.body;
  const { session } = req.session;

  let checkBox = "";
  if (nodejs) {
    checkBox += ` ${nodejs} `;
  }
  if (reactjs) {
    checkBox += ` ${reactjs} `;
  }
  if (nextjs) {
    checkBox += ` ${nextjs} `;
  }
  if (typescript) {
    checkBox += ` ${typescript} `;
  }
  // let checkbox = []; // array untuk checkbox kosong
  // //kondisi jika nodeJs nya ada
  // if (nodejs) {
  //   checkbox.push(nodejs); // masukkan data node js ke dalam array Check box
  // }
  // if (reactjs) {
  //   checkbox.push(reactjs); // masukkan data reactjs ke dalam array Check box
  // }
  // if (nextjs) {
  //   checkbox.push(nextjs);
  // }
  // if (typescript) {
  //   checkbox.push(typescript);
  // }

  const image = "http://localhost:5550/" + req.file.path;
  const idUser = user.id;
  const result = await Blog.create({
    title: title,
    content: content,
    technologies: checkBox,
    image: image,
    user_id: idUser,
  });

  console.log("result creating blog", result);

  req.flash("success", "Berhasil Tambah Project");
  res.redirect("/blog");
}

async function renderBlogEdit(req, res) {
  let { user } = req.session;
  const { id } = req.params;

  const dataToEdit = await Blog.findOne({
    where: {
      id: id,
    },
  });
  if (dataToEdit === null) {
    return res.render("page-404", { message: "Blog tidak ditemukan" });
  }

  const node = dataToEdit.technologies.includes("NodeJs");
  const react = dataToEdit.technologies.includes("ReactJs");
  const next = dataToEdit.technologies.includes("NextJs");
  const typescript = dataToEdit.technologies.includes("Typescript");

  console.log(node, next, react, typescript);
  console.log("data yang mau di edit :", dataToEdit); // array
  res.render("blog-edit", {
    data: dataToEdit,
    user,
    react,
    node,
    next,
    typescript,
  });
}

async function updateBlog(req, res) {
  const { id } = req.params;
  const { title, content } = req.body;
  const { nodejs, reactjs, nextjs, typescript } = req.body;

  let checkBox = "";
  if (nodejs) {
    checkBox += ` ${nodejs} `;
  }
  if (reactjs) {
    checkBox += ` ${reactjs} `;
  }
  if (nextjs) {
    checkBox += ` ${nextjs} `;
  }
  if (typescript) {
    checkBox += ` ${typescript} `;
  }

  const getDataById = await Blog.findOne({ where: { id: id } });
  let getImage = getDataById.image;
  let imageReplace = getImage.replace("http://localhost:5550/uploads/", "");

  if (req.file) {
    fileImage = "http://localhost:5550/uploads/" + req.file.filename;
  } else {
    fileImage = getImage;
  }

  await Blog.update(
    {
      title: title,
      content: content,
      technologies: checkBox,
      image: fileImage,
      updatedAt: sequelize.fn("NOW"),
    },
    {
      where: {
        id: id,
      },
    }
  );

  req.flash("success", "Berhasil Mengubah Data Project");
  res.redirect("/blog");
}

async function deleteBlog(req, res) {
  const { id } = req.params;

  const result = await Blog.destroy({
    where: {
      id,
    },
  });

  req.flash("successDelete", "Berhasil Menghapus Data Project");
  res.redirect("/blog");
}

// CONTACT

function renderContact(req, res) {
  let { user } = req.session;
  res.render("contact", { user });
}

function renderTestimonials(req, res) {
  let { user } = req.session;
  res.render("testimonial", { user });
}

function render404(req, res) {
  let { user } = req.session;
  res.send(`halaman ini tidak ada!`);
}

module.exports = {
  renderLogin,
  authLogin,
  renderRegister,
  authRegister,
  authLogout,
  renderHome,
  renderContact,
  renderBlog,
  renderBlogDetail,
  updateBlog,
  deleteBlog,
  renderBlogAdd,
  renderBlogEdit,
  addBlog,
  renderTestimonials,
  render404,
};
