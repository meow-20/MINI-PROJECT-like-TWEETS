const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userModel = require("./models/user");
const postModel = require("./models/post");
const upload = require("./config/multerconfig");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/logout", function (req, res) {
  res.cookie("token", "");
  res.redirect("/login");
});

app.get('/pic', function(req, res){
    res.render('pic');
})

app.post('/picupload',isLoggedIn, upload.single('profilepic'), async function(req, res){
    console.log(req.file);

    let user = await userModel.findOne({email: req.user.email});
    user.profilepic = req.file.filename;
    await user.save()
    res.redirect('/profile');
})

app.get("/profile", isLoggedIn, async function (req, res) {
  // console.log(req.user);
  let user = await userModel
    .findOne({ email: req.user.email })
    .populate("posts");
  res.render("profile", { user });
});

app.get("/like/:id", isLoggedIn, async function (req, res) {
  let post = await postModel.findOne({ _id: req.params.id }).populate("user");

  if (post.likes.indexOf(req.user.userid) === -1) {
    post.likes.push(req.user.userid);
  } else {
    post.likes.splice(post.likes.indexOf(req.user.userid), 1);
  }
  await post.save();
  res.redirect("/profile");
  // res.send(req.user.userid);
});

app.get("/edit/:id", isLoggedIn, async function (req, res) {
  let post = await postModel.findOne({ _id: req.params.id }).populate("user");

  res.render("edit", { post });
});

app.post("/edit/:id", async function (req, res) {
  let post = await postModel.findOneAndUpdate(
    { _id: req.params.id },
    { content: req.body.content }
  );
  res.redirect("/profile");
});

app.post("/register", async function (req, res) {
  let { username, name, email, password, age } = req.body;
  // firstly check whether the entered username is unique or not
  let finduser = await userModel.findOne({ email });
  if (finduser) return res.status(500).send("User already registered!");

  // create account
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
      // console.log(hash);
      let createduser = await userModel.create({
        username,
        name,
        email,
        age,
        password: hash,
      });
      let token = jwt.sign({ email, userid: createduser._id }, "secretcode");
      res.cookie("token", token);

      res.status(200).send("Created Successfully");

      // res.redirect('/');
    });
  });
});

app.post("/login", async function (req, res) {
  let { email, password } = req.body;
  // firstly check whether the entered username is unique or not
  let finduser = await userModel.findOne({ email });
  if (!finduser) return res.status(404).send("Something went wrong!");

  // login account
  bcrypt.compare(password, finduser.password, function (err, result) {
    if (result) {
      let token = jwt.sign({ email, userid: finduser._id }, "secretcode");
      res.cookie("token", token);
      res.redirect("/profile");
    } else {
      res.status(500).send("Something went wrong");
    }
  });
});

app.post("/post", isLoggedIn, async function (req, res) {
  let { content } = req.body;
  let user = await userModel.findOne({ email: req.user.email });
  let post = await postModel.create({
    user: user._id,
    content: content,
  });
  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});

// middleware for protected routes
function isLoggedIn(req, res, next) {
  if (req.cookies.token === "") {
    res.redirect("/login");
  } else {
    let data = jwt.verify(req.cookies.token, "secretcode");
    req.user = data;
    next();
  }
}

app.listen(3000);
