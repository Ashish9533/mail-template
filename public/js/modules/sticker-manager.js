// Sticker Manager Module
export class StickerManager {
    constructor() {
        this.builder = null;
    }

    async init(builder) {
        this.builder = builder;
        this.setupEmojiSystem();
        this.setupStickerEvents();
    }

    setupStickerEvents() {
        const stickerItems = document.querySelectorAll('.sticker-item[draggable="true"]');
        stickerItems.forEach(item => {
            this.builder.getManager('dragDrop')?.setupDraggableComponent(item);
        });
    }

    setupEmojiSystem() {
        const emojiCategories = document.querySelectorAll('.emoji-category-btn');
        const emojiGrid = document.getElementById('emojiGrid');

        if (emojiCategories.length && emojiGrid) {
            emojiCategories.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.switchEmojiCategory(e.target.dataset.category);
                    this.updateEmojiCategoryUI(e.target);
                });
            });

            // Load default category
            this.switchEmojiCategory('smileys');
        }
    }

    switchEmojiCategory(category) {
        const emojiGrid = document.getElementById('emojiGrid');
        if (!emojiGrid) return;

        const emojis = this.getEmojisByCategory(category);

        emojiGrid.innerHTML = emojis.map(emoji =>
            `<div class="emoji-item p-1 cursor-pointer hover:bg-gray-100 rounded text-center"
                  draggable="true"
                  data-type="emoji"
                  data-emoji="${emoji}"
                  title="${emoji}">${emoji}</div>`
        ).join('');

        // Make emojis draggable
        const emojiItems = emojiGrid.querySelectorAll('.emoji-item');
        emojiItems.forEach(item => {
            this.builder.getManager('dragDrop')?.setupDraggableComponent(item);
        });
    }

    updateEmojiCategoryUI(activeBtn) {
        const categoryBtns = document.querySelectorAll('.emoji-category-btn');
        categoryBtns.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }

    getEmojisByCategory(category) {
        const emojiSets = {
            smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩'],
            people: ['👨', '👩', '👴', '👵', '👶', '👼', '👸', '🤴', '👷', '💂', '🕵️', '👩‍⚕️', '👨‍⚕️', '👩‍🌾', '👨‍🌾', '👩‍🍳', '👨‍🍳', '👩‍🎓', '👨‍🎓', '👩‍🎤', '👨‍🎤', '👩‍🏫', '👨‍🏫', '👩‍🏭', '👨‍🏭', '👩‍💻', '👨‍💻', '👩‍💼', '👨‍💼', '👩‍🔧'],
            nature: ['🌱', '🌿', '🍀', '🌳', '🌲', '🌴', '🌵', '🌷', '🌸', '🌺', '🌻', '🌹', '🌼', '🌾', '🍄', '🌰', '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸'],
            food: ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🍍', '🥭', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥒', '🌶️', '🌽', '🥕', '🥔', '🍠', '🥐', '🍞', '🥖', '🥨', '🧀', '🥚'],
            activities: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🥅', '🏒', '🏑', '🏏', '⛳', '🏹', '🎣', '🥊', '🥋', '🎽', '⛸️', '🥌', '🛷', '🎿', '⛷️', '🏂', '🏋️', '🤼', '🤸', '⛹️'],
            travel: ['✈️', '🚂', '🚁', '🚢', '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🏍️', '🛴', '🚲', '🛵', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🎢'],
            objects: ['💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '💰', '💳', '💎', '⚖️', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🔩', '⚙️', '🧰', '🧲', '🔫', '💣', '🧨', '🔪', '🗡️', '⚔️'],
            symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '⭐']
        };
        return emojiSets[category] || emojiSets.smileys;
    }

    getComponentHtml(componentType, componentName) {
        if (componentType === 'emoji') {
            return `<span class="email-component sticker" style="font-size: 24px; position: absolute; cursor: move;">${componentName}</span>`;
        }
        if (componentType === 'sticker') {
            const stickerSrc = this.getStickerSource(componentName);
            return `<img src="${stickerSrc}" class="email-component sticker" style="width: 50px; height: 50px; position: absolute; cursor: move;" alt="${componentName}">`;
        }
        return null;
    }

    getStickerSource(stickerName) {
        const stickerMap = {
            'celebration': '🎉',
            'fire': '🔥',
            'star': '⭐',
            'check': '✅',
            'heart': '❤️',
            'thumbs-up': '👍'
        };
        return stickerMap[stickerName] || '/componet/default.png';
    }
} 