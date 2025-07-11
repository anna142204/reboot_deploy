<template>
    <div
        class="w-full h-screen bg-gradient-to-br from-blue-300 to-gray-100 font-sans relative flex flex-col"
    >
        <StartScreen v-if="showStartScreen" @start="startGame" />

        <EndScreen
            v-if="showEndScreen"
            :isWin="endScreenIsWin"
            :winMessage="endScreenMessage"
            :loseMessage="endScreenMessage"
            :winTitle="endScreenTitle"
            :loseTitle="endScreenTitle"
            @restart="resetGame"
            @continue="hideEndScreen"
        />
        <!-- Barre du haut -->
        <div
            class="h-8 bg-blue-700 text-white px-4 flex items-center justify-between"
        >
            <span class="font-bold">OS</span>
        </div>

        <!-- Bureau -->
        <div class="flex-1 flex flex-col items-center justify-center">
            <!-- Apps principales -->
            <div class="flex gap-10 flex-wrap justify-center mb-8">
                <AppIcon
                    v-for="app in desktopApps"
                    :key="app.id"
                    :iconSrc="iconPath(app.icon)"
                    :alt="app.label"
                    @click="openApp(app.id)"
                >
                    {{ app.label }}
                </AppIcon>
            </div>

            <!-- Apps conditionnelles -->
            <div class="flex gap-10 flex-wrap justify-center">
                <AppIcon
                    v-if="flags.get('has_used_restore_partial')"
                    :iconSrc="iconPath('password')"
                    alt="password"
                    @click="openApp('password')"
                >
                    password.txt
                </AppIcon>

                <AppIcon
                    v-if="flags.get('has_inserted_usb')"
                    :iconSrc="iconPath('game')"
                    alt="game"
                    @click="openApp('game')"
                >
                    game.exe
                </AppIcon>

                <AppIcon
                    v-if="flags.get('game_completed')"
                    :iconSrc="iconPath('file')"
                    alt="file"
                    @click="openApp('final.txt')"
                >
                    final.txt
                </AppIcon>
            </div>
        </div>

        <!-- Icônes fixes sur le bureau -->
        <div class="absolute bottom-40 left-40">
            <AppIcon
                :iconSrc="iconPath('file')"
                alt="file"
                @click="openApp('perso.txt')"
            >
                perso.txt
            </AppIcon>
        </div>

        <div class="absolute bottom-10 right-6">
            <AppIcon
                :iconSrc="iconPath('settings')"
                alt="settings"
                @click="openApp('settings')"
            >
                Paramètres
            </AppIcon>
        </div>

        <!-- Fenêtres -->
        <Teleport to="body" v-if="activeApp">
            <div
                class="fixed top-20 left-1/2 transform -translate-x-1/2 w-80 bg-gray-200 border border-gray-500 shadow-lg rounded overflow-hidden z-50"
            >
                <!-- Applications narratives -->
                <template v-if="isNarrativeApp">
                    <NarrativeApp
                        :key="`${activeApp}-${chapterByApp[activeApp]}`"
                        :startChapterId="getAppStartChapter(activeApp)"
                        :title="getAppTitle(activeApp)"
                        @close="closeApp"
                        @chapter-changed="updateChapter(activeApp, $event)"
                    />
                </template>

                <!-- Paramètres -->
                <Window95
                    v-else-if="activeApp === 'settings'"
                    title="Parametres.exe"
                    @close="closeApp"
                >
                    <div class="p-2">
                        <h3 class="mb-2 font-bold">Options</h3>
                        <Button95 @click="resetGame" class="mb-2"
                            >Nouvelle partie</Button95
                        >
                        <p class="text-xs mt-4">Version 1.0.0</p>
                    </div>
                </Window95>
            </div>
        </Teleport>

        <!-- Barre du bas -->
        <Taskbar :openApps="openApps" :time="time" />
    </div>
</template>

<script setup>
import {
    ref,
    computed,
    onMounted,
    onBeforeUnmount,
    reactive,
    watch,
    provide,
} from "vue";
import Taskbar from "@/components/ui/TaskBar.vue";
import NarrativeApp from "@/components/NarrativeApp.vue";
import Window95 from "@/components/ui/Window95.vue";
import Button95 from "@/components/ui/Button95.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import { CHAPTERS } from "@/constants/chapters";
import StartScreen from "@/components/ui/StartScreen.vue";
import { useStory } from "@/composables/useStory";
import EndScreen from "@/components/ui/EndScreen.vue";

