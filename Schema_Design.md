**Schema Design**

📘 User
| Field        | Type     | Description                         |
| ------------ | -------- | ----------------------------------- |
| `_id`        | ObjectId | Unique user identifier              |
| `username`   | String   | Display name of the user            |
| `email`      | String   | User email (optional if local-only) |
| `profilePic` | String   | Profile image URL (optional)        |
| `createdAt`  | Date     | User registration timestamp         |


💬 ParentPrompt
| Field        | Type                  | Description                             |
| ------------ | --------------------- | --------------------------------------- |
| `_id`        | ObjectId              | Unique ID for the parent-level prompt   |
| `userId`     | ObjectId → `User._id` | The user who created the prompt         |
| `content`    | String                | Main chat or message content            |
| `response`   | String                | ChatGPT / AI-generated reply            |
| `createdAt`  | Date                  | Timestamp of creation                   |
| `updatedAt`  | Date                  | Timestamp of last update                |
| `orderIndex` | Number                | Sequence position for UI ordering       |
| `isCleared`  | Boolean               | Marks if this prompt is removed or done |


🧵 NestedPrompt
| Field            | Type                          | Description                                    |
| ---------------- | ----------------------------- | ---------------------------------------------- |
| `_id`            | ObjectId                      | Unique ID for nested (reply) prompt            |
| `parentPromptId` | ObjectId → `ParentPrompt._id` | Reference to its parent chat                   |
| `userId`         | ObjectId → `User._id`         | User who made this reply                       |
| `content`        | String                        | Message content                                |
| `response`       | String                        | ChatGPT’s reply for this nested level          |
| `createdAt`      | Date                          | Timestamp of creation                          |
| `orderIndex`     | Number                        | Position among sibling replies                 |
| `isCleared`      | Boolean                       | If the nested message was deleted or dismissed |


🗺️ NavigationWindow
| Field        | Type                          | Description                                |
| ------------ | ----------------------------- | ------------------------------------------ |
| `_id`        | ObjectId                      | Unique ID for minimap node                 |
| `userId`     | ObjectId → `User._id`         | Associated user                            |
| `promptId`   | ObjectId → `ParentPrompt._id` | Reference to a prompt displayed on minimap |
| `positionX`  | Number                        | X-coordinate in minimap layout             |
| `positionY`  | Number                        | Y-coordinate in minimap layout             |
| `topicLabel` | String                        | Title or summary text for the topic        |
| `isActive`   | Boolean                       | Whether the topic is currently focused     |


```
User ──< ParentPrompt ──< NestedPrompt
   │
   └──< NavigationWindow
```
