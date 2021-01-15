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
// dùng để upload ảnh vào thư mục khác
const storage1 = multer.diskStorage({
    destination: 'public/upload1/',
    filename: (req1, file1, cb1) => {
        cb1(null, file1.fieldname + '-' + Date.now() + path.extname(file1.originalname));
    }
});
const upload1 = multer({
    storage: storage1,
    fileFilter: function (req, file1, cb1) {
        checkFileType1(file1, cb1);
    }
}).single('image1');

function checkFileType1(file1, cb1) {
    const fileTypes = /jpeg|jpg|png|gif|ico/;
    const extname = fileTypes.test(path.extname(file1.originalname).toLowerCase());
    const mimetype = fileTypes.test(file1.mimetype);
    if (mimetype && extname) {
        return cb1(null, true);
    } else {
        cb1('Error: Only image');
    }
}

// *******************************************************************************************************************
const startApp = (req, res) => {
    res.render('login_user');
}

// đăng ký
const registerAccountUser = async (req, res) => {
    upload(req, res, async () => {

        const {dk_username_user, nameAccount_user, dk_password_user, dk_password_user1} = req.body;
        if (dk_username_user === '' || nameAccount_user === '' || dk_password_user === '' || dk_password_user1 === '') {
            res.json({
                msg: 'Important items must not be left blank'
            })
        } else {
            if (dk_password_user != dk_password_user1) {
                res.json({
                    msg: 'The two passwords are not the same'
                })
            } else {
                const result = await query(`INSERT INTO account_user (id, name_user, username, password) VALUES (null, '${dk_username_user}', '${nameAccount_user}','${dk_password_user}')`);
                const result_account_user = await query(`SELECT * FROM account_user ORDER BY id DESC LIMIT 1`);
                const id_user = result_account_user[0].id;
                const insert_image_default = await query(`INSERT INTO profile_user (id, id_of_user, name_user, avatar, cover_image) VALUES (null, '${id_user}', '${dk_username_user}','/upload1/tenor.gif', '/upload1/default-image.jpg')`);
                    res.json({
                        msg: 'Sign up success'
                    })
            }
        }
    })
}

// đăng nhập
const loginAccountUser = async (req, res) => {
    upload(req, res, async (err) => {
        const {dn_username_user, dn_password_user} = req.body;
        if (dn_username_user === '' || dn_password_user === '') {
            res.json({
                msg: 'account error'
            })
        } else {
            const result_id_account = await query(`SELECT id FROM account_user WHERE username = '${dn_username_user}' AND password = '${dn_password_user}'`);
            const result = await query(`SELECT 1 as v FROM account_user WHERE username = '${dn_username_user}' AND password = '${dn_password_user}'`);
            const result1 = await query(`SELECT * FROM account_user WHERE username = '${dn_username_user}' AND password = '${dn_password_user}'`);

            if (result[0] == undefined) {
                res.json({
                    msg: 'account error1'
                })
            }
            if (result[0] != undefined) {
                if (result[0].v == 1) {
                    const id_user = result1[0].id;
                    const check_profile = await query(`SELECT 1 AS ch FROM profile_user WHERE id_of_user = '${id_user}'`);
                    if (check_profile[0] == undefined){
                        res.json({msg: 'login success', rl: result_id_account});
                    }else {
                        res.json({msg: 'login success', rl: result_id_account});
                    }
                }
            }
        }
    })
}