const showEndScreen = ref(false);
const endScreenIsWin = ref(false);
const endScreenTitle = ref("");
const endScreenMessage = ref("");
const showStartScreen = ref(localStorage.getItem("hasStartedGame") !== "true");
const activeApp = ref(null);
const time = ref(new Date().toLocaleTimeString());
const isResetting = ref(false);
const flags = reactive(new Map());

provide("flags", flags);

const { story, loading, error } = useStory(1);

// Chapitres par application
const chapterByApp = reactive({
    files: CHAPTERS.FILES,
    mails: CHAPTERS.MAILS,
    restore: CHAPTERS.RESTORE,
    password: CHAPTERS.PASSWORD,
    contacts: CHAPTERS.CONTACTS,
    "perso.txt": CHAPTERS.PASSWORD_FILE,
    trash: CHAPTERS.TRASH,
    game: CHAPTERS.GAME,
    "final.txt": CHAPTERS.FINAL,
});

// Apps affichées par défaut sur le bureau
const desktopApps = [
    { id: "files", label: "Fichiers", icon: "files" },
    { id: "mails", label: "Mails", icon: "mail" },
    { id: "contacts", label: "Contacts", icon: "contact" },
    { id: "restore", label: "Sauvegarde", icon: "restore" },
    { id: "trash", label: "Poubelle", icon: "trash" },
];

const openApps = computed(() => (activeApp.value ? [activeApp.value] : []));

const iconPath = (iconName) =>
    `${import.meta.env.BASE_URL}icons/${iconName}.png`;

//Apps qui utilisent le système narratif
const narrativeApps = [
    "files",
    "game",
    "mails",
    "contacts",
    "restore",
    "password",
    "trash",
    "perso.txt",
    "final.txt",
];
const isNarrativeApp = computed(() => narrativeApps.includes(activeApp.value));

//Titres affichés dans les fenêtres
const appTitles = {
    files: "Explorateur.exe",
    game: "game.exe",
    mails: "Mails.exe",
    contacts: "Contact",
    restore: "restore.exe",
    password: "password.txt",
    trash: "Poubelle.exe",
    "perso.txt": "perso.txt",
    "final.txt": "final.txt",
};

const setFlag = (flagName, value) => {
    flags.set(flagName, value);
    saveGameState();
};

const saveGameState = () => {
    const state = {
        flags: Object.fromEntries(flags),
        chapters: { ...chapterByApp },
        endScreen: {
            show: showEndScreen.value,
            isWin: endScreenIsWin.value,
            message: endScreenMessage.value,
            title: endScreenTitle.value,
        },
        hasStartedGame: localStorage.getItem("hasStartedGame") === "true",
    };

    localStorage.setItem("desktop-game-state", JSON.stringify(state));
};

const loadGameState = () => {
    try {
        const saved = localStorage.getItem("desktop-game-state");
        if (!saved) return false;

        const state = JSON.parse(saved);

        if (state.flags) {
            Object.entries(state.flags).forEach(([key, value]) => {
                flags.set(key, value);
            });
        }

        if (state.chapters) {
            Object.entries(state.chapters).forEach(([app, chapter]) => {
                chapterByApp[app] = chapter;
            });
        }
        if (state.endScreen) {
            showEndScreen.value = state.endScreen.show;
            endScreenIsWin.value = state.endScreen.isWin;
            endScreenMessage.value = state.endScreen.message;
            endScreenTitle.value = state.endScreen.title || "";
        }

        if (state.hasStartedGame !== undefined) {
            showStartScreen.value = !state.hasStartedGame;
        }
        return true;
    } catch (e) {
        console.error("Erreur lors du chargement de l'état:", e);
        return false;
    }
};

const openApp = (app) => {
    activeApp.value = app;
};

const closeApp = () => {
    activeApp.value = null;
};

