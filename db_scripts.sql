create sequence user_id_seq increment by 1 start with 10;  
 
create table users (
	id int default nextval('user_id_seq') primary key,
	email text,
	password text,
	first_name text,
	last_name text, 
	role text,
	daily_limit int default 2100
); 

create sequence foodentry_id_seq increment by 1 start with 10;  

create table foodentries (
	id int default nextval('foodentry_id_seq') primary key,
	datetime timestamptz,
	food text, 
	calories float,
	user_id int references users(id),
	created_at timestamptz
); 

insert into users(id, email, first_name, last_name, role) 
values (1, 'testuser01@example.com', 'Test', 'User01', 'User'); 

insert into foodentries (id, datetime, food, calories, user_id, created_at) 
select 1, now(), 'Eggs', 250, id, now() from users where email = 'testuser01@example.com'; 

insert into foodentries (id, datetime, food, calories, user_id, created_at) 
select 2, now(), 'Cheese', 600, id, now() from users where email = 'testuser01@example.com'; 

insert into foodentries (id, datetime, food, calories, user_id, created_at) 
select 3, now(), 'Milk', 400, id, now() - interval '1 day' from users where email = 'testuser01@example.com'; 

insert into foodentries (id, datetime, food, calories, user_id, created_at) 
select 4, now() - interval '1 day', 'Big Mac', 800, id, now() - interval '1 day' from users where email = 'testuser01@example.com';