// trang chủ
const homeUser = async (req, res) => {
    try {
        const id_user = req.query.id_user;
        const name_user = await query(`SELECT name_user FROM account_user WHERE id = '${id_user}'`);
        const result_post = await query(`SELECT * FROM post WHERE allowed = 1`);
        const result_comment = await query(`SELECT * FROM comment`);

        const check_profile = await query(`SELECT 1 AS ch FROM profile_user WHERE id_of_user = '${id_user}'`);
        if (check_profile[0] == undefined) {
            const result_profile = await query(`SELECT * FROM profile_user WHERE id = 1`);
            const avatar = result_profile[0].avatar;

            const update_avatar0 = await query(`UPDATE post SET avatar = '${avatar}' WHERE id_of_user = '${id_user}'`);
            const update_avatar1 = await query(`UPDATE comment SET avatar = '${avatar}' WHERE id_of_user = '${id_user}'`);
            const update_avatar2 = await query(`UPDATE reply SET avatar = '${avatar}' WHERE id_of_user = '${id_user}'`);
            res.render('user/homeUser', {name_user, id_user, result_post, result_comment, result_profile});
        } else {
            if (check_profile[0].ch == 1) {
                const result_profile = await query(`SELECT * FROM profile_user WHERE id_of_user = '${id_user}'`);
                const avatar = result_profile[0].avatar;

                const update_avatar0 = await query(`UPDATE post SET avatar = '${avatar}' WHERE id_of_user = '${id_user}'`);
                const update_avatar1 = await query(`UPDATE comment SET avatar = '${avatar}' WHERE id_of_user = '${id_user}'`);
                const update_avatar2 = await query(`UPDATE reply SET avatar = '${avatar}' WHERE id_of_user = '${id_user}'`);
                res.render('user/homeUser', {name_user, id_user, result_post, result_comment, result_profile});
            }
        }
    } catch (e) {
        console.error(e)
    }
}

// đăng bài
const post = async (req, res) => {
    upload(req, res, async () => {
        try {
            const id_user = req.query.id_user;

            let date_ob = new Date();
            let date = ("0" + date_ob.getDate()).slice(-2);
            // current month
            let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            // current year
            let year = date_ob.getFullYear();
            let timeFull = "Ngày " + date + " tháng " + month + ", " + year;

            const {txtaContent} = req.body;


            if (txtaContent === "" && req.file == undefined) {
                await res.json({
                    msg: 'isEmpty'
                })
            }
            if (txtaContent != "" || req.file != undefined) {
                // check xem thử có tồn tại ảnh đại diện chưa
                const check_profile = await query(`SELECT 1 AS ch FROM profile_user WHERE id_of_user = '${id_user}'`);

                const name_user = await query(`SELECT name_user FROM account_user WHERE id = '${id_user}'`);
                const name = name_user[0].name_user;

                // đăng bài khi không có ảnh
                if (req.file == undefined) {
                    // nếu chưa có ảnh đại diện thì lấy ảnh mặc định
                    if (check_profile[0] == undefined) {
                        const result_profile = await query(`SELECT * FROM profile_user WHERE id = 1`);
                        const avatar = result_profile[0].avatar;

                        const post = await query(`INSERT INTO post(id, id_of_user, post_status, content, link_image, date_posted, name_user, avatar, detail_content, material, material_price, time_do, level_do, allowed) VALUES (null,'${id_user}','Incomplete','${txtaContent}',null ,'${timeFull}','${name}', '${avatar}',null, null, null, null, null,0)`);
                    } else {
                        // nếu có thì lấy ảnh vào thôi
                        if (check_profile[0].ch == 1) {
                            const result_profile = await query(`SELECT * FROM profile_user WHERE id_of_user = '${id_user}'`);
                            const avatar = result_profile[0].avatar;

                            const post1 = await query(`INSERT INTO post(id, id_of_user, post_status, content, link_image, date_posted, name_user, avatar, detail_content, material, material_price, time_do, level_do, allowed) VALUES (null,'${id_user}','Incomplete','${txtaContent}',null ,'${timeFull}','${name}', '${avatar}',null, null, null, null, null,0)`);
                        }
                    }
                }
                // đăng bài khi có ảnh
                if (req.file != undefined) {
                    // nếu chưa có ảnh đại diện thì lấy ảnh mặc định
                    if (check_profile[0] == undefined) {
                        const result_profile = await query(`SELECT * FROM profile_user WHERE id = 1`);
                        const avatar = result_profile[0].avatar;

                        const post2 = await query(`INSERT INTO post(id, id_of_user, post_status, content, link_image, date_posted, name_user, avatar,detail_content, material, material_price, time_do, level_do, allowed) VALUES (null,'${id_user}','Incomplete','${txtaContent}','/upload/${req.file.filename}','${timeFull}','${name}', '${avatar}',null, null, null, null, null,0)`);
                    } else {
                        // nếu có thì lấy ảnh vào thôi
                        if (check_profile[0].ch == 1) {
                            const result_profile = await query(`SELECT * FROM profile_user WHERE id_of_user = '${id_user}'`);
                            const avatar = result_profile[0].avatar;

                            const post3 = await query(`INSERT INTO post(id, id_of_user, post_status, content, link_image, date_posted, name_user, avatar,detail_content, material, material_price, time_do, level_do, allowed) VALUES (null,'${id_user}','Incomplete','${txtaContent}','/upload/${req.file.filename}','${timeFull}','${name}', '${avatar}',null, null, null, null, null,0)`);
                        }
                    }
                }
                await res.json({
                    msg: 'post_success'
                });
            }
        } catch (e) {
            console.log(e);
        }

    })
}

