import { Playlist } from "../models/playlist.models.js";

const addVideoToPlaylist = async (req, res) => {
    try {
        const { name, description, videoId } = req.body;
        const userId = req.user?._id;

        if (!name) throw new Error("Playlist name is required");
        if (!description) throw new Error("Description is required");
        if (!videoId) throw new Error("Video ID is required");
        if (!userId) throw new Error("Unauthorized user");
        let playlist = await Playlist.findOne({ name, owner: userId });

        if (playlist) {
            if (!playlist.videos.includes(videoId)) {
                playlist.videos.push(videoId);
                await playlist.save();
            }
        } else {
            playlist = await Playlist.create({
                name,
                description,
                videos: [videoId],
                owner: userId
            });
        }

        return res.status(200).json({
            success: true,
            message: "Video added to playlist successfully",
            playlist
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const removeFromPlaylist=async(req , res)=>{
    try {
        const {playlistId,videoId}=req.body;
        const userId=req.user?._id;
        if(!playlistId || !videoId){
            throw new Error("playlistId and videoId are required");
        }
        if(!userId){
            throw new Error("unauthorized user");
        }
        const playlist=await Playlist.findOne({
            _id:playlistId,
            owner:userId
        })
    
        if(!playlist){
            return res.status(404).json({
                    success: false,
                    message: "Playlist not found or unauthorized"
            });
        }
    
        playlist.videos=playlist.videos.filter((it)=>it.toString()!==videoId)
    
        await playlist.save();
    
        return res.status(200).json({
                success: true,
                message: "Video removed from playlist",
                playlist
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const getUserPlaylists = async (req, res) => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            throw new Error("Unauthorized user");
        }

        const playlists = await Playlist.find({ owner: userId })
            .populate("videos") 
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            playlists
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export { addVideoToPlaylist,removeFromPlaylist,getUserPlaylists };
