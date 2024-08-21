# TodoList
로컬로 mysql과 연동하면 사용가능
server/src/index.js에 정보 입력

# 테이블 형식
```sql
CREATE DATABASE tododb;

USE tododb;

CREATE TABLE todos (
    no INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    done BOOLEAN NOT NULL DEFAULT false
);
```