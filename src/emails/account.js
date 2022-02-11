const mailgun = require('mailgun-js')
const DOMAIN = 'sandbox2aa8a9d7925c4fc1bde89b769e9e4d55.mailgun.org';
const mg = mailgun({apiKey: process.env.PRIVATE_API_KEY, domain: DOMAIN});
//TEMPLATE STRINGS - ``,easier to use inject variables
const sendWelcomeEmail = (email, name) => {
	const data = {
		from: 'Ekta <kumariekta1430@gmail.com>',
		to: 'ekta.kumari17@ifheindia.org',
		subject: 'Welcome to the Task manager app',
		text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
	}
	mg.messages().send(data)
}

const deleteUserEmail = (email, name) =>{
	const data = {
		from:'Ekta <kumariekta1430@gmail.com>',
		to:'ekta.kumari17@ifheindia.org',
		subject:'We will miss you at Task-manager app',
		text: `We had a really good run ${name} !, we would surely like to serve you again in the future.`
	}
	mg.messages().send(data)
}
// mg.messages().send(data, function (error, body){
// 	console.log(body)
// })
// API key: c516ab2b6c6bc3fc89b0644588d2cd21-d2cc48bc-7a047bd8
// API base URL: https://api.mailgun.net/v3/sandbox2aa8a9d7925c4fc1bde89b769e9e4d55.mailgun.org

module.exports = {
	sendWelcomeEmail,
	deleteUserEmail
}