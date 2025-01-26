import React  from 'react'
import styles from './DisplayStory.module.css'
import {useEffect,useRef,useState} from 'react'
import storycross from '../images/storycross.png'
import { fetchViewStory } from '../services/storyManagement';

const DisplayStory = ({closeViewStoryModal,displayViewStoryModal,viewStoryId}) => {
    const [displayStory,setDisplayStory] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const DisplayStoryModalContainerRef = useRef();

    function checkClickOutside(e){
        if(displayViewStoryModal && DisplayStoryModalContainerRef.current && !DisplayStoryModalContainerRef.current.contains(e.target)){
            closeViewStoryModal();
        }
    }
    useEffect(()=>{
        document.addEventListener('mousedown',checkClickOutside)
        return()=>{
            document.removeEventListener('mousedown',checkClickOutside)
        }
    },[displayViewStoryModal])

    useEffect(() => {
        if(viewStoryId){
            const fetchStory = async () => {
                setLoading(true);
                try{
                    const response = await fetchViewStory({viewStoryId});
                    setDisplayStory(response.data);
                    setLoading(false);
                } 
                catch(err){
                    setError('Failed to fetch story. Please try again.');
                    setLoading(false);
                }
            };
            fetchStory();
        }
    },[viewStoryId]);

    if(loading){
        return <div>Loading...</div>;
    }
    if(error){
        return <div>{error}</div>;
    }

    return (
        <>
        <div className={styles.DisplayStoryModalContainer} ref={DisplayStoryModalContainerRef} style={{backgroundImage : `url(${displayStory?.imageUrl})`}}>
            <div className={styles.upperhalf}>
                <div className={styles.crossAndSaveBar}>
                    <img src={storycross} className={styles.storycross} onClick={closeViewStoryModal}></img>
                </div>
            </div>
            <div className={styles.lowerhalf}>
                <div className={styles.HeadingDescription}>
                    <p className={styles.heading}>{displayStory?.heading}</p>
                    <p className={styles.description}>{displayStory?.description?.slice(0, 300)}...</p>
                </div>
            </div>
        </div>
        </>
    )
}

export default DisplayStory;