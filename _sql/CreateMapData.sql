drop table ImageData;

CREATE TABLE ImageData (
   image_path VARCHAR2(255),
   x_position NUMBER,
   y_position NUMBER,
   image_name VARCHAR2(100)
);

INSERT INTO ImageData (image_path, x_position, y_position, image_name)
VALUES ('/images/image1.jpg', 10, 10, 'image1');

INSERT INTO ImageData (image_path, x_position, y_position, image_name)
VALUES ('/images/image2.jpg', 30, 30, 'image2');

INSERT INTO ImageData (image_path, x_position, y_position, image_name)
VALUES ('/images/image3.jpg', 50, 50, 'image3');

SELECT * from imagedata;

commit;
