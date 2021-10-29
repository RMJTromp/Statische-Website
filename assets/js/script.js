const $ = (selector, attributes = {}) => {
    if(selector.startsWith("<") && selector.endsWith(">")) {
        const element = document.createElement(selector.substr(1, selector.length - 2));
        if(typeof attributes === "object" && !Array.isArray(attributes)) {
            Object.keys(attributes).forEach(key => {
                element.setAttribute(key, attributes[key]);
            })
        }
        return element;
    }
    return document.querySelector(selector);
}

document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;

    {
        // navigatie balk

        const navigation = $("nav#navigation");
        const menu = navigation.querySelector("a#menu");

        const fixHeader = () => {
            if(Math.ceil(window.pageYOffset) < navigation.offsetTop) navigation.classList.remove("sticky");
            else if(!navigation.classList.contains("sticky")) navigation.classList.add("sticky");
        };

        {
            // Voeg automatisch "sticky" class aan navigatiebalk toe wanneer de gebruiker voorbij de header scrollt
            if(body.getAttribute("page") === "home") {
                window.addEventListener("scroll", () => fixHeader());
                fixHeader();
            } else navigation.classList.add("sticky");
        }

        {
            // Menu openen wanneer de gebruiker op het hamburger-menu klikt
            const icon = menu.querySelector("i");
            menu.addEventListener("click", () => {
                if(navigation.classList.toggle("open")) {
                    body.style.overflow = "hidden";
                    icon.classList.remove("codicon-menu");
                    icon.classList.add("codicon-chrome-close");
                } else {
                    body.style.overflow = "";
                    icon.classList.remove("codicon-chrome-close");
                    icon.classList.add("codicon-menu");
                    fixHeader();
                }
            });
        }

        {
            // Scroll naar de volgende sectie wanneer de gebruiker op de chevron klikt
            if(body.hasAttribute("page") && body.getAttribute("page") === "home")
                $("body > section#header > i#scroll").addEventListener("click", () => window.scrollTo({top: navigation.offsetTop, behavior: "smooth"}));
        }

        {
            const icon = menu.querySelector("i");
            window.addEventListener("resize", () => {
                if(window.innerWidth >= 1250 && navigation.classList.contains("open")) {
                    navigation.classList.remove("open");
                    body.style.overflow = "";
                    icon.classList.remove("codicon-chrome-close");
                    icon.classList.add("codicon-menu");
                    fixHeader();
                }
            });
        }
    }

    {
        const bronAnchor = $("a#bronnen");
        if(bronAnchor) bronAnchor.addEventListener("click", () => $("x-modal#bronnen-modal").open());
    }
});