import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { API_URL } from '../config/api';

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const generateImage = async (prompt) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/images/generate`, {
        prompt
      });

      const newImage = response.data;
      setImages(prev => [newImage, ...prev]);
      
      return { success: true, image: newImage };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to search image'
      };
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/images/history`);
      setImages(response.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch history'
      };
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (imageId) => {
    try {
      await axios.delete(`${API_URL}/images/${imageId}`);
      setImages(prev => prev.filter(img => img._id !== imageId));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete image'
      };
    }
  };

  return (
    <ImageContext.Provider value={{ images, loading, generateImage, fetchHistory, deleteImage }}>
      {children}
    </ImageContext.Provider>
  );
};
