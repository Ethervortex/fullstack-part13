SQL commands in Exercise 13.2:

CREATE TABLE blogs(id SERIAL PRIMARY KEY, author text, url text NOT NULL, title text NOT NULL, likes integer DEFAULT 0);

insert into blogs (author, url, title) values ('Teemu Testaaja', 'https://www.testi.fi', 'Blog 1');

insert into blogs (author, url, title) values ('Outi Outo', 'https://www.yle.fi', 'Blog 2');

select * from blogs;

