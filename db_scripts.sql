create sequence user_id_seq increment by 1 start with 1;  
 
create table users (
	id int default nextval('user_id_seq') primary key,
	email text,
	password text,
	first_name text,
	last_name text, 
	role text,
	daily_limit int default 2100
); 

create sequence foodentry_id_seq increment by 1 start with 1;  

create table foodentries (
	id int default nextval('foodentry_id_seq') primary key,
	datetime timestamp,
	food text, 
	calories float,
	user_id int references users(id)
); 
