const express = require('express');
const router = express.Router();
const controller = require("../controller/controller_admin");


/* Start app. */
router.get(`/admin/loginAdmin`,controller.pageLoginAdmin);
// mở qua trang admin
router.get('/admin/homeAdmin', controller.homeAdmin);
// quản lý người dùng
router.get('/admin/pageManagementUser', controller.pageManagementUser);
// trang xem các bài đăng và cho phép đăng bài
router.get('/admin/pageViewBlogs', controller.pageViewBlogs);
// trang xem chi tiết bài đăng
router.get('/admin/pageViewBlogDetail', controller.pageViewBlogDetail);
//trang cá nhân
router.get('/admin/pageProfile', controller.pageProfile);
// đăng nhập
router.post('/loginAdmin', controller.loginAdmin);
// chấp nhận bài viết
router.get('/acceptPost', controller.acceptPost);
//xóa bài viết
router.get('/deletePost', controller.deletePost);
// xem bài viết đã được active
router.get('/admin/pageViewBlogsActive', controller.pageViewBlogsActive);

module.exports = router;