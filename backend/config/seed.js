const { prisma } = require('./passport');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

const NUMBER_OF_USERS = 50;
const MAX_POSTS_PER_USER = 10;
const MAX_COMMENTS_PER_POST = 5;
const MAX_MESSAGES_PER_USER = 20;
const MAX_FOLLOWERS_PER_USER = 30;
const SALT_ROUNDS = 10;

async function clearDatabase() {
    await prisma.commentLike.deleteMany({});
    await prisma.postLike.deleteMany({});
    await prisma.userFollow.deleteMany({});  // Clear the followers/following data
    await prisma.message.deleteMany({});
    await prisma.comment.deleteMany({});
    await prisma.post.deleteMany({});
    await prisma.user.deleteMany({});
}

async function seedUsers() {
    const userData = [];
  
    for (let i = 0; i < NUMBER_OF_USERS; i++) {
        const passwordHash = await bcrypt.hash('password', SALT_ROUNDS);
    
        userData.push({
            id: faker.string.uuid(),
            email: faker.internet.email(),
            username: faker.internet.userName(),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            profilePicture: faker.image.avatar(),
            bio: faker.lorem.sentence(),
            password: passwordHash,
            createdAt: faker.date.past(),
            updatedAt: faker.date.recent(),
        });
    }
  
    await prisma.user.createMany({ data: userData, skipDuplicates: true });
    console.log(`Created ${userData.length} users.`);
}

async function seedPosts() {
    const users = await prisma.user.findMany({ select: { id: true } });
    const postData = [];
  
    for (const user of users) {
        const numberOfPosts = faker.number.int({ min: 1, max: MAX_POSTS_PER_USER });
    
        for (let i = 0; i < numberOfPosts; i++) {
            postData.push({
                id: faker.string.uuid(),
                userId: user.id,
                caption: faker.lorem.sentence(),
                createdAt: faker.date.recent(),
                updatedAt: faker.date.recent(),
            });
        }
    }
  
    await prisma.post.createMany({ data: postData });
    console.log(`Created ${postData.length} posts.`);
}

async function seedComments() {
    const posts = await prisma.post.findMany({ select: { id: true } });
    const users = await prisma.user.findMany({ select: { id: true } });
    const commentData = [];
  
    for (const post of posts) {
        const numberOfComments = faker.number.int({ min: 0, max: MAX_COMMENTS_PER_POST });
    
        for (let i = 0; i < numberOfComments; i++) {
            const randomUser = faker.helpers.arrayElement(users);
      
            commentData.push({
                id: faker.string.uuid(),
                userId: randomUser.id,
                postId: post.id,
                text: faker.lorem.sentence(),
                createdAt: faker.date.recent(),
                updatedAt: faker.date.recent(),
                parentId: null,
            });
        }
    }
  
    await prisma.comment.createMany({ data: commentData });
    console.log(`Created ${commentData.length} comments.`);
}

async function seedMessages() {
    const users = await prisma.user.findMany({ select: { id: true } });
    const messageData = [];
  
    for (const sender of users) {
        const numberOfMessages = faker.number.int({ min: 0, max: MAX_MESSAGES_PER_USER });
    
        for (let i = 0; i < numberOfMessages; i++) {
            const receiver = faker.helpers.arrayElement(users.filter(u => u.id !== sender.id));
        
            messageData.push({
                id: faker.string.uuid(),
                senderId: sender.id,
                receiverId: receiver.id,
                text: faker.lorem.sentence(),
                createdAt: faker.date.recent(),
            });
        }
    }
  
    await prisma.message.createMany({ data: messageData });
    console.log(`Created ${messageData.length} messages.`);
}

async function seedPostLikes() {
    const posts = await prisma.post.findMany({ select: { id: true } });
    const users = await prisma.user.findMany({ select: { id: true } });
    const postLikeData = [];
  
    for (const post of posts) {
        const numberOfLikes = faker.number.int({ min: 0, max: users.length });
        const likers = faker.helpers.shuffle(users).slice(0, numberOfLikes);
    
        for (const liker of likers) {
            postLikeData.push({
                postId: post.id,
                userId: liker.id,
                likedAt: faker.date.recent(),
            });
        }
    }
  
    await prisma.postLike.createMany({ data: postLikeData, skipDuplicates: true });
    console.log(`Created ${postLikeData.length} post likes.`);
}

async function seedCommentLikes() {
    const comments = await prisma.comment.findMany({ select: { id: true } });
    const users = await prisma.user.findMany({ select: { id: true } });
    const commentLikeData = [];
  
    for (const comment of comments) {
        const numberOfLikes = faker.number.int({ min: 0, max: users.length });
        const likers = faker.helpers.shuffle(users).slice(0, numberOfLikes);
    
        for (const liker of likers) {
            commentLikeData.push({
                commentId: comment.id,
                userId: liker.id,
                likedAt: faker.date.recent(),
            });
        }
    }
  
    await prisma.commentLike.createMany({ data: commentLikeData, skipDuplicates: true });
    console.log(`Created ${commentLikeData.length} comment likes.`);
}

async function seedUserFollows() {
    const users = await prisma.user.findMany({ select: { id: true } });
    const followData = [];
  
    for (const user of users) {
        const numberOfFollows = faker.number.int({ min: 0, max: MAX_FOLLOWERS_PER_USER });
        const followers = faker.helpers.shuffle(users).slice(0, numberOfFollows);
    
        for (const follower of followers) {
            if (follower.id !== user.id) {
                followData.push({
                    fromUserId: follower.id,
                    toUserId: user.id,
                    followedAt: faker.date.recent(),
                });
            }
        }
    }
  
    await prisma.userFollow.createMany({ data: followData, skipDuplicates: true });
    console.log(`Created ${followData.length} user follows.`);
}

async function main() {
    console.log('Clearing database...');
    await clearDatabase(); // Optional

    console.log('Start seeding...');
    await seedUsers();
    await seedPosts();
    await seedComments();
    await seedMessages();
    await seedPostLikes();
    await seedCommentLikes();
    await seedUserFollows();
    console.log('Seeding finished.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
