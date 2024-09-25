const { prisma } = require('../config/passport');

async function getUsers(req, res) {

    const userId = req.user.id;

    const users = await prisma.user.findMany({
        where: {
            id: {
                not: userId
            }
        }
    });

    res.json(users);

}

async function getUser(req, res) {
    
        const userId = req.params.id;
    
        const user = await prisma.user.findUnique({
            where: {
              id: userId,
            },
            include: {
              followers: true,
              following: true,
              posts: {
                include: {
                  author: true,
                  likes: true,
                  comments: {
                    take: 5,
                    orderBy: {
                      createdAt: 'desc',
                    },
                    include: {
                      author: true,
                      likes: true,
                    },
                  },
                },
              },
            },
          });          
    
        res.json(user);
}

async function getUserByUsername(req, res) {

  const username = req.params.username;

  const user = await prisma.user.findUnique({
    where: {
      username: username
    },

  })

  res.json(user);

}

async function updateUser(req, res) {

  const userId = req.user.id;
  const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;
  const { bio } = req.body;

  const user = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      bio: bio,
      profilePicture: profilePicture,
    }
  })

  res.json(user);

}

module.exports = {
    getUsers,
    getUser,
    getUserByUsername,
    updateUser
};