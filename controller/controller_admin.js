const connection = require('../db.js');
const multer = require('multer');
const path = require('path');
const util = require('util');
const query = util.promisify(connection.query).bind(connection);
// *******************************************************************************************************************
// set up cho việc upload ảnh
// cho biết toàn bộ thông tin về file ảnh
const storage = multer.diskStorage({
    destination: 'public/upload/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// tạo ra function upload
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('image');

// tạp ra function kiểm tra có phải là ảnh ko
function checkFileType(file, cb) {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Only image');
    }
};
// Kết thúc phần set up ảnh
// *******************************************************************************************************************
const pageLoginAdmin = async (req, res)=>{
    try {
        res.render('login_admin');
    }catch (e) {
        console.error(e);
    }
}

// trang chủ
const homeAdmin = async (req, res)=>{
    try {
        res.render('admin/homeAdmin');
    }catch (e) {
        console.error(e);
    }
}

// trang quản lý người dùng
const pageManagementUser = async (req, res)=>{
    try {
        const result_inf_user = await query(`SELECT * FROM profile_user`);
        res.render('admin/pageManagementUser', {result_inf_user});
    }catch (e) {
        console.error(e);
    }
}

// trang xem các bài đăng
const pageViewBlogs = async (req, res)=>{
    try {
        const result_post = await query(`SELECT * FROM post WHERE allowed = 0`);
        res.render('admin/pageViewBlogs', {result_post});
    }catch (e) {
        console.error(e);
    }
}

// trang xem chi tiết bài viết
const pageViewBlogDetail = async (req, res)=>{
    try {
        const {id_post} = req.query;
        const result_post_detail = await query(`SELECT * FROM post WHERE id = '${id_post}'`);
        res.render('admin/pageViewBlogDetail',{result_post_detail});
    }catch (e) {
        console.error(e)
    }
}

// trang cá nhân
const pageProfile = async (req, res)=>{
    try {
        res.render('admin/pageProfile');
    }catch (e) {
        console.error(e);
    }
}

// đăng nhập
const loginAdmin = async (req, res)=>{
    upload(req, res, async ()=>{
        try {
            const {inputUsername, inputPassword} = req.body;
            if (inputUsername === '' || inputPassword === '') {
                res.json({
                    msg: 'account error'
                })
            } else {
                const result_admin = await query(`SELECT 1 as v FROM account_admin WHERE username = '${inputUsername}' AND password = '${inputPassword}'`);
                if (result_admin[0] == undefined) {
                    res.json({
                        msg: 'account error1'
                    })
                }
                if (result_admin[0] != undefined) {
                    if (result_admin[0].v == 1) {
                            res.json({msg: 'login success'});
                            console.log('ok');
                    }
                }
            }
        }catch (e) {
            console.error(e);
        }
    })
}

// chấp nhận bài viết
const acceptPost = async (req, res)=>{
    try {
        const {id_post} = req.query;
        const update_allowed_post = await query(`UPDATE post SET allowed = 1 WHERE id = '${id_post}'`);
        res.json({
            msg: 'update success'
        })
    }catch (e) {
        console.error(e);
    }
}

// xóa bài viết
const deletePost = async (req, res) =>{
    try {
        const {id_post} = req.query;
        const delete_post = await query(`DELETE FROM post WHERE id = '${id_post}'`);
        res.json({
            msg: 'delete success'
        })
    }catch (e) {
        console.error(e);
    }
}

const pageViewBlogsActive = async (req, res)=>{
    try {
        const result_post = await query(`SELECT * FROM post WHERE allowed = 1`);
        res.render('admin/pageViewBlogsActive',{result_post})
    }catch (e){
        console.error(e)
    }
}
module.exports = {
    homeAdmin,pageLoginAdmin, pageManagementUser, pageViewBlogs, pageViewBlogDetail, pageProfile, loginAdmin,
    acceptPost, deletePost, pageViewBlogsActive
}