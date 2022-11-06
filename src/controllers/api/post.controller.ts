import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Post from '../../models/Post';

class PostController {
    public static index = async (req: Request, res: Response, next: NextFunction) => {
        return Post.find()
            .select('-__v')
            .populate('author', '-__v -password')
            .exec()
            .then((posts) => res.status(200).json({ posts }))
            .catch((err) => res.status(500).json({ err }));
    };

    public static create = (req: Request, res: Response, next: NextFunction) => {
        const post = new Post({
            _id: new mongoose.Types.ObjectId(),
            title: req.body.title,
            author: req.body.author
        });
        return post
            .save()
            .then((newPost) => res.status(201).json({ newPost }))
            .catch((err) => res.status(500).json({ err }));
    };

    public static show = (req: Request, res: Response, next: NextFunction) => {
        const postId = req.params.id;
        return Post.findById(postId)
            .select('-__v')
            .populate('author', '-__v -password')
            .exec()
            .then((post) => (post ? res.status(200).json({ post }) : res.status(404).json({ message: 'Post not found' })))
            .catch((err) => res.status(500).json({ err }));
    };

    public static update = (req: Request, res: Response, next: NextFunction) => {
        const postId = req.params.id;
        return Post.findById(postId)
            .then((updatedPost) => {
                if (updatedPost) {
                    updatedPost.set(req.body);
                    return updatedPost
                        .save()
                        .then((newPost) => res.status(201).json({ newPost }))
                        .catch((err) => res.status(500).json({ err }));
                } else {
                    return res.status(404).json({ message: 'Post not found' });
                }
            })
            .catch((err) => res.status(500).json({ err }));
    };

    public static delete = (req: Request, res: Response, next: NextFunction) => {
        const postId = req.params.id;
        return Post.findByIdAndDelete(postId)
            .then((post) => (post ? res.status(201).json({ message: 'deleted' }) : res.status(404).json({ message: 'Post not found' })))
            .catch((err) => res.status(500).json({ err }));
    };
}

export default PostController;
