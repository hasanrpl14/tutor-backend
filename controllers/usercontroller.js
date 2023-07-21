const { User } = require('../models/');


// MEMBUAT USER (SIGNUP) REGISTER
function signup(req, res, next){
    const data = {
        username : req.body.username,
        password : req.body.password,
        email : req.body.email,
        fullname : req.body.fullname,
        picture : req.body.picture,
        bio : req.body.bio,
        createAt : new Date(),
        updatedAt : new Date(),
        createdBy : 0,
        updatedBy : 0,
        isDeleted : false
    }

    // CEK EMAIL
    User.findOne({
        where: {email : req.body.email} 
    }).then(user => {
        if(user){
            // Email sudah di gunakan
            res.status(400).json({
                message : 'email sudah ada'
            });
        }else{
            // buat user jika email belum digunakan
            User.create(data).then (result => {
                res.status(200).json({
                    message : 'Success',
                    data : result
                });
            }).catch (err => {
                res.status(500).json({
                    message : 'Rgister gagal',
                    data : err
                });
            });

        }
    }).catch (err => {
        res.status(500).json({
            message : 'Something wrong',
            data : err
        });
    });
    
}

// READ USER
function read(req, res, next){
    // res.render('index', { title: 'Read User Data'});
    User.findAll({
        where : { isDeleted: false}
    }).then(users => {
        res.send(users);
    }).catch(err => {
        res.send(err);
    });
}

// READ USER BY ID
function readById(req, res, next){
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
    User.findByPk(id).then(user => {
        res.send(user);
    }).catch(err => {
            res.send(err);
        });
}
// apa bedanya User.findAll Sama User.findByPk  bedanya kalo User findall where bisa mencari data bisa di kustom contoh 
// dari lewat id, username, password dll 
// kalo User.findByPk itu lansung mencari data dari primary key (id)



// UPDATE USER 
function update(req, res, next){
    const data = {
        username : req.body.username,
        password : req.body.password,
        email : req.body.email,
        fullname : req.body.fullname,
        picture : req.body.picture,
        bio : req.body.bio,
        updatedAt : new Date(),
        updatedBy : 0,
        isDeleted : false
    }

    User.update(data, {where : {id : req.params.id}}).then (result => {
        res.status(200).json({
            message : 'Success update data',
            data : result
        });
    }).catch (err => {
        res.status(200).json({
            message : 'Rgister gagal',
            data : err
        });
    });
   
}

// DELETE USER
function destroy(req, res, next){
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
    isDeleted : true,
    deletedAt : new Date(),
    deletedBy : 1
    }
    User.update(data, {where : {id : req.params.id}}).then (result => {
        res.status(200).json({
            message : 'Success hapus data',
            data : result
        });
    }).catch (err => {
        res.status(200).json({
            message : 'gagal hapus data',
            data : err
        });
    });

}


// LOGIN USER (SIGNIN)
function signin(req, res, next){
    User.findOne({
        where: {email : req.body.email} 
    }).then(user => {
        if(user){
            if(user.isDeleted == false){
                if(user.password == req.body.password){
                    res.status(200).json({
                        message: 'Success',
                        data: user
                    });
            } else {
                res.status(401).json({
                    message: 'wrong password',
                    data: user
                });
            }
        } else {
            res.status(401).json({
                message: 'User deleted',
                data: user
            });
        }
    } else {
        res.status(401).json({
            message: 'email tidak ada',
            data: user
        });
    }
}).catch (err => {
    res.status(200).json({
        message : 'login ',
        data : err
    });
});
}


module.exports = {
    signup,
    read,
    readById,
    update,
    destroy,
    signin
}


