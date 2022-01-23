-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th1 23, 2022 lúc 05:04 AM
-- Phiên bản máy phục vụ: 10.4.21-MariaDB
-- Phiên bản PHP: 8.0.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `db_do_an`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `account_admin`
--

CREATE TABLE `account_admin` (
  `id` int(11) NOT NULL,
  `username` varchar(200) COLLATE utf8_vietnamese_ci NOT NULL,
  `password` varchar(36) COLLATE utf8_vietnamese_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_vietnamese_ci;

--
-- Đang đổ dữ liệu cho bảng `account_admin`
--

INSERT INTO `account_admin` (`id`, `username`, `password`) VALUES
(1, 'admin', '123');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `account_user`
--

CREATE TABLE `account_user` (
  `id` int(11) NOT NULL,
  `name_user` varchar(365) COLLATE utf8_vietnamese_ci NOT NULL,
  `username` varchar(365) COLLATE utf8_vietnamese_ci NOT NULL,
  `password` varchar(16) COLLATE utf8_vietnamese_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_vietnamese_ci;

--
-- Đang đổ dữ liệu cho bảng `account_user`
--

INSERT INTO `account_user` (`id`, `name_user`, `username`, `password`) VALUES
(2, 'name_user', 'user', '123'),
(4, 'name_user1', 'user1', '123'),
(6, 'name_user2', 'user2', '123'),
(13, 'name_user3', 'user3', '123');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `comment`
--

CREATE TABLE `comment` (
  `id` int(11) NOT NULL,
  `id_of_user` int(10) NOT NULL,
  `id_of_post` int(10) NOT NULL,
  `name_user` varchar(365) COLLATE utf8_vietnamese_ci NOT NULL,
  `avatar` longtext COLLATE utf8_vietnamese_ci DEFAULT NULL,
  `comment_content` longtext COLLATE utf8_vietnamese_ci NOT NULL,
  `date_comment` varchar(200) COLLATE utf8_vietnamese_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_vietnamese_ci;

--
-- Đang đổ dữ liệu cho bảng `comment`
--

INSERT INTO `comment` (`id`, `id_of_user`, `id_of_post`, `name_user`, `avatar`, `comment_content`, `date_comment`) VALUES
(37, 2, 8, 'name_user', '/upload1/image1-1636293345054.jpg', 'Bình luận 1', '11:36, ngày 07/12, 2020'),
(74, 4, 11, 'name_user1', '/upload1/image1-1608448489166.ico', 'Thấy ok đấy', '12:32, ngày 20/12, 2020'),
(80, 4, 13, 'name_user1', '/upload1/image1-1608448489166.ico', 'hí', '13:58, ngày 20/12, 2020'),
(81, 4, 12, 'name_user1', '/upload1/image1-1608448489166.ico', 'lu', '13:58, ngày 20/12, 2020'),
(83, 6, 17, 'name_user2', '/upload1/tenor.gif', 'OK không mọi người', '20:28, ngày 23/12, 2020'),
(85, 2, 19, 'name_user', '/upload1/image1-1636293345054.jpg', 'Kiểm tra phần bình luận', '16:6, ngày 01/12, 2021');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `comment_of_post`
--

CREATE TABLE `comment_of_post` (
  `id` int(11) NOT NULL,
  `id_of_user` int(10) NOT NULL,
  `id_of_post` int(10) NOT NULL,
  `number_comment` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_vietnamese_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `friend`
--

CREATE TABLE `friend` (
  `id` int(11) NOT NULL,
  `id_of_sender` int(11) NOT NULL,
  `id_of_recipient` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `allowed` tinyint(1) NOT NULL,
  `notification_title` varchar(200) COLLATE utf8_vietnamese_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_vietnamese_ci;

--
-- Đang đổ dữ liệu cho bảng `friend`
--

INSERT INTO `friend` (`id`, `id_of_sender`, `id_of_recipient`, `status`, `allowed`, `notification_title`) VALUES
(38, 4, 2, 1, 1, 'add friend');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `like_of_post`
--

CREATE TABLE `like_of_post` (
  `id` int(11) NOT NULL,
  `id_of_user` int(10) NOT NULL,
  `id_of_post` int(10) NOT NULL,
  `number_like` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_vietnamese_ci;

--
-- Đang đổ dữ liệu cho bảng `like_of_post`
--

INSERT INTO `like_of_post` (`id`, `id_of_user`, `id_of_post`, `number_like`) VALUES
(2, 2, 14, 1),
(3, 2, 12, 1),
(8, 2, 16, 1),
(17, 5, 12, 1),
(20, 4, 14, 1),
(42, 4, 16, 1),
(47, 6, 17, 1),
(55, 4, 19, 1),
(56, 2, 6, 1),
(57, 2, 19, 1),
(58, 2, 20, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `post`
--

CREATE TABLE `post` (
  `id` int(11) NOT NULL,
  `id_of_user` int(10) NOT NULL,
  `post_status` varchar(11) COLLATE utf8_vietnamese_ci NOT NULL,
  `content` varchar(365) COLLATE utf8_vietnamese_ci NOT NULL,
  `link_image` varchar(365) COLLATE utf8_vietnamese_ci DEFAULT NULL,
  `date_posted` varchar(200) COLLATE utf8_vietnamese_ci NOT NULL,
  `name_user` varchar(365) COLLATE utf8_vietnamese_ci NOT NULL,
  `avatar` longtext COLLATE utf8_vietnamese_ci DEFAULT NULL,
  `detail_content` longtext COLLATE utf8_vietnamese_ci DEFAULT NULL,
  `material` int(8) DEFAULT NULL,
  `material_price` int(10) DEFAULT NULL,
  `time_do` int(10) DEFAULT NULL,
  `level_do` varchar(100) COLLATE utf8_vietnamese_ci DEFAULT NULL,
  `allowed` tinyint(1) NOT NULL,
  `number_like` int(10) DEFAULT NULL,
  `number_comment` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_vietnamese_ci;

--
-- Đang đổ dữ liệu cho bảng `post`
--

INSERT INTO `post` (`id`, `id_of_user`, `post_status`, `content`, `link_image`, `date_posted`, `name_user`, `avatar`, `detail_content`, `material`, `material_price`, `time_do`, `level_do`, `allowed`, `number_like`, `number_comment`) VALUES
(6, 2, 'Incomplete', 'bbbbbbb', '/upload/image-1607230697459.jpg', 'Ngày 06 tháng 12, 2020', 'name_user', '/upload1/image1-1636293345054.jpg', NULL, NULL, NULL, NULL, NULL, 1, 1, NULL),
(8, 2, 'Complete', 'dddddđ', '/upload/image-1607238665577.jpg', 'Ngày 06 tháng 12, 2020', 'name_user', '/upload1/image1-1636293345054.jpg', '<figure class=\"image\"><img src=\"https://76763.cdn.cke-cs.com/1ffIjA2LKprBAj4uiRee/images/273c5577b4c2aab2744d4ad68738ceaf928c5b5d6d37a576.jpg\" srcset=\"https://76763.cdn.cke-cs.com/1ffIjA2LKprBAj4uiRee/images/273c5577b4c2aab2744d4ad68738ceaf928c5b5d6d37a576.jpg/w_130 130w, https://76763.cdn.cke-cs.com/1ffIjA2LKprBAj4uiRee/images/273c5577b4c2aab2744d4ad68738ceaf928c5b5d6d37a576.jpg/w_260 260w, https://76763.cdn.cke-cs.com/1ffIjA2LKprBAj4uiRee/images/273c5577b4c2aab2744d4ad68738ceaf928c5b5d6d37a576.jpg/w_390 390w, https://76763.cdn.cke-cs.com/1ffIjA2LKprBAj4uiRee/images/273c5577b4c2aab2744d4ad68738ceaf928c5b5d6d37a576.jpg/w_520 520w, https://76763.cdn.cke-cs.com/1ffIjA2LKprBAj4uiRee/images/273c5577b4c2aab2744d4ad68738ceaf928c5b5d6d37a576.jpg/w_650 650w, https://76763.cdn.cke-cs.com/1ffIjA2LKprBAj4uiRee/images/273c5577b4c2aab2744d4ad68738ceaf928c5b5d6d37a576.jpg/w_780 780w, https://76763.cdn.cke-cs.com/1ffIjA2LKprBAj4uiRee/images/273c5577b4c2aab2744d4ad68738ceaf928c5b5d6d37a576.jpg/w_910 910w, https://76763.cdn.cke-cs.com/1ffIjA2LKprBAj4uiRee/images/273c5577b4c2aab2744d4ad68738ceaf928c5b5d6d37a576.jpg/w_1040 1040w, https://76763.cdn.cke-cs.com/1ffIjA2LKprBAj4uiRee/images/273c5577b4c2aab2744d4ad68738ceaf928c5b5d6d37a576.jpg/w_1170 1170w, https://76763.cdn.cke-cs.com/1ffIjA2LKprBAj4uiRee/images/273c5577b4c2aab2744d4ad68738ceaf928c5b5d6d37a576.jpg/w_1280 1280w\" sizes=\"100vw\" width=\"1280\"></figure><p>Ảnh minh họa</p>', 2, 10000, 1, 'Đơn giản', 0, 0, NULL),
(12, 4, 'Incomplete', 'Bài này t chỉ test thôi', '/upload/image-1608365758849.gif', 'Ngày 20 tháng 12, 2020', 'name_user1', '/upload1/image1-1608448489166.ico', NULL, NULL, NULL, NULL, NULL, 1, 2, NULL),
(14, 4, 'Incomplete', '10 giây ', '/upload/image-1608526275600.gif', 'Ngày 21 tháng 12, 2020', 'name_user1', '/upload1/image1-1608448489166.ico', NULL, NULL, NULL, NULL, NULL, 0, 2, NULL),
(17, 6, 'Incomplete', 'T cũng thử đăng bài', '/upload/image-1608730064726.jpg', 'Ngày 23 tháng 12, 2020', 'name_user2', '/upload1/tenor.gif', NULL, NULL, NULL, NULL, NULL, 1, 1, NULL),
(19, 2, 'Incomplete', 'Ngày hôm nay là 14/01/2021', '/upload/image-1610594035434.png', 'Ngày 14 tháng 01, 2021', 'name_user', '/upload1/image1-1636293345054.jpg', NULL, NULL, NULL, NULL, NULL, 1, 2, NULL),
(21, 2, 'Incomplete', 'Kiểm tra chức năng đăng bài', '/upload/image-1642835617339.jpg', 'Ngày 22 tháng 01, 2022', 'name_user', '/upload1/image1-1636293345054.jpg', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL),
(22, 4, 'Incomplete', 'Date 22/01/2022', '/upload/image-1642854961574.jpg', 'Ngày 22 tháng 01, 2022', 'name_user1', '/upload1/image1-1608448489166.ico', NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `profile_user`
--

CREATE TABLE `profile_user` (
  `id` int(11) NOT NULL,
  `id_of_user` int(10) NOT NULL,
  `name_user` varchar(356) COLLATE utf8_vietnamese_ci DEFAULT NULL,
  `avatar` longtext COLLATE utf8_vietnamese_ci DEFAULT NULL,
  `cover_image` longtext COLLATE utf8_vietnamese_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_vietnamese_ci;

--
-- Đang đổ dữ liệu cho bảng `profile_user`
--

INSERT INTO `profile_user` (`id`, `id_of_user`, `name_user`, `avatar`, `cover_image`) VALUES
(17, 2, 'name_user', '/upload1/image1-1636293345054.jpg', '/upload1/image1-1608436169907.jpg'),
(24, 4, 'name_user1', '/upload1/image1-1608448489166.ico', '/upload1/image1-1608535514846.jpg'),
(25, 6, 'name_user2', '/upload1/tenor.gif', '/upload1/default-image.jpg'),
(27, 13, 'name_user3', '/upload1/image1-1642827580012.jpg', '/upload1/default-image.jpg');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reply`
--

CREATE TABLE `reply` (
  `id` int(11) NOT NULL,
  `id_of_user` int(10) NOT NULL,
  `id_of_comment` int(10) NOT NULL,
  `name_user` varchar(365) COLLATE utf8_vietnamese_ci NOT NULL,
  `avatar` longtext COLLATE utf8_vietnamese_ci DEFAULT NULL,
  `reply_content` longtext COLLATE utf8_vietnamese_ci NOT NULL,
  `date_replied` varchar(200) COLLATE utf8_vietnamese_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_vietnamese_ci;

--
-- Đang đổ dữ liệu cho bảng `reply`
--

INSERT INTO `reply` (`id`, `id_of_user`, `id_of_comment`, `name_user`, `avatar`, `reply_content`, `date_replied`) VALUES
(5, 2, 37, 'name_user', '/upload1/image1-1636293345054.jpg', 'Trả lời bình luận 1', '18:17, ngày 07/12, 2020'),
(34, 4, 37, 'name_user1', '/upload1/image1-1608448489166.ico', 'hi', '13:18, ngày 20/12, 2020'),
(35, 2, 81, 'name_user', '/upload1/image1-1636293345054.jpg', 'được đấy', '13:59, ngày 20/12, 2020'),
(36, 2, 82, 'name_user', '/upload1/image1-1636293345054.jpg', 'được đấy', '17:55, ngày 23/12, 2020'),
(37, 4, 82, 'name_user1', '/upload1/image1-1608448489166.ico', 'công nhận :D', '17:56, ngày 23/12, 2020'),
(38, 2, 83, 'name_user', '/upload1/image1-1636293345054.jpg', 'ok đấy', '20:28, ngày 23/12, 2020'),
(40, 4, 85, 'name_user1', '/upload1/image1-1608448489166.ico', 'Ok', '16:6, ngày 01/12, 2021');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `account_admin`
--
ALTER TABLE `account_admin`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `account_user`
--
ALTER TABLE `account_user`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `comment_of_post`
--
ALTER TABLE `comment_of_post`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `friend`
--
ALTER TABLE `friend`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `like_of_post`
--
ALTER TABLE `like_of_post`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `profile_user`
--
ALTER TABLE `profile_user`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `reply`
--
ALTER TABLE `reply`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `account_admin`
--
ALTER TABLE `account_admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `account_user`
--
ALTER TABLE `account_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `comment`
--
ALTER TABLE `comment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;

--
-- AUTO_INCREMENT cho bảng `comment_of_post`
--
ALTER TABLE `comment_of_post`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `friend`
--
ALTER TABLE `friend`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT cho bảng `like_of_post`
--
ALTER TABLE `like_of_post`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT cho bảng `post`
--
ALTER TABLE `post`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT cho bảng `profile_user`
--
ALTER TABLE `profile_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT cho bảng `reply`
--
ALTER TABLE `reply`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
