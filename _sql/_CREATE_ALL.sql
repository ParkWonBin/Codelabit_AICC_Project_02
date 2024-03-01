-- 회원정보 관련-------------------
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
  spot_name varchar2(255) NOT NULL,  -- 소재지 이름(장소이름)
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


CREATE SEQUENCE hotspot_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE
NOCYCLE;
-----------------------------------
-- 공지사항 게시 관련
CREATE TABLE bulletin (
  post_id NUMBER NOT NULL, -- 입력한 순서를 나타내는 자동 증가 필드
  writer_id VARCHAR2(50),
  title VARCHAR2(100) NOT NULL,
  content CLOB,
  views NUMBER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (post_id), -- 여기에 추가
  FOREIGN KEY (writer_id) REFERENCES member(member_id) 
);


CREATE SEQUENCE bulletin_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE
NOCYCLE;
-----------------------------------
-- 공지 댓글 관련
CREATE TABLE comments (
  comment_id NUMBER,
  post_id NUMBER NOT NULL,
  writer_id varchar2(50),
  content varchar2(140),
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  parent_comment_id NUMBER,
  PRIMARY KEY (comment_id), -- 기본 키로 설정
  FOREIGN KEY (parent_comment_id) REFERENCES comments(comment_id),
  FOREIGN KEY (post_id) REFERENCES bulletin(post_id),
  FOREIGN KEY (writer_id) REFERENCES member(member_id)
);  -- parent_comment_id 에서 자기참조하려면, comment_id가 PRIMARY KEY 여야한다.

CREATE SEQUENCE comments_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE
NOCYCLE;

------------------------------------------
COMMIT;
