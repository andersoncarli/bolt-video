import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Play } from 'lucide-react';

interface Video {
  _id: string;
  title: string;
  description: string;
  uploader: {
    username: string;
  };
  createdAt: string;
}

const Home: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/videos');
        setVideos(response.data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };
    fetchVideos();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Video Library</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Link key={video._id} to={`/video/${video._id}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{video.title}</h2>
              <p className="text-gray-600 mb-2">{video.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{video.uploader.username}</span>
                <span>{new Date(video.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="bg-blue-600 text-white p-2 flex items-center justify-center">
              <Play size={24} />
              <span className="ml-2">Play Video</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;