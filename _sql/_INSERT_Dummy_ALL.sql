-- USERS
INSERT INTO member (member_num, member_id, member_pw, member_name) VALUES (member_seq.NEXTVAL, 'test', '1234', 'wbpark1');
INSERT INTO member (member_num, member_id, member_pw, member_name) VALUES (member_seq.NEXTVAL, 'test1', '1234', 'wbpark2');
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
BEGIN
FOR i IN 1..60 LOOP

  INSERT INTO bulletin (post_id, writer_id, title, content) VALUES (bulletin_seq.NEXTVAL,'test','게시글 '||i, '내용 '||i);

END LOOP;
COMMIT;
END;
/
-----------------------------------


-- post_id가 1부터 5까지인 레코드 삽입
INSERT INTO bulletin (post_id) VALUES (1);
INSERT INTO bulletin (post_id) VALUES (2);
INSERT INTO bulletin (post_id) VALUES (3);
INSERT INTO bulletin (post_id) VALUES (4);
INSERT INTO bulletin (post_id) VALUES (5);

-- 각 레코드의 views 열 값 설정
UPDATE bulletin SET views = 1 WHERE post_id = 1;
UPDATE bulletin SET views = 2 WHERE post_id = 2;
UPDATE bulletin SET views = 3 WHERE post_id = 3;
UPDATE bulletin SET views = 4 WHERE post_id = 4;
UPDATE bulletin SET views = 5 WHERE post_id = 5;





COMMIT;