// bình luận
const comment = async (req, res) => {
    try {
        let date_ob = new Date();
        // current hours
        let hours = date_ob.getHours();
        // current minutes
        let minutes = date_ob.getMinutes();
        // date
        let date = ("0" + date_ob.getDate()).slice(-2);
        // current month
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        // current year
        let year = date_ob.getFullYear();
        let timeFull = hours + ":" + minutes + ", ngày " + date + "/" + month + ", " + year;

        const id_user = req.query.id_user;
        const id_post = req.query.id_post;
        const {inputComment} = req.body;
        if (inputComment === "") {
            await res.json({
                msg: 'nothing'
            })
        } else {
            const name_user = await query(`SELECT name_user FROM account_user WHERE id = '${id_user}'`);
            const name = name_user[0].name_user;
            const check_profile = await query(`SELECT 1 AS ch FROM profile_user WHERE id_of_user = '${id_user}'`);

            if (check_profile[0] == undefined) {
                const result_profile = await query(`SELECT * FROM profile_user WHERE id = 1`);
                const avatar = result_profile[0].avatar;
                const comment = await query(`INSERT INTO comment (id, id_of_user, id_of_post, name_user, avatar,comment_content, date_comment) VALUES (null, '${id_user}', '${id_post}', '${name}', '${avatar}','${inputComment}', '${timeFull}')`);
            } else {
                if (check_profile[0].ch == 1) {
                    const result_profile = await query(`SELECT * FROM profile_user WHERE id_of_user = '${id_user}'`);
                    const avatar = result_profile[0].avatar;
                    const comment1 = await query(`INSERT INTO comment (id, id_of_user, id_of_post, name_user, avatar,comment_content, date_comment) VALUES (null, '${id_user}', '${id_post}', '${name}', '${avatar}','${inputComment}', '${timeFull}')`);
                }
            }
            const check_comment = await query(`SELECT * FROM comment`);
            const number_comment = check_comment.length;
            const id_comment_ = check_comment[number_comment - 1].id;
            await res.json({
                msg: 'post_success', id_comment_
            })
        }
    } catch (e) {
        console.error(e);
        res.send(e);
    }
}

// load comment + reply comment
const loadComment = async (req, res) => {
    try {
        const {id_user} = req.query;
        const result_post = await query(`SELECT * FROM post`);
        const result_comment = await query(`SELECT * FROM comment`);
        const result_reply_comment = await query(`SELECT * FROM reply`);
        const result_like = await query(`SELECT * FROM like_of_post WHERE id_of_user = '${id_user}'`);
        await res.json({
            result_post, result_comment, result_reply_comment, result_like
        })
    } catch (e) {
        console.error(e)
    }
}

