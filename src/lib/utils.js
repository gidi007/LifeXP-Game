// lib/utils.js

/**
 * Utility functions for LifeXP App 🚀
 * This module provides helper functions for common tasks like formatting data, calculating progress,
 * and handling local storage operations.
 */

/** =============================
 *  General Utility Functions
 *  ============================= */

/**
 * Formats a date to a readable format (e.g., "Oct 19, 2024").
 * @param {Date | string} date - Date object or string to format.
 * @returns {string} - Formatted date.
 */
export const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  /**
   * Capitalizes the first letter of a string.
   * @param {string} str - String to capitalize.
   * @returns {string} - Capitalized string.
   */
  export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  
  /**
   * Generates a random integer between min and max.
   * @param {number} min - Minimum value (inclusive).
   * @param {number} max - Maximum value (inclusive).
   * @returns {number} - Random integer.
   */

  export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
  }
  
  export const getRandomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
  
  /** =============================
   *  Stat & Achievement Utilities
   *  ============================= */
  
  /**
   * Calculates XP needed for the next level.
   * Formula: Next Level XP = Level^2 * 100.
   * @param {number} level - Current level.
   * @returns {number} - XP needed for the next level.
   */
  export const calculateNextLevelXP = (level) => Math.pow(level, 2) * 100;
  
  /**
   * Calculates percentage progress towards the next level.
   * @param {number} currentXP - Current XP value.
   * @param {number} nextLevelXP - XP needed for the next level.
   * @returns {number} - Progress percentage (0-100).
   */
  export const calculateProgress = (currentXP, nextLevelXP) =>
    Math.min((currentXP / nextLevelXP) * 100, 100);
  
  /**
   * Checks if an achievement should unlock based on the user's stats.
   * @param {object} stats - Current stats (e.g., { focus: 20, energy: 18 }).
   * @param {object} criteria - Criteria for unlocking (e.g., { focus: 20 }).
   * @returns {boolean} - Whether the achievement unlocks.
   */
  export const checkAchievementUnlock = (stats, criteria) =>
    Object.keys(criteria).every((key) => stats[key] >= criteria[key]);
  
  /** =============================
   *  Data Handling & Local Storage
   *  ============================= */
  
  /**
   * Stores data in local storage.
   * @param {string} key - Key to store the data under.
   * @param {any} value - Value to store (will be stringified).
   */
  export const setLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };
  
  /**
   * Retrieves data from local storage.
   * @param {string} key - Key to retrieve data from.
   * @returns {any} - Parsed value from local storage or null if not found.
   */
  export const getLocalStorage = (key) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  };
  
  /**
   * Clears a specific key from local storage.
   * @param {string} key - Key to remove.
   */
  export const removeLocalStorage = (key) => {
    localStorage.removeItem(key);
  };
  
  /** =============================
   *  Animation Utilities
   *  ============================= */
  
  /**
   * Adds a smooth scroll effect to a target section.
   * @param {string} targetId - The ID of the target element to scroll to.
   */
  export const smoothScrollTo = (targetId) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  /**
   * Triggers a pulse animation on an element.
   * @param {HTMLElement} element - The DOM element to animate.
   */
  export const triggerPulse = (element) => {
    if (element) {
      element.classList.add('pulse');
      setTimeout(() => element.classList.remove('pulse'), 500);
    }
  };
  
  /** =============================
   *  Chart Utilities
   *  ============================= */
  
  /**
   * Generates a color based on a stat's value.
   * @param {number} value - Stat value (0-100).
   * @returns {string} - Corresponding color.
   */
  export const getStatColor = (value) => {
    if (value >= 75) return '#4caf50'; // Green for high stats
    if (value >= 50) return '#ffa726'; // Orange for mid-range stats
    return '#f44336'; // Red for low stats
  };
  
  /** =============================
   *  Date & Time Helpers
   *  ============================= */
  
  /**
   * Calculates the time difference in days between two dates.
   * @param {Date} startDate - Start date.
   * @param {Date} endDate - End date.
   * @returns {number} - Number of days between the two dates.
   */
  export const getDaysDifference = (startDate, endDate) => {
    const msInDay = 24 * 60 * 60 * 1000;
    return Math.floor((new Date(endDate) - new Date(startDate)) / msInDay);
  };
  
  /** =============================
   *  Debugging Helpers
   *  ============================= */
  
  /**
   * Logs data in a styled format to the console.
   * @param {string} message - The message to log.
   * @param {any} data - Additional data to log.
   */
  export const styledLog = (message, data) => {
    console.log(`%c${message}`, 'color: #4caf50; font-weight: bold;', data);
  };
  
  export default {
    formatDate,
    capitalize,
    getRandomInt,
    calculateNextLevelXP,
    calculateProgress,
    checkAchievementUnlock,
    setLocalStorage,
    getLocalStorage,
    removeLocalStorage,
    smoothScrollTo,
    triggerPulse,
    getStatColor,
    getDaysDifference,
    styledLog,
  };
  