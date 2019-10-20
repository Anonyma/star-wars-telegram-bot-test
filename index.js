const TelegramBot = require('node-telegram-bot-api')
const axios = require('axios')

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_TOKEN
const bot = new TelegramBot(token, { polling: true })


bot.on(/\/start/, msg => {
	const chatId = msg.chat.id

	bot.sendMessage(
		chatId,
		`Hmm... ${JSON.stringify(msg.from.username)}, I like your name :)`,
	)
	bot.sendMessage(
		chatId,
		`Send me a pic, sticker, edit a message or use the following commands: /sendpic, /starwars/`,
	)
})

bot.on('edited_message', msg => {
	const chatId = msg.chat.id

	bot.sendMessage(chatId, 'I read that :O')
})

bot.on('photo', msg => {
	const chatId = msg.chat.id
	bot.sendMessage(
		chatId,
		`Why are you sending me a pic? Don't you know I have no eyes?!`,
	)
})
bot.on('sticker', msg => {
	const chatId = msg.chat.id
	bot.sendMessage(
		chatId,
		`Why are you sending me a sticker? Don't you know I have no eyes?!`,
	)
})

bot.onText(/\/sendpic/, msg => {
	bot.sendPhoto(
		msg.chat.id,
		'https://static.boredpanda.com/blog/wp-content/uploads/2016/08/cute-kittens-29-57b30ad229af3__605.jpg',
		{ caption: 'Hope this fluffy cutie brightens up your day~ ' },
	)
})
bot.onText(/\/starwars/, async msg => {
	bot.sendMessage(msg.chat.id, 'What SW character do you want to know more about?', {
		reply_markup: {
			keyboard: [['Luke', 'C3PO']],
		},
	})
})

bot.on('message', async msg => {
	let res
	if (
		msg.text
			.toString()
			.includes('Luke')
	) {
		res = await axios
			.get('https://swapi.co/api/people/1/')
			.catch(e => console.log(e))
	}
	else if (
		msg.text
			.toString()
			.includes('C3PO')
	) {
		res = await axios
			.get('https://swapi.co/api/people/2/')
			.catch(e => console.log(e))
	}

	let { height, name, birth_year } = res.data
	const frasePJ = `${name} is ${height}cm tall and was born in ${birth_year}`
	bot.sendMessage(msg.chat.id, frasePJ)
})

bot.on('polling_error', err => console.log(err))
