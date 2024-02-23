-- 용어정리 : 
-- 회원관리 : member [x]
-- 게시글 관리 : bulletin
-- 장소 관리 : hotspot
-- -- 장소의 이름 : spot_id
-- 쳇봇을 넣는다면 장소의 이름이나 주소를 넣어서, 안내해주는 게 좋을 것 같다. 네이버 지도 링크(기술체크 OK)도 같이 주고.
-- ------> 고도화 : 쳇봇 컨텐츠 생각 안나면 GPT로 대충 처리하기.

--차트와 관련된 것.
-- 차트 데이터 - 
-- 실 데이터 - 

DROP SEQUENCE reviews_seq;
DROP TABLE reviews CASCADE CONSTRAINTS;

DROP SEQUENCE comments_seq;
DROP TABLE comments CASCADE CONSTRAINTS;

DROP SEQUENCE post_seq;
DROP TABLE bulletin CASCADE CONSTRAINTS;

DROP SEQUENCE image_seq;
DROP TABLE hotspot CASCADE CONSTRAINTS;

DROP SEQUENCE member_seq;
DROP TABLE member CASCADE CONSTRAINTS;
------------------------------------------
-- 회원정보 관련-------------------
-- TODO : member 테이블명을 member로 변경
CREATE TABLE member (
                       member_num NUMBER NOT NULL , -- 가입한 순서
                       member_id VARCHAR2(50) NOT NULL,-- 회원 ID
                       member_pw VARCHAR2(50) NOT NULL, -- 비밀번호
                       member_name VARCHAR2(50) NOT NULL, -- 닉네임
                       member_role VARCHAR2(20), -- 역할(관리자 등)
                       PRIMARY KEY (member_id) -- member_id를 기본 키로 설정
);

CREATE SEQUENCE member_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE
NOCYCLE;
-----------------------------------
-- 이미지 게시 관련
CREATE TABLE hotspot (
                           spot_idx NUMBER NOT NULL, -- 입력한 순서
                           spot_name varchar2(255) NOT NULL,  - 소재지 이름(장소이름)
                           spot_address varchar2(255), -- 실제 주소(~~길)
                           Auther_id VARCHAR2(50), --TBD ToBeDetermine 미정 추후 결정 예정 - 적절한 네이밍 필요.
                           region VARCHAR2(100), -- 당장은 안쓰겠지만, 추후에 여러지역 관리할 일 있을 것 같아 미리 추가.
                           x_position NUMBER NOT NULL,
                           y_position NUMBER NOT NULL,
                           image_path VARCHAR2(255) NOT NULL UNIQUE,
                           content CLOB, -- 장소 클릭했을 때 장소 설명이 뜨게 하려면, 해당 설명 넣을 공간
                           likes NUMBER DEFAULT 0,
                           FOREIGN KEY (Auther_id) REFERENCES member(member_id) -- member 테이블의 member_id을 참조하는 외래 키
);

CREATE SEQUENCE image_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE
NOCYCLE;
-----------------------------------
-- 공지사항 게시 관련
CREATE TABLE bulletin (
                       post_id NUMBER NOT NULL, -- 입력한 순서를 나타내는 자동 증가 필드
                       writer_id varchar2(50),
                       title VARCHAR2(100) NOT NULL,
                       content CLOB,
                       views NUMBER DEFAULT 0,
                       likes NUMBER DEFAULT 0,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       PRIMARY KEY (post_id), -- post_id 기본 키로 설정
                       FOREIGN KEY (writer_id) REFERENCES member(member_id) -- member 테이블의 member_num을 참조하는 외래 키
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
                         FOREIGN KEY (image_id) REFERENCES hotspot(image_id),
                         FOREIGN KEY (author_no) REFERENCES member(member_num)
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
                          FOREIGN KEY (post_id) REFERENCES bulletin(post_id),
                          FOREIGN KEY (author_no) REFERENCES member(member_num)
);

CREATE SEQUENCE comments_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE
NOCYCLE;
-----------------------------------
-- member
INSERT INTO member (member_num, member_id, member_pw, member_name) VALUES (member_seq.NEXTVAL, 'test', '123', 'wbpark');
INSERT INTO member (member_num, member_id, member_pw, member_name) VALUES (member_seq.NEXTVAL, 'user1', 'password1', '철수');
INSERT INTO member (member_num, member_id, member_pw, member_name) VALUES (member_seq.NEXTVAL, 'user2', 'password2', '영희');

--- hotspot
INSERT INTO hotspot (image_id, image_path, x_position, y_position) VALUES (image_seq.NEXTVAL,'image1.jpg', 10, 10);
INSERT INTO hotspot (image_id, image_path, x_position, y_position) VALUES (image_seq.NEXTVAL,'image2.jpg', 30, 30);
INSERT INTO hotspot (image_id, image_path, x_position, y_position) VALUES (image_seq.NEXTVAL,'image3.jpg', 50, 50);

--- bulletin
INSERT INTO bulletin (post_id, author_no, title, content) VALUES (post_seq.NEXTVAL,1,'게시글1', '내용1');
INSERT INTO bulletin (post_id, author_no, title, content) VALUES (post_seq.NEXTVAL,2,'게시글2', '내용2');
INSERT INTO bulletin (post_id, author_no, title, content) VALUES (post_seq.NEXTVAL,1,'게시글3', '내용3');

--- REVIEWS
INSERT INTO reviews (review_id, image_id, author_no, content) VALUES (reviews_seq.NEXTVAL,image_seq.CURRVAL,ROUND(DBMS_RANDOM.VALUE(1, 3)), '댓글1');
INSERT INTO reviews (review_id, image_id, author_no, content) VALUES (reviews_seq.NEXTVAL,image_seq.CURRVAL,ROUND(DBMS_RANDOM.VALUE(1, 3)), '댓글2');
INSERT INTO reviews (review_id, image_id, author_no, content) VALUES (reviews_seq.NEXTVAL,image_seq.CURRVAL,ROUND(DBMS_RANDOM.VALUE(1, 3)), '댓글3');

--- COMMENTS
INSERT INTO comments (comment_id, post_id, author_no, content) VALUES (comments_seq.NEXTVAL,post_seq.CURRVAL,ROUND(DBMS_RANDOM.VALUE(1, 3)), '내용1');
INSERT INTO comments (comment_id, post_id, author_no, content) VALUES (comments_seq.NEXTVAL,post_seq.CURRVAL,ROUND(DBMS_RANDOM.VALUE(1, 3)), '내용2');
INSERT INTO comments (comment_id, post_id, author_no, content) VALUES (comments_seq.NEXTVAL,post_seq.CURRVAL,ROUND(DBMS_RANDOM.VALUE(1, 3)), '내용3');


--- bulletin 60개의 더미 게시글 생성
DECLARE
a_no NUMBER;
  p_id NUMBER;
BEGIN
  -- 변수를 한 번 설정하고 반복문 내에서 사용
  a_no := ROUND(DBMS_RANDOM.VALUE(1, 3));

FOR i IN 1..60 LOOP
    -- 루프의 각 반복에서 시퀀스 값 할당
SELECT post_seq.NEXTVAL INTO p_id FROM dual;

INSERT INTO bulletin (post_id, title, content, author_no)
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
