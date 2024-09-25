const { prisma } = require('../config/passport');

async function getFollowing(req, res) {

    const userId = req.user.id;

    try {

        const following = await prisma.userFollow.findMany({
            where: {
                fromUserId: userId
            },
            select: {
                toUserId: true
            }
        });

        const followingIds = following.map((follow) => {
            return follow.toUserId
        });

        const users = await prisma.user.findMany({
            where: {
                id: {
                    in: followingIds
                }
            }
        });

        return res.json(users);

    } catch(error) {

        console.error('Error getting following users:', error);
        return res.status(500).json({ message: 'Internal server error' });

    }

}

async function getNotFollowing(req, res) {
    
    try {

        const userId = req.user.id;

        const users = await prisma.user.findMany({
            where: {
                id: {
                    not: userId
                }
            },
            include: {
                followers: true,
                following: true
            },
        })

        return res.json(users)
    } catch (error) {
        console.error('Error getting not following users:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }



}

async function follow(req, res) {
    const userId = req.user.id;
    const { id } = req.body;

    try {

        const follow = await prisma.userFollow.create({
            data: {
                fromUserId: userId,
                toUserId: id
            }
        })

        res.json(follow);
    } catch (error) {
        console.error('Error following user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function unFollow(req, res) {
    const userId = req.user.id;
    const { id } = req.params;

    try {

        const follow = await prisma.userFollow.deleteMany({
            where: {
                fromUserId: userId,
                toUserId: id
            }
        })

        res.json(follow);
    } catch (error) {
        console.error('Error following user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    getFollowing,
    getNotFollowing,
    follow,
    unFollow
}