// trả lời bình luận
const replyComment = async (req, res) => {
    try {
        let date_ob = new Date();
        // current hours
        let hours = date_ob.getHours();
        // current minutes
        let minutes = date_ob.getMinutes();
        // date
        let date = ("0" + date_ob.getDate()).slice(-2);
        // current month
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        // current year
        let year = date_ob.getFullYear();
        let timeFull = hours + ":" + minutes + ", ngày " + date + "/" + month + ", " + year;

        const {id_user, id_comment} = req.query;
        const {inputReply} = req.body;

        const name_user = await query(`SELECT name_user FROM account_user WHERE id = '${id_user}'`);
        const name = name_user[0].name_user;
        const check_profile = await query(`SELECT 1 AS ch FROM profile_user WHERE id_of_user = '${id_user}'`);

        if (check_profile[0] == undefined) {
            const result_profile = await query(`SELECT * FROM profile_user WHERE id = 1`);
            const avatar = result_profile[0].avatar;
            const reply = await query(`INSERT INTO reply(id, id_of_user, id_of_comment, name_user, avatar,reply_content, date_replied) VALUES (null, '${id_user}', '${id_comment}', '${name}', '${avatar}','${inputReply}', '${timeFull}')`);
        } else {
            if (check_profile[0].ch == 1) {
                const result_profile = await query(`SELECT * FROM profile_user WHERE id_of_user = '${id_user}'`);
                const avatar = result_profile[0].avatar;
                const reply1 = await query(`INSERT INTO reply(id, id_of_user, id_of_comment, name_user, avatar, reply_content, date_replied) VALUES (null, '${id_user}', '${id_comment}', '${name}', '${avatar}','${inputReply}', '${timeFull}')`);
            }
        }

        await res.json({
            msg: 'reply success'
        })
    } catch (e) {
        console.error(e);
    }
}

// xóa bình luận
const deleteComment = async (req, res) => {
    try {
        const {id_user, id_comment} = req.query;
        const delete_comment = await query(`DELETE FROM comment WHERE id_of_user = '${id_user}' AND id = '${id_comment}'`);
        const delete_reply_comment = await query(`DELETE FROM reply WHERE id_of_user = '${id_user}' AND id_of_comment = '${id_comment}'`);
        await res.json({
            msg: 'delete success'
        })
    } catch (e) {
        console.error(e);
    }
}

// trang tìm kiếm
const pageSearch = async (req, res) => {
    try {
        const {id_user, search} = req.query;
        const name_user = await query(`SELECT name_user FROM account_user WHERE id = '${id_user}'`);
        const result_post = await query(`SELECT * FROM post WHERE content LIKE '%${search}%' AND allowed = 1`);
        const result_comment = await query(`SELECT * FROM comment`);

        const check_profile = await query(`SELECT 1 AS ch FROM profile_user WHERE id_of_user = '${id_user}'`);
        if (check_profile[0] == undefined) {
            const result_profile = await query(`SELECT * FROM profile_user WHERE id = 1`);
            const image_default = result_profile[0].cover_image;
            const avatar = result_profile[0].avatar;

            const update_avatar0 = await query(`UPDATE post SET avatar = '${avatar}' WHERE id_of_user = '${id_user}'`);
            const update_avatar1 = await query(`UPDATE comment SET avatar = '${avatar}' WHERE id_of_user = '${id_user}'`);
            const update_avatar2 = await query(`UPDATE reply SET avatar = '${avatar}' WHERE id_of_user = '${id_user}'`);
            res.render('user/pageSearch', {name_user, id_user, result_post, result_comment, result_profile});
        } else {
            if (check_profile[0].ch == 1) {
                const result_profile = await query(`SELECT * FROM profile_user WHERE id_of_user = '${id_user}'`);
                const avatar = result_profile[0].avatar;

                const update_avatar0 = await query(`UPDATE post SET avatar = '${avatar}' WHERE id_of_user = '${id_user}'`);
                const update_avatar1 = await query(`UPDATE comment SET avatar = '${avatar}' WHERE id_of_user = '${id_user}'`);
                const update_avatar2 = await query(`UPDATE reply SET avatar = '${avatar}' WHERE id_of_user = '${id_user}'`);
                res.render('user/pageSearch', {name_user, id_user, result_post, result_comment, result_profile});
            }
        }
    } catch (e) {
        console.error(e)
    }
}

