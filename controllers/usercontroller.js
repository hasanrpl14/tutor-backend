const { User } = require("../models/");
const Validator = require("fastest-validator");

const jwt =  require("jsonwebtoken")

const v = new Validator();

const bcrypt = require("bcrypt");

require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET

// MEMBUAT USER (SIGNUP) REGISTER
function signup(req, res, next) {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(req.body.password, salt, function (err, hash) {
      // Store hash in your password DB.
      const data = {
        username: req.body.username,
        password: hash,
        email: req.body.email,
        fullname: req.body.fullname,
        picture: req.body.picture,
        bio: req.body.bio,
        createAt: new Date(),
        updatedAt: new Date(),
        createdBy: 0,
        updatedBy: 0,
        isDeleted: false,
      };

      const schema = {
        username: { type: "string", min: 3, max: 50, option: false },
        email: { type: "email", option: false },
        password: { type: "string", min: 5, max: 255, option: false },
      };

      // VALOIDASI EMAIL
      User.findOne({
        where: { email: req.body.email },
      })
        .then((user) => {
          if (user) {
            // Email sudah di gunakan
            res.status(400).json({
              message: "email sudah ada",
            });
          } else {
            // VALIDASI DATA
            const validationResult = v.validate(data, schema);

            if (validationResult != true) {
              // DATA TIDAK VALID
              res.status(400).json({
                message: "validasi gagal",
                data: validationResult,
              });
            } else {
              // buat user jika email belum digunakan
              //   DATA  VALID DAN BISA DISIMPAN KE DALAM DATABASE
              User.create(data)
                .then((result) => {
                  res.status(200).json({
                    message: "Success",
                    data: result,
                  });
                })
                .catch((err) => {
                  res.status(500).json({
                    message: "Rgister gagal",
                    data: err,
                  });
                });
            }
          }
        })
        .catch((err) => {
          res.status(500).json({
            message: "Something wrong",
            data: err,
          });
        });
    });
  });
}

// READ USER

function read(req, res, next) {
  // res.render('index', { title: 'Read User Data'});
  User.findAll({
    where: { isDeleted: false },
  })
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.send(err);
    });
}

// READ USER BY USERNAME

function nama(req, res, next) {
  User.findAll({
    where : { username: req.params.username},
  }).then(users => {
    if (user) {
      // Email sudah di gunakan
      res.status(400).json({
        message: "nama sudah ada",
      });
    }
    res.send(users);
  }).catch(err => {
        res.send(err);
});

}

// READ USER BY ID
function readById(req, res, next) {
  // User.findAll({
  //     where : {id: req.params.id},
  // }).then(users => {
  //     res.send(users);
  // }).catch(err => {
  //     res.send(err);
  // });

  // User.findAll untuk mencari data di tabel trs pesan where {id : req.params.id} untuk mencari data lewat id
  // yang di dalam where isinya bisa di kostum bisa lewat id , username , atau dll unyuk mencari data data pesannya dari mana dari isi tabel

  const id = req.params.id;
  // const datas = id;

  User.findByPk(id)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.send(err);
    });

  // if (datas != true) {
  //   // DATA TIDAK VALID
  //   res.status(200).json({
  //     message: "data tidak ada",
  //     data: User,
  //   });
  // } else {
  //   res.status(404).json({
  //     message: "data ada",
  //     data: User,
  //   });
  // }
}
// apa bedanya User.findAll Sama User.findByPk  bedanya kalo User findall where bisa mencari data bisa di kustom contoh
// dari lewat id, username, password dll
// kalo User.findByPk itu lansung mencari data dari primary key (id)

