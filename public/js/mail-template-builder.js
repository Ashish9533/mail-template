class MailTemplateBuilder {
    constructor() {
        this.canvas = document.getElementById("email-canvas");
        this.propertiesPanel = document.getElementById("properties-panel");
        this.selectedElement = null;
        this.history = [];
        this.historyIndex = -1;
        this.components = this.initializeComponents();
        this.templates = this.initializeTemplates();
        this.csrfToken = null;
        this.clipboard = null;
        this.gridEnabled = false;
        this.snapEnabled = false;
        this.rulersEnabled = false;
        this.selectedLayout = "blank";
        this.isAddingComponent = false;
        this.draggedElement = null;
        this.dragStartPosition = null;
        this.isDraggingFromCanvas = false;
        this.selectedComponents = new Set();
        this.dragMode = "move";
        this.autoScrollInterval = null;
        this.insertIndicator = null;
        this.activeQuickMenu = null;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupCSRF();
        this.loadSavedTemplates();
    }

    setupCSRF() {
        // Get CSRF token from meta tag
        const metaTag = document.querySelector('meta[name="csrf-token"]');
        if (metaTag) {
            this.csrfToken = metaTag.getAttribute("content");
            console.log("CSRF Token found:", this.csrfToken ? "✓" : "✗");
        } else {
            console.error("CSRF meta tag not found!");
        }
    }

    // Get fresh CSRF token if needed
    getCsrfToken() {
        if (!this.csrfToken) {
            const metaTag = document.querySelector('meta[name="csrf-token"]');
            if (metaTag) {
                this.csrfToken = metaTag.getAttribute("content");
            }
        }
        return this.csrfToken;
    }

    setupEventListeners() {
        // Header buttons
        document
            .getElementById("new-template-btn")
            .addEventListener("click", () => this.showNewTemplateModal());
        document
            .getElementById("save-btn")
            .addEventListener("click", () => this.saveTemplate());
        document
            .getElementById("load-btn")
            .addEventListener("click", () => this.showLoadModal());
        document
            .getElementById("preview-btn")
            .addEventListener("click", () => this.previewTemplate());
        document
            .getElementById("export-btn")
            .addEventListener("click", () => this.exportTemplate());
        document
            .getElementById("clear-btn")
            .addEventListener("click", () => this.clearCanvas());

        // Enhanced toolbar buttons
        document
            .getElementById("grid-toggle")
            .addEventListener("click", () => this.toggleGrid());
        document
            .getElementById("snap-toggle")
            .addEventListener("click", () => this.toggleSnap());
        document
            .getElementById("rulers-toggle")
            .addEventListener("click", () => this.toggleRulers());
        document
            .getElementById("copy-component")
            .addEventListener("click", () => this.copyComponent());
        document
            .getElementById("paste-component")
            .addEventListener("click", () => this.pasteComponent());
        document
            .getElementById("duplicate-component")
            .addEventListener("click", () => this.duplicateComponent());
        document
            .getElementById("align-left")
            .addEventListener("click", () => this.alignComponent("left"));
        document
            .getElementById("align-center")
            .addEventListener("click", () => this.alignComponent("center"));
        document
            .getElementById("align-right")
            .addEventListener("click", () => this.alignComponent("right"));
        document
            .getElementById("undo-btn")
            .addEventListener("click", () => this.undo());
        document
            .getElementById("redo-btn")
            .addEventListener("click", () => this.redo());
        document
            .getElementById("code-view-btn")
            .addEventListener("click", () => this.showCodeModal());

        // Device and zoom selectors
        document
            .getElementById("device-selector")
            .addEventListener("change", (e) =>
                this.changeDevice(e.target.value)
            );
        document
            .getElementById("zoom-selector")
            .addEventListener("change", (e) => this.changeZoom(e.target.value));

        // Modal events
        document.querySelectorAll(".modal-close").forEach((btn) => {
            btn.addEventListener("click", () => this.closeModals());
        });

        // New Template Modal
        document
            .getElementById("new-template-form")
            .addEventListener("submit", (e) => this.createNewTemplate(e));
        document
            .getElementById("add-variable")
            .addEventListener("click", () => this.addTemplateVariable());
        document.querySelectorAll(".template-layout").forEach((layout) => {
            layout.addEventListener("click", () =>
                this.selectLayout(layout.dataset.layout)
            );
        });

        // Enhanced Load Modal
        document
            .getElementById("template-search")
            ?.addEventListener("input", (e) => this.filterTemplates());
        document
            .getElementById("template-filter-category")
            ?.addEventListener("change", (e) => this.filterTemplates());

        // Code Modal
        document
            .getElementById("format-code")
            ?.addEventListener("click", () => this.formatCode());
        document
            .getElementById("apply-code")
            ?.addEventListener("click", () => this.applyCodeChanges());

        // Properties panel
        document
            .getElementById("close-properties")
            .addEventListener("click", () => this.hidePropertiesPanel());

        // Canvas click events
        this.canvas.addEventListener("click", (e) => this.handleCanvasClick(e));

        // Template items
        document.querySelectorAll(".template-item").forEach((item) => {
            item.addEventListener("click", () =>
                this.loadTemplate(item.dataset.template)
            );
        });

        // Sticker gallery
        this.setupStickerGallery();

        // Enhanced drag and drop
        this.setupEnhancedDragAndDrop();
    }

    initializeComponents() {
        return {
            container: {
                html: '<div class="email-container droppable-container" style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); min-height: 100px;"><p class="placeholder-text">Container - Drop components here</p></div>',
                properties: [
                    "width",
                    "padding",
                    "background",
                    "border",
                    "borderRadius",
                ],
                droppable: true,
            },
            row: {
                html: '<div class="email-row droppable-container" style="display: flex; width: 100%; margin: 10px 0; min-height: 80px;"><div class="email-col droppable-container" style="flex: 1; padding: 10px; border: 1px dashed #ccc; min-height: 60px;"><p class="placeholder-text">Row - Drop components here</p></div></div>',
                properties: ["spacing", "alignment", "background"],
                droppable: true,
            },
            column: {
                html: '<div class="email-col droppable-container" style="flex: 1; padding: 15px; margin: 5px; border: 1px dashed #e5e7eb; min-height: 100px;"><p class="placeholder-text">Column - Drop components here</p></div>',
                properties: ["width", "padding", "alignment", "background"],
                droppable: true,
            },
            heading: {
                html: '<h2 class="email-heading draggable-heading" style="color: #1f2937; font-size: 24px; font-weight: bold; margin: 20px 0; text-align: left; position: relative; cursor: text; display: inline-block; padding: 8px; border: 1px dashed transparent; border-radius: 4px;" contenteditable="true" data-placeholder="Click to edit heading...">Your Heading Here</h2>',
                properties: [
                    "text",
                    "headingLevel",
                    "fontSize",
                    "fontFamily",
                    "color",
                    "fontWeight",
                    "fontStyle",
                    "textDecoration",
                    "textAlign",
                    "textShadow",
                    "letterSpacing",
                    "lineHeight",
                    "margin",
                    "padding",
                    "backgroundColor",
                    "borderRadius",
                ],
                draggable: true,
                editable: true,
            },
            text: {
                html: '<div class="email-text" contenteditable="true" style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 15px 0; min-height: 20px; padding: 8px; border: 1px dashed transparent; border-radius: 4px;" data-placeholder="Click to edit text...">Write your email content here. You can customize the font, color, and spacing to match your brand.</div>',
                properties: [
                    "text",
                    "fontSize",
                    "color",
                    "lineHeight",
                    "textAlign",
                    "margin",
                    "padding",
                ],
                editable: true,
            },
            button: {
                html: '<a href="#" class="email-button" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 15px 0;">Click Here</a>',
                properties: [
                    "text",
                    "url",
                    "backgroundColor",
                    "color",
                    "padding",
                    "borderRadius",
                    "fontSize",
                ],
            },
            image: {
                html: '<img class="email-image" src="https://via.placeholder.com/400x200/3b82f6/ffffff?text=Your+Image" alt="Email Image" style="max-width: 100%; height: auto; border-radius: 8px; margin: 15px 0;">',
                properties: [
                    "src",
                    "alt",
                    "width",
                    "height",
                    "borderRadius",
                    "margin",
                ],
            },
            spacer: {
                html: '<div class="email-spacer" style="height: 40px; background: transparent;"></div>',
                properties: ["height"],
            },
            divider: {
                html: '<hr class="email-divider" style="border: none; height: 2px; background-color: #e5e7eb; margin: 25px 0;">',
                properties: ["height", "color", "margin"],
            },
            header: {
                html: '<header class="email-header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;"><h1 style="margin: 0; font-size: 28px; font-weight: bold;">Your Company</h1><p style="margin: 10px 0 0; opacity: 0.9;">Professional Email Template</p></header>',
                properties: ["background", "color", "padding", "textAlign"],
            },
            footer: {
                html: '<footer class="email-footer" style="background-color: #f9fafb; color: #6b7280; padding: 25px 20px; text-align: center; font-size: 14px; border-radius: 0 0 8px 8px;"><p style="margin: 0 0 10px;">© 2024 Your Company. All rights reserved.</p><p style="margin: 0; font-size: 12px;">You received this email because you subscribed to our newsletter.</p></footer>',
                properties: [
                    "background",
                    "color",
                    "padding",
                    "textAlign",
                    "fontSize",
                ],
            },
            social: {
                html: '<div class="email-social" style="text-align: center; margin: 20px 0;"><a href="#" style="display: inline-block; margin: 0 10px; padding: 10px; background-color: #1da1f2; color: white; border-radius: 50%; text-decoration: none; width: 40px; height: 40px; line-height: 20px;">T</a><a href="#" style="display: inline-block; margin: 0 10px; padding: 10px; background-color: #4267B2; color: white; border-radius: 50%; text-decoration: none; width: 40px; height: 40px; line-height: 20px;">F</a><a href="#" style="display: inline-block; margin: 0 10px; padding: 10px; background-color: #E4405F; color: white; border-radius: 50%; text-decoration: none; width: 40px; height: 40px; line-height: 20px;">I</a></div>',
                properties: ["alignment", "spacing", "iconSize"],
            },
            grid: {
                html: '<div class="email-grid droppable-container" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0;"><div class="grid-item droppable-container" style="padding: 15px; border: 1px dashed #e5e7eb; text-align: center; min-height: 100px;"><p class="placeholder-text">Drop here</p></div><div class="grid-item droppable-container" style="padding: 15px; border: 1px dashed #e5e7eb; text-align: center; min-height: 100px;"><p class="placeholder-text">Drop here</p></div></div>',
                properties: ["columns", "gap", "padding", "background"],
                droppable: true,
            },
            section: {
                html: '<section class="email-section droppable-container" style="background-color: #f9fafb; padding: 30px 20px; margin: 20px 0; border-radius: 8px; min-height: 120px;"><h3 style="margin: 0 0 15px; color: #1f2937; font-size: 20px;">Section Title</h3><div class="section-content droppable-container" style="min-height: 60px; border: 1px dashed #d1d5db; border-radius: 4px; padding: 15px;"><p class="placeholder-text">Drop components in this section</p></div></section>',
                properties: ["background", "padding", "margin", "borderRadius"],
                droppable: true,
            },
            list: {
                html: '<ul class="email-list" style="margin: 20px 0; padding-left: 20px; color: #374151;"><li style="margin: 8px 0;">First list item</li><li style="margin: 8px 0;">Second list item</li><li style="margin: 8px 0;">Third list item</li></ul>',
                properties: ["listStyle", "color", "spacing", "padding"],
            },
            table: {
                html: '<table class="email-table" style="width: 100%; border-collapse: collapse; margin: 20px 0;"><thead><tr style="background-color: #f3f4f6;"><th style="padding: 12px; border: 1px solid #d1d5db; text-align: left;">Header 1</th><th style="padding: 12px; border: 1px solid #d1d5db; text-align: left;">Header 2</th></tr></thead><tbody><tr><td style="padding: 12px; border: 1px solid #d1d5db;">Data 1</td><td style="padding: 12px; border: 1px solid #d1d5db;">Data 2</td></tr><tr style="background-color: #f9fafb;"><td style="padding: 12px; border: 1px solid #d1d5db;">Data 3</td><td style="padding: 12px; border: 1px solid #d1d5db;">Data 4</td></tr></tbody></table>',
                properties: [
                    "borderStyle",
                    "padding",
                    "background",
                    "textAlign",
                ],
            },
            card: {
                html: '<div class="email-card" style="background-color: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin: 20px 0; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);"><h4 style="margin: 0 0 12px; color: #1f2937; font-size: 18px; font-weight: 600;">Card Title</h4><p style="margin: 0 0 16px; color: #6b7280; line-height: 1.5;">This is a card component with a clean design. Perfect for highlighting important content.</p><a href="#" style="display: inline-block; background-color: #3b82f6; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 14px;">Learn More</a></div>',
                properties: [
                    "background",
                    "border",
                    "borderRadius",
                    "padding",
                    "shadow",
                ],
            },
            banner: {
                html: '<div class="email-banner" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; padding: 40px 20px; margin: 20px 0; border-radius: 8px;"><h2 style="margin: 0 0 16px; font-size: 28px; font-weight: bold;">Special Announcement</h2><p style="margin: 0 0 20px; font-size: 18px; opacity: 0.9;">Important message or promotional content goes here</p><a href="#" style="display: inline-block; background-color: rgba(255,255,255,0.2); color: white; padding: 12px 24px; border: 2px solid white; border-radius: 6px; text-decoration: none; font-weight: 600;">Take Action</a></div>',
                properties: [
                    "background",
                    "color",
                    "padding",
                    "textAlign",
                    "borderRadius",
                ],
            },
            sticker: {
                html: '<div class="email-sticker draggable-sticker" style="display: inline-block; font-size: 48px; margin: 10px; cursor: move; user-select: none; position: absolute; z-index: 5; top: 50px; left: 50px;">🎉</div>',
                properties: [
                    "sticker",
                    "fontSize",
                    "position",
                    "zIndex",
                    "margin",
                    "top",
                    "left",
                ],
                repositionable: true,
                draggable: true,
            },
            imageUpload: {
                html: '<div class="email-image-upload draggable-image" style="position: absolute; top: 50px; left: 50px; cursor: move; user-select: none; z-index: 5;"><img src="https://via.placeholder.com/200x150/3b82f6/ffffff?text=Upload+Image" alt="Uploaded Image" style="max-width: 200px; height: auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);"></div>',
                properties: [
                    "src",
                    "alt",
                    "width",
                    "height",
                    "borderRadius",
                    "position",
                    "top",
                    "left",
                    "zIndex",
                ],
                repositionable: true,
                draggable: true,
            },
            signature: {
                html: '<div class="email-signature" style="border-top: 1px solid #e5e7eb; padding: 20px 0; margin: 30px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6; position: relative;"><div class="signature-content" contenteditable="true" data-placeholder="Best regards,<br>Your Name<br>Your Title<br>Company Name<br>Email: your.email@company.com<br>Phone: +1 (555) 123-4567">Best regards,<br><strong>John Doe</strong><br><em>Marketing Manager</em><br>Acme Corporation<br>Email: john.doe@acme.com<br>Phone: +1 (555) 123-4567</div><button class="signature-creator-btn" style="position: absolute; top: 5px; right: 5px; background: #f59e0b; color: white; border: none; border-radius: 4px; padding: 6px 8px; font-size: 10px; cursor: pointer; opacity: 0; transition: opacity 0.2s ease; z-index: 10;" title="Create Digital Signature"><i class="fas fa-signature"></i></button></div>',
                properties: [
                    "fontSize",
                    "color",
                    "lineHeight",
                    "textAlign",
                    "borderTop",
                    "padding",
                    "margin",
                ],
                editable: true,
            },
        };
    }

    initializeTemplates() {
        return {
            newsletter: {
                name: "Newsletter Template",
                html: `
                    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
                        ${this.components.header.html}
                        <div style="padding: 30px 20px;">
                            ${this.components.heading.html.replace(
                                "Your Heading Here",
                                "Weekly Newsletter"
                            )}
                            ${this.components.text.html.replace(
                                "Write your email content here...",
                                "Welcome to our weekly newsletter! Here are the latest updates and insights from our team."
                            )}
                            ${this.components.image.html}
                            ${this.components.text.html}
                            ${this.components.button.html.replace(
                                "Click Here",
                                "Read More"
                            )}
                            ${this.components.divider.html}
                            <h3 style="color: #1f2937; font-size: 20px;">Latest Articles</h3>
                            ${this.components.text.html.replace(
                                "Write your email content here...",
                                "• Article 1: How to improve your email marketing\n• Article 2: Latest industry trends\n• Article 3: Customer success stories"
                            )}
                        </div>
                        ${this.components.footer.html}
                    </div>
                `,
            },
            welcome: {
                name: "Welcome Email",
                html: `
                    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center;">
                            <h1 style="margin: 0; font-size: 32px;">Welcome!</h1>
                            <p style="margin: 15px 0 0; font-size: 18px; opacity: 0.9;">We're excited to have you on board</p>
                        </div>
                        <div style="padding: 40px 20px;">
                            ${this.components.text.html.replace(
                                "Write your email content here...",
                                "Thank you for joining our community! We're thrilled to welcome you and can't wait to share amazing content with you."
                            )}
                            ${this.components.button.html.replace(
                                "Click Here",
                                "Get Started"
                            )}
                            ${this.components.spacer.html}
                            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                <h3 style="margin: 0 0 15px; color: #1f2937;">What's Next?</h3>
                                <p style="margin: 0; color: #6b7280;">1. Complete your profile<br>2. Explore our features<br>3. Connect with others</p>
                            </div>
                        </div>
                        ${this.components.social.html}
                        ${this.components.footer.html}
                    </div>
                `,
            },
            promotion: {
                name: "Promotional Email",
                html: `
                    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
                        <div style="background-color: #ef4444; color: white; padding: 15px 20px; text-align: center;">
                            <h2 style="margin: 0; font-size: 24px;">🔥 LIMITED TIME OFFER</h2>
                        </div>
                        <div style="padding: 30px 20px; text-align: center;">
                            <h1 style="margin: 0 0 20px; font-size: 36px; color: #1f2937;">50% OFF</h1>
                            <p style="margin: 0 0 20px; font-size: 18px; color: #6b7280;">Everything in our store</p>
                            ${this.components.image.html}
                            ${this.components.text.html.replace(
                                "Write your email content here...",
                                "Don't miss out on this incredible deal! Use code SAVE50 at checkout to get 50% off your entire order."
                            )}
                            <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 20px; border-radius: 10px; margin: 25px 0;">
                                <h3 style="margin: 0 0 10px; font-size: 24px;">CODE: SAVE50</h3>
                                <p style="margin: 0; opacity: 0.9;">Valid until midnight tonight!</p>
                            </div>
                            ${this.components.button.html
                                .replace("Click Here", "Shop Now")
                                .replace("#3b82f6", "#ef4444")}
                        </div>
                        ${this.components.footer.html}
                    </div>
                `,
            },
        };
    }

    // Modified addComponent method
    addComponent(type, position = null) {
        if (!this.components[type]) {
            console.warn(`Component type "${type}" not found`);
            return;
        }

        if (this.isAddingComponent) {
            return;
        }

        this.isAddingComponent = true;

        try {
            const component = this.components[type];
            const element = document.createElement("div");
            element.className = "email-component";
            element.dataset.componentType = type;
            element.innerHTML = component.html;
            element.id = `component-${Date.now()}-${Math.random()
                .toString(36)
                .substr(2, 9)}`;

            // Make component selectable
            element.addEventListener("click", (e) => {
                e.stopPropagation();
                this.selectElement(element);
            });

            this.makeComponentDraggable(element);

            // Clear placeholder
            const placeholder = this.canvas.querySelector(".text-center");
            if (placeholder) {
                placeholder.style.display = "none";
            }

            this.canvas.appendChild(element);

            // IMMEDIATE setup for droppable components
            if (component.droppable) {
                console.log(
                    "🔧 Setting up droppable component immediately:",
                    type
                );

                // Setup drop functionality
                this.setupComponentDropFunctionality(element);

                // Setup containers IMMEDIATELY - no timeout
                this.setupContainersInElement(element);

                console.log("✅ Droppable component setup complete");
            }

            // Handle other component types
            if (component.draggable) {
                this.setupFreeDragging(element);
            }

            if (type === "imageUpload") {
                this.setupImageUpload(element);
            }

            if (type === "heading") {
                this.setupHeadingFunctionality(element);
            }

            if (type === "text") {
                this.setupTextFunctionality(element);
            }

            if (type === "signature") {
                this.setupSignatureFunctionality(element);
            }

            this.selectElement(element);
            this.saveState();

            if (component.droppable) {
                this.showNotification(
                    `${
                        type.charAt(0).toUpperCase() + type.slice(1)
                    } added! Double-click inside to add components.`
                );
            } else {
                this.showNotification(`${type} component added successfully!`);
            }
            mailBuilder.forceSetupAllContainers();
            console.log(`✅ Successfully added ${type} component`);
        } catch (error) {
            console.error("Error adding component:", error);
            this.showNotification(`Error adding ${type} component`, "error");
        } finally {
            this.isAddingComponent = false;
        }
    }

    selectElement(element) {
        // Remove previous selection
        document.querySelectorAll(".email-component.selected").forEach((el) => {
            el.classList.remove("selected");
        });

        // Add selection to new element
        element.classList.add("selected");
        this.selectedElement = element;

        // Show properties panel
        this.showPropertiesPanel(element);

        // Add selection styles
        if (!document.getElementById("selection-styles")) {
            const style = document.createElement("style");
            style.id = "selection-styles";
            style.textContent = `
                .email-component.selected {
                    outline: 2px solid #3b82f6 !important;
                    outline-offset: 2px !important;
                    position: relative !important;
                }
                .email-component.selected::after {
                    content: '';
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    width: 20px;
                    height: 20px;
                    background: #3b82f6;
                    border-radius: 50%;
                    border: 2px solid white;
                }
            `;
            document.head.appendChild(style);
        }
    }

    showPropertiesPanel(element) {
        const componentType = element.dataset.componentType;
        const component = this.components[componentType];

        if (!component) return;

        const content = document.getElementById("properties-content");
        const properties = component.properties || [];

        let html = `<h3 class="text-lg font-semibold mb-4 capitalize">${componentType} Properties</h3>`;

        properties.forEach((prop) => {
            html += this.generatePropertyInput(prop, element);
        });

        html += `
            <div class="mt-6 pt-4 border-t border-gray-200">
                <button onclick="mailBuilder.deleteSelectedElement()" 
                        class="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors">
                    <i class="fas fa-trash mr-2"></i>Delete Component
                </button>
            </div>
        `;

        content.innerHTML = html;
        this.propertiesPanel.classList.remove("hidden");

        // Attach event listeners to property inputs
        content.querySelectorAll("input, select, textarea").forEach((input) => {
            input.addEventListener("input", () =>
                this.updateElementProperty(element, input)
            );
        });
    }

    generatePropertyInput(property, element) {
        const currentValue = this.getElementProperty(element, property);

        switch (property) {
            case "text":
                return `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Text</label>
                        <textarea data-property="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3">${currentValue}</textarea>
                    </div>
                `;
            case "headingLevel":
                const currentLevel = currentValue || "h2";
                return `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Heading Level</label>
                        <select data-property="headingLevel" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="h1" ${
                                currentLevel === "h1" ? "selected" : ""
                            }>H1 - Main Title</option>
                            <option value="h2" ${
                                currentLevel === "h2" ? "selected" : ""
                            }>H2 - Section Title</option>
                            <option value="h3" ${
                                currentLevel === "h3" ? "selected" : ""
                            }>H3 - Subsection</option>
                            <option value="h4" ${
                                currentLevel === "h4" ? "selected" : ""
                            }>H4 - Minor Heading</option>
                            <option value="h5" ${
                                currentLevel === "h5" ? "selected" : ""
                            }>H5 - Small Heading</option>
                            <option value="h6" ${
                                currentLevel === "h6" ? "selected" : ""
                            }>H6 - Tiny Heading</option>
                        </select>
                    </div>
                `;
            case "fontFamily":
                return `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                        <select data-property="fontFamily" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="Arial, sans-serif">Arial</option>
                            <option value="'Times New Roman', serif">Times New Roman</option>
                            <option value="'Courier New', monospace">Courier New</option>
                            <option value="Georgia, serif">Georgia</option>
                            <option value="Verdana, sans-serif">Verdana</option>
                            <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                            <option value="'Comic Sans MS', cursive">Comic Sans MS</option>
                            <option value="Impact, sans-serif">Impact</option>
                            <option value="'Lucida Sans', sans-serif">Lucida Sans</option>
                            <option value="Tahoma, sans-serif">Tahoma</option>
                        </select>
                    </div>
                `;
            case "fontStyle":
                return `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Font Style</label>
                        <select data-property="fontStyle" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="normal">Normal</option>
                            <option value="italic">Italic</option>
                            <option value="oblique">Oblique</option>
                        </select>
                    </div>
                `;
            case "textDecoration":
                return `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Text Decoration</label>
                        <select data-property="textDecoration" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="none">None</option>
                            <option value="underline">Underline</option>
                            <option value="overline">Overline</option>
                            <option value="line-through">Strike Through</option>
                            <option value="underline overline">Underline + Overline</option>
                        </select>
                    </div>
                `;
            case "textShadow":
                return `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Text Shadow</label>
                        <select data-property="textShadow" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="none">None</option>
                            <option value="2px 2px 4px rgba(0,0,0,0.3)">Light Shadow</option>
                            <option value="3px 3px 6px rgba(0,0,0,0.5)">Medium Shadow</option>
                            <option value="4px 4px 8px rgba(0,0,0,0.7)">Heavy Shadow</option>
                            <option value="1px 1px 2px rgba(255,255,255,0.8)">White Glow</option>
                            <option value="0 0 10px rgba(59,130,246,0.8)">Blue Glow</option>
                            <option value="0 0 10px rgba(239,68,68,0.8)">Red Glow</option>
                        </select>
                    </div>
                `;
            case "letterSpacing":
                return `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Letter Spacing</label>
                        <select data-property="letterSpacing" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="normal">Normal</option>
                            <option value="1px">1px</option>
                            <option value="2px">2px</option>
                            <option value="3px">3px</option>
                            <option value="4px">4px</option>
                            <option value="5px">5px</option>
                            <option value="-1px">-1px (Tighter)</option>
                        </select>
                    </div>
                `;
            case "lineHeight":
                return `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Line Height</label>
                        <select data-property="lineHeight" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="1">1.0</option>
                            <option value="1.2">1.2</option>
                            <option value="1.4">1.4</option>
                            <option value="1.6">1.6 (Default)</option>
                            <option value="1.8">1.8</option>
                            <option value="2.0">2.0</option>
                        </select>
                    </div>
                `;
            case "fontSize":
                return `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                        <select data-property="fontSize" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="12px">12px</option>
                            <option value="14px">14px</option>
                            <option value="16px" selected>16px</option>
                            <option value="18px">18px</option>
                            <option value="20px">20px</option>
                            <option value="24px">24px</option>
                            <option value="28px">28px</option>
                            <option value="32px">32px</option>
                        </select>
                    </div>
                `;
            case "color":
                return `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                        <input type="color" data-property="color" value="${
                            currentValue || "#000000"
                        }" class="w-full h-10 border border-gray-300 rounded-md">
                    </div>
                `;
            case "backgroundColor":
                return `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                        <input type="color" data-property="backgroundColor" value="${
                            currentValue || "#ffffff"
                        }" class="w-full h-10 border border-gray-300 rounded-md">
                    </div>
                `;
            case "textAlign":
                return `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Text Alignment</label>
                        <select data-property="textAlign" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right">Right</option>
                            <option value="justify">Justify</option>
                        </select>
                    </div>
                `;
            case "padding":
                return `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Padding</label>
                        <input type="text" data-property="padding" value="${
                            currentValue || "10px"
                        }" placeholder="e.g., 10px or 10px 20px" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                `;
            case "margin":
                return `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Margin</label>
                        <input type="text" data-property="margin" value="${
                            currentValue || "10px"
                        }" placeholder="e.g., 10px or 10px 20px" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                `;
            case "url":
                return `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">URL</label>
                        <input type="url" data-property="url" value="${
                            currentValue || "#"
                        }" placeholder="https://example.com" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                `;
            case "src":
                return `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                        <input type="url" data-property="src" value="${currentValue}" placeholder="https://example.com/image.jpg" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                `;
            case "alt":
                return `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Alt Text</label>
                        <input type="text" data-property="alt" value="${currentValue}" placeholder="Image description" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                `;
            case "sticker":
                return `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Sticker</label>
                        <div class="sticker-selector grid grid-cols-6 gap-2 p-3 bg-gray-50 rounded-md border border-gray-300">
                            ${this.generateStickerOptions(currentValue)}
                        </div>
                    </div>
                `;
            case "position":
                return `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Position</label>
                        <select data-property="position" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="relative">Relative</option>
                            <option value="absolute">Absolute</option>
                            <option value="fixed">Fixed</option>
                        </select>
                    </div>
                `;
            case "zIndex":
                return `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Z-Index (Layer)</label>
                        <input type="range" data-property="z-index" value="${
                            currentValue || "5"
                        }" min="1" max="20" 
                               class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                        <div class="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Behind (1)</span>
                            <span>Front (20)</span>
                        </div>
                    </div>
                `;
            case "top":
                return `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Top Position</label>
                        <input type="number" data-property="top" value="${
                            parseInt(currentValue) || "50"
                        }" min="0" max="1000" 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <div class="text-xs text-gray-500 mt-1">Distance from top in pixels</div>
                    </div>
                `;
            case "left":
                return `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Left Position</label>
                        <input type="number" data-property="left" value="${
                            parseInt(currentValue) || "50"
                        }" min="0" max="800" 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <div class="text-xs text-gray-500 mt-1">Distance from left in pixels</div>
                    </div>
                `;
            case "width":
                return `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Width</label>
                        <input type="text" data-property="width" value="${
                            currentValue || "auto"
                        }" placeholder="e.g., 200px, 100%, auto" 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                `;
            case "height":
                return `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Height</label>
                        <input type="text" data-property="height" value="${
                            currentValue || "auto"
                        }" placeholder="e.g., 150px, auto" 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                `;
            case "borderRadius":
                return `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Border Radius</label>
                        <input type="text" data-property="borderRadius" value="${
                            currentValue || "0px"
                        }" placeholder="e.g., 8px, 50%" 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                `;
            default:
                return `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2 capitalize">${property}</label>
                        <input type="text" data-property="${property}" value="${
                    currentValue || ""
                }" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                `;
        }
    }

    getElementProperty(element, property) {
        const firstChild = element.firstElementChild;
        if (!firstChild) return "";

        switch (property) {
            case "text":
                // Handle different text elements
                if (
                    firstChild.classList.contains("email-text") ||
                    firstChild.classList.contains("signature-content")
                ) {
                    return firstChild.innerHTML || firstChild.textContent || "";
                }
                return firstChild.textContent || firstChild.innerText || "";
            case "headingLevel":
                return firstChild.tagName.toLowerCase();
            case "url":
                return firstChild.href || "";
            case "src":
                return firstChild.src || "";
            case "alt":
                return firstChild.alt || "";
            case "fontFamily":
                return firstChild.style.fontFamily || "Arial, sans-serif";
            case "fontStyle":
                return firstChild.style.fontStyle || "normal";
            case "textDecoration":
                return firstChild.style.textDecoration || "none";
            case "textShadow":
                return firstChild.style.textShadow || "none";
            case "letterSpacing":
                return firstChild.style.letterSpacing || "normal";
            case "lineHeight":
                return firstChild.style.lineHeight || "1.6";
            default:
                return firstChild.style[property] || "";
        }
    }

    updateElementProperty(element, input) {
        const property = input.dataset.property;
        const value = input.value;
        const firstChild = element.firstElementChild;

        if (!firstChild) return;

        switch (property) {
            case "text":
                // Handle different text elements
                if (
                    firstChild.classList.contains("email-text") ||
                    firstChild.classList.contains("signature-content")
                ) {
                    firstChild.innerHTML = value;
                } else {
                    firstChild.textContent = value;
                }
                break;
            case "headingLevel":
                // Change the heading tag level
                const newHeading = document.createElement(value);
                newHeading.className = firstChild.className;
                newHeading.style.cssText = firstChild.style.cssText;
                newHeading.textContent = firstChild.textContent;
                newHeading.contentEditable = firstChild.contentEditable;
                newHeading.dataset.placeholder = firstChild.dataset.placeholder;

                // Preserve current transform if any
                const currentTransform = firstChild.style.transform;
                if (currentTransform) {
                    newHeading.style.transform = currentTransform;
                }

                // Remove old drag handle if exists
                const oldDragHandle = element.querySelector(
                    ".heading-drag-handle"
                );
                if (oldDragHandle) {
                    oldDragHandle.remove();
                }

                // Replace the element
                element.replaceChild(newHeading, firstChild);

                // Re-setup the heading functionality with new element
                this.setupHeadingFunctionality(element);

                this.showNotification(
                    `Heading changed to ${value.toUpperCase()}`
                );
                break;
            case "url":
                firstChild.href = value;
                break;
            case "src":
                firstChild.src = value;
                break;
            case "alt":
                firstChild.alt = value;
                break;
            case "sticker":
                firstChild.textContent = value;
                break;
            case "z-index":
                firstChild.style.zIndex = value;
                break;
            case "top":
                firstChild.style.top = value + "px";
                break;
            case "left":
                firstChild.style.left = value + "px";
                break;
            case "fontFamily":
                firstChild.style.fontFamily = value;
                break;
            case "fontStyle":
                firstChild.style.fontStyle = value;
                break;
            case "textDecoration":
                firstChild.style.textDecoration = value;
                break;
            case "textShadow":
                firstChild.style.textShadow = value;
                break;
            case "letterSpacing":
                firstChild.style.letterSpacing = value;
                break;
            case "lineHeight":
                firstChild.style.lineHeight = value;
                break;
            default:
                firstChild.style[property] = value;
                break;
        }

        this.saveState();
    }

    generateStickerOptions(currentValue) {
        const stickers = [
            "🎉",
            "✨",
            "🔥",
            "⭐",
            "❤️",
            "👍",
            "🎯",
            "💡",
            "🚀",
            "💎",
            "🎊",
            "🌟",
            "💯",
            "⚡",
            "🎁",
            "🏆",
            "🎈",
            "🎂",
            "🍀",
            "🌈",
            "🦄",
            "👑",
            "🎵",
            "⚽",
        ];

        return stickers
            .map(
                (sticker) => `
            <div class="sticker-option cursor-pointer text-center p-2 hover:bg-blue-100 rounded transition-all ${
                currentValue === sticker
                    ? "bg-blue-100 ring-2 ring-blue-400"
                    : ""
            }" 
                 data-sticker="${sticker}" onclick="mailBuilder.selectStickerInProperties('${sticker}')">
                ${sticker}
            </div>
        `
            )
            .join("");
    }

    selectStickerInProperties(sticker) {
        if (this.selectedElement) {
            const firstChild = this.selectedElement.firstElementChild;
            if (firstChild) {
                firstChild.textContent = sticker;

                // Update the visual selection in the properties panel
                document
                    .querySelectorAll(".sticker-option")
                    .forEach((option) => {
                        option.classList.remove(
                            "bg-blue-100",
                            "ring-2",
                            "ring-blue-400"
                        );
                    });

                document
                    .querySelector(`[data-sticker="${sticker}"]`)
                    .classList.add("bg-blue-100", "ring-2", "ring-blue-400");

                this.saveState();
                this.showNotification(`Sticker changed to ${sticker}`);
            }
        }
    }

    hidePropertiesPanel() {
        this.propertiesPanel.classList.add("hidden");
        document.querySelectorAll(".email-component.selected").forEach((el) => {
            el.classList.remove("selected");
        });
        this.selectedElement = null;
    }

    deleteSelectedElement() {
        if (this.selectedElement) {
            this.selectedElement.remove();
            this.hidePropertiesPanel();
            this.saveState();
            this.showNotification("Component deleted successfully!");
        }
    }

    handleCanvasClick(e) {
        if (e.target === this.canvas) {
            this.hidePropertiesPanel();
        }
    }

    loadTemplate(templateType) {
        if (!this.templates[templateType]) return;

        const template = this.templates[templateType];
        this.canvas.innerHTML = template.html;

        // Hide placeholder
        const placeholder = this.canvas.querySelector(".text-center");
        if (placeholder) {
            placeholder.style.display = "none";
        }

        // Make all components selectable and set up functionality
        this.canvas
            .querySelectorAll('[class*="email-"]')
            .forEach((element, index) => {
                const wrapper = document.createElement("div");
                wrapper.className = "email-component";
                wrapper.dataset.componentType =
                    this.detectComponentType(element);
                element.parentNode.insertBefore(wrapper, element);
                wrapper.appendChild(element);

                wrapper.addEventListener("click", (e) => {
                    e.stopPropagation();
                    this.selectElement(wrapper);
                });

                // Make loaded components draggable too
                this.makeComponentDraggable(wrapper);

                // If this is a droppable component, set up its functionality
                if (
                    element.classList.contains("droppable-container") ||
                    element.querySelector(".droppable-container")
                ) {
                    this.setupComponentDropFunctionality(wrapper);

                    // Ensure all droppable containers get tooltip functionality
                    const containers = wrapper.querySelectorAll(
                        ".droppable-container"
                    );
                    containers.forEach((container) => {
                        this.addContainerClickTooltip(container);
                    });

                    // Also check the element itself
                    if (element.classList.contains("droppable-container")) {
                        this.addContainerClickTooltip(element);
                    }
                }
            });

        this.saveState();
        this.showNotification(`${template.name} loaded successfully!`);
    }

    detectComponentType(element) {
        const classList = element.className;
        if (
            classList.includes("email-heading") ||
            element.tagName === "H1" ||
            element.tagName === "H2" ||
            element.tagName === "H3"
        ) {
            return "heading";
        } else if (
            classList.includes("email-text") ||
            element.tagName === "P"
        ) {
            return "text";
        } else if (
            classList.includes("email-button") ||
            element.tagName === "A"
        ) {
            return "button";
        } else if (
            classList.includes("email-image") ||
            element.tagName === "IMG"
        ) {
            return "image";
        } else if (
            classList.includes("email-container") ||
            classList.includes("email-row")
        ) {
            return "container";
        }
        return "text"; // default
    }

    saveTemplate() {
        const name = document.getElementById("template-name").value.trim();
        if (!name) {
            this.showNotification("Please enter a template name", "error");
            return;
        }

        // Get current CSRF token
        const csrfToken = this.getCsrfToken();
        if (!csrfToken) {
            this.showNotification(
                "CSRF token not found. Please refresh the page.",
                "error"
            );
            return;
        }

        const html = this.canvas.innerHTML;
        const css = this.generateCSS();

        // Collect enhanced template data if available
        const templateData = {
            name: name,
            html: html,
            css: css,
            config: this.getCanvasConfig(),
        };

        // Add enhanced data if new template modal was used
        const category = document.getElementById(
            "new-template-category"
        )?.value;
        const description = document.getElementById(
            "new-template-description"
        )?.value;
        const audience = document.getElementById(
            "new-template-audience"
        )?.value;
        const subject = document.getElementById("new-template-subject")?.value;

        if (category) templateData.category = category;
        if (description) templateData.description = description;
        if (audience) templateData.audience = audience;
        if (subject) templateData.subject = subject;

        // Collect template variables
        const variableRows = document.querySelectorAll(
            "#template-variables .flex"
        );
        const variables = [];
        variableRows.forEach((row) => {
            const inputs = row.querySelectorAll("input");
            if (inputs.length === 2 && inputs[0].value.trim()) {
                variables.push({
                    name: inputs[0].value.trim(),
                    default: inputs[1].value.trim(),
                });
            }
        });
        if (variables.length > 0) templateData.variables = variables;

        console.log("Saving template with CSRF token:", csrfToken);
        console.log("Template data:", templateData);

        fetch("/mail-template/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-CSRF-TOKEN": csrfToken,
                "X-Requested-With": "XMLHttpRequest",
            },
            credentials: "same-origin",
            body: JSON.stringify(templateData),
        })
            .then((response) => {
                console.log("Response status:", response.status);

                if (response.status === 419) {
                    throw new Error(
                        "CSRF token mismatch. Please refresh the page and try again."
                    );
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                return response.json();
            })
            .then((data) => {
                console.log("Save response:", data);
                if (data.success) {
                    this.showNotification("Template saved successfully!");
                    this.loadSavedTemplates();
                } else {
                    this.showNotification(
                        data.message || "Error saving template",
                        "error"
                    );
                }
            })
            .catch((error) => {
                console.error("Save error:", error);
                this.showNotification(`Error: ${error.message}`, "error");
            });
    }

    loadSavedTemplates(searchTerm = "", category = "") {
        fetch("/mail-template/templates", {
            headers: {
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((templates) => {
                const templatesList = document.getElementById("templates-list");
                if (!templatesList) return;

                // Filter templates based on search and category
                let filteredTemplates = templates;

                if (searchTerm) {
                    filteredTemplates = filteredTemplates.filter(
                        (template) =>
                            template.name.toLowerCase().includes(searchTerm) ||
                            (template.description &&
                                template.description
                                    .toLowerCase()
                                    .includes(searchTerm))
                    );
                }

                if (category) {
                    filteredTemplates = filteredTemplates.filter(
                        (template) => template.category === category
                    );
                }

                if (filteredTemplates.length === 0) {
                    templatesList.innerHTML = `
                    <div class="col-span-full text-center py-8">
                        <i class="fas fa-search text-gray-400 text-4xl mb-4"></i>
                        <p class="text-gray-500">No templates found</p>
                        ${
                            searchTerm || category
                                ? '<p class="text-sm text-gray-400 mt-2">Try adjusting your search or filters</p>'
                                : ""
                        }
                    </div>
                `;
                    return;
                }

                templatesList.innerHTML = filteredTemplates
                    .map(
                        (template) => `
                <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div class="flex items-start justify-between mb-3">
                        <div class="flex-1">
                            <h4 class="font-semibold text-gray-900 truncate">${
                                template.name
                            }</h4>
                            <div class="flex items-center mt-1 space-x-2">
                                <span class="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                    ${template.category || "Custom"}
                                </span>
                                <span class="text-xs text-gray-500">
                                    ${new Date(
                                        template.created_at
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        <div class="relative group">
                            <button class="text-gray-400 hover:text-gray-600 p-1">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                            <div class="absolute right-0 top-8 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <button onclick="mailBuilder.loadSavedTemplate('${
                                    template.id
                                }')" 
                                        class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                                    <i class="fas fa-folder-open mr-2 text-blue-500"></i>Load
                                </button>
                                <button onclick="mailBuilder.duplicateSavedTemplate('${
                                    template.id
                                }')" 
                                        class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                                    <i class="fas fa-copy mr-2 text-green-500"></i>Duplicate
                                </button>
                                <button onclick="mailBuilder.deleteSavedTemplate('${
                                    template.id
                                }')" 
                                        class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600">
                                    <i class="fas fa-trash mr-2"></i>Delete
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    ${
                        template.description
                            ? `
                        <p class="text-sm text-gray-600 mb-3 line-clamp-2">${template.description}</p>
                    `
                            : ""
                    }
                    
                    <div class="bg-gray-50 rounded-md p-3 mb-3">
                        <div class="text-xs text-gray-500 mb-1">Preview</div>
                        <div class="bg-white rounded border h-20 overflow-hidden">
                            <div class="transform scale-50 origin-top-left w-200 h-40" style="width: 200%; height: 200%;">
                                ${
                                    template.html
                                        ? template.html.substring(0, 500) +
                                          "..."
                                        : "No preview available"
                                }
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2 text-xs text-gray-500">
                            ${
                                template.audience
                                    ? `<span><i class="fas fa-users mr-1"></i>${template.audience}</span>`
                                    : ""
                            }
                            ${
                                template.subject
                                    ? `<span><i class="fas fa-envelope mr-1"></i>${template.subject.substring(
                                          0,
                                          20
                                      )}...</span>`
                                    : ""
                            }
                        </div>
                        <button onclick="mailBuilder.loadSavedTemplate('${
                            template.id
                        }')" 
                                class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">
                            Use Template
                        </button>
                    </div>
                </div>
            `
                    )
                    .join("");
            })
            .catch((error) => {
                console.error("Error loading templates:", error);
                const templatesList = document.getElementById("templates-list");
                if (templatesList) {
                    templatesList.innerHTML = `
                    <div class="col-span-full text-center py-8">
                        <i class="fas fa-exclamation-triangle text-red-400 text-4xl mb-4"></i>
                        <p class="text-red-600">Error loading templates</p>
                        <p class="text-sm text-gray-500 mt-2">${error.message}</p>
                    </div>
                `;
                }
            });
    }

    loadSavedTemplate(id) {
        fetch(`/mail-template/load/${id}`, {
            headers: {
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((template) => {
                this.canvas.innerHTML = template.html;
                document.getElementById("template-name").value = template.name;

                // Hide placeholder
                const placeholder = this.canvas.querySelector(".text-center");
                if (placeholder) {
                    placeholder.style.display = "none";
                }

                this.closeModals();
                this.showNotification(
                    `Template "${template.name}" loaded successfully!`
                );
            })
            .catch((error) => {
                console.error("Error loading template:", error);
                this.showNotification("Error loading template", "error");
            });
    }

    duplicateSavedTemplate(id) {
        fetch(`/mail-template/load/${id}`, {
            headers: {
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((template) => {
                // Load the template content
                this.canvas.innerHTML = template.html;
                document.getElementById(
                    "template-name"
                ).value = `${template.name} (Copy)`;

                // Hide placeholder
                const placeholder = this.canvas.querySelector(".text-center");
                if (placeholder) {
                    placeholder.style.display = "none";
                }

                this.closeModals();
                this.saveState();
                this.showNotification(
                    `Template "${template.name}" duplicated successfully!`
                );
            })
            .catch((error) => {
                console.error("Error duplicating template:", error);
                this.showNotification("Error duplicating template", "error");
            });
    }

    deleteSavedTemplate(id) {
        if (!confirm("Are you sure you want to delete this template?")) return;

        const csrfToken = this.getCsrfToken();

        fetch(`/mail-template/delete/${id}`, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "X-CSRF-TOKEN": csrfToken,
                "X-Requested-With": "XMLHttpRequest",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (data.success) {
                    this.showNotification("Template deleted successfully!");
                    this.loadSavedTemplates();
                }
            })
            .catch((error) => {
                console.error("Error deleting template:", error);
                this.showNotification("Error deleting template", "error");
            });
    }

    previewTemplate() {
        const html = this.canvas.innerHTML;
        const css = this.generateCSS();
        const csrfToken = this.getCsrfToken();

        const form = document.createElement("form");
        form.method = "POST";
        form.action = "/mail-template/preview";
        form.target = "_blank";

        const htmlInput = document.createElement("input");
        htmlInput.type = "hidden";
        htmlInput.name = "html";
        htmlInput.value = html;

        const cssInput = document.createElement("input");
        cssInput.type = "hidden";
        cssInput.name = "css";
        cssInput.value = css;

        const csrfInput = document.createElement("input");
        csrfInput.type = "hidden";
        csrfInput.name = "_token";
        csrfInput.value = csrfToken;

        form.appendChild(htmlInput);
        form.appendChild(cssInput);
        form.appendChild(csrfInput);

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }

    exportTemplate() {
        const html = this.canvas.innerHTML;
        const css = this.generateCSS();
        const name =
            document.getElementById("template-name").value || "mail-template";
        const csrfToken = this.getCsrfToken();

        const form = document.createElement("form");
        form.method = "POST";
        form.action = "/mail-template/export";

        const inputs = [
            { name: "html", value: html },
            { name: "css", value: css },
            { name: "name", value: name },
            { name: "_token", value: csrfToken },
        ];

        inputs.forEach((input) => {
            const element = document.createElement("input");
            element.type = "hidden";
            element.name = input.name;
            element.value = input.value;
            form.appendChild(element);
        });

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);

        this.showNotification("Template exported successfully!");
    }

    generateCSS() {
        // Generate CSS based on the current template
        return `
            .email-container { font-family: Arial, sans-serif; }
            .email-component { margin: 5px 0; }
            .placeholder-text { color: #9ca3af; font-style: italic; }
        `;
    }

    clearCanvas() {
        if (
            confirm(
                "Are you sure you want to clear the canvas? This will remove all components."
            )
        ) {
            this.canvas.innerHTML = `
                <div class="text-center text-gray-500 mt-32">
                    <i class="fas fa-mouse-pointer text-4xl mb-4"></i>
                    <p class="text-lg">Drag components here to start building your email template</p>
                    <p class="text-sm mt-2">Or choose from pre-built templates in the sidebar</p>
                </div>
            `;
            this.hidePropertiesPanel();
            document.getElementById("template-name").value = "";
            this.saveState();
            this.showNotification("Canvas cleared successfully!");
        }
    }

    changeDevice(device) {
        const container = document.getElementById("canvas-container");
        if (device === "mobile") {
            container.style.width = "375px";
        } else {
            container.style.width = "600px";
        }
    }

    changeZoom(zoom) {
        const container = document.getElementById("canvas-container");
        container.style.transform = `scale(${zoom})`;
        container.style.transformOrigin = "top center";
    }

    showLoadModal() {
        document.getElementById("load-modal").classList.remove("hidden");
        this.loadSavedTemplates();
    }

    showCodeModal() {
        const html = this.canvas.innerHTML;
        const css = this.generateCSS();

        document.getElementById("html-code").value = html;
        document.getElementById("css-code").value = css;
        document.getElementById("code-modal").classList.remove("hidden");
    }

    applyCodeChanges() {
        const html = document.getElementById("html-code").value;
        const css = document.getElementById("css-code").value;

        this.canvas.innerHTML = html;

        // Hide placeholder if content exists
        if (html.trim()) {
            const placeholder = this.canvas.querySelector(".text-center");
            if (placeholder) {
                placeholder.style.display = "none";
            }
        }

        this.closeModals();
        this.saveState();
        this.showNotification("Code changes applied successfully!");
    }

    closeModals() {
        document.querySelectorAll('[id$="-modal"]').forEach((modal) => {
            modal.classList.add("hidden");
        });
    }

    saveState() {
        const state = {
            html: this.canvas.innerHTML,
            timestamp: Date.now(),
        };

        // Remove future states if we're not at the end
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push(state);
        this.historyIndex++;

        // Keep only last 50 states
        if (this.history.length > 50) {
            this.history.shift();
            this.historyIndex--;
        }
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.canvas.innerHTML = this.history[this.historyIndex].html;
            this.showNotification("Undo successful");
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.canvas.innerHTML = this.history[this.historyIndex].html;
            this.showNotification("Redo successful");
        }
    }

    getCanvasConfig() {
        return {
            device: document.getElementById("device-selector").value,
            zoom: document.getElementById("zoom-selector").value,
        };
    }

    showNotification(message, type = "success") {
        const notification = document.getElementById("notification");
        const notificationText = document.getElementById("notification-text");

        notificationText.textContent = message;

        if (type === "error") {
            notification.className = notification.className.replace(
                "bg-green-600",
                "bg-red-600"
            );
        } else {
            notification.className = notification.className.replace(
                "bg-red-600",
                "bg-green-600"
            );
        }

        notification.classList.remove("translate-x-full");

        setTimeout(() => {
            notification.classList.add("translate-x-full");
        }, 3000);
    }

    // Advanced Drag and Drop System
    setupEnhancedDragAndDrop() {
        this.setupSidebarDragAndDrop();
        this.setupCanvasComponentDragAndDrop();
        this.setupCanvasDropHandling();
        this.setupNestedContainerDrops();
        this.setupComponentRepositioning();
        this.setupMultiSelect();
        this.setupKeyboardModifiers();
        this.createInsertIndicator();
    }

    setupSidebarDragAndDrop() {
        // Make component items draggable from sidebar
        document.querySelectorAll(".component-item").forEach((item) => {
            item.draggable = true;

            item.addEventListener("dragstart", (e) => {
                const componentType = item.dataset.component;
                e.dataTransfer.setData("text/plain", componentType);
                e.dataTransfer.setData("source", "sidebar");
                item.classList.add("opacity-50");

                this.dragMode = e.ctrlKey || e.metaKey ? "copy" : "move";

                // Create enhanced drag image
                const dragImage = this.createDragImage(item, componentType);
                e.dataTransfer.setDragImage(dragImage, 60, 30);

                // Clean up drag image
                setTimeout(() => {
                    if (document.body.contains(dragImage)) {
                        document.body.removeChild(dragImage);
                    }
                }, 0);
            });

            item.addEventListener("dragend", () => {
                item.classList.remove("opacity-50");
                this.resetDragState();
            });
        });
    }

    setupCanvasComponentDragAndDrop() {
        // Enable dragging of components within canvas
        this.canvas.addEventListener("mousedown", (e) =>
            this.handleCanvasMouseDown(e)
        );
        document.addEventListener("mousemove", (e) => this.handleMouseMove(e));
        document.addEventListener("mouseup", (e) => this.handleMouseUp(e));
    }

    setupCanvasDropHandling() {
        // Enhanced canvas drop zones
        this.canvas.addEventListener("dragover", (e) => {
            e.preventDefault();
            e.stopPropagation();

            const source = e.dataTransfer.types.includes("source")
                ? e.dataTransfer.getData("source")
                : "unknown";

            if (source === "sidebar") {
                e.dataTransfer.dropEffect = this.dragMode;
                this.canvas.classList.add("bg-blue-50", "border-blue-400");
                this.showAdvancedDropZones(e);
                this.handleAutoScroll(e);
            } else if (this.isDraggingFromCanvas) {
                e.dataTransfer.dropEffect = "move";
                this.showInsertIndicator(e);
            }
        });

        this.canvas.addEventListener("dragleave", (e) => {
            if (
                !this.canvas.contains(e.relatedTarget) &&
                e.relatedTarget !== this.canvas
            ) {
                this.hideDropZones();
                this.hideInsertIndicator();
                this.stopAutoScroll();
            }
        });

        this.canvas.addEventListener("drop", (e) => {
            e.preventDefault();
            e.stopPropagation();

            const source = e.dataTransfer.getData("source") || "sidebar";
            const componentType = e.dataTransfer.getData("text/plain");

            if (source === "sidebar" && componentType) {
                this.handleSidebarDrop(e, componentType);
            } else if (this.isDraggingFromCanvas) {
                this.handleCanvasComponentDrop(e);
            }

            this.resetDragState();
        });
    }

    setupMultiSelect() {
        // Multi-select with Ctrl/Cmd + Click
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                this.clearSelection();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === "a") {
                e.preventDefault();
                this.selectAllComponents();
            }
        });
    }

    setupKeyboardModifiers() {
        document.addEventListener("keydown", (e) => {
            if (e.ctrlKey || e.metaKey) {
                this.dragMode = "copy";
                this.updateCursorStyle("copy");
            } else if (e.shiftKey) {
                this.dragMode = "move";
                this.updateCursorStyle("move");
            }
        });

        document.addEventListener("keyup", (e) => {
            this.dragMode = "move";
            this.updateCursorStyle("default");
        });
    }

    createDragImage(item, componentType) {
        const dragImage = document.createElement("div");
        dragImage.className = "drag-image";
        dragImage.style.cssText = `
            position: absolute;
            top: -1000px;
            left: -1000px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            font-size: 14px;
            font-weight: 600;
            z-index: 10000;
            transform: rotate(-2deg);
            border: 2px solid rgba(255,255,255,0.2);
        `;

        dragImage.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <i class="${this.getComponentIcon(
                    componentType
                )}" style="font-size: 16px;"></i>
                <span>${
                    componentType.charAt(0).toUpperCase() +
                    componentType.slice(1)
                }</span>
                ${
                    this.dragMode === "copy"
                        ? '<i class="fas fa-copy" style="margin-left: 8px; opacity: 0.8;"></i>'
                        : ""
                }
            </div>
        `;

        document.body.appendChild(dragImage);
        return dragImage;
    }

    // Helper method to get component icons
    getComponentIcon(componentType) {
        const icons = {
            container: "fas fa-square",
            row: "fas fa-grip-lines",
            column: "fas fa-columns",
            grid: "fas fa-th",
            section: "fas fa-layer-group",
            heading: "fas fa-heading",
            text: "fas fa-paragraph",
            image: "fas fa-image",
            button: "fas fa-hand-pointer",
            list: "fas fa-list",
            table: "fas fa-table",
            header: "fas fa-window-maximize",
            footer: "fas fa-window-minimize",
            social: "fas fa-share-alt",
            divider: "fas fa-minus",
            spacer: "fas fa-arrows-alt-v",
            card: "fas fa-id-card",
            banner: "fas fa-flag",
            sticker: "fas fa-star",
            imageUpload: "fas fa-upload",
            signature: "fas fa-signature",
        };
        return icons[componentType] || "fas fa-cube";
    }

    setupStickerGallery() {
        // Add event listeners to sticker previews
        document.querySelectorAll(".sticker-preview").forEach((preview) => {
            preview.addEventListener("click", (e) => {
                const stickerEmoji = preview.dataset.sticker;
                this.setSelectedSticker(stickerEmoji);
                this.highlightSelectedSticker(preview);
            });
        });
    }

    setSelectedSticker(emoji) {
        this.selectedSticker = emoji;
        // Update the main sticker component template
        this.components.sticker.html = `<div class="email-sticker" style="display: inline-block; font-size: 48px; margin: 10px; cursor: move; user-select: none; position: relative; z-index: 5;">${emoji}</div>`;
    }

    highlightSelectedSticker(selectedPreview) {
        // Remove highlight from all previews
        document.querySelectorAll(".sticker-preview").forEach((preview) => {
            preview.classList.remove("bg-blue-100", "ring-2", "ring-blue-400");
        });

        // Highlight selected preview
        selectedPreview.classList.add("bg-blue-100", "ring-2", "ring-blue-400");

        this.showNotification(
            `Selected sticker: ${selectedPreview.dataset.sticker}`
        );
    }

    setupComponentRepositioning() {
        // Enhanced repositioning with drag and drop between containers
        document.addEventListener("dragstart", (e) => {
            const component = e.target.closest(".email-component");
            if (component && !e.target.closest(".component-item")) {
                this.draggedComponent = component;
                this.isDraggingFromCanvas = true;

                // Add visual feedback
                component.style.opacity = "0.5";
                component.style.transform = "rotate(2deg) scale(0.95)";

                // Set drag data
                e.dataTransfer.setData("text/plain", "component-reposition");
                e.dataTransfer.setData("source", "canvas-component");
                e.dataTransfer.effectAllowed = "move";

                this.showNotification("Drag to reposition component", "info");
            }
        });

        document.addEventListener("dragend", (e) => {
            const component = e.target.closest(".email-component");
            if (component && this.isDraggingFromCanvas) {
                // Reset visual feedback
                component.style.opacity = "";
                component.style.transform = "";

                this.draggedComponent = null;
                this.isDraggingFromCanvas = false;
            }
        });
    }

    showAdvancedDropZones(e) {
        const dropZones = document.getElementById("drop-zones");
        if (!dropZones) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Apply snap to grid if enabled
        let finalX = x,
            finalY = y;
        if (this.snapEnabled) {
            const gridSize = 20;
            finalX = Math.round(x / gridSize) * gridSize;
            finalY = Math.round(y / gridSize) * gridSize;
        }

        // Find nearest component for insertion
        const nearestComponent = this.findNearestComponent(finalX, finalY);
        const insertPosition = nearestComponent
            ? this.getInsertPosition(nearestComponent, finalY)
            : "end";

        // Create multiple drop zone indicators
        dropZones.innerHTML = this.createDropZoneHTML(
            finalX,
            finalY,
            insertPosition
        );
    }

    createDropZoneHTML(x, y, insertPosition) {
        const indicatorX = Math.max(
            10,
            Math.min(x - 60, this.canvas.offsetWidth - 130)
        );
        const indicatorY = Math.max(
            10,
            Math.min(y - 30, this.canvas.offsetHeight - 70)
        );

        return `
            <!-- Main drop indicator -->
            <div class="absolute border-2 border-dashed border-blue-500 bg-blue-100 bg-opacity-80 rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg"
                 style="left: ${indicatorX}px; top: ${indicatorY}px; width: 120px; height: 60px; z-index: 15;">
                <div class="text-center">
                    <div class="text-blue-600 text-xs font-bold">Drop ${
                        this.dragMode === "copy" ? "Copy" : "Here"
                    }</div>
                    <div class="text-blue-500 text-xs mt-1">${insertPosition}</div>
                </div>
            </div>
            
            <!-- Insertion line indicator -->
            ${
                insertPosition !== "end"
                    ? `
                <div class="absolute border-t-2 border-green-500 bg-green-200 transition-all duration-200"
                     style="left: 20px; right: 20px; top: ${
                         indicatorY + (insertPosition === "before" ? -2 : 62)
                     }px; height: 4px; z-index: 16; border-radius: 2px;">
                </div>
            `
                    : ""
            }
            
            <!-- Corner guidelines -->
            ${this.gridEnabled ? this.createGridGuidelines(x, y) : ""}
        `;
    }

    createGridGuidelines(x, y) {
        const gridSize = 20;
        const snappedX = Math.round(x / gridSize) * gridSize;
        const snappedY = Math.round(y / gridSize) * gridSize;

        return `
            <div class="absolute border-l border-purple-400 border-dashed opacity-60"
                 style="left: ${snappedX}px; top: 0; bottom: 0; width: 1px; z-index: 12;">
            </div>
            <div class="absolute border-t border-purple-400 border-dashed opacity-60"
                 style="top: ${snappedY}px; left: 0; right: 0; height: 1px; z-index: 12;">
            </div>
        `;
    }

    findNearestComponent(x, y) {
        const components = this.canvas.querySelectorAll(".email-component");
        let nearest = null;
        let minDistance = Infinity;

        components.forEach((component) => {
            const rect = component.getBoundingClientRect();
            const canvasRect = this.canvas.getBoundingClientRect();
            const centerX = rect.left - canvasRect.left + rect.width / 2;
            const centerY = rect.top - canvasRect.top + rect.height / 2;

            const distance = Math.sqrt(
                Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
            );

            if (distance < minDistance) {
                minDistance = distance;
                nearest = component;
            }
        });

        return nearest;
    }

    getInsertPosition(component, dropY) {
        const rect = component.getBoundingClientRect();
        const canvasRect = this.canvas.getBoundingClientRect();
        const componentY = rect.top - canvasRect.top;
        const componentCenter = componentY + rect.height / 2;

        return dropY < componentCenter ? "before" : "after";
    }

    handleSidebarDrop(e, componentType) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Apply snap to grid if enabled
        let finalX = x,
            finalY = y;
        if (this.snapEnabled) {
            const gridSize = 20;
            finalX = Math.round(x / gridSize) * gridSize;
            finalY = Math.round(y / gridSize) * gridSize;
        }

        // Find insertion point
        const nearestComponent = this.findNearestComponent(finalX, finalY);

        if (nearestComponent) {
            const insertPosition = this.getInsertPosition(
                nearestComponent,
                finalY
            );
            this.insertComponentRelativeTo(
                componentType,
                nearestComponent,
                insertPosition
            );
        } else {
            this.addComponent(componentType, { x: finalX, y: finalY });
        }

        this.canvas.classList.remove("bg-blue-50", "border-blue-400");
        this.hideDropZones();
    }

    insertComponentRelativeTo(componentType, referenceComponent, position) {
        if (!this.components[componentType]) return;

        const component = this.components[componentType];
        const element = document.createElement("div");
        element.className = "email-component";
        element.dataset.componentType = componentType;
        element.innerHTML = component.html;
        element.id = `component-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`;

        // Add click handler
        element.addEventListener("click", (e) => {
            e.stopPropagation();
            this.selectElement(element);
        });

        // Insert at correct position
        if (position === "before") {
            referenceComponent.parentNode.insertBefore(
                element,
                referenceComponent
            );
        } else if (position === "after") {
            if (referenceComponent.nextSibling) {
                referenceComponent.parentNode.insertBefore(
                    element,
                    referenceComponent.nextSibling
                );
            } else {
                referenceComponent.parentNode.appendChild(element);
            }
        }

        // Clear placeholder if exists
        const placeholder = this.canvas.querySelector(".text-center");
        if (placeholder) {
            placeholder.style.display = "none";
        }

        this.selectElement(element);
        this.saveState();
        this.showNotification(
            `${componentType} component inserted ${position} existing component!`
        );
        mailBuilder.forceSetupAllContainers();
    }

    handleAutoScroll(e) {
        const canvas = this.canvas;
        const rect = canvas.getBoundingClientRect();
        const scrollThreshold = 50;
        const scrollSpeed = 10;

        const nearTop = e.clientY - rect.top < scrollThreshold;
        const nearBottom = rect.bottom - e.clientY < scrollThreshold;
        const nearLeft = e.clientX - rect.left < scrollThreshold;
        const nearRight = rect.right - e.clientX < scrollThreshold;

        if (nearTop || nearBottom || nearLeft || nearRight) {
            if (!this.autoScrollInterval) {
                this.autoScrollInterval = setInterval(() => {
                    if (nearTop) canvas.scrollTop -= scrollSpeed;
                    if (nearBottom) canvas.scrollTop += scrollSpeed;
                    if (nearLeft) canvas.scrollLeft -= scrollSpeed;
                    if (nearRight) canvas.scrollLeft += scrollSpeed;
                }, 16);
            }
        } else {
            this.stopAutoScroll();
        }
    }

    stopAutoScroll() {
        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
            this.autoScrollInterval = null;
        }
    }

    createInsertIndicator() {
        this.insertIndicator = document.createElement("div");
        this.insertIndicator.className = "insert-indicator";
        this.insertIndicator.style.cssText = `
            position: absolute;
            background: linear-gradient(90deg, #10b981, #059669);
            height: 4px;
            border-radius: 2px;
            box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
            opacity: 0;
            transition: all 0.2s ease;
            z-index: 20;
            pointer-events: none;
        `;
        document.body.appendChild(this.insertIndicator);
    }

    showInsertIndicator(e) {
        if (!this.insertIndicator) return;

        const rect = this.canvas.getBoundingClientRect();
        const y = e.clientY - rect.top;

        this.insertIndicator.style.left = rect.left + 20 + "px";
        this.insertIndicator.style.top = rect.top + y - 2 + "px";
        this.insertIndicator.style.width = rect.width - 40 + "px";
        this.insertIndicator.style.opacity = "1";
    }

    hideInsertIndicator() {
        if (this.insertIndicator) {
            this.insertIndicator.style.opacity = "0";
        }
    }

    updateCursorStyle(mode) {
        const cursor =
            mode === "copy" ? "copy" : mode === "move" ? "move" : "default";
        document.body.style.cursor = cursor;
    }

    setupNestedContainerDrops() {
        // Set up nested container drop functionality
        document.addEventListener("dragover", (e) => {
            const droppableContainer = e.target.closest(".droppable-container");
            if (droppableContainer) {
                const source = e.dataTransfer.types.includes("source")
                    ? null
                    : "unknown";

                // Allow highlighting for both sidebar components and canvas repositioning
                if (
                    !this.isDraggingFromCanvas ||
                    (this.isDraggingFromCanvas && this.draggedComponent)
                ) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.highlightDropContainer(droppableContainer);
                }
            }
        });

        document.addEventListener("dragleave", (e) => {
            const droppableContainer = e.target.closest(".droppable-container");
            if (
                droppableContainer &&
                !droppableContainer.contains(e.relatedTarget)
            ) {
                this.removeDropContainerHighlight(droppableContainer);
            }
        });

        document.addEventListener("drop", (e) => {
            const droppableContainer = e.target.closest(".droppable-container");
            if (droppableContainer) {
                e.preventDefault();
                e.stopPropagation();

                const componentType = e.dataTransfer.getData("text/plain");
                const source = e.dataTransfer.getData("source");

                if (
                    source === "sidebar" &&
                    componentType &&
                    !this.isDraggingFromCanvas
                ) {
                    this.addComponentToContainer(
                        componentType,
                        droppableContainer
                    );
                    this.removeDropContainerHighlight(droppableContainer);
                } else if (
                    source === "canvas-component" &&
                    this.draggedComponent
                ) {
                    this.repositionComponentToContainer(
                        this.draggedComponent,
                        droppableContainer
                    );
                    this.removeDropContainerHighlight(droppableContainer);
                }
            }
        });
    }

    highlightDropContainer(container) {
        // Remove highlights from other containers
        document.querySelectorAll(".droppable-container").forEach((c) => {
            c.classList.remove("drop-highlight");
        });

        // Add highlight to current container
        container.classList.add("drop-highlight");

        // Add styles if not already added
        if (!document.getElementById("drop-container-styles")) {
            const style = document.createElement("style");
            style.id = "drop-container-styles";
            style.textContent = `
                .droppable-container.drop-highlight {
                    background-color: rgba(59, 130, 246, 0.1) !important;
                    border: 2px dashed #3b82f6 !important;
                    transition: all 0.2s ease !important;
                }
                .droppable-container.drop-highlight .placeholder-text {
                    color: #3b82f6 !important;
                    font-weight: 600 !important;
                    animation: pulse 1s infinite !important;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                .droppable-container {
                    transition: all 0.2s ease;
                }
                .droppable-container:hover {
                    border-color: #93c5fd;
                }
            `;
            document.head.appendChild(style);
        }
    }

    removeDropContainerHighlight(container) {
        container.classList.remove("drop-highlight");
    }

    // Modified addComponentToContainer method
    addComponentToContainer(componentType, targetContainer) {
        if (!this.components[componentType]) {
            console.warn(`Component type "${componentType}" not found`);
            return;
        }

        if (this.isAddingComponent) {
            return;
        }

        this.isAddingComponent = true;

        try {
            const component = this.components[componentType];
            const element = document.createElement("div");
            element.className = "email-component nested-component";
            element.dataset.componentType = componentType;
            element.innerHTML = component.html;
            element.id = `component-${Date.now()}-${Math.random()
                .toString(36)
                .substr(2, 9)}`;

            // Make component selectable
            element.addEventListener("click", (e) => {
                e.stopPropagation();
                this.selectElement(element);
            });

            this.makeComponentDraggable(element);

            // Clear placeholder
            const placeholder =
                targetContainer.querySelector(".placeholder-text");
            if (placeholder) {
                placeholder.style.display = "none";
            }

            targetContainer.appendChild(element);

            // IMMEDIATE setup for droppable components
            if (component.droppable) {
                console.log(
                    "🔧 Setting up nested droppable component immediately:",
                    componentType
                );

                this.setupComponentDropFunctionality(element);
                this.setupContainersInElement(element);

                console.log("✅ Nested droppable component setup complete");
            }

            // Handle other component types
            if (componentType === "heading") {
                this.setupHeadingFunctionality(element);
            }

            if (componentType === "text") {
                this.setupTextFunctionality(element);
            }

            if (componentType === "signature") {
                this.setupSignatureFunctionality(element);
            }

            if (
                component.draggable &&
                (componentType === "sticker" || componentType === "imageUpload")
            ) {
                this.setupFreeDragging(element);
            }

            if (componentType === "imageUpload") {
                this.setupImageUpload(element);
            }

            this.selectElement(element);
            this.saveState();
            this.showNotification(
                `${componentType} added to container successfully!`
            );

            console.log(`✅ Successfully added ${componentType} to container`);
        } catch (error) {
            console.error("Error adding component to container:", error);
            this.showNotification(
                `Error adding ${componentType} to container`,
                "error"
            );
        } finally {
            this.isAddingComponent = false;
        }
    }

    setupComponentDropFunctionality(element) {
        console.log("Setting up drop functionality for:", element);

        // Find all droppable containers and set them up immediately
        const droppableContainers = element.querySelectorAll(
            ".droppable-container"
        );
        console.log(
            `Found ${droppableContainers.length} droppable containers in component`
        );

        droppableContainers.forEach((container, index) => {
            console.log(`Setting up drop container ${index + 1}`);

            // Add tooltip functionality immediately
            this.addContainerClickTooltip(container);

            // Add drag and drop event listeners
            container.addEventListener("dragover", (e) => {
                if (!this.isDraggingFromCanvas) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.highlightDropContainer(container);
                }
            });

            container.addEventListener("dragleave", (e) => {
                if (!container.contains(e.relatedTarget)) {
                    this.removeDropContainerHighlight(container);
                }
            });

            container.addEventListener("drop", (e) => {
                if (!this.isDraggingFromCanvas) {
                    e.preventDefault();
                    e.stopPropagation();

                    const componentType = e.dataTransfer.getData("text/plain");
                    const source = e.dataTransfer.getData("source");

                    if (source === "sidebar" && componentType) {
                        this.addComponentToContainer(componentType, container);
                        this.removeDropContainerHighlight(container);
                    }
                }
            });
        });

        // Also check if the main element is droppable
        if (element.classList.contains("droppable-container")) {
            console.log("Main element is droppable, setting up");
            this.addContainerClickTooltip(element);
        }

        // Check first child
        const firstChild = element.firstElementChild;
        if (
            firstChild &&
            firstChild.classList.contains("droppable-container")
        ) {
            console.log("First child is droppable, setting up");
            this.addContainerClickTooltip(firstChild);
        }
    }

    resetDragState() {
        this.canvas.classList.remove("bg-blue-50", "border-blue-400");
        this.hideDropZones();
        this.hideInsertIndicator();
        this.stopAutoScroll();
        this.draggedElement = null;
        this.isDraggingFromCanvas = false;
        this.updateCursorStyle("default");

        // Remove container highlights
        document
            .querySelectorAll(".droppable-container")
            .forEach((container) => {
                this.removeDropContainerHighlight(container);
            });
    }

    showDropZones(e) {
        const dropZones = document.getElementById("drop-zones");
        if (!dropZones) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Apply snap to grid if enabled
        let finalX = x,
            finalY = y;
        if (this.snapEnabled) {
            const gridSize = 20;
            finalX = Math.round(x / gridSize) * gridSize;
            finalY = Math.round(y / gridSize) * gridSize;
        }

        // Create visual drop zone indicator
        const indicatorX = Math.max(5, Math.min(finalX - 50, rect.width - 105));
        const indicatorY = Math.max(5, Math.min(finalY - 25, rect.height - 55));

        dropZones.innerHTML = `
            <div class="absolute border-2 border-dashed border-blue-500 bg-blue-100 bg-opacity-70 rounded-lg transition-all duration-200 flex items-center justify-center"
                 style="left: ${indicatorX}px; top: ${indicatorY}px; width: 100px; height: 50px; z-index: 10;">
                <div class="text-blue-600 text-xs font-medium">Drop here</div>
            </div>
        `;
    }

    hideDropZones() {
        const dropZones = document.getElementById("drop-zones");
        if (dropZones) {
            dropZones.innerHTML = "";
        }
    }

    // New Template Modal
    showNewTemplateModal() {
        document
            .getElementById("new-template-modal")
            .classList.remove("hidden");
        document.getElementById("new-template-name").focus();
    }

    createNewTemplate(e) {
        e.preventDefault();

        const name = document.getElementById("new-template-name").value.trim();
        const category = document.getElementById("new-template-category").value;
        const description = document
            .getElementById("new-template-description")
            .value.trim();
        const audience = document
            .getElementById("new-template-audience")
            .value.trim();
        const subject = document
            .getElementById("new-template-subject")
            .value.trim();

        if (!name) {
            this.showNotification("Template name is required", "error");
            return;
        }

        // Clear canvas and apply selected layout
        this.clearCanvas();
        this.applyLayout(this.selectedLayout);

        // Set template name
        document.getElementById("template-name").value = name;

        this.closeModals();
        this.showNotification(`Template "${name}" created successfully!`);
        this.saveState();
    }

    addTemplateVariable() {
        const container = document.getElementById("template-variables");
        const variableRow = document.createElement("div");
        variableRow.className = "flex items-center space-x-2";
        variableRow.innerHTML = `
            <input type="text" placeholder="Variable name (e.g., user_name)" 
                   class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <input type="text" placeholder="Default value" 
                   class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <button type="button" class="remove-variable text-red-500 hover:text-red-700">
                <i class="fas fa-times"></i>
            </button>
        `;

        variableRow
            .querySelector(".remove-variable")
            .addEventListener("click", () => {
                variableRow.remove();
            });

        container.appendChild(variableRow);
    }

    selectLayout(layout) {
        document.querySelectorAll(".template-layout").forEach((el) => {
            el.classList.remove("border-blue-500", "bg-blue-50");
            el.classList.add("border-gray-200");
        });

        document
            .querySelector(`[data-layout="${layout}"]`)
            .classList.remove("border-gray-200");
        document
            .querySelector(`[data-layout="${layout}"]`)
            .classList.add("border-blue-500", "bg-blue-50");

        this.selectedLayout = layout;
    }

    applyLayout(layout) {
        switch (layout) {
            case "basic":
                this.addComponent("header");
                this.addComponent("text");
                this.addComponent("button");
                this.addComponent("footer");
                break;
            case "advanced":
                this.addComponent("header");
                this.addComponent("row");
                this.addComponent("grid");
                this.addComponent("divider");
                this.addComponent("footer");
                break;
            default:
                // Blank canvas - do nothing
                break;
        }
    }

    // Enhanced Toolbar Functions
    toggleGrid() {
        this.gridEnabled = !this.gridEnabled;
        const gridOverlay = document.getElementById("grid-overlay");
        const button = document.getElementById("grid-toggle");

        if (this.gridEnabled) {
            this.createGrid();
            gridOverlay.classList.remove("hidden");
            button.classList.add("bg-blue-100", "text-blue-600");
        } else {
            gridOverlay.classList.add("hidden");
            button.classList.remove("bg-blue-100", "text-blue-600");
        }
    }

    createGrid() {
        const gridOverlay = document.getElementById("grid-overlay");
        const gridSize = 20;

        gridOverlay.innerHTML = "";
        gridOverlay.style.backgroundImage = `
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
        `;
        gridOverlay.style.backgroundSize = `${gridSize}px ${gridSize}px`;
    }

    toggleSnap() {
        this.snapEnabled = !this.snapEnabled;
        const button = document.getElementById("snap-toggle");

        if (this.snapEnabled) {
            button.classList.add("bg-blue-100", "text-blue-600");
            this.showNotification("Snap to grid enabled");
        } else {
            button.classList.remove("bg-blue-100", "text-blue-600");
            this.showNotification("Snap to grid disabled");
        }
    }

    toggleRulers() {
        this.rulersEnabled = !this.rulersEnabled;
        const hRuler = document.getElementById("ruler-horizontal");
        const vRuler = document.getElementById("ruler-vertical");
        const button = document.getElementById("rulers-toggle");

        if (this.rulersEnabled) {
            hRuler.classList.remove("hidden");
            vRuler.classList.remove("hidden");
            button.classList.add("bg-blue-100", "text-blue-600");
            this.createRulers();
        } else {
            hRuler.classList.add("hidden");
            vRuler.classList.add("hidden");
            button.classList.remove("bg-blue-100", "text-blue-600");
        }
    }

    createRulers() {
        const hRuler = document.getElementById("ruler-horizontal");
        const vRuler = document.getElementById("ruler-vertical");

        // Create horizontal ruler marks
        let hMarks = "";
        for (let i = 0; i < 800; i += 50) {
            hMarks += `<div class="absolute border-l border-gray-400 h-2" style="left: ${i}px; top: 18px;"></div>`;
            hMarks += `<span class="absolute text-xs text-gray-600" style="left: ${
                i + 2
            }px; top: 2px;">${i}</span>`;
        }
        hRuler.innerHTML = hMarks;

        // Create vertical ruler marks
        let vMarks = "";
        for (let i = 0; i < 1000; i += 50) {
            vMarks += `<div class="absolute border-t border-gray-400 w-2" style="top: ${i}px; left: 18px;"></div>`;
            vMarks += `<span class="absolute text-xs text-gray-600 transform -rotate-90 origin-center" style="top: ${
                i + 2
            }px; left: 2px;">${i}</span>`;
        }
        vRuler.innerHTML = vMarks;
    }

    copyComponent() {
        if (this.selectedElement) {
            this.clipboard = this.selectedElement.cloneNode(true);
            this.showNotification("Component copied to clipboard");
        } else {
            this.showNotification("Please select a component to copy", "error");
        }
    }

    pasteComponent() {
        if (this.clipboard) {
            const newElement = this.clipboard.cloneNode(true);
            newElement.classList.remove("selected");

            // Add event listeners to the new element
            newElement.addEventListener("click", (e) => {
                e.stopPropagation();
                this.selectElement(newElement);
            });

            this.canvas.appendChild(newElement);
            this.selectElement(newElement);
            this.saveState();
            this.showNotification("Component pasted successfully");
        } else {
            this.showNotification("No component in clipboard", "error");
        }
    }

    duplicateComponent() {
        if (this.selectedElement) {
            this.copyComponent();
            this.pasteComponent();
        } else {
            this.showNotification(
                "Please select a component to duplicate",
                "error"
            );
        }
    }

    alignComponent(alignment) {
        if (this.selectedElement) {
            const firstChild = this.selectedElement.firstElementChild;
            if (firstChild) {
                firstChild.style.textAlign = alignment;
                this.saveState();
                this.showNotification(`Component aligned ${alignment}`);
            }
        } else {
            this.showNotification(
                "Please select a component to align",
                "error"
            );
        }
    }

    // Enhanced Load Modal
    filterTemplates() {
        const search = document
            .getElementById("template-search")
            .value.toLowerCase();
        const category = document.getElementById(
            "template-filter-category"
        ).value;

        // This would filter the templates in the loadSavedTemplates method
        this.loadSavedTemplates(search, category);
    }

    // Enhanced Code Modal
    formatCode() {
        const htmlCode = document.getElementById("html-code").value;
        const cssCode = document.getElementById("css-code").value;

        // Basic formatting (you could integrate a proper formatter here)
        const formattedHTML = this.formatHTML(htmlCode);
        const formattedCSS = this.formatCSS(cssCode);

        document.getElementById("html-code").value = formattedHTML;
        document.getElementById("css-code").value = formattedCSS;

        this.showNotification("Code formatted successfully");
    }

    formatHTML(html) {
        // Basic HTML formatting
        return html
            .replace(/></g, ">\n<")
            .replace(/^\s+|\s+$/g, "")
            .split("\n")
            .map(
                (line, index) =>
                    "  ".repeat(Math.max(0, index % 4)) + line.trim()
            )
            .join("\n");
    }

    formatCSS(css) {
        // Basic CSS formatting
        return css
            .replace(/;/g, ";\n  ")
            .replace(/{/g, " {\n  ")
            .replace(/}/g, "\n}\n")
            .replace(/^\s+|\s+$/g, "");
    }

    // Enhanced device change
    changeDevice(device) {
        const container = document.getElementById("canvas-container");

        switch (device) {
            case "mobile":
                container.style.width = "375px";
                break;
            case "tablet":
                container.style.width = "768px";
                break;
            default:
                container.style.width = "600px";
                break;
        }

        this.showNotification(`Switched to ${device} view`);
    }

    // Advanced Canvas Component Interaction
    handleCanvasMouseDown(e) {
        const component = e.target.closest(".email-component");
        if (!component) return;

        // Check if Ctrl/Cmd is held for multi-select
        if (e.ctrlKey || e.metaKey) {
            this.toggleComponentSelection(component);
            return;
        }

        // Check if Shift is held for range selection
        if (e.shiftKey && this.selectedComponents.size > 0) {
            this.selectComponentRange(component);
            return;
        }

        // Single selection
        this.selectElement(component);

        // Prepare for potential drag
        this.draggedElement = component;
        this.dragStartPosition = { x: e.clientX, y: e.clientY };
        this.isDraggingFromCanvas = false;
    }

    handleMouseMove(e) {
        if (!this.draggedElement || !this.dragStartPosition) return;

        const deltaX = Math.abs(e.clientX - this.dragStartPosition.x);
        const deltaY = Math.abs(e.clientY - this.dragStartPosition.y);

        // Start dragging if moved enough
        if (!this.isDraggingFromCanvas && (deltaX > 5 || deltaY > 5)) {
            this.startCanvasComponentDrag(e);
        }

        if (this.isDraggingFromCanvas) {
            this.updateComponentDragPosition(e);
        }
    }

    handleMouseUp(e) {
        if (this.isDraggingFromCanvas) {
            this.finishCanvasComponentDrag(e);
        }

        this.draggedElement = null;
        this.dragStartPosition = null;
        this.isDraggingFromCanvas = false;
    }

    startCanvasComponentDrag(e) {
        this.isDraggingFromCanvas = true;
        this.draggedElement.style.opacity = "0.7";
        this.draggedElement.style.transform = "rotate(2deg) scale(0.95)";
        this.draggedElement.style.zIndex = "1000";
        this.draggedElement.style.pointerEvents = "none";

        // Show visual feedback
        this.showNotification("Drag to reorder component", "info");
    }

    updateComponentDragPosition(e) {
        // This could update visual indicators for where the component will be dropped
        const rect = this.canvas.getBoundingClientRect();
        const y = e.clientY - rect.top;
        this.showInsertIndicator(e);
    }

    finishCanvasComponentDrag(e) {
        this.draggedElement.style.opacity = "";
        this.draggedElement.style.transform = "";
        this.draggedElement.style.zIndex = "";
        this.draggedElement.style.pointerEvents = "";

        this.hideInsertIndicator();
        this.saveState();
        this.showNotification("Component reordered successfully!");
    }

    handleCanvasComponentDrop(e) {
        const rect = this.canvas.getBoundingClientRect();
        const y = e.clientY - rect.top;

        // Find where to insert the dragged component
        const components = Array.from(
            this.canvas.querySelectorAll(".email-component")
        );
        const draggedIndex = components.indexOf(this.draggedElement);

        // Find insertion point
        let insertIndex = components.length;
        for (let i = 0; i < components.length; i++) {
            const compRect = components[i].getBoundingClientRect();
            const compY = compRect.top - rect.top + compRect.height / 2;

            if (y < compY && i !== draggedIndex) {
                insertIndex = i;
                break;
            }
        }

        // Reorder the component
        if (insertIndex !== draggedIndex && insertIndex !== draggedIndex + 1) {
            const nextSibling =
                insertIndex < components.length
                    ? components[insertIndex]
                    : null;
            if (nextSibling) {
                this.canvas.insertBefore(this.draggedElement, nextSibling);
            } else {
                this.canvas.appendChild(this.draggedElement);
            }
        }
    }

    // Multi-Selection Methods
    toggleComponentSelection(component) {
        if (this.selectedComponents.has(component)) {
            this.selectedComponents.delete(component);
            component.classList.remove("multi-selected");
        } else {
            this.selectedComponents.add(component);
            component.classList.add("multi-selected");
        }

        this.updateMultiSelectStyles();
    }

    selectComponentRange(endComponent) {
        const components = Array.from(
            this.canvas.querySelectorAll(".email-component")
        );
        const selectedArray = Array.from(this.selectedComponents);

        if (selectedArray.length === 0) return;

        const startComponent = selectedArray[selectedArray.length - 1];
        const startIndex = components.indexOf(startComponent);
        const endIndex = components.indexOf(endComponent);

        const minIndex = Math.min(startIndex, endIndex);
        const maxIndex = Math.max(startIndex, endIndex);

        // Clear current selection
        this.clearSelection();

        // Select range
        for (let i = minIndex; i <= maxIndex; i++) {
            this.selectedComponents.add(components[i]);
            components[i].classList.add("multi-selected");
        }

        this.updateMultiSelectStyles();
    }

    selectAllComponents() {
        this.clearSelection();
        const components = this.canvas.querySelectorAll(".email-component");

        components.forEach((component) => {
            this.selectedComponents.add(component);
            component.classList.add("multi-selected");
        });

        this.updateMultiSelectStyles();
        this.showNotification(`Selected ${components.length} components`);
    }

    clearSelection() {
        this.selectedComponents.forEach((component) => {
            component.classList.remove("multi-selected");
        });
        this.selectedComponents.clear();
        this.updateMultiSelectStyles();
    }

    updateMultiSelectStyles() {
        // Add multi-select styles if not already added
        if (!document.getElementById("multi-select-styles")) {
            const style = document.createElement("style");
            style.id = "multi-select-styles";
            style.textContent = `
                .email-component.multi-selected {
                    outline: 2px solid #f59e0b !important;
                    outline-offset: 2px !important;
                    background: rgba(245, 158, 11, 0.1) !important;
                }
                .email-component.multi-selected::before {
                    content: '';
                    position: absolute;
                    top: -6px;
                    left: -6px;
                    width: 12px;
                    height: 12px;
                    background: #f59e0b;
                    border-radius: 50%;
                    border: 2px solid white;
                    z-index: 10;
                }
            `;
            document.head.appendChild(style);
        }

        // Update properties panel if multiple components selected
        if (this.selectedComponents.size > 1) {
            this.showMultiSelectProperties();
        }
    }

    showMultiSelectProperties() {
        const content = document.getElementById("properties-content");
        content.innerHTML = `
            <h3 class="text-lg font-semibold mb-4">Multiple Components (${this.selectedComponents.size})</h3>
            
            <div class="space-y-4">
                <div class="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <h4 class="font-medium text-orange-800 mb-2">Bulk Actions</h4>
                    <div class="grid grid-cols-2 gap-2">
                        <button onclick="mailBuilder.alignSelectedComponents('left')" 
                                class="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded text-sm">
                            <i class="fas fa-align-left mr-1"></i> Align Left
                        </button>
                        <button onclick="mailBuilder.alignSelectedComponents('center')" 
                                class="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded text-sm">
                            <i class="fas fa-align-center mr-1"></i> Center
                        </button>
                        <button onclick="mailBuilder.alignSelectedComponents('right')" 
                                class="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded text-sm">
                            <i class="fas fa-align-right mr-1"></i> Align Right
                        </button>
                        <button onclick="mailBuilder.distributeSelectedComponents()" 
                                class="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded text-sm">
                            <i class="fas fa-arrows-alt-h mr-1"></i> Distribute
                        </button>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 gap-2">
                    <button onclick="mailBuilder.groupSelectedComponents()" 
                            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
                        <i class="fas fa-object-group mr-2"></i>Group Components
                    </button>
                    <button onclick="mailBuilder.duplicateSelectedComponents()" 
                            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors">
                        <i class="fas fa-clone mr-2"></i>Duplicate All
                    </button>
                    <button onclick="mailBuilder.deleteSelectedComponents()" 
                            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors">
                        <i class="fas fa-trash mr-2"></i>Delete All
                    </button>
                </div>
            </div>
        `;

        this.propertiesPanel.classList.remove("hidden");
    }

    // Bulk Operations for Multi-Selected Components
    alignSelectedComponents(alignment) {
        this.selectedComponents.forEach((component) => {
            const firstChild = component.firstElementChild;
            if (firstChild) {
                firstChild.style.textAlign = alignment;
            }
        });
        this.saveState();
        this.showNotification(
            `${this.selectedComponents.size} components aligned ${alignment}`
        );
    }

    distributeSelectedComponents() {
        const components = Array.from(this.selectedComponents);
        if (components.length < 3) {
            this.showNotification(
                "Need at least 3 components to distribute",
                "error"
            );
            return;
        }

        // Sort components by their position
        components.sort((a, b) => {
            const aRect = a.getBoundingClientRect();
            const bRect = b.getBoundingClientRect();
            return aRect.top - bRect.top;
        });

        // Calculate equal spacing
        const firstRect = components[0].getBoundingClientRect();
        const lastRect =
            components[components.length - 1].getBoundingClientRect();
        const totalHeight = lastRect.top - firstRect.top;
        const spacing = totalHeight / (components.length - 1);

        // Apply distribution
        for (let i = 1; i < components.length - 1; i++) {
            const targetTop = firstRect.top + spacing * i;
            components[i].style.marginTop = `${
                targetTop - components[i].getBoundingClientRect().top
            }px`;
        }

        this.saveState();
        this.showNotification(
            `${components.length} components distributed evenly`
        );
    }

    groupSelectedComponents() {
        if (this.selectedComponents.size < 2) {
            this.showNotification(
                "Need at least 2 components to group",
                "error"
            );
            return;
        }

        // Create group container
        const groupContainer = document.createElement("div");
        groupContainer.className = "email-component component-group";
        groupContainer.dataset.componentType = "group";
        groupContainer.style.cssText = `
            border: 2px dashed #3b82f6;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
            background: rgba(59, 130, 246, 0.05);
            position: relative;
        `;

        // Add group header
        const groupHeader = document.createElement("div");
        groupHeader.className = "group-header";
        groupHeader.style.cssText = `
            position: absolute;
            top: -10px;
            left: 10px;
            background: #3b82f6;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
        `;
        groupHeader.textContent = `Group (${this.selectedComponents.size} items)`;
        groupContainer.appendChild(groupHeader);

        // Move selected components into group
        const firstComponent = Array.from(this.selectedComponents)[0];
        this.canvas.insertBefore(groupContainer, firstComponent);

        this.selectedComponents.forEach((component) => {
            groupContainer.appendChild(component);
            component.classList.remove("multi-selected");
        });

        this.selectedComponents.clear();
        this.selectElement(groupContainer);
        this.saveState();
        this.showNotification("Components grouped successfully!");
    }

    duplicateSelectedComponents() {
        const duplicates = [];

        this.selectedComponents.forEach((component) => {
            const duplicate = component.cloneNode(true);
            duplicate.classList.remove("selected", "multi-selected");
            duplicate.id = `component-${Date.now()}-${Math.random()
                .toString(36)
                .substr(2, 9)}`;

            // Add event listeners
            duplicate.addEventListener("click", (e) => {
                e.stopPropagation();
                this.selectElement(duplicate);
            });

            // Make duplicated component draggable
            this.makeComponentDraggable(duplicate);

            duplicates.push(duplicate);
        });

        // Insert duplicates after the last selected component
        const lastComponent = Array.from(this.selectedComponents).pop();
        duplicates.forEach((duplicate) => {
            if (lastComponent.nextSibling) {
                this.canvas.insertBefore(duplicate, lastComponent.nextSibling);
            } else {
                this.canvas.appendChild(duplicate);
            }
        });

        this.clearSelection();
        this.saveState();
        this.showNotification(
            `${duplicates.length} components duplicated successfully!`
        );
    }

    deleteSelectedComponents() {
        if (this.selectedComponents.size === 0) return;

        if (
            !confirm(
                `Are you sure you want to delete ${this.selectedComponents.size} components?`
            )
        ) {
            return;
        }

        const count = this.selectedComponents.size;
        this.selectedComponents.forEach((component) => {
            // Check if this component was inside a container
            const parentContainer = component.parentElement;
            component.remove();

            // Show placeholder text if container is now empty
            if (
                parentContainer &&
                parentContainer.classList.contains("droppable-container")
            ) {
                this.checkAndShowContainerPlaceholder(parentContainer);
            }
        });

        this.selectedComponents.clear();
        this.hidePropertiesPanel();
        this.saveState();
        this.showNotification(`${count} components deleted successfully!`);
    }

    checkAndShowContainerPlaceholder(container) {
        const hasComponents = container.querySelector(
            ".email-component, .nested-component"
        );
        const placeholder = container.querySelector(".placeholder-text");

        if (!hasComponents && placeholder) {
            placeholder.style.display = "block";
        }
    }

    // Enhanced method to add placeholder context
    addContainerClickTooltip(container) {
        // Skip if already set up
        if (container.dataset.tooltipAdded === "true") {
            return;
        }

        console.log("Setting up container:", container.className);

        container.title = "Drop components here or double-click to add content";
        container.style.cursor = "pointer";

        // Create unique identifier
        const containerId =
            "container-" +
            Date.now() +
            "-" +
            Math.random().toString(36).substr(2, 9);
        container.dataset.containerId = containerId;

        // Store original styles
        container.dataset.originalBorder = container.style.border || "";
        container.dataset.originalBackground =
            container.style.backgroundColor || "";

        // Remove any existing double-click handler
        if (container._dblClickHandler) {
            container.removeEventListener(
                "dblclick",
                container._dblClickHandler
            );
        }

        // Create and store the double-click handler
        container._dblClickHandler = (e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log("Double-click on container:", containerId);

            this.closeActiveQuickMenu();
            this.showQuickAddMenu(container, e);
        };

        // Add the event listener
        container.addEventListener("dblclick", container._dblClickHandler);

        // Add hover effects
        container.addEventListener("mouseenter", () => {
            if (!container.classList.contains("drop-highlight")) {
                container.style.border = "2px dashed #3b82f6";
                container.style.backgroundColor = "rgba(59, 130, 246, 0.02)";
            }
        });

        container.addEventListener("mouseleave", () => {
            if (!container.classList.contains("drop-highlight")) {
                container.style.border = container.dataset.originalBorder;
                container.style.backgroundColor =
                    container.dataset.originalBackground;
            }
        });

        // Mark as set up
        container.dataset.tooltipAdded = "true";
        console.log("✅ Container setup complete:", containerId);
    }

    // Immediate setup method that works synchronously
    setupContainersInElement(element) {
        console.log("🔧 Setting up containers in element:", element);

        // Find all droppable containers in this element
        const containers = element.querySelectorAll(".droppable-container");
        console.log(`Found ${containers.length} containers to setup`);

        // Also check if the element itself is a droppable container
        if (element.classList.contains("droppable-container")) {
            console.log("Element itself is droppable, adding to setup list");
            this.addContainerClickTooltip(element);
        }

        // Setup each container immediately
        containers.forEach((container, index) => {
            console.log(
                `Setting up container ${index + 1}/${containers.length}`
            );
            this.addContainerClickTooltip(container);
        });

        // Double-check: also setup the first child if it's droppable
        const firstChild = element.firstElementChild;
        if (
            firstChild &&
            firstChild.classList.contains("droppable-container")
        ) {
            console.log("First child is droppable, ensuring setup");
            this.addContainerClickTooltip(firstChild);
        }

        console.log("✅ Container setup complete for element");
    }

    closeActiveQuickMenu() {
        if (
            this.activeQuickMenu &&
            document.body.contains(this.activeQuickMenu)
        ) {
            document.body.removeChild(this.activeQuickMenu);
        }
        this.activeQuickMenu = null;

        if (this.globalMenuRemover) {
            document.removeEventListener("click", this.globalMenuRemover);
            this.globalMenuRemover = null;
        }
    }

    showQuickAddMenu(container, event) {
        console.log(
            "Showing menu for container:",
            container.dataset.containerId
        );

        this.closeActiveQuickMenu();

        const quickMenu = document.createElement("div");
        quickMenu.className = "quick-add-menu";
        quickMenu.style.cssText = `
      position: fixed;
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      padding: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
      z-index: 10000;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
      min-width: 280px;
      max-height: 350px;
      overflow-y: auto;
    `;

        const commonComponents = [
            "heading",
            "text",
            "button",
            "image",
            "signature",
            "divider",
            "spacer",
            "list",
            "social",
            "card",
            "table",
            "container",
        ];

        commonComponents.forEach((componentType) => {
            const button = document.createElement("button");
            button.className = "quick-add-btn";
            button.style.cssText = `
        padding: 8px 6px;
        border: 1px solid #e5e7eb;
        background: #f9fafb;
        border-radius: 6px;
        cursor: pointer;
        font-size: 10px;
        transition: all 0.2s;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        min-height: 50px;
        text-align: center;
      `;

            button.innerHTML = `
        <i class="${this.getComponentIcon(
            componentType
        )}" style="font-size: 14px; color: #6b7280;"></i>
        <span style="color: #374151; font-weight: 500;">${componentType}</span>
      `;

            button.addEventListener("click", (e) => {
                e.stopPropagation();
                console.log(`Adding ${componentType} to container`);

                this.addComponentToContainer(componentType, container);
                this.closeActiveQuickMenu();
            });

            button.addEventListener("mouseenter", () => {
                button.style.background = "#3b82f6";
                button.style.color = "white";
                button.querySelector("i").style.color = "white";
                button.querySelector("span").style.color = "white";
            });

            button.addEventListener("mouseleave", () => {
                button.style.background = "#f9fafb";
                button.style.color = "#374151";
                button.querySelector("i").style.color = "#6b7280";
                button.querySelector("span").style.color = "#374151";
            });

            quickMenu.appendChild(button);
        });

        // Position menu
        const menuX = Math.min(event.clientX - 100, window.innerWidth - 300);
        const menuY = Math.min(event.clientY - 50, window.innerHeight - 200);

        quickMenu.style.left = Math.max(10, menuX) + "px";
        quickMenu.style.top = Math.max(10, menuY) + "px";

        document.body.appendChild(quickMenu);
        this.activeQuickMenu = quickMenu;

        // Close menu on outside click
        this.globalMenuRemover = (e) => {
            if (
                this.activeQuickMenu &&
                !this.activeQuickMenu.contains(e.target)
            ) {
                this.closeActiveQuickMenu();
            }
        };

        setTimeout(() => {
            document.addEventListener("click", this.globalMenuRemover);
        }, 100);
    }
    // Enhanced method to setup all containers in canvas
    setupAllContainersInCanvas() {
        console.log("🔧 Setting up all containers in canvas...");

        const allContainers = this.canvas.querySelectorAll(
            ".droppable-container"
        );
        console.log(`Found ${allContainers.length} droppable containers`);

        let setupCount = 0;
        allContainers.forEach((container, index) => {
            console.log(
                `Processing container ${index + 1}:`,
                container.className
            );

            if (container.dataset.tooltipAdded !== "true") {
                console.log(`Setting up container ${index + 1}`);
                this.addContainerClickTooltip(container);
                setupCount++;
            } else {
                console.log(`Container ${index + 1} already set up`);
            }
        });

        console.log(
            `✅ Setup complete: ${setupCount} new containers configured`
        );

        if (setupCount > 0) {
            this.showNotification(
                `${setupCount} containers configured for interaction`
            );
        }
    }

    repositionComponentToContainer(component, targetContainer) {
        if (!component || !targetContainer) return;

        try {
            // Check if the component is being moved to a different container
            const currentParent = component.parentElement;

            // Remove from current location
            const originalParent = component.parentElement;
            component.remove();

            // Show placeholder in original container if it becomes empty
            if (
                originalParent &&
                originalParent.classList.contains("droppable-container")
            ) {
                this.checkAndShowContainerPlaceholder(originalParent);
            }

            // Hide placeholder in target container
            const placeholder =
                targetContainer.querySelector(".placeholder-text");
            if (placeholder) {
                placeholder.style.display = "none";
            }

            // Add to new container
            targetContainer.appendChild(component);

            // Reset styles
            component.style.opacity = "";
            component.style.transform = "";

            this.selectElement(component);
            this.saveState();
            this.showNotification("Component repositioned successfully!");
        } catch (error) {
            console.error("Error repositioning component:", error);
            this.showNotification("Error repositioning component", "error");
        }
    }

    makeComponentDraggable(element) {
        // Make components draggable for repositioning
        element.draggable = true;
        element.style.cursor = "move";

        element.addEventListener("dragstart", (e) => {
            e.stopPropagation();
            this.draggedComponent = element;
            this.isDraggingFromCanvas = true;

            // Add visual feedback
            element.style.opacity = "0.5";
            element.style.transform = "rotate(2deg) scale(0.95)";

            // Set drag data
            e.dataTransfer.setData("text/plain", "component-reposition");
            e.dataTransfer.setData("source", "canvas-component");
            e.dataTransfer.effectAllowed = "move";

            this.showNotification("Drag to reposition component", "info");
            

        });

        element.addEventListener("dragend", (e) => {
            // Reset visual feedback
            element.style.opacity = "";
            element.style.transform = "";

            this.draggedComponent = null;
            this.isDraggingFromCanvas = false;
        });
    }

    setupFreeDragging(element) {
        // Set up free dragging for stickers and uploaded images
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let initialLeft = 0;
        let initialTop = 0;

        const firstChild = element.firstElementChild;
        if (!firstChild) return;

        // Make the element freely draggable
        firstChild.style.position = "absolute";
        firstChild.style.cursor = "move";

        const handleMouseDown = (e) => {
            e.preventDefault();
            e.stopPropagation();

            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;

            const rect = firstChild.getBoundingClientRect();
            const canvasRect = this.canvas.getBoundingClientRect();
            initialLeft = rect.left - canvasRect.left;
            initialTop = rect.top - canvasRect.top;

            firstChild.style.zIndex = "1000";
            firstChild.style.opacity = "0.8";

            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);

            this.showNotification("Drag to position", "info");
        };

        const handleMouseMove = (e) => {
            if (!isDragging) return;

            e.preventDefault();

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            let newLeft = initialLeft + deltaX;
            let newTop = initialTop + deltaY;

            // Apply snap to grid if enabled
            if (this.snapEnabled) {
                const gridSize = 20;
                newLeft = Math.round(newLeft / gridSize) * gridSize;
                newTop = Math.round(newTop / gridSize) * gridSize;
            }

            // Keep within canvas bounds
            const canvasRect = this.canvas.getBoundingClientRect();
            const elementRect = firstChild.getBoundingClientRect();

            newLeft = Math.max(
                0,
                Math.min(newLeft, canvasRect.width - elementRect.width)
            );
            newTop = Math.max(
                0,
                Math.min(newTop, canvasRect.height - elementRect.height)
            );

            firstChild.style.left = newLeft + "px";
            firstChild.style.top = newTop + "px";
        };

        const handleMouseUp = (e) => {
            if (!isDragging) return;

            isDragging = false;
            firstChild.style.zIndex = "";
            firstChild.style.opacity = "";

            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);

            this.saveState();
            this.showNotification("Position updated");
        };

        firstChild.addEventListener("mousedown", handleMouseDown);
    }

    setupHeadingFunctionality(element) {
        // Set up enhanced heading functionality
        const headingElement = element.querySelector(
            ".email-heading, .draggable-heading"
        );
        if (!headingElement) return;

        // Set up dragging within container
        this.setupHeadingDragging(element, headingElement);

        // Set up inline editing
        this.setupHeadingInlineEditing(headingElement);

        // Set up hover effects
        this.setupHeadingHoverEffects(headingElement);
    }

    setupHeadingDragging(wrapperElement, headingElement) {
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let initialTransform = { x: 0, y: 0 };
        let dragStarted = false;

        // Add special drag handle indicator
        const dragHandle = document.createElement("div");
        dragHandle.className = "heading-drag-handle";
        dragHandle.style.cssText = `
            position: absolute;
            top: -8px;
            right: -8px;
            width: 20px;
            height: 20px;
            background: #3b82f6;
            border: 2px solid white;
            border-radius: 50%;
            cursor: grab;
            opacity: 0;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            color: white;
            z-index: 10;
            font-family: monospace;
            font-weight: bold;
        `;
        dragHandle.innerHTML = "⋮⋮";
        dragHandle.title = "Drag to reposition heading";

        // Position the wrapper element relatively so drag handle can be positioned
        wrapperElement.style.position = "relative";
        wrapperElement.appendChild(dragHandle);

        const handleDragStart = (e) => {
            // Prevent text editing during drag
            headingElement.contentEditable = "false";

            e.preventDefault();
            e.stopPropagation();

            isDragging = true;
            dragStarted = false;
            startX = e.clientX;
            startY = e.clientY;

            // Get current transform values
            const computedStyle = window.getComputedStyle(headingElement);
            const transform = computedStyle.transform;

            if (transform && transform !== "none") {
                const matrix = new DOMMatrix(transform);
                initialTransform = { x: matrix.m41, y: matrix.m42 };
            } else {
                initialTransform = { x: 0, y: 0 };
            }

            // Visual feedback for drag handle
            dragHandle.style.cursor = "grabbing";
            dragHandle.style.background = "#2563eb";
            dragHandle.style.transform = "scale(1.1)";

            // Add global event listeners
            document.addEventListener("mousemove", handleDragMove);
            document.addEventListener("mouseup", handleDragEnd);

            // Disable text selection during drag
            document.body.style.userSelect = "none";

            this.showNotification(
                "Dragging heading - move mouse to reposition",
                "info"
            );
        };

        const handleDragMove = (e) => {
            if (!isDragging) return;

            e.preventDefault();

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            // Only start visual dragging after minimum movement threshold
            if (
                !dragStarted &&
                (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3)
            ) {
                dragStarted = true;

                // Add visual feedback to heading
                headingElement.style.zIndex = "1000";
                headingElement.style.opacity = "0.8";
                headingElement.style.border = "2px dashed #3b82f6";
                headingElement.style.boxShadow =
                    "0 8px 25px rgba(59, 130, 246, 0.3)";

                // Highlight the parent container to show positioning area
                let parentContainer = wrapperElement.parentElement;
                while (
                    parentContainer &&
                    !parentContainer.classList.contains(
                        "droppable-container"
                    ) &&
                    !parentContainer.classList.contains("email-canvas")
                ) {
                    parentContainer = parentContainer.parentElement;
                }

                if (
                    parentContainer &&
                    parentContainer.classList.contains("droppable-container")
                ) {
                    parentContainer.classList.add("heading-drag-active");
                }
            }

            if (dragStarted) {
                let newX = initialTransform.x + deltaX;
                let newY = initialTransform.y + deltaY;

                // Apply snap to grid if enabled
                if (this.snapEnabled) {
                    const gridSize = 20;
                    newX = Math.round(newX / gridSize) * gridSize;
                    newY = Math.round(newY / gridSize) * gridSize;
                }

                // Find the correct parent droppable container
                let parentContainer = wrapperElement.parentElement;
                while (
                    parentContainer &&
                    !parentContainer.classList.contains(
                        "droppable-container"
                    ) &&
                    !parentContainer.classList.contains("email-canvas")
                ) {
                    parentContainer = parentContainer.parentElement;
                }

                if (parentContainer) {
                    const containerRect =
                        parentContainer.getBoundingClientRect();
                    const headingRect = headingElement.getBoundingClientRect();

                    // Calculate container's inner dimensions (excluding padding/borders)
                    const containerStyle =
                        window.getComputedStyle(parentContainer);
                    const paddingLeft =
                        parseFloat(containerStyle.paddingLeft) || 0;
                    const paddingRight =
                        parseFloat(containerStyle.paddingRight) || 0;
                    const paddingTop =
                        parseFloat(containerStyle.paddingTop) || 0;
                    const paddingBottom =
                        parseFloat(containerStyle.paddingBottom) || 0;

                    const availableWidth =
                        containerRect.width - paddingLeft - paddingRight;
                    const availableHeight =
                        containerRect.height - paddingTop - paddingBottom;

                    // Calculate max bounds (keep heading within container)
                    const maxX = availableWidth - headingRect.width - 10;
                    const maxY = availableHeight - headingRect.height - 10;

                    // Apply boundary constraints
                    newX = Math.max(paddingLeft - 5, Math.min(newX, maxX));
                    newY = Math.max(paddingTop - 5, Math.min(newY, maxY));
                } else {
                    // Fallback to basic constraints if no container found
                    newX = Math.max(-10, Math.min(newX, 400));
                    newY = Math.max(-10, Math.min(newY, 300));
                }

                // Apply transform for smooth positioning
                headingElement.style.transform = `translate(${newX}px, ${newY}px)`;
            }
        };

        const handleDragEnd = (e) => {
            if (!isDragging) return;

            isDragging = false;

            // Re-enable text editing
            headingElement.contentEditable = "true";

            // Reset visual feedback
            headingElement.style.zIndex = "";
            headingElement.style.opacity = "";
            headingElement.style.border = "1px dashed transparent";
            headingElement.style.boxShadow = "";

            // Remove container highlight
            let parentContainer = wrapperElement.parentElement;
            while (
                parentContainer &&
                !parentContainer.classList.contains("droppable-container") &&
                !parentContainer.classList.contains("email-canvas")
            ) {
                parentContainer = parentContainer.parentElement;
            }

            if (
                parentContainer &&
                parentContainer.classList.contains("droppable-container")
            ) {
                parentContainer.classList.remove("heading-drag-active");
            }

            // Reset drag handle
            dragHandle.style.cursor = "grab";
            dragHandle.style.background = "#3b82f6";
            dragHandle.style.transform = "scale(1)";

            // Re-enable text selection
            document.body.style.userSelect = "";

            // Remove global event listeners
            document.removeEventListener("mousemove", handleDragMove);
            document.removeEventListener("mouseup", handleDragEnd);

            if (dragStarted) {
                this.saveState();
                this.showNotification("Heading repositioned successfully!");
            }

            dragStarted = false;
        };

        // Attach drag events to the drag handle only
        dragHandle.addEventListener("mousedown", handleDragStart);

        // Show/hide drag handle on hover
        wrapperElement.addEventListener("mouseenter", () => {
            dragHandle.style.opacity = "1";
        });

        wrapperElement.addEventListener("mouseleave", () => {
            if (!isDragging) {
                dragHandle.style.opacity = "0";
            }
        });

        // Prevent drag handle from interfering with text editing
        dragHandle.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        // Add keyboard shortcut for drag mode
        headingElement.addEventListener("keydown", (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "d") {
                e.preventDefault();
                dragHandle.style.opacity = "1";
                setTimeout(() => {
                    if (!isDragging) {
                        dragHandle.style.opacity = "0";
                    }
                }, 2000);
                this.showNotification(
                    "Drag handle highlighted! Use the blue circle to drag.",
                    "info"
                );
            }
        });
    }

    setupHeadingInlineEditing(headingElement) {
        // Enhanced inline editing functionality
        headingElement.addEventListener("focus", () => {
            headingElement.style.outline = "2px solid #3b82f6";
            headingElement.style.outlineOffset = "2px";
            headingElement.style.cursor = "text";

            // Clear placeholder text if it matches the placeholder
            const placeholder =
                headingElement.dataset.placeholder ||
                "Click to edit heading...";
            if (headingElement.textContent === placeholder) {
                headingElement.textContent = "";
            }
        });

        headingElement.addEventListener("blur", () => {
            headingElement.style.outline = "";
            headingElement.style.outlineOffset = "";
            headingElement.style.cursor = "text";

            // Restore placeholder if empty
            const placeholder =
                headingElement.dataset.placeholder || "Your Heading Here";
            if (headingElement.textContent.trim() === "") {
                headingElement.textContent = placeholder;
            }

            this.saveState();
        });

        // Handle click to focus (separate from drag)
        headingElement.addEventListener("click", (e) => {
            // Only focus if not dragging and not clicking drag handle
            if (!e.target.closest(".heading-drag-handle")) {
                headingElement.focus();

                // Select all text on click for easy editing
                const range = document.createRange();
                range.selectNodeContents(headingElement);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });

        // Prevent line breaks in headings
        headingElement.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                headingElement.blur(); // Exit editing mode
            }

            // Save on Ctrl+S
            if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                e.preventDefault();
                headingElement.blur();
                this.saveTemplate();
            }
        });

        // Update properties panel on text change
        headingElement.addEventListener("input", () => {
            // Update properties panel if this heading is selected
            if (headingElement.closest(".email-component.selected")) {
                setTimeout(
                    () =>
                        this.showPropertiesPanel(
                            headingElement.closest(".email-component")
                        ),
                    100
                );
            }
        });

        // Improve paste handling
        headingElement.addEventListener("paste", (e) => {
            e.preventDefault();

            // Get plain text from clipboard
            const text = (e.clipboardData || window.clipboardData).getData(
                "text/plain"
            );

            // Insert text without formatting and remove line breaks
            const cleanText = text.replace(/\r?\n|\r/g, " ").trim();
            document.execCommand("insertText", false, cleanText);
        });
    }

    setupHeadingHoverEffects(headingElement) {
        // Enhanced hover effects
        headingElement.addEventListener("mouseenter", () => {
            if (
                !headingElement.style.position ||
                headingElement.style.position === "static"
            ) {
                headingElement.style.transform = "translateY(-1px)";
                headingElement.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
            }
            headingElement.style.borderColor = "#93c5fd";
        });

        headingElement.addEventListener("mouseleave", () => {
            if (
                !headingElement.style.position ||
                headingElement.style.position === "static"
            ) {
                headingElement.style.transform = "";
                headingElement.style.boxShadow = "";
            }
            headingElement.style.borderColor = "transparent";
        });
    }

    setupTextFunctionality(element) {
        // Set up enhanced text editing functionality
        const textElement = element.querySelector(".email-text");
        if (!textElement) return;

        // Set up inline editing with line break support
        this.setupTextInlineEditing(textElement);

        // Set up hover effects
        this.setupTextHoverEffects(textElement);
    }

    setupTextInlineEditing(textElement) {
        // Enhanced text editing functionality with Enter key support
        textElement.addEventListener("focus", () => {
            textElement.style.outline = "2px solid #10b981";
            textElement.style.outlineOffset = "2px";
            textElement.style.borderColor = "#10b981";
            textElement.style.cursor = "text";

            // Clear placeholder text if it matches the placeholder
            const placeholder =
                textElement.dataset.placeholder || "Click to edit text...";
            if (textElement.textContent.trim() === placeholder) {
                textElement.innerHTML = "";
            }
        });

        textElement.addEventListener("blur", () => {
            textElement.style.outline = "";
            textElement.style.outlineOffset = "";
            textElement.style.borderColor = "transparent";
            textElement.style.cursor = "text";

            // Restore placeholder if empty
            const placeholder =
                textElement.dataset.placeholder || "Write your text here...";
            if (textElement.textContent.trim() === "") {
                textElement.innerHTML = placeholder;
                textElement.style.color = "#9ca3af";
                textElement.style.fontStyle = "italic";
            } else {
                textElement.style.color = "";
                textElement.style.fontStyle = "";
            }

            this.saveState();
        });

        // Handle click to focus
        textElement.addEventListener("click", (e) => {
            textElement.focus();

            // If clicking on placeholder text, select all
            const placeholder =
                textElement.dataset.placeholder || "Click to edit text...";
            if (textElement.textContent.trim() === placeholder) {
                const range = document.createRange();
                range.selectNodeContents(textElement);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });

        // Handle keyboard events - ALLOW Enter for line breaks
        textElement.addEventListener("keydown", (e) => {
            // Allow Enter key for line breaks (unlike headings)
            if (e.key === "Enter") {
                // Let the default behavior happen (create line breaks)
                // We can optionally add some custom behavior here
            }

            // Save on Ctrl+S
            if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                e.preventDefault();
                textElement.blur();
                this.saveTemplate();
            }
        });

        // Update properties panel on text change
        textElement.addEventListener("input", () => {
            // Update properties panel if this text is selected
            if (textElement.closest(".email-component.selected")) {
                setTimeout(
                    () =>
                        this.showPropertiesPanel(
                            textElement.closest(".email-component")
                        ),
                    100
                );
            }
        });

        // Improve paste handling - preserve line breaks
        textElement.addEventListener("paste", (e) => {
            e.preventDefault();

            // Get text from clipboard (preserving line breaks)
            const text = (e.clipboardData || window.clipboardData).getData(
                "text/plain"
            );

            // Convert line breaks to HTML line breaks
            const htmlText = text.replace(/\r?\n/g, "<br>");

            // Insert HTML with line breaks
            document.execCommand("insertHTML", false, htmlText);
        });
    }

    setupTextHoverEffects(textElement) {
        // Enhanced hover effects for text
        textElement.addEventListener("mouseenter", () => {
            textElement.style.backgroundColor = "rgba(16, 185, 129, 0.05)";
            textElement.style.borderColor = "#93f3e3";
        });

        textElement.addEventListener("mouseleave", () => {
            if (!textElement.matches(":focus")) {
                textElement.style.backgroundColor = "";
                textElement.style.borderColor = "transparent";
            }
        });
    }

    setupSignatureFunctionality(element) {
        // Set up enhanced signature editing functionality
        const signatureElement = element.querySelector(".signature-content");
        if (!signatureElement) return;

        // Set up inline editing with line break support (like text)
        this.setupSignatureInlineEditing(signatureElement);

        // Set up hover effects
        this.setupSignatureHoverEffects(element, signatureElement);
    }

    setupSignatureInlineEditing(signatureElement) {
        // Enhanced signature editing functionality
        signatureElement.addEventListener("focus", () => {
            signatureElement.style.outline = "2px solid #f59e0b";
            signatureElement.style.outlineOffset = "2px";
            signatureElement.style.backgroundColor = "rgba(245, 158, 11, 0.05)";
            signatureElement.style.cursor = "text";
            signatureElement.style.borderRadius = "4px";
            signatureElement.style.padding = "8px";

            // Clear placeholder if it matches
            const placeholder = signatureElement.dataset.placeholder || "";
            if (signatureElement.innerHTML === placeholder) {
                signatureElement.innerHTML = "";
            }
        });

        signatureElement.addEventListener("blur", () => {
            signatureElement.style.outline = "";
            signatureElement.style.outlineOffset = "";
            signatureElement.style.backgroundColor = "";
            signatureElement.style.padding = "";
            signatureElement.style.borderRadius = "";

            // Restore placeholder if empty
            const placeholder =
                signatureElement.dataset.placeholder ||
                "Best regards,<br>Your Name<br>Your Title<br>Company Name<br>Email: your.email@company.com<br>Phone: +1 (555) 123-4567";
            if (signatureElement.textContent.trim() === "") {
                signatureElement.innerHTML = placeholder;
                signatureElement.style.color = "#9ca3af";
                signatureElement.style.fontStyle = "italic";
            } else {
                signatureElement.style.color = "";
                signatureElement.style.fontStyle = "";
            }

            this.saveState();
        });

        // Handle click to focus
        signatureElement.addEventListener("click", (e) => {
            signatureElement.focus();

            // If clicking on placeholder, select all
            const placeholder = signatureElement.dataset.placeholder || "";
            if (signatureElement.innerHTML === placeholder) {
                const range = document.createRange();
                range.selectNodeContents(signatureElement);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });

        // Handle keyboard events - ALLOW Enter for line breaks
        signatureElement.addEventListener("keydown", (e) => {
            // Allow Enter key for line breaks
            if (e.key === "Enter") {
                // Let the default behavior happen (create line breaks)
            }

            // Save on Ctrl+S
            if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                e.preventDefault();
                signatureElement.blur();
                this.saveTemplate();
            }
        });

        // Update properties panel on text change
        signatureElement.addEventListener("input", () => {
            if (signatureElement.closest(".email-component.selected")) {
                setTimeout(
                    () =>
                        this.showPropertiesPanel(
                            signatureElement.closest(".email-component")
                        ),
                    100
                );
            }
        });

        // Improve paste handling - preserve line breaks
        signatureElement.addEventListener("paste", (e) => {
            e.preventDefault();

            // Get text from clipboard (preserving line breaks)
            const text = (e.clipboardData || window.clipboardData).getData(
                "text/plain"
            );

            // Convert line breaks to HTML line breaks
            const htmlText = text.replace(/\r?\n/g, "<br>");

            // Insert HTML with line breaks
            document.execCommand("insertHTML", false, htmlText);
        });
    }

    setupSignatureHoverEffects(wrapperElement, signatureElement) {
        // Enhanced hover effects for signature
        const signatureCreatorBtn = wrapperElement.querySelector(
            ".signature-creator-btn"
        );

        wrapperElement.addEventListener("mouseenter", () => {
            wrapperElement.style.backgroundColor = "rgba(245, 158, 11, 0.02)";
            wrapperElement.style.borderColor = "#fed7aa";
            wrapperElement.style.borderRadius = "4px";
            wrapperElement.style.border = "1px dashed #fed7aa";

            // Show signature creator button
            if (signatureCreatorBtn) {
                signatureCreatorBtn.style.opacity = "1";
            }
        });

        wrapperElement.addEventListener("mouseleave", () => {
            if (!signatureElement.matches(":focus")) {
                wrapperElement.style.backgroundColor = "";
                wrapperElement.style.borderColor = "";
                wrapperElement.style.border = "";
                wrapperElement.style.borderRadius = "";

                // Hide signature creator button
                if (signatureCreatorBtn) {
                    signatureCreatorBtn.style.opacity = "0";
                }
            }
        });

        // Set up signature creator button functionality
        if (signatureCreatorBtn) {
            signatureCreatorBtn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.currentSignatureElement = wrapperElement;
                this.openSignatureCreator();
            });
        }
    }

    setupImageUpload(element) {
        // Set up image upload functionality
        const imgElement = element.querySelector("img");
        if (!imgElement) return;

        // Create hidden file input
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.style.display = "none";
        document.body.appendChild(fileInput);

        // Add click handler to trigger file selection
        const clickHandler = () => {
            fileInput.click();
        };

        imgElement.addEventListener("click", clickHandler);

        // Handle file selection
        fileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Validate file type
            if (!file.type.startsWith("image/")) {
                this.showNotification(
                    "Please select a valid image file",
                    "error"
                );
                return;
            }

            // Validate file size (limit to 5MB)
            if (file.size > 5 * 1024 * 1024) {
                this.showNotification(
                    "File size must be less than 5MB",
                    "error"
                );
                return;
            }

            // Read file as data URL
            const reader = new FileReader();
            reader.onload = (event) => {
                imgElement.src = event.target.result;
                imgElement.alt = file.name;

                // Add animation effect
                imgElement.classList.add("animate");
                setTimeout(() => {
                    imgElement.classList.remove("animate");
                }, 600);

                this.saveState();
                this.showNotification(
                    `Image "${file.name}" uploaded successfully!`
                );
            };

            reader.onerror = () => {
                this.showNotification("Error reading file", "error");
            };

            reader.readAsDataURL(file);
        });

        // Add upload indicator
        const uploadIndicator = document.createElement("div");
        uploadIndicator.className = "upload-indicator";
        uploadIndicator.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            background: rgba(59, 130, 246, 0.9);
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 600;
            opacity: 0;
            transition: opacity 0.2s ease;
            pointer-events: none;
            z-index: 10;
        `;
        uploadIndicator.textContent = "Click to upload";
        element.appendChild(uploadIndicator);

        // Show indicator on hover
        element.addEventListener("mouseenter", () => {
            uploadIndicator.style.opacity = "1";
        });

        element.addEventListener("mouseleave", () => {
            uploadIndicator.style.opacity = "0";
        });
    }

    // Signature Creator Methods
    openSignatureCreator() {
        document
            .getElementById("signature-creator-modal")
            .classList.remove("hidden");
        this.initializeSignatureCreator();
    }

    initializeSignatureCreator() {
        // Set up tabs
        this.setupSignatureTabs();

        // Set up drawing canvas
        this.setupDrawingCanvas();

        // Set up image upload
        this.setupSignatureImageUpload();

        // Set up typed signature
        this.setupTypedSignature();

        // Set up save functionality
        this.setupSignatureSave();
    }

    setupSignatureTabs() {
        const tabs = document.querySelectorAll(".tab-button");
        const contents = document.querySelectorAll(".tab-content");

        tabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                // Remove active class from all tabs
                tabs.forEach((t) => {
                    t.classList.remove("active");
                    t.classList.add("bg-gray-200", "text-gray-700");
                    t.classList.remove("bg-blue-600", "text-white");
                });

                // Add active class to clicked tab
                tab.classList.add("active");
                tab.classList.remove("bg-gray-200", "text-gray-700");
                tab.classList.add("bg-blue-600", "text-white");

                // Hide all content
                contents.forEach((content) => content.classList.add("hidden"));

                // Show corresponding content
                const contentId = tab.id.replace("-tab", "-content");
                document.getElementById(contentId).classList.remove("hidden");
            });
        });
    }

    setupDrawingCanvas() {
        const canvas = document.getElementById("signature-canvas");
        const ctx = canvas.getContext("2d");
        const clearBtn = document.getElementById("clear-signature");
        const penSizeInput = document.getElementById("pen-size");
        const penSizeValue = document.getElementById("pen-size-value");

        let drawing = false;
        let lastX = 0;
        let lastY = 0;

        // Set canvas properties
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;

        // Update pen size
        penSizeInput.addEventListener("input", () => {
            ctx.lineWidth = penSizeInput.value;
            penSizeValue.textContent = penSizeInput.value + "px";
        });

        // Clear canvas
        clearBtn.addEventListener("click", () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });

        // Mouse events
        canvas.addEventListener("mousedown", (e) => {
            drawing = true;
            const rect = canvas.getBoundingClientRect();
            lastX = e.clientX - rect.left;
            lastY = e.clientY - rect.top;
        });

        canvas.addEventListener("mousemove", (e) => {
            if (!drawing) return;

            const rect = canvas.getBoundingClientRect();
            const currentX = e.clientX - rect.left;
            const currentY = e.clientY - rect.top;

            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(currentX, currentY);
            ctx.stroke();

            lastX = currentX;
            lastY = currentY;
        });

        canvas.addEventListener("mouseup", () => {
            drawing = false;
        });

        canvas.addEventListener("mouseout", () => {
            drawing = false;
        });

        // Touch events for mobile
        canvas.addEventListener("touchstart", (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            drawing = true;
            lastX = touch.clientX - rect.left;
            lastY = touch.clientY - rect.top;
        });

        canvas.addEventListener("touchmove", (e) => {
            e.preventDefault();
            if (!drawing) return;

            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            const currentX = touch.clientX - rect.left;
            const currentY = touch.clientY - rect.top;

            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(currentX, currentY);
            ctx.stroke();

            lastX = currentX;
            lastY = currentY;
        });

        canvas.addEventListener("touchend", (e) => {
            e.preventDefault();
            drawing = false;
        });
    }

    setupSignatureImageUpload() {
        const uploadBtn = document.getElementById("upload-signature-btn");
        const fileInput = document.getElementById("signature-file-input");
        const preview = document.getElementById("uploaded-signature-preview");
        const previewImg = document.getElementById("uploaded-signature-img");

        uploadBtn.addEventListener("click", () => {
            fileInput.click();
        });

        fileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Validate file type
            if (!file.type.startsWith("image/")) {
                this.showNotification(
                    "Please select a valid image file",
                    "error"
                );
                return;
            }

            // Validate file size (limit to 2MB)
            if (file.size > 2 * 1024 * 1024) {
                this.showNotification(
                    "File size must be less than 2MB",
                    "error"
                );
                return;
            }

            // Read and preview file
            const reader = new FileReader();
            reader.onload = (event) => {
                previewImg.src = event.target.result;
                preview.classList.remove("hidden");
                this.uploadedSignatureData = event.target.result;
            };

            reader.onerror = () => {
                this.showNotification("Error reading file", "error");
            };

            reader.readAsDataURL(file);
        });
    }

    setupTypedSignature() {
        const nameInput = document.getElementById("typed-signature");
        const fontSelect = document.getElementById("signature-font");
        const preview = document.getElementById("typed-signature-preview");

        const updatePreview = () => {
            const name = nameInput.value.trim();
            const font = fontSelect.value;

            if (name) {
                preview.innerHTML = `<span class="signature-font-preview" style="font-family: ${font}; font-size: 28px; color: #1f2937;">${name}</span>`;
            } else {
                preview.innerHTML =
                    '<span class="text-gray-400">Preview will appear here</span>';
            }
        };

        nameInput.addEventListener("input", updatePreview);
        fontSelect.addEventListener("change", updatePreview);

        // Initial update
        updatePreview();
    }

    setupSignatureSave() {
        const saveBtn = document.getElementById("save-signature");

        saveBtn.addEventListener("click", () => {
            const activeTab = document.querySelector(".tab-button.active").id;

            switch (activeTab) {
                case "draw-signature-tab":
                    this.saveDrawnSignature();
                    break;
                case "upload-signature-tab":
                    this.saveUploadedSignature();
                    break;
                case "type-signature-tab":
                    this.saveTypedSignature();
                    break;
            }
        });
    }

    saveDrawnSignature() {
        const canvas = document.getElementById("signature-canvas");
        const ctx = canvas.getContext("2d");

        // Check if canvas has content
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const hasContent = imageData.data.some((channel) => channel !== 0);

        if (!hasContent) {
            this.showNotification("Please draw your signature first", "error");
            return;
        }

        // Convert canvas to image
        const signatureDataUrl = canvas.toDataURL("image/png");
        this.insertSignatureImage(signatureDataUrl);
    }

    saveUploadedSignature() {
        if (!this.uploadedSignatureData) {
            this.showNotification(
                "Please upload a signature image first",
                "error"
            );
            return;
        }

        this.insertSignatureImage(this.uploadedSignatureData);
    }

    saveTypedSignature() {
        const nameInput = document.getElementById("typed-signature");
        const fontSelect = document.getElementById("signature-font");

        const name = nameInput.value.trim();
        const font = fontSelect.value;

        if (!name) {
            this.showNotification("Please enter your name first", "error");
            return;
        }

        this.insertTypedSignature(name, font);
    }

    insertSignatureImage(imageDataUrl) {
        if (!this.currentSignatureElement) return;

        const signatureContent =
            this.currentSignatureElement.querySelector(".signature-content");
        if (!signatureContent) return;

        // Create signature image HTML
        const signatureImageHtml = `
            <div class="signature-image-container" style="margin: 10px 0;">
                <img src="${imageDataUrl}" alt="Digital Signature" style="max-width: 200px; height: auto; display: block;">
            </div>
        `;

        // Insert the signature image at the end of the signature content
        signatureContent.insertAdjacentHTML("beforeend", signatureImageHtml);

        this.closeSignatureCreator();
        this.saveState();
        this.showNotification("Digital signature added successfully!");
    }

    insertTypedSignature(name, font) {
        if (!this.currentSignatureElement) return;

        const signatureContent =
            this.currentSignatureElement.querySelector(".signature-content");
        if (!signatureContent) return;

        // Create typed signature HTML
        const typedSignatureHtml = `
            <div class="typed-signature-container" style="margin: 10px 0;">
                <div style="font-family: ${font}; font-size: 24px; color: #1f2937; font-weight: 600;">${name}</div>
            </div>
        `;

        // Insert the typed signature at the end of the signature content
        signatureContent.insertAdjacentHTML("beforeend", typedSignatureHtml);

        this.closeSignatureCreator();
        this.saveState();
        this.showNotification("Digital signature added successfully!");
    }

    closeSignatureCreator() {
        document
            .getElementById("signature-creator-modal")
            .classList.add("hidden");
        this.currentSignatureElement = null;
        this.uploadedSignatureData = null;

        // Reset forms
        document
            .getElementById("signature-canvas")
            .getContext("2d")
            .clearRect(0, 0, 500, 200);
        document.getElementById("signature-file-input").value = "";
        document
            .getElementById("uploaded-signature-preview")
            .classList.add("hidden");
        document.getElementById("typed-signature").value = "";
        document.getElementById("typed-signature-preview").innerHTML =
            '<span class="text-gray-400">Preview will appear here</span>';

        // Reset to first tab
        document.querySelectorAll(".tab-button").forEach((tab, index) => {
            tab.classList.toggle("active", index === 0);
            if (index === 0) {
                tab.classList.remove("bg-gray-200", "text-gray-700");
                tab.classList.add("bg-blue-600", "text-white");
            } else {
                tab.classList.add("bg-gray-200", "text-gray-700");
                tab.classList.remove("bg-blue-600", "text-white");
            }
        });

        document.querySelectorAll(".tab-content").forEach((content, index) => {
            content.classList.toggle("hidden", index !== 0);
        });
    }

    // Debug method to force setup all containers (helpful for testing)
    // Debug method to force setup all containers
    forceSetupAllContainers() {
        console.log(
            "🔧 Force setup called - this shouldn't be necessary anymore"
        );

        // Close any active menus
        this.closeActiveQuickMenu();

        const allContainers = this.canvas.querySelectorAll(
            ".droppable-container"
        );
        console.log(`Found ${allContainers.length} containers`);

        // Reset all containers
        allContainers.forEach((container) => {
      if (container._dblClickHandler) {
        container.removeEventListener("dblclick", container._dblClickHandler)
        delete container._dblClickHandler
      }
      container.dataset.tooltipAdded = "false"
    })

       // Setup all containers
    allContainers.forEach((container) => {
      this.addContainerClickTooltip(container)
    })

     this.showNotification("All containers reset and configured")

        // Setup all containers fresh
        setTimeout(() => {
            this.setupAllContainersInCanvas();
        }, 100);
    }
}

// Initialize the mail template builder when the page loads
document.addEventListener("DOMContentLoaded", function () {
    window.mailBuilder = new MailTemplateBuilder();
});
