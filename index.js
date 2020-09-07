const Discord = require('discord.js');
const client = new Discord.Client();
const ytdl = require('ytdl-core');
var NoSQL = require('nosql');
var fortuneDB = NoSQL.load('./local.fortune.nosql');
var factsDB = NoSQL.load('./local.facts.nosql');
var quickchatsDB = NoSQL.load('./local.quickchats.nosql');

var channelArray = [];
client.on("ready", () => {
    client.user.setActivity('>help', { type: "LISTENING" });
    // console.log(client.channels.cache.toJSON()[3]);
    console.log("Ready!")
});

client.on('message', message => {
    if (message.member.id != "750667235684515872") {
        console.log(message.content)
        var startCommand = message.content.slice(0, 1)
        if (startCommand === ">") {
            const userMessage = message.content;
            const commando = getFirstWord(userMessage).substring(1).toLowerCase();
            const args = getArgs(userMessage)
            const voiceChannel = message.member.voice.channel;
            if (commando === "penis") {
                message.channel.send(message.member.displayName + " has a penis length of " + Math.floor(Math.random() * 10 + 1) + " inches.");
            } else if (commando === "play") {
                if (args !== ">play") {
                    if (voiceChannel) {
                        play(voiceChannel, args, message)
                    } else {
                        message.channel.send("You don\'t seem to be in a voice channel")
                    }
                } else {
                    message.channel.send("You didn\'t give me a song to play dummy")
                }
            } else if (commando === "stop") {
                stopMusic(voiceChannel)
            } else if (commando === "callme") {
                message.channel.send("<@" + message.member.id + ">")
            } else if (commando === "help") {
                const exampleEmbed = new Discord.MessageEmbed()
                    .setColor('#00ff00')
                    .setTitle('BucketBot Help Menu')
                    .setURL('https://www.youtube.com/c/blastbucketgaming/')
                    .setAuthor('BlastBucketGaming', 'https://yt3.ggpht.com/a-/AOh14Ggq46BGHZkdlJ0-7SbxWGD9j8hzapdBQQjS_v3hQA=s100-c-k-c0xffffffff-no-rj-mo', 'https://www.youtube.com/c/blastbucketgaming')
                    .setDescription('This is the BucketBot help menu. Here you will find all available commands. The bot only works if you see it online in the member list.')
                    .setThumbnail('https://static-cdn.jtvnw.net/jtv_user_pictures/8c77fe3b-7d7d-496b-8f97-5a6ae40c3047-profile_image-70x70.png')
                    // .addFields({ name: 'Regular field title', value: 'Some value here' }, { name: '\u200B', value: '\u200B' }, { name: 'Inline field title', value: 'Some value here', inline: true }, { name: 'Inline field title', value: 'Some value here', inline: true }, )
                    // .addField('General commands:', ' `>help` Show this help menu \n \n >penis :arrow_right: Shows your penis length \n \n >callme :arrow_right: I will mention you in a message \n \n >fortune :arrow_right: I\'m not a fortune teller but I can try. \n \n >fact :arrow_right: I will tell you a random fact, and you will believe it. \n \n >rlchat :arrow_right: Send a random rocket leage quickchat', true)
                    .addFields([
                        { name: '`>help`', value: 'Shows this help menu', inline: true },
                        { name: '`>penis`', value: 'Shows your penis length', inline: true },
                        { name: '`>fortune`', value: 'I\'m not a fortune teller but I can try :fortune_cookie:', inline: true },
                        { name: '`>callme`', value: 'Let the bot mention you in a message', inline: true },
                        { name: '`>fact`', value: 'I will tell you a random fact, and you\'re gonna believe it', inline: true },
                        { name: '`>rlchat`', value: 'THIS IS ROCKET LEAGUE!!!', inline: true },
                        { name: '🍆', value: 'eggplant?', inline: true }
                    ])
                    .addField('Music commands:', '>play [youtube url] :arrow_right: I will play you a song in your voice channel\n \n >stop :arrow_right: stop playing music and leave the channel')
                    // .setImage('https://i.imgur.com/wSTFkRM.png')
                    .setTimestamp()
                    .setFooter('Made by BlastBucket Gaming', 'https://yt3.ggpht.com/a-/AOh14Ggq46BGHZkdlJ0-7SbxWGD9j8hzapdBQQjS_v3hQA=s100-c-k-c0xffffffff-no-rj-mo');
                message.channel.send(exampleEmbed);
            } else if (commando === "fortune") {
                fortuneDB.find().make(function(filter) {
                    filter.callback(function(err, response) {
                        message.channel.send(response[Math.floor(Math.random() * response.length)])
                    });
                });
            } else if (commando === "fact") {
                factsDB.find().make(function(filter) {
                    filter.callback(function(err, response) {
                        message.channel.send(response[Math.floor(Math.random() * response.length)])
                    });
                });
            } else if (commando === "rlchat") {
                quickchatsDB.find().make(function(filter) {
                    filter.callback(function(err, response) {
                        message.channel.send(response[Math.floor(Math.random() * response.length)])
                    });
                });
            } else {
                message.channel.send("Unknown command, type >help to see the available commands")
            }
        }
        if (message.content === "🍆") {
            message.react("🤏")
            message.react("🍆")
        }
    }
});


function getFirstWord(str) {
    let spaceIndex = str.indexOf(' ');
    return spaceIndex === -1 ? str : str.substr(0, spaceIndex);
};

function getArgs(str) {
    let spaceIndex = str.indexOf(' ');
    return spaceIndex === -1 ? str : str.substr(spaceIndex).trim();
}


async function play(voiceChannel, song, message) {
    try {
        const stream = ytdl(song, { filter: 'audioonly' });
        try {
            const connection = await voiceChannel.join(); //?connect
            const dispatcher = connection.play(stream)
            dispatcher.on('finish', () => voiceChannel.leave());
        } catch {
            message.channel.send("Could not connect to your voice channel. Do I have the right permissions? Or are you just being a dick? :frowning: \n Consider asking a moderator to give me permissions :wink:")
        }

    } catch {
        message.channel.send("Video not found. Better luck next time")
    }
}


function stopMusic(voiceChannel) {
    voiceChannel.leave()
}




client.login('NzUwNjY3MjM1Njg0NTE1ODcy.X093Vw.e3UuaU6Uj8dHcc7MUXvVlDc_9cU');