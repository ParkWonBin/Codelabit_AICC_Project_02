DROP SEQUENCE reviews_seq;
DROP TABLE reviews CASCADE CONSTRAINTS;

DROP SEQUENCE comments_seq;
DROP TABLE comments CASCADE CONSTRAINTS;

DROP SEQUENCE post_seq;
DROP TABLE posts CASCADE CONSTRAINTS;

DROP SEQUENCE image_seq;
DROP TABLE IMAGEDATA CASCADE CONSTRAINTS;

DROP SEQUENCE user_seq;
DROP TABLE users CASCADE CONSTRAINTS;
------------------------------------------
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
-- USERS
INSERT INTO users (user_num, user_id, user_pw, user_name) VALUES (user_seq.NEXTVAL, 'test', '123', 'wbpark');
INSERT INTO users (user_num, user_id, user_pw, user_name) VALUES (user_seq.NEXTVAL, 'user1', 'password1', '철수');
INSERT INTO users (user_num, user_id, user_pw, user_name) VALUES (user_seq.NEXTVAL, 'user2', 'password2', '영희');

--- IMAGEDATA
INSERT INTO ImageData (image_id, image_path, x_position, y_position) VALUES (image_seq.NEXTVAL,'image1.jpg', 10, 10);
INSERT INTO ImageData (image_id, image_path, x_position, y_position) VALUES (image_seq.NEXTVAL,'image2.jpg', 30, 30);
INSERT INTO ImageData (image_id, image_path, x_position, y_position) VALUES (image_seq.NEXTVAL,'image3.jpg', 50, 50);

--- POSTS
INSERT INTO posts (post_id, author_no, title, content) VALUES (post_seq.NEXTVAL,1,'게시글1', '내용1');
INSERT INTO posts (post_id, author_no, title, content) VALUES (post_seq.NEXTVAL,2,'게시글2', '내용2');
INSERT INTO posts (post_id, author_no, title, content) VALUES (post_seq.NEXTVAL,1,'게시글3', '내용3');

--- REVIEWS
INSERT INTO reviews (review_id, image_id, author_no, content) VALUES (reviews_seq.NEXTVAL,image_seq.CURRVAL,ROUND(DBMS_RANDOM.VALUE(1, 3)), '댓글1');
INSERT INTO reviews (review_id, image_id, author_no, content) VALUES (reviews_seq.NEXTVAL,image_seq.CURRVAL,ROUND(DBMS_RANDOM.VALUE(1, 3)), '댓글2');
INSERT INTO reviews (review_id, image_id, author_no, content) VALUES (reviews_seq.NEXTVAL,image_seq.CURRVAL,ROUND(DBMS_RANDOM.VALUE(1, 3)), '댓글3');

--- COMMENTS
INSERT INTO comments (comment_id, post_id, author_no, content) VALUES (comments_seq.NEXTVAL,post_seq.CURRVAL,ROUND(DBMS_RANDOM.VALUE(1, 3)), '내용1');
INSERT INTO comments (comment_id, post_id, author_no, content) VALUES (comments_seq.NEXTVAL,post_seq.CURRVAL,ROUND(DBMS_RANDOM.VALUE(1, 3)), '내용2');
INSERT INTO comments (comment_id, post_id, author_no, content) VALUES (comments_seq.NEXTVAL,post_seq.CURRVAL,ROUND(DBMS_RANDOM.VALUE(1, 3)), '내용3');


--- POSTS 60개의 더미 게시글 생성
DECLARE
a_no NUMBER;
  p_id NUMBER;
BEGIN
  -- 변수를 한 번 설정하고 반복문 내에서 사용
  a_no := ROUND(DBMS_RANDOM.VALUE(1, 3));

FOR i IN 1..60 LOOP
    -- 루프의 각 반복에서 시퀀스 값 할당
SELECT post_seq.NEXTVAL INTO p_id FROM dual;

INSERT INTO posts (post_id, title, content, author_no)
VALUES (p_id, '제목 ' || p_id, '테스트 내용 ' || p_id, a_no);
END LOOP;
COMMIT;
END;
/

--- REVIEWS 30개의 더미 댓글 생성
DECLARE
a_no NUMBER;
    i_id NUMBER;
BEGIN
  -- 변수를 한 번 설정하고 반복문 내에서 사용
SELECT image_seq.CURRVAL INTO i_id FROM dual;

FOR i IN 1..10 LOOP
    -- 루프의 각 반복에서 값 할당
    a_no := ROUND(DBMS_RANDOM.VALUE(1, 3));
INSERT INTO reviews (review_id, image_id, author_no, content)
VALUES (reviews_seq.NEXTVAL, i_id, a_no, '리뷰 '||i_id);
END LOOP;
COMMIT;
END;
/

-- 예시댓글 생성
DECLARE
  a_no NUMBER;
  p_id NUMBER;
BEGIN
  -- 변수를 한 번 설정하고 반복문 내에서 사용
SELECT post_seq.CURRVAL INTO p_id FROM dual;

FOR i IN 1..10 LOOP
    -- 루프의 각 반복에서 값 할당
    a_no := ROUND(DBMS_RANDOM.VALUE(1, 3));
INSERT INTO comments (comment_id, post_id, author_no, content)
VALUES (comments_seq.NEXTVAL, p_id, a_no, '댓글 '||p_id);
END LOOP;
COMMIT;
END;
/
-----------------------------------
COMMIT;