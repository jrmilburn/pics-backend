const { prisma } = require('../config/passport');

async function getAllPosts(req, res) {

    try {

        const posts = await prisma.post.findMany({
            take: 20,
            orderBy: {
              createdAt: 'desc',
            },
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
          });
          

        res.json(posts);

    } catch(error) {
        return res.status(500).json({message: 'Internal server error'});
    }

}

async function createPost(req, res) {

  const userId = req.user.id;
  const { caption } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    
    const post = await prisma.post.create({
      data: {
        caption,
        image: imageUrl,
        userId: userId,
      },
    });

    res.json(post);

  } catch(error) {
    return res.status(500).json({message: 'Internal server error'});
  }
}

async function editPost(req, res) {

  const { caption } = req.body;
  const { postId } = req.params;

  try {
    
    const post = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        caption,
      },
    });

    res.json(post);

  } catch(error) {
    return res.status(500).json({message: 'Internal server error'});
  }

}

async function deletePost(req, res) {
  
  const { postId } = req.params;

  try {
    
    await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    res.json({message: 'Post deleted'});

  } catch(error) {
    return res.status(500).json({message: 'Internal server error'});
  }

}

async function likePost(req, res) {

  const userId = req.user.id;
  const { postId } = req.params;

  try {

    const like = await prisma.postLike.create({
      data: {
        postId: postId,
        userId: userId,
      }
    })

    res.json(like);

  } catch(error) {
    return res.status(500).json({message: 'Internal server error'});
  }
}

async function unlikePost(req, res) {

  const userId = req.user.id;
  const { postId } = req.params;

  try {

    const like = await prisma.postLike.deleteMany({
      where: {
        postId: postId,
        userId: userId,
      }
    })

    res.json(like);

  } catch(error) {
    return res.status(500).json({message: 'Internal server error'});
  }
}

module.exports = {
    getAllPosts,
    createPost,
    editPost,
    likePost,
    unlikePost,
}