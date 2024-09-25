const { prisma } = require('./passport');

async function clearDatabase() {
    await prisma.commentLike.deleteMany({});
    await prisma.postLike.deleteMany({});
    await prisma.userFollow.deleteMany({});  // Clear the followers/following data
    await prisma.message.deleteMany({});
    await prisma.comment.deleteMany({});
    await prisma.post.deleteMany({});
    await prisma.user.deleteMany({});
}

clearDatabase();