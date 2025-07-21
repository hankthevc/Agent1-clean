# Google Analytics (GA4) Integration and Data Interpretation

## Overview

This document provides a comprehensive guide to the Google Analytics 4 (GA4) integration for the Trivia Tiles application. It details the events being tracked and explains how to interpret the collected data to gain insights into user behavior and game performance.

### Measurement ID
- **ID**: `G-3620466257`
- **Note**: Analytics events are only sent in the **production environment** to keep development data separate.

## Tracked Events

The following custom events are tracked to provide a detailed view of player engagement:

### 1. **Puzzle Engagement**

- **Category**: `Puzzle`
- **Events**:
  - **`Load Success`**
    - **Action**: `Load Success`
    - **Label**: The puzzle's pangram (e.g., "cabbaged")
    - **Description**: Fired when a new puzzle is successfully loaded.
    - **Insight**: Measures how many puzzles are started. Comparing this to unique users can show player retention.

  - **`Valid Word`**
    - **Action**: `Valid Word`
    - **Label**: The submitted word (e.g., "apple")
    - **Value**: The length of the word (as a simple score).
    - **Description**: Fired each time a player finds a correct word.
    - **Insight**: Tracks overall puzzle progress and engagement. You can analyze which words are found most often and the average score per puzzle.

  - **`Invalid Word`**
    - **Action**: `Invalid Word`
    - **Label**: The reason for failure (e.g., "Not in dictionary", "Word must contain the letter 'A'").
    - **Description**: Fired when a word submission fails.
    - **Insight**: Helps identify common player mistakes and confusing words. High rates of "Not in dictionary" for a specific word might indicate a gap in the dictionary API.

  - **`API Error`**
    - **Action**: `API Error`
    - **Label**: The error message (e.g., "Request timed out").
    - **Description**: Fired when the dictionary API call fails.
    - **Insight**: Monitors the health and reliability of the dictionary API.

### 2. **Trivia Engagement**

- **Category**: `Trivia`
- **Events**:
  - **`Clue Unlocked`**
    - **Action**: `Clue Unlocked`
    - **Label**: The clue number (e.g., "Clue 1")
    - **Value**: The clue number.
    - **Description**: Fired when a player's progress unlocks a new trivia clue.
    - **Insight**: Measures how far players are progressing in the trivia narrative. You can create a funnel to see how many players unlock all clues.

  - **`Final Trivia Shown`**
    - **Action**: `Final Trivia Shown`
    - **Description**: Fired when the final trivia question is presented to the user.
    - **Insight**: A key metric for deep engagement, showing how many players reach the final stage of the puzzle.

  - **`Final Trivia Success`**
    - **Action**: `Final Trivia Success`
    - **Description**: Fired when the player correctly answers the final trivia.
    - **Insight**: The primary success metric for the trivia feature. Comparing this to "Final Trivia Shown" gives you the completion rate.

## How to Interpret the Data in GA4

### 1. **Realtime Reports**
- **Location**: `Reports > Realtime`
- **Use**: Monitor current user activity and test if your events are firing correctly after a new deployment.
- **Look for**: The `event_count` by `event_name` card to see your custom events coming in.

### 2. **Engagement Reports**
- **Location**: `Reports > Engagement > Events`
- **Use**: Get a detailed breakdown of all tracked events over a selected time period.
- **How to analyze**:
  - Click on an event name (e.g., `Valid Word`) to see its parameters.
  - The `event_label` will show you which words are being submitted.
  - The `value` will show you the score for each word.

### 3. **Creating Funnels**
- **Location**: `Explore > Funnel exploration`
- **Use**: Visualize the user journey through the puzzle and trivia.
- **Example Funnel**:
  1. **Step 1**: `event_name` is `Load Success` (Puzzle Start)
  2. **Step 2**: `event_name` is `Clue Unlocked` where `event_label` is `Clue 1`
  3. **Step 3**: `event_name` is `Final Trivia Shown`
  4. **Step 4**: `event_name` is `Final Trivia Success`
- **Insight**: This funnel will show you the drop-off rate at each stage of the game, helping you identify where players might be getting stuck or losing interest.

### 4. **Analyzing Popular Content**
- **Location**: `Reports > Engagement > Events`
- **Use**: Discover which puzzles and trivia are most engaging.
- **How to analyze**:
  - For the `Load Success` event, look at the `event_label` to see which puzzles (identified by their pangram) are being started most often.
  - For the `Valid Word` event, look at the `event_label` to identify the most commonly found words.

## Example Insights and Actions

- **High "Invalid Word" count with "Not in dictionary" label?**
  - **Insight**: Players are trying valid words that your dictionary doesn't recognize.
  - **Action**: Consider using a more comprehensive dictionary API or adding a custom word list.

- **Low completion rate in your trivia funnel?**
  - **Insight**: Players are reaching the final trivia but not succeeding.
  - **Action**: The trivia might be too difficult, or the clues not helpful enough. Consider A/B testing different clues.

- **High drop-off after the first clue?**
  - **Insight**: Players are not motivated enough to continue after the first clue.
  - **Action**: Make the early-game rewards more engaging or the first clue more intriguing.

## Conclusion

By leveraging this GA4 tracking setup, you can gain deep insights into player behavior, identify areas for improvement, and make data-driven decisions to enhance the Trivia Tiles game. Regularly reviewing these analytics will be key to the game's long-term success. 