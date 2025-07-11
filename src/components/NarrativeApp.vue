<template>
    <Window95 :title="title" @close="emit('close')">
        <template v-if="loading">
            <div class="loading">Chargement de l'histoire...</div>
        </template>

        <template v-else-if="error">
            <div class="error">Erreur : {{ error }}</div>
        </template>

        <!-- Bouton retour pour les chapitres dans la corbeille -->
        <template v-else-if="chapter">
            <div v-if="isFileChapter(chapter.id)" class="back-button-container">
                <button
                    @click="loadChapter(CHAPTERS.TRASH)"
                    class="back-button"
                >
                    ← Retour
                </button>
            </div>

            <!-- Affichage du contenu du chapitre -->
            <div v-if="chapter.id !== CHAPTERS.MAIL_ANSWER">
                <p class="preserve-whitespace">{{ chapter.content }}</p>
            </div>

            <!-- Affichage des choix customisé -->
            <ChapterImage
                v-if="chapter.id === CHAPTERS.IMAGES"
                :showRecoveredImages="hasRestoreFull"
            />

            <ChapterFiles
                v-if="chapter.id === CHAPTERS.FILES"
                :choices="choices"
                @select="makeChoice"
            />

            <ChapterFiles
                v-if="
                    chapter.id === CHAPTERS.FILES_WITH_CHOICES &&
                    choices.length > 0
                "
                :choices="choices"
                @select="makeChoice"
            />

            <ChapterPassword
                v-if="chapter.id === CHAPTERS.PASSWORD_FILE"
                correctPassword="mittens"
                @success="handlePasswordSuccess"
                @error="handlePasswordError"
                @cancel="emit('close')"
            />

            <ChapterContacts v-if="chapter.id === CHAPTERS.CONTACTS" />

            <ChapterGame
                v-if="chapter.id === CHAPTERS.GAME"
                @success="handleGameSuccess"
                @failure="handleGameFailure"
            />

            <ChapterMail
                v-if="chapter.id === CHAPTERS.MAIL_ANSWER"
                :content="chapter.content"
                :showActions="false"
            />

            <!-- Affichage des choix par défaut -->
            <ChapterChoice
                v-if="
                    choices.length > 0 &&
                    chapter.id !== CHAPTERS.FILES_WITH_CHOICES &&
                    chapter.id !== CHAPTERS.FILES
                "
                :choices="choices"
                @select="makeChoice"
            />
        </template>

        <template v-else>
            <p>Pas de chapitre trouvé.</p>
        </template>
    </Window95>
</template>

<script setup>
import { ref, computed, watch, inject } from "vue";
import { useStory } from "@/composables/useStory";
import { CHAPTERS } from "@/constants/chapters";
import Window95 from "@/components/ui/Window95.vue";
import ChapterImage from "@/components/narrative/ChapterImage.vue";
import ChapterFiles from "@/components/narrative/ChapterFiles.vue";
import ChapterChoice from "@/components/narrative/ChapterChoice.vue";
import ChapterPassword from "@/components/narrative/ChapterPassword.vue";
import ChapterContacts from "@/components/narrative/ChapterContacts.vue";
import ChapterGame from "@/components/narrative/ChapterGame.vue";
import ChapterMail from "@/components/narrative/ChapterMail.vue";

const props = defineProps({
    startChapterId: { type: Number, required: true },
    title: { type: String, default: "Narrative.exe" },
});

const emit = defineEmits(["close", "chapter-changed"]);

const flags = inject("flags", new Map());

const hasRestoreFull = computed(() => {
    return flags.get("has_used_restore_all") === true;
});

const currentChapterId = ref(props.startChapterId);

const storyId = 1;
const { story, loading, error } = useStory(storyId);

const chapter = computed(() => {
    if (!story.value || !story.value.chapters) return null;
    return (
        story.value.chapters.find((c) => c.id === currentChapterId.value) ||
        null
    );
});

const choices = computed(() => {
    if (!chapter.value) return [];
    return chapter.value.choices || [];
});

function loadChapter(id) {
    currentChapterId.value = id;
}

function makeChoice(choice) {
     const nextChapterId = choice.next_chapter_id;
  
  if (currentChapterId.value === nextChapterId) {
    return;
  }
  currentChapterId.value = nextChapterId;
  emit("chapter-changed", currentChapterId.value);
}

function isFileChapter(chapterId) {
    if (CHAPTERS.FILES_ADDITIONAL.includes(chapterId)) {
        return true;
    }

    return false;
}

function handlePasswordSuccess() {
    makeChoice({ next_chapter_id: CHAPTERS.PASSWORD_SUCCESS });
}

function handlePasswordError() {
    makeChoice({ next_chapter_id: CHAPTERS.PASSWORD_ERROR });
}

function handleGameSuccess() {
    makeChoice({ next_chapter_id: CHAPTERS.GAME_SUCCESS });
}

function handleGameFailure() {
    makeChoice({ next_chapter_id: CHAPTERS.GAME_FAILURE });
}

watch(
    () => props.startChapterId,
    (newId) => {
        if (currentChapterId.value !== newId) {
            currentChapterId.value = newId;
        }
    }
);
</script>

<style scoped>

.preserve-whitespace {
  white-space: pre-line; 
}
.back-button-container {
    padding: 0;
    margin-bottom: 8px;
}

.back-button {
    font-size: 0.75rem;
    padding: 1px 4px;
    background-color: transparent;
    border: none;
    color: #0000ee;
    cursor: pointer;
    text-decoration: none;
}

.back-button:hover {
    text-decoration: underline;
}
</style>
