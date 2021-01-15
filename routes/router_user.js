const express = require('express');
const router = express.Router();
const controller = require("../controller/controller_user")

/* Start app. */
router.get('/', controller.startApp);
// đăng ký tài khoản user
router.post('/registerAccountUser', controller.registerAccountUser);
// đăng nhập user
router.post('/loginAccountUser', controller.loginAccountUser);
// trang chủ của user
router.get('/user/homeUser', controller.homeUser);
// đăng bài
router.post('/post', controller.post);
// bình luận
router.post('/comment', controller.comment);
// load bình luận
router.get('/loadComment', controller.loadComment);
// trả lời bình luận
router.post('/replyComment', controller.replyComment);
// xóa bình luận
router.get('/deleteComment', controller.deleteComment);
// trang tìm kiếm
router.get('/user/pageSearch', controller.pageSearch);
// trang bài viết hoàn chỉnh
router.get('/user/pagePostDetail', controller.pagePostDetail);
// đăng bài viết hoàn chỉnh
router.post('/postDetail', controller.postDetail);
// trang cá nhân
router.get('/user/pageProfile', controller.pageProfile);
// sửa ảnh bìa
router.post(`/editCoverImage`, controller.editCoverImage);
// sửa ảnh đại diện
router.post(`/editAvatar`, controller.editAvatar);
// tính toán số like
router.post(`/numberLike`, controller.numberLike);
// điếm số like
router.get(`/countNumberLike`, controller.countNumberLike);
// gửi lời mời kết bạn
router.get(`/sendFriendInvitations`, controller.sendFriendInvitations);
// hủy lời mời
router.get(`/deleteSendFriendInvitations`, controller.deleteSendFriendInvitations);


module.exports = router;