// UPDATE USER
function update(req, res, next) {
  const data = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    fullname: req.body.fullname,
    picture: req.body.picture,
    bio: req.body.bio,
    updatedAt: new Date(),
    updatedBy: 0,
    isDeleted: false,
  };

  const schema = {
    username: { type: "string", min: 5, max: 50, option: false },
    email: { type: "email", option: false },
    password: { type: "string", min: 5, max: 50, option: false },
  };

  // VALIDASI DATA
  const validationResult = v.validate(data, schema);

  if (validationResult != true) {
    // DATA TIDAK VALID
    res.status(400).json({
      message: "validasi gagal",
      data: validationResult,
    });
  } else {
    // buat user jika email belum digunakan
    //   DATA  VALID DAN BISA DISIMPAN KE DALAM DATABASE
    User.update(data, { where: { id: req.params.id } })
      .then((result) => {
        res.status(200).json({
          message: "Success update data",
          data: result,
        });
      })
      .catch((err) => {
        res.status(200).json({
          message: "Rgister gagal",
          data: err,
        });
      });
  }
}

// DELETE USER
function destroy(req, res, next) {
  // RECORD DELETE
  // User.destroy({where : {id : req.params.id}}).then (result => {
  //     res.status(200).json({
  //         message : 'Success hapus data',
  //         data : result
  //     });
  // }).catch (err => {
  //     res.status(200).json({
  //         message : 'gagal hapus data',
  //         data : err
  //     });
  // });

  // SOFT DELETE
  const data = {
    isDeleted: true,
    deletedAt: new Date(),
    deletedBy: 1,
  };
  User.update(data, { where: { id: req.params.id } })
    .then((result) => {
      res.status(200).json({
        message: "Success hapus data",
        data: result,
      });
    })
    .catch((err) => {
      res.status(200).json({
        message: "gagal hapus data",
        data: err,
      });
    });
}

// LOGIN USER (SIGNIN)
function signin(req, res, next) {
  // User.findone User itu nama tabelnya fidOne untuk mengabil data where { email: req.body.email} artinya itu masuk kedalam 
  // table didalam database untuk mengecek email yang ada di database
  User.findOne({
    where: { email: req.body.email },
  })
    .then((user) => {
      if (user) {
        if (user.isDeleted == false) {
          bcrypt.compare(req.body.password, user.password, function (err, result) {
            // bcrypt.compare(req.body.password, user.password, function (err, result) {
      // data di atas untuk memabndingkan apakah user saat memasukkan password datanya sama yang ada di database
            if (result) {
              //Pembuatan Token saat login sukses   
            const token = jwt.sign({
              email : user.email,
              username : user.username,
              userid : user.id,
            }, JWT_SECRET, function(err, token){

              res.status(200).json({
                status: "SUKSES",
                message: "Success login",
                token: token,
                // JWT_SECRET: JWT_SECRET
                // data: user,
              });
            });

            } else {
              res.status(401).json({
                status: "FAILED",
                pesan: "wrong password",
                data: err,
              });
            }
          });
        } else {
          res.status(401).json({
            message: "User deleted",
            data: user,
          });
        }
      } else {
        res.status(401).json({
          message: "salah",
          data: user,
        });
      }
    })
    .catch((err) => {
      res.status(200).json({
        message: "login ",
        data: err,
      });
    });
}

// function signin(req, res, next) {
//   User.findOne({
//     where: {
//       username: req.body.username,
//       password: req.body.password,
//       email: req.body.email,
//     },
//   })
//     .then((user) => {
//       if (user) {
//         if (user.isDeleted === false) {
//           // Disarankan menggunakan === untuk membandingkan dengan tepat
//           res.status(200).json({
//             message: "Success",
//             data: user,
//           });
//         } else {
//           res.status(401).json({
//             message: "User deleted",
//             data: user,
//           });
//         }
//       } else {
//         res.status(401).json({
//           message: "Invalid credentials",
//           data: user,
//         });
//       }
//     })
//     .catch((err) => {
//       res.status(500).json({
//         message: "Error while processing the request",
//         data: err,
//       });
//     });
// }

module.exports = {
  signup,
  read,
  nama,
  readById,
  update,
  destroy,
  signin,
};
