⚙️ 3. MVP_Functions.md

🎥 Camera

initCamera(videoEl) → Promise<void>

🔄 Loop

startLoop(callback)

✋ HandTracker

init() → Promise<void>
detect(video, time) → { landmarks }

🧠 GestureEngine

detectGesture(landmarks) → string | null

Возвращает:
	•	THUMBS_UP
	•	ROCK
	•	null

🧾 ReactionState

update(gesture) → string | null

Отвечает за:
	•	cooldown
	•	устранение повторов

😀 EmojiRenderer

showEmoji(gesture)
showEmojiAt(gesture, landmarks)
