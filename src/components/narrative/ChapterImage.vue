<template>
    <div class="images-container mt-4">
        <!-- Images standards toujours visibles -->
        <div v-for="(image, index) in images" :key="index" class="image-item">
            <img
                :src="image.src"
                :alt="image.alt"
                @click="openImageModal(image)"
                class="clickable-image"
            />
            <p>{{ image.alt }}</p>
        </div>

        <!-- Images récupérées par restauration complète -->
        <div v-if="showRecoveredImages" class="recovered-images">
            <div
                v-for="(image, index) in recoveredImages"
                :key="`recovered-${index}`"
                class="image-item"
            >
                <img
                    :src="image.src"
                    :alt="image.alt"
                    @click="openImageModal(image)"
                    class="clickable-image recovered"
                />
                <p>
                    {{ image.alt }}
                    <span class="recovered-badge">Récupéré</span>
                </p>
            </div>
        </div>

        <div v-if="selectedImage" class="image-modal" @click="closeImageModal">
            <div class="modal-content" @click.stop>
                <span class="close-button" @click="closeImageModal"
                    >&times;</span
                >
                <img
                    :src="selectedImage.src"
                    :alt="selectedImage.alt"
                    class="modal-image"
                />
                <p class="modal-caption">{{ selectedImage.alt }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
    // Images de base toujours visibles
    images: {
        type: Array,
        default: () => [
            { src: "/img/mittens.png", alt: "Mittens" },
            { src: "/img/archives.png", alt: "Archive" },
        ],
    },
    // Images supplémentaires uniquement visibles avec has_used_restore_all
    recoveredImages: {
        type: Array,
        default: () => [
            { src: "/img/ordi_mdp.png", alt: "Bureau" },
            { src: "/img/emma_and_her_cat.png", alt: "Emma et Mittens" },
        ],
    },
    showRecoveredImages: {
        type: Boolean,
        default: false,
    },
});

const selectedImage = ref(null);

function openImageModal(image) {
    selectedImage.value = image;
    document.body.style.overflow = "hidden";
}

function closeImageModal() {
    selectedImage.value = null;
    document.body.style.overflow = "";
}
</script>

<style scoped>
.images-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.recovered-images {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px dashed #999;
}

.image-item {
    width: 100%;
    background: #fff;
    border: 1px solid #000;
    padding: 5px;
    margin-bottom: 10px;
}

.clickable-image {
    width: 100%;
    height: auto;
    display: block;
    cursor: pointer;
}

.clickable-image.recovered {
    border: 2px solid #0066ff;
}

.recovered-badge {
    background-color: #0066ff;
    color: white;
    font-size: 10px;
    padding: 2px 4px;
    border-radius: 3px;
    margin-left: 5px;
}

.image-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.modal-content {
    position: relative;
    background-color: #fff;
    padding: 20px;
    max-width: 90%;
    max-height: 90%;
    overflow-y: auto;
}

.close-button {
    position: absolute;
    top: 5px;
    right: 10px;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
}

.modal-image {
    max-width: 100%;
    max-height: 70vh;
}

.modal-caption {
    text-align: center;
    margin-top: 10px;
}

@media (min-width: 640px) {
    .images-container,
    .recovered-images {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 10px;
    }

    .image-item {
        width: calc(33.3% - 10px);
        margin-bottom: 0;
    }
}
</style>
