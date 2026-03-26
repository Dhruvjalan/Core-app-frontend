export interface LoginForm {
	email: string;
	password: string;
	repassword: string;
	vertical: string;
	access:string;
}



export interface User {
	_id: string;
	name: string;
	email: string;
	authtoken: string;
	access: string;
}

export interface OtpGenProps {
	UUID: string;
	email: string;
}

export interface POC{
	_id: string;
	name: string;
	companyId: string;
	designation: string;
	phoneNumber:string;
	email:string;
	linkedIn: string
}