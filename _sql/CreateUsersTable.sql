--- 환경 초기화
DROP SEQUENCE user_seq;
DROP TRIGGER trg_user_no;
DROP TABLE users CASCADE CONSTRAINTS;

--- 유저 테이블 생성
CREATE TABLE users (
    user_no NUMBER NOT NULL, -- 가입한 순서를 나타내는 자동 증가 필드
    user_id VARCHAR2(50) NOT NULL UNIQUE,-- 회원 ID
    user_pw VARCHAR2(50) NOT NULL, -- 비밀번호
    user_name VARCHAR2(50) NOT NULL UNIQUE, -- 닉네임
    PRIMARY KEY (user_no) -- user_no를 기본 키로 설정
);

--- 유저넘버 시퀀스 생성
CREATE SEQUENCE user_seq
START WITH 1
INCREMENT BY 1
NOCACHE
NOCYCLE;

--- 행추가 명령 실행되면 자동으로 유저넘버 증감되어 추가되도록 하기
CREATE OR REPLACE TRIGGER trg_user_no
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
  SELECT user_seq.NEXTVAL
  INTO   :new.user_no
  FROM   dual;
END;
/
-- END; 명령어로 PL/SQL 블록을 종료하고, 
-- /를 다음줄에 추가해야 트리거 정의가 데이터베이스에 제대로 전달될 수 있습니다.


-- user_no 는 자동으로 증가하게 했기 때문에 insert에 넣을 필요가 없다.
INSERT INTO users (user_id, user_pw, user_name) VALUES ('test', '123', 'wbpark');
INSERT INTO users (user_id, user_pw, user_name) VALUES ('user1', 'password1', '철수');
INSERT INTO users (user_id, user_pw, user_name) VALUES ('user2', 'password2', '영희');

-- 결과 조회
SELECT * FROM users;

-- 저장 
COMMIT;
-- sql developer든 nodejs든 commit 안하면 db에 반영 안됨.