// trang bài viết hoàn chỉnh
const pagePostDetail = async (req, res) => {
    try {
        const id_user = req.query.id_user;
        const name_user = await query(`SELECT name_user FROM account_user WHERE id = '${id_user}'`);
        const result_profile = await query(`SELECT * FROM profile_user WHERE id_of_user = '${id_user}'`);
        res.render('user/pagePostDetail', {id_user, name_user, result_profile});
    } catch (e) {
        console.log(e);
    }
}

// đăng bài viết hoàn chỉnh
const postDetail = async (req, res) => {
    upload(req, res, async () => {
        try {
            let date_ob = new Date();
            let date = ("0" + date_ob.getDate()).slice(-2);
            // current month
            let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            // current year
            let year = date_ob.getFullYear();
            let timeFull = "Ngày " + date + " tháng " + month + ", " + year;

            const id_user = req.query.id_user;
            const name_user = await query(`SELECT name_user FROM account_user WHERE id = '${id_user}'`);
            const name = name_user[0].name_user;

            const {inputContent, detail_content, inputMaterial, inputMaterialPrice, inputTimeDo, selectLevelDo} = req.body;

            // check xem thử có tồn tại ảnh đại diện chưa
            const check_profile = await query(`SELECT 1 AS ch FROM profile_user WHERE id_of_user = '${id_user}'`);

            // đăng bài khi không có ảnh
            if (req.file == undefined) {
                // nếu chưa có ảnh đại diện thì lấy ảnh mặc định
                if (check_profile[0] == undefined) {
                    const result_profile = await query(`SELECT * FROM profile_user WHERE id = 1`);
                    const avatar = result_profile[0].avatar;

                    const post_detail = await query(`INSERT INTO post(id, id_of_user, post_status, content, link_image, date_posted, name_user, avatar, detail_content, material, material_price, time_do, level_do, allowed) VALUES (null,'${id_user}','Complete','${inputContent}',null ,'${timeFull}','${name}', '${avatar}', '${detail_content}', '${inputMaterial}', '${inputMaterialPrice}', '${inputTimeDo}', '${selectLevelDo}',0)`);
                } else {
                    // nếu có thì lấy ảnh vào thôi
                    if (check_profile[0].ch == 1) {
                        const result_profile = await query(`SELECT * FROM profile_user WHERE id_of_user = '${id_user}'`);
                        const avatar = result_profile[0].avatar;

                        const post_detail1 = await query(`INSERT INTO post(id, id_of_user, post_status, content, link_image, date_posted, name_user, avatar, detail_content, material, material_price, time_do, level_do, allowed) VALUES (null,'${id_user}','Complete','${inputContent}',null ,'${timeFull}','${name}', '${avatar}', '${detail_content}', '${inputMaterial}', '${inputMaterialPrice}', '${inputTimeDo}', '${selectLevelDo}',0)`);
                    }
                }
            }
            // đăng bài có ảnh
            else {
                // nếu chưa có ảnh đại diện thì lấy ảnh mặc định
                if (check_profile[0] == undefined) {
                    const result_profile = await query(`SELECT * FROM profile_user WHERE id = 1`);
                    const avatar = result_profile[0].avatar;

                    const post_detail2 = await query(`INSERT INTO post(id, id_of_user, post_status, content, link_image, date_posted, name_user, avatar, detail_content, material, material_price, time_do, level_do, allowed) VALUES (null,'${id_user}','Complete','${inputContent}','/upload/${req.file.filename}' ,'${timeFull}','${name}', '${avatar}', '${detail_content}', '${inputMaterial}', '${inputMaterialPrice}', '${inputTimeDo}', '${selectLevelDo}',0)`);
                } else {
                    // nếu có thì lấy ảnh vào thôi
                    if (check_profile[0].ch == 1) {
                        const result_profile = await query(`SELECT * FROM profile_user WHERE id_of_user = '${id_user}'`);
                        const avatar = result_profile[0].avatar;

                        const post_detail3 = await query(`INSERT INTO post(id, id_of_user, post_status, content, link_image, date_posted, name_user, avatar, detail_content, material, material_price, time_do, level_do, allowed) VALUES (null,'${id_user}','Complete','${inputContent}','/upload/${req.file.filename}' ,'${timeFull}','${name}', '${avatar}', '${detail_content}', '${inputMaterial}', '${inputMaterialPrice}', '${inputTimeDo}', '${selectLevelDo}',0)`);
                    }
                }
            }
            await res.json({
                msg: 'post_success'
            })
        } catch (e) {
            console.error(e)
        }
    })
}

