-- 회원정보 관련-------------------
CREATE TABLE users (
  user_num NUMBER NOT NULL , -- 가입한 순서
  user_id VARCHAR2(50) NOT NULL UNIQUE,-- 회원 ID
  user_pw VARCHAR2(50) NOT NULL, -- 비밀번호
  user_name VARCHAR2(50), -- 닉네임
  user_role VARCHAR2(20), -- 역할(관리자 등)
  PRIMARY KEY (user_num) -- user_num를 기본 키로 설정
);

CREATE SEQUENCE user_seq
  START WITH 1
  INCREMENT BY 1
  NOCACHE
NOCYCLE;
-----------------------------------
-- 이미지 게시 관련
CREATE TABLE IMAGEDATA (
  image_id NUMBER NOT NULL, -- 입력한 순서
  Auther_no NUMBER, 
  region VARCHAR2(100),
  x_position NUMBER NOT NULL,
  y_position NUMBER NOT NULL,
  image_path VARCHAR2(255) NOT NULL UNIQUE,
  content CLOB,
  likes NUMBER DEFAULT 0,
  PRIMARY KEY (image_id), -- image_id 기본 키로 설정
  FOREIGN KEY (Auther_no) REFERENCES users(user_num) -- users 테이블의 user_num을 참조하는 외래 키
);

CREATE SEQUENCE image_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE
NOCYCLE;
-----------------------------------
-- 공지사항 게시 관련
CREATE TABLE posts (
   post_id NUMBER NOT NULL, -- 입력한 순서를 나타내는 자동 증가 필드
   author_no NUMBER,
   title VARCHAR2(100) NOT NULL,
   content CLOB,
   views NUMBER DEFAULT 0,
   likes NUMBER DEFAULT 0,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (post_id), -- post_id 기본 키로 설정
   FOREIGN KEY (author_no) REFERENCES users(user_num) -- users 테이블의 user_num을 참조하는 외래 키
);

CREATE SEQUENCE post_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE
NOCYCLE;
-----------------------------------
-- 이미지 댓글 관련
CREATE TABLE reviews (
  review_id NUMBER PRIMARY KEY,
  image_id NUMBER NOT NULL,
  author_no NUMBER NOT NULL,
  content CLOB,
  created_at TIMESTAMP(6),
  parent_review_id NUMBER,
  FOREIGN KEY (parent_review_id) REFERENCES reviews(review_id),
  FOREIGN KEY (image_id) REFERENCES IMAGEDATA(image_id),
  FOREIGN KEY (author_no) REFERENCES users(user_num)
);

CREATE SEQUENCE reviews_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE
NOCYCLE;
-----------------------------------
-- 공지 댓글 관련
CREATE TABLE comments (
  comment_id NUMBER PRIMARY KEY,
  post_id NUMBER NOT NULL,
  author_no NUMBER NOT NULL,
  content CLOB,
  created_at TIMESTAMP(6),
  parent_comment_id NUMBER,
  FOREIGN KEY (parent_comment_id) REFERENCES comments(comment_id),
  FOREIGN KEY (post_id) REFERENCES posts(post_id),
  FOREIGN KEY (author_no) REFERENCES users(user_num)
);

CREATE SEQUENCE comments_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE
NOCYCLE;
-----------------------------------
COMMIT;