const updateChapter = (app, chapterId) => {

    chapterByApp[app] = parseInt(chapterId);

    if (app === "restore" && chapterId === CHAPTERS.RESTORE_PARTIAL) {
        setFlag("has_used_restore_partial", true);
    }
    if (chapterId === CHAPTERS.USB_INSERTED) {
        setFlag("has_inserted_usb", true);
    }

    if (app === "restore" && chapterId === CHAPTERS.RESTORE_TOTAL) {
        setFlag("has_used_restore_all", true);
    }

    if (app === "game" && chapterId === CHAPTERS.GAME_SUCCESS) {
        setFlag("game_completed", true);
    }

    if (app === "final.txt") {
        if (chapterId === CHAPTERS.WIN_MEMORY) {
            setTimeout(() => {
                showWinScreen("MEMORY");
                console.log("memory");
            }, 1000);
        } else if (chapterId === CHAPTERS.WIN_REBOOT) {
            setTimeout(() => {
                showWinScreen("REBOOT");
                console.log("reboot");
            }, 1000);
        }
    } else if (chapterId === CHAPTERS.PASSWORD_ERROR) {
        setTimeout(() => {
            showGameOverScreen();
        }, 1000);
    }
};
const END_MESSAGES = {
    MEMORY: {
        title: "Vous avez retrouvé qui vous êtes.",
        text: "Les souvenirs affluent: votre travail au laboratoire, l'incident qui a tout changé, et pourquoi vous avez choisi d'effacer votre mémoire. Cette fois, vous êtes prête à affronter la vérité plutôt que de la fuir. Une nouvelle vie commence, avec le poids de vos connaissances mais aussi la liberté qu'apporte la vérité. Mittens vous attend à la maison.",
    },
    REBOOT: {
        title: "Vous choisissez d'oublier à nouveau.",
        text: "Certaines vérités sont trop lourdes à porter. Vous avez décidé de refermer la boîte de Pandore, préférant l'ignorance à la douleur des souvenirs. Un nouvel effacement de mémoire est programmé. Dans quelques heures, tout recommencera. C'est peut-être mieux ainsi.",
    },
    FAILURE: {
        title: "Le système de protection s'est activé.",
        text: "En tentant d'accéder à vos souvenirs verrouillés, vous avez déclenché le mécanisme de défense que vous aviez vous-même programmé. Votre identité véritable restera à jamais enfouie. Certains secrets sont peut-être destinés à ne jamais être révélés.",
    },
};
const showWinScreen = (type = "MEMORY") => {
    closeApp();
    const message = END_MESSAGES[type] || END_MESSAGES.REBOOT;

    endScreenIsWin.value = true;
    endScreenMessage.value = message.text;
    endScreenTitle.value = message.title;
    showEndScreen.value = true;
    saveGameState();
};

const showGameOverScreen = () => {
    closeApp();
    const message = END_MESSAGES.FAILURE;

    endScreenIsWin.value = false;
    endScreenMessage.value = message.text;
    endScreenTitle.value = message.title;
    showEndScreen.value = true;
    saveGameState();
};

const hideEndScreen = () => {
    showEndScreen.value = false;
    saveGameState();
};
const resetGame = () => {
    if (isResetting.value) return;

    const shouldReset =
        showEndScreen.value ||
        confirm(
            "Êtes-vous sûr de vouloir recommencer une nouvelle partie? Tout progrès sera perdu."
        );

    if (shouldReset) {
        isResetting.value = true;
        closeApp();

        showEndScreen.value = false;

        Object.assign(chapterByApp, {
            files: CHAPTERS.FILES,
            mails: CHAPTERS.MAILS,
            restore: CHAPTERS.RESTORE,
            password: CHAPTERS.PASSWORD,
            contacts: CHAPTERS.CONTACTS,
            "perso.txt": CHAPTERS.PASSWORD_FILE,
            trash: CHAPTERS.TRASH,
            game: CHAPTERS.GAME,
            "final.txt": CHAPTERS.FINAL,
        });

        flags.clear();

        localStorage.removeItem("hasStartedGame");
        showStartScreen.value = true;

        saveGameState();

        setTimeout(() => {
            isResetting.value = false;
        }, 1000);
    }
};
const startGame = () => {
    showStartScreen.value = false;
    showEndScreen.value = false;
    localStorage.setItem("hasStartedGame", "true");
    saveGameState();
};
const updateTime = () => {
    time.value = new Date().toLocaleTimeString();
};

const getAppStartChapter = (appId) => chapterByApp[appId] || 1;
const getAppTitle = (appId) => appTitles[appId] || `${appId}.exe`;

onMounted(() => {
    const timeInterval = setInterval(updateTime, 1000);
    const hasState = loadGameState();
    if (!hasState && localStorage.getItem("hasStartedGame") !== "true") {
        showStartScreen.value = true;
    }
    onBeforeUnmount(() => {
        clearInterval(timeInterval);
    });
});

watch(chapterByApp, () => {}, { deep: true });
</script>

<style scoped>
body {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
}
</style>