// trang cá nhân
const pageProfile = async (req, res) => {
    try {
        const {id_user, id_using} = req.query;
        let distinguish;
        // nếu là bản thân
        if (id_user === id_using) {
            distinguish = 'mySelf';
            const name_user = await query(`SELECT name_user FROM account_user WHERE id = '${id_user}'`);
            const name_user1 = await query(`SELECT name_user FROM account_user WHERE id = '${id_using}'`);
            const result_post = await query(`SELECT * FROM post WHERE id_of_user = '${id_using}' AND allowed = 1`);
            const result_comment = await query(`SELECT * FROM comment`);
            const check_profile = await query(`SELECT 1 AS ch FROM profile_user WHERE id_of_user = '${id_using}'`);

            // chưa set up ảnh đại diện
            if (check_profile[0] == undefined) {
                const result_profile = await query(`SELECT * FROM profile_user WHERE id_of_user = '${id_user}'`);
                const result_profile1 = await query(`SELECT * FROM profile_user WHERE id_of_user = '${id_user}'`);
                const avatar = result_profile[0].avatar;
                const update_avatar0 = await query(`UPDATE post SET avatar = '${avatar}' WHERE id_of_user = '${id_user}'`);
                const update_avatar1 = await query(`UPDATE comment SET avatar = '${avatar}' WHERE id_of_user = '${id_user}'`);
                const update_avatar2 = await query(`UPDATE reply SET avatar = '${avatar}' WHERE id_of_user = '${id_user}'`);
                res.render('user/pageProfile', {
                    name_user, name_user1, id_user, id_using, result_post, result_comment, result_profile,
                    distinguish, result_profile1
                });
            }
            // đã set up ảnh đại diện
            else {
                if (check_profile[0].ch == 1) {
                    const result_profile = await query(`SELECT * FROM profile_user WHERE id_of_user = '${id_user}'`);
                    const result_profile1 = await query(`SELECT * FROM profile_user WHERE id_of_user = '${id_user}'`);
                    const avatar = result_profile[0].avatar;
                    const update_avatar0 = await query(`UPDATE post SET avatar = '${avatar}' WHERE id_of_user = '${id_user}'`);
                    const update_avatar1 = await query(`UPDATE comment SET avatar = '${avatar}' WHERE id_of_user = '${id_user}'`);
                    const update_avatar2 = await query(`UPDATE reply SET avatar = '${avatar}' WHERE id_of_user = '${id_user}'`);
                    res.render('user/pageProfile', {
                        name_user, name_user1, id_user, id_using, result_post, result_comment, result_profile,
                        distinguish, result_profile1
                    });
                }
            }
        }
        // nếu là người khác
        else {
            const check_friend = await query(`SELECT 1 AS ch FROM friend WHERE id_of_sender = '${id_user}' AND id_of_recipient = '${id_using}'`);
            const name_user = await query(`SELECT name_user FROM account_user WHERE id = '${id_user}'`);
            const name_user1 = await query(`SELECT name_user FROM account_user WHERE id = '${id_using}'`);
            const result_post = await query(`SELECT * FROM post WHERE id_of_user = '${id_using}'`);
            const result_comment = await query(`SELECT * FROM comment`);
            const check_profile = await query(`SELECT 1 AS ch FROM profile_user WHERE id_of_user = '${id_using}'`);
            // chưa set up phần ảnh đại diện
            if (check_profile[0] == undefined) {
                const result_profile = await query(`SELECT * FROM profile_user WHERE id_of_user = '${id_user}'`);
                // chưa gửi lời mời kết bạn
                if (check_friend[0] == undefined) {
                    const result_profile1 = await query(`SELECT * FROM profile_user WHERE id_of_user = '${id_user}'`);
                    distinguish = 'others';
                    res.render('user/pageProfile', {
                        name_user, name_user1, id_user, id_using, result_post, result_comment, result_profile,
                        distinguish, result_profile1
                    });
                }
                // đã gửi lời mời kết bạn
                else {
                    if (check_friend[0].ch == 1) {
                        const result_profile1 = await query(`SELECT * FROM profile_user WHERE id_of_user = '${id_user}'`);
                        distinguish = 'sending_to_friend';
                        res.render('user/pageProfile', {
                            name_user, name_user1, id_user, id_using, result_post, result_comment, result_profile,
                            distinguish, result_profile1
                        });
                    }
                }
            }
            // đã set up phần ảnh đại diện
            else {
                if (check_profile[0].ch == 1) {
                    const result_profile = await query(`SELECT * FROM profile_user WHERE id_of_user = '${id_using}'`);
                    // chưa gửi lời mời kết bạn
                    if (check_friend[0] == undefined) {
                        const result_profile1 = await query(`SELECT * FROM profile_user WHERE id_of_user = '${id_user}'`);
                        distinguish = 'others';
                        res.render('user/pageProfile', {
                            name_user, name_user1, id_user, id_using, result_post, result_comment, result_profile, distinguish,
                            result_profile1
                        });
                    }
                    // đã gửi lời mời kết bạn
                    else {
                        if (check_friend[0].ch == 1) {
                            const result_profile1 = await query(`SELECT * FROM profile_user WHERE id_of_user = '${id_user}'`);
                            distinguish = 'sending_to_friend';
                            res.render('user/pageProfile', {
                                name_user, name_user1, id_user, id_using, result_post, result_comment, result_profile, distinguish,
                                result_profile1
                            });
                        }
                    }
                }
            }
        }
    } catch (e) {
        console.error(e);
    }
}

