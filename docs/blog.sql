/*
Navicat MySQL Data Transfer

Source Server         : dev_localhost
Source Server Version : 50514
Source Host           : 127.0.0.1:3306
Source Database       : demo

Target Server Type    : MYSQL
Target Server Version : 50514
File Encoding         : 65001

Date: 2014-02-21 10:38:10
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for blog
-- ----------------------------
DROP TABLE IF EXISTS `blog`;
CREATE TABLE `blog` (
  `id` char(32) NOT NULL,
  `title` char(120) NOT NULL COMMENT '标题',
  `content` text NOT NULL COMMENT '内容',
  `date` datetime DEFAULT NULL COMMENT '日期',
  `orgcode` varchar(20) NOT NULL COMMENT '机构',
  `orgroot` char(6) NOT NULL COMMENT '顶级机构',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
  `updatetime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '更新时间',
  `deleted` tinyint(4) NOT NULL DEFAULT '0' COMMENT '删除标记',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=39 DEFAULT CHARSET=utf8 COMMENT='文章';
