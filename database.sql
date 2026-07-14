create database if not exists clickfit_db;
use clickfit_db;

create table users(
    userId int auto_increment primary key,
    email varchar(255) not null unique,
    password varchar(255) not null,
    type varchar(100) not null, 
    active boolean not null default true

);

drop procedure if exists adduser;

delimiter $$

create procedure adduser(
    in p_email varchar(255),
    in p_password varchar(255),
    in p_type varchar(100),
    in p_active boolean

)

begin
    insert into users(email,password,type,active)values(p_email,p_password,p_type,p_active);
end $$

delimiter ;
