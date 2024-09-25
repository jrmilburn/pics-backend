const { prisma } = require('../config/passport');

async function createComment(req, res) {
    const { text, postId } = req.body;

    // Ensure the user is authenticated
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    const userId = req.user.id;

    try {
        // Check if the post exists
        const post = await prisma.post.findUnique({
            where: {
                id: postId,
            },
        });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Create the comment and associate it with the user and post
        const comment = await prisma.comment.create({
            data: {
                text: text,
                post: {
                    connect: {
                        id: postId, // Connect the comment to the post
                    },
                },
                author: {
                    connect: {
                        id: userId, // Connect the comment to the user
                    },
                },
            },
        });

        // Return the created comment
        res.json(comment);

    } catch (error) {
        console.error('Error creating comment:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function editComment(req, res) {

    const { commentId } = req.params;
    const { text } = req.body;

    try {

        const comment = await prisma.comment.update({
            where: {
                id: commentId,
            },
            data: {
                text,
            },
        });

        res.json(comment);

    } catch(error) {
        return res.status(500).json({message: 'Internal server error'});
    }

}

async function deleteComment(req, res) {

    const {commentId} = req.params;

    try {

        await prisma.comment.delete({
            where: {
                id: commentId,
            },
        });
    } catch(error) {
        return res.status(500).json({message: 'Internal server error'});
    }

}

module.exports = {
    createComment,
    editComment,
    deleteComment,
};
