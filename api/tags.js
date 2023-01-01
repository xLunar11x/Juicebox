const express = require('express');
const { getAllTags, getPostsByTagName } = require('../db');
const { requireUser } = require('./utils');
const tagsRouter = express.Router();

tagsRouter.use((req, res, next) => {
    console.log("A request is being made to /tags");
    next();
});

tagsRouter.get('/', async (req, res) => {
    const tags = await getAllTags();
    res.send({
        tags
    });
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    const { tagName } = req.params;
    try {
        const allPostsWithTagname = await getPostsByTagName(tagName);
        const postsWithTagname = allPostsWithTagname.filter(post => {
            if (post.active) {
                return true;
            }
            if (req.user && post.author.id === req.user.id) {
                return true;
            }
            return false;
        });
        res.send({posts: postsWithTagname});
    } catch ({name, message}) {
        next({name, message});
    }
})

module.exports = tagsRouter;