const TelegramBot = require('node-telegram-bot-api')
const axios = require('axios')

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_TOKEN
const bot = new TelegramBot(token, { polling: true })


bot.on(/\/start/, ({ chat: { id: chatId }, msg }) => {
	bot.sendMessage(
		chatId,
		`Hmm... ${JSON.stringify(msg.from.username)}, I like your name :)`,
	)
	bot.sendMessage(
		chatId,
		`Send me a pic, sticker, edit a message or use the following commands: /sendpic, /starwars/`,
	)
	bot.sendMessage(
		chatId,
		`You may also get info about any Star Wars character by typing sw:nameOfTheCharacter`,
	)
})

bot.on('edited_message', ({ chat: { id: chatId } }) => {
	bot.sendMessage(chatId, 'I read that :O')
})

bot.on('photo', ({ chat: { id: chatId } }) => {
	bot.sendMessage(
		chatId,
		`Why are you sending me a pic? Don't you know I have no eyes?!`,
	)
})

bot.on('sticker', ({ chat: { id: chatId } }) => {
	bot.sendMessage(
		chatId,
		`Why are you sending me a sticker? Don't you know I have no eyes?!`,
	)
})

bot.onText(/\/sendpic/, ({ chat: { id: chatId } }) => {
	bot.sendPhoto(
		chatId,
		'https://static.boredpanda.com/blog/wp-content/uploads/2016/08/cute-kittens-29-57b30ad229af3__605.jpg',
		{ caption: 'Hope this fluffy cutie brightens up your day~ ' },
	)
})

bot.onText(/\/starwars/, async ({ chat: { id: chatId } }) => {
	bot.sendMessage(chatId, 'Which SW character would you like to know more about? (Look up any character by typing sw:nameOfTheCharacter)', {
		reply_markup: {
			keyboard: [['sw:Luke', 'sw:C-3PO'], ['sw:Leia', 'sw:R2-D2']],
		},
		parse_mode: 'HTML'
	})
})

bot.on('message', async ({ chat: { id: chatId }, text: msgText }) => {
	let res
	let mainSpecies
	let planet
	if (
		msgText
			.toString()
			.includes('sw:')
	) {
		const cleanString = msgText.toString().replace('sw:', '')
		const someCharData = `Gimme a sec! i'm going to look up ${cleanString} in my Encyclopedia 📚📖🧐`
		bot.sendMessage(chatId, someCharData)

		try {

			res = await axios
				.get(`https://swapi.co/api/people/?search=${cleanString}`)
				.catch(e => console.log(e))


			if (res['data']['results'].length) {
				const { height, name, birth_year, species, homeworld } = res['data']['results'][0]

				// TODO: list all the species the character belongs to :)
				mainSpecies = await axios
					.get(species[0]).then(res => res.data)
					.catch(e => console.log(e))

				planet = await axios
					.get(homeworld).then(res => res.data)
					.catch(e => console.log(e))
				console.log(planet);

				const someCharData = `${name} (species: ${mainSpecies['name']}) is ${height}cm tall and was born in ${planet['name']} (year ${birth_year})`
				bot.sendMessage(chatId, someCharData)
			}
			else {
				console.log('data res'), res;
				bot.sendMessage(
					chatId,
					`Got nothing for that.. character? Sorry!`,
				)
			}
		}
		catch (e) {
			console.log(e);
			bot.sendMessage(
				chatId,
				`Oops, something went wrong! Sorry!`,
			)
		}
	}
	else {
		bot.sendMessage(
			chatId,
			`Uuh... If you want to know more about a certain Star Wars character, you should type sw:nameOfTheCharacter`,
		)
	}
})

bot.on('polling_error', err => console.log(err))
