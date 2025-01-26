const express = require('express')
const StorySchema = require('../schemas/story.schema')
const router = express.Router();
const upload = require('../multerconfig');
const authMiddleware = require('../middleware/authMiddleware')

router.post('/Post', authMiddleware, upload.single('image'), async (req, res) => {
    try{
        const {heading, description, creator} = req.body;
        const imageUrl = req.file?.path;
        if(!heading || !description || !imageUrl){
            return res.status(400).json({message: 'Heading, description, and image are required'});
        }
        const newStory = new StorySchema({
            heading,
            description,
            imageUrl,
            creator,
        });
        await newStory.save();
        res.status(200).json({message: 'Story added successfully', story: newStory});
    } 
    catch(error){
        console.error('Error posting story:', error);
        res.status(500).json({message: 'Failed to post story'});
    }
});

router.get('/AllStories', async(req, res) => {
    try{
      const stories = await StorySchema.find({});
      res.status(200).json(stories);
    } 
    catch(error){
      res.status(500).json({error: error.message});
    }
});

router.get('/fetchStory/:id', async(req,res) =>{
    const {id} = req.params;
    try{
        const story = await StorySchema.findById(id);
        if(!story){
            return res.status(404).json({message: 'Story not found'});
    }
        return res.status(200).json(story);
    }
    catch(err){
        return res.status(500).json({message: 'Error finding the story', error: err.message});
    }
})

module.exports = router;