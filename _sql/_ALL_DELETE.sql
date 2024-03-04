DECLARE
  sql_stmt VARCHAR2(200);
BEGIN
  -- 모든 시퀀스 삭제
  FOR seq IN (SELECT sequence_name FROM user_sequences) LOOP
    sql_stmt := 'DROP SEQUENCE ' || seq.sequence_name;
    EXECUTE IMMEDIATE sql_stmt;
  END LOOP;

  -- 모든 테이블 삭제
  FOR tab IN (SELECT table_name FROM user_tables) LOOP
    sql_stmt := 'DROP TABLE ' || tab.table_name || ' CASCADE CONSTRAINTS';
    EXECUTE IMMEDIATE sql_stmt;
  END LOOP;
END;
/