// sửa ảnh bìa
const editCoverImage = async (req, res) => {
    upload1(req, res, async () => {
        try {
            const {id_user} = req.query;
            const result_profile = await query(`SELECT * FROM profile_user WHERE id = 1`);
            const image_default = result_profile[0].avatar;
            const check_profile = await query(`SELECT 1 AS ch FROM profile_user WHERE id_of_user = '${id_user}'`);
            if (check_profile[0] == undefined) {
                const insert_image = await query(`INSERT INTO profile_user (id, id_of_user, avatar, cover_image) VALUES (null, '${id_user}', '${image_default}', '/upload1/${req.file.filename}')`);
                await res.json({
                    msg: 'insert cover image success'
                })
            } else {
                if (check_profile[0].ch == 1) {
                    const update_image = await query(`UPDATE profile_user SET cover_image = '/upload1/${req.file.filename}' WHERE id_of_user = '${id_user}'`);
                    await res.json({
                        msg: 'insert cover image success'
                    })
                }
            }
        } catch (e) {
            console.error(e);
        }
    })
}

// sửa ảnh đại diện
const editAvatar = async (req, res) => {
    upload1(req, res, async () => {
        try {
            const {id_user} = req.query;
            const result_profile = await query(`SELECT * FROM profile_user WHERE id = 1`);
            const image_default = result_profile[0].cover_image;
            const check_profile = await query(`SELECT 1 AS ch FROM profile_user WHERE id_of_user = '${id_user}'`);
            if (check_profile[0] == undefined) {
                const insert_avatar = await query(`INSERT INTO profile_user (id, id_of_user, avatar, cover_image) VALUES (null, '${id_user}', '/upload1/${req.file.filename}', '${image_default}')`);
                await res.json({
                    msg: 'insert avatar success'
                })
            } else {
                if (check_profile[0].ch == 1) {
                    const update_avatar = await query(`UPDATE profile_user SET avatar = '/upload1/${req.file.filename}' WHERE id_of_user = '${id_user}'`);
                    await res.json({
                        msg: 'insert avatar success'
                    })
                }
            }
        } catch (e) {
            console.error(e);
        }
    })
}

