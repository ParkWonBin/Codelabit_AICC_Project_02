## _README
이 문서는 프로젝트 완료 후 경험을 복기하기 위해 생성된 문서입니다.  
README.MD 파일은 프로젝트 관리 및 발표와 관련된 내용으로 구성하고.  
프로젝트 진행과정 중 유의사항이나 기본 환경설정 등에 해당하는 정보는 여기에 기록합니다.  


#### 시작할 때 환경 설정
multer의 경우 최신버전은 한글을 지원하지 않음.   
nulter 1.4.4 버전 다운로드를 위해 ```npm install multe@1.4.4``` 명령 수행.   
이미 최신버전 multer가 설치돼있다면, ```npm uninstall multer```로 삭제 후 재설치 요망.
```bash
npm init # 프로젝트 시작
npm install express express-session ejs # express 설치
npm install oracledb dotenv # oracle 연결
npm install multe@1.4.4 moment # 이미지 전송을 위함
npm install bcryptjs passport # 보안관련
```

