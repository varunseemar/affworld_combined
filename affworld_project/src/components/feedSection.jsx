import React from 'react'
import {useState,useEffect} from 'react';
import styles from './feedSection.module.css'
import {fetchStories} from '../services/storyManagement'

const feedSection = ({openAddStoryModal, openViewStoryModal, setViewStoryId,refresh}) => {
  const [stories, setStories] = useState([]);
  const [visibleStories, setVisibleStories] = useState(6);

  const loadStories = async () => {
    try{
      const response = await fetchStories();
      setStories(response.data);
    }
    catch(error){
      toast.error('Failed to fetch stories. Please try again.');
    }
  };
  const handleSeeMore = () =>{
    setVisibleStories((prev) => prev + 6);
  };
  useEffect(() =>{
    loadStories();
  },[refresh]);

  return (
    <div className={styles.feedsectionMain}>
      <div className={styles.addstory}>
          <button onClick={openAddStoryModal}>Add Story</button>
      </div>
      <div className={styles.storiesdiv}>
        {stories.slice(0, visibleStories).map((story) => (
          <div key={story._id} className={styles.storyItem} style={{ backgroundImage: `url(${story.imageUrl})` }} onClick={() => { setViewStoryId(story._id); openViewStoryModal();}}>
            <div className={styles.storyContent}>
              <h3>{story.heading}</h3>
              <p>{story.description.split(' ').slice(0, 20).join(' ')}...</p>
            </div>
          </div>
        ))}
      </div>
      {visibleStories < stories.length && (
        <div className={styles.seemore}>
          <button onClick={handleSeeMore}>See More</button>
        </div>
      )}
    </div>
  )
}

export default feedSection;