const { prisma } = require('../config/passport');

async function getMessages(req, res) {

    const { id } = req.params;
    const userId = req.user.id;

    console.log(id, userId);

    try {

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    {
                        AND: [
                            { senderId: userId },
                            { receiverId: id }
                        ]
                    },
                    {
                        AND: [
                            { senderId: id },
                            { receiverId: userId }
                        ]
                    }
                ]
            },
        })

        console.log(messages);



        res.status(200).json(messages);

    } catch(error) {
        return res.status(500).json({message: 'Internal server error'});
    }
}

async function sendMessage(req, res) {
    try {
        const userId = req.user.id;
        const { receiverId, content } = req.body;

        const newMessage = await prisma.message.create({
            data: {
                text: content,
                senderId: userId,
                receiverId: receiverId
            }
        })

        req.io.emit("newMessage", newMessage);

        res.json(newMessage);

    } catch(error) {
        return res.status(500).json({message: 'Internal server error'});
    }
}

module.exports = {
    getMessages,
    sendMessage
}