-- USERS
INSERT INTO member (member_num, member_id, member_pw, member_name) VALUES (member_seq.NEXTVAL, 'test', '123', 'wbpark');
INSERT INTO member (member_num, member_id, member_pw, member_name) VALUES (member_seq.NEXTVAL, 'user1', 'password1', '철수');
INSERT INTO member (member_num, member_id, member_pw, member_name) VALUES (member_seq.NEXTVAL, 'user2', 'password2', '영희');
SELECT * FROM member;

--- IMAGEDATA
INSERT INTO hotspot (spot_idx, spot_name, image_path, x_position, y_position) VALUES (hotspot_seq.NEXTVAL,'a경로당','image1.jpg', 10, 10);
INSERT INTO hotspot (spot_idx, spot_name, image_path, x_position, y_position) VALUES (hotspot_seq.NEXTVAL,'b경로당','image2.jpg', 30, 30);
INSERT INTO hotspot (spot_idx, spot_name, image_path, x_position, y_position) VALUES (hotspot_seq.NEXTVAL,'c경로당','image3.jpg', 50, 50);
SELECT * FROM hotspot;

--- POSTS
INSERT INTO bulletin (post_id, writer_id, title, content) VALUES (bulletin_seq.NEXTVAL,'test','게시글1', '내용1');
INSERT INTO bulletin (post_id, writer_id, title, content) VALUES (bulletin_seq.NEXTVAL,'user1','게시글2', '내용2');
INSERT INTO bulletin (post_id, writer_id, title, content) VALUES (bulletin_seq.NEXTVAL,'user2','게시글3', '내용3');
SELECT * FROM bulletin;

--- COMMENTS
INSERT INTO comments (comment_id, post_id, writer_id, content) VALUES (comments_seq.NEXTVAL,bulletin_seq.CURRVAL,'user2', '내용1');
INSERT INTO comments (comment_id, post_id, writer_id, content) VALUES (comments_seq.NEXTVAL,bulletin_seq.CURRVAL, 'test', '내용2');
INSERT INTO comments (comment_id, post_id, writer_id, content) VALUES (comments_seq.NEXTVAL,bulletin_seq.CURRVAL,'user2', '내용3');
SELECT * FROM comments;


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