// thuật toán like
const numberLike = async (req, res) => {
    try {
        const {id_user, id_post} = req.query;
        let number_like = 1;
        const check_like_of_post = await query(`SELECT 1 AS ch FROM like_of_post WHERE id_of_post = '${id_post}'`);
        // kiếm tra 1 yếu tố dựa trên id_post
        if (check_like_of_post[0] == undefined) {
            const insert_a_like = await query(`INSERT INTO like_of_post (id, id_of_user, id_of_post, number_like) VALUES (null, '${id_user}', '${id_post}','${number_like}')`);
        } else {
            if (check_like_of_post[0].ch == 1) {
                // kiểm tra 2 yếu tố id_user và i_post
                const check_like = await query(`SELECT 1 AS ch FROM like_of_post WHERE id_of_post = '${id_post}' AND id_of_user = '${id_user}'`);
                if (check_like[0] == undefined) {
                    const insert_a_like = await query(`INSERT INTO like_of_post (id, id_of_user, id_of_post, number_like) VALUES (null, '${id_user}', '${id_post}','${number_like}')`);
                } else {
                    if (check_like[0].ch == 1) {
                        const delete_a_like = await query(`DELETE FROM like_of_post WHERE id_of_post ='${id_post}' AND id_of_user = '${id_user}'`);
                    }
                }
            }
        }
        const total_number_like = await query(`SELECT * FROM like_of_post WHERE id_of_post = '${id_post}'`);
        let total = 0;
        total += total_number_like.length;
        const update_number_like_to_post = await query(`UPDATE post SET number_like ='${total}' WHERE id = '${id_post}'`);
        await res.json({
            msg: 'ok'
        })
    } catch (e) {
        console.error(e);
    }
}

// đếm số like
const countNumberLike = async (req, res) => {
    try {
        const {id_user, id_post} = req.query;
        const check_number_like = await query(`SELECT * FROM post WHERE id = '${id_post}'`);
        const result_like = await query(`SELECT * FROM like_of_post WHERE id_of_user = '${id_user}'`)
        await res.json({
            check_number_like, result_like
        })
    } catch (e) {
        console.error(e);
    }
}

// thuật toán add friend
const sendFriendInvitations = async (req, res) => {
    try {
        const {id_sender, id_recipient} = req.query;
        const check_friend = await query(`SELECT 1 AS ch FROM friend WHERE id_of_sender = '${id_sender}' AND id_of_recipient = '${id_recipient}'`);
        if (check_friend[0] == undefined) {
            const send_friend_invitations = await query(`INSERT INTO friend (id, id_of_sender, id_of_recipient, allowed, notification_title) VALUES (null, '${id_sender}', '${id_recipient}', 0, 'add friend')`);
        } else {
            if (check_friend[0].ch == 1) {
                return;
            }
        }
        await res.json({
            msg: 'ok'
        })
    } catch (e) {
        console.error(e);
    }
}

//hủy lời mời kết bạn
const deleteSendFriendInvitations = async (req, res) => {
    try {
        const {id_sender, id_recipient} = req.query;
        const check_friend = await query(`SELECT 1 AS ch FROM friend WHERE id_of_sender = '${id_sender}' AND id_of_recipient = '${id_recipient}'`);
        if (check_friend[0] == undefined) {
            return;
        } else {
            if (check_friend[0].ch == 1) {
                const delete_send_friend_invitations = await query(`DELETE FROM friend WHERE id_of_sender ='${id_sender}' AND id_of_recipient = '${id_recipient}'`);
            }
        }
        await res.json({
            msg: 'ok'
        })
    } catch (e) {
        console.error(e);
    }
}




module.exports = {
    startApp, homeUser, registerAccountUser, loginAccountUser, post, comment, loadComment, replyComment, deleteComment,
    pageSearch, pagePostDetail, postDetail, pageProfile, editCoverImage, editAvatar, numberLike, countNumberLike,
    sendFriendInvitations, deleteSendFriendInvitations
}